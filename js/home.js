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