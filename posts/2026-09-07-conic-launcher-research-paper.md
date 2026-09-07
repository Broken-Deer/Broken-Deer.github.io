---
title: "Conic Launcher: 基于多模态异构架构的轻量级沙盒世界资源调度系统"
description:
    - 一篇不存在的学术论文。把 Conic Launcher 包装成了科研项目，纯属整活，数据全是编的，但项目是真的。
author: "OakChaser"
minutes: 8
date: "2026-09-07"
tags:
    - Conic
    - Fun
    - Note
---

> 起因是看到群友调侃诡异的保研机制，于是出于整活目的，让 AI 把项目包装成了科研成果（笑）。

## A Lightweight Scheduling System for Sandbox World Resources Based on Multi-Modal Heterogeneous Architecture

---

**作者（Authors）：**

OakChaser¹²\*，ConicMC 研究组²

¹ 湖南大学计算机科学与技术学院，长沙 410082
² ConicMC 开源实验室（Open-Source Laboratory）

\* 通讯作者邮箱：oakchaser@conicmc.dev

---

**摘要（Abstract）**

针对沙盒游戏环境中资源异构性强、跨平台调度复杂、多人协同延迟高等核心挑战，本文提出了一种基于 Rust-Vue 异步通信范式的轻量级全栈调度系统——Conic Launcher。该系统采用 19 个领域隔离的功能域插件架构，通过 Tauri IPC 机制实现类型安全的前后端协同，支持 5 种异构计算内核（Vanilla/Fabric/Forge/NeoForge/Quilt）的统一调度。实验结果表明，本系统在 8 路并发下载场景下实现了基于最少连接数的镜像负载均衡，游戏实例启动延迟较基线方案降低 37.2%。此外，本研究首次将基于 FFmpeg 的梅尔频谱图分析与 2D 物理引擎集成于游戏启动器界面，实现了自适应音频可视化，并在 12 种语言环境下完成了国际化验证。本系统已开源，累计支持 6 个目标平台的原生部署。

**关键词（Keywords）：** 沙盒世界资源调度；异构插件架构；跨平台协同；并发下载优化；音频频谱分析；多语言国际化

---

## 1. 引言（Introduction）

### 1.1 研究背景

沙盒游戏《Minecraft》（Mojang Studios, 2011）作为全球月活超 1.4 亿的现象级应用，其生态系统的复杂性已远超传统游戏范畴。据统计，仅 Modrinth 平台托管的模组（Mod）数量已超过 **42 万个**，涵盖从物理模拟、渲染引擎到机器学习推理等广泛领域。然而，现有的资源调度工具面临以下核心瓶颈：

1. **计算内核异构性（Compute Kernel Heterogeneity）**：Fabric、Forge、NeoForge、Quilt 等模组加载器各自维护独立的依赖解析图谱，版本继承链深度可达 7 层以上，传统拓扑排序算法难以高效处理；
2. **跨平台调度开销（Cross-Platform Scheduling Overhead）**：主流调度工具在 Windows/macOS/Linux 三平台的部署一致性不足 63%；
3. **多人协同延迟（Multiplayer Collaboration Latency）**：基于 TCP 的传统局域网方案在 NAT 穿透场景下的成功连接率仅为 41%。

### 1.2 本文贡献

本文的主要贡献包括：

- **提出 Domain-Isolated Plugin（DIP）架构**，实现了 19 个功能域的完全隔离与类型安全协同；
- **设计 Mirror-Aware Concurrent Downloader（MACD）引擎**，支持 8 路并发下载与最少连接数负载均衡；
- **首次将动态链接库 FFI（Runtime FFI）引入游戏启动器**，实现了基于 SHA-256 完整性校验的安全库加载；
- **构建 Conic Nexus 网状网络协议**，基于 EasyTier 实现跨 NAT 的 P2P 多人联机；
- **开发自适应音频频谱分析模块**，将 ML 推理结果与 Canvas 渲染管线深度融合。

---

## 2. 系统架构（System Architecture）

### 2.1 整体架构设计

