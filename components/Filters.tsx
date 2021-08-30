import { useCallback } from 'react';

import styles from './Filters.module.css';

// fill
//
// asthma 9.1 - 12.9 (percentage)
// avg_temp 71.29 - 88.26 (on hot summer day)
// core_norm 0.023033 - 1 (coronary troubles, percentage)
// healthnorm 0.265219 - 0.706481 (health index)
// medhhinc 0 - 215,500 (median income)
// ment_hlth 9.1 - 19.4 (percentage)
// pctpoc 0.003497 - 0.738916 (percentage)
// pctpov 0 - 0.893477 (percentage)
// phys_hlth 7.2 - 21.1 (percentage)
// tes 44.77 - 100
// total_pop 516 - 5,335
// unemplrate 0 - 0.278351 (percentage)

const Filters: React.FC<{
  filters: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
}> = ({ filters, updateFilter }) => {
  const handleFieldChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter(evt.target.name, evt.target.checked);
    },
    [updateFilter],
  );

  return (
    <section className={styles.container}>
      <form className={styles.treesForm}>
        <h1>Trees</h1>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="street-trees"
            checked={filters['street-trees']}
            value="street"
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
          />
          Park
        </label>
      </form>
    </section>
  );
};

export default Filters;
