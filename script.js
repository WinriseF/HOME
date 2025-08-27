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