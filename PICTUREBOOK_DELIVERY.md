# SC01 绘本实现交付报告

日期 2026-11-15

## 仓库与确认事项

- 实际目标 `N:\Sonata-Workspace\learning-app`。
- 基线提交 `409046201565756e9d120d58ca49eb6e9db68a3a`。本次未创建提交。
- 实现前 `git status --short` 为空。
- 与历史 outputs/learning-app 源码不一致，依据任务书更新后的第 9 节采用 N 盘仓库。
- 首页入口位于双模式卡片与现实任务之间，文案为“绘本阅读 · Sonata 的初次相遇”。
- 图像导出目录为 `public/picturebook/s01e01-sc01/`，九张均为 1920×1080 PNG，源文件只读。
- 无新增依赖。
- 语音不可用提示为“本机暂无可用的德语语音，请阅读字幕。”

## 文件清单

修改
- src/App.tsx — 接入绘本页面。
- src/services/learningProgress.ts — 仅扩充路由类型与解析，旧存储结构保持。
- src/pages/FamilyHome.tsx — 增加确认的入口卡片。

新增
- src/data/picturebook/s01e01-sc01.ts
- src/services/picturebookState.ts
- src/pages/Picturebook.tsx
- src/pages/Picturebook.css
- tests/picturebook.test.mjs
- public/picturebook/s01e01-sc01/S01E01_SC01_p01.png 至 p09.png
- PICTUREBOOK_DELIVERY.md

绘本使用独立存储键 kleine-welten-picturebook-v1。保存页码、字幕选择和竖屏提示偏好。

## 实际验证

- `git -C N:/Sonata-Workspace/learning-app status --short`，实现前通过，工作区干净。
- `node node_modules/typescript/bin/tsc -b`，两次通过。
- `node node_modules/vite/bin/vite.js build`，初次与修正重播后的构建均通过。
- `node --test tests/*.test.mjs`，原 6 项测试通过；新增后 11 项全部通过；最终重跑 11 项全部通过。
- 测试直接解析相邻 project-hub 的已发布原文，比对第 3–9 页共 14 句德语、中文和说话人顺序。9 张图片存在性与 PNG 尺寸通过。
- 存储保存恢复、损坏数据、无本机声音、旧六路由与新路由测试通过。
- 本地预览命令 `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5180 --strictPort` 启动成功。
- 浏览器 375×812 与 812×375 检查无横向滚动。测得 viewport/scrollWidth 分别为 375/360 和 812/797。
- 竖屏提示、字幕 A 与 B 选择、文字回退、九页顺序翻页与刷新恢复到第 9 页已经检查。
- 浏览器逐个打开原六个路由，main 均可见。
- 首次连续自动翻页在第 2 页等待语音完成时超时，后按可用的文字回退入口完成全书阅读。该次超时不计为通过。

## 遗留与限制

- 测试环境不能可靠播放本机德语语音，实际语音结束事件、0.5 秒后气泡出现的听觉体验与三角色声线仍需在装有德语声音的真实设备试听。代码仅选 localService 德语声音。
- 三种本机德语声音可用时分配不同声音，声音不足时复用可用声音，无声音时显示确认文案。
- 原始音效文件尚未提供。第 3 页热点临时使用 Web Audio 本地噪声合成的两种音效，非录制素材。未制作可选喵叫。
- 手动左右触摸滑动尚未在真实触屏设备验收。
- 当前气泡在插图下方逐句显示，以避免手机画面遮挡。尚未按每张插图把气泡精确定位到角色头部附近。这是与规格画面定位的差距。
- 热点位置为实现估计值，需要内容负责人结合插画复核。
- 对白原文比对测试需要相邻 project-hub 原文文件，单独复制 app 时应一并保留该只读测试输入。

## 本地预览

在目标仓库启动上述 Vite 命令，访问 http://127.0.0.1:5180/#/picturebook/s01e01-sc01 。也可从首页新增卡片进入。

附加检查：首次 git diff --check 发现三个文件末尾空行，已修正后重跑。

## 气泡与热点二次校准（2026-11-15）

本节更新前述“气泡尚未定位、热点仅估计”的状态。

- 逐张查看九张实际插图，校准 Sonata、孩子、工作人员、垃圾桶与落叶区域。布局配置新增于 src/data/picturebook/sceneLayouts.ts。
- 第4–9页宽屏采用角色锚点气泡与指向线，一次显示当前句，避免多气泡互相覆盖。此前已出现的对白放入“已读对白”展开区。
- 650px 以下采用画面下沿气泡，尖角按角色横坐标对齐。这是为长双语内容采用的响应式处理，未在小画面上强行覆盖角色。第1–2页继续使用独立旁白字幕条。
- 第7页孩子的手区域包含在孩子热点内，Sonata 重播第一句。第8页 Sonata/孩子分别重播第一/第二句。第9页工作人员/Sonata/孩子分别重播第一/第二/第三句。
- 修复此前 SONATA 大写说话人未正确匹配 Sonata 热点的映射问题。
- 修改 Picturebook.tsx、Picturebook.css，新增 sceneLayouts.ts，扩充 picturebook.test.mjs。
- 实际运行 tsc -b、vite build，均通过。node --test tests/*.test.mjs 共13项通过。
- 浏览器375×812逐页检查9页，scrollWidth均不大于375；所有热点测得宽高均不少于44px。宽屏1100×850查看了第7页角色气泡；浏览器实际点击Sonata确认显示第一句。
- 无声音环境仍以文字回退验收；真实设备语音、实际触屏滑动和正式录音素材的先前限制仍适用。

## 德语播放修复

本机注册表虽安装多个德语声音，传统 SAPI 可枚举的德语声音仅 Hedda。浏览器 speechSynthesis 无法稳定使用本机声线。

采用本机 SAPI Hedda 离线生成16段 WAV，存放 public/picturebook/s01e01-sc01/audio，未使用外部语音服务。原 audioId 的 mp3 标识保留，播放时映射为同名 wav。角色当前共享 Hedda，按角色调整语速，尚不满足三种独立声线。

Picturebook.tsx 优先用 HTMLAudioElement 播放本地音频。用户点击直接调用 play，切换热点和页面停止上一段，保留即时字幕与迷你气泡。自动播放被限制时提示点击闪光位置。关键词仍使用本机浏览器语音，单词独立朗读在缺少可用声线时仍可能不可用。

浏览器实际点击第1页 Sonata 与第9页孩子热点，均收到 playing 事件并显示“正在播放德语对白…”。该验证证明浏览器开始播放，未进行人工音质审听。

新增 WAV 容器、PCM 数据长度和非静音检查，合计14项测试通过。最终 tsc 与 Vite 构建通过。预览首次连接失败，重启5180端口后新标签页成功完成验证。
