# AIGC 提示词库设计文档 (AIGC Prompt Library Design Doc)

## 1. 项目概述
建立一个可视化的 AI 提示词（Prompt）管理与展示平台。核心价值在于将枯燥的文本提示词结构化、可视化，并将提示词中的“变量”提取为可交互的标签，方便用户理解和复用。

**设计原则：**
*   **模块化 (Modular):** 严禁单体巨型文件，UI 组件、业务逻辑、数据层必须分离。
*   **健壮性 (Robust):** 使用强类型语言，确保数据流转的可维护性。
*   **极简主义 (Minimalist):** 优先实现核心链路，不做过度设计，便于后续迭代。

---

## 2. 技术栈选择 (Simple & Robust)

*   **前端框架:** **Next.js 14+ (App Router)**
    *   *理由:* 业界标准，路由管理简单，服务端渲染 (SSR) 对 SEO 友好，便于分享提示词卡片。
*   **语言:** **TypeScript**
    *   *理由:* 提供类型安全，防止变量传递中的低级错误，保证“健壮性”。
*   **样式:** **Tailwind CSS**
    *   *理由:* 原子化 CSS，非常适合实现截图中的“黑边框、卡片式”风格，开发速度快。
*   **数据库 & 存储:** **Supabase (PostgreSQL)**
    *   *理由:* 开箱即用的 Postgres 数据库 + **文件存储 (Storage)**。主要解决了图片托管和结构化数据查询的麻烦，比自己搭建 MinIO 或 S3 更轻量。
*   **图标库:** **Lucide React**
    *   *理由:* 风格统一，轻量。

---

## 3. 核心功能模块划分

系统分为以下核心区域，对应前端路由：

1.  **模版区 (Templates):** 核心展示流。
    *   *单个模版 (Single):* 基础单元，一张图 + 一段带变量的提示词。
    *   *综合套图 (Collection):* 一个父级容器，包含多个“单个模版”。
2.  **图片功能区 (Tools):** 特定功能的提示词集合（如：扩图、修复）。
3.  **特效区域 (Effects):** 风格化提示词（如：剪纸风、赛博朋克）。
4.  **综合案例区 (Showcase):** 优秀成品展示。

---

## 4. 数据库模型设计 (Schema)

### 4.1 `prompts` (核心提示词表)
存储单个提示词卡片的信息。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | UUID | 主键 |
| `title` | String | 标题 (如：设备的爆炸图) |
| `content_raw` | Text | 原始提示词文本，包含变量语法 (如 `[SUBJECT]`) |
| `main_image_url` | String | 主展示图 URL |
| `category` | String | 分类 (Template, Effect, Tool, Showcase) |
| `author` | String | 作者名/ID |
| `created_at` | Date | 创建时间 |
| `parent_id` | UUID | (可选) 若属于套图，指向父级 Collection ID |

### 4.2 `collections` (套图/综合体表)
用于聚合多个 Prompt。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | UUID | 主键 |
| `title` | String | 套图标题 |
| `cover_image` | String | 套图封面 |
| `description` | Text | 描述 |

### 4.3 `variables` (变量标签定义)
用于定义提示词中 `[变量]` 的属性（颜色、默认值等）。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `key` | String | 变量键名 (如 "SUBJECT") |
| `label_cn` | String | 中文显示名 (如 "主体") |
| `default_value` | String | 默认填充值 |
| `color_theme` | String | 标签颜色风格 (blue, green, yellow) |

---

## 5. 前端模块化目录结构 (关键)

为了防止代码臃肿，我们将严格按照功能拆分文件：

