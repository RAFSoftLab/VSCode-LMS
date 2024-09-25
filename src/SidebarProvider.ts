import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import * as fs from 'fs';
import * as path from 'path';
import * as authenticate from "./authenticate";
import TokenManager from "./TokenManager";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "authorize-token": {
          if (!data.value) {
            return;
          }
          //Autorizacija studenta
          await authenticate.authorizeStudent(data.value);
          const tokenManager = TokenManager.getInstance();

          const token = tokenManager.getToken();
          console.log(token);
          if (token) {
            await authenticate.getRepo(data.value, token, "OopZadatak1");
            const repositoryPath = tokenManager.getRepoPath();
            console.log('Repository data:', repositoryPath);
            await authenticate.getFork(data.value, token);
            // Brisanje svih stavki u radnom direktorijumu 
            deleteAllItemsInWorkspace();
            if (repositoryPath) {
              await authenticate.cloneRepo(repositoryPath);
            }
          }
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "commit": {
          if (!data.value) {
            return;
          }
          const tokenManager = TokenManager.getInstance();
          const branch = tokenManager.getForkBranch();
          const repositoryPath = tokenManager.getRepoPath();
          if(repositoryPath && branch){
            await authenticate.pushToRepo(repositoryPath, branch, `Student je predao rad ${data.value}`);
          } 
        }
      }
    });

    async function deleteFolderRecursive(directoryPath: string, isRoot: boolean = false): Promise<void> {
      if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Rekurzivno brisanje poddirektorijuma
            deleteFolderRecursive(curPath);
            if (['.git', '.vscode'].includes(path.basename(curPath))) {
              // Brisanje .git i .vscode direktorijuma
              deleteFolderRecursive(curPath);
            } else {
              // Rekurzivno brisanje poddirektorijuma
              deleteFolderRecursive(curPath);
            }
          } else {
            // Brisanje fajla ako nije direktorijum
            fs.unlinkSync(curPath);
          }
        });
        // Brisanje samog direktorijuma nakon brisanja svih sadržaja, osim ako je root direktorijum
        if (!isRoot && !['.git', '.vscode'].includes(path.basename(directoryPath))) {
          fs.rmdirSync(directoryPath);
        }
      }
    }

    // Funkcija za brisanje svih stavki u poddirektorijumima radnog direktorijuma
    async function deleteAllItemsInWorkspace() {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folders are open.');
        return;
      }

      for (const folder of workspaceFolders) {
        try {
          await deleteFolderRecursive(folder.uri.fsPath, true);
          vscode.window.showInformationMessage(`All items deleted in ${folder.uri.fsPath}`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Error deleting items in ${folder.uri.fsPath}: ${error.message}`);
        }
      }
    }
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
      }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}