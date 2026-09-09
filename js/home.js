// 使用 Material for MkDocs 的 document$ 观察者
// 确保在 instant loading（即时加载/返回首页）时重新绑定新生成的 DOM 节点
if (typeof document$ !== "undefined") {
  document$.subscribe(function() {
    initHomeBanner();
  });
} else {
  document.addEventListener("DOMContentLoaded", initHomeBanner);
}

// 保存当前全局定时器引用，防止重复创建
let bannerTimer = null;

function initHomeBanner() {
  const banner = document.querySelector(".home-banner");
  if (!banner) return; // 当前页面不是首页则退出

  // 清除可能存在的旧定时器
  if (bannerTimer) {
    clearInterval(bannerTimer);
    bannerTimer = null;
  }

  const slides = banner.querySelectorAll(".banner-item");
  const dots = banner.querySelectorAll(".dot");
  const prevBtn = banner.querySelector(".banner-prev");
  const nextBtn = banner.querySelector(".banner-next");

  if (!slides.length) return;

  let currentIndex = 0;

  // 切换幻灯片函数
  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // 启动与重置自动轮播
  function startAutoPlay() {
    if (bannerTimer) clearInterval(bannerTimer);
    bannerTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  // 1. 指示小圆点点击
  dots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      showSlide(index);
      resetAutoPlay();
    });
  });

  // 2. 左右箭头按钮点击
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  // 3. 鼠标悬停时暂停自动播放，移出恢复
  banner.addEventListener("mouseenter", () => {
    if (bannerTimer) clearInterval(bannerTimer);
  });
  banner.addEventListener("mouseleave", () => {
    startAutoPlay();
  });

  // 4. 统一的手势/鼠标拖拽滑动支持 (Pointer Events)
  let startX = 0;
  let isDragging = false;
  let hasMoved = false;

  banner.addEventListener("pointerdown", (e) => {
    // 忽略点击按钮和指示点
    if (e.target.closest(".banner-btn") || e.target.closest(".dot")) return;
    startX = e.clientX;
    isDragging = true;
    hasMoved = false;
  });

  banner.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    if (Math.abs(e.clientX - startX) > 10) {
      hasMoved = true; // 判定为滑动拖拽而非单纯点击
    }
  });

  banner.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    
    // 滑动距离超过 50px 触发切页
    if (diffX < -50) {
      showSlide(currentIndex + 1);
      resetAutoPlay();
    } else if (diffX > 50) {
      showSlide(currentIndex - 1);
      resetAutoPlay();
    }
  });

  banner.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  // 阻止滑动拖拽时触发 a 标签的点击跳转
  banner.querySelectorAll(".banner-item").forEach(item => {
    item.addEventListener("click", (e) => {
      if (hasMoved) {
        e.preventDefault();
      }
    });
  });

  // 开启自动播放
  startAutoPlay();
}


