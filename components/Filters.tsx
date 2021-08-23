import { useCallback } from 'react';

import styles from './Filters.module.css';

// fill
//
// area: 0.955316
// asthma: 12.2
// avg_temp: 86.03292568203199
// bgpopdense: 4112.775249236902
// core_m: 25.2
// core_norm: 0.116886023815919
// core_w: 26.9
// geoid: 410510090001
// healthnorm: 0.646576012742009
// medhhinc: 46509
// ment_hlth: 18.5
// pctpoc: 0.482565538304912
// pctpov: 0.485177342509264
// phys_hlth: 17.5
// tes: 83.33578214246462
// total_pop: 3929
// unemplrate: 0.043246129204485

// circle
//
// street: true
// park: false
// condition: "Fair"
// date: "2014-09-25T19:17:08Z"
// id: 56219
// latin: "Acer palmatum"
// name: "maple, Japanese"
// size: "S"

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
      <h1>Trees</h1>
      <form className={styles.treesForm}>
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
