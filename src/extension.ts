import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);
        context.subscriptions.push(
          vscode.window.registerWebviewViewProvider(
            "vscode-lms-sidebar",
            sidebarProvider
          )
        );
	context.subscriptions.push(vscode.commands.registerCommand('vscode-lms.helloWorld', () => {
        // Kreiranje i prikazivanje panela
       
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

