# Treelandia

The supporting demo for my talk at [CascadiaJS](https://2021.cascadiajs.com)
entitled [Cartography on the
Web](https://2021.cascadiajs.com/speakers/derek-hurley).

## Developing

Before running the application locally, you must first create a
[`.env.local`](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables)
file at the root of the project with an [access
token](https://account.mapbox.com/access-tokens/create) for Mapbox:

```
NEXT_PUBLIC_MAPBOX_TOKEN='<your pk access token>'
```

Once that's in place, install the dependencies for the project:

```
npm install
```

And run the dev server:

```
npm run dev
```

## Data

As the datasets powering Treelandia are personally hosted, you'll have to
generate and host the datasets yourself to be able to view them locally. A
script has been included to merge datasets from the [Tree Equity
Score](https://treeequityscore.org/data/) and the [Portland Tree Inventory
Project](https://www.portland.gov/trees/get-involved/treeinventory). You'll
need the following tools installed to regenerate the datasets for consumption
by Treelandia:

- [ogr2ogr](https://gdal.org/programs/ogr2ogr.html)
- [tippecanoe](https://github.com/mapbox/tippecanoe)

To generate new tilesets from new downloaded data, store the new data from the
above links in a `data/` directory and run the following commands:

```
# transform the tree equity shapefiles into geojson
ogr2ogr -f GeoJSON equity.geojson or.shp -s_srs EPSG:5070 -t_srs EPSG:4326
```

```
# generate the actual tilesets
npm run tileset
```

After they're generated, you'll upload them to
[Mapbox](https://studio.mapbox.com/tilesets/) and grab the accurate tileset IDs
to use in [the layers config](./map/layers.ts). Restart the dev server to see
the changes.
