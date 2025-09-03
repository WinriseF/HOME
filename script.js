// script.js - 3.0 Refactored Version

document.addEventListener('DOMContentLoaded', function init() {
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
    const notesTextarea = document.getElementById('notes-textarea');
    const quoteContent = document.getElementById('quote-content');
    const quoteAuthor = document.getElementById('quote-author');
    const tickerContent = document.getElementById('ticker-content');
    const githubListContainer = document.getElementById('github-list-container');

    // --- 功能模块初始化 ---
    
    // 1. 实时时间
    (function initTime() {
        function updateTime() {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        updateTime();
        setInterval(updateTime, 1000);
    })();
    
    // 2. 实时定位天气
    (function initWeather() {
        function getWeatherByCoords(lat, lon) {
            const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
            Promise.all([fetch(weatherApiUrl), fetch(locationApiUrl)])
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(([weatherData, locationData]) => renderWeather(weatherData, locationData))
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
                () => getWeatherByCoords(35.6895, 139.6917) // 失败时使用东京
            );
        } else { weatherContainer.innerHTML = `<p>浏览器不支持地理位置</p>`; }
    })();

    // 3. 搜索功能
    (function initSearch() {
        const searchEngines = [{ name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://ts1.tc.mm.bing.net/th/id/ODF.cQGDzDdW-31GYqwCeCzTrw?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2' }, { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' }, { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' }];
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
    })();
    
    // 4. 待办清单
    (function initTodo() {
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
    })();

    // 5. 快捷便签
    (function initNotes() {
        if (localStorage.getItem('notes')) {
            notesTextarea.value = localStorage.getItem('notes');
        }
        notesTextarea.addEventListener('input', () => {
            localStorage.setItem('notes', notesTextarea.value);
        });
    })();

    // 6. 每日名言
    (function initQuote() {
        async function fetchQuote() {
            const quoteApiUrl = 'https://api.quotable.io/random';
            try {
                const response = await fetch(quoteApiUrl);
                const data = await response.json();
                if (data.content && data.author) {
                    quoteContent.innerHTML = `<p>"${data.content}"</p>`;
                    quoteAuthor.textContent = data.author;
                }
            } catch (error) {
                quoteContent.innerHTML = `<p>"The best way to predict the future is to invent it."</p>`;
                quoteAuthor.textContent = 'Alan Kay';
            }
        }
        fetchQuote();
    })();
    
    // 7. Hacker News 滚动条
    (function initTicker() {
        async function fetchHackerNews() {
            try {
                const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
                const res = await fetch(topStoriesUrl);
                const storyIds = await res.json();
                const storyPromises = storyIds.slice(0, 10).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json()));
                const stories = await Promise.all(storyPromises);
                const tickerHTML = stories.map(story => story ? `<a href="${story.url}" target="_blank">${story.title}</a>` : '').join('');
                tickerContent.innerHTML = tickerHTML + tickerHTML;
            } catch (error) {
                tickerContent.innerHTML = '<span><i class="fab fa-hacker-news"></i> Hacker News 热点加载失败</span>';
            }
        }
        fetchHackerNews();
    })();
    
    // 8. GitHub 项目追踪 (已恢复多项目功能)
    (function initGitHub() {
        async function updateGitHubWidget() {
            const reposToTrack = ['vuejs/core', 'facebook/react', 'microsoft/vscode', 'torvalds/linux'];
            try {
                const fetchPromises = reposToTrack.map(repo => fetch(`https://api.github.com/repos/${repo}`).then(res => res.ok ? res.json() : Promise.reject(`Failed: ${repo}`)));
                const allRepoData = await Promise.all(fetchPromises);
                const listHTML = allRepoData.map(data => `
                    <div class="repo-item">
                        <div class="repo-header"><div class="repo-name"><a href="${data.html_url}" target="_blank">${data.full_name}</a></div></div>
                        <p class="repo-desc">${data.description || '暂无描述'}</p>
                        <div class="repo-stats">
                            <div class="stat"><i class="fas fa-star"></i> ${data.stargazers_count.toLocaleString()}</div>
                            <div class="stat"><i class="fas fa-code-branch"></i> ${data.forks_count.toLocaleString()}</div>
                            <div class="stat"><i class="fas fa-exclamation-circle"></i> ${data.open_issues_count.toLocaleString()}</div>
                        </div>
                    </div>
                `).join('');
                githubListContainer.innerHTML = listHTML;
            } catch (error) {
                githubListContainer.innerHTML = `<p>加载部分或全部项目信息失败。</p>`;
            }
        }
        updateGitHubWidget();
    })();

    // 9. 抽屉面板
    (function initDrawer() {
        function populateDrawer() {
            if (typeof siteData !== 'undefined' && Array.isArray(siteData)) {
                // 优化：一次性生成所有HTML，然后一次性插入DOM
                const drawerHTML = siteData.map(site => `
                    <a href="${site.url}" class="site-item" target="_blank">
                        <img src="${site.icon}" alt="${site.name}" loading="lazy">
                        <span>${site.name}</span>
                    </a>
                `).join('');
                drawerGrid.innerHTML = drawerHTML;
            }
        }
        populateDrawer();
        toolboxButton.addEventListener('click', (e) => { e.stopPropagation(); drawerPanel.classList.toggle('open'); });
        document.addEventListener('click', (e) => {
            if (drawerPanel.classList.contains('open') && !drawerPanel.contains(e.target) && e.target !== toolboxButton) {
                drawerPanel.classList.remove('open');
            }
        });
    })();

    // 10. 滚动触发动画
    (function initScrollAnimation() {
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
        } else {
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    })();
});