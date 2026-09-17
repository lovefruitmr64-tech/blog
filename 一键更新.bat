@echo off
chcp 65001 >nul
echo 正在准备更新博客...
set PYTHONPATH=.
git add .
git commit -m "更新网站内容"
git push origin main
python -m mkdocs gh-deploy --clean --force
echo ====================================
echo 博客已成功推送到 GitHub 并完成线上发布！
echo ====================================
pause