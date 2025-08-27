document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const engineSelector = document.querySelector('.engine-selector');
    const engineIcon = document.getElementById('current-engine-icon');
    
    const toolboxButton = document.getElementById('toolbox-button');
    const drawerPanel = document.getElementById('drawer-panel');

    const timeElement = document.getElementById('current-time');

    // 搜索引擎配置
    const searchEngines = [
        { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
        { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' },
        { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
        { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' }
    ];
    let currentEngineIndex = 0;

    // --- 功能1: 搜索 ---
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const searchUrl = searchEngines[currentEngineIndex].url + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
            searchInput.value = '';
        }
    }

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    searchButton.addEventListener('click', performSearch);
    
    // --- 功能2: 切换搜索引擎 ---
    engineSelector.addEventListener('click', () => {
        currentEngineIndex = (currentEngineIndex + 1) % searchEngines.length;
        const newEngine = searchEngines[currentEngineIndex];
        engineIcon.src = newEngine.icon;
        engineIcon.alt = newEngine.name;
        searchInput.placeholder = `用 ${newEngine.name} 搜索...`;
    });


    // --- 功能3: 抽屉面板 ---
    toolboxButton.addEventListener('click', (event) => {
        event.stopPropagation(); // 防止点击事件冒泡到document
        drawerPanel.classList.toggle('open');
    });

    // 点击抽屉外部区域关闭抽屉
    document.addEventListener('click', (event) => {
        if (drawerPanel.classList.contains('open') && !drawerPanel.contains(event.target)) {
            drawerPanel.classList.remove('open');
        }
    });

    // --- 功能4: 实时时间 ---
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新一次

    //新闻信息
    const newsList = document.getElementById('news-list');
    const loader = document.getElementById('loader');
    let newsLoaded = false; // 一个标志，确保新闻只加载一次

    // 1. 获取新闻数据的函数
    async function fetchNews() {
        if (newsLoaded) return;
        loader.style.display = 'block';
        
        try {
            // 使用新的、当前可用的API地址
            const response = await fetch('https://api.tenapi.one/v2/zhihuresou');
            const result = await response.json();

            // 新API的数据结构检查方式略有不同
            if (result.code === 200 && result.data) {
                renderNews(result.data);
                newsLoaded = true;
            } else {
                newsList.innerHTML = '<p style="text-align: center;">新闻加载失败，请稍后再试。</p>';
            }
        } catch (error) {
            console.error('获取新闻失败:', error);
            newsList.innerHTML = '<p style="text-align: center;">网络错误，无法加载新闻。</p>';
        } finally {
            loader.style.display = 'none';
        }
    }

    // 2. 将新闻数据渲染到页面上的函数 (已更新以匹配新数据)
    function renderNews(newsData) {
        let html = '';
        // 注意：新API返回的数组里，对象的属性名不同
        // 标题是 item.name, 链接是 item.url, 描述是 item.desc
        newsData.forEach((item, index) => {
            const rankIndex = index + 1;
            const topClass = rankIndex <= 3 ? 'top-3' : '';

            html += `
                <div class="news-item">
                    <span class="index ${topClass}">${rankIndex}</span>
                    <div class="content">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>
                        <p>${item.desc || '知乎热榜'}</p> 
                    </div>
                </div>
            `;
        });
        newsList.innerHTML = html;
    }

    // 3. 监听滚动事件的函数
    function handleScroll() {
        // 当用户向下滚动超过屏幕高度的一半时，就加载新闻
        if (!newsLoaded && window.scrollY > window.innerHeight / 2) {
            fetchNews();
            // (可选) 加载后可以移除监听，避免重复触发
            // window.removeEventListener('scroll', handleScroll); 
        }
    }

    // 4. 绑定滚动事件监听
    window.addEventListener('scroll', handleScroll);
});
