# Mimo TTS - Bob 插件

小米 Mimo TTS 语音合成插件，支持多端点配置和完整音色选项。

## Fork 声明

本项目 Fork 自 [KeepStupidForever/mimo-tts](https://github.com/KeepStupidForever/mimo-tts)，在原作者基础上增强了以下功能：

- ✨ 支持多种 Base URL 配置（默认端点 / Token Plan / 自定义）
- 📝 优化 API Key 说明（区分 sk-xxx 和 tp-xxx 格式）
- 🎵 完整的官方音色列表（中英文共 9 种音色）
- 🔧 默认音色改为 mimo_default（自适应集群）

感谢原作者 [@foreverben](https://github.com/KeepStupidForever) 的开创性工作。

## 功能特性

### Base URL 选项
- **默认端点**：`https://api.xiaomimimo.com/v1`（使用 `sk-xxx` 格式 API Key）
- **Token Plan**：`https://token-plan-cn.xiaomimimo.com/v1`（使用 `tp-xxx` 格式 API Key）
- **自定义**：支持填写任意 Mimo API 端点地址

### 支持音色

| 音色名 | Voice ID | 语言 | 性别 |
|--------|----------|------|------|
| MiMo-默认 | `mimo_default` | 自适应（中国集群默认冰糖，其他集群默认 Mia） | - |
| 冰糖 | `冰糖` | 中文 | 女性 |
| 茉莉 | `茉莉` | 中文 | 女性 |
| 苏打 | `苏打` | 中文 | 男性 |
| 白桦 | `白桦` | 中文 | 男性 |
| Mia | `Mia` | 英文 | 女性 |
| Chloe | `Chloe` | 英文 | 女性 |
| Milo | `Milo` | 英文 | 男性 |
| Dean | `Dean` | 英文 | 男性 |

## 安装方法

### 方法一：直接下载（推荐）
1. 下载 [mimo-tts.bobplugin](https://github.com/muxiaoxiii/bob-plugin-mimo-tts-updated/releases/latest/download/mimo-tts.bobplugin)
2. 双击安装到 Bob

### 方法二：手动打包
```bash
# 克隆仓库
git clone https://github.com/muxiaoxiii/bob-plugin-mimo-tts-updated.git
cd bob-plugin-mimo-tts-updated

# 打包插件
zip mimo-tts.bobplugin main.js info.json

# 双击 mimo-tts.bobplugin 安装
```

## 配置说明

### 1. 选择 Base URL
- 如果使用小米官方 API（`sk-` 开头的 Key），选择「默认」
- 如果使用 Token Plan（`tp-` 开头的 Key），选择「Token Plan」
- 如果使用其他集群端点，选择「自定义」并填写完整 URL（如 `https://your-domain.com/v1`）

### 2. 填写 API Key
- 默认端点：使用 `sk-xxx` 格式
- Token Plan：使用 `tp-xxx` 格式
- 获取地址：[小米 Mimo 控制台](https://platform.xiaomimimo.com/console/api-keys)

### 3. 选择音色
根据需要选择中文或英文音色，默认为 `mimo_default`（自动适配集群）。

## 版本历史

### v0.3.0 (2026-06-15)
- 修复 Token Plan URL 拼写错误
- 根据端点类型自动选择认证方式（api-key vs Authorization Bearer）
- 优化错误提示信息：
  - 配额用完提示充值
  - API Key 无效提示检查密钥
  - 认证失败提示检查端点匹配

### v0.2.0 (2026-06-15)
- 新增 Base URL 配置选项
- 支持 Token Plan 端点
- 支持自定义端点
- 优化 API Key 说明
- 更新默认音色为 mimo_default
- 调整音色列表顺序

### v0.1.0
- 原始版本（来自上游）

## 技术说明

- **模型**：固定使用 `mimo-v2.5-tts`
- **音频格式**：WAV（Base64 编码）
- **支持语言**：中文、英文、日文、韩文

## 参考资料

- [小米 Mimo 官方文档](https://platform.xiaomimimo.com/docs)
- [Bob 插件开发文档](https://bobtranslate.com/plugin/)
- [原始项目地址](https://github.com/KeepStupidForever/mimo-tts)

## License

MIT License

## 作者

- 原作者：[@foreverben](https://github.com/KeepStupidForever)
- 增强版维护：[@muxiaoxiii](https://github.com/muxiaoxiii)
