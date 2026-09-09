---
hide:
  - navigation
  - toc
---

# 标签

<div class="kzyc-tag-toolbar">
  <input type="text" id="kzyc-tag-search" placeholder="🔍 实时搜索标签或文章标题..." class="kzyc-tag-search-input" />
  <div class="kzyc-tag-btn-group">
    <span id="kzyc-tag-stat-info" class="kzyc-tag-stat-badge">计算中...</span>
    <button type="button" class="kzyc-tag-tool-btn" id="kzyc-expand-all-btn">全部展开</button>
    <button type="button" class="kzyc-tag-tool-btn" id="kzyc-collapse-all-btn">全部折叠</button>
  </div>
</div>

<!-- md-tags -->

<style>
/* 标签顶部搜索与操作工具栏 */
.kzyc-tag-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  margin: 16px 0 24px 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
.kzyc-tag-search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  color: inherit;
  font-size: 0.86rem;
  outline: none;
  transition: all 0.2s;
}
.kzyc-tag-search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.kzyc-tag-btn-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.kzyc-tag-stat-badge {
  font-size: 0.76rem;
  opacity: 0.7;
  margin-right: 4px;
}
.kzyc-tag-tool-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: rgba(127, 127, 127, 0.06);
  color: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}
.kzyc-tag-tool-btn:hover {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-color: #2563eb;
}

/* 标签手风琴折叠卡片 */
.kzyc-tag-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin: 10px 0 0 0 !important;
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.16);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.kzyc-tag-accordion-header:hover {
  background: rgba(37, 99, 235, 0.06);
  border-color: rgba(37, 99, 235, 0.35);
}
.kzyc-tag-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
}
.kzyc-tag-count-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
.kzyc-tag-arrow {
  font-size: 0.76rem;
  transition: transform 0.2s ease;
  opacity: 0.55;
}
.kzyc-tag-arrow.open {
  transform: rotate(90deg);
}

/* 展开后的文章列表 */
.kzyc-tag-article-list {
  padding: 8px 16px 12px 28px !important;
  margin: 0 !important;
  border-left: 2px solid rgba(37, 99, 235, 0.25);
  margin-left: 14px !important;
  transition: all 0.2s ease;
}
.kzyc-tag-article-list li {
  margin: 7px 0 !important;
  font-size: 0.88rem;
}
.kzyc-tag-article-list a {
  text-decoration: none;
  color: inherit;
  transition: color 0.15s;
}
.kzyc-tag-article-list a:hover {
  color: #2563eb;
}

/* 黑夜模式自适应 */
[data-md-color-scheme="slate"] .kzyc-tag-accordion-header {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}
[data-md-color-scheme="slate"] .kzyc-tag-accordion-header:hover {
  background: rgba(147, 197, 253, 0.08);
  border-color: rgba(147, 197, 253, 0.3);
}
[data-md-color-scheme="slate"] .kzyc-tag-count-badge {
  background: rgba(147, 197, 253, 0.15);
  color: #93c5fd;
}
[data-md-color-scheme="slate"] .kzyc-tag-article-list a:hover {
  color: #93c5fd;
}
</style>

