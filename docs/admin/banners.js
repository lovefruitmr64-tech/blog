// ============================================================
// 站长管理后台模块 - 首页焦点轮播图管理
// 文件名: banners.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 3. 轮播图管理
  async function renderBannersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取首页轮播图配置...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/banners`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const banners = data.banners || [];
    const b1 = banners[0] || { title: "", image_url: "", link_url: "" };
    const b2 = banners[1] || { title: "", image_url: "", link_url: "" };

    panel.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 14px;">🖼️ 首页两张轮播图动态换图与链接</div>

      <div class="kzyc-banner-card">
        <h4 style="margin: 0 0 10px; color: #2563eb;">📌 轮播图 1 配置</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">图片地址</label>
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
      if (d.success) alert("首页轮播图配置已成功更新并实时生效！");
      else alert(d.error || "保存失败");
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


  window.renderBannersTab = renderBannersTab;
})();
