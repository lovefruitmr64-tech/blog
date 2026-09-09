(function () {
  console.log("[kzyc-auth] 核心脚本启动成功！");

  const API_BASE = "https://auth.kzyc.de5.net";
  const TOKEN_KEY = "kzyc_token";
  const TURNSTILE_SITE_KEY = "0x4AAAAAAElpbO-4m9lnVEmf";

  let currentUser = null;
  let pendingDownloadBtn = null;

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 自定义屏幕正中确认弹窗（替代浏览器原生顶部 confirm）
  function showCenterConfirm(msg, onConfirm) {
    let wrap = document.getElementById("kzyc-confirm-modal");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "kzyc-confirm-modal";
      wrap.innerHTML = `
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;">
          <div style="background:var(--md-default-bg-color,#fff);color:var(--md-default-fg-color,#1e293b);padding:22px 24px;border-radius:12px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.3);max-width:340px;width:88%;text-align:center;box-sizing:border-box;">
            <div style="font-size:1.05rem;font-weight:700;margin-bottom:10px;">提示确认</div>
            <div id="kzyc-confirm-msg" style="font-size:0.86rem;line-height:1.5;margin-bottom:20px;opacity:0.85;"></div>
            <div style="display:flex;gap:12px;justify-content:center;">
              <button id="kzyc-confirm-cancel" type="button" style="padding:6px 18px;border-radius:6px;border:1px solid rgba(128,128,128,0.3);background:transparent;cursor:pointer;color:inherit;font-size:0.82rem;">取消</button>
              <button id="kzyc-confirm-ok" type="button" style="padding:6px 18px;border-radius:6px;border:none;background:#ef4444;color:#fff;cursor:pointer;font-size:0.82rem;font-weight:600;">确定删除</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(wrap);
    }
    document.getElementById("kzyc-confirm-msg").textContent = msg;
    wrap.style.display = "block";

    document.getElementById("kzyc-confirm-cancel").onclick = () => { wrap.style.display = "none"; };
    document.getElementById("kzyc-confirm-ok").onclick = () => {
      wrap.style.display = "none";
      if (typeof onConfirm === "function") onConfirm();
    };
  }

  function getAvatarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#059669", "#0891b2", "#4f46e5"];
    return colors[Math.abs(hash) % colors.length];
  }

  // 兼容 SQLite UTC 时间戳，准确对齐中国北京时间
  function timeAgo(dateStr) {
    try {
      if (!dateStr) return "";
      let isoStr = String(dateStr).trim().replace(" ", "T");
      if (!isoStr.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(isoStr)) {
        isoStr += "Z";
      }

      const diff = Date.now() - new Date(isoStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes}分钟前`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}小时前`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}天前`;
      return isoStr.slice(0, 10);
    } catch {
      return "";
    }
  }

  // 动态注入圆形头像按钮与悬浮弹窗样式
  function injectAvatarStyles() {
    if (document.getElementById("kzyc-avatar-popover-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "kzyc-avatar-popover-styles";
    styleEl.textContent = `.kzyc-header-user-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;margin-left:10px;flex-shrink:0!important}.kzyc-header-avatar-btn{width:36px!important;height:36px!important;border-radius:50%!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;cursor:pointer;outline:none;background:rgba(99,102,241,0.12);border:1.5px solid rgba(99,102,241,0.35);color:#4338ca;transition:all .25s ease;padding:0!important;flex-shrink:0!important}.kzyc-header-avatar-btn:hover{background:rgba(99,102,241,0.22);border-color:rgba(99,102,241,0.65);transform:scale(1.06);box-shadow:0 0 10px rgba(99,102,241,0.25)}.kzyc-header-avatar-btn svg{width:20px;height:20px;fill:currentColor}[data-md-color-scheme="slate"] .kzyc-header-avatar-btn{background:rgba(165,180,252,0.15);border:1.5px solid rgba(165,180,252,0.4);color:#a5b4fc}[data-md-color-scheme="slate"] .kzyc-header-avatar-btn:hover{background:rgba(165,180,252,0.25);border-color:rgba(165,180,252,0.75);box-shadow:0 0 10px rgba(165,180,252,0.3)}.kzyc-header-popover{position:absolute!important;top:100%!important;right:0!important;margin-top:10px!important;z-index:9999!important;width:max-content!important;min-width:175px!important;padding:10px 14px!important;border-radius:10px!important;box-sizing:border-box!important;background:#ffffff!important;border:1px solid #e2e8f0!important;color:#1e293b!important;box-shadow:0 10px 25px -5px rgba(0,0,0,0.12),0 8px 10px -6px rgba(0,0,0,0.08)!important;pointer-events:none!important;opacity:0!important;visibility:hidden!important;transform:translateY(6px)!important;transition:opacity .2s ease,transform .2s ease,visibility .2s!important;text-align:left!important;white-space:nowrap!important}.kzyc-header-popover::before{content:"";position:absolute;top:-12px;left:0;right:0;height:12px}.kzyc-header-user-wrap:hover .kzyc-header-popover{pointer-events:auto!important;opacity:1!important;visibility:visible!important;transform:translateY(0)!important}[data-md-color-scheme="slate"] .kzyc-header-popover{background:#1e293b!important;border-color:#334155!important;color:#f8fafc!important;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5)!important}.kzyc-popover-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:5px;white-space:nowrap}.kzyc-popover-name{font-weight:700;font-size:.85rem;white-space:nowrap}.kzyc-popover-badge{font-size:.68rem;padding:1.5px 6px;border-radius:9999px;font-weight:600;white-space:nowrap}.kzyc-popover-badge.admin{background:#e0e7ff;color:#4338ca;border:1px solid #c7d2fe}.kzyc-popover-badge.svip{background:#fce7f3;color:#be185d;border:1px solid #fbcfe8}.kzyc-popover-badge.vip{background:#fef3c7;color:#b45309;border:1px solid #fde68a}.kzyc-popover-badge.user{background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}.kzyc-popover-badge.expired{background:#fee2e2;color:#b91c1c;border:1px solid #fecaca}[data-md-color-scheme="slate"] .kzyc-popover-badge.admin{background:rgba(99,102,241,0.25);color:#a5b4fc;border-color:rgba(99,102,241,0.5)}[data-md-color-scheme="slate"] .kzyc-popover-badge.svip{background:rgba(236,72,153,0.2);color:#f472b6;border-color:rgba(236,72,153,0.4)}[data-md-color-scheme="slate"] .kzyc-popover-badge.vip{background:rgba(245,158,11,0.2);color:#fbbf24;border-color:rgba(245,158,11,0.4)}[data-md-color-scheme="slate"] .kzyc-popover-badge.user{background:#334155;color:#94a3b8;border-color:rgba(245,158,11,0.47)}.kzyc-popover-expire{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:.72rem;padding-top:6px;margin-top:3px;border-top:1px dashed rgba(148,163,184,0.28);white-space:nowrap}.kzyc-popover-expire-label{color:#64748b;white-space:nowrap}[data-md-color-scheme="slate"] .kzyc-popover-expire-label{color:#94a3b8}.kzyc-popover-expire-val{color:#ea580c;font-weight:600;white-space:nowrap}[data-md-color-scheme="slate"] .kzyc-popover-expire-val{color:#fb923c}.kzyc-popover-footer-tip{font-size:0.65rem;color:#94a3b8;text-align:center;margin-top:6px;padding-top:5px;border-top:1px solid rgba(148,163,184,0.15);white-space:nowrap;}`;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  // 独创隔离的多网盘单行横向排版体系（严格一排不折行）
  function renderChannelsHTML(rawUrl, singleCode, unzipPwd) {
    let list = [];
    const raw = String(rawUrl || "").trim();

    function isFreeCode(str) {
      const v = String(str || "").trim().toLowerCase();
      return !v ||
        v === "免密" ||
        v === "免提取码" ||
        v === "无需提取码" ||
        v === "无" ||
        v === "none" ||
        v === "null";
    }

    function detectPanName(url) {
      const value = String(url || "").toLowerCase();
      if (value.includes("pan.baidu.com")) return "百度网盘";
      if (value.includes("pan.quark.cn")) return "夸克网盘";
      if (value.includes("pan.xunlei.com")) return "迅雷云盘";
      if (value.includes("aliyundrive.com") || value.includes("alipan.com")) return "阿里云盘";
      if (value.includes("123pan.com")) return "123云盘";
      return "网盘下载";
    }

    // 1. JSON 格式解析
    if (raw.startsWith("[")) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          list = arr.map((item) => {
            const u = String(item.url || item.download_url || "").trim();
            return {
              name: item.name || detectPanName(u),
              url: u || "#",
              code: item.code || item.extract_code || ""
            };
          }).filter(item => item.url && item.url !== "#");
        }
      } catch (e) {}
    }

    // 2. 文本格式（采用解构赋值，杜绝任何索引转义异常）
    if (list.length === 0 && raw) {
      const lines = raw.split(/[\r\n;；]+/).map(s => s.trim()).filter(Boolean);
      for (const line of lines) {
        let name = "";
        let url = "";
        let code = "";

        if (line.includes("|")) {
          const [pName, pUrl, pCode] = line.split("|").map(s => s.trim());
          name = pName || "";
          url = pUrl || "";
          code = pCode || "";
        } else if (line.includes(",") || line.includes("，")) {
          const [pName, pUrl, pCode] = line.split(/[,，]/).map(s => s.trim());
          name = pName || "";
          url = pUrl || "";
          code = pCode || "";
        }

        const urlMatch = line.match(/https?:\/\/[^\s,，;；|]+/i);
        if (urlMatch) {
          const [matchedUrl] = urlMatch;
          if (!url || !url.startsWith("http")) url = matchedUrl.trim();
          if (!name) name = line.slice(0, urlMatch.index).replace(/[,，|:：\s]+$/, "").trim();
          if (!code) code = line.slice(urlMatch.index + matchedUrl.length).replace(/^[,，|:：\s]+/, "").trim();
        }

        if (url) {
          if (!name || /^https?:\/\//i.test(name)) {
            name = detectPanName(url);
          }
          list.push({
            name: name || detectPanName(url),
            url: url,
            code: code || ""
          });
        }
      }
    }

    // 3. 单链接兜底
    if (list.length === 0 && raw) {
      list = [{
        name: detectPanName(raw),
        url: raw,
        code: singleCode || ""
      }];
    }

    // 生成纯净独立的单行网盘 DOM
    let html = `<div class="kzyc-netdisk-card">`;
    list.forEach((ch) => {
      const name = ch.name || detectPanName(ch.url);
      const url = ch.url || "#";
      const code = String(ch.code || "").trim();
      const isFree = isFreeCode(code);

      html += `
        <div class="kzyc-netdisk-row">
          <div class="kzyc-netdisk-left">
            <span class="kzyc-netdisk-icon">📁</span>
            <span class="kzyc-netdisk-name">${escapeHTML(name)}</span>
          </div>
          <div class="kzyc-netdisk-center">
            ${
              isFree
                ? `<span class="kzyc-netdisk-free">免提取码</span>`
                : `<span class="kzyc-netdisk-label">提取码</span>
                   <span class="kzyc-netdisk-code">${escapeHTML(code)}</span>
                   <button type="button" class="kzyc-netdisk-copy-btn" data-copy="${escapeHTML(code)}">复制</button>`
            }
          </div>
          <div class="kzyc-netdisk-right">
            <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" class="kzyc-netdisk-dl-btn">点击下载 ↗</a>
          </div>
        </div>
      `;
    });

    if (unzipPwd) {
      html += `
        <div class="kzyc-netdisk-unzip-row">
          <div class="kzyc-netdisk-unzip-info">
            <span class="kzyc-netdisk-unzip-label">🔑 专属解压密码：</span>
            <span class="kzyc-netdisk-unzip-val">${escapeHTML(unzipPwd)}</span>
          </div>
          <button type="button" class="kzyc-netdisk-copy-btn unzip" data-copy="${escapeHTML(unzipPwd)}">复制密码</button>
        </div>
      `;
    }

    html += `</div>`;

    // 独立注入高优先级专属样式
    if (!document.getElementById("kzyc-netdisk-isolated-styles")) {
      const styleEl = document.createElement("style");
      styleEl.id = "kzyc-netdisk-isolated-styles";
      styleEl.textContent = `.kzyc-netdisk-card{width:100%!important;margin:14px 0 6px!important;border:1px solid rgba(128,128,128,0.18)!important;border-radius:12px!important;overflow:hidden!important;background:var(--md-default-bg-color,#ffffff)!important;box-sizing:border-box!important}.kzyc-netdisk-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;min-height:52px!important;padding:8px 16px!important;border-bottom:1px solid rgba(128,128,128,0.12)!important;box-sizing:border-box!important;white-space:nowrap!important;flex-wrap:nowrap!important}.kzyc-netdisk-row:last-of-type{border-bottom:none!important}.kzyc-netdisk-left{display:flex!important;align-items:center!important;gap:8px!important;min-width:100px!important;flex:0 0 auto!important}.kzyc-netdisk-icon{font-size:1.1rem!important;line-height:1!important}.kzyc-netdisk-name{font-size:.92rem!important;font-weight:600!important;color:var(--md-default-fg-color,#1e293b)!important;white-space:nowrap!important}.kzyc-netdisk-center{display:flex!important;align-items:center!important;gap:8px!important;white-space:nowrap!important;flex:1 1 auto!important;justify-content:center!important}.kzyc-netdisk-label{font-size:.78rem!important;color:var(--md-default-fg-color--light,#64748b)!important;white-space:nowrap!important}.kzyc-netdisk-code{font-size:.88rem!important;font-weight:700!important;color:#2563eb!important;letter-spacing:.5px!important;white-space:nowrap!important}.kzyc-netdisk-free{font-size:.78rem!important;color:var(--md-default-fg-color--light,#64748b)!important;background:rgba(128,128,128,0.08)!important;padding:3px 8px!important;border-radius:6px!important;white-space:nowrap!important}.kzyc-netdisk-copy-btn{border:1px solid rgba(128,128,128,0.25)!important;background:rgba(128,128,128,0.06)!important;color:var(--md-default-fg-color,inherit)!important;border-radius:6px!important;padding:3px 9px!important;font-size:.72rem!important;font-weight:600!important;cursor:pointer!important;white-space:nowrap!important;transition:all .2s ease!important;outline:none!important}.kzyc-netdisk-copy-btn:hover{background:rgba(37,99,235,0.12)!important;border-color:#2563eb!important;color:#2563eb!important}.kzyc-netdisk-right{display:flex!important;align-items:center!important;justify-content:flex-end!important;white-space:nowrap!important;flex:0 0 auto!important}.kzyc-netdisk-dl-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:32px!important;padding:0 14px!important;border-radius:7px!important;background:#2563eb!important;color:#ffffff!important;text-decoration:none!important;font-size:.78rem!important;font-weight:600!important;white-space:nowrap!important;transition:all .2s ease!important;box-sizing:border-box!important}.kzyc-netdisk-dl-btn:hover{background:#1d4ed8!important;transform:translateY(-1px)!important;box-shadow:0 4px 10px rgba(37,99,235,0.25)!important}.kzyc-netdisk-unzip-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;min-height:48px!important;padding:8px 16px!important;border-top:1px dashed rgba(234,88,12,0.3)!important;background:rgba(234,88,12,0.04)!important;box-sizing:border-box!important;white-space:nowrap!important;flex-wrap:nowrap!important}.kzyc-netdisk-unzip-info{display:flex!important;align-items:center!important;gap:6px!important;white-space:nowrap!important}.kzyc-netdisk-unzip-label{font-size:.82rem!important;color:var(--md-default-fg-color--light,#64748b)!important;white-space:nowrap!important}.kzyc-netdisk-unzip-val{font-size:.9rem!important;font-weight:700!important;color:#ea580c!important;white-space:nowrap!important}[data-md-color-scheme="slate"] .kzyc-netdisk-card{border-color:rgba(255,255,255,0.12)!important}[data-md-color-scheme="slate"] .kzyc-netdisk-row{border-color:rgba(255,255,255,0.08)!important}[data-md-color-scheme="slate"] .kzyc-netdisk-copy-btn{background:rgba(255,255,255,0.06)!important;border-color:rgba(255,255,255,0.14)!important}@media (max-width:600px){
          .kzyc-netdisk-row{padding:6px 8px !important;gap:4px !important;min-height:38px !important;justify-content:space-between !important;}
          .kzyc-netdisk-left{min-width:auto !important;gap:3px !important;flex-shrink:0 !important;}
          .kzyc-netdisk-icon{font-size:0.85rem !important;}
          .kzyc-netdisk-name{font-size:0.72rem !important;}
          .kzyc-netdisk-center{gap:3px !important;flex:0 1 auto !important;margin:0 auto !important;}
          .kzyc-netdisk-label{font-size:0.62rem !important;}
          .kzyc-netdisk-code{font-size:0.7rem !important;}
          .kzyc-netdisk-free{font-size:0.62rem !important;padding:1px 4px !important;border-radius:4px !important;}
          .kzyc-netdisk-copy-btn{font-size:0.62rem !important;padding:1px 5px !important;border-radius:4px !important;}
          .kzyc-netdisk-right{margin-left:auto !important;flex-shrink:0 !important;}
          .kzyc-netdisk-dl-btn{height:25px !important;padding:0 6px !important;font-size:0.64rem !important;border-radius:5px !important;flex-shrink:0 !important;letter-spacing:0 !important;}
          .kzyc-netdisk-unzip-row{padding:6px 8px !important;min-height:36px !important;gap:4px !important;justify-content:space-between !important;}
          .kzyc-netdisk-unzip-label{font-size:0.66rem !important;}
          .kzyc-netdisk-unzip-val{font-size:0.72rem !important;}
          .kzyc-netdisk-copy-btn.unzip{padding:1.5px 6px !important;font-size:0.62rem !important;}
        }`;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    return html;
  }

  // 确保每次跳转新页面，都能正确在顶栏建立挂载点
  function initAuthDOM() {
    try {
      injectAvatarStyles();

      const headerInner = document.querySelector(".md-header__inner");
      if (headerInner) {
        let authContainer = document.getElementById("kzyc-auth-header");
        if (!authContainer || !headerInner.contains(authContainer)) {
          if (authContainer) authContainer.remove();
          authContainer = document.createElement("div");
          authContainer.id = "kzyc-auth-header";
          authContainer.style.display = "flex";
          authContainer.style.alignItems = "center";
          authContainer.style.flexShrink = "0";
          headerInner.appendChild(authContainer);
        }
      }

      if (!document.getElementById("cf-turnstile-script")) {
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        (document.head || document.documentElement).appendChild(script);
      }

      if (document.getElementById("kzyc-auth-modal")) {
        updateHeaderUI();
        return;
      }

      const modalHTML = `
        <div id="kzyc-auth-modal" class="kzyc-modal-backdrop">
          <div class="kzyc-modal">
            <button class="kzyc-modal-close" id="kzyc-modal-close">✕</button>

            <!-- 登录与注册视图 -->
            <div id="kzyc-auth-view">
              <div class="kzyc-tabs">
                <button class="kzyc-tab active" data-tab="login">登录</button>
                <button class="kzyc-tab" data-tab="register">注册</button>
              </div>
              <div class="kzyc-msg" id="kzyc-auth-msg"></div>
              <form id="kzyc-login-form">
                <div class="kzyc-form-group">
                  <label>账号 (用户名或邮箱)</label>
                  <input class="kzyc-input" type="text" id="kzyc-login-account" required placeholder="请输入用户名或邮箱" />
                </div>
                <div class="kzyc-form-group">
                  <label>密码</label>
                  <input class="kzyc-input" type="password" id="kzyc-login-pwd" required placeholder="请输入密码" />
                  <a class="kzyc-forgot-link" id="kzyc-go-forgot">忘记密码？</a>
                </div>
                <div class="kzyc-turnstile-wrap" id="kzyc-login-turnstile"></div>
                <button type="submit" class="kzyc-submit-btn" id="kzyc-login-submit">登 录</button>
              </form>
              <form id="kzyc-register-form" style="display: none;">
                <div class="kzyc-form-group">
                  <label>用户名 (3-30 个字符)</label>
                  <input class="kzyc-input" type="text" id="kzyc-reg-username" required placeholder="用户名" />
                </div>
                <div class="kzyc-form-group">
                  <label>邮箱</label>
                  <input class="kzyc-input" type="email" id="kzyc-reg-email" required placeholder="example@mail.com" />
                </div>
                <div class="kzyc-form-group">
                  <label>密码 (至少 8 位)</label>
                  <input class="kzyc-input" type="password" id="kzyc-reg-pwd" required placeholder="至少 8 位密码" />
                </div>
                <div class="kzyc-turnstile-wrap" id="kzyc-reg-turnstile"></div>
                <button type="submit" class="kzyc-submit-btn" id="kzyc-reg-submit">注 册</button>
              </form>
            </div>

            <!-- 找回密码视图 -->
            <div id="kzyc-forgot-view" style="display: none;">
              <h3 style="margin-top: 0; font-size: 1.15rem;">🔑 找回密码</h3>
              <form id="kzyc-forgot-form">
                <div class="kzyc-form-group">
                  <label>注册邮箱</label>
                  <div class="kzyc-inline-group">
                    <input class="kzyc-input" type="email" id="kzyc-forgot-email" required placeholder="请输入注册邮箱" />
                    <button type="button" class="kzyc-send-code-btn" id="kzyc-send-code-btn">获取验证码</button>
                  </div>
                </div>
                <div class="kzyc-form-group">
                  <label>6 位邮箱验证码</label>
                  <input class="kzyc-input" type="text" id="kzyc-forgot-code" required placeholder="请输入 6 位验证码" maxlength="6" />
                </div>
                <div class="kzyc-form-group">
                  <label>重置新密码 (至少 8 位)</label>
                  <input class="kzyc-input" type="password" id="kzyc-forgot-newpwd" required placeholder="请输入新密码" />
                </div>
                <button type="submit" class="kzyc-submit-btn" id="kzyc-forgot-submit">确认重置密码</button>
                <a class="kzyc-back-link" id="kzyc-back-login">← 返回登录</a>
              </form>
              <div class="kzyc-msg" id="kzyc-forgot-msg"></div>
            </div>

            <!-- 个人中心视图 -->
            <div id="kzyc-profile-view" style="display: none;">
              <div class="kzyc-prof-topbar">
                <div class="kzyc-prof-title-wrap">
                  <span class="kzyc-prof-icon">👤</span>
                  <span class="kzyc-prof-title">个人中心</span>
                  <span class="kzyc-prof-badge" id="kzyc-prof-role">普通用户</span>
                </div>
              </div>

              <div class="kzyc-user-info-card">
                <div class="kzyc-user-info-row">
                  <span class="kzyc-info-dot">●</span>
                  <span class="kzyc-info-label">用户名:</span>
                  <span class="kzyc-info-val" id="kzyc-prof-username">--</span>
                </div>
                <div class="kzyc-user-info-row">
                  <span class="kzyc-info-dot">●</span>
                  <span class="kzyc-info-label">邮&nbsp;&nbsp;&nbsp;箱:</span>
                  <span class="kzyc-info-val" id="kzyc-prof-email">--</span>
                </div>
                <div class="kzyc-user-info-row">
                  <span class="kzyc-info-dot">●</span>
                  <span class="kzyc-info-label">U I D:</span>
                  <span class="kzyc-info-val" id="kzyc-prof-id">#--</span>
                </div>
                <div class="kzyc-user-info-row" id="kzyc-prof-expire-row">
                  <span class="kzyc-info-dot">●</span>
                  <span class="kzyc-info-label">到期时间:</span>
                  <span class="kzyc-info-val" id="kzyc-prof-expire" style="color: #ea580c; font-weight: bold;">--</span>
                </div>
                <div class="kzyc-user-info-row">
                  <span class="kzyc-info-dot">●</span>
                  <span class="kzyc-info-label">今日下载:</span>
                  <span class="kzyc-info-val" id="kzyc-prof-quota">--</span>
                </div>
              </div>

              <div class="kzyc-history-card">
                <div class="kzyc-history-card-header">
                  <span class="kzyc-history-card-title">📥 我的下载记录</span>
                  <span class="kzyc-history-badge" id="kzyc-dl-history-count">暂无下载</span>
                </div>
                <div class="kzyc-history-items" id="kzyc-dl-history-list">
                  <div style="opacity: 0.5; padding: 12px 0; text-align: center; font-size: 0.8rem;">加载中...</div>
                </div>
              </div>

              <div class="kzyc-prof-actions">
                <button type="button" class="kzyc-prof-btn-secondary" id="kzyc-toggle-pwd-btn">🔐 修改密码</button>
                <button type="button" class="kzyc-prof-btn-logout" id="kzyc-logout-btn">退出登录</button>
              </div>
              <div class="kzyc-prof-del-wrap">
                <button type="button" class="kzyc-prof-del-link" id="kzyc-toggle-del-btn">注销当前账号</button>
              </div>

              <form id="kzyc-change-pwd-form" style="display: none; margin-top: 14px;">
                <div class="kzyc-form-group">
                  <label>原密码</label>
                  <input class="kzyc-input" type="password" id="kzyc-old-pwd" required placeholder="原密码" />
                </div>
                <div class="kzyc-form-group">
                  <label>新密码 (至少 8 位)</label>
                  <input class="kzyc-input" type="password" id="kzyc-new-pwd" required placeholder="新密码" />
                </div>
                <button type="submit" class="kzyc-submit-btn" id="kzyc-pwd-submit">保存新密码</button>
              </form>

              <form id="kzyc-del-form" style="display: none; margin-top: 14px;">
                <p style="font-size: 0.78rem; color: #ef4444; margin: 4px 0 8px; line-height: 1.4;">
                  警告：注销后一年内该用户名与邮箱禁止重新注册！
                </p>
                <div class="kzyc-form-group">
                  <input class="kzyc-input" type="password" id="kzyc-del-pwd" required placeholder="请输入登录密码以确认注销" />
                </div>
                <button type="submit" class="kzyc-danger-confirm-btn" id="kzyc-del-submit">确认彻底注销</button>
              </form>

              <div class="kzyc-msg" id="kzyc-profile-msg"></div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      bindEvents();
      updateHeaderUI();
    } catch (e) {
      console.error(e);
    }
  }

  function renderTurnstiles() {
    try {
      if (typeof turnstile === "undefined") return;
      const loginEl = document.getElementById("kzyc-login-turnstile");
      if (loginEl && !loginEl.hasChildNodes()) {
        turnstile.render(loginEl, { sitekey: TURNSTILE_SITE_KEY, theme: "auto" });
      }
      const regEl = document.getElementById("kzyc-reg-turnstile");
      if (regEl && !regEl.hasChildNodes()) {
        turnstile.render(regEl, { sitekey: TURNSTILE_SITE_KEY, theme: "auto" });
      }
    } catch {}
  }

  function initDownloadCards() {
    try {
      const boxes = document.querySelectorAll(".kzyc-download-box");
      if (boxes.length === 0) return;

      boxes.forEach((box) => {
        if (box.getAttribute("data-rendered") === "true" && box.innerHTML.trim() !== "") {
          return;
        }

        box.setAttribute("data-rendered", "true");
        const key = box.getAttribute("data-key");
        const customTitle = box.getAttribute("data-title") || "专属软件资源包";

        box.innerHTML = `
          <div class="kzyc-download-card">
            <div class="kzyc-card-header">
              <span class="kzyc-card-icon">📦</span>
              <div>
                <div class="kzyc-card-title">${escapeHTML(customTitle)}</div>
                <div class="kzyc-card-tip">🔒 登录用户专享资源 · 验证身份后自动呈现多网盘分流地址</div>
              </div>
            </div>
            <button type="button" class="kzyc-dl-btn" data-key="${key}">📥 立即获取网盘下载地址</button>
            <div class="kzyc-dl-result" style="display: none; width: 100%;"></div>
          </div>
        `;

        const btn = box.querySelector(".kzyc-dl-btn");
        const resultBox = box.querySelector(".kzyc-dl-result");

        if (btn) {
          btn.addEventListener("click", async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
              pendingDownloadBtn = btn;
              openLoginModal("🔒 该资源需登录后下载，请先登录！");
              return;
            }

            btn.disabled = true;
            btn.textContent = "正在获取多通道安全下载通道...";

            try {
              const res = await fetch(`${API_BASE}/api/download`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  resource_key: key,
                  post_path: location.pathname,
                }),
              });

              if (res.status === 401) {
                localStorage.removeItem(TOKEN_KEY);
                currentUser = null;
                updateHeaderUI();
                openLoginModal("🔒 您的登录状态已过期，请重新登录！");
                btn.disabled = false;
                btn.textContent = "📥 重新尝试获取";
                return;
              }

              let data;
              try {
                data = await res.json();
              } catch (parseErr) {
                throw new Error(`服务器响应格式异常 (HTTP ${res.status})`);
              }

              if (data && data.success) {
                btn.style.display = "none";
                resultBox.style.display = "block";
                resultBox.innerHTML = renderChannelsHTML(data.download_url, data.extract_code, data.unzip_pwd);

                resultBox.querySelectorAll(".kzyc-netdisk-copy-btn, .kzyc-pan-copy, .kzyc-copy-btn").forEach((cBtn) => {
                  cBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(cBtn.getAttribute("data-copy"));
                    const orig = cBtn.textContent;
                    cBtn.textContent = "已复制！";
                    setTimeout(() => { cBtn.textContent = orig; }, 1500);
                  });
                });
              } else {
                resultBox.style.display = "block";
                resultBox.innerHTML = `<span style="color: #ef4444;">${(data && data.error) || "获取下载链接失败"}</span>`;
                btn.disabled = false;
                btn.textContent = "📥 重新尝试获取";
              }
            } catch (err) {
              console.error("[kzyc-auth] 下载请求异常:", err);
              resultBox.style.display = "block";
              resultBox.innerHTML = `<span style="color: #ef4444;">获取失败：${escapeHTML(err.message || "网络异常，请稍后重试")}</span>`;
              btn.disabled = false;
              btn.textContent = "📥 重新尝试获取";
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  // 注入评论区底部分页样式
  function injectPaginationStyles() {
    if (document.getElementById("kzyc-pagination-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "kzyc-pagination-styles";
    styleEl.textContent = `.kzyc-pagination-wrap{display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;margin-top:20px!important;flex-wrap:wrap!important;font-size:.8rem!important}.kzyc-page-btn{padding:4px 9px!important;border-radius:6px!important;border:1px solid rgba(127,127,127,0.25)!important;background:transparent!important;color:inherit!important;cursor:pointer!important;font-size:.76rem!important;transition:all .15s!important}.kzyc-page-btn:hover:not(.disabled):not(.active){background:rgba(37,99,235,0.08)!important;border-color:#2563eb!important;color:#2563eb!important}.kzyc-page-btn.active{background:#2563eb!important;color:#fff!important;border-color:#2563eb!important}.kzyc-page-btn.disabled{opacity:.35!important;cursor:not-allowed!important}.kzyc-page-ellipsis{padding:0 4px!important;opacity:.5!important}.kzyc-page-jump{display:inline-flex!important;align-items:center!important;gap:4px!important;margin-left:8px!important}.kzyc-page-input{width:44px!important;padding:3px 5px!important;text-align:center!important;border-radius:5px!important;border:1px solid rgba(127,127,127,0.25)!important;background:transparent!important;color:inherit!important;font-size:.78rem!important}`;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  let currentArticleComments = [];
  let articleCommentCurrentPage = 1;
  const ARTICLE_COMMENT_PAGE_SIZE = 10;

  function renderArticleCommentPagination(currentPage, totalItems, pageSize) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    if (totalPages <= 1) return "";

    let html = `<div class="kzyc-pagination-wrap">`;
    if (currentPage > 1) {
      html += `<button type="button" class="kzyc-page-btn" onclick="gotoArticleCommentPage(1)">首页</button>`;
      html += `<button type="button" class="kzyc-page-btn" onclick="gotoArticleCommentPage(${currentPage - 1})">上一页</button>`;
    } else {
      html += `<button type="button" class="kzyc-page-btn disabled">首页</button>`;
      html += `<button type="button" class="kzyc-page-btn disabled">上一页</button>`;
    }

    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    html += `<button type="button" class="kzyc-page-btn ${currentPage === 1 ? 'active' : ''}" onclick="gotoArticleCommentPage(1)">1</button>`;
    if (range.length > 0 && range[0] > 2) html += `<span class="kzyc-page-ellipsis">...</span>`;
    for (let i of range) {
      html += `<button type="button" class="kzyc-page-btn ${currentPage === i ? 'active' : ''}" onclick="gotoArticleCommentPage(${i})">${i}</button>`;
    }
    if (range.length > 0 && range[range.length - 1] < totalPages - 1) html += `<span class="kzyc-page-ellipsis">...</span>`;
    if (totalPages > 1) {
      html += `<button type="button" class="kzyc-page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="gotoArticleCommentPage(${totalPages})">${totalPages}</button>`;
    }

    if (currentPage < totalPages) {
      html += `<button type="button" class="kzyc-page-btn" onclick="gotoArticleCommentPage(${currentPage + 1})">下一页</button>`;
      html += `<button type="button" class="kzyc-page-btn" onclick="gotoArticleCommentPage(${totalPages})">末页</button>`;
    } else {
      html += `<button type="button" class="kzyc-page-btn disabled">下一页</button>`;
      html += `<button type="button" class="kzyc-page-btn disabled">末页</button>`;
    }

    html += `
      <span class="kzyc-page-jump">
        到第 <input type="number" class="kzyc-page-input" id="kzyc-article-comm-jump-val" min="1" max="${totalPages}" value="${currentPage}" onkeydown="if(event.key==='Enter') gotoArticleCommentPage(parseInt(this.value, 10))" /> 页
        <button type="button" class="kzyc-page-btn" onclick="gotoArticleCommentPage(parseInt(document.getElementById('kzyc-article-comm-jump-val').value, 10))">跳转</button>
      </span>
    `;
    html += `</div>`;
    return html;
  }

  window.gotoArticleCommentPage = function(page) {
    const rootComments = currentArticleComments.filter((c) => c.parent_id === 0);
    const totalPages = Math.ceil(rootComments.length / ARTICLE_COMMENT_PAGE_SIZE) || 1;
    if (isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    articleCommentCurrentPage = page;
    renderArticleCommentsList(location.pathname);

    const rootEl = document.getElementById("kzyc-comments-root");
    if (rootEl) {
      rootEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  function initComments() {
    const root = document.getElementById("kzyc-comments-root");
    if (!root) return;
    if (root.getAttribute("data-rendered") === "true" && root.innerHTML.trim() !== "") return;
    root.setAttribute("data-rendered", "true");

    const postPath = location.pathname;

    root.innerHTML = `
      <div class="kzyc-comments-container">
        <div id="kzyc-comment-box-wrap"></div>
        <div class="kzyc-comments-header">
          <h3>💬 讨论交流 (<span id="kzyc-comments-count">0</span>)</h3>
        </div>
        <div id="kzyc-comments-list" class="kzyc-comments-list">
          <div style="opacity: 0.6; padding: 20px 0; text-align: center;">正在加载精彩评论...</div>
        </div>
      </div>
    `;

    renderCommentInputBox();
    loadComments(postPath);
  }

  function renderCommentInputBox() {
    const wrap = document.getElementById("kzyc-comment-box-wrap");
    if (!wrap) return;

    if (currentUser) {
      const initial = currentUser.username.slice(0, 1).toUpperCase();
      const color = getAvatarColor(currentUser.username);
      wrap.innerHTML = `
        <div class="kzyc-comment-input-card">
          <div class="kzyc-input-user-bar">
            <span class="kzyc-avatar" style="background-color: ${color};">${initial}</span>
            <span class="kzyc-input-user-name">${escapeHTML(currentUser.username)}</span>
            <span style="font-size: 0.76rem; opacity: 0.6;">文明发言，理性讨论</span>
          </div>
          <textarea class="kzyc-comment-textarea" id="kzyc-main-comment-text" placeholder="写下您的精彩看法或提出问题...（Ctrl + Enter 快捷发送）" maxlength="1000"></textarea>
          <div class="kzyc-input-bottom-bar">
            <span class="kzyc-msg" id="kzyc-comment-submit-msg" style="margin: 0;"></span>
            <button type="button" class="kzyc-comment-btn" id="kzyc-main-comment-submit">发表评论</button>
          </div>
        </div>
      `;

      const submitBtn = document.getElementById("kzyc-main-comment-submit");
      const textarea = document.getElementById("kzyc-main-comment-text");
      const msgEl = document.getElementById("kzyc-comment-submit-msg");

      const doSubmit = async () => {
        const content = textarea.value.trim();
        if (!content) return;
        submitBtn.disabled = true;
        submitBtn.textContent = "发表中...";
        msgEl.className = "kzyc-msg";
        msgEl.textContent = "";

        const token = localStorage.getItem(TOKEN_KEY);
        try {
          const res = await fetch(`${API_BASE}/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              post_path: location.pathname,
              content,
              parent_id: 0,
            }),
          });
          const data = await res.json();
          if (data.success) {
            textarea.value = "";
            msgEl.className = "kzyc-msg success";
            msgEl.textContent = data.message || "发表成功！";
            articleCommentCurrentPage = 1; // 评论成功跳回第一页查看
            loadComments(location.pathname);
            setTimeout(() => { msgEl.textContent = ""; }, 3000);
          } else {
            msgEl.className = "kzyc-msg error";
            msgEl.textContent = data.error || "发表失败";
          }
        } catch {
          msgEl.className = "kzyc-msg error";
          msgEl.textContent = "网络通信异常";
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "发表评论";
        }
      };

      submitBtn.addEventListener("click", doSubmit);
      textarea.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") doSubmit();
      });
    } else {
      wrap.innerHTML = `
        <div class="kzyc-comment-guest-card">
          <span>💬 您当前尚未登录，登录后即可参与本文章的讨论交流与点赞！</span>
          <button type="button" class="kzyc-dl-link-btn" id="kzyc-trigger-comment-login">立即登录 / 注册</button>
        </div>
      `;
      const triggerLoginBtn = document.getElementById("kzyc-trigger-comment-login");
      if (triggerLoginBtn) triggerLoginBtn.addEventListener("click", () => {
        openLoginModal("🔒 请先登录后再参与评论讨论！");
      });
    }
  }

  async function loadComments(path) {
    const listEl = document.getElementById("kzyc-comments-list");
    const countEl = document.getElementById("kzyc-comments-count");
    if (!listEl) return;

    injectPaginationStyles();

    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE}/api/comments?path=${encodeURIComponent(path)}`, { headers });
      const data = await res.json();
      if (!data.success) {
        listEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">加载失败：${data.error}</div>`;
        return;
      }

      currentArticleComments = data.comments || [];
      if (countEl) countEl.textContent = currentArticleComments.length;

      renderArticleCommentsList(path);
    } catch (e) {
      listEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">评论服务通信异常</div>`;
    }
  }

  function renderArticleCommentsList(path) {
    const listEl = document.getElementById("kzyc-comments-list");
    if (!listEl) return;

    if (currentArticleComments.length === 0) {
      listEl.innerHTML = `<div style="opacity: 0.5; padding: 30px 0; text-align: center;">暂无评论，快来抢沙发发表第一条看法吧~ 🚀</div>`;
      return;
    }

    const rootComments = currentArticleComments.filter((c) => c.parent_id === 0);
    const repliesMap = {};
    currentArticleComments.filter((c) => c.parent_id > 0).forEach((r) => {
      if (!repliesMap[r.parent_id]) repliesMap[r.parent_id] = [];
      repliesMap[r.parent_id].push(r);
    });

    const totalPages = Math.ceil(rootComments.length / ARTICLE_COMMENT_PAGE_SIZE) || 1;
    if (articleCommentCurrentPage > totalPages) articleCommentCurrentPage = totalPages;
    if (articleCommentCurrentPage < 1) articleCommentCurrentPage = 1;

    const startIdx = (articleCommentCurrentPage - 1) * ARTICLE_COMMENT_PAGE_SIZE;
    const pageRoots = rootComments.slice(startIdx, startIdx + ARTICLE_COMMENT_PAGE_SIZE);

    let html = "";
    pageRoots.forEach((c) => {
      const initial = c.username.slice(0, 1).toUpperCase();
      const color = getAvatarColor(c.username);
      const replies = repliesMap[c.id] || [];

      html += `
        <div class="kzyc-comment-item" id="comment-${c.id}">
          <div class="kzyc-comment-main">
            <span class="kzyc-avatar" style="background-color: ${color};">${initial}</span>
            <div class="kzyc-comment-body">
              <div class="kzyc-comment-author-bar">
                <span class="kzyc-author-name">${escapeHTML(c.username)}</span>
                ${c.status === "pending" ? '<span class="kzyc-pending-tag">审核中</span>' : ""}
                <span class="kzyc-comment-time">${timeAgo(c.created_at)}</span>
              </div>
              <div class="kzyc-comment-text">${escapeHTML(c.content)}</div>
              <div class="kzyc-comment-actions-bar">
                <button type="button" class="kzyc-like-action ${c.user_has_liked ? "active" : ""}" data-id="${c.id}">
                  👍 赞 (<span class="like-num">${c.likes_count}</span>)
                </button>
                <button type="button" class="kzyc-reply-action" data-id="${c.id}" data-user="${escapeHTML(c.username)}">↩ 回复</button>
                ${c.is_owner ? `<button type="button" class="kzyc-del-action" data-id="${c.id}">🗑 删除</button>` : ""}
              </div>
              <div class="kzyc-inline-reply-wrap" id="reply-box-${c.id}" style="display: none;"></div>
            </div>
          </div>

          ${
            replies.length > 0
              ? `
            <div class="kzyc-replies-list">
              ${replies
                .map((r) => {
                  const rInitial = r.username.slice(0, 1).toUpperCase();
                  const rColor = getAvatarColor(r.username);
                  return `
                  <div class="kzyc-reply-item" id="comment-${r.id}">
                    <span class="kzyc-avatar sm" style="background-color: ${rColor};">${rInitial}</span>
                    <div class="kzyc-reply-body">
                      <div class="kzyc-comment-author-bar">
                        <span class="kzyc-author-name">${escapeHTML(r.username)}</span>
                        ${r.reply_to_username ? `<span class="kzyc-reply-to">回复 @${escapeHTML(r.reply_to_username)}</span>` : ""}
                        ${r.status === "pending" ? '<span class="kzyc-pending-tag">审核中</span>' : ""}
                        <span class="kzyc-comment-time">${timeAgo(r.created_at)}</span>
                      </div>
                      <div class="kzyc-comment-text">${escapeHTML(r.content)}</div>
                      <div class="kzyc-comment-actions-bar">
                        <button type="button" class="kzyc-like-action ${r.user_has_liked ? "active" : ""}" data-id="${r.id}">
                          👍 赞 (<span class="like-num">${r.likes_count}</span>)
                        </button>
                        <button type="button" class="kzyc-reply-action" data-id="${c.id}" data-user="${escapeHTML(r.username)}">↩ 回复</button>
                        ${r.is_owner ? `<button type="button" class="kzyc-del-action" data-id="${r.id}">🗑 删除</button>` : ""}
                      </div>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    // 超过 10 条主评论时自动呈现分页栏
    html += renderArticleCommentPagination(articleCommentCurrentPage, rootComments.length, ARTICLE_COMMENT_PAGE_SIZE);

    listEl.innerHTML = html;
    bindCommentActions(path || location.pathname);
  }

  function bindCommentActions(path) {
    document.querySelectorAll(".kzyc-like-action").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          openLoginModal("🔒 请先登录后再点赞！");
          return;
        }

        const commentId = btn.getAttribute("data-id");
        btn.disabled = true;

        try {
          const res = await fetch(`${API_BASE}/api/comments/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ comment_id: commentId }),
          });
          const data = await res.json();
          if (data.success) {
            btn.classList.toggle("active", data.liked);
            btn.querySelector(".like-num").textContent = data.likes_count;
          } else {
            alert(data.error || "点赞失败");
          }
        } catch {
          alert("网络通信异常");
        } finally {
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll(".kzyc-reply-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          openLoginModal("🔒 请先登录后再进行回复！");
          return;
        }

        const rootId = btn.getAttribute("data-id");
        const replyToUser = btn.getAttribute("data-user");
        const box = document.getElementById(`reply-box-${rootId}`);
        if (!box) return;

        if (box.style.display === "block") {
          box.style.display = "none";
          return;
        }

        box.style.display = "block";
        box.innerHTML = `
          <div class="kzyc-inline-reply-box">
            <textarea class="kzyc-comment-textarea sm" id="reply-input-${rootId}" placeholder="回复 @${replyToUser}..."></textarea>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 6px;">
              <button type="button" class="kzyc-copy-btn" id="reply-cancel-${rootId}">取消</button>
              <button type="button" class="kzyc-comment-btn sm" id="reply-submit-${rootId}">发送回复</button>
            </div>
          </div>
        `;

        document.getElementById(`reply-cancel-${rootId}`).addEventListener("click", () => {
          box.style.display = "none";
        });

        document.getElementById(`reply-submit-${rootId}`).addEventListener("click", async () => {
          const content = document.getElementById(`reply-input-${rootId}`).value.trim();
          if (!content) return;
          const sBtn = document.getElementById(`reply-submit-${rootId}`);
          sBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                post_path: path,
                content,
                parent_id: rootId,
                reply_to_username: replyToUser,
              }),
            });
            const data = await res.json();
            if (data.success) {
              loadComments(path);
            } else {
              alert(data.error || "回复失败");
              sBtn.disabled = false;
            }
          } catch {
            alert("网络异常");
            sBtn.disabled = false;
          }
        });
      });
    });

    document.querySelectorAll(".kzyc-del-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        showCenterConfirm("确定要删除这条评论吗？相关楼中楼回复也会一并删除！", async () => {
          const token = localStorage.getItem(TOKEN_KEY);
          const commentId = btn.getAttribute("data-id");
          const targetPath = path || location.pathname;

          try {
            const res = await fetch(`${API_BASE}/api/comments/delete`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ comment_id: Number(commentId) || commentId }),
            });

            if (res.ok) {
              let data = null;
              try {
                data = await res.json();
              } catch {}

              if (!data || data.success !== false) {
                const el = document.getElementById(`comment-${commentId}`);
                if (el) el.remove();
                await loadComments(targetPath);
                return;
              } else {
                alert(data.error || "删除失败");
                return;
              }
            }

            let errText = "删除失败";
            try {
              const errData = await res.json();
              errText = errData.error || errText;
            } catch {}
            alert(errText);
          } catch (err) {
            console.error("[kzyc-auth] 删除评论请求异常:", err);
            await loadComments(targetPath);
          }
        });
      });
    });
  }

  function openLoginModal(msg) {
    const backdrop = document.getElementById("kzyc-auth-modal");
    if (backdrop) {
      const authView = document.getElementById("kzyc-auth-view");
      const profView = document.getElementById("kzyc-profile-view");
      const forgView = document.getElementById("kzyc-forgot-view");
      if (authView) authView.style.display = "block";
      if (profView) profView.style.display = "none";
      if (forgView) forgView.style.display = "none";
      const msgEl = document.getElementById("kzyc-auth-msg");
      if (msgEl) {
        msgEl.className = "kzyc-msg error";
        msgEl.textContent = msg || "请先登录！";
      }
      backdrop.classList.add("active");
      renderTurnstiles();
    }
  }

  async function loadMyDownloads() {
    const listEl = document.getElementById("kzyc-dl-history-list");
    const countEl = document.getElementById("kzyc-dl-history-count");
    if (!listEl) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/my-downloads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const downloads = data.downloads || [];

      if (countEl) {
        if (downloads.length === 0) {
          countEl.textContent = "暂无下载";
        } else {
          countEl.textContent = `最近 ${downloads.length} 条`;
        }
      }

      if (downloads.length === 0) {
        listEl.innerHTML = "<div style='opacity: 0.5; padding: 12px 0; text-align: center; font-size: 0.8rem;'>暂无下载记录</div>";
        return;
      }

      listEl.innerHTML = downloads
        .map((item) => {
          const path = item.post_path ? item.post_path : "";
          return `
            <a href="${path ? path : 'javascript:void(0);'}" class="kzyc-history-row" data-path="${escapeHTML(path)}" title="${path ? `点击直达文章：${escapeHTML(item.resource_title)}` : '旧记录暂未关联文章'}">
              <span class="kzyc-history-row-title">
                📦 ${escapeHTML(item.resource_title)}
              </span>
              <span class="kzyc-history-row-date">${item.downloaded_at.slice(0, 10)} ↗</span>
            </a>
          `;
        })
        .join("");

      listEl.querySelectorAll("a.kzyc-history-row").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const targetPath = a.getAttribute("data-path");
          if (!targetPath) {
            alert("该条记录是在功能升级前下载的旧数据，当时未记录文章地址。\n\n请在软件文章页重新点击一次“立即获取”，即可自动关联文章地址！");
            return;
          }

          const backdrop = document.getElementById("kzyc-auth-modal");
          if (backdrop) backdrop.classList.remove("active");

          if (location.pathname === targetPath) {
            alert("您当前已经在该文章页面了！");
            return;
          }

          window.location.href = targetPath;
        });
      });
    } catch {
      listEl.innerHTML = "<div style='opacity: 0.5; padding: 12px 0; text-align: center; font-size: 0.8rem;'>加载记录失败</div>";
    }
  }

  function bindEvents() {
    try {
      const backdrop = document.getElementById("kzyc-auth-modal");
      const closeBtn = document.getElementById("kzyc-modal-close");
      const tabs = document.querySelectorAll(".kzyc-tab");
      const loginForm = document.getElementById("kzyc-login-form");
      const regForm = document.getElementById("kzyc-register-form");
      const msgEl = document.getElementById("kzyc-auth-msg");

      const authView = document.getElementById("kzyc-auth-view");
      const forgotView = document.getElementById("kzyc-forgot-view");
      const forgotForm = document.getElementById("kzyc-forgot-form");
      const forgotMsgEl = document.getElementById("kzyc-forgot-msg");
      const sendCodeBtn = document.getElementById("kzyc-send-code-btn");

      const profileMsgEl = document.getElementById("kzyc-profile-msg");
      const togglePwdBtn = document.getElementById("kzyc-toggle-pwd-btn");
      const changePwdForm = document.getElementById("kzyc-change-pwd-form");
      const toggleDelBtn = document.getElementById("kzyc-toggle-del-btn");
      const delForm = document.getElementById("kzyc-del-form");

      const closeModal = () => {
        if (backdrop) backdrop.classList.remove("active");
        if (msgEl) msgEl.textContent = "";
        if (forgotMsgEl) forgotMsgEl.textContent = "";
        if (profileMsgEl) profileMsgEl.textContent = "";
        if (changePwdForm) changePwdForm.style.display = "none";
        if (delForm) delForm.style.display = "none";
      };

      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (backdrop) {
        backdrop.addEventListener("click", (e) => {
          if (e.target === backdrop) closeModal();
        });
      }

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          if (msgEl) msgEl.textContent = "";
          if (tab.dataset.tab === "login") {
            if (loginForm) loginForm.style.display = "block";
            if (regForm) regForm.style.display = "none";
          } else {
            if (loginForm) loginForm.style.display = "none";
            if (regForm) regForm.style.display = "block";
          }
          renderTurnstiles();
        });
      });

      const goForgot = document.getElementById("kzyc-go-forgot");
      if (goForgot) {
        goForgot.addEventListener("click", () => {
          if (authView) authView.style.display = "none";
          if (forgotView) forgotView.style.display = "block";
          if (forgotMsgEl) forgotMsgEl.textContent = "";
        });
      }

      const backLogin = document.getElementById("kzyc-back-login");
      if (backLogin) {
        backLogin.addEventListener("click", () => {
          if (forgotView) forgotView.style.display = "none";
          if (authView) authView.style.display = "block";
          if (msgEl) msgEl.textContent = "";
          renderTurnstiles();
        });
      }

      if (sendCodeBtn) {
        sendCodeBtn.addEventListener("click", async () => {
          const emailInput = document.getElementById("kzyc-forgot-email");
          const email = emailInput ? emailInput.value.trim() : "";
          if (!email) {
            if (forgotMsgEl) {
              forgotMsgEl.className = "kzyc-msg error";
              forgotMsgEl.textContent = "请先输入注册邮箱";
            }
            return;
          }
          sendCodeBtn.disabled = true;
          sendCodeBtn.textContent = "发送中...";
          if (forgotMsgEl) {
            forgotMsgEl.className = "kzyc-msg";
            forgotMsgEl.textContent = "正在生成验证码...";
          }

          try {
            const res = await fetch(`${API_BASE}/api/forgot-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
              if (forgotMsgEl) {
                forgotMsgEl.className = "kzyc-msg success";
                forgotMsgEl.textContent = data.message || "验证码已发送至邮箱，请查收！";
              }
              let count = 60;
              const timer = setInterval(() => {
                count--;
                if (count > 0) {
                  sendCodeBtn.textContent = `${count}s`;
                } else {
                  clearInterval(timer);
                  sendCodeBtn.disabled = false;
                  sendCodeBtn.textContent = "重新获取";
                }
              }, 1000);
            } else {
              sendCodeBtn.disabled = false;
              sendCodeBtn.textContent = "获取验证码";
              if (forgotMsgEl) {
                forgotMsgEl.className = "kzyc-msg error";
                forgotMsgEl.textContent = data.error || "发送失败";
              }
            }
          } catch {
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = "获取验证码";
            if (forgotMsgEl) {
              forgotMsgEl.className = "kzyc-msg error";
              forgotMsgEl.textContent = "网络异常，请重试";
            }
          }
        });
      }

      if (forgotForm) {
        forgotForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (forgotMsgEl) {
            forgotMsgEl.className = "kzyc-msg";
            forgotMsgEl.textContent = "正在重置密码...";
          }
          const submitBtn = document.getElementById("kzyc-forgot-submit");
          if (submitBtn) submitBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/reset-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: (document.getElementById("kzyc-forgot-email") ? document.getElementById("kzyc-forgot-email").value.trim() : ""), 
                code: (document.getElementById("kzyc-forgot-code") ? document.getElementById("kzyc-forgot-code").value.trim() : ""), 
                new_password: (document.getElementById("kzyc-forgot-newpwd") ? document.getElementById("kzyc-forgot-newpwd").value : ""), 
              }),
            });
            const data = await res.json();
            if (data.success) {
              if (forgotMsgEl) {
                forgotMsgEl.className = "kzyc-msg success";
                forgotMsgEl.textContent = "重置成功！正在切换回登录...";
              }
              setTimeout(() => {
                if (forgotView) forgotView.style.display = "none";
                if (authView) authView.style.display = "block";
                const accInput = document.getElementById("kzyc-login-account");
                if (accInput) accInput.value = (document.getElementById("kzyc-forgot-email") ? document.getElementById("kzyc-forgot-email").value : "");
                const pwdInput = document.getElementById("kzyc-login-pwd");
                if (pwdInput) pwdInput.value = "";
                if (msgEl) {
                  msgEl.className = "kzyc-msg success";
                  msgEl.textContent = "密码已重置，请使用新密码登录！";
                }
                renderTurnstiles();
              }, 1500);
            } else {
              if (forgotMsgEl) {
                forgotMsgEl.className = "kzyc-msg error";
                forgotMsgEl.textContent = data.error || "重置失败";
              }
            }
          } catch {
            if (forgotMsgEl) {
              forgotMsgEl.className = "kzyc-msg error";
              forgotMsgEl.textContent = "网络异常，请重试";
            }
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const turnstileInput = document.querySelector("#kzyc-login-form [name='cf-turnstile-response']");
          const turnstileToken = turnstileInput ? turnstileInput.value : "";
          if (!turnstileToken && typeof turnstile !== "undefined") {
            if (msgEl) {
              msgEl.className = "kzyc-msg error";
              msgEl.textContent = "请等待人机安全验证完成";
            }
            return;
          }

          if (msgEl) {
            msgEl.className = "kzyc-msg";
            msgEl.textContent = "登录中...";
          }
          const submitBtn = document.getElementById("kzyc-login-submit");
          if (submitBtn) submitBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                account: (document.getElementById("kzyc-login-account") ? document.getElementById("kzyc-login-account").value.trim() : ""), 
                password: (document.getElementById("kzyc-login-pwd") ? document.getElementById("kzyc-login-pwd").value : ""), 
                turnstile_token: turnstileToken,
              }),
            });
            const data = await res.json();
            if (data.success) {
              localStorage.setItem(TOKEN_KEY, data.token);
              currentUser = data.user;
              if (msgEl) {
                msgEl.className = "kzyc-msg success";
                msgEl.textContent = "登录成功！";
              }
              setTimeout(() => {
                closeModal();
                updateHeaderUI();
                renderCommentInputBox();
                loadComments(location.pathname);
                if (pendingDownloadBtn) {
                  pendingDownloadBtn.click();
                  pendingDownloadBtn = null;
                }
              }, 500);
            } else {
              if (msgEl) {
                msgEl.className = "kzyc-msg error";
                msgEl.textContent = data.error || "登录失败";
              }
              if (typeof turnstile !== "undefined") turnstile.reset();
            }
          } catch {
            if (msgEl) {
              msgEl.className = "kzyc-msg error";
              msgEl.textContent = "网络异常，请重试";
            }
            if (typeof turnstile !== "undefined") turnstile.reset();
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      if (regForm) {
        regForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const turnstileRegInput = document.querySelector("#kzyc-register-form [name='cf-turnstile-response']");
          const turnstileToken = turnstileRegInput ? turnstileRegInput.value : "";
          if (!turnstileToken && typeof turnstile !== "undefined") {
            if (msgEl) {
              msgEl.className = "kzyc-msg error";
              msgEl.textContent = "请等待人机安全验证完成";
            }
            return;
          }

          if (msgEl) {
            msgEl.className = "kzyc-msg";
            msgEl.textContent = "正在提交注册...";
          }
          const submitBtn = document.getElementById("kzyc-reg-submit");
          if (submitBtn) submitBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: (document.getElementById("kzyc-reg-username") ? document.getElementById("kzyc-reg-username").value.trim() : ""), 
                email: (document.getElementById("kzyc-reg-email") ? document.getElementById("kzyc-reg-email").value.trim() : ""), 
                password: (document.getElementById("kzyc-reg-pwd") ? document.getElementById("kzyc-reg-pwd").value : ""), 
                turnstile_token: turnstileToken,
              }),
            });
            const data = await res.json();
            if (data.success) {
              if (msgEl) {
                msgEl.className = "kzyc-msg success";
                msgEl.textContent = "注册成功！请切换到登录标签登录。";
              }
              regForm.reset();
            } else {
              if (msgEl) {
                msgEl.className = "kzyc-msg error";
                msgEl.textContent = data.error || "注册失败";
              }
              if (typeof turnstile !== "undefined") turnstile.reset();
            }
          } catch (err) {
            if (msgEl) {
              msgEl.className = "kzyc-msg error";
              msgEl.textContent = "注册异常: " + (err.message || "网络通信失败");
            }
            if (typeof turnstile !== "undefined") turnstile.reset();
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      if (togglePwdBtn) {
        togglePwdBtn.addEventListener("click", () => {
          if (changePwdForm) changePwdForm.style.display = changePwdForm.style.display === "none" ? "block" : "none";
          if (delForm) delForm.style.display = "none";
          if (profileMsgEl) profileMsgEl.textContent = "";
        });
      }

      if (toggleDelBtn) {
        toggleDelBtn.addEventListener("click", () => {
          if (delForm) delForm.style.display = delForm.style.display === "none" ? "block" : "none";
          if (changePwdForm) changePwdForm.style.display = "none";
          if (profileMsgEl) profileMsgEl.textContent = "";
        });
      }

      if (changePwdForm) {
        changePwdForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const token = localStorage.getItem(TOKEN_KEY);
          if (!token) return;

          if (profileMsgEl) {
            profileMsgEl.className = "kzyc-msg";
            profileMsgEl.textContent = "保存中...";
          }
          const submitBtn = document.getElementById("kzyc-pwd-submit");
          if (submitBtn) submitBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/change-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                old_password: (document.getElementById("kzyc-old-pwd") ? document.getElementById("kzyc-old-pwd").value : ""), 
                new_password: (document.getElementById("kzyc-new-pwd") ? document.getElementById("kzyc-new-pwd").value : ""), 
              }),
            });
            const data = await res.json();
            if (data.success) {
              if (profileMsgEl) {
                profileMsgEl.className = "kzyc-msg success";
                profileMsgEl.textContent = "密码修改成功！下次请使用新密码。";
              }
              changePwdForm.reset();
              setTimeout(() => { changePwdForm.style.display = "none"; }, 1500);
            } else {
              if (profileMsgEl) {
                profileMsgEl.className = "kzyc-msg error";
                profileMsgEl.textContent = data.error || "修改失败";
              }
            }
          } catch {
            if (profileMsgEl) {
              profileMsgEl.className = "kzyc-msg error";
              profileMsgEl.textContent = "网络异常";
            }
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      if (delForm) {
        delForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const token = localStorage.getItem(TOKEN_KEY);
          if (!token) return;

          if (!confirm("⚠️ 最终确认：确定要彻底注销账号吗？注销后一年内该用户名和邮箱不可再次注册！")) {
            return;
          }

          if (profileMsgEl) {
            profileMsgEl.className = "kzyc-msg";
            profileMsgEl.textContent = "正在处理注销...";
          }
          const submitBtn = document.getElementById("kzyc-del-submit");
          if (submitBtn) submitBtn.disabled = true;

          try {
            const res = await fetch(`${API_BASE}/api/delete-account`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ password: (document.getElementById("kzyc-del-pwd") ? document.getElementById("kzyc-del-pwd").value : "") }),
            });
            const data = await res.json();
            if (data.success) {
              alert("账号已成功注销。根据规则，该账号与邮箱一年内将无法再次注册。");
              localStorage.removeItem(TOKEN_KEY);
              currentUser = null;
              closeModal();
              updateHeaderUI();
              renderCommentInputBox();
            } else {
              if (profileMsgEl) {
                profileMsgEl.className = "kzyc-msg error";
                profileMsgEl.textContent = data.error || "注销失败";
              }
            }
          } catch {
            if (profileMsgEl) {
              profileMsgEl.className = "kzyc-msg error";
              profileMsgEl.textContent = "网络异常";
            }
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      const logoutBtn = document.getElementById("kzyc-logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem(TOKEN_KEY);
          currentUser = null;
          closeModal();
          updateHeaderUI();
          renderCommentInputBox();
          loadComments(location.pathname);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 渲染并保证顶栏头像处于正常状态
  function updateHeaderUI() {
    try {
      injectAvatarStyles();

      let container = document.getElementById("kzyc-auth-header");
      if (!container) {
        const headerInner = document.querySelector(".md-header__inner");
        if (headerInner) {
          container = document.createElement("div");
          container.id = "kzyc-auth-header";
          container.style.display = "flex";
          container.style.alignItems = "center";
          container.style.flexShrink = "0";
          headerInner.appendChild(container);
        } else {
          return;
        }
      }

      const backdrop = document.getElementById("kzyc-auth-modal");
      const authView = document.getElementById("kzyc-auth-view");
      const forgotView = document.getElementById("kzyc-forgot-view");
      const profileView = document.getElementById("kzyc-profile-view");

      if (currentUser) {
        const rawRole = String(currentUser.role || "").trim().toLowerCase();
        const effRole = String(currentUser.effective_role || "").trim().toLowerCase();
        const isExpired = currentUser.is_expired === true;

        let roleType = "user";
        if (rawRole.includes("站长") || rawRole.includes("管理") || rawRole === "admin" || effRole === "admin") {
          roleType = "admin";
        } else if (rawRole.includes("超级") || rawRole.includes("svip") || effRole === "svip") {
          roleType = "svip";
        } else if (rawRole.includes("标准") || rawRole.includes("vip") || effRole === "vip") {
          roleType = "vip";
        }

        let roleText = "普通用户";
        let roleBadgeClass = "user";

        if (roleType === "admin") {
          roleText = "👑 站长";
          roleBadgeClass = "admin";
        } else if (roleType === "svip") {
          roleText = isExpired ? "👑 超级会员 (已到期)" : "👑 超级会员";
          roleBadgeClass = isExpired ? "expired" : "svip";
        } else if (roleType === "vip") {
          roleText = isExpired ? "💎 标准会员 (已到期)" : "💎 标准会员";
          roleBadgeClass = isExpired ? "expired" : "vip";
        }

        let expireHtml = "";
        if (roleType === "vip" || roleType === "svip") {
          const expireDate = String(currentUser.vip_expire_at || currentUser.vip_expires_at || "").trim();
          let expireDisplay = "永久有效";
          if (expireDate) {
            expireDisplay = expireDate.includes("2999") ? "永久有效" : expireDate.slice(0, 10);
            if (isExpired) expireDisplay += " (已到期)";
          }
          expireHtml = `
            <div class="kzyc-popover-expire">
              <span class="kzyc-popover-expire-label">到期时间：</span>
              <span class="kzyc-popover-expire-val">${escapeHTML(expireDisplay)}</span>
            </div>
          `;
        }

        container.innerHTML = `
          <div class="kzyc-header-user-wrap">
            <button type="button" class="kzyc-header-avatar-btn" id="kzyc-open-profile" title="点击查看个人中心" aria-label="个人中心">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            <div class="kzyc-header-popover">
              <div class="kzyc-popover-top">
                <span class="kzyc-popover-name" title="${escapeHTML(currentUser.username)}">${escapeHTML(currentUser.username)}</span>
                <span class="kzyc-popover-badge ${roleBadgeClass}">${roleText}</span>
              </div>
              ${expireHtml}
              <div class="kzyc-popover-footer-tip">点击头像查看完整中心 ↗</div>
            </div>
          </div>
        `;

        const openProf = document.getElementById("kzyc-open-profile");
        if (openProf) {
          openProf.addEventListener("click", async () => {
            const uName = document.getElementById("kzyc-prof-username");
            const uMail = document.getElementById("kzyc-prof-email");
            const uId = document.getElementById("kzyc-prof-id");
            const uRole = document.getElementById("kzyc-prof-role");
            const expireRow = document.getElementById("kzyc-prof-expire-row");
            const expireVal = document.getElementById("kzyc-prof-expire");
            const quotaVal = document.getElementById("kzyc-prof-quota");

            const renderProfileModal = () => {
              if (!currentUser) return;
              if (uName) uName.textContent = currentUser.username || "--";
              if (uMail) uMail.textContent = currentUser.email || "--";
              if (uId) uId.textContent = `#${currentUser.id || "--"}`;

              const curRawRole = String(currentUser.role || "").trim().toLowerCase();
              const curEffRole = String(currentUser.effective_role || "").trim().toLowerCase();
              const curExpired = currentUser.is_expired === true;

              let curType = "user";
              if (curRawRole.includes("站长") || curRawRole.includes("管理") || curRawRole === "admin" || curEffRole === "admin") {
                curType = "admin";
              } else if (curRawRole.includes("超级") || curRawRole.includes("svip") || curEffRole === "svip") {
                curType = "svip";
              } else if (curRawRole.includes("标准") || curRawRole.includes("vip") || curEffRole === "vip") {
                curType = "vip";
              }

              let curText = "普通用户";
              let curClass = "kzyc-prof-badge user";

              if (curType === "admin") {
                curText = "👑 站长";
                curClass = "kzyc-prof-badge admin";
              } else if (curType === "svip") {
                curText = curExpired ? "👑 超级会员 (已到期)" : "👑 超级会员";
                curClass = curExpired ? "kzyc-prof-badge expired" : "kzyc-prof-badge svip";
              } else if (curType === "vip") {
                curText = curExpired ? "💎 标准会员 (已到期)" : "💎 标准会员";
                curClass = curExpired ? "kzyc-prof-badge expired" : "kzyc-prof-badge vip";
              }

              if (uRole) {
                uRole.textContent = curText;
                uRole.className = curClass;
              }

              const todayCount = currentUser.today_downloads || 0;
              const limit = currentUser.daily_limit || (curType === "svip" ? 20 : (curType === "vip" ? 10 : 3));
              const quotaText = curType === "admin" ? "无限制" : `${todayCount} / ${limit} 篇`;
              if (quotaVal) quotaVal.textContent = quotaText;

              const expireDate = String(currentUser.vip_expire_at || currentUser.vip_expires_at || "").trim();
              let expireDisplay = "未开通";
              if (curType === "admin") {
                expireDisplay = "永久有效";
              } else if (curType === "vip" || curType === "svip") {
                if (expireDate) {
                  expireDisplay = expireDate.includes("2999") ? "永久有效" : expireDate.slice(0, 10);
                  if (curExpired) expireDisplay += " (已到期)";
                } else {
                  expireDisplay = "永久有效";
                }
              }

              if (expireVal) expireVal.textContent = expireDisplay;
              if (expireRow) {
                expireRow.style.display = (curType === "vip" || curType === "svip" || curType === "admin") ? "flex" : "none";
              }
            };

            renderProfileModal();

            if (authView) authView.style.display = "none";
            if (forgotView) forgotView.style.display = "none";
            if (profileView) profileView.style.display = "block";
            if (backdrop) backdrop.classList.add("active");
            loadMyDownloads();

            try {
              const res = await fetch(`${API_BASE}/api/me`, {
                headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
              });
              const d = await res.json();
              if (d.success && d.user) {
                currentUser = d.user;
                renderProfileModal();
                updateHeaderUI();
              }
            } catch (err) {
              console.error("[kzyc-auth] /api/me 请求异常:", err);
            }
          });
        }
      } else {
        container.innerHTML = `<button class="kzyc-auth-btn" id="kzyc-open-auth">🔑 登录 / 注册</button>`;
        const openAuth = document.getElementById("kzyc-open-auth");
        if (openAuth) {
          openAuth.addEventListener("click", () => {
            if (authView) authView.style.display = "block";
            if (forgotView) forgotView.style.display = "none";
            if (profileView) profileView.style.display = "none";
            if (backdrop) backdrop.classList.add("active");
            renderTurnstiles();
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function checkAuth() {
    try {
      initAuthDOM();
      initDownloadCards();
      initComments();

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        updateHeaderUI();
        renderCommentInputBox();
        return;
      }

      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        currentUser = data.user;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        currentUser = null;
      }
      updateHeaderUI();
      renderCommentInputBox();
    } catch (e) {
      currentUser = null;
      updateHeaderUI();
      renderCommentInputBox();
    }
  }

  function mountAll() {
    initAuthDOM();
    checkAuth();
    initDownloadCards();
    initComments();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(mountAll);
  } else {
    let timerCount = 0;
    const hookTimer = setInterval(() => {
      timerCount++;
      if (typeof document$ !== "undefined") {
        clearInterval(hookTimer);
        document$.subscribe(mountAll);
      } else if (timerCount > 30) {
        clearInterval(hookTimer);
      }
    }, 100);
  }

  // 守护轮询：确保移动端与弱网环境下 DOM 异步挂载 100% 成功
  let quickPollCount = 0;
  const quickPoll = setInterval(() => {
    quickPollCount++;
    initAuthDOM();
    initDownloadCards();
    initComments();
    if (quickPollCount >= 15) {
      clearInterval(quickPoll);
    }
  }, 120);
})();