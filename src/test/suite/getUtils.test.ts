import * as assert from "assert";
import * as sinon from "sinon";
import * as simpleGit from "simple-git";   // NAMED import
import { cloneRepoTest, pushToRepoTest, authorizeStudentTest, getRepoTest } from "../../gitUtils";
import axios from "axios";

describe("Git Utils Unit Test Suite - authorizeStudentTest", () => {
    let postStub: sinon.SinonStub;
  
    beforeEach(() => {
      postStub = sinon.stub(axios, "post");
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    // Pozitivni test
    it("treba da vrati true ako server vrati 200", async () => {
      postStub.resolves({ status: 200, data: { message: "{}" } });
  
      const result = await authorizeStudentTest("student123");
  
      assert.strictEqual(result, true);
      assert.ok(postStub.calledOnce, "Očekivano je da se pozove axios.post()");
    });
  
    // Negativni test
    it("treba da vrati false ako axios.post baci grešku", async () => {
      postStub.rejects(new Error("Simulirana greška"));
  
      const result = await authorizeStudentTest("student123");
  
      assert.strictEqual(result, false);
    });
});

describe("Git Utils Unit Test Suite - getRepoTest", () => {
    let getStub: sinon.SinonStub;
  
    beforeEach(() => {
      getStub = sinon.stub(axios, "get");
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    // Pozitivni test
    it("treba da vrati repo path ako server vrati 200", async () => {
      const fakeMessage = { path: "/tmp/repo" };
      getStub.resolves({
        status: 200,
        data: { message: JSON.stringify(fakeMessage) },
      });
  
      const result = await getRepoTest("student123", "token123", "examA");
  
      assert.deepStrictEqual(result, fakeMessage);
      assert.ok(getStub.calledOnce, "Očekivano je da se pozove axios.get()");
    });
  
    // Negativni test
    it("treba da vrati null ako axios.get baci grešku", async () => {
      getStub.rejects(new Error("Simulirana greška"));
  
      const result = await getRepoTest("student123", "token123", "examA");
  
      assert.strictEqual(result, null);
    });
  });

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

  // Pozitivni testovi
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

  // Negativni testovi
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
