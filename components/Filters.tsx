import { memo, useCallback } from 'react';

import Range from './Range';

import styles from './Filters.module.css';

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

  const handleRange = useCallback(
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

      <Range
        name="asthma"
        min={5}
        max={20}
        step={0.1}
        value={filters.asthma}
        onChange={handleRange('asthma')}
      />

      <Range
        name="avg_temp"
        min={50}
        max={100}
        step={0.1}
        value={filters.avg_temp}
        onChange={handleRange('avg_temp')}
      />

      <Range
        name="medhhinc"
        min={0}
        max={250000}
        step={1000}
        value={filters.medhhinc}
        onChange={handleRange('medhhinc')}
      />

      <Range
        name="ment_hlth"
        min={5}
        max={25}
        step={0.1}
        value={filters.ment_hlth}
        onChange={handleRange('ment_hlth')}
      />

      <Range
        name="phys_hlth"
        min={5}
        max={25}
        step={0.1}
        value={filters.phys_hlth}
        onChange={handleRange('phys_hlth')}
      />

      <Range
        name="total_pop"
        min={500}
        max={5500}
        step={100}
        value={filters.total_pop}
        onChange={handleRange('total_pop')}
      />

      <Range
        name="tes"
        min={30}
        max={100}
        step={0.1}
        value={filters.tes}
        onChange={handleRange('tes')}
      />

      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="outlines"
          checked={filters.outlines}
          value="outlines"
          onChange={handleCheckbox}
        />
        Show Block Outlines
      </label>
    </section>
  );
};

export default memo(Filters);
