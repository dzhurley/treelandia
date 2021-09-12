import { useEffect, useMemo } from 'react';

import { MapboxAPI, getMapbox } from '../map';
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
  filters: State['filters'];
}> = ({ tree, block, filters }) => {
  const visible = useMemo(() => {
    if (!tree?.properties) {
      return false;
    }
    const isStreet = tree.source.startsWith('street-');

    return Object.entries(filters).every(([name, value]) => {
      if (isStreet && 'street-trees' === name) {
        return value;
      }
      if (!isStreet && 'park-trees' === name) {
        return value;
      }

      if (name !== 'street-trees' && name !== 'park-trees') {
        return (
          value[0] <= tree.properties?.[name] &&
          value[1] >= tree.properties?.[name]
        );
      }

      return true;
    });
  }, [tree, filters]);

  useEffect(() => {
    getMapbox().then(({ setSelectedFiltered }: MapboxAPI) =>
      setSelectedFiltered(visible),
    );
  }, [visible]);

  return tree?.properties && block?.properties ? (
    <section className={styles.container}>
      {visible ? (
        <>
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
        </>
      ) : (
        'Tree has been filtered from view, please adjust filters to show tree again'
      )}
    </section>
  ) : null;
};

export default Selected;
