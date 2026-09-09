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