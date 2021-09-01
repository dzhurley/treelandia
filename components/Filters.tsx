import { useCallback, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { debounce } from 'lodash';

import styles from './Filters.module.css';

const Slider: React.FC<{
  label: string;
  min: number;
  max: number;
  step: number;
  value: number[] | null;
  onChange: (values: number[]) => void;
  units?: string;
}> = ({ label, min, max, step, value, onChange, units }) => {
  const [values, setValues] = useState(value ?? [min, max]);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const debouncedUpdate = useCallback(debounce(onChange, 200), [onChange]);

  return (
    <label className={styles.slider}>
      {label}
      <Range
        draggableTrack
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={(newValues) => {
          setValues(newValues);
          debouncedUpdate(newValues);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '28px',
              display: 'flex',
              width: 'calc(100% - 1rem)',
              padding: '0 0.5rem',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: min,
                  max: max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '14px',
              width: '14px',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          />
        )}
      />
      <output
        style={{ fontSize: '80%', textAlign: 'center', display: 'block' }}
      >
        {step < 1
          ? `${values[0].toFixed(1)} - ${values[1].toFixed(1)}`
          : `${values[0]} - ${values[1]}`}{' '}
        {units ? `(${units})` : ''}
      </output>
    </label>
  );
};

const Filters: React.FC<{
  filters: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
}> = ({ filters, updateFilter }) => {
  const handleCheckbox = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter(evt.target.name, evt.target.checked);
    },
    [updateFilter],
  );

  const handleSlider = useCallback(
    (name: string) => (values: number[]) => {
      updateFilter(name, values);
    },
    [updateFilter],
  );

  return (
    <section className={styles.container}>
      <h3>Trees</h3>

      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="street-trees"
          checked={filters['street-trees']}
          value="street"
          onChange={handleCheckbox}
        />
        Street
      </label>

      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="park-trees"
          checked={filters['park-trees']}
          value="park"
          onChange={handleCheckbox}
        />
        Park
      </label>

      <h3>Equity</h3>

      <Slider
        label="Asthma"
        min={5}
        max={20}
        step={0.1}
        value={filters.asthma}
        onChange={handleSlider('asthma')}
        units="%"
      />

      <Slider
        label="Average Temperature"
        min={50}
        max={100}
        step={0.1}
        value={filters.avg_temp}
        onChange={handleSlider('avg_temp')}
        units="degrees"
      />

      <Slider
        label="Median Household Income"
        min={0}
        max={250000}
        step={1000}
        value={filters.medhhinc}
        onChange={handleSlider('medhhinc')}
        units="$"
      />

      <Slider
        label="Mental Health Issues"
        min={5}
        max={25}
        step={0.1}
        value={filters.ment_hlth}
        onChange={handleSlider('ment_hlth')}
        units="%"
      />

      <Slider
        label="Physical Health Issues"
        min={5}
        max={25}
        step={0.1}
        value={filters.phys_hlth}
        onChange={handleSlider('phys_hlth')}
        units="%"
      />

      <Slider
        label="Population"
        min={500}
        max={5500}
        step={100}
        value={filters.total_pop}
        onChange={handleSlider('total_pop')}
      />

      <Slider
        label="Tree Equity Score"
        min={30}
        max={100}
        step={0.1}
        value={filters.tes}
        onChange={handleSlider('tes')}
      />
    </section>
  );
};

export default Filters;
