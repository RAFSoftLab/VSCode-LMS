// ⬅️ NOVO: runTest.ts koji prima putanju do testova i workspace preko CLI argumenata
import * as path from "path";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // root ekstenzije
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // ⬅️ NOVO: 1. arg = path do kompajliranih testova (default: suite)
    const extensionTestsPath =
      process.argv[2] || path.resolve(__dirname, "./suite/index");

    // ⬅️ NOVO: 2. arg = workspace koji VS Code otvara (default: suite-workspace)
    const workspaceDir =
      process.argv[3] ||
      path.resolve(__dirname, "../../test/fixtures/suite-workspace");

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      // ⬅️ Važno: prosledimo workspace VS Code-u
      launchArgs: [workspaceDir, "--disable-extensions"]
    });
  } catch (err) {
    console.error("Failed to run tests:", err);
    process.exit(1);
  }
}

main();