// 移动端搜索联动：打开搜索时隐藏轮播控件并暂停轮播
(function () {
  function bindSearchWithBanner() {
    const searchToggle = document.getElementById("__search");
    if (!searchToggle) return;

    searchToggle.addEventListener("change", function () {
      const isSearchOpen = this.checked;
      const prevBtn = document.querySelector(".banner-prev");
      const nextBtn = document.querySelector(".banner-next");
      const dotsWrap = document.querySelector(".banner-dots");

      if (prevBtn) prevBtn.style.display = isSearchOpen ? "none" : "";
      if (nextBtn) nextBtn.style.display = isSearchOpen ? "none" : "";
      if (dotsWrap) dotsWrap.style.display = isSearchOpen ? "none" : "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindSearchWithBanner);
  } else {
    bindSearchWithBanner();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(bindSearchWithBanner);
  }
})();
// 移动端搜索联动：打开搜索时隐藏轮播控件并暂停轮播结束



// ==========================================
// Material for MkDocs 博客底部分页增强：支持指定页码一键跳转
// ==========================================
function enhanceMkDocsBlogPagination() {
  const pag = document.querySelector(".md-pagination");
  if (!pag || pag.getAttribute("data-enhanced") === "true") return;
  pag.setAttribute("data-enhanced", "true");

  // 解析当前页面属于最新发布还是分类页
  const pathMatch = location.pathname.match(/(.*\/)page\/(\d+)\/?/);
  let basePath = "";
  let currentPage = 1;

  if (pathMatch) {
    basePath = pathMatch;
    currentPage = parseInt(pathMatch[2], 10) || 1;
  } else {
    basePath = location.pathname.replace(/\/?$/, "/");
  }

  // 动态创建跳转输入组件
  const jumpWrap = document.createElement("span");
  jumpWrap.className = "kzyc-blog-page-jump";
  jumpWrap.style.cssText = "display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; font-size: 0.8rem;";
  jumpWrap.innerHTML = `
    <span style="opacity: 0.75;">到第</span>
    <input type="number" id="kzyc-blog-jump-val" min="1" value="${currentPage}" style="width: 44px; padding: 3px 5px; text-align: center; border-radius: 6px; border: 1px solid rgba(127,127,127,0.3); background: transparent; color: inherit; font-size: 0.78rem;" />
    <span style="opacity: 0.75;">页</span>
    <button type="button" id="kzyc-blog-jump-btn" style="padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(37,99,235,0.3); background: rgba(37,99,235,0.1); color: #2563eb; cursor: pointer; font-size: 0.78rem; font-weight: 600;">跳转</button>
  `;

  pag.appendChild(jumpWrap);

  const doJump = () => {
    const input = document.getElementById("kzyc-blog-jump-val");
    const targetPage = parseInt(input.value, 10);
    if (isNaN(targetPage) || targetPage < 1) return;

    // MkDocs 规则：第 1 页为目录根路径，第 2 页及以上为 /page/N/
    if (targetPage === 1) {
      window.location.href = basePath;
    } else {
      window.location.href = `${basePath}page/${targetPage}/`;
    }
  };

  document.getElementById("kzyc-blog-jump-btn")?.addEventListener("click", doJump);
  document.getElementById("kzyc-blog-jump-val")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doJump();
  });
}

// 页面加载或切换时自动执行
if (typeof document$ !== "undefined") {
  document$.subscribe(enhanceMkDocsBlogPagination);
} else {
  document.addEventListener("DOMContentLoaded", enhanceMkDocsBlogPagination);
}

// ==========================================
// Material for MkDocs 博客底部分页增强：支持指定页码一键跳转结束
// ==========================================


