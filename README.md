# QQ-avatar
一个简单的QQ头像获取工具

<img width="832" height="691" alt="image" src="https://github.com/user-attachments/assets/da165fec-1d01-4563-a65b-41838becde91" />

## 功能特点

- 支持通过QQ号获取用户头像
- 支持多种尺寸选择
- 防止暴露 QQ 号码

## 使用方法

### 基本用法

- `/`: 返回一个 HTML 页面，其中包含使用说明。
- `/avatar`: 获取默认尺寸 (100x100) 的头像。
- `/avatar/40`: 获取 40x40 尺寸的头像。
- `/avatar/100`: 获取 100x100 尺寸的头像。
- `/avatar/640`: 获取 640x640 尺寸的头像。

### 部署和配置

1.  **Fork 本仓库**

2.  **在 Cloudflare Workers 中创建新的 Worker**

3.  **选择您 Fork 的仓库**

4.  **在 Worker 的设置中，添加一个名为 `QQ_NUMBER` 的环境变量，并将其值设置为您要获取头像的 QQ 号码。**

### 示例

假设您的 Worker 部署在 `https://your-worker.your-domain.workers.dev`，并且您已将 `QQ_NUMBER` 设置为 `123456789`。

- 获取 100x100 头像: `https://your-worker.your-domain.workers.dev/avatar`
- 获取 40x40 头像: `https://your-worker.your-domain.workers.dev/avatar/40`
- 获取 640x640 头像: `https://your-worker.your-domain.workers.dev/avatar/640`
