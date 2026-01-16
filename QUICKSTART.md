# Remote Runner - Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Compile Project

```bash
npm run compile
```

### Step 3: Configure Remote Server

Copy the example configuration file and modify it for your environment:

```bash
cp .remote-runner.json.example .remote-runner.json
```

Edit `.remote-runner.json`:

```json
{
    "host": "your-server-ip",
    "username": "your-username",
    "password": "your-password",
    "port": 22,
    "commands": [
        "ls -la",
        "pwd"
    ]
}
```

**Security Tip**:
- For production environments, use private key authentication
- Never commit `.remote-runner.json` to Git

### Step 4: Start Debugging

1. Open this project in VS Code
2. Press `F5` to start debugging
3. A new "Extension Development Host" window will automatically open

### Step 5: Run Extension

In the newly opened window:

1. Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. Type `Remote Runner: Run Remote Commands`
3. View real-time output in the output panel

## Common Use Cases

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

## Development Mode

To continuously watch for code changes and automatically recompile:

```bash
npm run watch
```

Then modify any TypeScript file in the `src/` directory, and the code will automatically recompile.

## Package Extension

Generate a `.vsix` file for sharing or installation:

```bash
# Install vsce (if not already installed)
npm install -g vsce

# Package
vsce package
```

The generated `remote-runner-0.0.1.vsix` file can be:
- Shared with team members
- Installed in any VS Code instance

## Troubleshooting

### Problem: Connection Timeout

**Possible causes**:
- Incorrect server IP or port
- Firewall blocking connection
- SSH service not running on server

**Solutions**:
- Check `host` and `port` in configuration file
- Try connecting with system SSH client: `ssh user@host`

### Problem: Authentication Failed

**Possible causes**:
- Incorrect username or password
- Private key file path is incorrect
- Private key format is incorrect

**Solutions**:
- Test SSH connection manually
- Check private key file permissions: `chmod 600 ~/.ssh/id_rsa`
- Ensure using correct private key format (OpenSSH format)

### Problem: Command Execution Failed

**Possible causes**:
- Command doesn't exist on remote server
- Insufficient permissions
- Incorrect working directory

**Solutions**:
- Test commands manually on remote server first
- Check user permissions
- `cd` to correct working directory in commands

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Read [SECURITY.md](SECURITY.md) for security best practices
- Check source code to understand implementation details

## Getting Help

If you encounter issues:

1. Check detailed error messages in VS Code output panel
2. Verify configuration file format is correct
3. Try manual SSH connection to verify network and authentication
4. Check [GitHub Issues](https://github.com/your-repo/issues)

## Contributing

Issues and Pull Requests are welcome!

Development workflow:
1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request
