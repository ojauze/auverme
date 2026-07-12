#!/usr/bin/env python3
"""
Sync Instagram posts to Astro content collection.
Fetches new posts via Instagram Graph API and creates markdown + downloads images.

Usage:
  INSTAGRAM_ACCESS_TOKEN=<token> python3 scripts/sync-instagram.py
  INSTAGRAM_ACCESS_TOKEN=<token> python3 scripts/sync-instagram.py --limit 5
"""

import os
import re
import sys
import json
import time
import argparse
import requests
from datetime import datetime, timezone
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

INSTAGRAM_USER_ID = "28119297107674296"
API_VERSION = "v21.0"
BASE_URL = f"https://graph.instagram.com/{API_VERSION}"

CONTENT_DIR = Path(__file__).parent.parent / "src" / "content" / "instagram"
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images" / "instagram"

# ── Helpers ───────────────────────────────────────────────────────────────────

def shortcode_from_permalink(permalink: str) -> str:
    m = re.search(r"/p/([^/]+)/", permalink)
    return m.group(1) if m else permalink.rstrip("/").split("/")[-1]

def sanitize_description(text: str) -> str:
    if not text:
        return ""
    # Truncate, escape quotes for YAML
    text = text[:400].strip()
    text = text.replace('"', '\\"').replace("\n", " ")
    return text

def get_first_image_url(post: dict, token: str):
    media_type = post.get("media_type", "")
    if media_type == "IMAGE":
        return post.get("media_url")
    if media_type == "VIDEO":
        # thumbnail_url is a proper JPEG still frame
        return post.get("thumbnail_url") or post.get("media_url")
    if media_type == "CAROUSEL_ALBUM":
        # Fetch first child
        media_id = post["id"]
        r = requests.get(
            f"{BASE_URL}/{media_id}/children",
            params={"fields": "id,media_url,thumbnail_url,media_type", "access_token": token},
            timeout=15,
        )
        r.raise_for_status()
        children = r.json().get("data", [])
        for child in children:
            ctype = child.get("media_type")
            if ctype == "IMAGE":
                return child.get("media_url")
            if ctype == "VIDEO":
                return child.get("thumbnail_url") or child.get("media_url")
    return None

def download_image(url: str, dest: Path) -> bool:
    try:
        r = requests.get(url, timeout=30, stream=True)
        r.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"  ⚠️  Image download failed: {e}")
        return False

def write_markdown(shortcode: str, post: dict, has_image: bool) -> None:
    permalink = post.get("permalink", f"https://www.instagram.com/p/{shortcode}/")
    date_raw = post.get("timestamp", "")
    date = date_raw[:10] if date_raw else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    description = sanitize_description(post.get("caption", ""))
    image_path = f"/images/instagram/{shortcode}.jpg" if has_image else "/images/image-placeholder.png"

    md = f"""---
date: {date}
image: {image_path}
link: {permalink}
description: "{description}"
draft: false
---
"""
    dest = CONTENT_DIR / f"{shortcode}.md"
    dest.write_text(md, encoding="utf-8")
    print(f"  ✅ {dest.name}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=20, help="Max posts to fetch (default 20)")
    parser.add_argument("--dry-run", action="store_true", help="Print actions without writing files")
    args = parser.parse_args()

    token = os.environ.get("INSTAGRAM_ACCESS_TOKEN")
    if not token:
        print("❌ INSTAGRAM_ACCESS_TOKEN environment variable not set.")
        sys.exit(1)

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Existing shortcodes (already synced)
    existing = {p.stem for p in CONTENT_DIR.glob("*.md")}

    print(f"📥 Fetching up to {args.limit} posts for user {INSTAGRAM_USER_ID}…")

    fields = "id,caption,media_url,thumbnail_url,timestamp,permalink,media_type"
    r = requests.get(
        f"{BASE_URL}/me/media",
        params={"fields": fields, "access_token": token, "limit": args.limit},
        timeout=15,
    )
    r.raise_for_status()
    posts = r.json().get("data", [])
    print(f"   Found {len(posts)} posts. {len(existing)} already synced.")

    new_count = 0
    for post in posts:
        permalink = post.get("permalink", "")
        shortcode = shortcode_from_permalink(permalink)

        if shortcode in existing:
            continue

        print(f"\n→ {shortcode}  ({post.get('media_type', '?')})")

        if args.dry_run:
            print(f"  [dry-run] would create {shortcode}.md + download image")
            continue

        # Download image
        img_url = get_first_image_url(post, token)
        has_image = False
        if img_url:
            dest = IMAGES_DIR / f"{shortcode}.jpg"
            has_image = download_image(img_url, dest)
        else:
            print("  ⚠️  No image URL found")

        write_markdown(shortcode, post, has_image)
        new_count += 1

        # Polite delay to avoid rate limiting
        time.sleep(0.5)

    if not args.dry_run:
        print(f"\n🎉 Done — {new_count} new post(s) synced.")
    else:
        print(f"\n[dry-run] {sum(1 for p in posts if shortcode_from_permalink(p.get('permalink','')) not in existing)} post(s) would be synced.")

if __name__ == "__main__":
    main()
