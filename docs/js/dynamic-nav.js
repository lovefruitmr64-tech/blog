/**
 * K资源仓 - 全站动态导航栏与悬浮子菜单引擎 (字体与主导航精细对齐版)
 */
(function() {
  var API_BASE = "https://auth.kzyc.de5.net";

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
      "/* 悬浮下拉菜单绝对定位与外观 */",
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
      "  display: none;",
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
      "/* 鼠标悬停显示 */",
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
      "/* 子标签字体大小粗细与主导航完全一致 */",
      ".kzyc-nav-dropdown-item {",
      "  display: block !important;",
      "  padding: 6px 12px !important;",
      "  color: inherit !important;",
      "  font-size: 0.7rem !important; /* 与 MkDocs 主导航完全一致 */",
      "  font-weight: 400 !important; /* 常规字重，不加粗 */",
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

  function applyNavState(navData, mainList) {
    injectStyles();
    var tabsList = document.querySelector(".md-tabs__list");

    if (tabsList && Array.isArray(mainList) && mainList.length > 0) {
      var links = tabsList.querySelectorAll(".md-tabs__link");
      var existingTitles = [];
      for (var i = 0; i < links.length; i++) {
        existingTitles.push(links[i].textContent.trim());
      }
      for (var j = 0; j < mainList.length; j++) {
        var title = mainList[j];
        if (existingTitles.indexOf(title) === -1) {
          var li = document.createElement("li");
          li.className = "md-tabs__item kzyc-dynamic-main-tab";
          var targetUrl = (navData && navData[title] && navData[title][0]) ? navData[title][0].url : "#";
          li.innerHTML = '<a href="' + targetUrl + '" class="md-tabs__link">' + title + '</a>';
          tabsList.appendChild(li);
        }
      }
    }

    if (navData && typeof navData === "object") {
      var tabItems = document.querySelectorAll(".md-tabs__item");
      tabItems.forEach(function(item) {
        var link = item.querySelector(".md-tabs__link");
        if (!link) return;
        var tabTitle = link.textContent.trim();
        var subs = navData[tabTitle];

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

          item.onmouseenter = function() { menu.style.display = "flex"; };
          item.onmouseleave = function() { menu.style.display = "none"; };
          menu.onmouseenter = function() { menu.style.display = "flex"; };
          menu.onmouseleave = function() { menu.style.display = "none"; };
        }
      });
    }
  }

  function initDynamicNav() {
    var navData = DEFAULT_NAV_DATA;
    var mainList = null;

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
        mainList = JSON.parse(storedList);
      }
    } catch (e) {}

    applyNavState(navData, mainList);

    try {
      fetch(API_BASE + "/api/site-nav").then(function(res) {
        if (res.ok) return res.json();
      }).then(function(result) {
        if (result && result.success && result.data) {
          var freshNav = Object.assign({}, DEFAULT_NAV_DATA, result.data.nav_dropdowns || {});
          var freshList = result.data.main_nav_list || mainList;
          applyNavState(freshNav, freshList);
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