# Changelog

All notable changes to the "remote-runner" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial MVP release
- SSH connection support using `ssh2` library
- Configuration file reading from `.remote-runner.json`
- Password and private key authentication methods
- Real-time streaming of remote command output to VS Code OutputChannel
- Sequential command execution
- Disconnect command for manual connection termination
- Comprehensive error handling and user feedback
- Sample configuration and security documentation

## [0.0.1] - 2025-01-16

### Features
- Execute commands on remote Linux servers via SSH
- Support for multiple authentication methods (password, private key file, private key content)
- Real-time stdout/stderr streaming to output panel
- Configurable SSH port (default: 22)
- Multiple commands execution in sequence
- VS Code command palette integration
- Output channel with color-coded status messages

### Documentation
- Comprehensive README with usage examples
- Security best practices guide
- Sample configuration file with detailed comments
- TypeScript type definitions for all interfaces
