document.addEventListener("DOMContentLoaded", function () {
    function openNavLinksInNewTab() {
        const navLinks = document.querySelectorAll(
            ".md-tabs__link, .md-nav__link"
        );

        navLinks.forEach(function (link) {
            const text = link.textContent.trim();

            const targetNames = [
                "首页",
                "最新发布",
                "电脑软件",
                "安卓软件",
                "免费字体",
                "操作系统",
                "视频教程",
                "其他",
                "打赏"
            ];

            if (targetNames.includes(text)) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
            }
        });
    }

    openNavLinksInNewTab();

    // 兼容 Material 的即时导航
    document$.subscribe(function () {
        openNavLinksInNewTab();
    });
});