// ============================================================
// 站长管理后台模块 - VIP 会员套餐价格与权益配置
// 文件名: vip-config.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 7. VIP 会员套餐价格与权益管理
  async function renderVipConfigTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取会员套餐与权益配置...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/vip-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const pricing = data.pricing || {};
      const vip = pricing.vip || {};
      const svip = pricing.svip || {};

      const defaultPriv = {
        user: ["✅ 每天限下载 3 篇资源", "✅ 支持公开软件下载", "❌ 无权下载会员专享资源", "❌ 社区互动基础权益"],
        vip: ["🚀 每天限下载 10 篇资源", "🔓 尊享全站【会员专享】资源", "🔑 畅享专属高速网盘与解压码", "💬 专属标准会员身份徽标"],
        svip: ["⚡ 每天限下载 20 篇海量资源", "🌟 全站所有资源任意无限畅下", "👑 专属至尊超级会员高贵徽标", "🤝 优先资源更新与技术答疑"]
      };
      const priv = data.privileges || defaultPriv;
      const uLines = ((priv.user && priv.user.length) ? priv.user : defaultPriv.user).join("\n");
      const vLines = ((priv.vip && priv.vip.length) ? priv.vip : defaultPriv.vip).join("\n");
      const sLines = ((priv.svip && priv.svip.length) ? priv.svip : defaultPriv.svip).join("\n");

      const v1m = (vip["1m"] && vip["1m"].amount) || "1.90";
      const v3m = (vip["3m"] && vip["3m"].amount) || "3.90";
      const v6m = (vip["6m"] && vip["6m"].amount) || "6.90";
      const v1y = (vip["1y"] && vip["1y"].amount) || "9.90";
      const vForever = (vip["forever"] && vip["forever"].amount) || "88.00";

      const s1m = (svip["1m"] && svip["1m"].amount) || "5.90";
      const s3m = (svip["3m"] && svip["3m"].amount) || "6.90";
      const s6m = (svip["6m"] && svip["6m"].amount) || "9.90";
      const s1y = (svip["1y"] && svip["1y"].amount) || "19.90";
      const sForever = (svip["forever"] && svip["forever"].amount) || "168.00";

      panel.innerHTML = `
        <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 14px;">💎 VIP 会员套餐价格与前台配置</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <!-- 标准会员价格设置 -->
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #2563eb; font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <span>💎</span> 标准会员 (VIP) 阶梯价格
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-1m" value="${v1m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">3 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-3m" value="${v3m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">6 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-6m" value="${v6m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 年 / 12个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-1y" value="${v1y}" type="number" step="0.01" />
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label style="font-size: 0.78rem; font-weight: 600;">永久会员 (元)</label>
              <input class="kzyc-adm-input" id="cfg-vip-forever" value="${vForever}" type="number" step="0.01" />
            </div>
          </div>

          <!-- 超级会员价格设置 -->
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #c026d3; font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <span>👑</span> 超级会员 (SVIP) 阶梯价格
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-1m" value="${s1m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">3 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-3m" value="${s3m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">6 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-6m" value="${s6m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 年 / 12个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-1y" value="${s1y}" type="number" step="0.01" />
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label style="font-size: 0.78rem; font-weight: 600;">永久超级会员 (元)</label>
              <input class="kzyc-adm-input" id="cfg-svip-forever" value="${sForever}" type="number" step="0.01" />
            </div>
          </div>
        </div>

        <!-- 3大卡片专属权益列表多行编辑区 -->
        <div style="font-weight: 800; font-size: 1rem; margin: 24px 0 10px 0;">📋 三大卡片专属权益列表编辑 (每行一条)</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; font-size: 0.86rem; margin-bottom: 8px;">🌐 普通用户权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-user" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(uLines)}</textarea>
          </div>
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #2563eb; font-size: 0.86rem; margin-bottom: 8px;">💎 标准会员权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-vip" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(vLines)}</textarea>
          </div>
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #c026d3; font-size: 0.86rem; margin-bottom: 8px;">👑 超级会员权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-svip" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(sLines)}</textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="kzyc-adm-btn primary" id="kzyc-save-vip-cfg-btn" style="padding: 10px 28px; font-size: 0.92rem;">
            💾 保存并实时同步到前台与支付接口
          </button>
        </div>
      `;

      document.getElementById("kzyc-save-vip-cfg-btn")?.addEventListener("click", async () => {
        const uArr = document.getElementById("cfg-priv-user").value.split("\n").map(s => s.trim()).filter(Boolean);
        const vArr = document.getElementById("cfg-priv-vip").value.split("\n").map(s => s.trim()).filter(Boolean);
        const sArr = document.getElementById("cfg-priv-svip").value.split("\n").map(s => s.trim()).filter(Boolean);

        const payload = {
          pricing: {
            vip: {
              "1m": { amount: (parseFloat(document.getElementById("cfg-vip-1m").value) || 1.9).toFixed(2), name: "标准会员 (1个月)" },
              "3m": { amount: (parseFloat(document.getElementById("cfg-vip-3m").value) || 3.9).toFixed(2), name: "标准会员 (3个月)" },
              "6m": { amount: (parseFloat(document.getElementById("cfg-vip-6m").value) || 6.9).toFixed(2), name: "标准会员 (6个月)" },
              "1y": { amount: (parseFloat(document.getElementById("cfg-vip-1y").value) || 9.9).toFixed(2), name: "标准会员 (1年)" },
              "forever": { amount: (parseFloat(document.getElementById("cfg-vip-forever").value) || 88).toFixed(2), name: "标准会员 (永久)" }
            },
            svip: {
              "1m": { amount: (parseFloat(document.getElementById("cfg-svip-1m").value) || 5.9).toFixed(2), name: "超级会员 (1个月)" },
              "3m": { amount: (parseFloat(document.getElementById("cfg-svip-3m").value) || 6.9).toFixed(2), name: "超级会员 (3个月)" },
              "6m": { amount: (parseFloat(document.getElementById("cfg-svip-6m").value) || 9.9).toFixed(2), name: "超级会员 (6个月)" },
              "1y": { amount: (parseFloat(document.getElementById("cfg-svip-1y").value) || 19.9).toFixed(2), name: "超级会员 (1年)" },
              "forever": { amount: (parseFloat(document.getElementById("cfg-svip-forever").value) || 168).toFixed(2), name: "超级会员 (永久)" }
            }
          },
          privileges: {
            user: uArr.length > 0 ? uArr : defaultPriv.user,
            vip: vArr.length > 0 ? vArr : defaultPriv.vip,
            svip: sArr.length > 0 ? sArr : defaultPriv.svip
          }
        };

        const sRes = await fetch(`${API_BASE}/api/admin/vip-config/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const sData = await sRes.json();
        if (sData.success) {
          alert(sData.message || "VIP 价格与权益配置保存成功！");
          renderVipConfigTab(panel);
        } else {
          alert(sData.error || "保存失败");
        }
      });

    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取 VIP 配置失败：${err.message}</div>`;
    }
  }


  window.renderVipConfigTab = renderVipConfigTab;
})();
