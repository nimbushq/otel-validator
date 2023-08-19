import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "otel-validator" is now active in the web extension host!');
	let disposable = vscode.commands.registerCommand('otel-validator.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from otel-validator in a web extension host!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
