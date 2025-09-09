import { simpleGit } from "simple-git";
import axios, { AxiosResponse } from "axios";

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

export async function authorizeStudentTest(studentId: string): Promise<boolean> {
    try {
      const endpoint = `http://fake-server/api/v1/students/${studentId}/authorize`;
  
      const API_TOKEN = "HARDCODED_API_TOKEN";
  
      const config = {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      };
  
      const response: AxiosResponse = await axios.post(endpoint, {}, config);
  
      return response.status === 200;
    } catch (error: any) {
      console.error(`Authorize failed: ${error.message}`);
      return false;
    }
  }

  export async function getRepoTest(studentId: string, token: string, exam: string): Promise<string | null> {
    try {
      const endpoint = `http://fake-server/api/v1/students/${studentId}/repository/${token}/exam/${exam}`;
  
      const API_TOKEN = "HARDCODED_API_TOKEN";
  
      const config = {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      };
  
      const response: AxiosResponse = await axios.get(endpoint, config);
  
      if (response.status === 200) {
        // server vraća { message: "..." }
        const message = JSON.parse(response.data.message);
        return message;
      }
  
      return null;
    } catch (error: any) {
      console.error(`GetRepo failed: ${error.message}`);
      return null;
    }
  }
