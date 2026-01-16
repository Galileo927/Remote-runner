import { Client } from 'ssh2';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { RemoteRunnerConfig } from './configReader';

export class SSHManager {
    private conn: Client | null = null;
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
    }

    /**
     * Execute commands on remote server via SSH
     */
    async executeCommands(config: RemoteRunnerConfig): Promise<boolean> {
        return new Promise((resolve) => {
            this.conn = new Client();

            // Prepare connection configuration
            const connConfig: any = {
                host: config.host,
                port: config.port || 22,
                username: config.username,
            };

            // Add authentication method (password or private key)
            if (config.password) {
                connConfig.password = config.password;
            } else if (config.privateKey) {
                connConfig.privateKey = config.privateKey;
            } else if (config.privateKeyPath) {
                // Read private key from file
                try {
                    connConfig.privateKey = fs.readFileSync(config.privateKeyPath);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to read private key file: ${error}`);
                    resolve(false);
                    return;
                }
            } else {
                vscode.window.showErrorMessage('No authentication method specified (password or private key)');
                resolve(false);
                return;
            }

            this.outputChannel.appendLine(`\n[Remote Runner] Connecting to ${config.username}@${config.host}...\n`);

            // Establish SSH connection
            this.conn.on('ready', () => {
                this.outputChannel.appendLine('[Remote Runner] ✓ Connected successfully!\n');

                // Execute commands sequentially
                this.executeCommandsSequentially(config.commands, 0, resolve);
            });

            this.conn.on('error', (err: Error) => {
                this.outputChannel.appendLine(`\n[Remote Runner] ✗ Connection error: ${err.message}\n`);
                resolve(false);
            });

            this.conn.connect(connConfig);
        });
    }

    /**
     * Execute commands one by one in sequence
     */
    private executeCommandsSequentially(
        commands: string[],
        index: number,
        resolve: (success: boolean) => void
    ): void {
        // All commands executed
        if (index >= commands.length) {
            this.outputChannel.appendLine('\n[Remote Runner] ✓ All commands completed successfully!\n');
            this.closeConnection();
            resolve(true);
            return;
        }

        const command = commands[index];
        this.outputChannel.appendLine(`[Remote Runner] Executing command ${index + 1}/${commands.length}: ${command}\n`);

        this.conn!.exec(command, { pty: true }, (err, stream) => {
            if (err) {
                this.outputChannel.appendLine(`\n[Remote Runner] ✗ Command execution error: ${err.message}\n`);
                this.closeConnection();
                resolve(false);
                return;
            }

            // Handle stdout - stream to output channel in real-time
            stream.on('data', (data: Buffer) => {
                const output = data.toString('utf8');
                this.outputChannel.append(output);
            });

            // Handle stderr - stream error output to output channel
            stream.stderr.on('data', (data: Buffer) => {
                const error = data.toString('utf8');
                this.outputChannel.append(error);
            });

            // When command completes, execute next command
            stream.on('close', (code: number) => {
                if (code === 0) {
                    this.outputChannel.appendLine(`\n[Remote Runner] ✓ Command completed with exit code: ${code}\n`);
                } else {
                    this.outputChannel.appendLine(`\n[Remote Runner] ⚠ Command completed with exit code: ${code}\n`);
                }

                // Execute next command
                this.executeCommandsSequentially(commands, index + 1, resolve);
            });
        });
    }

    /**
     * Close SSH connection
     */
    private closeConnection(): void {
        if (this.conn) {
            this.conn.end();
            this.conn = null;
        }
    }

    /**
     * Force disconnect
     */
    disconnect(): void {
        this.closeConnection();
        this.outputChannel.appendLine('\n[Remote Runner] Disconnected.\n');
    }
}
