# Remote Runner

A lightweight VS Code extension that allows C++ developers to execute build commands on remote Linux servers via SSH, without using Microsoft's heavy "Remote-SSH" extension.

## Features

- 🧙 **Smart Initialization Wizard**: Generate configuration files through interactive Q&A, no need to manually write JSON
- 🔍 **Intelligent Project Detection**: Automatically recognize CMake, Makefile, Node.js, Python projects and generate corresponding build commands
- 🔐 **Multiple Authentication Methods**: Support both password and private key authentication with automatic SSH key detection
- 📡 **Real-time Output Streaming**: Stream remote server output to VS Code OutputChannel in real-time
- 🎯 **PTY Support**: Enable pseudo-terminal for colored output and interactive commands
- 🔄 **Sequential Execution**: Execute multiple commands in sequence

## Installation and Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile TypeScript Code

```bash
npm run compile
```

Or use watch mode (recommended for development):

```bash
npm run watch
```

### 3. Configuration File (Smart Wizard Recommended)

#### Method 1: Using Smart Initialization Wizard (Recommended)

This is the easiest way. The extension will guide you through the configuration process:

1. Open VS Code Command Palette: `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. Type and select `Remote Runner: Initialize Config (Wizard)`
3. Follow the prompts to fill in information:
   - **Host Address**: Enter the IP or hostname of the remote server (e.g., `192.168.1.100`)
   - **Username**: Enter SSH login username (default is current system username)
   - **Port**: Enter SSH port (default 22)
   - **Authentication Method**:
     - Choose **SSH Private Key** (Recommended): The wizard will auto-detect `~/.ssh/id_rsa`, or you can manually enter the path
     - Choose **Password**: Enter the login password directly
   - **Project Type Confirmation**: The wizard will auto-detect your project type (CMake/Makefile/Node.js/Python) and recommend appropriate build commands
4. After completion, the `.remote-runner.json` file will automatically open for you to review and modify

**Supported Intelligent Project Detection**:
- **CMake Projects** (detects `CMakeLists.txt`): Auto-generate `mkdir -p build && cd build && cmake .. && make -j4`
- **Makefile Projects** (detects `Makefile`): Auto-generate `make`
- **Node.js Projects** (detects `package.json`): Auto-generate `npm install && npm start`
- **Python Projects** (detects `*.py` or `requirements.txt`): Auto-generate `python3 main.py`
- **Default**: Generate test command `ls -la && echo 'Remote Runner is working!'`

#### Method 2: Manual Configuration

If you prefer to create manually, create `.remote-runner.json` file in the workspace root:

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "password": "mypassword",
    "port": 22,
    "commands": [
        "echo 'Connected to remote!'",
        "ls -la",
        "pwd"
    ]
}
```

### 4. Configuration Options

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `host` | string | Yes | Remote server IP address or hostname |
| `username` | string | Yes | SSH login username |
| `password` | string | No | SSH login password (one of password/privateKey/privateKeyPath is required) |
| `privateKey` | string | No | Private key content (one of password/privateKey/privateKeyPath is required) |
| `privateKeyPath` | string | No | Private key file path (one of password/privateKey/privateKeyPath is required) |
| `port` | number | No | SSH port, default 22 |
| `commands` | string[] | Yes | List of commands to execute |

### 5. Run the Extension

In VS Code:

1. Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) to open Command Palette
2. Type `Remote Runner: Run Remote Commands`
3. View real-time output in the output panel

**Other Available Commands**:
- `Remote Runner: Disconnect` - Disconnect current connection
- `Remote Runner: Initialize Config (Wizard)` - Reinitialize configuration file

## Authentication Methods

### Password Authentication

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "password": "your-password",
    "commands": ["ls -la"]
}
```

### Private Key File Authentication

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "privateKeyPath": "/path/to/private/key",
    "commands": ["ls -la"]
}
```