```text
src/
├── app/                    # 页面路由 (Next.js App Router)
│   ├── layout.tsx          # 全局布局 (导航栏, Footer)
│   ├── page.tsx            # 首页 (瀑布流展示)
│   ├── template/
│   │   ├── [id]/page.tsx   # 详情页
│   │   └── page.tsx        # 模版区列表
│   ├── effects/page.tsx    # 特效区列表
│   └── showcase/page.tsx   # 案例区列表
│
├── components/             # 组件库
│   ├── ui/                 # 基础原子组件 (按钮, 卡片容器)
│   │   ├── Button.tsx
│   │   ├── Card.tsx        # 带黑边框风格的卡片基座
│   │   └── Badge.tsx
│   │   
│   ├── business/           # 业务组件
│   │   ├── PromptCard.tsx  # 列表中的单个卡片
│   │   ├── PromptParser.tsx# 核心：将文本解析为带高亮标签的组件
│   │   ├── VariableTag.tsx # 可交互的变量标签
│   │   └── ImageViewer.tsx # 图片预览组件
│   │   
│   └── layout/             # 布局组件
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── lib/                    # 工具函数与类型定义
│   ├── types.ts            # TypeScript 接口定义
│   ├── supabase.ts         # 数据库连接客户端
│   └── parser-utils.ts     # 正则表达式逻辑 (解析 [ ] 语法)
│
└── styles/
    └── globals.css         # 全局样式 (Tailwind 引入)
```

---

## 6. 关键逻辑实现思路

### 6.1 提示词变量解析器 (`PromptParser.tsx`)
这是本项目的核心亮点。

1.  **存储格式：** 数据库存储原始文本：
    `"创建一个 [1080x1080] 尺寸的 [SUBJECT] 技术爆炸图。"`
2.  **解析逻辑：**
    前端组件接收文本字符串，使用正则 `r/\[(.*?)\]/g` 进行分割。
3.  **渲染逻辑：**
    *   普通文本 -> 渲染为 `<span>`。
    *   匹配到的 `[xxx]` -> 渲染为 `<VariableTag name="xxx" />` 组件。
4.  **交互：**
    点击 `<VariableTag>` 可以弹窗输入替换内容，或者仅仅作为高亮显示。

### 6.2 视觉风格 (Design Token)
参考截图，在 `tailwind.config.ts` 中预设风格：

*   **边框:** `border-2 border-black` (所有卡片、按钮)
*   **阴影:** `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` (硬阴影)
*   **圆角:** `rounded-none` 或微圆角 `rounded-sm`
*   **字体:** 建议使用无衬线字体，标题加粗。

---

## 7. 开发步骤 (Roadmap)

1.  **Phase 1: 脚手架与数据库 (Day 1)**
    *   初始化 Next.js 项目。
    *   配置 Tailwind CSS 样式系统。
    *   在 Supabase 建立 `prompts` 表，并上传几张测试图片。

2.  **Phase 2: 核心组件开发 (Day 2)**
    *   开发 `Card` (基础卡片) 和 `VariableTag` (变量标签)。
    *   实现 `PromptParser` 逻辑，确保文本能正确转为“文本+标签”的混合体。

3.  **Phase 3: 页面组装 (Day 3)**
    *   实现首页瀑布流布局。
    *   实现详情页，展示大图和完整的提示词编辑器。

4.  **Phase 4: 分类与优化 (Day 4)**
    *   添加“模版”、“特效”等分类筛选。
    *   优化移动端适配。

---

## 8. 待办事项 (TODO)
*   [ ] 确定具体的变量语法（是仅支持 `[]` 还是支持更高级的参数）。
*   [ ] 收集第一批种子数据（图片+提示词）。

---

## 9. 变更记录 (Changelog)

### 2025-11-29
*   **[PromptCard]** 将“立刻尝试”按钮修改为“复制提示词”功能。
    *   点击按钮后，提示词原文将被复制到剪贴板。
    *   按钮文案改为“复制提示词” (icon: Copy)，复制成功后短暂显示“✓ 已复制”。
*   **[Feature]** 新增“提交提示词”功能模块。
    *   新增路由 `/submit`。
    *   支持图片预览、提示词实时解析预览、元数据录入。
    *   按钮文案改为“复制提示词” (icon: Copy)，复制成功后短暂显示“✓ 已复制”。
