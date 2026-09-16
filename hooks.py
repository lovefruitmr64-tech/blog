import re
import yaml
from pathlib import Path

def on_config(config):
    """
    1. 读取 docs/admin/index.md 中的后台配置，将其注入全局模板变量
    """
    admin_file = Path(config["docs_dir"]) / "admin" / "index.md"
    categories_zh_to_en = {}
    categories_en_to_zh = {}
    nav_dropdowns = {}

    if admin_file.exists():
        content = admin_file.read_text(encoding="utf-8")
        chunks = content.split("---", 2)
        if len(chunks) >= 3:
            # 使用解包精确获取第2段 frontmatter 字符串
            _, frontmatter_text, _ = chunks
            admin_data = yaml.safe_load(frontmatter_text) or {}
            categories_zh_to_en = admin_data.get("site_categories", {})
            # 建立英文到中文的反向映射字典
            categories_en_to_zh = {v: k for k, v in categories_zh_to_en.items()}
            nav_dropdowns = admin_data.get("nav_dropdowns", {})

    # 注入到 config.extra 中供前端页面和 JS 使用
    config["extra"]["site_admin_config"] = {
        "categories_zh_to_en": categories_zh_to_en,
        "categories_en_to_zh": categories_en_to_zh,
        "nav_dropdowns": nav_dropdowns
    }

def on_page_read_source(page, config):
    """
    2. 文章中文分类转英文 URL：
       读取文章时，自动将文章顶部的中文分类替换为对应的英文 Slug
       使 Material for MkDocs 博客插件自动生成纯英文 URL (/blog/category/xxx/)
    """
    admin_config = config["extra"].get("site_admin_config", {})
    zh_to_en = admin_config.get("categories_zh_to_en", {})
    if not zh_to_en:
        return None

    file_path = Path(page.file.abs_src_path)
    if not file_path.exists() or not file_path.name.endswith(".md"):
        return None

    raw_text = file_path.read_text(encoding="utf-8")
    chunks = raw_text.split("---", 2)
    if len(chunks) >= 3:
        # 解包获取头部与正文
        _, frontmatter_text, body_text = chunks
        modified = False

        for zh, en in zh_to_en.items():
            pattern = rf"^(\s*-\s*){re.escape(zh)}\s*$"
            if re.search(pattern, frontmatter_text, flags=re.MULTILINE):
                frontmatter_text = re.sub(pattern, rf"\g<1>{en}", frontmatter_text, flags=re.MULTILINE)
                modified = True

        if modified:
            return f"---{frontmatter_text}---{body_text}"

    return None