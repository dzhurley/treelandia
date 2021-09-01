import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { Feature, FeatureCollection, Properties } from '@turf/helpers';

const makeTileset = (target: string, source: string) => {
  const tileset = path.join(__dirname, `data/${target}.mbtiles`);
  console.log(`writing ${target} tileset`);
  spawnSync(
    'tippecanoe',
    ['-zg', '--force', '--layer', 'data-layer', '-o', tileset, source],
    { stdio: 'inherit' },
  );
};

const makeTreeTilesets = (prefix: string, collections: FeatureCollection[]) => {
  collections.forEach((data: FeatureCollection, index: number) => {
    const name = `trees_${prefix}_${index}`;
    const source = path.join(__dirname, `data/${name}.geojson`);
    fs.writeFileSync(source, JSON.stringify(data), 'utf8');
    makeTileset(name, source);
  });
};

const ALLOWED_EQUITY_PROPS = [
  // the blockgroup id
  'geoid',
  // the total population of the block group
  'total_pop',
  // the percent of people in poverty inside the blockgroup
  'pctpov',
  // the percent of people of color inside the block group
  'pctpoc',
  // the unemployment rate inside of the block group
  'unemplrate',
  // the median household income of the block group
  'medhhinc',
  // the area of the blockgroup in square kilometers
  'area',
  // the average temperature of the blockgroup on a hot summer's day
  'avg_temp',
  // the density of the blockgroup (total population over area)
  'bgpopdense',
  // the self reported physical health challenges of the people in the block group (a percentage)
  'phys_hlth',
  //  the self reported mental health challenges of people in the block group (a percentage)
  'ment_hlth',
  // the self reported asthma challenges of people in the block group (a percentage)
  'asthma',
  // the self reported male coronary heart challenges of people in the block group (a percentage)
  'core_m',
  // the self reported female coronary heart challenges of people in the block group (a percentage)
  'core_w',
  // the normalized total coronary challenges of people in the block group
  'core_norm',
  // the normalized health index of the block group
  'healthnorm',
  // the tree equity score of the block group
  'tes',
];

const parseEquity = (data: FeatureCollection): FeatureCollection => {
  const features = data.features.reduce((blocks: Feature[], block: Feature) => {
    if (block.properties?.incorpname === 'Portland') {
      const properties = Object.entries(block.properties).reduce(
        (properties, [property, value]) => {
          if (ALLOWED_EQUITY_PROPS.includes(property)) {
            properties[property] = value;
          }
          return properties;
        },
        {} as { [name: string]: any },
      );
      blocks.push({
        ...block,
        geometry: block.geometry,
        properties,
      });
    }
    return blocks;
  }, []);

  return { type: 'FeatureCollection', features };
};

const makeEquityTilesets = (): FeatureCollection => {
  const equityData = parseEquity(
    JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/equity.geojson'), 'utf8'),
    ),
  );

  const equityName = path.join(__dirname, 'data/equity_parsed.geojson');
  fs.writeFileSync(equityName, JSON.stringify(equityData), 'utf8');
  makeTileset('equity', equityName);

  return equityData;
};

const EQUITY_TREE_PROPS = [
  'asthma',
  'avg_temp',
  'medhhinc',
  'ment_hlth',
  'phys_hlth',
  'total_pop',
  'tes',
];

const parseTrees = (
  trees: FeatureCollection,
  equityData: FeatureCollection,
  tilesets: number,
  parseProps: (props: Properties) => Properties,
): FeatureCollection[] => {
  const buckets: Feature[][] = [];

  trees.features.forEach((tree, index) => {
    const match = equityData.features.find((block) => {
      // @ts-ignore
      return booleanPointInPolygon(tree.geometry, block);
    });

    const equityProps: { [name: string]: any } = match
      ? EQUITY_TREE_PROPS.reduce((props, prop) => {
          return { ...props, [prop]: match?.properties?.[prop] };
        }, {})
      : {};

    const parsed: Feature = {
      type: 'Feature',
      geometry: tree.geometry,
      properties: {
        ...equityProps,
        ...parseProps(tree.properties),
      },
    };

    const bucket = index % tilesets;
    if (buckets[bucket]) {
      buckets[bucket].push(parsed);
    } else {
      buckets[bucket] = [parsed];
    }
  });

  return buckets.map((features) => {
    return { type: 'FeatureCollection', features };
  });
};

const STREET_PATH = path.join(__dirname, 'data/Street_Trees.geojson');
const PARK_PATH = path.join(__dirname, 'data/Parks_Tree_Inventory.geojson');

const makeInventoryTilesets = (equityData: FeatureCollection) => {
  const streetData = JSON.parse(fs.readFileSync(STREET_PATH, 'utf8'));
  const parkData = JSON.parse(fs.readFileSync(PARK_PATH, 'utf8'));

  const streetCollections = parseTrees(streetData, equityData, 5, (props) => ({
    id: props?.OBJECTID,
    date: props?.Date_Inventoried,
    condition: props?.Condition,
    name: props?.Common,
    size: props?.Size,
    latin: props?.Scientific,
  }));
  const parkCollections = parseTrees(parkData, equityData, 1, (props) => ({
    id: props?.OBJECTID,
    date: props?.Inventory_Date,
    condition: props?.Condition,
    name: props?.Common_name,
    size: props?.Size,
    latin: props?.Genus_species,
  }));

  makeTreeTilesets('street', streetCollections);
  makeTreeTilesets('park', parkCollections);
};

const makeTilesets = () => {
  // prework: ogr2ogr -f GeoJSON equity.geojson or.shp -s_srs EPSG:5070 -t_srs EPSG:4326
  const equityData = makeEquityTilesets();
  makeInventoryTilesets(equityData);
};

makeTilesets();
