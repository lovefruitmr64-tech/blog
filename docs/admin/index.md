---
title: 站长管理后台
hide:
  - toc
---

<div id="kzyc-admin-mount">
  <div style="padding: 40px 0; text-align: center; opacity: 0.6;">
    ⏳ 正在验证站长身份，请稍候...
  </div>
</div>

<style>
.kzyc-adm-card {
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 14px;
  padding: 22px;
  margin-top: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.kzyc-adm-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(127, 127, 127, 0.15);
  padding-bottom: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}
.kzyc-adm-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid rgba(127, 127, 127, 0.12);
  padding-bottom: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.kzyc-adm-tab {
  padding: 7px 14px;
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  transition: all 0.2s;
}
.kzyc-adm-tab:hover { opacity: 1; background: rgba(37, 99, 235, 0.08); }
.kzyc-adm-tab.active { opacity: 1; background: #2563eb; color: #ffffff !important; }

/* 统计卡片网格 */
.kzyc-adm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}
.kzyc-adm-stat {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.15);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}
.kzyc-adm-stat-num { font-size: 1.7rem; font-weight: 800; color: #2563eb; margin: 4px 0; }
.kzyc-adm-stat-num.warn { color: #ea580c; }
.kzyc-adm-stat-label { font-size: 0.8rem; opacity: 0.7; }

/* 表格紧凑轻量化 */
.kzyc-adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  margin-top: 10px;
  table-layout: fixed;
}
.kzyc-adm-table th, .kzyc-adm-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(127, 127, 127, 0.12);
  text-align: left;
  vertical-align: middle;
}
.kzyc-adm-table th { background: rgba(127, 127, 127, 0.06); font-weight: 700; font-size: 0.78rem; }

