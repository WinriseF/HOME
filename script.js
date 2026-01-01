// ==================== 导航主页 v3.0 JavaScript ====================

document.addEventListener('DOMContentLoaded', function init() {

    // ==================== 配置 ====================
    const CONFIG = {
        backgroundSources: {
            // 使用国内稳定的背景图源
            bing: 'https://bing.img.run/rand_1366x768.php',
            unsplash: 'https://picsum.photos/1920/1080',
            random: [
                'https://pic.netbian.com/index.php?url=/uploads/allimg/2401/01-1Z1011AK9-51.jpg',
                'https://pic.netbian.com/index.php?url=/uploads/allimg/2401/01-1Z1011A911-52.jpg',
                'https://pic.netbian.com/index.php?url=/uploads/allimg/2312/30-231229093038-50.jpg'
            ],
            wallpaper: 'https://picsum.photos/seed/style/1920/1080'
        },
        pomodoroTimes: { work: 25, short: 5, long: 15 }
    };

    // ==================== 状态管理 ====================
    const state = {
        currentEngine: 'google',
        todos: [],
        notes: '',
        theme: localStorage.getItem('theme') || 'glass',
        background: localStorage.getItem('background') || 'bing',
        pomodoro: {
            time: CONFIG.pomodoroTimes.work * 60,
            mode: 'work',
            interval: null,
            isRunning: false
        }
    };

    const searchEngines = {
        google: { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'G' },
        baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '百' },
        bing: { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'B' },
        zhihu: { name: '知乎', url: 'https://www.zhihu.com/search/?q=', icon: '知' },
        bilibili: { name: 'B站', url: 'https://search.bilibili.com/all?keyword=', icon: 'B' },
        github: { name: 'GitHub', url: 'https://github.com/search?q=', icon: 'GH' },
        stackoverflow: { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=', icon: 'SO' },
        duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'D' }
    };

    // ==================== DOM 元素 ====================
    const elements = {
        bgElement: document.querySelector('.background-fixed'),
        timeElement: document.getElementById('current-time'),
        dateElement: document.getElementById('current-date'),
        lunarElement: document.getElementById('lunar-date'),
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button'),
        engineSelector: document.getElementById('engine-selector'),
        engineList: document.getElementById('engine-list'),
        todoInput: document.getElementById('todo-input'),
        todoAddBtn: document.getElementById('todo-add-btn'),
        todoList: document.getElementById('todo-list'),
        todoCompleted: document.getElementById('todo-completed'),
        todoTotal: document.getElementById('todo-total'),
        notesTextarea: document.getElementById('notes-textarea'),
        notesCount: document.getElementById('notes-count'),
        notesExport: document.getElementById('notes-export'),
        notesTime: document.getElementById('notes-time'),
        quoteContent: document.getElementById('quote-content'),
        quoteAuthor: document.getElementById('quote-author'),
        newsList: document.getElementById('news-list'),
        githubList: document.getElementById('github-list-container'),
        toolboxBtn: document.getElementById('toolbox-button'),
        drawerPanel: document.getElementById('drawer-panel'),
        drawerClose: document.getElementById('drawer-close'),
        drawerSearch: document.getElementById('drawer-search-input'),
        drawerCategories: document.getElementById('drawer-categories'),
        settingsBtn: document.getElementById('settings-btn'),
        settingsPanel: document.getElementById('settings-panel'),
        settingsClose: document.getElementById('settings-close'),
        shortcutsBtn: document.getElementById('shortcuts-btn'),
        shortcutsModal: document.getElementById('shortcuts-modal'),
        overlay: document.getElementById('overlay'),
        pomodoroBtn: document.getElementById('pomodoro-btn'),
        pomodoroModal: document.getElementById('pomodoro-modal'),
        pomodoroDisplay: document.getElementById('pomodoro-display'),
        pomodoroStart: document.getElementById('pomodoro-start'),
        pomodoroPause: document.getElementById('pomodoro-pause'),
        pomodoroReset: document.getElementById('pomodoro-reset'),
        passwordBtn: document.getElementById('password-btn'),
        passwordModal: document.getElementById('password-modal'),
        qrcodeBtn: document.getElementById('qrcode-btn'),
        qrcodeModal: document.getElementById('qrcode-modal'),
        converterBtn: document.getElementById('converter-btn'),
        converterModal: document.getElementById('converter-modal'),
        exportData: document.getElementById('export-data'),
        importData: document.getElementById('import-data'),
        importFile: document.getElementById('import-file'),
        resetData: document.getElementById('reset-data')
    };

    // ==================== 初始化函数 ====================

    // 1. 随机背景
    function initBackground() {
        const bgType = state.background;
        let url = '';

        switch (bgType) {
            case 'bing':
                // Bing 壁纸 - 使用国内镜像
                url = 'https://bing.img.run/rand_1366x768.php';
                break;
            case 'unsplash':
                // Picsum 随机图床
                url = `https://picsum.photos/seed/${Date.now()}/1920/1080`;
                break;
            case 'random':
                // 随机风景壁纸
                const randomUrls = CONFIG.backgroundSources.random;
                url = randomUrls[Math.floor(Math.random() * randomUrls.length)];
                break;
            case 'wallpaper':
                // 风格化壁纸
                url = `https://picsum.photos/seed/style/${Date.now()}/1920/1080`;
                break;
            default:
                url = CONFIG.backgroundSources.bing;
        }

        // 添加随机参数防止缓存
        const separator = url.includes('?') ? '&' : '?';
        url = url + separator + 'r=' + Math.random();

        elements.bgElement.style.backgroundImage = `url('${url}')`;
    }

    // 2. 时间与日期
    function initTime() {
        function updateTime() {
            const now = new Date();

            // 时间
            elements.timeElement.textContent = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // 日期
            const dateStr = now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
            elements.dateElement.textContent = dateStr;

            // 农历
            elements.lunarElement.textContent = getLunarDate(now);
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    // 农历计算 (简化版)
    function getLunarDate(date) {
        const lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0];
        const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
        const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
        const solarTerms = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;
        let lunarYear = 1900;
        let temp = 0;

        for (lunarYear = 1900; lunarYear < 2101 && offset > temp; lunarYear++) {
            temp = getLunarYearDays(lunarYear);
        }

        const leapMonth = getLeapMonth(lunarYear);
        let isLeap = false;
        let lunarMonth = 1;

        for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
            const monthDays = getLunarMonthDays(lunarYear, lunarMonth);
            if (offset > monthDays - 1) {
                offset -= monthDays;
                if (lunarMonth === leapMonth) {
                    lunarMonth = -leapMonth;
                    isLeap = true;
                }
            }
        }

        if (lunarMonth < 0) {
            lunarMonth = -lunarMonth;
            isLeap = false;
        }

        const lunarDay = Math.floor(offset) + 1;
        const monthName = isLeap ? '闰' + lunarMonths[lunarMonth - 1] + '月' : lunarMonths[lunarMonth - 1] + '月';

        // 简化显示
        return `${monthName}${lunarDays[lunarDay - 1]}`;
    }

    function getLunarYearDays(year) {
        let sum = 0;
        for (let i = 1; i <= 12; i++) {
            sum += getLunarMonthDays(year, i);
        }
        return sum;
    }

    function getLunarMonthDays(year, month) {
        const lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0];
        const bit = (month > 12) ? (1 << (month - 13)) : (1 << (month - 1));
        return ((lunarInfo[year - 1900] & bit) ? 30 : 29);
    }

    function getLeapMonth(year) {
        const lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0];
        return (lunarInfo[year - 1900] & 0xf) || 0;
    }

    // 3. 搜索引擎
    function initSearch() {
        function updateEngineDisplay() {
            const engine = searchEngines[state.currentEngine];
            const iconColors = {
                google: '#4285f4',
                baidu: '#4e8cef',
                bing: '#008373',
                zhihu: '#0066ff',
                bilibili: '#00a1d6',
                github: '#24292e',
                stackoverflow: '#f48024',
                duckduckgo: '#de5833'
            };
            // 更新主引擎图标
            elements.engineSelector.innerHTML = `<div class="engine-icon current" style="background: ${iconColors[state.currentEngine] || '#6c5ce7'}">${engine.icon}</div>`;
            elements.searchInput.placeholder = `用 ${engine.name} 搜索...`;
            elements.engineList.classList.remove('show');
        }

        function performSearch() {
            const query = elements.searchInput.value.trim();
            if (query) {
                window.open(searchEngines[state.currentEngine].url + encodeURIComponent(query), '_blank');
            }
        }

        elements.engineSelector.addEventListener('click', () => {
            elements.engineList.classList.toggle('show');
        });

        document.querySelectorAll('.engine-item').forEach(item => {
            item.addEventListener('click', () => {
                state.currentEngine = item.dataset.engine;
                updateEngineDisplay();
            });
        });

        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        elements.searchButton.addEventListener('click', performSearch);

        // 点击外部关闭引擎列表
        document.addEventListener('click', (e) => {
            if (!elements.engineSelector.contains(e.target) && !elements.engineList.contains(e.target)) {
                elements.engineList.classList.remove('show');
            }
        });

        updateEngineDisplay();
    }

    // 4. 待办清单
    function initTodo() {
        state.todos = JSON.parse(localStorage.getItem('todos')) || [];

        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(state.todos));
            updateTodoStats();
        }

        function updateTodoStats() {
            const completed = state.todos.filter(t => t.completed).length;
            elements.todoCompleted.textContent = completed;
            elements.todoTotal.textContent = state.todos.length;
        }

        function renderTodos() {
            elements.todoList.innerHTML = '';
            state.todos.forEach((todo, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-index="${index}"></div>
                    <span data-index="${index}">${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>
                `;
                elements.todoList.appendChild(li);
            });
            updateTodoStats();
        }

        function addTodo() {
            const text = elements.todoInput.value.trim();
            if (text) {
                state.todos.unshift({ text, completed: false });
                elements.todoInput.value = '';
                saveTodos();
                renderTodos();
            }
        }

        elements.todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        elements.todoAddBtn.addEventListener('click', addTodo);

        elements.todoList.addEventListener('click', (e) => {
            const checkbox = e.target.closest('.todo-checkbox');
            const deleteBtn = e.target.closest('.delete-btn');
            const span = e.target.closest('span');

            if (checkbox) {
                const index = parseInt(checkbox.dataset.index);
                state.todos[index].completed = !state.todos[index].completed;
                saveTodos();
                renderTodos();
            } else if (deleteBtn) {
                const index = parseInt(deleteBtn.dataset.index);
                state.todos.splice(index, 1);
                saveTodos();
                renderTodos();
            } else if (span) {
                const index = parseInt(span.dataset.index);
                state.todos[index].completed = !state.todos[index].completed;
                saveTodos();
                renderTodos();
            }
        });

        renderTodos();
    }

    // 5. 便签
    function initNotes() {
        state.notes = localStorage.getItem('notes') || '';
        elements.notesTextarea.value = state.notes;

        let saveTimeout;
        elements.notesTextarea.addEventListener('input', () => {
            state.notes = elements.notesTextarea.value;
            elements.notesCount.textContent = `${state.notes.length} 字`;

            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem('notes', state.notes);
                elements.notesTime.textContent = '已保存';
                setTimeout(() => elements.notesTime.textContent = '自动保存', 2000);
            }, 500);
        });

        elements.notesCount.textContent = `${state.notes.length} 字`;

        // 导出便签
        elements.notesExport.addEventListener('click', () => {
            const blob = new Blob([state.notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `便签备份_${new Date().toLocaleDateString('zh-CN')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // 6. 名言
    function initQuote() {
        // 内置名言库，无需 API
        const quotes = [
            { text: "种一棵树最好的时间是现在。", author: "非洲谚语" },
            { text: "生活不是等待暴风雨过去，而是学会在雨中漫步。", author: "未知" },
            { text: "成功的秘诀在于坚持不懈。", author: "贝多芬" },
            { text: "你不能改变过去，但你可以改变未来。", author: "未知" },
            { text: "行动是治愈恐惧的良药。", author: "亚里士多德" },
            { text: "今天的所有努力，都是为了让明天的自己更优秀。", author: "未知" },
            { text: "别让任何人偷走你的梦想。", author: "未知" },
            { text: "最好的时光是当下。", author: "奥普拉" }
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        elements.quoteContent.innerHTML = `<p>"${quote.text}"</p>`;
        elements.quoteAuthor.textContent = `— ${quote.author}`;
    }

    // 7. Hacker News (国内可能无法访问)
    function initHackerNews() {
        // 使用备用数据，因为原 API 在国内无法访问
        const hnData = [
            { title: "Show HN: 我的新项目上线了", url: "https://github.com", domain: "github.com", score: 128, by: "devuser", descendants: 32 },
            { title: "Ask HN: 如何更好地学习编程？", url: null, domain: "news.ycombinator.com", score: 256, by: "newbie", descendants: 89 },
            { title: "AI 时代的软件开发", url: "https://example.com", domain: "example.com", score: 342, by: "techwriter", descendants: 67 },
            { title: "10 个提升效率的开发者工具", url: "https://example.com", domain: "example.com", score: 198, by: "toolmaker", descendants: 45 },
            { title: "为什么我离开大厂去创业", url: "https://example.com", domain: "example.com", score: 567, by: "founder", descendants: 123 }
        ];

        elements.newsList.innerHTML = hnData.map((story, i) => `
            <div class="news-item">
                <span class="news-rank">${i + 1}.</span>
                <div class="news-title">
                    <a href="${story.url || 'https://news.ycombinator.com'}" target="_blank">${story.title}</a>
                    <div class="news-domain">${story.domain || ''}</div>
                    <div class="news-meta">${story.score} points by ${story.by} | ${story.descendants} comments</div>
                </div>
            </div>
        `).join('');
    }

    // 8. GitHub 趋势 (国内可能无法访问，使用备用数据)
    function initGitHub() {
        // 使用静态数据，因为 GitHub API 在国内可能无法访问
        const githubData = [
            { full_name: 'microsoft/vscode', description: 'Code editing. Redefined.', avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4', html_url: 'https://github.com/microsoft/vscode', stargazers_count: 161200, forks_count: 27200, open_issues_count: 1234 },
            { full_name: 'vuejs/core', description: 'The progressive JavaScript framework for building modern web UI.', avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4', html_url: 'https://github.com/vuejs/core', stargazers_count: 43800, forks_count: 7700, open_issues_count: 156 },
            { full_name: 'facebook/react', description: 'A library for building user interfaces.', avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4', html_url: 'https://github.com/facebook/react', stargazers_count: 224000, forks_count: 45600, open_issues_count: 892 },
            { full_name: 'twbs/bootstrap', description: 'The most popular HTML, CSS, and JS library in the world.', avatar_url: 'https://avatars.githubusercontent.com/u/2918581?v=4', html_url: 'https://github.com/twbs/bootstrap', stargazers_count: 167500, forks_count: 79000, open_issues_count: 312 },
            { full_name: 'vercel/next.js', description: 'The React Framework for the Web.', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4', html_url: 'https://github.com/vercel/next.js', stargazers_count: 125000, forks_count: 28900, open_issues_count: 567 }
        ];

        elements.githubList.innerHTML = githubData.map(repo => `
            <div class="repo-item">
                <div class="repo-header">
                    <img class="repo-avatar" src="${repo.avatar_url}" alt="">
                    <span class="repo-name"><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></span>
                </div>
                <p class="repo-desc">${repo.description}</p>
                <div class="repo-stats">
                    <span class="stat"><i class="fas fa-star"></i> ${formatNumber(repo.stargazers_count)}</span>
                    <span class="stat"><i class="fas fa-code-branch"></i> ${formatNumber(repo.forks_count)}</span>
                    <span class="stat"><i class="fas fa-exclamation-circle"></i> ${formatNumber(repo.open_issues_count)}</span>
                </div>
            </div>
        `).join('');
    }

    function formatNumber(num) {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    }

    // 9. 抽屉导航
    function initDrawer() {
        if (typeof siteData !== 'undefined' && Array.isArray(siteData)) {
            // 按分类整理网站
            const categories = {};
            siteData.forEach(site => {
                const category = site.category || '其他';
                if (!categories[category]) categories[category] = [];
                categories[category].push(site);
            });

            let html = '';
            for (const [name, sites] of Object.entries(categories)) {
                html += `
                    <div class="drawer-category">
                        <div class="category-title">${name}</div>
                        <div class="drawer-grid">
                            ${sites.map(site => `
                                <a href="${site.url}" class="site-item" target="_blank">
                                    <div class="site-icon" style="background: ${site.color || '#6c5ce7'}">${site.icon}</div>
                                    <span>${site.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            elements.drawerCategories.innerHTML = html;
        }

        function toggleDrawer(show) {
            elements.drawerPanel.classList.toggle('open', show);
            elements.overlay.classList.toggle('show', show);
        }

        elements.toolboxBtn.addEventListener('click', () => toggleDrawer(true));
        elements.drawerClose.addEventListener('click', () => toggleDrawer(false));
        elements.overlay.addEventListener('click', () => toggleDrawer(false));

        // 抽屉内搜索
        elements.drawerSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.site-item').forEach(item => {
                const name = item.querySelector('span').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // 10. 设置面板
    function initSettings() {
        function applyTheme(theme) {
            document.body.className = theme !== 'glass' ? `theme-${theme}` : '';
            state.theme = theme;
            localStorage.setItem('theme', theme);
        }

        function applyBackground(bg) {
            state.background = bg;
            localStorage.setItem('background', bg);
            initBackground();
        }

        // 主题切换
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.dataset.theme === state.theme) btn.classList.add('active');
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyTheme(btn.dataset.theme);
            });
        });

        // 背景切换
        document.querySelectorAll('.bg-btn').forEach(btn => {
            if (btn.dataset.bg === state.background) btn.classList.add('active');
            btn.addEventListener('click', () => {
                document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyBackground(btn.dataset.bg);
            });
        });

        function toggleSettings(show) {
            elements.settingsPanel.classList.toggle('show', show);
            elements.overlay.classList.toggle('show', show);
        }

        elements.settingsBtn.addEventListener('click', () => toggleSettings(true));
        elements.settingsClose.addEventListener('click', () => toggleSettings(false));
    }

    // 11. 快捷键提示
    function initShortcuts() {
        function toggleShortcuts(show) {
            elements.shortcutsModal.classList.toggle('show', show);
            elements.overlay.classList.toggle('show', show);
        }

        elements.shortcutsBtn.addEventListener('click', () => toggleShortcuts(true));
        elements.shortcutsModal.querySelector('.close-btn').addEventListener('click', () => toggleShortcuts(false));
    }

    // 12. 番茄钟
    function initPomodoro() {
        function updateDisplay() {
            const m = Math.floor(state.pomodoro.time / 60);
            const s = state.pomodoro.time % 60;
            elements.pomodoroDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        function startTimer() {
            if (state.pomodoro.isRunning) return;
            state.pomodoro.isRunning = true;
            state.pomodoro.interval = setInterval(() => {
                if (state.pomodoro.time > 0) {
                    state.pomodoro.time--;
                    updateDisplay();
                } else {
                    clearInterval(state.pomodoro.interval);
                    state.pomodoro.isRunning = false;
                    // 播放提示音
                    try {
                        const audio = new AudioContext();
                        const oscillator = audio.createOscillator();
                        oscillator.connect(audio.destination);
                        oscillator.frequency.value = 800;
                        oscillator.start();
                        setTimeout(() => oscillator.stop(), 300);
                    } catch (e) {}
                }
            }, 1000);
        }

        function pauseTimer() {
            clearInterval(state.pomodoro.interval);
            state.pomodoro.isRunning = false;
        }

        function resetTimer() {
            pauseTimer();
            state.pomodoro.time = CONFIG.pomodoroTimes[state.pomodoro.mode] * 60;
            updateDisplay();
        }

        function setMode(mode) {
            state.pomodoro.mode = mode;
            document.querySelectorAll('.timer-mode-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
            resetTimer();
        }

        elements.pomodoroBtn.addEventListener('click', () => {
            elements.pomodoroModal.classList.add('show');
            elements.overlay.classList.add('show');
        });

        elements.pomodoroModal.querySelector('.close-btn').addEventListener('click', () => {
            elements.pomodoroModal.classList.remove('show');
            if (!elements.settingsPanel.classList.contains('show')) {
                elements.overlay.classList.remove('show');
            }
        });

        document.querySelectorAll('.timer-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.dataset.mode));
        });

        elements.pomodoroStart.addEventListener('click', startTimer);
        elements.pomodoroPause.addEventListener('click', pauseTimer);
        elements.pomodoroReset.addEventListener('click', resetTimer);

        updateDisplay();
    }

    // 13. 密码生成器
    function initPassword() {
        function generate() {
            const length = parseInt(document.getElementById('password-length').value) || 16;
            const upper = document.getElementById('password-upper').checked;
            const lower = document.getElementById('password-lower').checked;
            const number = document.getElementById('password-number').checked;
            const symbol = document.getElementById('password-symbol').checked;

            const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
            const numberChars = '0123456789';
            const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

            let chars = '';
            if (upper) chars += upperChars;
            if (lower) chars += lowerChars;
            if (number) chars += numberChars;
            if (symbol) chars += symbolChars;

            if (!chars) chars = lowerChars + numberChars;

            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            document.getElementById('password-result').value = password;
        }

        function copy() {
            const result = document.getElementById('password-result');
            result.select();
            document.execCommand('copy');
        }

        elements.passwordBtn.addEventListener('click', () => {
            elements.passwordModal.classList.add('show');
            elements.overlay.classList.add('show');
        });

        elements.passwordModal.querySelector('.close-btn').addEventListener('click', () => {
            elements.passwordModal.classList.remove('show');
            if (!elements.settingsPanel.classList.contains('show')) {
                elements.overlay.classList.remove('show');
            }
        });

        document.getElementById('password-generate').addEventListener('click', generate);
        document.getElementById('password-copy').addEventListener('click', copy);

        generate();
    }

    // 14. 二维码生成器
    function initQRCode() {
        function generate() {
            const text = document.getElementById('qrcode-input').value.trim();
            const result = document.getElementById('qrcode-result');

            if (!text) {
                result.innerHTML = '<p style="color: var(--text-muted);">请输入内容</p>';
                return;
            }

            // 使用 qrserver API 生成二维码
            result.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}" alt="QR Code">`;
        }

        elements.qrcodeBtn.addEventListener('click', () => {
            elements.qrcodeModal.classList.add('show');
            elements.overlay.classList.add('show');
        });

        elements.qrcodeModal.querySelector('.close-btn').addEventListener('click', () => {
            elements.qrcodeModal.classList.remove('show');
            if (!elements.settingsPanel.classList.contains('show')) {
                elements.overlay.classList.remove('show');
            }
        });

        document.getElementById('qrcode-generate').addEventListener('click', generate);
    }

    // 15. 单位换算器
    function initConverter() {
        const units = {
            // 长度
            m: { name: '米', factor: 1 },
            km: { name: '千米', factor: 1000 },
            cm: { name: '厘米', factor: 0.01 },
            mm: { name: '毫米', factor: 0.001 },
            inch: { name: '英寸', factor: 0.0254 },
            ft: { name: '英尺', factor: 0.3048 },
            mi: { name: '英里', factor: 1609.344 },
            // 重量
            kg: { name: '千克', factor: 1, type: 'weight' },
            g: { name: '克', factor: 0.001, type: 'weight' },
            mg: { name: '毫克', factor: 0.000001, type: 'weight' },
            lb: { name: '磅', factor: 0.453592, type: 'weight' },
            oz: { name: '盎司', factor: 0.0283495, type: 'weight' },
            // 温度
            c: { name: '摄氏度', type: 'temp' },
            f: { name: '华氏度', type: 'temp' },
            k: { name: '开尔文', type: 'temp' }
        };

        function updateToOptions() {
            const from = document.getElementById('converter-from').value;
            const fromUnit = units[from];
            const toSelect = document.getElementById('converter-to');

            let options = '';
            for (const [key, val] of Object.entries(units)) {
                if (!fromUnit.type || fromUnit.type === val.type) {
                    options += `<option value="${key}">${val.name}</option>`;
                }
            }
            toSelect.innerHTML = options;
        }

        function convert() {
            const from = document.getElementById('converter-from').value;
            const to = document.getElementById('converter-to').value;
            const input = parseFloat(document.getElementById('converter-input').value);
            const output = document.getElementById('converter-output');

            if (isNaN(input)) {
                output.value = '';
                return;
            }

            const fromUnit = units[from];
            const toUnit = units[to];

            let result;
            if (fromUnit.type === 'temp') {
                // 温度转换
                let celsius;
                if (from === 'c') celsius = input;
                else if (from === 'f') celsius = (input - 32) * 5 / 9;
                else celsius = input - 273.15;

                if (to === 'c') result = celsius;
                else if (to === 'f') result = celsius * 9 / 5 + 32;
                else result = celsius + 273.15;
            } else {
                // 普通单位转换
                const base = input * fromUnit.factor;
                result = base / toUnit.factor;
            }

            output.value = result % 1 === 0 ? result : result.toFixed(6).replace(/\.?0+$/, '');
        }

        function copyResult() {
            const output = document.getElementById('converter-output');
            output.select();
            document.execCommand('copy');
        }

        elements.converterBtn.addEventListener('click', () => {
            elements.converterModal.classList.add('show');
            elements.overlay.classList.add('show');
            updateToOptions();
        });

        elements.converterModal.querySelector('.close-btn').addEventListener('click', () => {
            elements.converterModal.classList.remove('show');
            if (!elements.settingsPanel.classList.contains('show')) {
                elements.overlay.classList.remove('show');
            }
        });

        document.getElementById('converter-from').addEventListener('change', updateToOptions);
        document.getElementById('converter-input').addEventListener('input', convert);
        document.getElementById('converter-to').addEventListener('change', convert);
        document.getElementById('converter-copy').addEventListener('click', copyResult);
    }

    // 16. 数据管理
    function initDataManagement() {
        function exportData() {
            const data = {
                todos: state.todos,
                notes: state.notes,
                theme: state.theme,
                background: state.background,
                exportTime: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `主页备份_${new Date().toLocaleDateString('zh-CN')}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function importData(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.todos) {
                        state.todos = data.todos;
                        localStorage.setItem('todos', JSON.stringify(data.todos));
                        renderTodos();
                    }
                    if (data.notes) {
                        state.notes = data.notes;
                        localStorage.setItem('notes', data.notes);
                        elements.notesTextarea.value = data.notes;
                    }
                    if (data.theme) {
                        state.theme = data.theme;
                        localStorage.setItem('theme', data.theme);
                        document.body.className = data.theme !== 'glass' ? `theme-${data.theme}` : '';
                        document.querySelectorAll('.theme-btn').forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.theme === data.theme);
                        });
                    }
                    if (data.background) {
                        state.background = data.background;
                        localStorage.setItem('background', data.background);
                        document.querySelectorAll('.bg-btn').forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.background === data.background);
                        });
                        initBackground();
                    }
                    alert('导入成功！');
                } catch (err) {
                    alert('导入失败，请检查文件格式。');
                }
            };
            reader.readAsText(file);
        }

        function resetData() {
            if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
                localStorage.clear();
                location.reload();
            }
        }

        elements.exportData.addEventListener('click', exportData);
        elements.importData.addEventListener('click', () => elements.importFile.click());
        elements.importFile.addEventListener('change', (e) => {
            if (e.target.files[0]) importData(e.target.files[0]);
        });
        elements.resetData.addEventListener('click', resetData);
    }

    // 17. 全局快捷键
    function initKeyboardShortcuts() {
        let keyBuffer = '';
        let lastKeyTime = 0;

        document.addEventListener('keydown', (e) => {
            // 聚焦搜索框
            if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // 快捷键提示
            if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                elements.shortcutsModal.classList.toggle('show');
                elements.overlay.classList.toggle('show');
            }

            // ESC 关闭弹窗
            if (e.key === 'Escape') {
                elements.shortcutsModal.classList.remove('show');
                elements.pomodoroModal.classList.remove('show');
                elements.passwordModal.classList.remove('show');
                elements.qrcodeModal.classList.remove('show');
                elements.converterModal.classList.remove('show');
                elements.settingsPanel.classList.remove('show');
                elements.drawerPanel.classList.remove('show');
                elements.overlay.classList.remove('show');
            }

            // 组合快捷键
            const now = Date.now();
            if (now - lastKeyTime < 500) {
                keyBuffer += e.key.toLowerCase();
            } else {
                keyBuffer = e.key.toLowerCase();
            }
            lastKeyTime = now;

            if (keyBuffer === 'gg') { window.open('https://github.com', '_blank'); keyBuffer = ''; }
            if (keyBuffer === 'yt') { window.open('https://youtube.com', '_blank'); keyBuffer = ''; }
            if (keyBuffer === 'bb') { window.open('https://bilibili.com', '_blank'); keyBuffer = ''; }
        });
    }

    // 18. 滚动动画
    function initScrollAnimation() {
        const animatedElements = document.querySelectorAll('.animatable');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    }

    // ==================== 工具函数 ====================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderTodos() {
        // 待办清单渲染由 initTodo 内部处理
    }

    // ==================== 启动 ====================
    function start() {
        initBackground();
        initTime();
        initSearch();
        initTodo();
        initNotes();
        initQuote();
        initHackerNews();
        initGitHub();
        initDrawer();
        initSettings();
        initShortcuts();
        initPomodoro();
        initPassword();
        initQRCode();
        initConverter();
        initDataManagement();
        initKeyboardShortcuts();
        initScrollAnimation();
    }

    start();
});
