/**
 * K资源仓 - 全站动态导航栏与悬浮子菜单引擎 (稳定无冲突版)
 */
(function() {
  var API_BASE = "https://auth.kzyc.de5.net";

  // 全量默认主导航列表 (内置友情链接，无论本地是否有缓存都绝不丢失)
  var DEFAULT_MAIN_LIST = [
    "首页", "最新发布", "电脑软件", "安卓软件", "免费字体", "操作系统", "视频教程", "其他专区", "打赏捐赠", "友情链接"
  ];

  var DEFAULT_NAV_LINKS = {
    "首页": "/",
    "最新发布": "/blog/",
    "电脑软件": "/blog/category/software/",
    "安卓软件": "/blog/category/android/",
    "免费字体": "/blog/category/fonts/",
    "操作系统": "/blog/category/os/",
    "视频教程": "/blog/category/tutorials/",
    "其他专区": "/blog/category/others/",
    "打赏捐赠": "/vip/",
    "友情链接": "/links/"
  };

  var DEFAULT_NAV_DATA = {
    "电脑软件": [
      { name: "全部软件", url: "/blog/category/software/" },
      { name: "图形设计", url: "/blog/category/software/#design" },
      { name: "办公应用", url: "/blog/category/software/#office" },
      { name: "系统工具", url: "/blog/category/software/#tools" }
    ],
    "安卓软件": [
      { name: "全部应用", url: "/blog/category/android/" },
      { name: "常用工具", url: "/blog/category/android/#tools" }
    ],
    "免费字体": [
      { name: "全部字体", url: "/blog/category/fonts/" }
    ],
    "操作系统": [
      { name: "Windows", url: "/blog/category/os/#windows" },
      { name: "macOS", url: "/blog/category/os/#macos" },
      { name: "Linux", url: "/blog/category/os/#linux" }
    ],
    "视频教程": [
      { name: "全部教程", url: "/blog/category/tutorials/" }
    ],
    "其他专区": [
      { name: "全部内容", url: "/blog/category/others/" }
    ],
    "友情链接": [
      { name: "K资源仓官方", url: "https://kzyc.de5.net/" }
    ]
  };

  function injectStyles() {
    if (document.getElementById("kzyc-dynamic-nav-style")) return;
    var style = document.createElement("style");
    style.id = "kzyc-dynamic-nav-style";
    style.innerHTML = [
      "/* 彻底破除 Material for MkDocs 导航栏所有父级的裁剪 */",
      ".md-header, .md-header__inner, .md-tabs, .md-tabs .md-grid, .md-tabs__list, .md-tabs__item {",
      "  overflow: visible !important;",
      "  contain: none !important;",
      "}",
      ".md-header { z-index: 9999 !important; }",
      ".md-tabs { z-index: 9998 !important; position: relative !important; }",
      ".md-tabs__item { position: relative !important; }",
      "/* 悬浮下拉菜单绝对定位与外观 (与主导航字号对齐) */",
      ".kzyc-nav-dropdown-menu {",
      "  position: absolute !important;",
      "  top: 100% !important;",
      "  left: 50% !important;",
      "  transform: translateX(-50%) translateY(2px) !important;",
      "  background: #ffffff !important;",
      "  color: #1e293b !important;",
      "  border: 1px solid rgba(0, 0, 0, 0.08) !important;",
      "  border-radius: 6px !important;",
      "  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04) !important;",
      "  padding: 4px !important;",
      "  min-width: 105px !important;",
      "  display: none !important;",
      "  flex-direction: column !important;",
      "  gap: 1px !important;",
      "  z-index: 9999999 !important;",
      "}",
      "/* 暗色模式适配 */",
      "[data-md-color-scheme='slate'] .kzyc-nav-dropdown-menu {",
      "  background: #1e293b !important;",
      "  color: #f8fafc !important;",
      "  border-color: rgba(255, 255, 255, 0.12) !important;",
      "  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45) !important;",
      "}",
      "/* 纯 CSS 悬浮机制，最平滑可靠，绝不闪退 */",
      ".md-tabs__item:hover .kzyc-nav-dropdown-menu,",
      ".kzyc-nav-dropdown-menu:hover {",
      "  display: flex !important;",
      "}",
      "/* 桥梁过渡防抖动 */",
      ".kzyc-nav-dropdown-menu::before {",
      "  content: '';",
      "  position: absolute;",
      "  top: -12px;",
      "  left: 0;",
      "  width: 100%;",
      "  height: 12px;",
      "}",
      "/* 子标签字体大小粗细与主导航完全一致 (0.7rem, 400 不加粗) */",
      ".kzyc-nav-dropdown-item {",
      "  display: block !important;",
      "  padding: 6px 12px !important;",
      "  color: inherit !important;",
      "  font-size: 0.7rem !important;",
      "  font-weight: 400 !important;",
      "  line-height: 1.4 !important;",
      "  text-decoration: none !important;",
      "  border-radius: 4px !important;",
      "  transition: all 0.15s ease !important;",
      "  white-space: nowrap !important;",
      "  text-align: center !important;",
      "  opacity: 0.82 !important;",
      "}",
      ".kzyc-nav-dropdown-item:hover {",
      "  background: rgba(37, 99, 235, 0.08) !important;",
      "  color: #2563eb !important;",
      "  opacity: 1 !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function applyNavState(navData, mainList, navLinks) {
    injectStyles();
    var tabsList = document.querySelector(".md-tabs__list");
    var linksMap = Object.assign({}, DEFAULT_NAV_LINKS, navLinks || {});
    var list = (Array.isArray(mainList) && mainList.length > 0) ? mainList : DEFAULT_MAIN_LIST;
    var data = Object.assign({}, DEFAULT_NAV_DATA, navData || {});

    // 1. 如果后台有新增的主导航（如“友情链接”），自动动态追加到导航栏末尾
    if (tabsList) {
      var links = tabsList.querySelectorAll(".md-tabs__link");
      var existingTitles = [];
      for (var i = 0; i < links.length; i++) {
        existingTitles.push(links[i].textContent.trim());
      }
      for (var j = 0; j < list.length; j++) {
        var title = list[j];
        var targetUrl = linksMap[title] || (data[title] && data[title][0] ? data[title][0].url : "#");
        if (existingTitles.indexOf(title) === -1) {
          var li = document.createElement("li");
          li.className = "md-tabs__item kzyc-dynamic-main-tab";
          li.innerHTML = '<a href="' + targetUrl + '" class="md-tabs__link">' + title + '</a>';
          tabsList.appendChild(li);
        } else {
          for (var k = 0; k < links.length; k++) {
            if (links[k].textContent.trim() === title && linksMap[title]) {
              links[k].href = linksMap[title];
            }
          }
        }
      }
    }

    // 2. 为各主导航挂载鼠标悬浮下拉菜单
    var tabItems = document.querySelectorAll(".md-tabs__item");
    tabItems.forEach(function(item) {
      var link = item.querySelector(".md-tabs__link");
      if (!link) return;
      var tabTitle = link.textContent.trim();
      var subs = data[tabTitle];

      var oldMenu = item.querySelector(".kzyc-nav-dropdown-menu");
      if (oldMenu) oldMenu.remove();

      if (subs && Array.isArray(subs) && subs.length > 0) {
        var menu = document.createElement("div");
        menu.className = "kzyc-nav-dropdown-menu";
        var html = "";
        for (var s = 0; s < subs.length; s++) {
          html += '<a href="' + subs[s].url + '" class="kzyc-nav-dropdown-item">' + subs[s].name + '</a>';
        }
        menu.innerHTML = html;
        item.appendChild(menu);
      }
    });
  }

  function initDynamicNav() {
    var navData = DEFAULT_NAV_DATA;
    var mainList = DEFAULT_MAIN_LIST;
    var navLinks = DEFAULT_NAV_LINKS;

    try {
      var stored = localStorage.getItem("kzyc_live_nav_dropdowns") || localStorage.getItem("kzyc_nav_dropdowns");
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          navData = Object.assign({}, DEFAULT_NAV_DATA, parsed);
        }
      }
      var storedList = localStorage.getItem("kzyc_main_nav_list");
      if (storedList) {
        var parsedList = JSON.parse(storedList);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          mainList = parsedList;
        }
      }
      var storedLinks = localStorage.getItem("kzyc_main_nav_links");
      if (storedLinks) {
        navLinks = Object.assign({}, DEFAULT_NAV_LINKS, JSON.parse(storedLinks));
      }
    } catch (e) {}

    applyNavState(navData, mainList, navLinks);

    try {
      fetch(API_BASE + "/api/site-nav").then(function(res) {
        if (res.ok) return res.json();
      }).then(function(result) {
        if (result && result.success && result.data) {
          var freshNav = Object.assign({}, DEFAULT_NAV_DATA, result.data.nav_dropdowns || {});
          var freshList = (Array.isArray(result.data.main_nav_list) && result.data.main_nav_list.length > 0) ? result.data.main_nav_list : mainList;
          var freshLinks = Object.assign({}, DEFAULT_NAV_LINKS, result.data.main_nav_links || {});
          applyNavState(freshNav, freshList, freshLinks);
        }
      }).catch(function() {});
    } catch (err) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDynamicNav);
  } else {
    initDynamicNav();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(initDynamicNav);
  }
})();