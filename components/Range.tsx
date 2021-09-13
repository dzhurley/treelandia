import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Range as ReactRange, getTrackBackground } from 'react-range';
import { debounce } from 'lodash';

import { Prop, PROPS } from '../utils';

import styles from './Range.module.css';

const Range: React.FC<{
  name: Prop;
  min: number;
  max: number;
  step: number;
  value: number[] | null;
  onChange: (values: number[]) => void;
}> = ({ name, min, max, step, value, onChange }) => {
  const [values, setValues] = useState(value ?? [min, max]);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const debouncedUpdate = useCallback(debounce(onChange, 500), [onChange]);

  const trackRef = useRef<HTMLDivElement>(null);

  const background = useMemo(() => {
    return getTrackBackground({
      values,
      colors: ['#ccc', '#548BF4', '#ccc'],
      min: min,
      max: max,
    });
  }, [values, min, max]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.children[0].setAttribute(
        'style',
        `background:${background}`,
      );
    }
  }, [background]);

  return (
    <label className={styles.range}>
      {PROPS[name]}
      <ReactRange
        draggableTrack
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={(newValues) => {
          setValues(newValues);
          debouncedUpdate(newValues);
        }}
        renderTrack={({ props, children }) => {
          return (
            <div
              ref={trackRef}
              className={styles.trackContainer}
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={props.style}
            >
              <div ref={props.ref} className={styles.track}>
                {children}
              </div>
            </div>
          );
        }}
        renderThumb={({ props }) => (
          <div {...props} className={styles.thumb} style={props.style} />
        )}
      />
      <output
        style={{ fontSize: '80%', textAlign: 'center', display: 'block' }}
      >
        {step < 1
          ? `${values[0].toFixed(1)} - ${values[1].toFixed(1)}`
          : `${values[0]} - ${values[1]}`}{' '}
      </output>
    </label>
  );
};

export default Range;