Conic Launcher 采用前后端分离的异构计算架构，如 Fig. 1 所示：

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vue 3 + TypeScript)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ GameView │ │LaunchView│ │Settings  │ │Accounts  │   │
│  │          │ │          │ │View      │ │View      │   │
│  └─────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│        │           │            │             │          │
│  ┌─────┴───────────┴────────────┴─────────────┴─────┐   │
│  │            Overlay System (osu!-style)            │   │
│  │  DialogRoot │ InstanceSetting │ CommandPalette   │   │
│  │  MusicPlayer│ ContentPanels(28)│ Dialogs(17)     │   │
│  └─────────────────────┬────────────────────────────┘   │
│                        │ Tauri IPC                       │
├────────────────────────┼────────────────────────────────┤
│                    Backend (Rust 2024)                   │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Core   │ │ Download│ │ Install  │ │   Launch    │  │
│  │ (Tauri) │ │ Engine  │ │ Pipeline │ │ Orchestrator│  │
│  └────┬────┘ └────┬────┘ └────┬─────┘ └──────┬──────┘  │
│       │           │           │               │         │
│  ┌────┴───────────┴───────────┴───────────────┴─────┐   │
│  │           Tauri Plugin System (19 crates)         │   │
│  │  account│config│instance│modrinth│multiplayer│... │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       │ FFI Boundary                    │
│  ┌──────────────┐ ┌───┴────────┐ ┌─────────────────┐   │
│  │ Conic Nexus  │ │ Beat This  │ │ conic-worldmap  │   │
│  │ (Mesh Net)   │ │ (ML Audio) │ │ (World Render)  │   │
│  └──────────────┘ └────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Fig. 1** Conic Launcher 系统架构图。上层为 Vue 3 前端 SPA，下层为 Rust 异构计算后端，中间通过 Tauri IPC 机制实现双向类型安全通信。

### 2.2 前端视图状态机

系统前端采用 **osu! 风格的全屏视图切换范式**，通过 `navigationStore` 管理视图状态转移，定义如下状态转移函数：

```
δ: View × Event → View

其中 View ∈ {GameView, LaunchView, SettingsView, AccountsView, SetupWizard}
Event ∈ {NAVIGATE, BACK, RESET}
```

每个视图配备独立的子组件树，通过 Vue 3 Composition API 的响应式语义实现细粒度状态绑定。Overlay 系统作为持久化层级（persistent layer），独立于视图状态机运行，支持 28 个内容面板和 17 个对话框的动态挂载。

### 2.3 国际化框架

系统实现了 12 种语言的完全国际化支持，覆盖以下语言族：

| 语系                | 语言                     | 复数规则                    |
| ------------------- | ------------------------ | --------------------------- |
| 汉藏语系            | 简体中文、繁体中文       | 单形式                      |
| 日语族              | 日语                     | 单形式                      |
| 朝鲜语族            | 韩语                     | 单形式                      |
| 印欧语系·日耳曼语族 | 德语                     | 二形式                      |
| 印欧语系·罗曼语族   | 法语、西班牙语、葡萄牙语 | 二形式                      |
| 印欧语系·斯拉夫语族 | 俄语、波兰语             | 四形式（zero/one/few/many） |
| 突厥语族            | 土耳其语                 | 单形式                      |

特别地，俄语和波兰语的四形式复数规则通过自定义 `slavicPluralRules` 函数注册至 vue-i18n 运行时，确保形态学一致性的正确维护。

---

## 3. 核心算法设计（Core Algorithm Design）

### 3.1 多模态计算内核统一调度算法

**问题定义：** 给定用户请求的计算内核类型 τ ∈ {Vanilla, Fabric, Forge, NeoForge, Quilt}，系统需要从 N 个异构源中调度最优的依赖包集合 D*，使得：

```
D* = argmin_D { Σ cost(d_i) | d_i ∈ D, resolve(D, τ) = ✓ }
       D
```

其中 resolve(D, τ) 为约束满足函数，确保依赖图的拓扑一致性。

**算法实现：** 我们设计了基于继承链遍历（Inheritance Chain Traversal）的依赖解析算法。对于 Forge/NeoForge 等需要执行外部安装器的内核，算法通过以下步骤实现：

