---
title: 站长管理后台
hide:
  - toc
  - navigation

site_categories:
  安卓软件: android
  免费字体: fonts
  操作系统: os
  视频教程: tutorials
  其他专区: others
  CORELDRAW: coreldraw
  电脑软件: software
nav_dropdowns:
  电脑软件:
    - name: 全部软件
      url: /blog/category/software/
    - name: 图形设计
      url: /blog/category/software/#design
    - name: 办公应用
      url: /blog/category/software/#office
    - name: 系统工具
      url: /blog/category/software/#tools
  安卓软件:
    - name: 全部应用
      url: /blog/category/android/
    - name: 常用工具
      url: /blog/category/android/#tools
  免费字体:
    - name: 全部字体
      url: /blog/category/fonts/
  操作系统:
    - name: Windows
      url: /blog/category/os/#windows
    - name: macOS
      url: /blog/category/os/#macos
    - name: Linux
      url: /blog/category/os/#linux
  视频教程:
    - name: 全部教程
      url: /blog/category/tutorials/
  其他专区:
    - name: 全部内容
      url: /blog/category/others/
  友情链接:
    - name: 其他专区
      url: /blog/category/others/
    - name: CORELDRAW
      url: /blog/category/coreldraw/

---

<!-- 引入后台专属样式表 -->
<link rel="stylesheet" href="admin.css">

<!-- 后台系统挂载节点 -->
<div id="kzyc-admin-mount">
  <div style="padding: 40px 0; text-align: center; opacity: 0.6;" id="kzyc-admin-loading-tip">
    ⏳ 正在验证站长身份，请稍候...
  </div>
</div>

<!-- 模块化引入功能脚本（按需加载、各自独立维护） -->
<script src="core.js"></script>
<script src="orders.js"></script>
<script src="resources.js"></script>
<script src="banners.js"></script>
<script src="users.js"></script>
<script src="comments.js"></script>
<script src="vip-config.js"></script>
<script src="words.js"></script>
<script src="categories.js"></script>

