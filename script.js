// script.js - 2.0版本

document.addEventListener('DOMContentLoaded', function() {
    // --- 元素获取 ---
    const timeElement = document.getElementById('current-time');
    const weatherContainer = document.getElementById('weather-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const engineSelector = document.querySelector('.engine-selector');
    const engineIcon = document.getElementById('current-engine-icon');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const toolboxButton = document.getElementById('toolbox-button');
    const drawerPanel = document.getElementById('drawer-panel');
    const drawerGrid = document.getElementById('drawer-grid');

    // --- 功能1: 实时时间 ---
    function updateTime() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    updateTime();
    setInterval(updateTime, 1000);

    // --- 功能2: 实时定位天气 ---
    function getWeatherByCoords(lat, lon) { /* ...内容不变... */ }
    function renderWeather(weatherData, locationData) { /* ...内容不变... */ }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
            (error) => {
                console.warn("无法获取地理位置，将使用默认位置(东京)。", error);
                getWeatherByCoords(35.6895, 139.6917);
            }
        );
    } else { weatherContainer.innerHTML = `<p>浏览器不支持地理位置</p>`; }
    // (为了简洁，这里省略了 getWeatherByCoords 和 renderWeather 的具体代码，请从您旧的script.js文件复制过来)
    // 完整的 getWeatherByCoords 和 renderWeather 函数如下：
    function getWeatherByCoords(lat, lon) {
        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        Promise.all([fetch(weatherApiUrl), fetch(locationApiUrl)])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([weatherData, locationData]) => { renderWeather(weatherData, locationData); })
            .catch(error => {
                console.error("获取天气或位置信息失败:", error);
                weatherContainer.innerHTML = `<p>天气加载失败</p>`;
            });
    }
    function renderWeather(weatherData, locationData) {
        const weather = weatherData.current_weather;
        const city = locationData.city || locationData.locality || '未知地区';
        const weatherIcons = {0: 'fa-sun', 1: 'fa-sun', 2: 'fa-cloud-sun', 3: 'fa-cloud', 45: 'fa-smog', 61: 'fa-cloud-rain', 80: 'fa-cloud-showers-heavy'};
        const iconClass = weatherIcons[weather.weathercode] || 'fa-question-circle';
        weatherContainer.innerHTML = `<div class="weather-main"><i class="fas ${iconClass}"></i><div><div class="temp">${Math.round(weather.temperature)}°C</div><div class="city">${city}</div></div></div>`;
    }

    // --- 功能3: 搜索功能 ---
    const searchEngines = [{ name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' }, { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' }, { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' }];
    let currentEngineIndex = 0;
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) { window.open(searchEngines[currentEngineIndex].url + encodeURIComponent(query), '_blank'); }
    }
    searchInput.addEventListener('keydown', (e) => e.key === 'Enter' && performSearch());
    searchButton.addEventListener('click', performSearch);
    engineSelector.addEventListener('click', () => {
        currentEngineIndex = (currentEngineIndex + 1) % searchEngines.length;
        const newEngine = searchEngines[currentEngineIndex];
        engineIcon.src = newEngine.icon;
        engineIcon.alt = newEngine.name;
        searchInput.placeholder = `用 ${newEngine.name} 搜索...`;
    });

    // --- 功能4: 待办清单 ---
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    function saveTodos() { localStorage.setItem('todos', JSON.stringify(todos)); }
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `<span data-index="${index}">${todo.text}</span><button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>`;
            todoList.appendChild(li);
        });
    }
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.unshift({ text, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());
    todoList.addEventListener('click', (e) => {
        const targetElement = e.target.closest('span, .delete-btn');
        if (!targetElement) return;
        const index = targetElement.dataset.index;
        if (targetElement.tagName === 'SPAN') { todos[index].completed = !todos[index].completed; }
        if (targetElement.classList.contains('delete-btn')) { todos.splice(index, 1); }
        saveTodos();
        renderTodos();
    });
    renderTodos();

    // --- 功能5: 抽屉面板 ---
    toolboxButton.addEventListener('click', (e) => {
        e.stopPropagation();
        drawerPanel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (drawerPanel.classList.contains('open') && !drawerPanel.contains(e.target)) {
            drawerPanel.classList.remove('open');
        }
    });

    // --- 新增功能6: 动态填充抽屉 ---
    function populateDrawer() {
        if (typeof siteData !== 'undefined' && Array.isArray(siteData)) {
            drawerGrid.innerHTML = ''; // 清空现有内容
            siteData.forEach(site => {
                const siteItem = `
                    <a href="${site.url}" class="site-item" target="_blank">
                        <img src="${site.icon}" alt="${site.name}">
                        <span>${site.name}</span>
                    </a>
                `;
                drawerGrid.innerHTML += siteItem;
            });
        }
    }
    populateDrawer();

    // ==========================================================
    // ===== 新增功能 8: 快捷便签 (使用localStorage) ===========
    // ==========================================================
    const notesTextarea = document.getElementById('notes-textarea');

    // 页面加载时，读取本地存储的便签内容
    if (localStorage.getItem('notes')) {
        notesTextarea.value = localStorage.getItem('notes');
    }

    // 当用户输入时，自动保存到本地存储
    notesTextarea.addEventListener('input', () => {
        localStorage.setItem('notes', notesTextarea.value);
    });


    // ==========================================================
    // ===== 新增功能 9: 每日名言 (升级版，使用Quotable.io) ======
    // ==========================================================
    const quoteContent = document.getElementById('quote-content');
    const quoteAuthor = document.getElementById('quote-author');

    async function fetchQuote() {
        // 使用稳定、可靠的开源名言API
        const quoteApiUrl = 'https://api.quotable.io/random';
        
        try {
            const response = await fetch(quoteApiUrl);
            const data = await response.json();
            
            // Quotable.io API 返回的数据结构是 { content: "...", author: "..." }
            if (data.content && data.author) {
                // 这个API主要提供英文名言，所以我们只显示英文
                quoteContent.innerHTML = `<p>"${data.content}"</p>`;
                quoteAuthor.textContent = data.author;
            } else {
                quoteContent.textContent = '无法加载名言，请稍后再试。';
            }
        } catch (error) {
            console.error("获取名言失败:", error);
            // 备用名言，以防API请求失败
            quoteContent.innerHTML = `<p>"The best way to predict the future is to invent it."</p>`;
            quoteAuthor.textContent = 'Alan Kay';
        }
    }
    
    fetchQuote();

    // ==========================================================
    // ===== 新增功能 11: Hacker News 滚动条 ===================
    // ==========================================================
    const tickerContent = document.getElementById('ticker-content');

    async function fetchHackerNews() {
        try {
            const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
            const res = await fetch(topStoriesUrl);
            const storyIds = await res.json();
            const top5Ids = storyIds.slice(0, 10); // 获取前10个

            const storyPromises = top5Ids.map(id => 
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
            );

            const stories = await Promise.all(storyPromises);

            let tickerHTML = '';
            stories.forEach(story => {
                if(story) {
                    tickerHTML += `<a href="${story.url}" target="_blank">${story.title}</a>`;
                }
            });
            // 复制一份内容以实现无缝滚动
            tickerContent.innerHTML = tickerHTML + tickerHTML;

        } catch (error) {
            console.error("获取Hacker News失败:", error);
            tickerContent.innerHTML = '<span><i class="fab fa-hacker-news"></i> Hacker News 热点加载失败</span>';
        }
    }
    fetchHackerNews();

    // ==========================================================
    // ===== 新增功能 12: GitHub 项目追踪 ======================
    // ==========================================================
    const githubWidget = document.getElementById('github-widget');

    async function fetchRepoStats(repo) { // repo格式为 "用户名/仓库名"
        const apiUrl = `https://api.github.com/repos/${repo}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            githubWidget.innerHTML = `
                <div class="repo-name"><i class="fab fa-github"></i> <a href="${data.html_url}" target="_blank">${data.full_name}</a></div>
                <p class="repo-desc">${data.description}</p>
                <div class="repo-stats">
                    <div class="stat">
                        <div class="stat-count">${data.stargazers_count}</div>
                        <div class="stat-label">Stars</div>
                    </div>
                    <div class="stat">
                        <div class="stat-count">${data.forks_count}</div>
                        <div class="stat-label">Forks</div>
                    </div>
                    <div class="stat">
                        <div class="stat-count">${data.open_issues_count}</div>
                        <div class="stat-label">Open Issues</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`获取 ${repo} 信息失败:`, error);
            githubWidget.innerHTML = `<p>加载 ${repo} 信息失败。</p>`
        }
    }
    // 在这里修改想追踪的任何公开项目
    fetchRepoStats('vuejs/core');
    // --- 新增功能7: 滚动触发动画 ---
    const animatedElements = document.querySelectorAll('.animatable');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    } else { // 兼容不支持的浏览器
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }
});