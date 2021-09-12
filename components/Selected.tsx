import { useMemo } from 'react';

import type { State } from '../reducer';
import {
  isTreeProp,
  isBlockProp,
  Prop,
  BLOCK_PROPS,
  PROPS,
  TREE_PROPS,
  shouldRound,
} from '../utils';

import styles from './Selected.module.css';

const Property: React.FC<{
  name: Prop;
  type: 'tree' | 'block';
  value: string | number;
}> = ({ name, type, value }) => {
  const renderedValue = useMemo(() => {
    if (name === 'date') {
      return new Date(value).toLocaleDateString();
    }
    if (typeof value === 'number' && shouldRound(name)) {
      return value.toFixed(2);
    }
    return value;
  }, [name, value]);

  if (type === 'tree' && !isTreeProp(name)) {
    return null;
  }

  if (type === 'block' && !isBlockProp(name)) {
    return null;
  }

  return (
    <span>
      <dt>{PROPS[name]}</dt>
      <dd>{renderedValue}</dd>
    </span>
  );
};

const Selected: React.FC<{
  tree: State['selected']['tree'];
  block: State['selected']['block'];
}> = ({ tree, block }) => {
  return tree?.properties && block?.properties ? (
    <section className={styles.container}>
      {tree?.properties && (
        <>
          <h3>Tree</h3>
          <dl className={styles.properties}>
            {TREE_PROPS.map((name) => (
              <Property
                key={name}
                name={name}
                type="tree"
                value={tree.properties?.[name]}
              />
            ))}
          </dl>
        </>
      )}

      {block?.properties && (
        <>
          <h3>Equity</h3>
          <dl className={styles.properties}>
            {BLOCK_PROPS.map((name) => (
              <Property
                key={name}
                name={name}
                type="block"
                value={block.properties?.[name]}
              />
            ))}
          </dl>
        </>
      )}
    </section>
  ) : null;
};

export default Selected;