<script>
(function() {
  function initTagsEnhancer() {
    const container = document.querySelector(".md-content__inner");
    if (!container || container.getAttribute("data-tags-enhanced") === "true") return;

    const headings = Array.from(container.querySelectorAll("h2, h3"));
    if (headings.length === 0) return;

    container.setAttribute("data-tags-enhanced", "true");

    const tagSections = [];
    let totalArticles = 0;

    headings.forEach((h) => {
      let nextEl = h.nextElementSibling;
      while (nextEl && nextEl.tagName !== "UL" && nextEl.tagName !== "H2" && nextEl.tagName !== "H3") {
        nextEl = nextEl.nextElementSibling;
      }

      if (nextEl && nextEl.tagName === "UL") {
        const items = Array.from(nextEl.querySelectorAll("li"));
        const count = items.length;
        totalArticles += count;
        const tagName = h.textContent.trim().replace(/^#+\s*/, "");
        const tagId = (h.id || "").toLowerCase();

        const headerDiv = document.createElement("div");
        headerDiv.className = "kzyc-tag-accordion-header";
        headerDiv.id = "sec-" + (tagId || tagName);
        headerDiv.innerHTML = `
          <div class="kzyc-tag-header-left">
            <span class="kzyc-tag-name-text">🏷️ ${tagName}</span>
            <span class="kzyc-tag-count-badge">${count} 篇</span>
          </div>
          <span class="kzyc-tag-arrow">▶</span>
        `;

        nextEl.className = "kzyc-tag-article-list";
        nextEl.style.display = "none"; // 默认全部折叠，页面极度清爽

        h.style.display = "none";
        h.parentNode.insertBefore(headerDiv, h);

        const section = {
          id: tagId,
          header: headerDiv,
          arrow: headerDiv.querySelector(".kzyc-tag-arrow"),
          list: nextEl,
          name: tagName.toLowerCase(),
          items: items.map((li) => ({
            el: li,
            text: li.textContent.trim().toLowerCase(),
          })),
          isOpen: false,
        };

        headerDiv.addEventListener("click", () => {
          section.isOpen = !section.isOpen;
          nextEl.style.display = section.isOpen ? "block" : "none";
          section.arrow.classList.toggle("open", section.isOpen);
        });

        tagSections.push(section);
      }
    });

    const statEl = document.getElementById("kzyc-tag-stat-info");
    if (statEl) {
      statEl.textContent = `共 ${tagSections.length} 个标签 · ${totalArticles} 篇归档`;
    }

    const searchInput = document.getElementById("kzyc-tag-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();

        tagSections.forEach((sec) => {
          if (!query) {
            sec.header.style.display = "flex";
            sec.list.style.display = sec.isOpen ? "block" : "none";
            sec.items.forEach((it) => (it.el.style.display = "list-item"));
            return;
          }

          const tagMatches = sec.name.includes(query);
          let matchingArticles = 0;

          sec.items.forEach((it) => {
            const match = tagMatches || it.text.includes(query);
            it.el.style.display = match ? "list-item" : "none";
            if (match) matchingArticles++;
          });

          if (matchingArticles > 0) {
            sec.header.style.display = "flex";
            sec.list.style.display = "block";
            sec.arrow.classList.add("open");
          } else {
            sec.header.style.display = "none";
            sec.list.style.display = "none";
          }
        });
      });
    }

    document.getElementById("kzyc-expand-all-btn")?.addEventListener("click", () => {
      tagSections.forEach((sec) => {
        sec.isOpen = true;
        sec.list.style.display = "block";
        sec.arrow.classList.add("open");
      });
    });

    document.getElementById("kzyc-collapse-all-btn")?.addEventListener("click", () => {
      tagSections.forEach((sec) => {
        sec.isOpen = false;
        sec.list.style.display = "none";
        sec.arrow.classList.remove("open");
      });
    });

    // 锚点联动：如点击页面顶部标签胶囊直达
    const openByHash = (hashStr) => {
      if (!hashStr) return;
      const cleanHash = decodeURIComponent(hashStr.replace("#", "")).toLowerCase();
      const targetSec = tagSections.find((s) => s.id === cleanHash || s.name === cleanHash);
      if (targetSec) {
        targetSec.isOpen = true;
        targetSec.list.style.display = "block";
        targetSec.arrow.classList.add("open");
        setTimeout(() => {
          targetSec.header.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    };

    if (location.hash) openByHash(location.hash);

    document.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => {
        openByHash(a.getAttribute("href"));
      });
    });
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(initTagsEnhancer);
  } else {
    document.addEventListener("DOMContentLoaded", initTagsEnhancer);
  }
})();
</script>