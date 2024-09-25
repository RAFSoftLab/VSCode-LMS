import * as vscode from "vscode";
import axios, { type AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import TokenManager from './TokenManager';
import { v4 as uuidv4 } from 'uuid';
import simpleGit, { SimpleGit } from 'simple-git';

const username = "raf";
const password = "masterSI2023";

export async function authorizeStudent(data: any) {
    try {
        //const studentId = parseStudentId(data);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `students_${uuidv4()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);

        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/authorize`;

        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";

        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const response: AxiosResponse = await axios.post(endpoint, {}, config);

        if (response.status === 200) {
            const message = JSON.parse(response.data.message);
            const value = message.value;

            const tokenManager = TokenManager.getInstance();
            tokenManager.setToken(value);

            console.log(value);
            fs.writeFileSync(filePath, value, 'utf-8');
        } else {
            throw new Error(`Error post students: ${response.statusText}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error post students: ${error.message}`);
    }
}

export async function getRepo(id: string, token: string, exam: string) {
    try {
        //const studentId = parseStudentId(id);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `repopath_${uuidv4()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);
        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/repository/${token}/exam/${exam}`;

        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";

        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const response: AxiosResponse = await axios.get(endpoint, config);

        if (response.status === 200) {
            const message = JSON.parse(response.data.message);

            const tokenManager = TokenManager.getInstance();
            tokenManager.setRepoPath(message);
            console.log(tokenManager.getRepoPath());
            fs.writeFileSync(filePath, message, 'utf-8');
        } else {
            throw new Error(`Error post students: ${response.statusText}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error post students: ${error.message}`);
    }
}

export async function getFork(id: string, token: string) {
    try {
        //const studentId = parseStudentId(id);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `repopath_${uuidv4()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);
        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/repository/${token}/fork`;

        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";

        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const response: AxiosResponse = await axios.get(endpoint, config);

        if (response.status === 200) {
            const message = JSON.parse(response.data.message);

            console.log(message);
            const tokenManager = TokenManager.getInstance();
            tokenManager.setForkBranch(message);
            fs.writeFileSync(filePath, message, 'utf-8');
        } else {
            throw new Error(`Error fork branch: ${response.statusText}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error fork branch: ${error.message}`);
    }
}

export async function cloneRepo(repoPath: string) {
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
        await git.clone('http://raf@192.168.124.28:/' + repoPath, projectPath);

        // Obaveštenj e o uspešnom kloniranju
        vscode.window.showInformationMessage("Repository cloned successfully!");
    } catch (error) {
        // Prikazivanje greške ako dođe do neuspeha
        vscode.window.showErrorMessage(`Error cloning repository: ${error}`);
    }
}

export function parseStudentId(input: string): string {
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


