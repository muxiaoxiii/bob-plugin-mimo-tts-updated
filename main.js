var langMap = new Map([
    ['zh-Hans', 'zh'],
    ['zh-Hant', 'zh'],
    ['en', 'en'],
    ['ja', 'ja'],
    ['ko', 'ko'],
]);

var langMapReverse = new Map([
    ['zh', 'zh-Hans'],
    ['en', 'en'],
    ['ja', 'ja'],
    ['ko', 'ko'],
]);

function supportLanguages() {
    return ['zh-Hans', 'zh-Hant', 'en', 'ja', 'ko'];
}

function getBaseUrl() {
    var option = $option.baseUrlOption || 'default';
    
    if (option === 'default') {
        return 'https://api.xiaomimimo.com/v1';
    } else if (option === 'tokenplan') {
        return 'https://token-plan-cn.xiaomimimo.com/v1';
    } else if (option === 'custom') {
        var customUrl = $option.customBaseUrl || '';
        if (!customUrl) {
            return 'https://api.xiaomimimo.com/v1';
        }
        // 确保 URL 不以 / 结尾
        return customUrl.replace(/\/+$/, '');
    }
    
    return 'https://api.xiaomimimo.com/v1';
}

function doTtsRequest(apiKey, text, voice, completion) {
    var baseUrl = getBaseUrl();
    var endpoint = baseUrl + '/chat/completions';
    var option = $option.baseUrlOption || 'default';
    
    // 根据端点类型选择认证头
    var headers = {
        'Content-Type': 'application/json'
    };
    
    if (option === 'tokenplan') {
        // Token Plan 使用标准 Authorization Bearer
        headers['Authorization'] = 'Bearer ' + apiKey;
    } else {
        // 默认端点和自定义使用 api-key 头
        headers['api-key'] = apiKey;
    }
    
    $http.request({
        method: 'POST',
        url: endpoint,
        header: headers,
        body: {
            model: 'mimo-v2.5-tts',
            stream: false,
            messages: [
                {
                    role: 'user',
                    content: 'Read the following text in a natural, clear voice.'
                },
                {
                    role: 'assistant',
                    content: text
                }
            ],
            audio: {
                format: 'wav',
                voice: voice
            }
        },
        handler: function(resp) {
            if (resp.error) {
                completion({
                    error: {
                        type: 'network',
                        message: '网络请求失败: ' + resp.error
                    }
                });
                return;
            }

            try {
                var data = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;

                if (data.error) {
                    var errorMsg = data.error.message || JSON.stringify(data.error);
                    // 特别标注常见错误
                    if (errorMsg.indexOf('quota') !== -1 || errorMsg.indexOf('exhausted') !== -1) {
                        errorMsg = '❌ API 配额已用完，请充值或检查账户额度\n原始错误: ' + errorMsg;
                    } else if (errorMsg.indexOf('Invalid') !== -1 || errorMsg.indexOf('invalid') !== -1) {
                        errorMsg = '❌ API Key 无效，请检查密钥是否正确\n原始错误: ' + errorMsg;
                    } else if (errorMsg.indexOf('401') !== -1 || errorMsg.indexOf('Unauthorized') !== -1) {
                        errorMsg = '❌ 认证失败，请检查 API Key 和 Base URL 是否匹配\n原始错误: ' + errorMsg;
                    }
                    
                    completion({
                        error: {
                            type: 'api',
                            message: errorMsg,
                            addition: data
                        }
                    });
                    return;
                }

                var audioBase64 = data.choices[0].message.audio.data;
                completion({
                    result: {
                        type: 'base64',
                        value: audioBase64,
                        raw: data
                    },
                    audioBase64: audioBase64
                });
            } catch (e) {
                completion({
                    error: {
                        type: 'api',
                        message: '解析响应失败: ' + e.message,
                        addition: typeof resp.data === 'string' ? resp.data.substring(0, 500) : resp.data
                    }
                });
            }
        }
    });
}

function tts(query, completion) {
    var apiKey = $option.apiKey;
    if (!apiKey) {
        completion({
            error: {
                type: 'secretKey',
                message: '请在插件设置中填写 API Key'
            }
        });
        return;
    }

    var voice = $option.voice || 'mimo_default';
    doTtsRequest(apiKey, query.text, voice, function(resp) {
        if (resp.error) {
            completion({ error: resp.error });
            return;
        }
        completion({
            result: {
                type: 'base64',
                value: resp.audioBase64,
                raw: resp.result.raw
            }
        });
    });
}

function pluginValidate(completion) {
    var apiKey = $option.apiKey;
    if (!apiKey) {
        completion({
            result: false,
            error: {
                type: 'secretKey',
                message: '请先填写 API Key'
            }
        });
        return;
    }

    var voice = $option.voice || 'mimo_default';
    var previewText = '你好，这是音色试听。Hello, this is a voice preview.';

    doTtsRequest(apiKey, previewText, voice, function(resp) {
        if (resp.error) {
            completion({
                result: false,
                error: resp.error
            });
            return;
        }
        completion({ result: true });
    });
}

function pluginTimeoutInterval() {
    return 60;
}
