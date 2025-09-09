// src/test/integration/index.ts
import * as path from "path";
import Mocha from "mocha";
import { glob } from "glob";

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "bdd",
    timeout: 0 // load testovi mogu biti spori
  });

  const testsRoot = path.resolve(__dirname);

  try {
    const files = await glob("**/*.test.js", { cwd: testsRoot });
    console.log("🔍 Nađeni test fajlovi:", files); // debug ispis

    files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

    return new Promise((resolve, reject) => {
      mocha.run(failures =>
        failures ? reject(new Error(`${failures} tests failed.`)) : resolve()
      );
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

// 👇 OVDE je bio problem – moraš eksplicitno da pozoveš run()
if (require.main === module) {
  run().catch(err => {
    console.error("❌ Greška u integration testovima:", err);
    process.exit(1);
  });
}
