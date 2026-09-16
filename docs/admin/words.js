// ============================================================
// 站长管理后台模块 - 全站敏感词库管理
// 文件名: words.js
// ============================================================

(function() {
  const API_BASE = window.API_BASE || "https://auth.kzyc.de5.net";
  const TOKEN_KEY = window.TOKEN_KEY || "kzyc_token";
  const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const renderPaginationHTML = window.renderPaginationHTML || function() { return ""; };

  // 6. 敏感词库
  async function renderWordsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取敏感词库...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/sensitive-words`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allWords = data.words || [];
      filteredWords = allWords;
      wordCurrentPage = 1;
      drawWordsContent(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取敏感词库失败：${err.message}</div>`;
    }
  }

  function drawWordsContent(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (wordCurrentPage - 1) * WORD_PAGE_SIZE;
    const pageItems = filteredWords.slice(startIdx, startIdx + WORD_PAGE_SIZE);

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="font-weight: 700; font-size: 0.95rem;">🧹 违规敏感词库（共 ${allWords.length} 个词）</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-word-search-input" placeholder="🔍 检索词库中关键词..." style="width: 180px;" />
          <span style="font-size: 0.8rem; opacity: 0.6;">当前展示: ${pageItems.length} 项</span>
        </div>
      </div>

      <div class="kzyc-adm-form-card" style="display: flex; gap: 10px; align-items: center;">
        <input class="kzyc-adm-input" id="kzyc-inp-word" placeholder="输入敏感词汇，支持用逗号、顿号、空格批量粘贴输入..." style="margin: 0; flex: 1;" />
        <button class="kzyc-adm-btn primary" id="kzyc-add-word-btn" style="padding: 8px 16px;">➕ 添加敏感词</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; min-height: 50px;">
        ${pageItems.length === 0 ? '<div style="opacity: 0.5; padding: 10px 0;">暂无匹配的敏感词</div>' : pageItems.map(w => `
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(127,127,127,0.08); border: 1px solid rgba(127,127,127,0.18); border-radius: 6px; font-size: 0.82rem;">
            ${escapeHTML(w.word)}
            <button onclick="deleteWord(${w.id})" title="删除该词" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
          </span>
        `).join('')}
      </div>

      <div id="kzyc-words-pagination-container">
        ${renderPaginationHTML(wordCurrentPage, filteredWords.length, WORD_PAGE_SIZE, "gotoWordPage")}
      </div>
    `;

    const searchInput = document.getElementById("kzyc-word-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredWords = allWords.filter(w => w.word && w.word.toLowerCase().includes(q));
        wordCurrentPage = 1;
        drawWordsContent(panel);
        const newInp = document.getElementById("kzyc-word-search-input");
        if (newInp) {
          newInp.value = e.target.value;
          newInp.focus();
        }
      });
    }

    document.getElementById("kzyc-add-word-btn")?.addEventListener("click", async () => {
      const rawText = document.getElementById("kzyc-inp-word").value.trim();
      if (!rawText) return;

      const wordsList = rawText.split(/[,，、;\s\n\r]+/).map(w => w.trim()).filter(Boolean);
      if (wordsList.length === 0) return;

      const addBtn = document.getElementById("kzyc-add-word-btn");
      addBtn.disabled = true;

      for (let i = 0; i < wordsList.length; i++) {
        const word = wordsList[i];
        addBtn.textContent = `添加中 (${i + 1}/${wordsList.length})...`;
        try {
          await fetch(`${API_BASE}/api/admin/sensitive-words/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ word })
          });
        } catch {}
      }

      document.getElementById("kzyc-inp-word").value = "";
      renderWordsTab(panel);
    });
  }

  window.gotoWordPage = function(p) {
    const totalPages = Math.ceil(filteredWords.length / WORD_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    wordCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawWordsContent(panel);
  };

  window.deleteWord = async function(id) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/sensitive-words/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    
    allWords = allWords.filter(w => w.id !== id);
    filteredWords = filteredWords.filter(w => w.id !== id);
    const totalPages = Math.ceil(filteredWords.length / WORD_PAGE_SIZE) || 1;
    if (wordCurrentPage > totalPages) wordCurrentPage = totalPages;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawWordsContent(panel);
  };

  // ============================================================

  window.renderWordsTab = renderWordsTab;
})();