1. 下载安装器 JAR 文件；
2. 通过 Java 子进程执行安装器（Step 2a：提取 forge-install-bootstrapper）；
3. 从安装器 JAR 中预取库文件清单；
4. 通过 MACD 引擎并行下载依赖库。

该算法在处理深度为 7 层的继承链时，平均解析时间仅为 **12.3ms**，较朴素递归方案提升 5.8 倍。

### 3.2 Mirror-Aware Concurrent Downloader (MACD)

#### 3.2.1 镜像负载均衡策略

系统实现了基于 **最少连接数（Least Connections）** 的镜像负载均衡算法。每个镜像维护一个原子计数器 C_m，表示当前活跃连接数。对于新下载任务，选择策略为：

```
m* = argmin C_m
     m ∈ M_active
```

其中 M_active 为当前可用镜像集合。当某个镜像连续失败次数超过阈值 θ=5 时，该镜像被标记为 disabled 并从活跃集合中移除。

#### 3.2.2 并发下载管线

下载引擎采用基于 `futures::stream::try_for_each_concurrent(8)` 的 8 路并发管线，结合以下优化策略：

- **预验证（Pre-verification）**：使用 `rayon` 并行遍历已存在的文件，通过 SHA-1/SHA-256/SHA-512 计算校验和，跳过已完整文件的下载；
- **速率限制（Rate Limiting）**：通过异步计时器实现可配置的最大下载速度限制，采用反压（backpressure）机制防止内存溢出；
- **滚动测速（Rolling Speed Meter）**：采用 20 个采样点、2 秒间隔的滑动窗口计算实时下载速率。

#### 3.2.3 实验结果

在 100MB 文件下载基准测试中，MACD 引擎在 3 镜像配置下的性能表现如下：

| 指标         | 单镜像    | 双镜像    | 三镜像（MACD） |
| ------------ | --------- | --------- | -------------- |
| 平均吞吐量   | 12.4 MB/s | 21.7 MB/s | **28.3 MB/s**  |
| P99 延迟     | 8.2s      | 4.7s      | **3.1s**       |
| 失败恢复时间 | 30.0s     | 15.0s     | **5.0s**       |

### 3.3 游戏时间推断算法（Playtime Inference from Compressed Logs）

**问题：** Minecraft 的日志文件以 gzip 格式压缩存储（`*.log.gz`），需要从压缩字节流中直接提取时间戳以计算游戏时长。

**算法设计：** 我们提出了一种 **字节级时间戳解析算法（Byte-Level Timestamp Parser, BLTSP）**，绕过完整的 gzip 解压过程，在压缩字节流中直接定位 `[HH:MM:SS]` 格式的时间戳模式：

```
Algorithm 1: BLTSP
Input: Compressed log stream S
Output: Total playtime T

1: T ← 0
2: for each chunk C in S do
3:     for each byte position p in C do
4:         if C[p..p+2] = "[" AND C[p+3] = digit AND C[p+6] = ":" then
5:             t_parse ← parse_timestamp(C[p..p+10])
6:             if t_min = ∅ then t_min ← t_parse
7:             t_max ← max(t_max, t_parse)
8:     end for
9: end for
10: T ← t_max - t_min
11: return T
```

该算法通过 `rayon` 的并行迭代器实现多文件并行处理，在包含 50 个压缩日志文件的实例上，总解析时间仅为 **47ms**。

### 3.4 Conic Nexus 网状网络协议

#### 3.4.1 动态库加载与安全校验

Conic Nexus 采用运行时动态链接库加载（Runtime Dynamic Library Loading）架构，核心安全流程如下：

```
┌──────────────┐    SHA-256     ┌──────────────┐    C ABI    ┌──────────┐
│ .dll/.so/.dylib │ ──校验──→ │ libloading   │ ──加载──→  │ FFI 调用  │
│ (libconic_nexus)│            │ (安全沙箱)    │            │ (P2P 网络)│
└──────────────┘              └──────────────┘            └──────────┘
```

每次加载前，系统计算动态库文件的 SHA-256 哈希值并与预存值比对，确保完整性。库通过 C ABI 接口暴露以下核心操作：

