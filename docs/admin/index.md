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
/* 站长后台专属全套样式 */
.kzyc-adm-card {
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 14px;
  padding: 24px;
  margin-top: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.kzyc-adm-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(127, 127, 127, 0.15);
  padding-bottom: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.kzyc-adm-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid rgba(127, 127, 127, 0.12);
  padding-bottom: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.kzyc-adm-tab {
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  transition: all 0.2s;
}
.kzyc-adm-tab:hover {
  opacity: 1;
  background: rgba(37, 99, 235, 0.08);
}
.kzyc-adm-tab.active {
  opacity: 1;
  background: #2563eb;
  color: #ffffff !important;
}

/* 统计卡片网格 */
.kzyc-adm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.kzyc-adm-stat {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.15);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}
.kzyc-adm-stat-num {
  font-size: 1.85rem;
  font-weight: 800;
  color: #2563eb;
  margin: 6px 0;
}
.kzyc-adm-stat-num.warn { color: #ea580c; }
.kzyc-adm-stat-label { font-size: 0.82rem; opacity: 0.7; }

/* 表格与表单 */
.kzyc-adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 10px;
}
.kzyc-adm-table th, .kzyc-adm-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(127, 127, 127, 0.12);
  text-align: left;
}
.kzyc-adm-table th {
  background: rgba(127, 127, 127, 0.06);
  font-weight: 700;
}
.kzyc-adm-btn {
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.kzyc-adm-btn.primary { background: #2563eb; color: #fff !important; }
.kzyc-adm-btn.success { background: #16a34a; color: #fff !important; }
.kzyc-adm-btn.danger { background: #dc2626; color: #fff !important; }
.kzyc-adm-btn.warn { background: #ea580c; color: #fff !important; }

.kzyc-adm-form-card {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
}
.kzyc-adm-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 7px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: var(--md-default-bg-color, #fff);
  color: inherit;
  box-sizing: border-box;
  font-size: 0.88rem;
  margin-top: 4px;
}
</style>

<script>
(function() {
  const API_BASE = "https://auth.kzyc.de5.net";
  const TOKEN_KEY = "kzyc_token";
  let adminStats = null;
  let activeTab = "overview";

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
        renderNoPermission(root, "当前登录的账号不是管理员，拒绝访问！");
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
        <button type="button" class="kzyc-dl-btn" style="max-width: 200px; margin: 0 auto;" id="kzyc-admin-login-btn">立即登录管理员</button>
      </div>
    `;
    document.getElementById("kzyc-admin-login-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-open-auth")?.click();
    });
  }

  function renderAdminDashboard(root, admin) {
    root.innerHTML = `
      <div class="kzyc-adm-card">
        <!-- 顶部信息 -->
        <div class="kzyc-adm-topbar">
          <div style="font-size: 1.25rem; font-weight: 800;">👑 K资源仓 · 站长管理后台</div>
          <div style="font-size: 0.86rem; opacity: 0.85;">
            当前站长：<strong>${admin.username}</strong>
            <span style="opacity: 0.5; margin: 0 6px;">·</span>
            <a href="javascript:void(0)" id="kzyc-adm-logout" style="color: #ef4444;">退出管理</a>
          </div>
        </div>

        <!-- 导航菜单 -->
        <div class="kzyc-adm-nav">
          <button class="kzyc-adm-tab active" data-tab="overview">📊 数据概览</button>
          <button class="kzyc-adm-tab" data-tab="comments">💬 评论审核 ${adminStats.pending_comments > 0 ? `<span style="background: #ea580c; color: #fff; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem;">${adminStats.pending_comments}</span>` : ''}</button>
          <button class="kzyc-adm-tab" data-tab="resources">📦 资源管理</button>
          <button class="kzyc-adm-tab" data-tab="users">👥 用户与注销</button>
          <button class="kzyc-adm-tab" data-tab="words">🧹 敏感词过滤库</button>
        </div>

        <!-- 动态面板容器 -->
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
    if (tab === "comments") renderCommentsTab(panel);
    if (tab === "resources") renderResourcesTab(panel);
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
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">⏳ 待审核违规/新评</div><div class="kzyc-adm-stat-num ${adminStats.pending_comments > 0 ? 'warn' : ''}">${adminStats.pending_comments}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📥 今日下载获取量</div><div class="kzyc-adm-stat-num">${adminStats.today_downloads}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📦 全站总资源数</div><div class="kzyc-adm-stat-num">${adminStats.total_resources}</div></div>
      </div>
      <div style="font-size: 0.82rem; opacity: 0.6; text-align: center;">⚡ 数据基于 Cloudflare D1 边缘计算实时聚合统计</div>
    `;
  }

  // 2. 评论审核
  async function renderCommentsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载评论审核列表...</div>`;
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
            <tr>
              <th>ID</th><th>文章路径</th><th>发布用户</th><th>评论内容</th><th>状态</th><th>发布时间</th><th>管理操作</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr>
                <td>#${c.id}</td>
                <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.post_path}</td>
                <td><strong>${c.username}</strong></td>
                <td style="max-width: 260px;">${c.content}</td>
                <td>${c.status === 'pending' ? '<span style="color: #ea580c; font-weight: 700;">待审核</span>' : '<span style="color: #16a34a;">已发布</span>'}</td>
                <td style="font-size: 0.76rem; opacity: 0.6;">${c.created_at.slice(0, 16)}</td>
                <td>
                  ${c.status === 'pending' ? `<button class="kzyc-adm-btn success" onclick="moderateComment(${c.id}, 'approved')">通过</button>` : `<button class="kzyc-adm-btn warn" onclick="moderateComment(${c.id}, 'pending')">设为待审</button>`}
                  <button class="kzyc-adm-btn danger" onclick="deleteComment(${c.id})">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 3. 资源可视化管理
  async function renderResourcesTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载网盘资源列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/resources`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const list = data.resources || [];

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="font-weight: 700; font-size: 0.95rem;">📦 软件资源库管理 (${list.length})</span>
        <button class="kzyc-adm-btn primary" id="kzyc-add-res-btn">➕ 新增软件资源</button>
      </div>

      <!-- 新增/编辑表单框 -->
      <div id="kzyc-res-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.95rem;" id="kzyc-res-form-title">新增软件资源</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">资源唯一标识 (Key，与文章 data-key 一致)</label>
            <input class="kzyc-adm-input" id="kzyc-inp-key" placeholder="如: ps-script-2026" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">软件标题名称</label>
            <input class="kzyc-adm-input" id="kzyc-inp-title" placeholder="如: Adobe Photoshop 2026 中文直装版" />
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <label style="font-size: 0.8rem; font-weight: 600;">多网盘链接与提取码（格式：网盘名 | 链接 | 提取码，多个网盘用分号 ; 隔开）</label>
          <textarea class="kzyc-adm-input" id="kzyc-inp-url" style="min-height: 70px;" placeholder="百度网盘 | https://pan.baidu.com/... | 8888; 夸克网盘 | https://pan.quark.cn/... | 免密"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">专属解压密码</label>
            <input class="kzyc-adm-input" id="kzyc-inp-pwd" placeholder="如: 爱果核" />
          </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-res-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-res-btn">保存并生效</button>
        </div>
      </div>

      <!-- 资源列表表格 -->
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th>标识 Key</th><th>软件标题</th><th>下载通道配置</th><th>解压密码</th><th>管理操作</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(r => `
              <tr>
                <td><code>${r.resource_key}</code></td>
                <td><strong>${r.title}</strong></td>
                <td style="max-width: 280px; font-size: 0.78rem; opacity: 0.85;">${escapeHTML(r.download_url)}</td>
                <td><span style="background: rgba(234, 88, 12, 0.1); color: #ea580c; padding: 2px 6px; border-radius: 4px;">${r.unzip_pwd || '无'}</span></td>
                <td>
                  <button class="kzyc-adm-btn primary" onclick="editResource('${escapeHTML(r.resource_key)}', '${escapeHTML(r.title)}', '${escapeHTML(r.download_url)}', '${escapeHTML(r.unzip_pwd || '')}')">编辑</button>
                  <button class="kzyc-adm-btn danger" onclick="deleteResource('${escapeHTML(r.resource_key)}')">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("kzyc-add-res-btn").addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "block";
      document.getElementById("kzyc-res-form-title").textContent = "➕ 新增软件资源";
      document.getElementById("kzyc-inp-key").disabled = false;
      document.getElementById("kzyc-inp-key").value = "";
      document.getElementById("kzyc-inp-title").value = "";
      document.getElementById("kzyc-inp-url").value = "";
      document.getElementById("kzyc-inp-pwd").value = "";
    });

    document.getElementById("kzyc-cancel-res-btn").addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-res-btn").addEventListener("click", async () => {
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

  // 4. 用户与注销管理
  async function renderUsersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载用户列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const users = data.users || [];
    const deleted = data.deleted_accounts || [];

    panel.innerHTML = `
      <div style="margin-bottom: 24px;">
        <span style="font-weight: 700; font-size: 0.95rem;">👥 现有注册用户 (${users.length})</span>
        <div style="overflow-x: auto; margin-top: 8px;">
          <table class="kzyc-adm-table">
            <thead>
              <tr><th>UID</th><th>用户名</th><th>邮箱</th><th>身份</th><th>注册时间</th></tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>#${u.id}</td>
                  <td><strong>${u.username}</strong></td>
                  <td>${u.email}</td>
                  <td>${u.role === 'admin' ? '<span style="color: #ea580c; font-weight: 700;">👑 站长管理员</span>' : '普通用户'}</td>
                  <td style="font-size: 0.78rem; opacity: 0.6;">${u.created_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <span style="font-weight: 700; font-size: 0.95rem;">⚠️ 已注销账号（1年冷静期拦截列表）(${deleted.length})</span>
        <div style="overflow-x: auto; margin-top: 8px;">
          <table class="kzyc-adm-table">
            <thead>
              <tr><th>原注销用户名</th><th>原注销邮箱</th><th>注销时间（防重复注册保护中）</th></tr>
            </thead>
            <tbody>
              ${deleted.length === 0 ? '<tr><td colspan="3" style="opacity: 0.5; text-align: center;">暂无注销记录</td></tr>' : deleted.map(d => `
                <tr>
                  <td>${d.username}</td>
                  <td>${d.email}</td>
                  <td style="font-size: 0.78rem; color: #ef4444;">${d.deleted_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 5. 敏感词库
  async function renderWordsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取敏感词库...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/sensitive-words`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const words = data.words || [];

    panel.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px;">🧹 广告与违规敏感词库（命中将自动拦截进入审核）</div>

      <div class="kzyc-adm-form-card" style="display: flex; gap: 10px; align-items: center;">
        <input class="kzyc-adm-input" id="kzyc-inp-word" placeholder="输入要屏蔽的词汇（如：加微信、兼职、刷单）" style="margin: 0; flex: 1;" />
        <button class="kzyc-adm-btn primary" id="kzyc-add-word-btn" style="padding: 9px 18px;">➕ 添加敏感词</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px;">
        ${words.length === 0 ? '<div style="opacity: 0.5;">暂无敏感词</div>' : words.map(w => `
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(127,127,127,0.08); border: 1px solid rgba(127,127,127,0.18); border-radius: 6px; font-size: 0.84rem;">
            ${w.word}
            <button onclick="deleteWord(${w.id})" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
          </span>
        `).join('')}
      </div>
    `;

    document.getElementById("kzyc-add-word-btn").addEventListener("click", async () => {
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

  // 全局挂载的操作函数
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

  window.editResource = function(key, title, url, pwd) {
    const wrap = document.getElementById("kzyc-res-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";
    document.getElementById("kzyc-res-form-title").textContent = `✏️ 编辑资源：${key}`;
    const inpKey = document.getElementById("kzyc-inp-key");
    inpKey.value = key;
    inpKey.disabled = true; // Key 作为主键禁止改动，如需改建议新建
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
    switchTab("resources");
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