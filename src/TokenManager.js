"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenManager {
    constructor() {
        this.token = null;
        this.repoPath = null;
        this.firstTimeLoad = null;
        this.forkBranch = null;
    }
    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
    setToken(token) {
        this.token = token;
    }
    getToken() {
        return this.token;
    }
    setRepoPath(repoPath) {
        this.repoPath = repoPath;
    }
    getRepoPath() {
        return this.repoPath;
    }
    setFirstLoad(firstLoad) {
        this.firstTimeLoad = firstLoad;
    }
    getFirstLoad() {
        return this.firstTimeLoad;
    }
    setForkBranch(forkBranch) {
        this.forkBranch = forkBranch;
    }
    getForkBranch() {
        return this.forkBranch;
    }
}
exports.default = TokenManager;
