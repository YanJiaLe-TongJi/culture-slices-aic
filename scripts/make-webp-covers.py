"""Convert the self-rendered scene covers into lightweight WebP copies for the homepage.

The PNG files in public/images stay the source of truth (README and capture scripts use them).
Run after re-capturing covers:  python scripts/make-webp-covers.py
Requires Pillow with WebP support.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / 'public' / 'images'
out = root / 'webp'
out.mkdir(exist_ok=True)
total_png = total_webp = 0
for png in sorted(root.glob('*.png')):
    target = out / (png.stem + '.webp')
    Image.open(png).convert('RGB').save(target, 'WEBP', quality=82, method=6)
    total_png += png.stat().st_size
    total_webp += target.stat().st_size
    print(f'{png.name:28s} -> webp/{target.name} ({target.stat().st_size // 1024} KB)')
print(f'PNG {total_png // 1024} KB -> WebP {total_webp // 1024} KB')