/* 单行截断省略，不撑开表格 */
.kzyc-cell-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.kzyc-adm-btn {
  padding: 5px 11px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.kzyc-adm-btn.primary { background: #2563eb; color: #fff !important; }
.kzyc-adm-btn.success { background: #16a34a; color: #fff !important; }
.kzyc-adm-btn.danger { background: #dc2626; color: #fff !important; }
.kzyc-adm-btn.warn { background: #ea580c; color: #fff !important; }

/* 表单与输入框 */
.kzyc-adm-form-card {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.kzyc-adm-input {
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: var(--md-default-bg-color, #fff);
  color: inherit;
  box-sizing: border-box;
  font-size: 0.84rem;
  margin-top: 4px;
}
.kzyc-search-input {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: var(--md-default-bg-color, #fff);
  color: inherit;
  font-size: 0.82rem;
  width: 220px;
}

/* 分页条组件 */
.kzyc-pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 16px;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.kzyc-page-btn {
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.76rem;
  transition: all 0.15s;
}
.kzyc-page-btn:hover:not(.disabled):not(.active) {
  background: rgba(37, 99, 235, 0.08);
  border-color: #2563eb;
}
.kzyc-page-btn.active {
  background: #2563eb;
  color: #fff !important;
  border-color: #2563eb;
}
.kzyc-page-btn.disabled { opacity: 0.35; cursor: not-allowed; }
.kzyc-page-ellipsis { padding: 0 4px; opacity: 0.5; }
.kzyc-page-jump { display: inline-flex; align-items: center; gap: 4px; margin-left: 8px; }
.kzyc-page-input {
  width: 44px;
  padding: 3px 5px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  color: inherit;
  font-size: 0.78rem;
}

/* 轮播图管理专属卡片 */
.kzyc-banner-card {
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 10px;
  padding: 14px;
  background: rgba(127, 127, 127, 0.03);
  margin-bottom: 14px;
}
.kzyc-banner-preview {
  max-width: 100%;
  max-height: 130px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 8px;
  border: 1px solid rgba(127, 127, 127, 0.2);
  display: block;
}
</style>

<script>
(function() {
  const API_BASE = "https://auth.kzyc.de5.net";
  const TOKEN_KEY = "kzyc_token";
  let adminStats = null;
  let activeTab = "overview";

  // 资源分页与搜索状态
  let allResources = [];
  let filteredResources = [];
  let resCurrentPage = 1;
  const RES_PAGE_SIZE = 10;

  // 用户分页与搜索状态
  let allUsers = [];
  let filteredUsers = [];
  let userCurrentPage = 1;
  const USER_PAGE_SIZE = 10;
  let allDeletedAccounts = [];

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 通用高级分页条渲染算法（支持 首页 1 2 3 ... 34 35 末页 + 指定页码输入框）
  function renderPaginationHTML(currentPage, totalItems, pageSize, funcName) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    if (totalPages <= 1) return "";

    let html = `<div class="kzyc-pagination-wrap">`;

    // 首页 & 上一页
    if (currentPage > 1) {
      html += `<button class="kzyc-page-btn" onclick="${funcName}(1)">首页</button>`;
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${currentPage - 1})">上一页</button>`;
    } else {
      html += `<button class="kzyc-page-btn disabled">首页</button>`;
      html += `<button class="kzyc-page-btn disabled">上一页</button>`;
    }

    // 中间页码（如 1 2 3 ... 34 35）
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    html += `<button class="kzyc-page-btn ${currentPage === 1 ? 'active' : ''}" onclick="${funcName}(1)">1</button>`;

    if (range.length > 0 && range[0] > 2) {
      html += `<span class="kzyc-page-ellipsis">...</span>`;
    }

    for (let i of range) {
      html += `<button class="kzyc-page-btn ${currentPage === i ? 'active' : ''}" onclick="${funcName}(${i})">${i}</button>`;
    }

    if (range.length > 0 && range[range.length - 1] < totalPages - 1) {
      html += `<span class="kzyc-page-ellipsis">...</span>`;
    }

    if (totalPages > 1) {
      html += `<button class="kzyc-page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="${funcName}(${totalPages})">${totalPages}</button>`;
    }

    // 下一页 & 末页
    if (currentPage < totalPages) {
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${currentPage + 1})">下一页</button>`;
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${totalPages})">末页</button>`;
    } else {
      html += `<button class="kzyc-page-btn disabled">下一页</button>`;
      html += `<button class="kzyc-page-btn disabled">末页</button>`;
    }

    // 跳转框
    html += `
      <span class="kzyc-page-jump">
        到第 <input type="number" class="kzyc-page-input" id="${funcName}-jump-val" min="1" max="${totalPages}" value="${currentPage}" onkeydown="if(event.key==='Enter') ${funcName}(parseInt(this.value, 10))" /> 页
        <button class="kzyc-page-btn" onclick="${funcName}(parseInt(document.getElementById('${funcName}-jump-val').value, 10))">跳转</button>
      </span>
    `;

    html += `</div>`;
    return html;
  }

  async function checkAdminAuth() {
    const root = document.getElementById("kzyc-admin-mount");
    if (!root) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      renderNoPermission(root, "您当前未登录，无法访问站长管理后台。");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        adminStats = data.stats;
        renderAdminDashboard(root, data.admin);
      } else {
        renderNoPermission(root, "当前登录账号非管理员，拒绝访问！");
      }
    } catch {
      renderNoPermission(root, "通信异常，无法校验管理员权限。");
    }
  }

  function renderNoPermission(root, text) {
    root.innerHTML = `
      <div class="kzyc-adm-card" style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔒</div>
        <h3 style="margin: 0 0 10px;">站长专属管理后台</h3>
        <p style="opacity: 0.7; font-size: 0.9rem; margin-bottom: 20px;">${text}</p>
        <button type="button" class="kzyc-adm-btn primary" style="padding: 10px 24px; font-size: 0.9rem;" id="kzyc-admin-login-btn">立即登录管理员账号</button>
      </div>
    `;
    document.getElementById("kzyc-admin-login-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-open-auth")?.click();
    });
  }

  function renderAdminDashboard(root, admin) {
    root.innerHTML = `
      <div class="kzyc-adm-card">
        <div class="kzyc-adm-topbar">
          <div style="font-size: 1.25rem; font-weight: 800;">👑 K资源仓 · 站长管理后台</div>
          <div style="font-size: 0.86rem; opacity: 0.85;">
            当前站长：<strong>${escapeHTML(admin.username)}</strong>
            <span style="opacity: 0.5; margin: 0 6px;">·</span>
            <a href="javascript:void(0)" id="kzyc-adm-logout" style="color: #ef4444;">退出管理</a>
          </div>
        </div>

        <div class="kzyc-adm-nav">
          <button class="kzyc-adm-tab active" data-tab="overview">📊 数据概览</button>
          <button class="kzyc-adm-tab" data-tab="resources">📦 资源管理</button>
          <button class="kzyc-adm-tab" data-tab="banners">🖼️ 首页轮播图</button>
          <button class="kzyc-adm-tab" data-tab="comments">💬 评论审核 ${adminStats.pending_comments > 0 ? `<span style="background: #ea580c; color: #fff; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem;">${adminStats.pending_comments}</span>` : ''}</button>
          <button class="kzyc-adm-tab" data-tab="users">👥 用户管理</button>
          <button class="kzyc-adm-tab" data-tab="words">🧹 敏感词库</button>
        </div>

        <div id="kzyc-adm-panel"></div>
      </div>
    `;

    document.getElementById("kzyc-adm-logout").addEventListener("click", () => {
      localStorage.removeItem(TOKEN_KEY);
      location.reload();
    });

    document.querySelectorAll(".kzyc-adm-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".kzyc-adm-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeTab = tab.getAttribute("data-tab");
        switchTab(activeTab);
      });
    });

    switchTab("overview");
  }

  function switchTab(tab) {
    const panel = document.getElementById("kzyc-adm-panel");
    if (!panel) return;

    if (tab === "overview") renderOverviewTab(panel);
    if (tab === "resources") renderResourcesTab(panel);
    if (tab === "banners") renderBannersTab(panel);
    if (tab === "comments") renderCommentsTab(panel);
    if (tab === "users") renderUsersTab(panel);
    if (tab === "words") renderWordsTab(panel);
  }

  // 1. 数据概览
  function renderOverviewTab(panel) {
    panel.innerHTML = `
      <div class="kzyc-adm-grid">
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">👥 注册总用户</div><div class="kzyc-adm-stat-num">${adminStats.total_users}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📈 今日新增注册</div><div class="kzyc-adm-stat-num">${adminStats.today_reg}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">💬 全站评论总数</div><div class="kzyc-adm-stat-num">${adminStats.total_comments}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">⏳ 待审核评论</div><div class="kzyc-adm-stat-num ${adminStats.pending_comments > 0 ? 'warn' : ''}">${adminStats.pending_comments}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📥 今日下载次数</div><div class="kzyc-adm-stat-num">${adminStats.today_downloads}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📦 全站总资源数</div><div class="kzyc-adm-stat-num">${adminStats.total_resources}</div></div>
      </div>
      <div style="font-size: 0.82rem; opacity: 0.6; text-align: center;">⚡ Cloudflare D1 边缘数据库实时聚合驱动</div>
    `;
  }

  // 2. 资源管理（带左侧搜索框、文字缩小单行截断、10条分页与跳转）
  async function renderResourcesTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取资源列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/resources`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allResources = data.resources || [];
      filteredResources = allResources;
      resCurrentPage = 1;
      drawResourcesTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取资源失败：${err.message}</div>`;
    }
  }

  function drawResourcesTable(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (resCurrentPage - 1) * RES_PAGE_SIZE;
    const pageItems = filteredResources.slice(startIdx, startIdx + RES_PAGE_SIZE);

    panel.innerHTML = `
      <!-- 搜索框与新增按钮顶栏 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-res-search-input" placeholder="🔍 搜索软件标题或 Key..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredResources.length} 项</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-res-btn">➕ 新增软件资源</button>
      </div>

      <!-- 资源编辑/新增表单 -->
      <div id="kzyc-res-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.92rem;" id="kzyc-res-form-title">新增软件资源</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">资源标识 (Key，与文章 data-key 一致)</label>
            <input class="kzyc-adm-input" id="kzyc-inp-key" placeholder="如: illustrator-2026" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">软件标题名称</label>
            <input class="kzyc-adm-input" id="kzyc-inp-title" placeholder="如: Adobe Illustrator 2026 直装版" />
          </div>
        </div>
        <div style="margin-bottom: 8px;">
          <label style="font-size: 0.78rem; font-weight: 600;">多网盘链接与提取码（网盘名 | 链接 | 提取码，多个分号 ; 隔开）</label>
          <textarea class="kzyc-adm-input" id="kzyc-inp-url" style="min-height: 80px;" placeholder="百度网盘 | https://pan.baidu.com/... | 8888; 夸克网盘 | https://pan.quark.cn/... | 免密"></textarea>
        </div>
        <div style="margin-bottom: 12px; max-width: 300px;">
          <label style="font-size: 0.78rem; font-weight: 600;">专属解压密码</label>
          <input class="kzyc-adm-input" id="kzyc-inp-pwd" placeholder="如: 爱果核" />
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-res-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-res-btn">保存并生效</button>
        </div>
      </div>

      <!-- 表格内容（紧凑、截断） -->
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th style="width: 140px;">标识 Key</th>
              <th style="width: 220px;">软件标题</th>
              <th>网盘链接与配置 (单行截断，编辑查看全部)</th>
              <th style="width: 80px;">解压密码</th>
              <th style="width: 110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="5" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配资源</td></tr>' : pageItems.map(r => `
              <tr>
                <td><code class="kzyc-cell-truncate" title="${escapeHTML(r.resource_key)}">${escapeHTML(r.resource_key)}</code></td>
                <td><strong class="kzyc-cell-truncate" title="${escapeHTML(r.title)}">${escapeHTML(r.title)}</strong></td>
                <td><span class="kzyc-cell-truncate" style="opacity: 0.8;" title="${escapeHTML(r.download_url)}">${escapeHTML(r.download_url)}</span></td>
                <td><span style="background: rgba(234, 88, 12, 0.1); color: #ea580c; padding: 1px 5px; border-radius: 4px; font-size: 0.75rem;">${escapeHTML(r.unzip_pwd || '无')}</span></td>
                <td>
                  <button class="kzyc-adm-btn primary" data-key="${escapeHTML(r.resource_key)}" data-title="${escapeHTML(r.title)}" data-url="${escapeHTML(r.download_url)}" data-pwd="${escapeHTML(r.unzip_pwd || '')}" onclick="handleEditResource(this)">编辑</button>
                  <button class="kzyc-adm-btn danger" onclick="deleteResource('${escapeHTML(r.resource_key)}')">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- 10条/页分页条 -->
      <div id="kzyc-res-pagination-container">
        ${renderPaginationHTML(resCurrentPage, filteredResources.length, RES_PAGE_SIZE, "gotoResPage")}
      </div>
    `;

    // 搜索事件监听
    const searchInput = document.getElementById("kzyc-res-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredResources = allResources.filter(r =>
          (r.resource_key && r.resource_key.toLowerCase().includes(q)) ||
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.download_url && r.download_url.toLowerCase().includes(q))
        );
        resCurrentPage = 1;
        drawResourcesTable(panel);
        // 保持搜索框焦点
        const newSearchInput = document.getElementById("kzyc-res-search-input");
        if (newSearchInput) {
          newSearchInput.value = e.target.value;
          newSearchInput.focus();
        }
      });
    }

    document.getElementById("kzyc-add-res-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "block";
      document.getElementById("kzyc-res-form-title").textContent = "➕ 新增软件资源";
      const kInput = document.getElementById("kzyc-inp-key");
      kInput.disabled = false;
      kInput.value = "";
      document.getElementById("kzyc-inp-title").value = "";
      document.getElementById("kzyc-inp-url").value = "";
      document.getElementById("kzyc-inp-pwd").value = "";
      document.getElementById("kzyc-res-form-wrap").scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-res-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-res-btn")?.addEventListener("click", async () => {
      const key = document.getElementById("kzyc-inp-key").value.trim();
      const title = document.getElementById("kzyc-inp-title").value.trim();
      const download_url = document.getElementById("kzyc-inp-url").value.trim();
      const unzip_pwd = document.getElementById("kzyc-inp-pwd").value.trim();

      if (!key || !title || !download_url) {
        alert("请完整填写标识Key、软件标题和网盘链接！");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/resources/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resource_key: key, title, download_url, unzip_pwd })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "保存成功！");
        renderResourcesTab(panel);
      } else {
        alert(data.error || "保存失败");
      }
    });
  }

  window.gotoResPage = function(p) {
    const totalPages = Math.ceil(filteredResources.length / RES_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    resCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawResourcesTable(panel);
  };

  // 3. 首页轮播图管理
  async function renderBannersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取首页轮播图配置...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/banners`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const banners = data.banners || [];
    const b1 = banners[0] || { title: "", image_url: "", link_url: "" };
    const b2 = banners || { title: "", image_url: "", link_url: "" };

    panel.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 14px;">🖼️ 首页两张轮播图动态换图与链接</div>

      <div class="kzyc-banner-card">
        <h4 style="margin: 0 0 10px; color: #2563eb;">📌 轮播图 1 配置</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">图片地址 (绝对URL或相对路径)</label>
            <input class="kzyc-adm-input" id="b1-img" value="${escapeHTML(b1.image_url)}" placeholder="https://... 或 assets/images/..." oninput="updateBannerPreview(1)" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">点击跳转链接</label>
            <input class="kzyc-adm-input" id="b1-link" value="${escapeHTML(b1.link_url)}" placeholder="/blog/xxx/ 或 https://..." />
          </div>
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600;">图片标题 (可选)</label>
          <input class="kzyc-adm-input" id="b1-title" value="${escapeHTML(b1.title)}" placeholder="如：Adobe 2026 全家桶正式发布" />
        </div>
        <div>
          <img id="b1-preview" class="kzyc-banner-preview" src="${b1.image_url}" style="${b1.image_url ? '' : 'display:none;'}" />
        </div>
      </div>

      <div class="kzyc-banner-card">
        <h4 style="margin: 0 0 10px; color: #2563eb;">📌 轮播图 2 配置</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">图片地址</label>
            <input class="kzyc-adm-input" id="b2-img" value="${escapeHTML(b2.image_url)}" placeholder="https://... 或 assets/images/..." oninput="updateBannerPreview(2)" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">点击跳转链接</label>
            <input class="kzyc-adm-input" id="b2-link" value="${escapeHTML(b2.link_url)}" placeholder="/blog/xxx/ 或 https://..." />
          </div>
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600;">图片标题 (可选)</label>
          <input class="kzyc-adm-input" id="b2-title" value="${escapeHTML(b2.title)}" placeholder="如：PS 批量图层导出脚本工具" />
        </div>
        <div>
          <img id="b2-preview" class="kzyc-banner-preview" src="${b2.image_url}" style="${b2.image_url ? '' : 'display:none;'}" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
        <button class="kzyc-adm-btn primary" id="kzyc-save-banners-btn" style="padding: 10px 24px; font-size: 0.9rem;">💾 保存轮播图配置</button>
      </div>
    `;

    document.getElementById("kzyc-save-banners-btn")?.addEventListener("click", async () => {
      const payload = [
        {
          image_url: document.getElementById("b1-img").value.trim(),
          link_url: document.getElementById("b1-link").value.trim(),
          title: document.getElementById("b1-title").value.trim(),
        },
        {
          image_url: document.getElementById("b2-img").value.trim(),
          link_url: document.getElementById("b2-link").value.trim(),
          title: document.getElementById("b2-title").value.trim(),
        }
      ];

      const r = await fetch(`${API_BASE}/api/admin/banners/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ banners: payload })
      });
      const d = await r.json();
      if (d.success) {
        alert("首页轮播图配置已成功更新并实时生效！");
      } else {
        alert(d.error || "保存失败");
      }
    });
  }

  window.updateBannerPreview = function(num) {
    const val = document.getElementById(`b${num}-img`).value.trim();
    const img = document.getElementById(`b${num}-preview`);
    if (val) {
      img.src = val;
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  };

  // 4. 用户管理（带搜索、添加、修改、删除与10条分页）
  async function renderUsersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载用户列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allUsers = data.users || [];
      filteredUsers = allUsers;
      allDeletedAccounts = data.deleted_accounts || [];
      userCurrentPage = 1;
      drawUsersTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取用户失败：${err.message}</div>`;
    }
  }

  function drawUsersTable(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (userCurrentPage - 1) * USER_PAGE_SIZE;
    const pageItems = filteredUsers.slice(startIdx, startIdx + USER_PAGE_SIZE);

    panel.innerHTML = `
      <!-- 搜索与添加顶栏 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-user-search-input" placeholder="🔍 搜索 UID、用户名或邮箱..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredUsers.length} 位用户</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-user-btn">➕ 添加新用户</button>
      </div>

      <!-- 添加/编辑用户弹窗表单 -->
      <div id="kzyc-user-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.92rem;" id="kzyc-user-form-title">添加新用户</h4>
        <input type="hidden" id="kzyc-user-id-val" />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">用户名 (3-30 字符)</label>
            <input class="kzyc-adm-input" id="kzyc-user-name-inp" placeholder="输入用户名" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">注册邮箱</label>
            <input class="kzyc-adm-input" id="kzyc-user-email-inp" placeholder="example@mail.com" />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">用户身份角色</label>
            <select class="kzyc-adm-input" id="kzyc-user-role-inp">
              <option value="user">普通用户</option>
              <option value="admin">👑 站长管理员</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;" id="kzyc-user-pwd-label">登录密码 (至少8位)</label>
            <input class="kzyc-adm-input" type="password" id="kzyc-user-pwd-inp" placeholder="输入密码" />
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-user-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-user-btn">确认提交</button>
        </div>
      </div>

      <!-- 用户列表表格 -->
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th style="width: 70px;">UID</th>
              <th style="width: 170px;">用户名</th>
              <th>邮箱</th>
              <th style="width: 110px;">身份角色</th>
              <th style="width: 140px;">注册时间</th>
              <th style="width: 110px;">管理操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="6" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配用户</td></tr>' : pageItems.map(u => `
              <tr>
                <td>#${u.id}</td>
                <td><strong class="kzyc-cell-truncate" title="${escapeHTML(u.username)}">${escapeHTML(u.username)}</strong></td>
                <td><span class="kzyc-cell-truncate" title="${escapeHTML(u.email)}">${escapeHTML(u.email)}</span></td>
                <td>${u.role === 'admin' ? '<span style="color: #ea580c; font-weight: 700; background: rgba(234,88,12,0.1); padding: 2px 6px; border-radius: 4px;">👑 站长</span>' : '<span style="color: #2563eb; background: rgba(37,99,235,0.1); padding: 2px 6px; border-radius: 4px;">普通用户</span>'}</td>
                <td style="font-size: 0.76rem; opacity: 0.6;">${u.created_at ? u.created_at.slice(0, 16) : '--'}</td>
                <td>
                  <button class="kzyc-adm-btn primary" data-id="${u.id}" data-name="${escapeHTML(u.username)}" data-email="${escapeHTML(u.email)}" data-role="${u.role}" onclick="handleEditUser(this)">编辑</button>
                  <button class="kzyc-adm-btn danger" onclick="handleDeleteUser(${u.id}, '${escapeHTML(u.username)}')">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- 10条/页分页条 -->
      <div id="kzyc-user-pagination-container">
        ${renderPaginationHTML(userCurrentPage, filteredUsers.length, USER_PAGE_SIZE, "gotoUserPage")}
      </div>

      <!-- 注销保护期列表 -->
      <div style="margin-top: 24px;">
        <span style="font-weight: 700; font-size: 0.88rem; color: #ef4444;">⚠️ 已注销账号（1年冷静期拦截，禁止重新注册）(${allDeletedAccounts.length})</span>
        <div style="overflow-x: auto; margin-top: 6px;">
          <table class="kzyc-adm-table">
            <thead>
              <tr><th>原用户名</th><th>原注册邮箱</th><th>注销时间</th></tr>
            </thead>
            <tbody>
              ${allDeletedAccounts.length === 0 ? '<tr><td colspan="3" style="opacity: 0.5; text-align: center; padding: 12px;">暂无注销记录</td></tr>' : allDeletedAccounts.map(d => `
                <tr>
                  <td>${escapeHTML(d.username)}</td>
                  <td>${escapeHTML(d.email)}</td>
                  <td style="font-size: 0.76rem; color: #ef4444;">${d.deleted_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // 用户搜索监听
    const searchInput = document.getElementById("kzyc-user-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredUsers = allUsers.filter(u =>
          String(u.id).includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
        );
        userCurrentPage = 1;
        drawUsersTable(panel);
        const newInp = document.getElementById("kzyc-user-search-input");
        if (newInp) {
          newInp.value = e.target.value;
          newInp.focus();
        }
      });
    }

    // 添加新用户按钮
    document.getElementById("kzyc-add-user-btn")?.addEventListener("click", () => {
      const wrap = document.getElementById("kzyc-user-form-wrap");
      wrap.style.display = "block";
      document.getElementById("kzyc-user-form-title").textContent = "➕ 添加新用户";
      document.getElementById("kzyc-user-id-val").value = "";
      document.getElementById("kzyc-user-name-inp").value = "";
      document.getElementById("kzyc-user-email-inp").value = "";
      document.getElementById("kzyc-user-role-inp").value = "user";
      document.getElementById("kzyc-user-pwd-inp").value = "";
      document.getElementById("kzyc-user-pwd-label").textContent = "登录初始密码 (至少8位)";
      document.getElementById("kzyc-user-pwd-inp").required = true;
      wrap.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-user-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-user-form-wrap").style.display = "none";
    });

    // 保存提交用户
    document.getElementById("kzyc-save-user-btn")?.addEventListener("click", async () => {
      const uid = document.getElementById("kzyc-user-id-val").value.trim();
      const username = document.getElementById("kzyc-user-name-inp").value.trim();
      const email = document.getElementById("kzyc-user-email-inp").value.trim();
      const role = document.getElementById("kzyc-user-role-inp").value;
      const pwd = document.getElementById("kzyc-user-pwd-inp").value.trim();

      if (!username || !email) {
        alert("用户名和邮箱不能为空！");
        return;
      }

      if (!uid && (!pwd || pwd.length < 8)) {
        alert("新增用户必须设置至少 8 位的初始密码！");
        return;
      }

      const endpoint = uid ? `${API_BASE}/api/admin/users/update` : `${API_BASE}/api/admin/users/add`;
      const payload = uid
        ? { user_id: uid, username, email, role, new_password: pwd }
        : { username, email, password: pwd, role };

      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const d = await r.json();
      if (d.success) {
        alert(d.message || "操作成功！");
        renderUsersTab(panel);
      } else {
        alert(d.error || "操作失败");
      }
    });
  }

  window.gotoUserPage = function(p) {
    const totalPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    userCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawUsersTable(panel);
  };

  // 5. 评论审核
  async function renderCommentsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载评论列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/comments`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const list = data.comments || [];

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 700; font-size: 0.95rem;">全站最新评论列表 (${list.length})</span>
      </div>
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr><th style="width: 50px;">ID</th><th style="width: 140px;">文章路径</th><th style="width: 100px;">发布用户</th><th>评论内容</th><th style="width: 80px;">状态</th><th style="width: 120px;">发布时间</th><th style="width: 110px;">操作</th></tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr>
                <td>#${c.id}</td>
                <td><span class="kzyc-cell-truncate" title="${escapeHTML(c.post_path)}">${escapeHTML(c.post_path)}</span></td>
                <td><strong class="kzyc-cell-truncate" title="${escapeHTML(c.username)}">${escapeHTML(c.username)}</strong></td>
                <td><span class="kzyc-cell-truncate" title="${escapeHTML(c.content)}">${escapeHTML(c.content)}</span></td>
                <td>${c.status === 'pending' ? '<span style="color: #ea580c; font-weight: 700;">待审核</span>' : '<span style="color: #16a34a;">已通过</span>'}</td>
                <td style="font-size: 0.74rem; opacity: 0.6;">${c.created_at.slice(0, 16)}</td>
                <td>
                  ${c.status === 'pending' ? `<button class="kzyc-adm-btn success" onclick="moderateComment(${c.id}, 'approved')">通过</button>` : `<button class="kzyc-adm-btn warn" onclick="moderateComment(${c.id}, 'pending')">待审</button>`}
                  <button class="kzyc-adm-btn danger" onclick="deleteComment(${c.id})">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 6. 敏感词库
  async function renderWordsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取敏感词库...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/sensitive-words`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const words = data.words || [];

    panel.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px;">🧹 违规敏感词库（命中自动进入待审）</div>

      <div class="kzyc-adm-form-card" style="display: flex; gap: 10px; align-items: center;">
        <input class="kzyc-adm-input" id="kzyc-inp-word" placeholder="输入要拦截的敏感词汇（如：加微信、兼职、刷单）" style="margin: 0; flex: 1;" />
        <button class="kzyc-adm-btn primary" id="kzyc-add-word-btn" style="padding: 8px 16px;">➕ 添加敏感词</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px;">
        ${words.length === 0 ? '<div style="opacity: 0.5;">暂无敏感词</div>' : words.map(w => `
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(127,127,127,0.08); border: 1px solid rgba(127,127,127,0.18); border-radius: 6px; font-size: 0.82rem;">
            ${escapeHTML(w.word)}
            <button onclick="deleteWord(${w.id})" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
          </span>
        `).join('')}
      </div>
    `;

    document.getElementById("kzyc-add-word-btn")?.addEventListener("click", async () => {
      const word = document.getElementById("kzyc-inp-word").value.trim();
      if (!word) return;

      const r = await fetch(`${API_BASE}/api/admin/sensitive-words/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ word })
      });
      const d = await r.json();
      if (d.success) renderWordsTab(panel);
    });
  }

  // 全局交互钩子
  window.handleEditResource = function(btn) {
    const wrap = document.getElementById("kzyc-res-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";

    const key = btn.getAttribute("data-key");
    const title = btn.getAttribute("data-title");
    const url = btn.getAttribute("data-url");
    const pwd = btn.getAttribute("data-pwd");

    document.getElementById("kzyc-res-form-title").textContent = `✏️ 编辑软件资源：${key}`;
    const inpKey = document.getElementById("kzyc-inp-key");
    inpKey.value = key;
    inpKey.disabled = true;
    document.getElementById("kzyc-inp-title").value = title;
    document.getElementById("kzyc-inp-url").value = url;
    document.getElementById("kzyc-inp-pwd").value = pwd;
    wrap.scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteResource = async function(key) {
    if (!confirm(`确定要彻底删除资源 [${key}] 吗？删除后前台将无法获取该下载链接！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/resources/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resource_key: key })
    });
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) renderResourcesTab(panel);
  };

  window.handleEditUser = function(btn) {
    const wrap = document.getElementById("kzyc-user-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";

    const uid = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name");
    const email = btn.getAttribute("data-email");
    const role = btn.getAttribute("data-role");

    document.getElementById("kzyc-user-form-title").textContent = `✏️ 编辑用户 UID: #${uid}`;
    document.getElementById("kzyc-user-id-val").value = uid;
    document.getElementById("kzyc-user-name-inp").value = name;
    document.getElementById("kzyc-user-email-inp").value = email;
    document.getElementById("kzyc-user-role-inp").value = role || "user";
    document.getElementById("kzyc-user-pwd-label").textContent = "重置登录密码 (如不修改请留空)";
    document.getElementById("kzyc-user-pwd-inp").value = "";
    document.getElementById("kzyc-user-pwd-inp").required = false;
    wrap.scrollIntoView({ behavior: 'smooth' });
  };

  window.handleDeleteUser = async function(uid, username) {
    if (!confirm(`⚠️ 最终确认：确定要彻底删除用户 [${username}] (UID: #${uid}) 吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/users/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: uid })
    });
    const data = await res.json();
    if (data.success) {
      alert("用户已删除！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "删除失败");
    }
  };

  window.moderateComment = async function(id, status) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id, status })
    });
    switchTab("comments");
  };

  window.deleteComment = async function(id) {
    if (!confirm("确定要彻底删除这条评论及其相关回复吗？")) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id })
    });
    switchTab("comments");
  };

  window.deleteWord = async function(id) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/sensitive-words/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    switchTab("words");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAdminAuth);
  } else {
    checkAdminAuth();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(checkAdminAuth);
  }
})();
</script>