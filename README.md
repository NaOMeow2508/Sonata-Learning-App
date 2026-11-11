# Kleine Welten — 家庭双轨学习 MVP

React + TypeScript + Vite，手机优先，无账号、无后端、无付费 API。

## 启动与预览

项目目录就是本 README 所在的 `outputs/learning-app`。在此目录打开终端。

一般安装有 Node.js 的电脑（建议 Node.js 22.18+）：

```sh
npm install
npm run dev
```

当前 Codex 电脑已有 Node.js 和项目依赖，但 npm 不在 PATH 中。最简单的启动方式：双击本目录的 `start.cmd`。也可以在 PowerShell 运行：

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1
```

打开终端显示的地址，通常是 http://127.0.0.1:5173 。端口被占用时使用终端实际显示的地址。保持终端运行，Ctrl+C 停止。不要直接双击 index.html。

当前机器的包管理器：

```powershell
& 'C:/Users/MaNin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd' install
& 'C:/Users/MaNin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd' run build
```

默认服务器仅本机访问，没有发布到公网。手机布局可在浏览器开发者工具的设备模拟中查看。

## 六个页面与路由

- `#/home`：家庭首页，儿童和母亲入口。
- `#/map`：儿童冒险地图，首章可用，后续章节只是明确标记的预告。
- `#/story`：Lumo 分类游戏，3 个物品、语音入口、提示、暂停继续。
- `#/mother`：母亲学习中心，A1、课程内容与学习记录。
- `#/lesson`：词汇 → 句子 → 两道互动练习。
- `#/tasks`：现实家庭任务，逐项勾选。

地址使用 hash 路由，刷新与浏览器前进、后退均可工作，未来静态托管无需额外路由重写配置。

## 示例体验

儿童：进入冒险地图 → 首章 → 将报纸放入纸类、香蕉皮放入厨余、空塑料酸奶杯放入包装 → 每次点击“下一个”，最后“完成冒险”。答错只给提示，不扣分。

母亲：学习中心 → 3 个词汇 → 2 句表达 → 两道练习。正确检查答案后才能继续；错误答案可重选，没有次数限制。

现实任务：准备干净报纸和纸盒，在成人陪同下分类并说出德语句子，稍后回来勾选。不要求照片或上传。

## 代码结构

```text
src/
  App.tsx                      六页导航、模式切换与共享状态
  main.tsx                     React 入口
  styles.css                   手机和桌面布局
  types.ts                     页面参数类型
  data/content.ts              双语课程、物品、词汇、句子和任务
  services/learningProgress.ts 本地存储、数据校验、进度转换和路由解析
  components/Lumo.tsx           本地 SVG 角色，不依赖外链图片
  components/SpeakButton.tsx    本机语音与不支持时的文字提示
  pages/                       六个独立页面组件
 tests/learning.test.mjs        6 项自动测试
```

## 数据与语言

- 进度保存在 localStorage 的 `kleine-welten-v1` 中，带版本号和输入校验。
- 儿童和母亲独立保存学习位置、暂停与完成状态；任务勾选、界面语言也保存。
- 每次点击“下一个/继续/完成”记录一个学习步骤；尚未确认继续的答案提示不跨刷新保存。
- 重玩或重新学习会从该路线第一步开始；另一条路线与家庭任务保持不变。
- 清除浏览器数据、换设备或换端口会得到不同的本地记录，不存在跨设备同步。
- 中文 / 德语切换位于顶部。德语课程保留中文译文，便于对照学习。
- 内容配置采用 `{zh, de}`；新增课程可先扩展 content，再将单章节进度改为按 chapterId 存储。
- 不收集姓名、年龄、录音、照片或其他儿童个人信息；没有广告、排名、打卡惩罚或统计 SDK。
- 所有页面无外部网站跳转入口，儿童页不会直接跳转外链。

## 语音与离线边界

只调用浏览器语音合成中的本机 `localService` 声音，不接入云端语音或 AI 服务。不保证每台设备已安装中德语音；缺少声音时显示文字提示。不会自动播放，不会打开麦克风。

资源与角色图形均在项目内，没有远程字体或图片。当前未安装 Service Worker、未启用 PWA，关闭本地服务器后不可继续加载应用。后续可为构建产物增加 manifest、应用图标、缓存版本和升级策略；不要把“进度本地保存”当作已实现完整离线缓存。

## 检查

```sh
npm run build
npm test
```

当前电脑无需 npm 的等效命令：

```powershell
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build
node --test tests/*.test.mjs
```

自动测试覆盖：正确和错误分类、暂停阻止推进、双轨独立性、保存恢复、异常数据与存储不可用、六路由回退、章节答案完整性。

## 内容参考

- 德国联邦环境局： https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/richtiger-muelltrennung-ressourcen-schonen-umwelt
- 德国联邦环境部门（废纸）： https://www.bundesumweltministerium.de/themen/kreislaufwirtschaft/abfallarten/altpapier/altpapier-verbrauchertipp
- 德国联邦环境部门（厨余）： https://www.bundesumweltministerium.de/themen/kreislaufwirtschaft/abfallarten-und-abfallstroeme/bioabfaelle/was-gehoert-in-die-biotonne

垃圾桶颜色与具体收集规则可能因地区而异，实际处理以当地规定为准。来源仅列在开发文档中，应用儿童页面没有外链。
