import * as vscode from "vscode";

declare global {
    const tsvscode: {
        postMessage: ({ type: string, value: any }) => void;
        getState: () => any;
        setState: (state: any) => void;
    };
}