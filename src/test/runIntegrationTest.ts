import * as path from "path";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // 📂 putanja do root foldera tvog extensiona
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // 📂 putanja do integration testova
    const extensionTestsPath = path.resolve(__dirname, "./integration");

    // 🧪 pokreni VS Code sa testovima
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (err) {
    console.error("❌ Failed to run tests:", err);
    process.exit(1);
  }
}

main();
