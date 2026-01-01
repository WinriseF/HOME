// sites.js - 网站导航配置（支持分类）
// 使用简化的图标配置，优先使用文字首字母作为图标

const getFirstChar = (name) => name.charAt(0).toUpperCase();

const siteData = [
    // AI 工具
    { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: 'G', color: '#10a37f', category: 'AI 工具' },
    { name: 'Qwen', url: 'https://chat.qwen.ai/', icon: 'Q', color: '#1678ff', category: 'AI 工具' },
    { name: '豆包', url: 'https://www.doubao.com/', icon: '豆', color: '#f7d107', category: 'AI 工具' },
    { name: 'DeepSeek', url: 'https://deepseek.com/', icon: 'D', color: '#24292e', category: 'AI 工具' },
    { name: 'Gemini', url: 'https://gemini.google.com/', icon: 'G', color: '#4e8cef', category: 'AI 工具' },
    { name: 'Claude', url: 'https://claude.ai/', icon: 'C', color: '#d4a574', category: 'AI 工具' },
    { name: 'Midjourney', url: 'https://www.midjourney.com/', icon: 'M', color: '#d900ff', category: 'AI 工具' },
    { name: 'Stable Diffusion', url: 'https://stability.ai/', icon: 'S', color: '#0066cc', category: 'AI 工具' },

    // 开发工具
    { name: 'GitHub', url: 'https://github.com/', icon: 'GH', color: '#24292e', category: '开发工具' },
    { name: 'Gitee', url: 'https://gitee.com/', icon: 'G', color: '#c71d23', category: '开发工具' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: 'SO', color: '#f48024', category: '开发工具' },
    { name: 'MDN', url: 'https://developer.mozilla.org/', icon: 'M', color: '#000000', category: '开发工具' },
    { name: 'GitLab', url: 'https://gitlab.com/', icon: 'GL', color: '#e24329', category: '开发工具' },
    { name: 'CodePen', url: 'https://codepen.io/', icon: 'CP', color: '#000000', category: '开发工具' },

    // 社交媒体
    { name: '知乎', url: 'https://www.zhihu.com/', icon: '知', color: '#0066ff', category: '社交媒体' },
    { name: '微博', url: 'https://www.weibo.com/', icon: '微', color: '#e6162d', category: '社交媒体' },
    { name: 'Twitter/X', url: 'https://x.com/', icon: 'X', color: '#000000', category: '社交媒体' },
    { name: '豆瓣', url: 'https://www.douban.com/', icon: '豆', color: '#007722', category: '社交媒体' },
    { name: 'Telegram', url: 'https://telegram.org/', icon: 'TG', color: '#26a5e4', category: '社交媒体' },

    // 视频娱乐
    { name: 'YouTube', url: 'https://www.youtube.com/', icon: 'YT', color: '#ff0000', category: '视频娱乐' },
    { name: 'Bilibili', url: 'https://www.bilibili.com/', icon: 'B', color: '#00a1d6', category: '视频娱乐' },
    { name: 'Netflix', url: 'https://www.netflix.com/', icon: 'N', color: '#e50914', category: '视频娱乐' },
    { name: 'Twitch', url: 'https://www.twitch.tv/', icon: 'T', color: '#9146ff', category: '视频娱乐' },

    // 购物
    { name: '淘宝', url: 'https://www.taobao.com/', icon: '淘', color: '#ff5000', category: '购物' },
    { name: '京东', url: 'https://www.jd.com/', icon: '京', color: '#c40000', category: '购物' },
    { name: 'Amazon', url: 'https://www.amazon.com/', icon: 'A', color: '#ff9900', category: '购物' },
    { name: '拼多多', url: 'https://www.pinduoduo.com/', icon: '拼', color: '#e60012', category: '购物' },

    // 资讯
    { name: 'Google 新闻', url: 'https://news.google.com/', icon: 'G', color: '#4285f4', category: '资讯' },
    { name: '少数派', url: 'https://sspai.com/', icon: '少', color: '#5c4dff', category: '资讯' },
    { name: '掘金', url: 'https://juejin.cn/', icon: '掘', color: '#007eee', category: '资讯' },
    { name: 'V2EX', url: 'https://www.v2ex.com/', icon: 'V', color: '#3e4a59', category: '资讯' },

    // 工具
    { name: 'Unsplash', url: 'https://unsplash.com/', icon: 'U', color: '#000000', category: '工具' },
    { name: 'Figma', url: 'https://www.figma.com/', icon: 'F', color: '#f24e1e', category: '工具' },
    { name: 'Notion', url: 'https://www.notion.so/', icon: 'N', color: '#000000', category: '工具' },
    { name: 'Gmail', url: 'https://mail.google.com/', icon: 'G', color: '#ea4335', category: '工具' },
    { name: 'G Drive', url: 'https://drive.google.com/', icon: 'D', color: '#1da462', category: '工具' }
];