```rust
#[repr(C)]
struct ConicNexusConfig {
    room_code: *const c_char,
    peer_name: *const c_char,
    // ...
}

extern "C" {
    fn conic_nexus_create(config: *const ConicNexusConfig) -> *mut ConicNexusState;
    fn conic_nexus_poll_event(state: *mut ConicNexusState) -> Option<ConicNexusEvent>;
    fn conic_nexus_free_state(state: *mut ConicNexusState);
}
```

#### 3.4.2 NAT 穿透与网状组网

基于 EasyTier 框架，Conic Nexus 实现了以下组网拓扑：

- **主机模式（Host Mode）**：创建房间并监听连接；
- **客户端模式（Guest Mode）**：通过房间码加入现有网络；
- **网状拓扑（Mesh Topology）**：所有节点互相连接，支持任意节点间直接通信。

事件驱动架构采用后台轮询线程持续排空库的事件队列，并通过 Tauri 事件系统向前端广播状态变更，同时定期进行状态对账（state reconciliation）以捕获丢失事件。

### 3.5 自适应音频频谱分析

#### 3.5.1 梅尔频谱图计算

系统通过 FFI 调用原生 ML 推理库，对音频文件进行以下分析：

1. **节拍检测（Beat Detection）**：输出节拍时间序列 B = {b₁, b₂, ..., bₙ}；
2. **重拍检测（Downbeat Detection）**：输出重拍时间序列 D = {d₁, d₂, ..., dₘ}；
3. **梅尔频谱图（Mel Spectrogram）**：输出张量 M ∈ ℝ^{1×T×128}，帧率 50fps；
4. **原始 logits**：输出每帧的节拍/重拍原始得分。

分析结果通过 SHA-256 哈希键缓存，避免重复计算。

#### 3.5.2 自适应 FFT 频谱可视化

BeatMap 可视化组件实现了以下自适应算法：

```
Algorithm 2: Adaptive FFT Sizing
Input: desiredBars B, sampleRate R
Output: fftSize N

1: N ← 32
2: while N < B × 2 AND N ≤ MAX_FFT do
3:     N ← N × 2
4: end while
5: return N
```

可视化管线支持：

- **对数频率缩放**：将线性频率轴映射到对数空间，符合人耳感知特性；
- **频率范围裁剪**：可配置的上下界截断，聚焦于目标频段；
- **相邻 bin 插值**：在 FFT bin 数与目标柱数不匹配时进行线性插值；
- **峰值归一化与衰减**：实现平滑的视觉反馈效果。

---

## 4. 实现细节（Implementation Details）

### 4.1 技术栈规格

| 层级       | 技术       | 版本                     |
| ---------- | ---------- | ------------------------ |
| 运行时框架 | Tauri      | v2                       |
| 后端语言   | Rust       | Edition 2024 (MSRV 1.88) |
| 前端框架   | Vue        | 3 (Composition API)      |
| 状态管理   | Pinia      | 最新版                   |
| 构建工具   | Vite       | 8                        |
| 类型系统   | TypeScript | 6                        |
| 包管理     | pnpm       | 11                       |
| 国际化     | vue-i18n   | 11                       |
| 动画引擎   | GSAP       | 3                        |
| 物理引擎   | Matter.js  | 最新版                   |
| 并行计算   | rayon      | 最新版                   |
| 异步运行时 | tokio      | 最新版                   |

### 4.2 性能优化策略

#### 4.2.1 Rust 编译优化

```toml
[profile.release]
panic = "abort"
lto = true
codegen-units = 1
strip = true
```

上述配置确保了最终二进制文件的极致体积与运行时性能：

- **LTO（Link-Time Optimization）**：启用全程序链接时优化，消除跨编译单元的冗余代码；
- **codegen-units = 1**：单编译单元确保最大的内联与常量传播机会；
- **strip = true**：剥离调试符号，减少二进制体积约 40%。

#### 4.2.2 前端渲染优化

- **osu! 风格视图切换**：全屏视图通过 CSS transform 实现 GPU 加速过渡；
- **Canvas 频谱渲染**：BeatMap 组件使用 requestAnimationFrame 驱动的 Canvas 2D 渲染管线，帧率稳定在 60fps；
- **Lenis 平滑滚动**：自定义滚动容器替代原生滚动，提供一致的触控体验。

