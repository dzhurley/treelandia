import { Fragment, useEffect, useState } from 'react';

import type { State } from '../reducer';
import { PROPS, TREE_PROPS } from '../utils';

import styles from './Hover.module.css';

const Hover: React.FC<{
  hovered: State['hovered'];
  mapContainerRef: React.MutableRefObject<HTMLElement | null>;
}> = ({ mapContainerRef, hovered }) => {
  const [position, setPosition] = useState<{ top: number; left: number }>();

  const [withinRef, setWithinRef] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current) {
      const ref = mapContainerRef.current;

      const onEnter = () => setWithinRef(true);

      const onMove = (evt: MouseEvent) => {
        if (withinRef) {
          setPosition({ top: evt.clientY + 5, left: evt.clientX + 5 });
        } else {
          setWithinRef(true);
        }
      };

      const onLeave = () => setWithinRef(false);

      ref.addEventListener('mouseenter', onEnter);
      ref.addEventListener('mousemove', onMove);
      ref.addEventListener('mouseleave', onLeave);

      return () => {
        ref.removeEventListener('mouseenter', onEnter);
        ref.removeEventListener('mousemove', onMove);
        ref.removeEventListener('mouseleave', onLeave);
      };
    }
  }, [mapContainerRef, withinRef, setWithinRef]);

  if (!withinRef || !hovered) {
    return null;
  }

  const properties = hovered?.properties ?? {};

  return (
    <section
      style={{
        left: `calc(${position?.left}px + 1rem)`,
        top: `calc(${position?.top}px + 1rem)`,
      }}
      className={styles.container}
    >
      <dl className={styles.properties}>
        {TREE_PROPS.map((prop) => (
          <Fragment key={prop}>
            <dt>{PROPS[prop]}:</dt>
            <dd>
              {prop === 'date'
                ? new Date(properties.date).toLocaleDateString()
                : properties[prop]}
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
};

export default Hover;
