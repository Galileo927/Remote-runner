# Remote Runner

一个轻量级的 VS Code 插件，允许 C++ 开发者通过 SSH 在远程 Linux 服务器上执行构建命令，无需使用微软官方的 "Remote-SSH" 插件。

## 功能特性

- 🧙 **智能初始化向导**: 通过交互式问答自动生成配置文件，无需手动编写 JSON
- 🔍 **智能项目探测**: 自动识别 CMake、Makefile、Node.js、Python 等项目类型并生成对应构建命令
- 🔐 **多种认证方式**: 支持密码和私钥两种认证方式，自动探测 SSH 私钥
- 📡 **实时输出流式传输**: 实时流式传输远程服务器的输出到 VS Code 输出面板
- 🎯 **PTY 支持**: 启用伪终端，支持彩色输出和交互式命令
- 🔄 **顺序执行**: 支持顺序执行多个命令

## 安装和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 编译 TypeScript 代码

```bash
npm run compile
```

或使用监听模式（开发时推荐）：

```bash
npm run watch
```

### 3. 配置文件（推荐使用智能向导）

#### 方式一：使用智能初始化向导（推荐）

这是最简单的方式，插件会通过交互式问答引导你完成配置：

1. 打开 VS Code 命令面板：`Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. 输入并选择 `Remote Runner: Initialize Config (Wizard)`
3. 按照提示填写信息：
   - **主机地址**: 输入远程服务器的 IP 或域名（如 `192.168.1.100`）
   - **用户名**: 输入 SSH 登录用户名（默认为当前系统用户名）
   - **端口**: 输入 SSH 端口（默认 22）
   - **认证方式**:
     - 选择 **SSH 私钥**（推荐）：向导会自动探测 `~/.ssh/id_rsa`，你也可以手动输入路径
     - 选择 **密码**：直接输入登录密码
   - **项目类型确认**: 向导会自动探测你的项目类型（CMake/Makefile/Node.js/Python），并推荐相应的构建命令
4. 配置完成后，会自动打开 `.remote-runner.json` 文件供你查看和修改

**支持的智能项目探测**：
- **CMake 项目** (检测到 `CMakeLists.txt`): 自动生成 `mkdir -p build && cd build && cmake .. && make -j4`
- **Makefile 项目** (检测到 `Makefile`): 自动生成 `make`
- **Node.js 项目** (检测到 `package.json`): 自动生成 `npm install && npm start`
- **Python 项目** (检测到 `*.py` 或 `requirements.txt`): 自动生成 `python3 main.py`
- **默认**: 生成测试命令 `ls -la && echo 'Remote Runner is working!'`

#### 方式二：手动创建配置文件

如果你想手动创建，在工作区根目录创建 `.remote-runner.json` 文件：

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

### 4. 配置项说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `host` | string | 是 | 远程服务器 IP 地址或域名 |
| `username` | string | 是 | SSH 登录用户名 |
| `password` | string | 否 | SSH 登录密码（与 privateKey/privateKeyPath 二选一） |
| `privateKey` | string | 否 | 私钥内容（与 password/privateKeyPath 二选一） |
| `privateKeyPath` | string | 否 | 私钥文件路径（与 password/privateKey 二选一） |
| `port` | number | 否 | SSH 端口，默认 22 |
| `commands` | string[] | 是 | 要执行的命令列表 |

### 4. 运行插件

在 VS Code 中：

1. 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 打开命令面板
2. 输入 `Remote Runner: Run Remote Commands`
3. 查看输出面板中的实时输出

**其他可用命令**：
- `Remote Runner: Disconnect` - 断开当前连接
- `Remote Runner: Initialize Config (Wizard)` - 重新初始化配置文件

## 认证方式

### 使用密码认证

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "password": "your-password",
    "commands": ["ls -la"]
}
```

