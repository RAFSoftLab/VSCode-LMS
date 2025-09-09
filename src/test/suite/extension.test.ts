import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import * as path from "path";
import * as auth from "../../authenticate";
import { cloneRepo, pushToRepo } from "../../authenticate";

// ---------------- MOCK simple-git ----------------
function mockSimpleGit(overrides: any = {}) {
    return {
        branchLocal: async () => ({ all: ["master"], current: "master" }),
        checkoutLocalBranch: async () => true,
        checkout: async () => true,
        pull: async () => ({}),
        add: async () => true,
        commit: async () => true,
        push: async () => true,
        clone: async () => true,
        addConfig: async () => true,
        ...overrides,
    };
}

suite("Git Functions Test Suite", () => {
    let sandbox: sinon.SinonSandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(vscode.window, "showInformationMessage").resolves(undefined);
        sandbox.stub(vscode.window, "showErrorMessage").resolves(undefined);
        sandbox.stub(vscode.window, "showWarningMessage").resolves(undefined);
        
        // Stub path.join da uvek vraća fiksnu putanju
        // Ovo može ostati u setup bloku jer se ne stubuje više puta
        sandbox.stub(path, "join").returns("C:/Users/TestWorkspace/repo");
    });

    teardown(() => {
        sandbox.restore();
    });

    // --- TESTOVI ZA cloneRepo ---
    test("cloneRepo uspešno", async () => {
        sandbox.stub(vscode.workspace, "workspaceFolders").value([
            { uri: { fsPath: "C:/Users/TestWorkspace" } }
        ]);
        
        // STUBOVANJE JE SAMO OVDE
        sandbox.stub(auth, "getGit").callsFake(() => {
            return mockSimpleGit({ clone: async () => true });
        });

        const result = await cloneRepo("good-repo.git");
        assert.strictEqual(result, true, "Očekivano je true za uspešno kloniranje");
    });
    
    test("cloneRepo padne sa greškom", async () => {
        sandbox.stub(vscode.workspace, "workspaceFolders").value([
            { uri: { fsPath: "C:/Users/TestWorkspace" } }
        ]);
        
        // STUBOVANJE JE SAMO OVDE
        sandbox.stub(auth, "getGit").callsFake(() => {
            return mockSimpleGit({ clone: async () => { throw new Error("Clone failed"); } });
        });
        
        const result = await cloneRepo("bad-repo.git");
        assert.strictEqual(result, false, "Očekivano je false za neuspešno kloniranje");
    });

    // ... (slično, uradite izmene u svim ostalim testovima) ...
    
    test("pushToRepo kreira novi branch", async () => {
        sandbox.stub(vscode.workspace, "workspaceFolders").value([
            { uri: { fsPath: "C:/Users/TestWorkspace" } }
        ]);
        
        // STUBOVANJE JE SAMO OVDE
        sandbox.stub(auth, "getGit").callsFake(() => {
            return mockSimpleGit({ 
                branchLocal: async () => ({ all: [] }),
                checkoutLocalBranch: async () => true,
            });
        });

        const result = await pushToRepo("repo", "new-branch", "commit msg");
        assert.strictEqual(result, true, "Očekivano je true za uspešno kreiranje i push na novi branch");
    });
    
    // ... i tako dalje za svaki test ...
});