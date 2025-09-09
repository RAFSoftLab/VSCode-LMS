"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStudentId = exports.getGit = exports.pushToRepo = exports.cloneRepo = exports.getFork = exports.getRepo = exports.authorizeStudent = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TokenManager_1 = __importDefault(require("./TokenManager"));
const uuid_1 = require("uuid");
const simple_git_1 = __importDefault(require("simple-git"));
const username = "raf";
const password = "masterSI2023";
async function authorizeStudent(data) {
    try {
        //const studentId = parseStudentId(data);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `students_${(0, uuid_1.v4)()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);
        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/authorize`;
        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";
        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios_1.default.post(endpoint, {}, config);
        if (response.status === 200) {
            const message = JSON.parse(response.data.message);
            const value = message.value;
            const tokenManager = TokenManager_1.default.getInstance();
            tokenManager.setToken(value);
            console.log(value);
            fs.writeFileSync(filePath, value, 'utf-8');
        }
        else {
            throw new Error(`Error post students: ${response.statusText}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error post students: ${error.message}`);
    }
}
exports.authorizeStudent = authorizeStudent;
async function getRepo(id, token, exam) {
    try {
        //const studentId = parseStudentId(id);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `repopath_${(0, uuid_1.v4)()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);
        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/repository/${token}/exam/${exam}`;
        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";
        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios_1.default.get(endpoint, config);
        if (response.status === 200) {
            const message = JSON.parse(response.data.message);
            const tokenManager = TokenManager_1.default.getInstance();
            tokenManager.setRepoPath(message);
            console.log(tokenManager.getRepoPath());
            fs.writeFileSync(filePath, message, 'utf-8');
        }
        else {
            throw new Error(`Error post students: ${response.statusText}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error post students: ${error.message}`);
    }
}
exports.getRepo = getRepo;
async function getFork(id, token) {
    try {
        //const studentId = parseStudentId(id);
        const studentId = parseStudentId("parnautovic4823m");
        const fileName = `forkbranchpath_${(0, uuid_1.v4)()}.txt`; // Generisanje nasumičnog imena fajla
        const filePath = path.join('C:\\Users\\Petar', fileName);
        const endpoint = `http://192.168.124.28:8091/api/v1/students/${studentId}/repository/${token}/fork`;
        const API_TOKEN = "L2aTA643Z0UJ43bIdBymFExVbpqZg7v5QJafYh6KFRjl04eV6w4TtdppkX41hEwo";
        const config = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios_1.default.get(endpoint, config);
        if (response.status === 200) {
            const message = JSON.parse(response.data.message);
            console.log(message);
            const tokenManager = TokenManager_1.default.getInstance();
            tokenManager.setForkBranch(message);
            fs.writeFileSync(filePath, message, 'utf-8');
        }
        else {
            throw new Error(`Error fork branch: ${response.statusText}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error fork branch: ${error.message}`);
    }
}
exports.getFork = getFork;
async function cloneRepo(repoPath) {
    // Dobijanje putanje do trenutno otvorenog projekta
    const currentWorkspace = vscode.workspace.workspaceFolders;
    if (!currentWorkspace || !currentWorkspace.length) {
        vscode.window.showErrorMessage('No workspace opened.');
        return false;
    }
    const projectPath = currentWorkspace[0].uri.fsPath;
    try {
        // 👇 umesto simpleGit() koristi se getGit()
        const git = getGit();
        // Postavljanje kredencijala ako su dostupni
        if (username && password) {
            git.addConfig('user.name', 'foo');
            git.addConfig('user.password', 'foo');
        }
        // Kloniranje repozitorijuma
        await git.clone('http://foo@192.168.1.187/' + repoPath, path.join(projectPath, repoPath.replace(/\.git$/, '')));
        // Obaveštenj e o uspešnom kloniranju
        vscode.window.showInformationMessage("Repository cloned successfully!");
        return true;
    }
    catch (error) {
        // Prikazivanje greške ako dođe do neuspeha
        vscode.window.showErrorMessage(`Error cloning repository: ${error.message}`);
        return false;
    }
}
exports.cloneRepo = cloneRepo;
async function pushToRepo(repoPath, branchName, message) {
    try {
        const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspacePath) {
            vscode.window.showErrorMessage("No workspace opened.");
            return false;
        }
        const repoFullPath = path.join(workspacePath, repoPath);
        const cleanRepoPath = normalizeRepoPath(repoFullPath);
        // 👇 umesto simpleGit(cleanRepoPath)
        const git = getGit(cleanRepoPath);
        // Provera da li postoji branch
        const branches = await git.branchLocal();
        const branchExists = branches.all.includes(branchName);
        if (!branchExists) {
            // Kreiranje i prebacivanje na novi branch
            await git.checkoutLocalBranch(branchName);
            vscode.window.showInformationMessage(`Branch '${branchName}' created and checked out.`);
        }
        else {
            // Prebacivanje na postojeći branch
            await git.checkout(branchName);
            // Pokušaj pull-a pre push-a
            try {
                await git.pull('origin', branchName, { '--rebase': 'true' });
                vscode.window.showInformationMessage("Repository successfully updated.");
            }
            catch {
                vscode.window.showErrorMessage("Pull failed, check conflicts and repository status");
                return false; // Ako pull ne uspe, prekinuti dalje izvršavanje
            }
        }
        await git.add('./*');
        try {
            await git.commit(message);
        }
        catch {
            vscode.window.showWarningMessage("No changes to commit.");
        }
        await git.push(['-u', 'origin', branchName]);
        vscode.window.showInformationMessage("Push to repository completed successfully.");
        return true;
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error pushing to repository: ${error.message}`);
        return false;
    }
}
exports.pushToRepo = pushToRepo;
function normalizeRepoPath(repoPath) {
    return repoPath.replace(/\.git$/, '');
}
function getGit(repoPath) {
    return (0, simple_git_1.default)(repoPath);
}
exports.getGit = getGit;
function parseStudentId(input) {
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
exports.parseStudentId = parseStudentId;
