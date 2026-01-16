import * as vscode from 'vscode';
import { ConfigReader } from './configReader';
import { SSHManager } from './sshManager';
import { InitWizard } from './initWizard';

let outputChannel: vscode.OutputChannel;
let sshManager: SSHManager | null = null;

export function activate(context: vscode.ExtensionContext) {
    // Create output channel for displaying remote command output
    outputChannel = vscode.window.createOutputChannel('Remote Runner');

    // Register the run command
    const runCommand = vscode.commands.registerCommand('remote-runner.run', async () => {
        // Check if there's an existing running task
        if (sshManager) {
            const action = await vscode.window.showWarningMessage(
                'A remote task is already running. Do you want to disconnect and start a new task?',
                'Disconnect and Start New',
                'Cancel'
            );

            if (action === 'Disconnect and Start New') {
                sshManager.disconnect();
                sshManager = null;
            } else {
                return;
            }
        }

        // Show output channel
        outputChannel.show(true);

        // Clear previous output
        outputChannel.clear();
        outputChannel.appendLine('[Remote Runner] Starting remote command execution...\n');

        // Read configuration
        const config = await ConfigReader.readConfig();
        if (!config) {
            outputChannel.appendLine('[Remote Runner] ✗ Failed to read configuration file.\n');
            return;
        }

        // Create SSH manager and execute commands
        sshManager = new SSHManager(outputChannel);
        const success = await sshManager.executeCommands(config);

        // Clear sshManager reference after completion
        sshManager = null;

        if (!success) {
            vscode.window.showErrorMessage('Failed to execute remote commands. Check output for details.');
        } else {
            vscode.window.showInformationMessage('Remote commands executed successfully!');
        }
    });

    // Register command to stop/disconnect
    const disconnectCommand = vscode.commands.registerCommand('remote-runner.disconnect', () => {
        if (sshManager) {
            sshManager.disconnect();
            vscode.window.showInformationMessage('Disconnected from remote server.');
        } else {
            vscode.window.showWarningMessage('No active connection to disconnect.');
        }
    });

    // Register initialization wizard command
    const initCommand = vscode.commands.registerCommand('remote-runner.init', async () => {
        await InitWizard.start(context);
    });

    // Add disposables to context
    context.subscriptions.push(runCommand);
    context.subscriptions.push(disconnectCommand);
    context.subscriptions.push(initCommand);
}

export function deactivate() {
    // Cleanup on deactivation
    if (sshManager) {
        sshManager.disconnect();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}
