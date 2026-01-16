import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class InitWizard {
    private static readonly CONFIG_FILE = '.remote-runner.json';

    /**
     * Start the initialization wizard
     */
    static async start(context: vscode.ExtensionContext): Promise<void> {
        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        const configPath = path.join(workspaceRoot, this.CONFIG_FILE);

        // Check if config file already exists
        if (fs.existsSync(configPath)) {
            const overwrite = await vscode.window.showWarningMessage(
                `Configuration file '${this.CONFIG_FILE}' already exists. Do you want to overwrite it?`,
                'Overwrite',
                'Cancel'
            );

            if (overwrite !== 'Overwrite') {
                return;
            }
        }

        // Step 1: Ask for host
        const host = await vscode.window.showInputBox({
            prompt: 'Enter the remote server IP address or hostname',
            placeHolder: 'e.g., 192.168.1.100 or server.example.com',
            validateInput: (value) => {
                if (!value || value.trim() === '') {
                    return 'Host is required';
                }
                return null;
            }
        });

        if (!host) {
            return; // User cancelled
        }

        // Step 2: Ask for username (with default)
        const defaultUsername = os.userInfo().username;
        const username = await vscode.window.showInputBox({
            prompt: 'Enter the SSH username',
            placeHolder: `Default: ${defaultUsername}`,
            value: defaultUsername,
            validateInput: (value) => {
                if (!value || value.trim() === '') {
                    return 'Username is required';
                }
                return null;
            }
        });

        if (!username) {
            return; // User cancelled
        }

        // Step 3: Ask for port (optional, default 22)
        const portInput = await vscode.window.showInputBox({
            prompt: 'Enter the SSH port (optional)',
            placeHolder: 'Default: 22',
            value: '22'
        });

        if (portInput === undefined) {
            return; // User cancelled
        }

        const port = parseInt(portInput) || 22;

        // Step 4: Choose authentication method
        const authMethod = await vscode.window.showQuickPick(
            [
                {
                    label: '$(key) SSH Private Key (Recommended)',
                    description: 'Use private key authentication',
                    value: 'privateKey'
                },
                {
                    label: '$(lock) Password',
                    description: 'Use password authentication',
                    value: 'password'
                }
            ],
            {
                placeHolder: 'Select authentication method'
            }
        );

        if (!authMethod) {
            return; // User cancelled
        }

        let password: string | undefined = undefined;
        let privateKeyPath: string | undefined = undefined;

        if (authMethod.value === 'privateKey') {
            // Auto-detect default private key path
            const defaultKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');
            const keyExists = fs.existsSync(defaultKeyPath);

            const keyPathInput = await vscode.window.showInputBox({
                prompt: keyExists ? 'Private key path detected. Confirm or enter custom path' : 'Enter private key file path',
                placeHolder: keyExists ? `Detected: ${defaultKeyPath}` : 'e.g., /home/user/.ssh/id_rsa',
                value: keyExists ? defaultKeyPath : ''
            });

            if (!keyPathInput) {
                return; // User cancelled
            }

            privateKeyPath = keyPathInput;

            // Verify the key file exists
            if (!fs.existsSync(privateKeyPath)) {
                const warning = await vscode.window.showWarningMessage(
                    `Private key file not found: ${privateKeyPath}. Continue anyway?`,
                    'Continue',
                    'Cancel'
                );

                if (warning !== 'Continue') {
                    return;
                }
            }
        } else {
            // Password authentication
            password = await vscode.window.showInputBox({
                prompt: 'Enter SSH password',
                password: true,
                validateInput: (value) => {
                    if (!value || value.trim() === '') {
                        return 'Password is required';
                    }
                    return null;
                }
            });

            if (!password) {
                return; // User cancelled
            }
        }

        // Step 5: Detect project type and generate commands
        const commands = await this.detectProjectType(workspaceRoot);

        // Step 6: Generate and write config file
        const config = this.generateConfig(host, username, port, password, privateKeyPath, commands);

        try {
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

            // Open the config file for editing
            const document = await vscode.workspace.openTextDocument(configPath);
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage(
                `Configuration file '${this.CONFIG_FILE}' created successfully!`
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create configuration file: ${error}`);
        }
    }

    /**
     * Detect project type based on workspace files
     */
    private static async detectProjectType(workspaceRoot: string): Promise<string[]> {
        const files = fs.readdirSync(workspaceRoot);

        // Check for CMake project
        if (files.includes('CMakeLists.txt')) {
            const action = await vscode.window.showQuickPick(
                [
                    { label: 'Yes, use CMake commands', value: 'cmake' },
                    { label: 'No, use default commands', value: 'default' }
                ],
                {
                    placeHolder: 'CMake project detected. Use CMake build commands?'
                }
            );

            if (action && action.value === 'cmake') {
                return [
                    'mkdir -p build',
                    'cd build',
                    'cmake ..',
                    'make -j4'
                ];
            }
        }

        // Check for Makefile project
        if (files.includes('Makefile')) {
            const action = await vscode.window.showQuickPick(
                [
                    { label: 'Yes, use make command', value: 'make' },
                    { label: 'No, use default commands', value: 'default' }
                ],
                {
                    placeHolder: 'Makefile detected. Use make command?'
                }
            );

            if (action && action.value === 'make') {
                return ['make'];
            }
        }

        // Check for Node.js project
        if (files.includes('package.json')) {
            const action = await vscode.window.showQuickPick(
                [
                    { label: 'Yes, use npm commands', value: 'npm' },
                    { label: 'No, use default commands', value: 'default' }
                ],
                {
                    placeHolder: 'Node.js project detected. Use npm commands?'
                }
            );

            if (action && action.value === 'npm') {
                return ['npm install', 'npm start'];
            }
        }

        // Check for Python project
        const hasPythonFiles = files.some(f => f.endsWith('.py'));
        const hasRequirements = files.includes('requirements.txt');

        if (hasPythonFiles || hasRequirements) {
            const action = await vscode.window.showQuickPick(
                [
                    { label: 'Yes, use Python commands', value: 'python' },
                    { label: 'No, use default commands', value: 'default' }
                ],
                {
                    placeHolder: 'Python project detected. Use Python commands?'
                }
            );

            if (action && action.value === 'python') {
                return ['python3 main.py'];
            }
        }

        // Default commands
        return [
            'ls -la',
            'echo \'Remote Runner is working!\''
        ];
    }

    /**
     * Generate configuration object
     */
    private static generateConfig(
        host: string,
        username: string,
        port: number,
        password: string | undefined,
        privateKeyPath: string | undefined,
        commands: string[]
    ): any {
        const config: any = {
            host: host.trim(),
            username: username.trim(),
            port: port,
            commands: commands
        };

        if (password) {
            config.password = password;
        }

        if (privateKeyPath) {
            config.privateKeyPath = privateKeyPath.trim();
        }

        return config;
    }
}
