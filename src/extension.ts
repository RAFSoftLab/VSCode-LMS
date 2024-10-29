import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import simpleGit, { SimpleGit } from 'simple-git';
import * as os from 'os';
import axios, { type AxiosResponse } from 'axios';
import TokenManager from "./TokenManager";


const username = "raf";
const password = "masterSI2023";

export function activate(context: vscode.ExtensionContext) {
  //context.globalState.update('studentData', null);
  // Kreiranje i prikazivanje panela
  const tokenManager = TokenManager.getInstance();
  tokenManager.setFirstLoad(false);

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscode-lms-sidebar",
      sidebarProvider
    )
  );

  function getUsername(): string {
    return os.userInfo().username;
  }
  
  function parseStudentId(input: string): string {
    // Izvuci poslednji karakter (program)
    const program = input.slice(-1).toUpperCase();

    // Izvuci sve brojeve iz input stringa
    const numbers = input.match(/\d+/g)?.join("") ?? "";

    // Podeli brojeve na indeks i godinu
    const yearPart = numbers.slice(-2);
    const year = (parseInt(yearPart) + 2000).toString();
    const index = numbers.slice(0, -2);

    // Kombinuj ih u željeni format
    return `${program}${index}${year}`;
  }

  function extractClassroomNumber(input: string): string {
    // Prvo ukloni prefiks "U"
    let numberPart = input.substring(1, 3); // Uzmi samo brojčani deo nakon "U" i pre "01"
    
    // Pretvori string u broj
    let classroomNumber = parseInt(numberPart, 10);
    
    // Ako je broj manji od 10, ukloni vodeću nulu
    if (classroomNumber < 10) {
        return classroomNumber.toString();
    }
    
    return numberPart;
}
  context.subscriptions.push(vscode.commands.registerCommand('vscode-lms.startLMS', async () => {
    //const studentusername = getUsername();
    const computername = "U0401";
    const classroom = extractClassroomNumber(computername);
    const studentuser = "parnautovic4823m";
    const studentusername = parseStudentId("parnautovic4823m");

    sidebarProvider._view?.webview.postMessage({
      type: "user-info",
      value: studentuser,
    });
    sidebarProvider._view?.webview.postMessage({
      type: "classroom-info",
      value: classroom,
    });

    try {
      // Endpoint za dohvat studenata
      const endpoint = 'http://192.168.124.28:8091/api/v1/students/' + studentusername;

      // Token za autorizaciju
      const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";

      // Konfiguracija zahteva sa tokenom
      const config = {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      };
      vscode.window.showInformationMessage(studentusername);

      // Izvršavanje GET zahteva sa autorizacijom
      const response: AxiosResponse = await axios.get(endpoint, config);

      // Provera da li je odgovor uspešan (status 200)
      if (response.status === 200) {
        sidebarProvider._view?.webview.postMessage({
          type: "student-info",
          value: response.data,
        });
      } else {
        // Ukoliko odgovor nije uspešan, prikaži odgovarajuću poruku
        throw new Error(`Error fetching students: ${response.statusText}`);
      }
    } catch (error: any) {
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

