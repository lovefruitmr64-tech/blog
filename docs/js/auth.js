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

  function getAvatarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#059669", "#0891b2", "#4f46e5"];
    return colors[Math.abs(hash) % colors.length];
  }

  function timeAgo(dateStr) {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes}分钟前`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}小时前`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}天前`;
      return dateStr.slice(0, 10);
    } catch {
      return "";
    }
  }

  function renderChannelsHTML(rawUrl, singleCode, unzipPwd) {
    let list = [];
    const raw = String(rawUrl || "").trim();

    if (raw.startsWith("[")) {
      try {
        const arr = JSON.parse(raw);
        list = arr.map((item) => ({
          name: item.name || "网盘下载",
          url: item.url || "#",
          code: item.code || item.extract_code || "",
        }));
      } catch {}
    }

    if (list.length === 0) {
      const lines = raw.split(/[\r\n;]+/).map((s) => s.trim()).filter(Boolean);
      if (lines.length > 1 || lines[0].includes("|")) {
        for (const line of lines) {
          const parts = line.split("|").map((s) => s.trim());
          if (parts.length >= 2) {
            list.push({
              name: parts[0],
              url: parts,
              code: parts[2] || "",
            });
          }
        }
      }
    }

    if (list.length === 0 && raw) {
      list = [{ name: "网盘直通", url: raw, code: singleCode || "" }];
    }

    let html = `<div class="kzyc-channel-wrap">`;
    list.forEach((ch) => {
      html += `
        <div class="kzyc-channel-row">
          <span class="kzyc-channel-tag">📁 ${ch.name}</span>
          <a href="${ch.url}" target="_blank" rel="noopener" class="kzyc-dl-link-btn">打开网盘 ↗</a>
          ${ch.code ? `<span class="kzyc-code-wrap">提取码: <span class="kzyc-code-tag">${ch.code}</span><button type="button" class="kzyc-copy-btn" data-copy="${ch.code}">复制</button></span>` : ""}
        </div>
      `;
    });

    if (unzipPwd) {
      html += `
        <div class="kzyc-unzip-row">
          <span>🔑 专属解压密码：<span class="kzyc-code-tag">${unzipPwd}</span></span>
          <button type="button" class="kzyc-copy-btn" data-copy="${unzipPwd}">复制密码</button>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  }

  function initAuthDOM() {
    try {
      if (document.getElementById("kzyc-auth-modal")) return;

      const headerInner = document.querySelector(".md-header__inner");
      if (!headerInner) return;

      if (!document.getElementById("cf-turnstile-script")) {
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      let authContainer = document.getElementById("kzyc-auth-header");
      if (!authContainer) {
        authContainer = document.createElement("div");
        authContainer.id = "kzyc-auth-header";
        authContainer.style.display = "flex";
        authContainer.style.alignItems = "center";
        headerInner.appendChild(authContainer);
      }

      const modalHTML = `
        <div id="kzyc-auth-modal" class="kzyc-modal-backdrop">
          <div class="kzyc-modal">
            <button class="kzyc-modal-close" id="kzyc-modal-close">✕</button>
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
            <div id="kzyc-profile-view" style="display: none;">
              <h3 style="margin-top: 0; font-size: 1.15rem;">👤 个人中心</h3>
              <div class="kzyc-profile-item"><span>用户名：</span><strong id="kzyc-prof-username"></strong></div>
              <div class="kzyc-profile-item"><span>邮箱：</span><strong id="kzyc-prof-email"></strong></div>
              <div class="kzyc-profile-item"><span>用户 ID：</span><span id="kzyc-prof-id"></span></div>
              <div class="kzyc-dl-history-box">
                <h4>📥 最近获取的资源：</h4>
                <div id="kzyc-dl-history-list" style="font-size: 0.8rem; opacity: 0.75;">加载中...</div>
              </div>
              <button class="kzyc-secondary-btn" id="kzyc-toggle-pwd-btn">🔐 修改密码</button>
              <form id="kzyc-change-pwd-form" style="display: none; margin-top: 10px;">
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
              <button class="kzyc-logout-btn" id="kzyc-logout-btn">退出登录</button>
              <button class="kzyc-danger-btn" id="kzyc-toggle-del-btn">⚠️ 注销账号</button>
              <form id="kzyc-del-form" style="display: none; margin-top: 10px;">
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
      const boxes = document.querySelectorAll(".kzyc-download-box:not([data-rendered])");
      if (boxes.length === 0) return;

      boxes.forEach((box) => {
        box.setAttribute("data-rendered", "true");
        const key = box.getAttribute("data-key");
        const customTitle = box.getAttribute("data-title") || "专属软件资源包";

        box.innerHTML = `
          <div class="kzyc-download-card">
            <div class="kzyc-card-header">
              <span class="kzyc-card-icon">📦</span>
              <div>
                <div class="kzyc-card-title">${customTitle}</div>
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
                body: JSON.stringify({ resource_key: key }),
              });
              const data = await res.json();
              if (data.success) {
                btn.style.display = "none";
                resultBox.style.display = "block";
                resultBox.innerHTML = renderChannelsHTML(data.download_url, data.extract_code, data.unzip_pwd);

                resultBox.querySelectorAll(".kzyc-copy-btn").forEach((cBtn) => {
                  cBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(cBtn.getAttribute("data-copy"));
                    cBtn.textContent = "已复制！";
                    setTimeout(() => { cBtn.textContent = "复制"; }, 1500);
                  });
                });
              } else {
                resultBox.style.display = "block";
                resultBox.innerHTML = `<span style="color: #ef4444;">${data.error || "获取下载链接失败"}</span>`;
                btn.disabled = false;
                btn.textContent = "📥 重新尝试获取";
              }
            } catch {
              resultBox.style.display = "block";
              resultBox.innerHTML = `<span style="color: #ef4444;">网络通信异常，请重试</span>`;
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

  // 3. 独立评论区初始化
  function initComments() {
    const root = document.getElementById("kzyc-comments-root");
    if (!root || root.getAttribute("data-rendered")) return;
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
      document.getElementById("kzyc-trigger-comment-login").addEventListener("click", () => {
        openLoginModal("🔒 请先登录后再参与评论讨论！");
      });
    }
  }

  async function loadComments(path) {
    const listEl = document.getElementById("kzyc-comments-list");
    const countEl = document.getElementById("kzyc-comments-count");
    if (!listEl) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE}/api/comments?path=${encodeURIComponent(path)}`, { headers });
      const data = await res.json();
      if (!data.success) {
        listEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">加载失败：${data.error}</div>`;
        return;
      }

      const all = data.comments || [];
      if (countEl) countEl.textContent = all.length;

      if (all.length === 0) {
        listEl.innerHTML = `<div style="opacity: 0.5; padding: 30px 0; text-align: center;">暂无评论，快来抢沙发发表第一条看法吧~ 🚀</div>`;
        return;
      }

      const rootComments = all.filter((c) => c.parent_id === 0);
      const repliesMap = {};
      all.filter((c) => c.parent_id > 0).forEach((r) => {
        if (!repliesMap[r.parent_id]) repliesMap[r.parent_id] = [];
        repliesMap[r.parent_id].push(r);
      });

      let html = "";
      rootComments.forEach((c) => {
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

      listEl.innerHTML = html;
      bindCommentActions(path);
    } catch (e) {
      listEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">评论服务通信异常</div>`;
    }
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
      btn.addEventListener("click", async () => {
        if (!confirm("确定要删除这条评论吗？相关楼中楼回复也会一并删除！")) return;
        const token = localStorage.getItem(TOKEN_KEY);
        const commentId = btn.getAttribute("data-id");

        try {
          const res = await fetch(`${API_BASE}/api/comments/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ comment_id: commentId }),
          });
          const data = await res.json();
          if (data.success) {
            loadComments(path);
          } else {
            alert(data.error || "删除失败");
          }
        } catch {
          alert("网络异常");
        }
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
    if (!listEl) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/my-downloads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.downloads.length > 0) {
        listEl.innerHTML = data.downloads
          .map((item) => `
            <div class="kzyc-history-item">
              <span>📦 ${item.resource_title}</span>
              <span style="opacity: 0.6;">${item.downloaded_at.slice(0, 10)}</span>
            </div>
          `).join("");
      } else {
        listEl.innerHTML = "<div style='opacity: 0.5;'>暂无下载记录</div>";
      }
    } catch {}
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
          const email = document.getElementById("kzyc-forgot-email")?.value.trim();
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
                if (data.debug_code) {
                  forgotMsgEl.textContent = `验证码已生成！测试环境：${data.debug_code}`;
                  const codeInp = document.getElementById("kzyc-forgot-code");
                  if (codeInp) codeInp.value = data.debug_code;
                } else {
                  forgotMsgEl.textContent = data.message || "验证码已发送至邮箱，请查收！";
                }
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
                email: document.getElementById("kzyc-forgot-email")?.value.trim(),
                code: document.getElementById("kzyc-forgot-code")?.value.trim(),
                new_password: document.getElementById("kzyc-forgot-newpwd")?.value,
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
                if (accInput) accInput.value = document.getElementById("kzyc-forgot-email")?.value || "";
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
          const turnstileToken = document.querySelector("#kzyc-login-form [name='cf-turnstile-response']")?.value;
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
                account: document.getElementById("kzyc-login-account")?.value.trim(),
                password: document.getElementById("kzyc-login-pwd")?.value,
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
          const turnstileToken = document.querySelector("#kzyc-register-form [name='cf-turnstile-response']")?.value;
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
                username: document.getElementById("kzyc-reg-username")?.value.trim(),
                email: document.getElementById("kzyc-reg-email")?.value.trim(),
                password: document.getElementById("kzyc-reg-pwd")?.value,
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
                old_password: document.getElementById("kzyc-old-pwd")?.value,
                new_password: document.getElementById("kzyc-new-pwd")?.value,
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
              body: JSON.stringify({ password: document.getElementById("kzyc-del-pwd")?.value }),
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

  function updateHeaderUI() {
    try {
      const container = document.getElementById("kzyc-auth-header");
      if (!container) return;

      const backdrop = document.getElementById("kzyc-auth-modal");
      const authView = document.getElementById("kzyc-auth-view");
      const forgotView = document.getElementById("kzyc-forgot-view");
      const profileView = document.getElementById("kzyc-profile-view");

      if (currentUser) {
        container.innerHTML = `<button class="kzyc-auth-btn" id="kzyc-open-profile">👤 ${currentUser.username}</button>`;
        const openProf = document.getElementById("kzyc-open-profile");
        if (openProf) {
          openProf.addEventListener("click", () => {
            const uName = document.getElementById("kzyc-prof-username");
            const uMail = document.getElementById("kzyc-prof-email");
            const uId = document.getElementById("kzyc-prof-id");
            if (uName) uName.textContent = currentUser.username;
            if (uMail) uMail.textContent = currentUser.email;
            if (uId) uId.textContent = `#${currentUser.id}`;

            if (authView) authView.style.display = "none";
            if (forgotView) forgotView.style.display = "none";
            if (profileView) profileView.style.display = "block";
            if (backdrop) backdrop.classList.add("active");
            loadMyDownloads();
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

  let quickPollCount = 0;
  const quickPoll = setInterval(() => {
    quickPollCount++;
    const hasUnrenderedCards = document.querySelector(".kzyc-download-box:not([data-rendered])");
    const hasUnrenderedComments = document.querySelector("#kzyc-comments-root:not([data-rendered])");
    if (hasUnrenderedCards) initDownloadCards();
    if (hasUnrenderedComments) initComments();
    if (quickPollCount >= 20) {
      clearInterval(quickPoll);
    }
  }, 100);
})();