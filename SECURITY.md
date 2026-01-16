# Security Considerations

## Protecting Sensitive Information

### 1. Configuration File Security

The `.remote-runner.json` file contains sensitive information (server IP, username, password/private key). **Please ensure to**:

- Add `.remote-runner.json` to `.gitignore`
- Never commit this file to version control
- Use the principle of least privilege when configuring SSH users in production
- Rotate passwords and keys regularly

### 2. Recommended Authentication Method

**Strongly recommend using private key authentication instead of password authentication** because:

- Private key authentication is more secure
- Can configure passphrase for private key
- Can disable password login to improve server security

### 3. File Permissions

Ensure configuration file permissions are set correctly:

```bash
chmod 600 .remote-runner.json
```

For private key files:

```bash
chmod 600 ~/.ssh/id_rsa
```

### 4. Network Security

- Only use this extension in trusted network environments
- Consider using VPN or SSH tunnels
- Ensure SSH server is properly configured (disable root login, change default port, etc.)

### 5. Principle of Least Privilege

When configuring SSH users:

- Don't use root user unless necessary
- Create dedicated users for specific tasks
- Grant only the minimum permissions required to execute commands

## Potential Risks

### 1. Password Leakage

If the configuration file is accidentally committed to version control, passwords will be permanently exposed.

**Solutions**:
- Use private key authentication
- Add `.remote-runner.json` to `.gitignore`
- Use tools like git-secrets to detect sensitive information

### 2. Man-in-the-Middle Attacks

In insecure network environments, SSH connections may be vulnerable to MITM attacks.

**Solutions**:
- Verify server host key fingerprints
- Use `StrictHostKeyChecking yes` in SSH configuration

### 3. Command Injection

If the configuration file is maliciously modified, dangerous commands could be executed.

**Solutions**:
- Regularly audit configuration file contents
- Restrict configuration file edit permissions

## Security Configuration Example

### Using SSH Key Pairs (Recommended)

1. Generate key pair:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2. Add public key to server:
```bash
ssh-copy-id user@server
```

3. Configure Remote Runner to use private key:
```json
{
    "host": "server.example.com",
    "username": "deploy-user",
    "privateKeyPath": "/home/user/.ssh/id_rsa",
    "commands": ["cd /app && git pull && npm install && npm run build"]
}
```

### Restricting User Permissions

Create a dedicated user that can only execute specific commands:

```bash
# Create user
sudo useradd -m -s /bin/bash deploy-user

# Configure sudoers to allow only specific commands
sudo visudo
# Add: deploy-user ALL=(ALL) NOPASSWD: /usr/bin/git, /usr/bin/make
```

## Security Checklist

- [ ] `.remote-runner.json` added to `.gitignore`
- [ ] Using private key authentication instead of password
- [ ] Private key file permissions set to 600
- [ ] Not using root user for login
- [ ] SSH server has password login disabled
- [ ] Firewall rules configured
- [ ] Regularly audit access logs
- [ ] Using latest versions of dependencies

## Vulnerability Reporting

If you discover a security vulnerability, please contact us privately rather than disclosing it publicly.

Contact: security@example.com