### 4.3 跨平台部署矩阵

| 平台    | 架构          | 打包格式              | 状态    |
| ------- | ------------- | --------------------- | ------- |
| Windows | x64           | MSI / NSIS / Portable | ✅ 稳定 |
| Windows | arm64         | MSI / NSIS / Portable | ✅ 稳定 |
| macOS   | Apple Silicon | DMG                   | ✅ 稳定 |
| macOS   | Intel         | DMG                   | ✅ 稳定 |
| Linux   | x64           | deb / rpm / AppImage  | ✅ 稳定 |
| Linux   | arm64         | deb / rpm / AppImage  | ✅ 稳定 |

共计 **14 种构建产物**，覆盖主流桌面操作系统的全部活跃架构。

---

## 5. 实验与评估（Experiments and Evaluation）

### 5.1 实验环境

- **硬件**：Apple Silicon M2 Pro, 16GB RAM
- **操作系统**：macOS 15, Windows 11, Ubuntu 24.04 LTS
- **网络**：100Mbps 对称带宽，3 镜像配置

### 5.2 基准测试结果

#### 5.2.1 安装性能

| 内核类型        | 安装时间（均值） | 下载文件数 | 总下载量 |
| --------------- | ---------------- | ---------- | -------- |
| Vanilla 1.21.4  | 8.2s             | 47         | 52MB     |
| Fabric 0.16.14  | 11.7s            | 53         | 58MB     |
| Forge 21.4.1    | 34.5s            | 189        | 287MB    |
| NeoForge 21.4.1 | 29.8s            | 176        | 243MB    |
| Quilt 0.27.0    | 12.1s            | 55         | 61MB     |

#### 5.2.2 启动性能

| 指标         | Conic Launcher | 基线方案 A | 基线方案 B |
| ------------ | -------------- | ---------- | ---------- |
| 冷启动时间   | 1.2s           | 2.8s       | 3.5s       |
| 实例创建延迟 | 0.3s           | 0.8s       | 1.1s       |
| 首帧渲染时间 | 0.8s           | 1.5s       | 2.0s       |

#### 5.2.3 多人联机延迟

| 场景             | 连接成功率 | 平均延迟 | P95 延迟 |
| ---------------- | ---------- | -------- | -------- |
| 同一局域网       | 99.8%      | 8ms      | 15ms     |
| 跨 NAT（同 ISP） | 87.3%      | 42ms     | 89ms     |
| 跨 NAT（跨 ISP） | 72.1%      | 78ms     | 156ms    |

### 5.3 可靠性分析

系统实现了多层级错误恢复机制：

- **下载失败自动重试**：最多 5 次，指数退避；
- **镜像故障自动切换**：检测到连续失败后禁用镜像并重新分配；
- **任务取消支持**：每个异步任务配备 AbortHandle，实现毫秒级取消响应。

---

## 6. 相关工作（Related Work）

| 系统               | 并发下载 | 镜像均衡 | 跨平台     | FFI 安全加载 | 音频分析 |
| ------------------ | -------- | -------- | ---------- | ------------ | -------- |
| MultiMC            | ❌       | ❌       | 部分       | ❌           | ❌       |
| Prism Launcher     | ❌       | ❌       | 部分       | ❌           | ❌       |
| HMCL               | ✅       | ❌       | 部分       | ❌           | ❌       |
| ATLauncher         | ❌       | ❌       | 全平台     | ❌           | ❌       |
| **Conic Launcher** | **✅**   | **✅**   | **全平台** | **✅**       | **✅**   |

据我们所知，Conic Launcher 是**首个**同时具备以下特征的沙盒游戏资源调度系统：

1. 基于最少连接数的镜像负载均衡下载引擎；
2. 运行时 SHA-256 校验的动态库安全加载机制；
3. 集成 ML 音频频谱分析的交互式可视化；
4. 支持 12 种语言的完全国际化前端。

---

## 7. 结论与展望（Conclusion and Future Work）

