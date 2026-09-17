/**
 * K资源仓 - 全站动态导航栏与悬浮/折叠子菜单引擎
 * 完整适配：电脑端悬浮下拉 + 手机移动端抽屉实时读取与折叠子分类 + 彻底修复层级穿透
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

  function injectStyles() {
    if (document.getElementById("kzyc-dynamic-nav-style")) return;
    var style = document.createElement("style");
    style.id = "kzyc-dynamic-nav-style";
    style.innerHTML = [
      "/* ========================================================= */",
      "/* 1. 彻底解决手机端抽屉导航被文章卡片和分类标签穿透的问题 */",
      "/* ========================================================= */",
      "@media screen and (max-width: 1220px) {",
      "  .md-sidebar--primary {",
      "    z-index: 10000 !important; /* 强制抽屉高于所有页面元素与卡片标签 */",
      "  }",
      "  .md-overlay {",
      "    z-index: 9999 !important; /* 遮罩层盖住页面卡片 */",
      "  }",
      "  .md-header {",
      "    z-index: 10001 !important;",
      "  }",
      "}",

      "/* ========================================================= */",
      "/* 2. 电脑端顶部导航栏与悬浮下拉菜单 */",
      "/* ========================================================= */",
      ".md-header, .md-header__inner, .md-tabs, .md-tabs .md-grid, .md-tabs__list, .md-tabs__item {",
      "  overflow: visible !important;",
      "  contain: none !important;",
      "}",
      ".md-header { z-index: 9999 !important; }",
      ".md-tabs { z-index: 9998 !important; position: relative !important; }",
      ".md-tabs__item { position: relative !important; }",

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
      "[data-md-color-scheme='slate'] .kzyc-nav-dropdown-menu {",
      "  background: #1e293b !important;",
      "  color: #f8fafc !important;",
      "  border-color: rgba(255, 255, 255, 0.12) !important;",
      "  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45) !important;",
      "}",
      ".md-tabs__item:hover .kzyc-nav-dropdown-menu,",
      ".kzyc-nav-dropdown-menu:hover {",
      "  display: flex !important;",
      "}",
      ".kzyc-nav-dropdown-menu::before {",
      "  content: '';",
      "  position: absolute;",
      "  top: -12px;",
      "  left: 0;",
      "  width: 100%;",
      "  height: 12px;",
      "}",
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
      "}",

      "/* ========================================================= */",
      "/* 3. 手机移动端左侧抽屉：折叠式子分类菜单样式 */",
      "/* ========================================================= */",
      ".kzyc-mobile-nav-toggle {",
      "  background: none !important;",
      "  border: none !important;",
      "  padding: 8px 12px !important;",
      "  margin-left: auto !important;",
      "  cursor: pointer !important;",
      "  color: inherit !important;",
      "  opacity: 0.55 !important;",
      "  transition: transform 0.25s ease, opacity 0.2s ease !important;",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "}",
      ".kzyc-mobile-nav-toggle.open {",
      "  transform: rotate(180deg) !important;",
      "  opacity: 1 !important;",
      "  color: #2563eb !important;",
      "}",
      ".kzyc-mobile-subnav {",
      "  display: none;",
      "  list-style: none !important;",
      "  margin: 0 0 6px 20px !important;",
      "  padding: 2px 0 2px 10px !important;",
      "  border-left: 2px solid rgba(37, 99, 235, 0.25) !important;",
      "}",
      ".kzyc-mobile-subnav.open {",
      "  display: block !important;",
      "}",
      ".kzyc-mobile-subitem {",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  list-style: none !important;",
      "}",
      ".kzyc-mobile-sublink {",
      "  display: block !important;",
      "  padding: 6px 10px !important;",
      "  font-size: 0.72rem !important;",
      "  color: inherit !important;",
      "  opacity: 0.78 !important;",
      "  text-decoration: none !important;",
      "  border-radius: 4px !important;",
      "  transition: all 0.15s ease !important;",
      "}",
      ".kzyc-mobile-sublink:hover, .kzyc-mobile-sublink:active {",
      "  background: rgba(37, 99, 235, 0.08) !important;",
      "  color: #2563eb !important;",
      "  opacity: 1 !important;",
      "}",
      "[data-md-color-scheme='slate'] .kzyc-mobile-subnav {",
      "  border-left-color: rgba(96, 165, 250, 0.3) !important;",
      "}",
      "[data-md-color-scheme='slate'] .kzyc-mobile-sublink:hover {",
      "  background: rgba(59, 130, 246, 0.15) !important;",
      "  color: #60a5fa !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function applyNavState(navData, mainList, navLinks) {
    injectStyles();
    var linksMap = navLinks || DEFAULT_NAV_LINKS;

    // -------------------------------------------------------------
    // A. 处理电脑端顶部横向导航 (Tabs)
    // -------------------------------------------------------------
    var tabsList = document.querySelector(".md-tabs__list");
    if (tabsList && Array.isArray(mainList) && mainList.length > 0) {
      var links = tabsList.querySelectorAll(".md-tabs__link");
      var existingTitles = [];
      for (var i = 0; i < links.length; i++) {
        existingTitles.push(links[i].textContent.trim());
      }
      for (var j = 0; j < mainList.length; j++) {
        var title = mainList[j];
        var targetUrl = linksMap[title] || (navData && navData[title] && navData[title][0] ? navData[title][0].url : "#");
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

    // -------------------------------------------------------------
    // B. 处理手机端左侧抽屉导航 (Mobile Primary Nav)
    // -------------------------------------------------------------
    var mobileList = document.querySelector(".md-sidebar--primary .md-nav--primary > .md-nav__list");
    if (mobileList) {
      // 1. 同步主导航增删与链接
      if (Array.isArray(mainList) && mainList.length > 0) {
        var mobileLinks = mobileList.querySelectorAll(":scope > .md-nav__item > .md-nav__link");
        var existingMobileTitles = [];
        for (var mi = 0; mi < mobileLinks.length; mi++) {
          var rawTitle = mobileLinks[mi].querySelector(".md-ellipsis") ? mobileLinks[mi].querySelector(".md-ellipsis").textContent.trim() : mobileLinks[mi].textContent.trim();
          existingMobileTitles.push(rawTitle);
        }

        for (var mj = 0; mj < mainList.length; mj++) {
          var mTitle = mainList[mj];
          var mUrl = linksMap[mTitle] || (navData && navData[mTitle] && navData[mTitle][0] ? navData[mTitle][0].url : "#");
          if (existingMobileTitles.indexOf(mTitle) === -1) {
            var mLi = document.createElement("li");
            mLi.className = "md-nav__item kzyc-dynamic-mobile-tab";
            mLi.innerHTML = '<a href="' + mUrl + '" class="md-nav__link"><span class="md-ellipsis">' + mTitle + '</span></a>';
            mobileList.appendChild(mLi);
          } else {
            for (var mk = 0; mk < mobileLinks.length; mk++) {
              var tText = mobileLinks[mk].querySelector(".md-ellipsis") ? mobileLinks[mk].querySelector(".md-ellipsis").textContent.trim() : mobileLinks[mk].textContent.trim();
              if (tText === mTitle && linksMap[mTitle]) {
                mobileLinks[mk].href = linksMap[mTitle];
              }
            }
          }
        }
      }

      // 2. 为手机端主菜单挂载手风琴可折叠子菜单
      if (navData && typeof navData === "object") {
        var mobileItems = mobileList.querySelectorAll(":scope > .md-nav__item");
        mobileItems.forEach(function(mItem) {
          var mLink = mItem.querySelector(":scope > .md-nav__link");
          if (!mLink) return;

          var linkText = mLink.querySelector(".md-ellipsis") ? mLink.querySelector(".md-ellipsis").textContent.trim() : mLink.textContent.trim();
          var mSubs = navData[linkText];

          var oldSubMenu = mItem.querySelector(".kzyc-mobile-subnav");
          if (oldSubMenu) oldSubMenu.remove();
          var oldToggleBtn = mItem.querySelector(".kzyc-mobile-nav-toggle");
          if (oldToggleBtn) oldToggleBtn.remove();

          if (mSubs && Array.isArray(mSubs) && mSubs.length > 0) {
            var toggleBtn = document.createElement("button");
            toggleBtn.className = "kzyc-mobile-nav-toggle";
            toggleBtn.type = "button";
            toggleBtn.setAttribute("aria-label", "展开子分类");
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';

            mLink.style.display = "flex";
            mLink.style.alignItems = "center";
            mLink.style.width = "100%";
            mLink.appendChild(toggleBtn);

            var subUl = document.createElement("ul");
            subUl.className = "kzyc-mobile-subnav";
            var subHtml = "";
            for (var ms = 0; ms < mSubs.length; ms++) {
              subHtml += '<li class="kzyc-mobile-subitem"><a href="' + mSubs[ms].url + '" class="kzyc-mobile-sublink">' + mSubs[ms].name + '</a></li>';
            }
            subUl.innerHTML = subHtml;
            mItem.appendChild(subUl);

            toggleBtn.onclick = function(ev) {
              ev.preventDefault();
              ev.stopPropagation();
              var isOpen = subUl.classList.contains("open");
              if (isOpen) {
                subUl.classList.remove("open");
                toggleBtn.classList.remove("open");
              } else {
                subUl.classList.add("open");
                toggleBtn.classList.add("open");
              }
            };
          }
        });
      }
    }
  }

  function initDynamicNav() {
    var navData = DEFAULT_NAV_DATA;
    var mainList = null;
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
        mainList = JSON.parse(storedList);
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
          var freshList = result.data.main_nav_list || mainList;
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