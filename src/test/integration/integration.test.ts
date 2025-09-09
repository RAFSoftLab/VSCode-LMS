import * as assert from "assert";
import { cloneRepoTest, pushToRepoTest } from "../../authenticate";
import * as fs from "fs";
import * as path from "path";

describe("Git Load Test Suite", () => {
  const repoUrl =
    "http://foo@192.168.1.187/zadatak-1-92a07e95-c5d5-4895-97d0-0bef6ae2e780";
  const tempWorkspace = path.join(__dirname, "..", "..", "tmp-workspace");

  before(() => {
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true }); // očisti stari workspace
    }
    fs.mkdirSync(tempWorkspace, { recursive: true });
  });

  it("treba da uspešno klonira repo 50 puta", async function () {
    this.timeout(60_000);

    for (let i = 0; i < 50; i++) {
      const repoClonePath = path.join(tempWorkspace, `clone-${i}`);

      const result = await cloneRepoTest(repoUrl, repoClonePath);
      assert.strictEqual(
        result,
        true,
        `Kloniranje nije uspelo u iteraciji ${i}`
      );
      assert.ok(
        fs.existsSync(repoClonePath),
        `Repo nije kloniran: ${repoClonePath}`
      );
    }
  });

  it("treba da uspešno odradi push 10 puta", async function () {
    this.timeout(30_000);

    // koristi jedan repo za push test
    const repoClonePath = path.join(tempWorkspace, "push-repo");
    if (!fs.existsSync(repoClonePath)) {
      const cloned = await cloneRepoTest(repoUrl, repoClonePath);
      assert.strictEqual(cloned, true, "Init clone za push nije uspeo");
    }

    for (let i = 10; i < 20; i++) {
      const branch = `loadtest-branch-${i}`;
      const message = `commit ${i}`;

      const result = await pushToRepoTest(repoClonePath, branch, message);
      assert.strictEqual(result, true, `Push nije uspeo u iteraciji ${i}`);
    }
  });
});
