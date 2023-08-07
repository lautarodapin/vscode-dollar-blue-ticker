import * as vscode from 'vscode';
import { Ticker, TickerConfiguration } from './ticker';


let ticker: Ticker | undefined;

// the refresh interval
let interval: NodeJS.Timeout | undefined;

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dollar-blue-ticker" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('dollar-blue-ticker.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from dollar-blue-ticker!');
    });

    context.subscriptions.push(disposable);
    // construct the extension
    constructor();

    // call the constructor again if the configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(constructor));
}

// construct the extension
function constructor() {
    // clear the interval if we already have one
    if (interval !== undefined) {
        clearInterval(interval);
    }

    // dispose of the tickers if we already have an array
    if (ticker !== undefined) {
        ticker.dispose();
    }
    const configuration: TickerConfiguration = vscode.workspace.getConfiguration().get('dollar-blue-ticker')!;

    console.log(configuration);

    ticker = new Ticker(configuration);
    // create the interval and call refresh ever x seconds
    interval = setInterval(() => ticker?.refresh(), ticker.interval * 1000);
}

export function deactivate() {
    ticker?.dispose();
}