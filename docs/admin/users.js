// ============================================================
// 站长管理后台模块 - 用户与 VIP 会员管理、注销拦截恢复
// 文件名: users.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 4. 用户与会员管理
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-user-search-input" placeholder="🔍 搜索 UID、用户名或邮箱..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredUsers.length} 位用户</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-user-btn">➕ 添加新用户</button>
      </div>

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
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">会员身份角色</label>
            <select class="kzyc-adm-input" id="kzyc-user-role-inp">
              <option value="user">普通用户 (每日限 3 篇，仅公开资源)</option>
              <option value="vip">💎 标准会员 (每日限 10 篇，可下会员专享)</option>
              <option value="svip">👑 超级会员 (每日限 20 篇，全站畅下)</option>
              <option value="admin">👑 站长管理员 (无限量畅享)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;" id="kzyc-user-pwd-label">登录初始密码 (至少8位)</label>
            <input class="kzyc-adm-input" type="password" id="kzyc-user-pwd-inp" placeholder="输入密码" />
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <label style="font-size: 0.78rem; font-weight: 600;">会员到期日期 (普通用户可留空)</label>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('1m')">+1 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('3m')">+3 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('6m')">+6 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('year')">+1 年</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('forever')">永久 (2999年)</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('clear')">清空</button>
            </div>
          </div>
          <input class="kzyc-adm-input" type="date" id="kzyc-user-expire-inp" />
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-user-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-user-btn">确认提交</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 60px;">UID</th>
              <th class="kzyc-nowrap" style="width: 150px;">用户名</th>
              <th>邮箱</th>
              <th class="kzyc-nowrap" style="width: 130px;">身份状态</th>
              <th class="kzyc-nowrap" style="width: 115px;">会员到期时间</th>
              <th class="kzyc-nowrap" style="width: 130px;">注册时间</th>
              <th class="kzyc-nowrap" style="width: 160px;">管理操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="7" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配用户</td></tr>' : pageItems.map(u => {
              let roleBadge = '<span style="color: #2563eb; background: rgba(37,99,235,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">普通用户</span>';
              const rLower = String(u.role || "").toLowerCase();
              if (rLower.includes('admin') || rLower.includes('站长') || rLower.includes('管理')) {
                roleBadge = '<span style="color: #ea580c; font-weight: 700; background: rgba(234,88,12,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">👑 站长</span>';
              } else if (rLower.includes('svip') || rLower.includes('超级')) {
                roleBadge = '<span style="color: #c026d3; font-weight: 700; background: rgba(217,70,239,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">👑 超级会员</span>';
              } else if (rLower.includes('vip') || rLower.includes('标准')) {
                roleBadge = '<span style="color: #2563eb; font-weight: 700; background: rgba(37,99,235,0.15); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">💎 标准会员</span>';
              }

              const isBanned = (u.is_banned === 1 || u.is_banned === "1");
              const banBadge = isBanned ? '<span style="color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.12); padding: 2px 6px; border-radius: 4px; white-space: nowrap; margin-left: 4px; font-size: 0.72rem;">🚫 已封禁</span>' : '';

              let expireText = '--';
              if (u.vip_expire_at) {
                if (u.vip_expire_at.includes('2999')) expireText = '<span style="color: #16a34a; font-weight: 700;">永久有效</span>';
                else expireText = u.vip_expire_at;
              }

              return `
                <tr style="${isBanned ? 'background: rgba(239, 68, 68, 0.03);' : ''}">
                  <td class="kzyc-nowrap">#${u.id}</td>
                  <td><strong class="kzyc-cell-truncate" style="max-width: 140px;" title="${escapeHTML(u.username)}">${escapeHTML(u.username)}</strong></td>
                  <td><span class="kzyc-cell-truncate" title="${escapeHTML(u.email)}">${escapeHTML(u.email)}</span></td>
                  <td class="kzyc-nowrap">${roleBadge}${banBadge}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.76rem;">${expireText}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.74rem; opacity: 0.6;">${u.created_at ? u.created_at.slice(0, 16) : '--'}</td>
                  <td class="kzyc-nowrap" style="display: flex; gap: 4px; align-items: center;">
                    <button class="kzyc-adm-btn primary" data-id="${u.id}" data-name="${escapeHTML(u.username)}" data-email="${escapeHTML(u.email)}" data-role="${u.role}" data-expire="${u.vip_expire_at || ''}" onclick="handleEditUser(this)">编辑</button>
                    ${isBanned 
                      ? `<button class="kzyc-adm-btn success" onclick="handleToggleBan(${u.id}, 0, '${escapeHTML(u.username)}')">解封</button>` 
                      : `<button class="kzyc-adm-btn warn" onclick="handleToggleBan(${u.id}, 1, '${escapeHTML(u.username)}')">封禁</button>`}
                    <button class="kzyc-adm-btn danger" onclick="handleDeleteUser(${u.id}, '${escapeHTML(u.username)}')">删除</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-user-pagination-container">
        ${renderPaginationHTML(userCurrentPage, filteredUsers.length, USER_PAGE_SIZE, "gotoUserPage")}
      </div>

      <div style="margin-top: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-weight: 700; font-size: 0.88rem; color: #ef4444;">⚠️ 已注销账号列表与拦截管控 (${allDeletedAccounts.length})</span>
          <span style="font-size: 0.74rem; opacity: 0.6;">注销期内禁止注册，可通过下方按钮直接恢复或删除</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="kzyc-adm-table">
            <thead>
              <tr>
                <th class="kzyc-nowrap" style="width: 140px;">原用户名</th>
                <th>原注册邮箱</th>
                <th class="kzyc-nowrap" style="width: 150px;">注销时间</th>
                <th class="kzyc-nowrap" style="width: 150px;">管理操作</th>
              </tr>
            </thead>
            <tbody>
              ${allDeletedAccounts.length === 0 ? '<tr><td colspan="4" style="opacity: 0.5; text-align: center; padding: 12px;">暂无注销记录</td></tr>' : allDeletedAccounts.map(d => `
                <tr>
                  <td class="kzyc-nowrap"><strong>${escapeHTML(d.username)}</strong></td>
                  <td><span class="kzyc-cell-truncate" title="${escapeHTML(d.email)}">${escapeHTML(d.email)}</span></td>
                  <td class="kzyc-nowrap" style="font-size: 0.76rem; color: #ef4444;">${d.deleted_at}</td>
                  <td class="kzyc-nowrap">
                    <button class="kzyc-adm-btn success" onclick="handleRestoreDeleted('${escapeHTML(d.email)}', '${escapeHTML(d.username)}')">恢复账号</button>
                    <button class="kzyc-adm-btn danger" onclick="handleDeleteDeleted('${escapeHTML(d.email)}', '${escapeHTML(d.username)}')">彻底删除</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

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
      document.getElementById("kzyc-user-expire-inp").value = "";
      wrap.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-user-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-user-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-user-btn")?.addEventListener("click", async () => {
      const uid = document.getElementById("kzyc-user-id-val").value.trim();
      const username = document.getElementById("kzyc-user-name-inp").value.trim();
      const email = document.getElementById("kzyc-user-email-inp").value.trim();
      const role = document.getElementById("kzyc-user-role-inp").value;
      const pwd = document.getElementById("kzyc-user-pwd-inp").value.trim();
      const vipExpireAt = document.getElementById("kzyc-user-expire-inp").value.trim();

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
        ? { user_id: uid, username, email, role, vip_expire_at: vipExpireAt, new_password: pwd }
        : { username, email, password: pwd, role, vip_expire_at: vipExpireAt };

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

  // 智能会员时长辅助设置器
  window.setExpireHelper = function(type) {
    const inp = document.getElementById("kzyc-user-expire-inp");
    if (!inp) return;

    if (type === "forever") {
      inp.value = "2999-12-31";
      return;
    }
    if (type === "clear") {
      inp.value = "";
      return;
    }

    let d = new Date();
    if (inp.value && !inp.value.includes("2999")) {
      const existing = new Date(inp.value + "T00:00:00");
      if (!isNaN(existing.getTime()) && existing.getTime() > d.getTime()) {
        d = existing;
      }
    }

    if (type === "1m") {
      d.setMonth(d.getMonth() + 1);
    } else if (type === "3m") {
      d.setMonth(d.getMonth() + 3);
    } else if (type === "6m") {
      d.setMonth(d.getMonth() + 6);
    } else if (type === "year") {
      d.setFullYear(d.getFullYear() + 1);
    }

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    inp.value = `${y}-${m}-${day}`;
  };

  window.gotoUserPage = function(p) {
    const totalPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    userCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawUsersTable(panel);
  };

  window.handleToggleBan = async function(uid, isBanned, username) {
    const actionText = isBanned ? "封禁拉黑" : "解除封禁";
    const tip = isBanned 
      ? `确定要【封禁拉黑】用户 [${username}] (UID: #${uid}) 吗？\n\n封禁后该账号将立即无法登录网站、无法获取下载资源或发表评论！`
      : `确定要【解除封禁】用户 [${username}] (UID: #${uid}) 吗？\n\n解除后该用户将完全恢复正常的登录与全站功能使用权限。`;
    
    if (!confirm(tip)) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/users/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: uid, is_banned: isBanned })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "操作成功！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "操作失败");
    }
  };

  window.handleEditResource = function(btn) {
    const wrap = document.getElementById("kzyc-res-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";

    const key = btn.getAttribute("data-key");
    const title = btn.getAttribute("data-title");
    const url = btn.getAttribute("data-url");
    const pwd = btn.getAttribute("data-pwd");
    const vip = btn.getAttribute("data-vip");

    document.getElementById("kzyc-res-form-title").textContent = `✏️ 编辑软件资源：${key}`;
    const inpKey = document.getElementById("kzyc-inp-key");
    inpKey.value = key;
    inpKey.disabled = true;
    document.getElementById("kzyc-inp-title").value = title;
    document.getElementById("kzyc-inp-url").value = url;
    document.getElementById("kzyc-inp-pwd").value = pwd;
    document.getElementById("kzyc-inp-vip-only").value = String(vip || "0");
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
    const expire = btn.getAttribute("data-expire");

    document.getElementById("kzyc-user-form-title").textContent = `✏️ 编辑用户 UID: #${uid}`;
    document.getElementById("kzyc-user-id-val").value = uid;
    document.getElementById("kzyc-user-name-inp").value = name;
    document.getElementById("kzyc-user-email-inp").value = email;
    document.getElementById("kzyc-user-role-inp").value = role || "user";
    document.getElementById("kzyc-user-pwd-label").textContent = "重置登录密码 (留空则不修改)";
    document.getElementById("kzyc-user-pwd-inp").value = "";
    document.getElementById("kzyc-user-pwd-inp").required = false;
    document.getElementById("kzyc-user-expire-inp").value = expire || "";
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

  window.handleRestoreDeleted = async function(email, username) {
    if (!confirm(`确定要恢复已注销账号 [${username}] (${email}) 吗？\n\n恢复后该用户将重新加入用户列表，初始密码设为 12345678，并自动解除注销拦截限制！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/deleted-accounts/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "账号已成功恢复！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "恢复失败");
    }
  };

  window.handleDeleteDeleted = async function(email, username) {
    if (!confirm(`确定要彻底删除 [${username}] (${email}) 的注销记录吗？\n\n删除后该用户名和邮箱将立即解除1年冷却期锁定，允许重新注册！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/deleted-accounts/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "注销记录已彻底清除！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "删除失败");
    }
  };


  window.renderUsersTab = renderUsersTab;
})();
