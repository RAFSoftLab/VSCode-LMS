import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import simpleGit, { SimpleGit } from 'simple-git';


const sshKeyPath = "C:/Users/P53/.ssh/id_rsa";
const username = "raf";
const password = "masterSI2023";
// Funkcija za kloniranje repozitorijuma
// async function cloneRepository() {
//   // Dobijanje putanje do trenutno otvorenog projekta
//   const currentWorkspace = vscode.workspace.workspaceFolders;
//   if (!currentWorkspace || !currentWorkspace.length) {
//       vscode.window.showErrorMessage('No workspace opened.');
//       return;
//   }

//   const projectPath = currentWorkspace[0].uri.fsPath;

//   // Kloniranje repozitorijuma
//   const git: SimpleGit = simpleGit();
//   await git.clone("C:/Users/Petar/local-git-server/local-git-server", projectPath);

//   // Obaveštenje o uspešnom kloniranju
//   vscode.window.showInformationMessage("Repository cloned successfully!");
// }

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);
        context.subscriptions.push(
          vscode.window.registerWebviewViewProvider(
            "vscode-lms-sidebar",
            sidebarProvider
          )
        );
	  context.subscriptions.push(vscode.commands.registerCommand('vscode-lms.helloWorld', async() => {
        // Kreiranje i prikazivanje panela
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

        // Obaveštenje o uspešnom kloniranju
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

