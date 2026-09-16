// ============================================================
// 站长管理后台模块 - 🏷️ 分类中英文关联与导航栏悬浮下拉子菜单管理 (极速响应 + 增强版)
// 文件名: categories.js
// 功能：
//  1. 文章分类标签增删管理 (映射纯英文 URL)
//  2. 顶部主导航标签自由增加与删除
//  3. 鼠标悬浮子标签管理 (支持从分类一键快捷导入，也支持完全自由自定义)
//  4. 0ms 秒开渲染 + 后台静默云端同步，点击绝不卡顿
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  // 官网标准预设配置
  const DEFAULT_SITE_CATEGORIES = {
    "电脑软件": "software",
    "安卓软件": "android",
    "免费字体": "fonts",
    "操作系统": "os",
    "视频教程": "tutorials",
    "其他专区": "others"
  };

  const DEFAULT_MAIN_NAV_ITEMS = [
    "首页",
    "最新发布",
    "电脑软件",
    "安卓软件",
    "免费字体",
    "操作系统",
    "视频教程",
    "其他专区",
    "打赏捐赠"
  ];

  const DEFAULT_NAV_DROPDOWNS = {
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

  // 核心渲染函数（同步秒开，绝不等待网络）
  function renderCategoriesTab(panel) {
    if (!panel) return;

    // 版本初始化校验
    const CONFIG_VERSION = "20260916_v3";
    if (localStorage.getItem("kzyc_cat_nav_ver") !== CONFIG_VERSION) {
      localStorage.setItem("kzyc_cat_nav_ver", CONFIG_VERSION);
      if (!localStorage.getItem("kzyc_site_categories")) {
        localStorage.setItem("kzyc_site_categories", JSON.stringify(DEFAULT_SITE_CATEGORIES));
      }
      if (!localStorage.getItem("kzyc_nav_dropdowns")) {
        localStorage.setItem("kzyc_nav_dropdowns", JSON.stringify(DEFAULT_NAV_DROPDOWNS));
      }
      if (!localStorage.getItem("kzyc_main_nav_list")) {
        localStorage.setItem("kzyc_main_nav_list", JSON.stringify(DEFAULT_MAIN_NAV_ITEMS));
      }
    }

    let catData = DEFAULT_SITE_CATEGORIES;
    try {
      const stored = localStorage.getItem("kzyc_site_categories");
      if (stored) catData = JSON.parse(stored);
    } catch (e) {}

    let navData = DEFAULT_NAV_DROPDOWNS;
    try {
      const stored = localStorage.getItem("kzyc_nav_dropdowns");
      if (stored) navData = JSON.parse(stored);
    } catch (e) {}

    let mainNavList = DEFAULT_MAIN_NAV_ITEMS;
    try {
      const stored = localStorage.getItem("kzyc_main_nav_list");
      if (stored) mainNavList = JSON.parse(stored);
    } catch (e) {}

    // 绘制核心界面
    function drawCategoriesContent() {
      const catCount = Object.keys(catData).length;
      const mainNavCount = mainNavList.length;

      panel.innerHTML = `
        <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 14px; color: #1e40af; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span>🏷️ 网站分类中英文映射与顶部导航栏管理</span>
          <button class="kzyc-adm-btn" id="kzyc-reset-cats-btn" style="padding: 4px 12px; font-size: 0.78rem; opacity: 0.8;" title="恢复为官网初始配置">
            🔄 恢复初始默认
          </button>
        </div>

        <!-- 模块 1：文章分类标签映射 -->
        <div class="kzyc-adm-form-card">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <span>🏷️ 1. 文章分类标签映射 (共 ${catCount} 项)</span>
            <span style="font-size: 0.76rem; opacity: 0.65; font-weight: normal;">文章顶部填中文 -> 自动映射生成纯英文 URL</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
            <input class="kzyc-adm-input" id="kzyc-inp-cat-zh" placeholder="中文分类名 (如: 操作系统)" style="flex: 1; min-width: 160px; margin-top: 0;" />
            <input class="kzyc-adm-input" id="kzyc-inp-cat-en" placeholder="英文 URL 别名 (如: os)" style="flex: 1; min-width: 160px; margin-top: 0;" />
            <button class="kzyc-adm-btn primary" id="kzyc-add-cat-btn" style="padding: 8px 18px; white-space: nowrap;">➕ 添加分类标签</button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; min-height: 44px; padding: 10px; background: rgba(127,127,127,0.03); border: 1px dashed rgba(127,127,127,0.25); border-radius: 8px;">
            ${Object.entries(catData).map(([zh, en]) => `
              <span style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.25); border-radius: 6px; font-size: 0.82rem;">
                <strong style="color: #2563eb;">${escapeHTML(zh)}</strong>
                <span style="color: #64748b; font-size: 0.74rem;">(${escapeHTML(en)})</span>
                <button onclick="deleteCategoryItem('${escapeHTML(zh)}')" title="删除该分类" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 模块 2：顶部导航栏主导航管理 (自由增删) -->
        <div class="kzyc-adm-form-card">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <span>🧭 2. 顶部导航栏主导航管理 (共 ${mainNavCount} 项)</span>
            <span style="font-size: 0.76rem; opacity: 0.65; font-weight: normal;">控制页面顶部常驻显示的主导航栏目</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
            <input class="kzyc-adm-input" id="kzyc-inp-main-nav-name" placeholder="输入新主导航名称 (如: AI专区、精选推荐、友情链接)" style="flex: 2; min-width: 220px; margin-top: 0;" />
            <button class="kzyc-adm-btn primary" id="kzyc-add-main-nav-btn" style="padding: 8px 20px; white-space: nowrap;">➕ 添加主导航</button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; min-height: 44px; padding: 10px; background: rgba(127,127,127,0.03); border: 1px dashed rgba(127,127,127,0.25); border-radius: 8px;">
            ${mainNavList.map((navTitle, idx) => `
              <span style="display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 0.84rem;">
                <strong style="color: #059669;">${escapeHTML(navTitle)}</strong>
                <button onclick="deleteMainNavItem(${idx})" title="删除该主导航" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 模块 3：鼠标悬浮子标签管理 (快捷从分类导入 / 自由自定义) -->
        <div class="kzyc-adm-form-card">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px;">
            📂 3. 鼠标悬浮子标签管理 (支持从分类一键导入或自由自定义)
          </div>

          <!-- 快捷从分类标签选择辅助条 -->
          <div style="background: rgba(37, 99, 235, 0.04); border: 1px solid rgba(37, 99, 235, 0.15); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 0.82rem; color: #1e40af; font-weight: 600; white-space: nowrap;">⚡ 快捷从已有分类一键导入：</span>
            <select class="kzyc-adm-input" id="kzyc-sel-quick-cat" style="flex: 1; min-width: 200px; margin-top: 0; background: #fff; border-color: #93c5fd;">
              <option value="">-- 点击选择已有分类，自动填入子标签与链接 --</option>
              ${Object.entries(catData).map(([zh, en]) => `
                <option value="${escapeHTML(en)}" data-zh="${escapeHTML(zh)}">文章分类：${escapeHTML(zh)} ( /blog/category/${escapeHTML(en)}/ )</option>
              `).join('')}
            </select>
          </div>

          <!-- 添加子标签输入行 -->
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 14px;">
            <select class="kzyc-adm-input" id="kzyc-sel-nav-parent" style="flex: 1.1; min-width: 150px; margin-top: 0;">
              ${mainNavList.map(c => `<option value="${escapeHTML(c)}">目标主导航：${escapeHTML(c)}</option>`).join('')}
            </select>
            <input class="kzyc-adm-input" id="kzyc-inp-subnav-name" placeholder="弹出子标签名 (如: 办公应用)" style="flex: 1; min-width: 140px; margin-top: 0;" />
            <input class="kzyc-adm-input" id="kzyc-inp-subnav-url" placeholder="跳转链接 (如: /blog/category/software/ 或 /vip/ 或 外链)" style="flex: 1.6; min-width: 220px; margin-top: 0;" />
            <button class="kzyc-adm-btn primary" id="kzyc-add-subnav-btn" style="padding: 8px 18px; white-space: nowrap;">➕ 添加子标签</button>
          </div>

          <!-- 各主导航下已挂载的子标签列表 -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${mainNavList.map(parent => {
              const subs = navData[parent] || [];
              return `
                <div style="background: rgba(127,127,127,0.03); border: 1px solid rgba(127,127,127,0.15); border-radius: 8px; padding: 12px 14px;">
                  <div style="font-weight: 700; font-size: 0.84rem; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <span>📂 主导航【${escapeHTML(parent)}】 <span style="font-size: 0.74rem; opacity: 0.6; font-weight: normal;">(已有 ${subs.length} 个悬浮子项)</span></span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${subs.length === 0 ? '<span style="font-size: 0.78rem; opacity: 0.5;">暂无子标签（鼠标悬停时不弹出下拉菜单）</span>' : subs.map((s, idx) => `
                      <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--md-default-bg-color, #fff); border: 1px solid rgba(127,127,127,0.2); border-radius: 6px; font-size: 0.78rem;">
                        <span style="color: #2563eb; font-weight: 600;">${escapeHTML(s.name)}</span>
                        <span style="color: #64748b; font-size: 0.72rem;">→ ${escapeHTML(s.url)}</span>
                        <button onclick="deleteSubnavItem('${escapeHTML(parent)}', ${idx})" title="删除该子项" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
                      </span>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 模块 4：保存设置（直连云端数据库即时生效） -->
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
          <button class="kzyc-adm-btn success" id="kzyc-save-all-cats-btn" style="padding: 10px 24px; font-size: 0.92rem; font-weight: 700;">
            💾 保存设置并全网即时生效
          </button>
          <button class="kzyc-adm-btn primary" id="kzyc-export-yaml-btn" style="padding: 10px 18px; font-size: 0.88rem; opacity: 0.85;">
            📋 一键复制 YAML 配置
          </button>
        </div>
      `;

      // 1. 绑定添加分类标签事件
      document.getElementById("kzyc-add-cat-btn")?.addEventListener("click", () => {
        const zh = document.getElementById("kzyc-inp-cat-zh").value.trim();
        const en = document.getElementById("kzyc-inp-cat-en").value.trim().toLowerCase();
        if (!zh || !en) return alert("请填写中文分类和英文别名！");
        catData[zh] = en;
        drawCategoriesContent();
      });

      // 2. 绑定添加主导航事件
      document.getElementById("kzyc-add-main-nav-btn")?.addEventListener("click", () => {
        const navTitle = document.getElementById("kzyc-inp-main-nav-name").value.trim();
        if (!navTitle) return alert("请输入主导航名称！");
        if (mainNavList.includes(navTitle)) return alert("该主导航名称已存在！");
        mainNavList.push(navTitle);
        if (!navData[navTitle]) navData[navTitle] = [];
        drawCategoriesContent();
      });

      // 3. 绑定快捷从分类导入事件
      document.getElementById("kzyc-sel-quick-cat")?.addEventListener("change", (e) => {
        const sel = e.target;
        const en = sel.value;
        if (!en) return;
        const selectedOpt = sel.options[sel.selectedIndex];
        const zh = selectedOpt.getAttribute("data-zh");
        document.getElementById("kzyc-inp-subnav-name").value = zh;
        document.getElementById("kzyc-inp-subnav-url").value = `/blog/category/${en}/`;
      });

      // 4. 绑定添加子导航标签事件
      document.getElementById("kzyc-add-subnav-btn")?.addEventListener("click", () => {
        const parent = document.getElementById("kzyc-sel-nav-parent").value;
        const name = document.getElementById("kzyc-inp-subnav-name").value.trim();
        const url = document.getElementById("kzyc-inp-subnav-url").value.trim();
        if (!parent) return alert("请先选择或添加目标主导航！");
        if (!name || !url) return alert("请填写子标签名称和跳转链接！");
        if (!navData[parent]) navData[parent] = [];
        navData[parent].push({ name, url });
        drawCategoriesContent();
      });

      // 5. 恢复初始默认
      document.getElementById("kzyc-reset-cats-btn")?.addEventListener("click", () => {
        if (!confirm("确定要恢复为官网初始标准的 6 大分类和 9 大主导航吗？")) return;
        catData = JSON.parse(JSON.stringify(DEFAULT_SITE_CATEGORIES));
        navData = JSON.parse(JSON.stringify(DEFAULT_NAV_DROPDOWNS));
        mainNavList = JSON.parse(JSON.stringify(DEFAULT_MAIN_NAV_ITEMS));
        localStorage.setItem("kzyc_site_categories", JSON.stringify(catData));
        localStorage.setItem("kzyc_nav_dropdowns", JSON.stringify(navData));
        localStorage.setItem("kzyc_main_nav_list", JSON.stringify(mainNavList));
        drawCategoriesContent();
      });

      // 6. 保存到 Cloudflare 数据库（全网实时生效）
      document.getElementById("kzyc-save-all-cats-btn")?.addEventListener("click", async () => {
        const saveBtn = document.getElementById("kzyc-save-all-cats-btn");
        saveBtn.disabled = true;
        saveBtn.innerText = "⏳ 正在同步到云端数据库...";

        // 本地存储备份
        localStorage.setItem("kzyc_site_categories", JSON.stringify(catData));
        localStorage.setItem("kzyc_nav_dropdowns", JSON.stringify(navData));
        localStorage.setItem("kzyc_main_nav_list", JSON.stringify(mainNavList));
        localStorage.setItem("kzyc_live_nav_dropdowns", JSON.stringify(navData));

        try {
          const token = localStorage.getItem(TOKEN_KEY);
          const res = await fetch(`${API_BASE}/api/admin/site-nav/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              site_categories: catData,
              nav_dropdowns: navData,
              main_nav_list: mainNavList
            })
          });
          const result = await res.json();
          if (result.success) {
            alert("🎉 保存成功！云端数据库已实时更新，全网访客打开页面即可看到最新主导航与下拉标签！");
          } else {
            alert("云端保存提示: " + (result.error || result.message || "接口未就绪，但已保存在本地！"));
          }
        } catch (err) {
          alert("✅ 已成功保存至本地配置！\n(若需全网访客实时生效，请确认 Cloudflare 后端已部署更新)");
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerText = "💾 保存设置并全网即时生效";
        }
      });

      // 7. 导出 YAML 配置
      document.getElementById("kzyc-export-yaml-btn")?.addEventListener("click", () => {
        let yamlStr = "site_categories:\n";
        for (const [z, e] of Object.entries(catData)) {
          yamlStr += `  ${z}: ${e}\n`;
        }
        yamlStr += "nav_dropdowns:\n";
        for (const [p, list] of Object.entries(navData)) {
          if (list && list.length > 0) {
            yamlStr += `  ${p}:\n`;
            list.forEach(item => {
              yamlStr += `    - name: ${item.name}\n      url: ${item.url}\n`;
            });
          }
        }
        navigator.clipboard.writeText(yamlStr).then(() => {
          alert("📋 已成功将最新配置复制到剪贴板！");
        }).catch(() => {
          prompt("请手动复制下方配置：", yamlStr);
        });
      });
    }

    // 全局删除分类
    window.deleteCategoryItem = function(zh) {
      if (!confirm(`确定要删除分类【${zh}】吗？`)) return;
      delete catData[zh];
      drawCategoriesContent();
    };

    // 全局删除主导航
    window.deleteMainNavItem = function(idx) {
      const navTitle = mainNavList[idx];
      if (!confirm(`确定要删除主导航【${navTitle}】及其全部下拉菜单吗？`)) return;
      mainNavList.splice(idx, 1);
      delete navData[navTitle];
      drawCategoriesContent();
    };

    // 全局删除子菜单项
    window.deleteSubnavItem = function(parent, idx) {
      if (navData[parent]) {
        navData[parent].splice(idx, 1);
        drawCategoriesContent();
      }
    };

    // 立即执行同步绘制（0ms 响应，秒开界面）
    drawCategoriesContent();

    // 异步静默拉取云端数据库配置（非阻塞）
    fetch(`${API_BASE}/api/site-nav`).then(r => r.json()).then(res => {
      if (res && res.success && res.data) {
        let hasNew = false;
        if (res.data.site_categories && Object.keys(res.data.site_categories).length > 0) {
          catData = res.data.site_categories;
          hasNew = true;
        }
        if (res.data.nav_dropdowns && Object.keys(res.data.nav_dropdowns).length > 0) {
          navData = res.data.nav_dropdowns;
          hasNew = true;
        }
        if (res.data.main_nav_list && Array.isArray(res.data.main_nav_list) && res.data.main_nav_list.length > 0) {
          mainNavList = res.data.main_nav_list;
          hasNew = true;
        }
        if (hasNew) drawCategoriesContent();
      }
    }).catch(() => {});
  }

  // 双重保险挂载到 window
  window.renderCategoriesTab = renderCategoriesTab;
})();
