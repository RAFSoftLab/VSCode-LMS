import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
  // Kreiraj novu mocha instancu sa bojama
  const mocha = new Mocha({ ui: 'tdd', color: true });

  const testsRoot = path.resolve(__dirname, '.');

  return new Promise((resolve, reject) => {
    // koristi async glob API
    glob('**/**.test.js', { cwd: testsRoot })
      .then((files: string[]) => {
        files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          mocha.run(failures => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          reject(err);
        }
      })
      .catch(err => reject(err));
  });
}
