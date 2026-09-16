// ============================================================
// 站长管理后台模块 - 全站评论审核流与敏感词拦截
// 文件名: comments.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 5. 评论审核（带状态筛选与分页系统）
  async function renderCommentsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载评论列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/comments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allComments = data.comments || [];
      const pendingCount = allComments.filter(c => c.status === "pending").length;
      updatePendingBadge(pendingCount);
      commCurrentPage = 1;
      applyCommentFilter();
      drawCommentsTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取评论失败：${err.message}</div>`;
    }
  }

  function applyCommentFilter() {
    if (commFilterStatus === "pending") {
      filteredComments = allComments.filter(c => c.status === "pending");
    } else if (commFilterStatus === "approved") {
      filteredComments = allComments.filter(c => c.status === "approved");
    } else {
      filteredComments = allComments;
    }
  }

  function drawCommentsTable(panel) {
    const startIdx = (commCurrentPage - 1) * COMM_PAGE_SIZE;
    const pageItems = filteredComments.slice(startIdx, startIdx + COMM_PAGE_SIZE);
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    const approvedCount = allComments.filter(c => c.status === "approved").length;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-weight: 700; font-size: 0.95rem;">全站评论审核 (${allComments.length})</span>
          <div style="display: inline-flex; gap: 4px; background: rgba(127,127,127,0.08); padding: 3px; border-radius: 8px;">
            <button class="kzyc-adm-tab ${commFilterStatus === 'all' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem;" onclick="filterCommentsStatus('all')">全部 (${allComments.length})</button>
            <button class="kzyc-adm-tab ${commFilterStatus === 'pending' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem; ${pendingCount > 0 ? 'color: #ea580c; font-weight: 700;' : ''}" onclick="filterCommentsStatus('pending')">待审核 (${pendingCount})</button>
            <button class="kzyc-adm-tab ${commFilterStatus === 'approved' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem;" onclick="filterCommentsStatus('approved')">已通过 (${approvedCount})</button>
          </div>
        </div>
        <div style="font-size: 0.8rem; opacity: 0.6;">当前筛选共 ${filteredComments.length} 条</div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 50px;">ID</th>
              <th style="width: 150px;">文章路径</th>
              <th class="kzyc-nowrap" style="width: 100px;">发布用户</th>
              <th>评论内容</th>
              <th class="kzyc-nowrap" style="width: 80px;">状态</th>
              <th class="kzyc-nowrap" style="width: 120px;">发布时间</th>
              <th class="kzyc-nowrap" style="width: 110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="7" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配评论</td></tr>' : pageItems.map(c => `
              <tr id="kzyc-admin-comment-${c.id}">
                <td class="kzyc-nowrap">#${c.id}</td>
                <td><span class="kzyc-cell-truncate" style="max-width: 140px;" title="${escapeHTML(c.post_path)}">${escapeHTML(c.post_path)}</span></td>
                <td class="kzyc-nowrap"><strong class="kzyc-cell-truncate" style="max-width: 90px;" title="${escapeHTML(c.username)}">${escapeHTML(c.username)}</strong></td>
                <td><span class="kzyc-cell-truncate" title="${escapeHTML(c.content)}">${escapeHTML(c.content)}</span></td>
                <td class="kzyc-nowrap">${c.status === 'pending' ? '<span style="color: #ea580c; font-weight: 700; white-space: nowrap;">待审核</span>' : '<span style="color: #16a34a; white-space: nowrap;">已通过</span>'}</td>
                <td class="kzyc-nowrap" style="font-size: 0.74rem; opacity: 0.6;">${c.created_at.slice(0, 16)}</td>
                <td class="kzyc-nowrap">
                  ${c.status === 'pending' ? `<button class="kzyc-adm-btn success" onclick="moderateComment(${c.id}, 'approved')">通过</button>` : `<button class="kzyc-adm-btn warn" onclick="moderateComment(${c.id}, 'pending')">待审</button>`}
                  <button class="kzyc-adm-btn danger" onclick="deleteComment(${c.id})">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-comm-pagination-container">
        ${renderPaginationHTML(commCurrentPage, filteredComments.length, COMM_PAGE_SIZE, "gotoCommPage")}
      </div>
    `;
  }

  window.filterCommentsStatus = function(st) {
    commFilterStatus = st;
    commCurrentPage = 1;
    applyCommentFilter();
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
  };

  window.gotoCommPage = function(p) {
    const totalPages = Math.ceil(filteredComments.length / COMM_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    commCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
  };

  window.moderateComment = async function(id, status) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id, status })
    });
    
    const target = allComments.find(c => c.id === id);
    if (target) target.status = status;
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    updatePendingBadge(pendingCount);
    applyCommentFilter();
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
    refreshAdminStats();
  };

  window.deleteComment = async function(id) {
    if (!confirm("确定要彻底删除这条评论吗？相关楼中楼回复也会一并删除！")) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id })
    });
    
    allComments = allComments.filter(c => c.id !== id && c.parent_id !== id);
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    updatePendingBadge(pendingCount);
    applyCommentFilter();
    const totalPages = Math.ceil(filteredComments.length / COMM_PAGE_SIZE) || 1;
    if (commCurrentPage > totalPages) commCurrentPage = totalPages;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
    refreshAdminStats();
  };


  window.renderCommentsTab = renderCommentsTab;
})();
