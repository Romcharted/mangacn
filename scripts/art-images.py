"""Builds the showcase art from the five source images in site/art-source/.

Run by hand when a source or a crop changes:  python3 scripts/art-images.py
Writes site/public/art/<name>-<width>.webp (several widths each, never wider than the source)
and site/src/mapless-art.json (sizes, for width/height and srcset). The images are already inked:
they are only cropped and resized, never toned.
"""

import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "site", "art-source")
OUT = os.path.join(ROOT, "site", "public", "art")
MANIFEST = os.path.join(ROOT, "site", "src", "mapless-art.json")
WIDTHS = (240, 480, 960)
QUALITY = 78

# name: (source, (left, top, right, bottom) in source pixels, or None for the whole image)
IMAGES = {
    # the five sources, whole
    "suzu-portrait": ("suzu-portrait", None),
    "cover-1": ("cover-1", None),
    "cover-2": ("cover-2", None),
    "page-1-bridge": ("page-1-bridge", None),
    "page-2-lighthouse": ("page-2-lighthouse", None),
    # crops from the lighthouse page
    "lighthouse-night": ("page-2-lighthouse", (290, 20, 770, 372)),
    "suzu-drawing": ("page-2-lighthouse", (52, 398, 376, 795)),
    "kuro-sleeping": ("page-2-lighthouse", (392, 440, 605, 790)),
    "suzu-profile": ("page-2-lighthouse", (190, 850, 500, 1160)),
    "cover-3-teaser": ("page-2-lighthouse", (585, 812, 864, 1216)),
    # crops from the bridge page
    "bridge-far": ("page-1-bridge", (0, 40, 864, 372)),
    "spear-clash": ("page-1-bridge", (250, 765, 621, 1140)),
    "ink-drop": ("page-1-bridge", (640, 993, 808, 1161)),
    "suzu-shock": ("page-1-bridge", (540, 405, 700, 565)),
    "eraser-panel": ("page-1-bridge", (58, 402, 420, 725)),
    # crops from the portrait and the covers
    "map": ("suzu-portrait", (150, 740, 750, 1150)),
    "suzu-face": ("suzu-portrait", (240, 320, 660, 740)),
    "suzu-full": ("cover-1", (400, 300, 848, 960)),
    "kuro": ("cover-1", (370, 395, 520, 545)),
    "eraser-full": ("cover-2", (220, 300, 640, 1060)),
    "eraser-helmet": ("cover-2", (320, 300, 550, 530)),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith(".webp"):
            os.remove(os.path.join(OUT, f))
    manifest = {}
    for name, (source, box) in IMAGES.items():
        im = Image.open(os.path.join(SRC, source + ".webp")).convert("RGB")
        if box:
            im = im.crop(box)
        w, h = im.size
        widths = sorted({min(x, w) for x in WIDTHS})
        for x in widths:
            y = round(h * x / w)
            im.resize((x, y), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{x}.webp"), "WEBP", quality=QUALITY, method=6)
        manifest[name] = {"width": w, "height": h, "widths": widths}
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print(f"{len(manifest)} images, {len(os.listdir(OUT))} files, {total // 1024} KB")


if __name__ == "__main__":
    main()
