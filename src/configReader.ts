import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface RemoteRunnerConfig {
    host: string;
    username: string;
    password?: string;
    privateKey?: string;
    privateKeyPath?: string;
    port?: number;
    commands: string[];
}

export class ConfigReader {
    private static readonly CONFIG_FILE = '.remote-runner.json';

    /**
     * Read and parse the .remote-runner.json configuration file
     */
    static async readConfig(): Promise<RemoteRunnerConfig | null> {
        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder found');
            return null;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        const configPath = path.join(workspaceRoot, this.CONFIG_FILE);

        // Check if config file exists
        if (!fs.existsSync(configPath)) {
            vscode.window.showErrorMessage(
                `Configuration file not found: ${this.CONFIG_FILE}\nPlease create it in the workspace root.`
            );
            return null;
        }

        try {
            // Read and parse config file
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent) as RemoteRunnerConfig;

            // Validate required fields
            if (!config.host || !config.username || !config.commands) {
                vscode.window.showErrorMessage(
                    'Invalid configuration: missing required fields (host, username, or commands)'
                );
                return null;
            }

            // Set default port if not specified
            if (!config.port) {
                config.port = 22;
            }

            return config;
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to parse configuration file: ${error}`
            );
            return null;
        }
    }
}
