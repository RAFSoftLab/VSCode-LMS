import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import simpleGit, { SimpleGit } from 'simple-git';
import axios, {type AxiosResponse}  from 'axios';


const username = "raf";
const password = "masterSI2023";

function getComputerUsername(): string {
  return vscode.env.machineId; // Koristimo vscode.env.machineName da bismo dobili korisničko ime računara
}
export function activate(context: vscode.ExtensionContext) {
  // Kreiranje i prikazivanje panela
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscode-lms-sidebar",
      sidebarProvider
    )
  );
  function getComputerUsername(): string {
    return vscode.env.machineId; // Koristimo vscode.env.machineName da bismo dobili korisničko ime računara
}
  context.subscriptions.push(vscode.commands.registerCommand('vscode-lms.username', async () => {
    try {
      // Endpoint za dohvat studenata
      const endpoint = 'http://192.168.124.28:8091/api/v1/students';

      // Token za autorizaciju
      const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";

      // Konfiguracija zahteva sa tokenom
      const config = {
          headers: {
              'Authorization': `Bearer ${API_TOKEN}`
          }
      };

      // Izvršavanje GET zahteva sa autorizacijom
      const response: AxiosResponse = await axios.get(endpoint, config);

      // Provera da li je odgovor uspešan (status 200)
      if (response.status === 200) {
          // Prikazivanje rezultata u izlaznom prozoru
          vscode.window.showInformationMessage(JSON.stringify(response.data));
      } else {
          // Ukoliko odgovor nije uspešan, prikaži odgovarajuću poruku
          throw new Error(`Error fetching students: ${response.statusText}`);
      }
  } catch (error:any) {
      // Prikazivanje greške ako dođe do problema
      vscode.window.showErrorMessage(`Error fetching students: ${error.message}`);
  }
  }));
  context.subscriptions.push(vscode.commands.registerCommand('vscode-lms.helloWorld', async () => {
    // Dobijanje putanje do trenutno otvorenog projekta
    const currentWorkspace = vscode.workspace.workspaceFolders;
    if (!currentWorkspace || !currentWorkspace.length) {
      vscode.window.showErrorMessage('No workspace opened.');
      return;
    }

    const projectPath = currentWorkspace[0].uri.fsPath;

    try {
      // Kreiranje instance SimpleGit
      const git: SimpleGit = simpleGit();

      // Postavljanje kredencijala ako su dostupni
      if (username && password) {
        git.addConfig('user.name', username);
        git.addConfig('user.password', password);
      }

      // Kloniranje repozitorijuma
      await git.clone('http://raf@192.168.124.28:/java_project.git', projectPath);

      // Obaveštenj e o uspešnom kloniranju
      vscode.window.showInformationMessage("Repository cloned successfully!");
    } catch (error) {
      // Prikazivanje greške ako dođe do neuspeha
      vscode.window.showErrorMessage(`Error cloning repository: ${error}`);
    }
  }));

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-lms.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vscode-lms-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}

