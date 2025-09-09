import * as assert from "assert";
import sinon from "sinon";
import * as simpleGit from "simple-git";
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

    sinon.stub(simpleGit, "simpleGit").returns(gitStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("treba da uspešno klonira repo", async () => {
    const result = await cloneRepoTest("http://fake-url/repo.git", "./tmp/clone-1");

    assert.strictEqual(result, true);
    assert.ok(gitStub.clone.calledOnce);
  });

  it("treba da uspešno uradi push na novu granu", async () => {
    const result = await pushToRepoTest("./tmp/repo", "feature-x", "unit test commit");

    assert.strictEqual(result, true);
    assert.ok(gitStub.checkoutLocalBranch.calledOnce);
    assert.ok(gitStub.push.calledOnce);
  });
});
