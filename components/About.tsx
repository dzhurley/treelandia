import { useState } from 'react';

import styles from './About.module.css';

const About: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        ?
      </button>
      {open && (
        <>
          <section
            className={styles.container}
            onClick={() => setOpen(false)}
          ></section>
          <section className={styles.content}>
            <p>
              The supporting demo for my talk at{' '}
              <a
                href="https://2021.cascadiajs.com/speakers/derek-hurley"
                target="_blank"
                rel="noopener noreferrer"
              >
                CascadiaJS
              </a>{' '}
              entitled {`"Cartography on the Web"`}. This merges datasets from
              the{' '}
              <a
                href="https://treeequityscore.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tree Equity Score
              </a>{' '}
              and the{' '}
              <a
                href="https://www.portland.gov/trees/get-involved/treeinventory"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portland Tree Inventory Project
              </a>
              . Look around and enjoy!
            </p>

            <p>
              Source can be found on{' '}
              <a
                href="https://github.com/dzhurley/treelandia/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </>
      )}
    </>
  );
};

export default About;
