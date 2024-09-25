class TokenManager {
    private static instance: TokenManager;
    private token: string | null = null;
    private repoPath: string | null = null;
    private firstTimeLoad: boolean | null = null;
    private forkBranch: string | null = null;

    private constructor() { }

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getToken(): string | null {
        return this.token;
    }
    public setRepoPath(repoPath: string): void {
        this.repoPath = repoPath;
    }

    public getRepoPath(): string | null {
        return this.repoPath;
    }

    public setFirstLoad(firstLoad: boolean): void{
        this.firstTimeLoad = firstLoad;
    }

    public getFirstLoad(): boolean | null {
        return this.firstTimeLoad;
    }

    public setForkBranch(forkBranch: string): void{
        this.forkBranch = forkBranch;
    }

    public getForkBranch(): string | null {
        return this.forkBranch;
    }

}

export default TokenManager;
