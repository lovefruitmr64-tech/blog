// ============================================================
// 站长管理后台模块 - VIP 账单明细与财务收入统计
// 文件名: orders.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 1.5 VIP 账单管理与财务收入统计 (新增模块)
  async function renderOrdersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载 VIP 账单记录与财务统计...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const url = `${API_BASE}/api/admin/orders?page=${ordersCurrentPage}&page_size=${ORDERS_PAGE_SIZE}&search=${encodeURIComponent(ordersSearchKeyword)}&status=${encodeURIComponent(ordersStatusFilter)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        allOrders = data.orders || [];
        ordersTotal = data.total || 0;
        ordersTotalPages = data.total_pages || 1;
        ordersRevenueStats = data.revenue_stats || {};
        drawOrdersTable(panel);
      } else {
        panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">加载账单失败：${data.error || "无权限"}</div>`;
      }
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取账单异常：${err.message}</div>`;
    }
  }

  function drawOrdersTable(panel) {
    const rev = ordersRevenueStats || {};

    panel.innerHTML = `
      <!-- 顶部财务四维数据看板 -->
      <div class="kzyc-rev-grid">
        <div class="kzyc-rev-card today">
          <div class="kzyc-rev-title">📅 今日收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(rev.today_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">今日成交: ${rev.today_paid_orders || 0} 笔</div>
        </div>
        <div class="kzyc-rev-card month">
          <div class="kzyc-rev-title">🗓️ 本月收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(rev.month_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">当月会员充值汇总</div>
        </div>
        <div class="kzyc-rev-card year">
          <div class="kzyc-rev-title">📆 本年收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(rev.year_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">年度总入账</div>
        </div>
        <div class="kzyc-rev-card total">
          <div class="kzyc-rev-title">💰 累计总收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(rev.total_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">历史总成交: ${rev.total_paid_orders || 0} 笔</div>
        </div>
      </div>

      <!-- 搜索栏与状态筛选 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <input class="kzyc-search-input" id="kzyc-order-search-input" value="${escapeHTML(ordersSearchKeyword)}" placeholder="🔍 搜用户名 / 邮箱 / 订单号 / 流水号" style="width: 260px;" />
          <select class="kzyc-adm-input" id="kzyc-order-status-select" style="width: 120px; margin-top: 0; padding: 6px 10px;">
            <option value="" ${ordersStatusFilter === '' ? 'selected' : ''}>全部状态</option>
            <option value="paid" ${ordersStatusFilter === 'paid' ? 'selected' : ''}>已支付 (paid)</option>
            <option value="pending" ${ordersStatusFilter === 'pending' ? 'selected' : ''}>待付款 (pending)</option>
          </select>
          <button class="kzyc-adm-btn primary" id="kzyc-order-search-btn">查询</button>
          ${(ordersSearchKeyword || ordersStatusFilter) ? `<button class="kzyc-adm-btn" id="kzyc-order-reset-btn">重置筛选</button>` : ''}
        </div>
        <div style="font-size: 0.8rem; opacity: 0.65;">共检索到 ${ordersTotal} 笔订单</div>
      </div>

      <!-- 订单表格 -->
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 140px;">系统订单号</th>
              <th class="kzyc-nowrap" style="width: 150px;">充值用户</th>
              <th class="kzyc-nowrap" style="width: 120px;">开通套餐</th>
              <th class="kzyc-nowrap" style="width: 85px;">实付金额</th>
              <th class="kzyc-nowrap" style="width: 80px;">支付状态</th>
              <th class="kzyc-nowrap" style="width: 155px;">时间记录</th>
              <th class="kzyc-nowrap" style="min-width: 180px;">支付宝交易流水号</th>
              <th class="kzyc-nowrap" style="width: 135px; text-align: center;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.length === 0 ? '<tr><td colspan="8" style="text-align: center; opacity: 0.5; padding: 24px;">暂无匹配的账单数据</td></tr>' : allOrders.map(o => {
              const isPaid = o.status === "paid";
              const statusBadge = isPaid
                ? '<span style="color: #16a34a; font-weight: 700; background: rgba(22,163,74,0.1); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">已支付</span>'
                : '<span style="color: #64748b; background: rgba(127,127,127,0.12); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">待付款</span>';

              const durMap = { "1m": "1个月", "3m": "3个月", "6m": "6个月", "1y": "1年", "forever": "永久" };
              const roleText = o.role === "svip" ? "👑 超级会员" : "💎 标准会员";
              const durText = durMap[o.duration] || o.duration;

              return `
                <tr>
                  <td class="kzyc-nowrap"><code style="font-size: 0.76rem;">${escapeHTML(o.order_id)}</code></td>
                  <td>
                    <strong class="kzyc-cell-truncate" style="max-width: 150px;" title="${escapeHTML(o.username)}">${escapeHTML(o.username)}</strong>
                    <div style="font-size: 0.72rem; opacity: 0.6;" class="kzyc-cell-truncate" title="${escapeHTML(o.email)}">${escapeHTML(o.email)}</div>
                  </td>
                  <td class="kzyc-nowrap">${roleText} (${durText})</td>
                  <td class="kzyc-nowrap"><strong style="color: #2563eb; font-size: 0.95rem;">¥ ${o.amount}</strong></td>
                  <td class="kzyc-nowrap">${statusBadge}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.72rem; line-height: 1.4; opacity: 0.75;">
                    下单: ${o.created_at || '-'}<br>
                    支付: ${o.paid_at ? `<span style="color: #16a34a;">${o.paid_at}</span>` : '-'}
                  </td>
                  <td class="kzyc-nowrap">
                    ${o.trade_no ? `<code style="font-family: monospace; font-size: 0.75rem; background: rgba(127,127,127,0.08); padding: 2px 6px; border-radius: 4px;">${escapeHTML(o.trade_no)}</code>` : '<span style="opacity: 0.4;">--</span>'}
                  </td>
                  <td class="kzyc-nowrap" style="text-align: center;">
                    <div style="display: inline-flex; gap: 4px; justify-content: center; align-items: center;">
                      ${!isPaid ? `<button class="kzyc-adm-btn success" onclick="handleCompleteOrder('${escapeHTML(o.order_id)}')">手动补单</button>` : ''}
                      <button class="kzyc-adm-btn danger" onclick="handleDeleteOrder('${escapeHTML(o.order_id)}')">删除</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- 分页组件 -->
      <div id="kzyc-orders-pagination-container">
        ${renderPaginationHTML(ordersCurrentPage, ordersTotal, ORDERS_PAGE_SIZE, "gotoOrdersPage")}
      </div>
    `;

    document.getElementById("kzyc-order-search-btn")?.addEventListener("click", () => {
      ordersSearchKeyword = document.getElementById("kzyc-order-search-input").value.trim();
      ordersStatusFilter = document.getElementById("kzyc-order-status-select").value;
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });

    document.getElementById("kzyc-order-search-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        ordersSearchKeyword = e.target.value.trim();
        ordersStatusFilter = document.getElementById("kzyc-order-status-select").value;
        ordersCurrentPage = 1;
        renderOrdersTab(panel);
      }
    });

    document.getElementById("kzyc-order-status-select")?.addEventListener("change", (e) => {
      ordersStatusFilter = e.target.value;
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });

    document.getElementById("kzyc-order-reset-btn")?.addEventListener("click", () => {
      ordersSearchKeyword = "";
      ordersStatusFilter = "";
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });
  }

  window.gotoOrdersPage = function(p) {
    if (isNaN(p) || p < 1) p = 1;
    if (p > ordersTotalPages) p = ordersTotalPages;
    ordersCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) renderOrdersTab(panel);
  };

  window.handleCompleteOrder = async function(orderId) {
    if (!confirm(`确认要将订单 [${orderId}] 手动标记为已支付并激活该用户的 VIP 会员权限吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/orders/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ order_id: orderId })
    });
    const d = await res.json();
    alert(d.message || d.error);
    if (d.success) {
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderOrdersTab(panel);
      refreshAdminStats();
    }
  };

  window.handleDeleteOrder = async function(orderId) {
    if (!confirm(`确定要彻底删除该订单记录 [${orderId}] 吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/orders/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ order_id: orderId })
    });
    const d = await res.json();
    alert(d.message || d.error);
    if (d.success) {
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderOrdersTab(panel);
      refreshAdminStats();
    }
  };


  window.renderOrdersTab = renderOrdersTab;
})();