// =========================================================
// 博客卡片优化：分类点击跳转 + "查看文章"紧凑浅色描边 + 彻底杜绝换页闪烁
// =========================================================
function enhanceBlogCardsAndCategories() {
  // 1. 注入自适应明暗模式的浅色描边与无闪烁样式
  if (!document.getElementById("kzyc-blog-card-custom-styles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "kzyc-blog-card-custom-styles";
    styleEl.textContent = `
      /* 1. 彻底消除翻页按钮与全部控件的原生聚焦黑框与移动端触控闪斑 */
      .md-pagination,
      .md-pagination *,
      .md-pagination a,
      .md-pagination a:focus,
      .md-pagination a:active,
      .md-pagination a:focus-visible,
      .kzyc-blog-page-jump *,
      .kzyc-page-btn {
        outline: none !important;
        outline-style: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      /* 2. 分类徽标：可点击、悬停变色 */
      .kzyc-category-link,
      .md-post__category,
      .md-post__categories a {
        cursor: pointer !important;
        pointer-events: auto !important;
        position: relative !important;
        z-index: 5 !important;
        text-decoration: none !important;
        display: inline-block !important;
        outline: none !important;
        transition: color 0.15s ease, background-color 0.15s ease !important;
      }
      .kzyc-category-link:hover,
      .md-post__category:hover,
      .md-post__categories a:hover {
        background: rgba(37, 99, 235, 0.15) !important;
        color: #2563eb !important;
      }
      [data-md-color-scheme="slate"] .kzyc-category-link:hover,
      [data-md-color-scheme="slate"] .md-post__category:hover,
      [data-md-color-scheme="slate"] .md-post__categories a:hover {
        background: rgba(96, 165, 250, 0.22) !important;
        color: #60a5fa !important;
      }

      /* 3. 查看文章按钮：常态绝对禁用 transition 动画，杜绝切页时边框从无到有的插值跳动！ */
      a.kzyc-view-article-btn,
      .md-post__action a {
        border: 1px solid rgba(127, 127, 127, 0.24) !important;
        width: auto !important;
        max-width: fit-content !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        text-decoration: none !important;
        outline: none !important;
        box-shadow: none !important;
        transition: none !important; /* 核心关键：初始加载/换页时无任何动画过度，瞬间定型，彻底杜绝变粗变黑！ */
      }

      /* 仅在鼠标主动 hover 悬停时才启用柔和颜色过渡 */
      a.kzyc-view-article-btn:hover,
      .md-post__action a:hover {
        border-color: #2563eb !important;
        color: #2563eb !important;
        background-color: rgba(37, 99, 235, 0.05) !important;
        transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease !important;
      }

      /* 点击、按压、聚焦时坚决维持原浅色边框，不产生任何原生变粗黑线 */
      a.kzyc-view-article-btn:focus,
      a.kzyc-view-article-btn:active,
      a.kzyc-view-article-btn:focus-visible,
      .md-post__action a:focus,
      .md-post__action a:active,
      .md-post__action a:focus-visible {
        outline: none !important;
        outline-style: none !important;
        box-shadow: none !important;
        border: 1px solid rgba(127, 127, 127, 0.24) !important;
      }

      /* 黑夜 (Slate) 模式自适应 */
      [data-md-color-scheme="slate"] a.kzyc-view-article-btn,
      [data-md-color-scheme="slate"] .md-post__action a {
        border: 1px solid rgba(255, 255, 255, 0.24) !important;
        transition: none !important;
        outline: none !important;
      }
      [data-md-color-scheme="slate"] a.kzyc-view-article-btn:hover,
      [data-md-color-scheme="slate"] .md-post__action a:hover {
        border-color: #60a5fa !important;
        color: #60a5fa !important;
        background-color: rgba(96, 165, 250, 0.1) !important;
        transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease !important;
      }
      [data-md-color-scheme="slate"] a.kzyc-view-article-btn:focus,
      [data-md-color-scheme="slate"] a.kzyc-view-article-btn:active,
      [data-md-color-scheme="slate"] a.kzyc-view-article-btn:focus-visible,
      [data-md-color-scheme="slate"] .md-post__action a:focus,
      [data-md-color-scheme="slate"] .md-post__action a:active,
      [data-md-color-scheme="slate"] .md-post__action a:focus-visible {
        outline: none !important;
        outline-style: none !important;
        box-shadow: none !important;
        border: 1px solid rgba(255, 255, 255, 0.24) !important;
      }

      /* 手机移动端 (<600px) 紧凑适配 */
      @media (max-width: 600px) {
        a.kzyc-view-article-btn,
        .md-post__action a {
          padding: 3px 12px !important;
          font-size: 0.75rem !important;
          border-radius: 9999px !important;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  // 2. 匹配 <a> 按钮
  document.querySelectorAll("a").forEach((el) => {
    const text = el.textContent.trim();
    if (text === "查看文章" || text.startsWith("查看文章") || text === "阅读全文") {
      el.classList.add("kzyc-view-article-btn");
    }
  });

  // 3. 为文章卡片上的分类徽标绑定点击跳转
  document.querySelectorAll(".md-post, .md-post--excerpt, article, [class*='post']").forEach((post) => {
    post.querySelectorAll(".md-post__category, .md-post__categories a, [class*='category']").forEach((el) => {
      if (el.children.length > 2) return;
      const catText = el.textContent.trim();
      if (!catText || catText.length > 20 || /\d{4}-\d{2}-\d{2}/.test(catText)) return;

      const slug = catText.toLowerCase().replace(/\s+/g, "-");
      const targetUrl = `/blog/category/${slug}/`;

      el.classList.add("kzyc-category-link");
      el.setAttribute("title", `点击进入 [${catText}] 分类专区`);

      el.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = targetUrl;
      };
    });
  });
}

// 立即运行 + 页面切换监听
enhanceBlogCardsAndCategories();

if (typeof document$ !== "undefined") {
  document$.subscribe(enhanceBlogCardsAndCategories);
} else {
  document.addEventListener("DOMContentLoaded", enhanceBlogCardsAndCategories);
}
// =========================================================
// 博客卡片优化：分类点击跳转 + "查看文章"紧凑浅色描边 + 彻底杜绝换页闪烁结束
// =========================================================