### 使用私钥文件认证

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "privateKeyPath": "/path/to/private/key",
    "commands": ["ls -la"]
}
```

### 使用私钥内容认证

```json
{
    "host": "192.168.1.100",
    "username": "root",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "commands": ["ls -la"]
}
```

## 项目结构

```
remote-runner/
├── src/
│   ├── extension.ts          # 插件入口文件
│   ├── sshManager.ts         # SSH 连接和命令执行管理
│   ├── configReader.ts       # 配置文件读取和解析
│   └── initWizard.ts         # 智能初始化向导
├── .remote-runner.json       # 配置文件（由向导生成或手动创建）
├── package.json              # VS Code 插件配置
├── tsconfig.json             # TypeScript 编译配置
└── README.md                 # 项目文档
```

## 常用命令

### 命令面板中的可用命令

1. **Remote Runner: Initialize Config (Wizard)** 🧙
   - 启动智能初始化向导
   - 通过交互式问答自动生成配置文件
   - 自动探测项目类型并推荐构建命令

2. **Remote Runner: Run Remote Commands** ▶️
   - 执行配置文件中的远程命令
   - 实时显示输出到 Output Channel

3. **Remote Runner: Disconnect** 🔌
   - 断开当前的 SSH 连接

### 使用示例

**示例 1: C++ 项目（CMake）**
```
1. 打开 C++ 项目
2. Ctrl+Shift+P -> "Remote Runner: Initialize Config"
3. 输入服务器信息
4. 向导检测到 CMakeLists.txt，推荐 CMake 构建命令
5. 确认后自动生成配置
6. Ctrl+Shift+P -> "Remote Runner: Run Remote Commands"
7. 查看构建输出
```

**示例 2: Node.js 项目部署**
```
1. 打开 Node.js 项目
2. 使用向导初始化配置
3. 向导检测到 package.json，推荐 npm 命令
4. 自定义命令（如改为 "npm run build"）
5. 保存配置并运行
```

## 技术栈

- **运行时**: Node.js (VS Code Extension Host)
- **SSH 库**: [ssh2](https://github.com/mscdex/ssh2) - 纯 JavaScript 实现
- **开发语言**: TypeScript
- **目标平台**: VS Code 1.74.0+
- **核心特性**: PTY (伪终端) 支持、智能项目探测、交互式向导

## 开发和调试

### 开发者快速开始

1. 克隆项目后，运行 `npm install` 安装依赖
2. 按 `F5` 在 VS Code 中启动调试
3. 在新打开的 Extension Development Host 窗口中测试插件功能
4. 修改代码后，TypeScript 会自动重新编译（监听模式下）

### 测试智能向导

在调试窗口中：
1. 按 `Ctrl+Shift+P`
2. 选择 "Remote Runner: Initialize Config (Wizard)"
3. 跟随向导完成配置
4. 检查生成的 `.remote-runner.json` 文件是否符合预期

## 打包插件

```bash
# 安装 vsce
npm install -g vsce

# 打包成 .vsix 文件
vsce package
```

生成的 `.vsix` 文件可以直接安装到 VS Code 中。

## 常见问题

### Q: 连接超时怎么办？
A: 检查防火墙设置，确保 SSH 端口（默认 22）开放。

### Q: 认证失败？
A: 确认用户名、密码或私钥配置正确。私钥文件路径应该是绝对路径。

### Q: 命令执行失败？
A: 查看输出面板中的错误信息，检查命令是否在远程服务器上存在。

## 安全建议

- 不要在配置文件中硬编码密码，建议使用私钥认证
- 将 `.remote-runner.json` 添加到 `.gitignore` 避免敏感信息泄露
- 使用最小权限原则配置 SSH 用户

## 使用场景

### 场景 1: 远程构建 C++ 项目

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

### 场景 2: 部署应用到服务器

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

### 场景 3: 执行系统维护命令

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

## 开发模式

如果想持续监听代码变化并自动重新编译：

```bash
npm run watch
```

然后可以修改 `src/` 目录下的任何 TypeScript 文件，代码会自动重新编译。

## 故障排除

### 问题：连接超时

**可能原因**：
- 服务器 IP 或端口错误
- 防火墙阻止了连接
- 服务器未运行 SSH 服务

**解决方案**：
- 检查配置文件中的 `host` 和 `port`
- 尝试用系统 SSH 客户端连接：`ssh user@host`

### 问题：认证失败

**可能原因**：
- 用户名或密码错误
- 私钥文件路径不正确
- 私钥格式不正确

**解决方案**：
- 手动测试 SSH 连接
- 检查私钥文件权限：`chmod 600 ~/.ssh/id_rsa`
- 确认使用的是正确的私钥格式（OpenSSH 格式）

### 问题：命令执行失败

**可能原因**：
- 命令在远程服务器上不存在
- 权限不足
- 工作目录不正确

**解决方案**：
- 先手动在远程服务器上测试命令
- 检查用户权限
- 在命令中先 `cd` 到正确的工作目录

## 贡献

欢迎提交 Issue 和 Pull Request！

开发流程：
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## License

MIT

## 作者

Galileo <1134271093@qq.com>
