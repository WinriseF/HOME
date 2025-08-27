document.addEventListener('DOMContentLoaded', function() {
    // --- 原有元素获取 ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const engineSelector = document.querySelector('.engine-selector');
    const engineIcon = document.getElementById('current-engine-icon');
    const toolboxButton = document.getElementById('toolbox-button');
    const drawerPanel = document.getElementById('drawer-panel');
    const timeElement = document.getElementById('current-time');

    // --- 原有功能1: 搜索 ---
    const searchEngines = [
        { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
        { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' },
        { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' }
    ];
    let currentEngineIndex = 0;

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.open(searchEngines[currentEngineIndex].url + encodeURIComponent(query), '_blank');
        }
    }
    searchInput.addEventListener('keydown', (e) => e.key === 'Enter' && performSearch());
    searchButton.addEventListener('click', performSearch);
    
    // --- 原有功能2: 切换搜索引擎 ---
    engineSelector.addEventListener('click', () => {
        currentEngineIndex = (currentEngineIndex + 1) % searchEngines.length;
        const newEngine = searchEngines[currentEngineIndex];
        engineIcon.src = newEngine.icon;
        engineIcon.alt = newEngine.name;
        searchInput.placeholder = `用 ${newEngine.name} 搜索...`;
    });

    // --- 原有功能3: 抽屉面板 ---
    toolboxButton.addEventListener('click', (e) => {
        e.stopPropagation();
        drawerPanel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (drawerPanel.classList.contains('open') && !drawerPanel.contains(e.target)) {
            drawerPanel.classList.remove('open');
        }
    });

    // --- 原有功能4: 实时时间 ---
    function updateTime() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    updateTime();
    setInterval(updateTime, 1000);

    // ==========================================================
    // ===== 新增功能 5: 实时定位天气 ============================
    // ==========================================================
    const weatherContainer = document.getElementById('weather-container');

    function getWeatherByCoords(lat, lon) {
        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

        // 并行请求天气数据和地理位置数据
        Promise.all([fetch(weatherApiUrl), fetch(locationApiUrl)])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([weatherData, locationData]) => {
                renderWeather(weatherData, locationData);
            })
            .catch(error => {
                console.error("获取天气或位置信息失败:", error);
                weatherContainer.innerHTML = `<p>天气加载失败</p>`;
            });
    }

    function renderWeather(weatherData, locationData) {
        const weather = weatherData.current_weather;
        const city = locationData.city || locationData.locality || '未知地区';
        const weatherIcons = {
             0: 'fa-sun', 1: 'fa-sun', 2: 'fa-cloud-sun', 3: 'fa-cloud', 45: 'fa-smog',
             61: 'fa-cloud-rain', 80: 'fa-cloud-showers-heavy'
        };
        const iconClass = weatherIcons[weather.weathercode] || 'fa-question-circle';

        weatherContainer.innerHTML = `
            <div class="weather-main">
                <i class="fas ${iconClass}"></i>
                <div>
                    <div class="temp">${Math.round(weather.temperature)}°C</div>
                    <div class="city">${city}</div>
                </div>
            </div>
        `;
    }

    // 关键：请求用户地理位置
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => { // 成功回调
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => { // 失败回调
                console.warn("无法获取地理位置，将使用默认位置(东京)。", error);
                getWeatherByCoords(35.6895, 139.6917); // 使用东京作为备用
            }
        );
    } else {
        weatherContainer.innerHTML = `<p>浏览器不支持地理位置</p>`;
    }


    // ==========================================================
    // ===== 新增功能 6: 待办清单 (使用localStorage) ===========
    // ==========================================================
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <span data-index="${index}">${todo.text}</span>
                <button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.unshift({ text, completed: false }); // 新任务添加到最前面
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }
    
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());

    todoList.addEventListener('click', (e) => {
        // 使用 .closest() 来确保点击到图标或按钮都能正确响应
        const targetElement = e.target.closest('span, .delete-btn');
        if (!targetElement) return;

        const index = targetElement.dataset.index;
        if (targetElement.tagName === 'SPAN') { // 切换完成状态
            todos[index].completed = !todos[index].completed;
        }
        if (targetElement.classList.contains('delete-btn')) { // 删除任务
            todos.splice(index, 1);
        }
        saveTodos();
        renderTodos();
    });

    renderTodos(); // 初始加载
});