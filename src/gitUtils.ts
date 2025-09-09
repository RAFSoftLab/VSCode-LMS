import { simpleGit } from "simple-git";

export async function cloneRepoTest(repoUrl: string, targetPath: string): Promise<boolean> {
  try {
    const git = simpleGit(); // sada sinon stub u testu ovo pokriva
    await git.clone(repoUrl, targetPath);
    return true;
  } catch (error: any) {
    console.error(`Clone failed: ${error.message}`);
    return false;
  }
}

export async function pushToRepoTest(repoPath: string, branchName: string, message: string): Promise<boolean> {
  try {
    const git = simpleGit(repoPath);
    const branches = await git.branchLocal();
    const branchExists = branches.all.includes(branchName);

    if (!branchExists) {
      await git.checkoutLocalBranch(branchName);
    } else {
      await git.checkout(branchName);
      await git.pull("origin", branchName, { "--rebase": "true" });
    }

    await git.add("./*");
    try {
      await git.commit(message);
    } catch {}
    await git.push(["-u", "origin", branchName]);
    return true;
  } catch (error: any) {
    console.error(`Push failed: ${error.message}`);
    return false;
  }
}
