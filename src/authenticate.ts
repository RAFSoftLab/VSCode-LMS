import * as vscode from "vscode";
import axios, { type AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import TokenManager from './TokenManager';
import { v4 as uuidv4 } from 'uuid';

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
            console.log(message);
            fs.writeFileSync(filePath, message, 'utf-8');
        } else {
            throw new Error(`Error post students: ${response.statusText}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error post students: ${error.message}`);
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


