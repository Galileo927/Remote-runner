# Remote Runner

A lightweight VS Code extension that allows C++ developers to execute build commands on remote Linux servers via SSH, without using Microsoft's heavy "Remote-SSH" extension.

## Features

- Connect to remote servers using pure JavaScript SSH library (`ssh2`)
- Read `.remote-runner.json` configuration file from workspace root
- Stream remote server output to VS Code OutputChannel in real-time
- Support both password and private key authentication
- Execute multiple commands sequentially

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

### 3. Configuration File

Create `.remote-runner.json` file in the workspace root:

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

1. Press `F5` to start debug mode (opens a new Extension Development Host window)
2. In the new window, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type `Remote Runner: Run Remote Commands`
4. View the real-time output in the output panel

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

## Project Structure

```
remote-runner/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── sshManager.ts         # SSH connection and command execution manager
│   └── configReader.ts       # Configuration file reader and parser
├── .remote-runner.json       # Example configuration file
├── package.json              # VS Code extension configuration
├── tsconfig.json             # TypeScript compilation configuration
└── README.md                 # Project documentation
```

## Tech Stack

- **Runtime**: Node.js (VS Code Extension Host)
- **SSH Library**: [ssh2](https://github.com/mscdex/ssh2) - Pure JavaScript implementation
- **Development Language**: TypeScript
- **Target Platform**: VS Code 1.74.0+

## Development and Debugging

1. After cloning the project, run `npm install` to install dependencies
2. Press `F5` in VS Code to start debugging
3. Test the extension in the newly opened window
4. TypeScript will automatically recompile after code changes (in watch mode)

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

## Security Recommendations

- Do not hardcode passwords in configuration files; use private key authentication instead
- Add `.remote-runner.json` to `.gitignore` to avoid leaking sensitive information
- Configure SSH users using the principle of least privilege

## License

MIT

## Author

Galileo <1134271093@qq.com>
