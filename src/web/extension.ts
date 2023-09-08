import * as vscode from 'vscode';
import { Logger } from './logger';

function getBaseName(path: string) {
	var parts = path.split('/');
	var lastPart = parts[parts.length - 1];
	return lastPart;
}

function isOtelFile(document: vscode.TextDocument) {
	return document.languageId === "yaml" && getBaseName(document.fileName).startsWith("otel");
}

enum MessageType {
	LOAD_CONFIG = "LOAD_CONFIG",
}

export function activate(context: vscode.ExtensionContext) {

	// --- init
	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	Logger.configure(context, "info");

	// --- init/commands
	context.subscriptions.push(vscode.commands.registerCommand('otel-validator.showViz', () => {
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.One);
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'showViz',
				'Show Viz',
				vscode.ViewColumn.One,
				{
					retainContextWhenHidden: true,
					enableScripts: true,
				}
			);
			// TODO: don't hardcode
			let jsPath = vscode.Uri.joinPath(context.extensionUri, "dist", "assets", "index.js");
			let cssPath = vscode.Uri.joinPath(context.extensionUri, "dist", "assets", "index.css");
			jsPath = currentPanel.webview.asWebviewUri(jsPath);
			cssPath = currentPanel.webview.asWebviewUri(cssPath);
			currentPanel.webview.html = getWebviewContent({ cssPath, jsPath });

			// pass current editor contents
			const activeDocument = vscode.window.activeTextEditor?.document;

			if (activeDocument && isOtelFile(activeDocument)) {
				currentPanel.webview.postMessage({
					type: MessageType.LOAD_CONFIG,
					payload: activeDocument.getText(),
				});
				Logger.log({ctx: "activate", msg: "sending config to webview"}, "info");
			} else {
				debugger;
				Logger.log({ctx: "activate", msg: "no otel file found"}, "info");
			}

			// disposal
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				undefined,
				context.subscriptions
			);
		}
	}));

	context.subscriptions.push(disposable);
	Logger.log({ctx: "activate", msg: "activated"}, "info");
}

function getWebviewContent(opts: { cssPath: vscode.Uri, jsPath: vscode.Uri }) {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Otel UI</title>
    <script type="module" src="${opts.jsPath}"></script>
    <link rel="stylesheet" href="${opts.cssPath}">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>`
}



export function deactivate() { }