### Private Key Content Authentication

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "commands": ["ls -la"]
}
```

## Common Commands

### Available Commands in Command Palette

1. **Remote Runner: Initialize Config (Wizard)** 🧙
   - Launch smart initialization wizard
   - Auto-generate configuration files through interactive Q&A
   - Auto-detect project type and recommend build commands

2. **Remote Runner: Run Remote Commands** ▶️
   - Execute remote commands from configuration file
   - Display output in real-time to Output Channel

3. **Remote Runner: Disconnect** 🔌
   - Disconnect current SSH connection

### Usage Examples

**Example 1: C++ Project (CMake)**
```
1. Open C++ project
2. Ctrl+Shift+P -> "Remote Runner: Initialize Config"
3. Enter server information
4. Wizard detects CMakeLists.txt, recommends CMake build commands
5. Confirm to auto-generate configuration
6. Ctrl+Shift+P -> "Remote Runner: Run Remote Commands"
7. View build output
```

**Example 2: Node.js Project Deployment**
```
1. Open Node.js project
2. Use wizard to initialize configuration
3. Wizard detects package.json, recommends npm commands
4. Customize commands (e.g., change to "npm run build")
5. Save configuration and run
```

## Project Structure

```
remote-runner/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── sshManager.ts         # SSH connection and command execution manager
│   ├── configReader.ts       # Configuration file reader and parser
│   └── initWizard.ts         # Smart initialization wizard
├── .remote-runner.json       # Configuration file (generated by wizard or manual)
├── package.json              # VS Code extension configuration
├── tsconfig.json             # TypeScript compilation configuration
└── README.md                 # Project documentation
```

## Tech Stack

- **Runtime**: Node.js (VS Code Extension Host)
- **SSH Library**: [ssh2](https://github.com/mscdex/ssh2) - Pure JavaScript implementation
- **Development Language**: TypeScript
- **Target Platform**: VS Code 1.74.0+
- **Core Features**: PTY (pseudo-terminal) support, intelligent project detection, interactive wizard

## Development and Debugging

### Quick Start for Developers

1. After cloning the project, run `npm install` to install dependencies
2. Press `F5` in VS Code to start debugging
3. Test the extension in the newly opened Extension Development Host window
4. TypeScript will automatically recompile after code changes (in watch mode)

### Testing the Smart Wizard

In the debug window:
1. Press `Ctrl+Shift+P`
2. Select "Remote Runner: Initialize Config (Wizard)"
3. Follow the wizard to complete configuration
4. Check if the generated `.remote-runner.json` file meets expectations

## Package Extension

```bash
# Install vsce
npm install -g vsce

# Package as .vsix file
vsce package
```

The generated `.vsix` file can be installed directly into VS Code.

## FAQ

### Q: Connection timeout?
A: Check firewall settings and ensure SSH port (default 22) is open.

### Q: Authentication failed?
A: Verify username, password, or private key configuration is correct. Private key file path should be an absolute path.

### Q: Command execution failed?
A: Check the output panel for error messages and verify the command exists on the remote server.

### Q: How do I use the smart wizard?
A: Press `Ctrl+Shift+P` and select "Remote Runner: Initialize Config (Wizard)", then follow the interactive prompts.

## Security Recommendations

- Do not hardcode passwords in configuration files; use private key authentication instead
- Add `.remote-runner.json` to `.gitignore` to avoid leaking sensitive information
- Configure SSH users using the principle of least privilege

## Use Cases

### Scenario 1: Remote C++ Project Build

```json
{
    "host": "build-server.company.com",
    "username": "build-user",
    "privateKeyPath": "/home/user/.ssh/build_server_key",
    "commands": [
        "cd /opt/my-project",
        "git pull origin main",
        "cmake -B build",
        "cmake --build build -j8"
    ]
}
```

### Scenario 2: Deploy Application to Server

```json
{
    "host": "prod-server.example.com",
    "username": "deploy",
    "privateKeyPath": "/home/user/.ssh/deploy_key",
    "commands": [
        "cd /var/www/app",
        "git pull",
        "npm install --production",
        "pm2 restart app"
    ]
}
```

### Scenario 3: Execute System Maintenance Commands

```json
{
    "host": "server.example.com",
    "username": "admin",
    "password": "secure-password",
    "commands": [
        "df -h",
        "free -m",
        "uptime"
    ]
}
```

## Contributing

Issues and Pull Requests are welcome!

Development workflow:
1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## License

MIT

## Author

Galileo <1134271093@qq.com>
