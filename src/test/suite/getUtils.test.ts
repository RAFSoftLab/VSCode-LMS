import * as assert from "assert";
import * as sinon from "sinon";
import * as simpleGit from "simple-git";   // ⬅️ NAMED import
import { cloneRepoTest, pushToRepoTest } from "../../gitUtils";

describe("Git Utils Unit Test Suite", () => {
  let gitStub: any;

  beforeEach(() => {
    gitStub = {
      clone: sinon.stub().resolves(),
      branchLocal: sinon.stub().resolves({ all: [] }),
      checkoutLocalBranch: sinon.stub().resolves(),
      checkout: sinon.stub().resolves(),
      pull: sinon.stub().resolves(),
      add: sinon.stub().resolves(),
      commit: sinon.stub().resolves(),
      push: sinon.stub().resolves(),
    };

    // stubuj simpleGit() da vraća naš gitStub
    sinon.stub(simpleGit, "simpleGit").callsFake(() => gitStub as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  // ✅ Pozitivni testovi
  it("treba da uspešno klonira repo", async () => {
    const result = await cloneRepoTest("http://fake-url/repo.git", "./tmp/clone-1");

    assert.strictEqual(result, true);
    assert.ok(gitStub.clone.calledOnce, "Očekivano je da se pozove git.clone()");
  });

  it("treba da uspešno uradi push na novu granu", async () => {
    const result = await pushToRepoTest(
      "http://fake-url/repo.git",
      "feature-x",
      "unit test commit"
    );

    assert.strictEqual(result, true);
    assert.ok(gitStub.checkoutLocalBranch.calledOnce, "Očekivano je da se kreira nova grana");
    assert.ok(gitStub.push.calledOnce, "Očekivano je da se pozove git.push()");
  });

  // ❌ Negativni testovi
  it("treba da vrati false ako clone baci grešku", async () => {
    gitStub.clone.rejects(new Error("Simulirana greška u clone"));

    const result = await cloneRepoTest("http://fake-url/repo.git", "./tmp/clone-fail");

    assert.strictEqual(result, false);
  });

  it("treba da vrati false ako push baci grešku", async () => {
    gitStub.push.rejects(new Error("Simulirana greška u push"));

    const result = await pushToRepoTest(
      "http://fake-url/repo.git",
      "feature-x",
      "commit fail"
    );

    assert.strictEqual(result, false);
  });
});