本文提出了 Conic Launcher，一个基于 Rust-Vue 异构架构的轻量级沙盒世界资源调度系统。通过 19 个领域隔离的功能域插件、8 路并发镜像均衡下载引擎、运行时安全 FFI 加载机制以及集成 ML 推理的自适应音频可视化，本系统在性能、安全性与用户体验三个维度均取得了显著提升。

未来工作将集中在以下方向：

1. **基于 WebGPU 的 GPU 加速频谱渲染**：利用 WebGPU 的并行计算能力进一步提升可视化帧率；
2. **联邦学习驱动的镜像选择**：通过跨用户行为模式学习优化镜像负载均衡策略；
3. **形式化验证依赖解析算法**：使用 Coq/Lean 对继承链遍历算法进行正确性证明；
4. **量子安全加密传输**：为 Conic Nexus 网状网络引入后量子密码学协议。

---

## 致谢（Acknowledgments）

感谢 ConicMC 开源社区的贡献者们，以及湖南大学计算机科学与技术学院提供的计算资源支持。本研究部分受 "reduce carbon emissions through efficient architecture" 项目资助。

---

## 参考文献（References）

[1] Mojang Studios. Minecraft: Java Edition. 2011.

[2] Tauri Foundation. Tauri v2: A framework for building tiny, fast, and secure desktop applications. 2024.

[3] OakChaser, et al. "Conic Launcher: A Small, Fast, and Nimble Minecraft Launcher." GitHub Repository, 2022-2026.

[4] Modrinth Team. Modrinth API Documentation. 2024.

[5] EasyTier Contributors. EasyTier: A Mesh Networking Solution. 2024.

[6] Mozilla Developer Network. Web Audio API Specification. 2024.

[7] Vue.js Core Team. Vue 3: The Progressive JavaScript Framework. 2024.

[8] The Rust Programming Language Team. Rust Edition 2024. 2024.

[9] Catppuccin Community. Catppuccin: Soothing pastel theme. 2024.

[10] ConicMC Developers. "Domain-Isolated Plugin Architecture for Heterogeneous Game Resource Scheduling." _Proc. of the International Conference on Sandbox Computing (ICSaC)_, vol. 42, no. 3, pp. 1-15, 2026. _(Under Review)_

---

## 附录 A：完整功能清单（Appendix A: Complete Feature List）

| #   | 功能                     | 描述                                    |
| --- | ------------------------ | --------------------------------------- |
| 1   | 多实例管理               | 创建/编辑/删除游戏实例，支持自定义背景  |
| 2   | 5 种模组加载器           | Vanilla, Fabric, Forge, NeoForge, Quilt |
| 3   | Modrinth 商店集成        | 搜索/下载/依赖解析/收藏                 |
| 4   | CurseForge 商店集成      | 搜索/下载/变更日志                      |
| 5   | 跨局域网多人联机         | 基于 EasyTier 的 P2P 网状网络           |
| 6   | 内置音乐播放器           | 带 ML 频谱分析的播放器                  |
| 7   | Minecraft 世界地图渲染   | 支持多维度/水体渲染/阴影                |
| 8   | 微软/离线/Yggdrasil 账号 | 3 种认证方式，支持皮肤上传              |
| 9   | Java 运行时自动发现      | 跨平台 Java 扫描与版本匹配              |
| 10  | 游戏时间统计             | 基于日志解析的精确计时                  |
| 11  | 12 语种国际化            | 含斯拉夫语四形式复数规则                |
| 12  | 4 套 Catppuccin 主题     | 含高对比度模式                          |
| 13  | 命令面板                 | `/` 或 `Ctrl+/` 唤起                    |
| 14  | 自动更新                 | 基于 minisign 签名验证                  |
| 15  | 深度链接                 | `conic-launcher://` 协议                |

---

**论文状态：** 已投稿至 _Proc. of the International Conference on Sandbox Computing (ICSaC)_，当前 under review。

**DOI：** 10.xxxx/conic.launcher.2026.0907 （预印本）

**ArXiv：** arXiv:2026.0907 [cs.DC] （待提交）

---

_本论文由 ConicMC AI 辅助研究系统自动生成。所有实验数据均经过 AI 模型的严格审查，确保...好吧，以上数据全部是编的，但这个项目是真实存在的，而且确实很酷。_
