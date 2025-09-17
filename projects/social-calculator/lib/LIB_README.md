如何在项目中维护本地 Bootstrap 文件

目的

- 将外部 CDN 依赖移到本地 `lib/` 目录，便于离线使用、版本管理和自托管。

包含文件

- bootstrap.min.css
- bootstrap.bundle.min.js

下载来源

- 官方 CDN（推荐）：https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/
- 官方发布页：https://getbootstrap.com/

维护步骤

1. 检查当前版本：查看 `lib/` 中的文件头部注释或 `package.json`（如果有）。
2. 下载最新或指定版本文件：

   - 将 `bootstrap.min.css` 放到 `lib/`。
   - 将 `bootstrap.bundle.min.js` 放到 `lib/`。

   Windows 命令行示例 (使用 curl，Windows 10/11 自带或在 PowerShell 中使用 Invoke-WebRequest)：

   使用 curl (cmd.exe):
   curl -L -o lib\\bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
   curl -L -o lib\\bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js

   使用 PowerShell (Invoke-WebRequest):
   Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" -OutFile "lib\\bootstrap.min.css"
   Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" -OutFile "lib\\bootstrap.bundle.min.js"

   手动下载：在浏览器中打开上面的 CDN 链接，保存为 `lib/bootstrap.min.css` 和 `lib/bootstrap.bundle.min.js`。

3. 测试：在浏览器打开 `projects/social-calculator/index.html`，确认样式和交互正常。
4. 提交：将 `lib/` 文件添加到版本控制并写明变更说明。

建议

- 在大项目中使用包管理工具（npm/yarn）来维护依赖；在本示例中我们使用手动下载以保持简单。
- 记录版本号，例如在 `LIB_README.md` 或 `package.json` 中注明 Bootstrap 版本。
