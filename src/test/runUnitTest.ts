import * as path from "path";
import Mocha = require("mocha"); // <-- ovo je pravi način
import { glob } from "glob";

export async function run() {
  const mocha = new Mocha({
    ui: "bdd", // koristi describe/it
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "suite");

  // Nađi sve test fajlove osim extension.test.js
  const files = await glob("**/*.test.js", {
    cwd: testsRoot,
    absolute: true,
    ignore: ["**/extension.test.js"],
  });

  files.forEach((f) => mocha.addFile(f));

  return new Promise<void>((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`));
      } else {
        resolve();
      }
    });
  });
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
