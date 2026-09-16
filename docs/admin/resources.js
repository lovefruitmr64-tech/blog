// ============================================================
// 站长管理后台模块 - 软件网盘与解压密码资源管理
// 文件名: resources.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 2. 资源管理
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-res-search-input" placeholder="🔍 搜索软件标题或 Key..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredResources.length} 项</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-res-btn">➕ 新增软件资源</button>
      </div>

      <div id="kzyc-res-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.92rem;" id="kzyc-res-form-title">新增软件资源</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">资源标识 (Key，与文章 data-key 一致)</label>
            <input class="kzyc-adm-input" id="kzyc-inp-key" placeholder="如: illustrator-2026" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">软件标题名称</label>
            <input class="kzyc-adm-input" id="kzyc-inp-title" placeholder="如: Adobe Illustrator 2026 中文直装版" />
          </div>
        </div>
        <div style="margin-bottom: 8px;">
          <label style="font-size: 0.78rem; font-weight: 600;">多网盘链接与提取码（网盘名 | 链接 | 提取码，分号 ; 隔开）</label>
          <textarea class="kzyc-adm-input" id="kzyc-inp-url" style="min-height: 80px;" placeholder="百度网盘 | https://pan.baidu.com/... | 8888; 夸克网盘 | https://pan.quark.cn/... | 免密"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">专属解压密码</label>
            <input class="kzyc-adm-input" id="kzyc-inp-pwd" placeholder="如: 爱果核" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">下载门槛权限</label>
            <select class="kzyc-adm-input" id="kzyc-inp-vip-only">
              <option value="0">🌐 普通公开资源 (所有登录用户可下载，受每日配额限制)</option>
              <option value="1">💎 标准会员专享 (标准会员 / 超级会员 / 站长可下载)</option>
              <option value="2">👑 超级会员专享 (仅超级会员 SVIP / 站长可下载)</option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-res-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-res-btn">保存并生效</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 140px;">标识 Key</th>
              <th class="kzyc-nowrap" style="width: 220px;">软件标题</th>
              <th>网盘链接配置 (单行截断，编辑查看全部)</th>
              <th class="kzyc-nowrap" style="width: 90px;">解压密码</th>
              <th class="kzyc-nowrap" style="width: 105px;">下载权限</th>
              <th class="kzyc-nowrap" style="width: 110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="6" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配资源</td></tr>' : pageItems.map(r => `
              <tr>
                <td class="kzyc-nowrap"><code class="kzyc-cell-truncate" style="max-width: 130px;" title="${escapeHTML(r.resource_key)}">${escapeHTML(r.resource_key)}</code></td>
                <td><strong class="kzyc-cell-truncate" style="max-width: 200px;" title="${escapeHTML(r.title)}">${escapeHTML(r.title)}</strong></td>
                <td><span class="kzyc-cell-truncate" style="opacity: 0.8;" title="${escapeHTML(r.download_url)}">${escapeHTML(r.download_url)}</span></td>
                <td class="kzyc-nowrap"><span style="background: rgba(234, 88, 12, 0.1); color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 0.74rem; font-weight: 600; white-space: nowrap;">${escapeHTML(r.unzip_pwd || '无')}</span></td>
                <td class="kzyc-nowrap">${(r.is_vip_only === 2 || r.is_vip_only === '2')
                  ? '<span style="color: #c026d3; font-weight: 700; background: rgba(217,70,239,0.12); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">👑 超级会员专享</span>'
                  : ((r.is_vip_only === 1 || r.is_vip_only === '1')
                    ? '<span style="color: #2563eb; font-weight: 700; background: rgba(37,99,235,0.12); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">💎 标准会员专享</span>'
                    : '<span style="opacity: 0.7; white-space: nowrap;">🌐 公开</span>')}</td>
                <td class="kzyc-nowrap">
                  <button class="kzyc-adm-btn primary" data-key="${escapeHTML(r.resource_key)}" data-title="${escapeHTML(r.title)}" data-url="${escapeHTML(r.download_url)}" data-pwd="${escapeHTML(r.unzip_pwd || '')}" data-vip="${r.is_vip_only || 0}" onclick="handleEditResource(this)">编辑</button>
                  <button class="kzyc-adm-btn danger" onclick="deleteResource('${escapeHTML(r.resource_key)}')">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-res-pagination-container">
        ${renderPaginationHTML(resCurrentPage, filteredResources.length, RES_PAGE_SIZE, "gotoResPage")}
      </div>
    `;

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
        const newSearchInput = document.getElementById("kzyc-res-search-input");
        if (newSearchInput) {
          newSearchInput.value = e.target.value;
          newSearchInput.focus();
        }
      });
    }

    document.getElementById("kzyc-add-res-btn")?.addEventListener("click", () => {
      const wrap = document.getElementById("kzyc-res-form-wrap");
      wrap.style.display = "block";
      document.getElementById("kzyc-res-form-title").textContent = "➕ 新增软件资源";
      const kInput = document.getElementById("kzyc-inp-key");
      kInput.disabled = false;
      kInput.value = "";
      document.getElementById("kzyc-inp-title").value = "";
      document.getElementById("kzyc-inp-url").value = "";
      document.getElementById("kzyc-inp-pwd").value = "";
      document.getElementById("kzyc-inp-vip-only").value = "0";
      wrap.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-res-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-res-btn")?.addEventListener("click", async () => {
      const key = document.getElementById("kzyc-inp-key").value.trim();
      const title = document.getElementById("kzyc-inp-title").value.trim();
      const download_url = document.getElementById("kzyc-inp-url").value.trim();
      const unzip_pwd = document.getElementById("kzyc-inp-pwd").value.trim();
      const is_vip_only = document.getElementById("kzyc-inp-vip-only").value;

      if (!key || !title || !download_url) {
        alert("请完整填写标识Key、软件标题和网盘链接！");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/resources/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resource_key: key, title, download_url, unzip_pwd, is_vip_only })
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


  window.renderResourcesTab = renderResourcesTab;
})();
