# 树洞诗集 🌙

输入一句今天的心情，树洞为你写一首小诗——诗在暖光中浮现，停留片刻，如光尘般慢慢散开消失。不需要保存，只留那一刻的治愈感。

## 功能

- 输入一句话，自动识别 8 类情绪（开心 / 平静 / 难过 / 疲惫 / 焦虑 / 思念 / 孤独 / 愤怒）
- 本地诗库（8 类 × 10 首，现代诗与古风混合）即时出诗，离线可用
- 背景为《Duas in the Dark》绘本原图，每 18 秒缓慢轮换 + 缓慢运镜，鼠标移动有视差
- 写信的交互：奶油信纸卡片 + 一支小蜡烛，「点蜡烛 / 按回车」寄出心事
- 诗逐字浮现，停留约 10 秒后如光尘散开（带光晕脉冲）；点击屏幕 / 按 Esc 可提前散开
- 展示期间可「换一首」，也可「让 AI 写」调用大模型生成独一无二的诗
- 大量动效：信纸抬起、火焰摇曳、按钮手绘下划线、涂鸦漂浮、星星微光……
- 每次点击都有合成音效（点击 / 悬停 / 提交风铃 / 散开风声），全部 Web Audio 生成
- 柔和环境音（风声 + 呼吸感，默认关闭，右上角可开关）
- 无保存、无历史、无记录；响应式适配手机与桌面

> 背景插画说明：`src/assets/backgrounds/` 中的 6 张插画来自 Behance 项目
> 《Duas in the Dark | Bedtime Picture Book》（插画：Anya Belfer，书籍由 Maria Adnan 创作）。
> 插画版权归原作者所有，本作品为个人练习使用；若对外公开发布，请替换为自有素材或联系原作者获得授权。

## 本地开发

```bash
npm install
npm run dev        # 开发服务器 http://localhost:5173
npm test           # 单元测试（情绪识别 + 诗库完整性）
npm run build      # 构建到 dist/（相对路径，可直接部署到任意静态托管）
npm run preview    # 本地预览构建产物
```

## 技术栈

- Vite + 原生 JS/CSS（零运行时依赖，构建产物 < 25 kB）
- Cloudflare Workers：AI 写诗代理（隐藏大模型 Key）
- GitHub Actions：自动部署 GitHub Pages（静态站）与 Cloudflare Worker（AI 代理）

## 部署

### 1. GitHub Pages（静态站，自动）

把项目推到 GitHub 仓库后，`deploy-pages.yml` 会在每次 push 到 `main` 时自动构建并部署。

首次需要：仓库 Settings → Pages → Source 选择 **GitHub Actions**。

### 2. Cloudflare Worker（AI 代理）

1. 在 Cloudflare 创建 Worker（或直接用本仓库的 `worker/` 目录与 `deploy-worker.yml`）。
2. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

   | Secret | 说明 |
   | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（权限含 Workers Scripts: Edit） |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
   | `DEEPSEEK_API_KEY` | 大模型 API Key（默认 DeepSeek） |
   | `ALLOWED_ORIGIN` | 允许的前端来源，如 `https://yourname.github.io`（可多个，逗号分隔） |

   也可通过 Worker 环境变量改用任意 OpenAI 兼容接口：`BASE_URL`、`MODEL`（如 `BASE_URL=https://api.openai.com/v1` + `MODEL=gpt-4o-mini`，此时用 `OPENAI_API_KEY`）。

3. Worker 部署完成后，把地址填到 `src/api.js` 的 `WORKER_URL`：

   ```js
   const WORKER_URL = "https://treehole-poetry.yourname.workers.dev";
   ```

   然后重新 push，站点即可使用「让 AI 写」。

> 未配置 `WORKER_URL` 时，「让 AI 写」会显示柔和提示并自动回落本地诗库，站点仍完整可用。

## 目录结构

```
treehole-poetry/
├── src/
│   ├── main.js       # 入口：状态机、光尘粒子、事件
│   ├── style.css     # 暖光树洞视觉
│   ├── poems.js      # 本地诗库（8 类 × 10 首）
│   ├── mood.js       # 关键词情绪识别
│   ├── scatter.js    # 逐字浮现 + 散开消失动画
│   ├── audio.js      # Web Audio 环境音
│   ├── api.js        # AI 写诗客户端（Worker 代理）
│   └── test/         # Vitest 单元测试
├── worker/
│   ├── index.js      # Cloudflare Worker 代理（隐藏 Key）
│   └── wrangler.toml
└── .github/workflows/
    ├── deploy-pages.yml    # GitHub Pages 自动部署
    └── deploy-worker.yml   # Cloudflare Worker 自动部署
```
