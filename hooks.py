import functools
import json
from pathlib import Path
import ssl
import urllib.request
import pymdownx.slugs
import yaml

# 默认内置基础分类映射（兜底保障）
DEFAULT_CATEGORIES = {
    "电脑软件": "software",
    "安卓软件": "android",
    "免费字体": "fonts",
    "操作系统": "os",
    "视频教程": "tutorials",
    "其他专区": "others",
}

_SITE_NAV_CACHE = None


def fetch_site_categories(docs_dir="docs"):
  """获取分类数据：优先拉取云端 Worker，失败回退到本地 admin/index.md，再回退到默认字典"""
  global _SITE_NAV_CACHE
  if _SITE_NAV_CACHE is not None:
    return _SITE_NAV_CACHE

  data = {}
  api_url = "https://auth.kzyc.de5.net/api/site-nav"

  # 1. 尝试从 Cloudflare Worker 接口拉取
  try:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(
        api_url, headers={"User-Agent": "MkDocs-Hook-Builder"}
    )
    with urllib.request.urlopen(req, timeout=3, context=ctx) as resp:
      if resp.status == 200:
        res = json.loads(resp.read().decode("utf-8"))
        if res.get("success") and res.get("data"):
          data = res["data"]
  except Exception:
    pass

  # 2. 回退读取本地 docs/admin/index.md
  if not data or not data.get("site_categories"):
    try:
      admin_file = Path(docs_dir) / "admin" / "index.md"
      if admin_file.exists():
        content = admin_file.read_text(encoding="utf-8")
        chunks = content.split("---", 2)
        if len(chunks) >= 3:
          admin_data = yaml.safe_load(chunks) or {}
          data = {
              "site_categories": admin_data.get("site_categories", {}),
              "nav_dropdowns": admin_data.get("nav_dropdowns", {}),
          }
    except Exception:
      pass

  # 3. 合并默认字典，确保核心分类绝不丢失
  merged_categories = dict(DEFAULT_CATEGORIES)
  if data and data.get("site_categories"):
    merged_categories.update(data["site_categories"])

  _SITE_NAV_CACHE = {
      "site_categories": merged_categories,
      "nav_dropdowns": (data or {}).get("nav_dropdowns", {}),
  }
  return _SITE_NAV_CACHE


def _category_slugify_fn(text, sep="-", **kwargs):
  """将文章中文分类转换为英文 slug"""
  nav_data = fetch_site_categories()
  categories_map = nav_data.get("site_categories", {})

  # 命中映射表直接转为英文别名
  if text in categories_map:
    return categories_map[text]

  # 未配置的分类使用系统默认 unicode 转换
  return pymdownx.slugs._uslugify(text, sep, **kwargs)


def custom_slugify(**kwargs):
  """供 mkdocs.yml 中 categories_slugify 调用的工厂函数"""
  return functools.partial(_category_slugify_fn, **kwargs)


def on_config(config):
  """注入前端模板变量"""
  docs_dir = config.get("docs_dir", "docs")
  site_nav = fetch_site_categories(docs_dir)

  categories_zh_to_en = site_nav.get("site_categories", {})
  categories_en_to_zh = {v: k for k, v in categories_zh_to_en.items()}
  nav_dropdowns = site_nav.get("nav_dropdowns", {})

  config.setdefault("extra", {})
  config["extra"]["site_admin_config"] = {
      "categories_zh_to_en": categories_zh_to_en,
      "categories_en_to_zh": categories_en_to_zh,
      "nav_dropdowns": nav_dropdowns,
  }

  return config