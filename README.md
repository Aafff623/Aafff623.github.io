# 项目总览介绍:

## 是什么?

这是一个基于本人现有的技术配合 ds 生成的简陋 web 个人导航界面,后续随着技术的精进来进一步地维护,包括不限于:

- 个性化布局美化内容界面
  - 实现样式组件的多元化
  - 实现互动,丰富与访问者的交互感
  - 其他…..
- blog 界面中同步 OBsidian 技术笔记
  - 包括个人的 ds 制定的 WeekDaily 技术学习路线
  - 对学习内容的笔记整理
  - 其他……

## 维护日志:

- **_2025-09-01-2025-09-07_**
  - **task:** 用 github 学生包申请了域名 threetwoa.me,并萌生出打造个性化 blog 界面并使之集成多种功能的想法
- **_2025-09-08:_**
  - **task:** 用 hugo 搭建个人 blog 界面链接到"个人博客"板块
  - **技术学习记录:** hugo+githubPages 的配置 与 github 夸仓库链接的跳转
- **_2025-09-09:_**
  - **task:** 把昨晚做成的"简易记事本"在线页面集成到项目展示板块中
  - **技术学习记录:** 将主仓库文件夹进行分类,通过 ds 询问方向促学
- **_2025-09-14:_**
  - **task:** ui,组件,收纳框,头像,icon,动态 json 组件插入,之后打算调整排版,用 Tailwind 再写一个网页的版本,lottie 替换静态组件
  - **技术学习记录:** Iconscout,iconfont,lottie
- **_2025-09-16:_**
  - **task:** 完善 Hugo 博客系统，添加内容同步、部署自动化和完整使用指南
  - **技术学习记录:** PowerShell 脚本编写，Hugo 主题配置，GitHub Pages 部署自动化

---

## 🚀 Hugo 博客使用指南

### 📁 博客项目结构

```
D:\Blog\my-hugo-blog\
├── content\           # 博客内容 (从 Obsidian 同步)
├── themes\            # Hugo 主题 (PaperMod)
├── public\            # 生成的静态文件
├── static\            # 静态资源
├── hugo.yaml          # Hugo 配置
├── sync-content.ps1   # 内容同步脚本
├── manage-blog.ps1    # 博客管理脚本
├── deploy.ps1         # 自动部署脚本
└── deploy-guide.md    # 部署指南
```

### 🔄 写作工作流

1. **在 Obsidian 中写作** - 在 `D:\OneDrive\Desktop\Notes\Obsidian-Notes\threetwoa` 目录下创建/编辑 `.md` 文件
2. **同步内容** - 运行 `.\sync-content.ps1` 将 Obsidian 笔记同步到 Hugo
3. **本地预览** - 使用 `.\manage-blog.ps1` 启动本地服务器测试
4. **构建部署** - 运行 `.\deploy.ps1` 自动构建并部署到 GitHub Pages

### ⚙️ 核心脚本说明

#### 内容同步脚本 (sync-content.ps1)

- 自动将 Obsidian 笔记复制到 Hugo content 目录
- 保持目录结构，支持子文件夹
- 排除 `.obsidian` 系统文件

#### 博客管理脚本 (manage-blog.ps1)

- 提供菜单式操作界面
- 支持本地预览、内容同步、清理缓存等功能

#### 自动部署脚本 (deploy.ps1)

- 构建静态文件
- 提交到 Git 仓库
- 推送到 GitHub Pages 分支

### 📊 当前状态

- ✅ Hugo v0.150.0 已安装
- ✅ PaperMod 主题已配置
- ✅ 本地预览正常 (http://localhost:1313/threetwoa-hugoBlog/)
- ✅ 静态构建成功
- ✅ 部署脚本就绪

### 🔧 常用命令

```powershell
# 同步 Obsidian 内容
.\sync-content.ps1

# 本地预览 (完整路径方式)
& "C:\Users\Lenovo\AppData\Local\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe" server --buildDrafts

# 构建静态文件
& "C:\Users\Lenovo\AppData\Local\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe" --minify

# 自动部署
.\deploy.ps1
```

### 📝 注意事项

- 确保 Obsidian 笔记使用正确的 YAML frontmatter 格式
- 博客 URL: http://threetwoa.me/threetwoa-hugoBlog/
- 如遇问题可查看 `deploy-guide.md` 获取详细说明

---

_Hugo 博客系统最后更新：2025 年 9 月 16 日_
