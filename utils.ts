export const PROPS = {
  // tree id
  id: 'Tree ID',
  // date tree inventoried
  date: 'Date',
  // condition of tree
  condition: 'Condition',
  // name of type of tree
  name: 'Name',
  // size of tree (S, M, L)
  size: 'Size',
  // latin name for tree
  latin: 'Latin',
  // blockgroup id
  geoid: 'Block ID',
  // total population of block group
  total_pop: 'Total Population',
  // percent of people in poverty inside block group
  pctpov: 'People in Poverty',
  // percent of people of color inside block group
  pctpoc: 'People of Color',
  // unemployment rate inside of block group
  unemplrate: 'Unemployment Rate',
  // median household income of block group
  medhhinc: 'Median Income',
  // area of block group in square kilometers
  area: 'Area',
  // average temperature of block group on a hot summer's day
  avg_temp: 'Average Temperature',
  // density of block group (total population over area)
  bgpopdense: 'Population over Area',
  // self reported physical health challenges of people in block group (a percentage)
  phys_hlth: 'Physical Health Issues',
  // self reported mental health challenges of people in block group (a percentage)
  ment_hlth: 'Mental Health Issues',
  // self reported asthma challenges of people in block group (a percentage)
  asthma: 'Asthma',
  // self reported male coronary heart challenges of people in block group (a percentage)
  core_m: 'Male Heart Issues',
  // self reported female coronary heart challenges of people in block group (a percentage)
  core_w: 'Female Heart Issues',
  // tree equity score of block group
  tes: 'Tree Equity Score',
};

export type Prop = keyof typeof PROPS;

export const TREE_PROPS: Prop[] = [
  'name',
  'latin',
  'size',
  'condition',
  'date',
];

export const BLOCK_PROPS: Prop[] = [
  'area',
  'asthma',
  'avg_temp',
  'bgpopdense',
  'core_m',
  'core_w',
  'medhhinc',
  'ment_hlth',
  'pctpoc',
  'pctpov',
  'phys_hlth',
  'tes',
  'total_pop',
  'unemplrate',
];

const FLOAT_PROPS: Prop[] = [
  'pctpov',
  'pctpoc',
  'unemplrate',
  'area',
  'avg_temp',
  'bgpopdense',
  'phys_hlth',
  'ment_hlth',
  'asthma',
  'core_m',
  'core_w',
  'tes',
];

const PERCENT_PROPS: Prop[] = [
  'phys_hlth',
  'ment_hlth',
  'asthma',
  'core_m',
  'core_w',
  'pctpov',
  'pctpoc',
  'unemplrate',
];

export const isTreeProp = (name: Prop): boolean => {
  return TREE_PROPS.includes(name);
};

export const isBlockProp = (name: Prop): boolean => {
  return BLOCK_PROPS.includes(name);
};

export const shouldRound = (name: Prop): boolean => {
  return FLOAT_PROPS.includes(name);
};

export const formatPropUnits = (name: Prop, value: string | number): string => {
  if (PERCENT_PROPS.includes(name)) {
    let numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (
      ['phys_hlth', 'ment_hlth', 'asthma', 'core_m', 'core_w'].includes(name)
    ) {
      // handle case where some percentage values are stored with 0 - 1 range
      // and some are stored within 0 - 100 range
      numberValue = numberValue / 100;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(numberValue);
  }

  if (name === 'medhhinc' && typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (name === 'total_pop' || name === 'bgpopdense') {
    let numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
    }).format(numberValue);
  }

  if (name === 'area') {
    return `${value} km²`;
  }

  if (name === 'avg_temp') {
    return `${value} °F`;
  }

  return `${value}`;
};
