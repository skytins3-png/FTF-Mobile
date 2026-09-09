from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
COMICS = ROOT / "assets" / "comics"
TARGET = 30
SONGS = range(1, 9)
SCENE_RE = re.compile(r"^(\d{2})\.svg$")


def rendered_scenes(song_no: int):
    folder = COMICS / f"FTF-{song_no:02d}"
    if not folder.is_dir():
        raise SystemExit(f"missing comic folder: {folder.relative_to(ROOT)}")
    nums = []
    for path in folder.iterdir():
        m = SCENE_RE.match(path.name)
        if m:
            nums.append(int(m.group(1)))
    return sorted(nums)


for song_no in SONGS:
    scenes = rendered_scenes(song_no)
    if len(scenes) != len(set(scenes)):
        raise SystemExit(f"FTF-{song_no:02d}: duplicate rendered scene numbers")

    # Rendered scenes must stay in strict story order. A later scene may not exist
    # while an earlier numbered scene is missing, because that can break song mapping.
    expected_prefix = list(range(1, len(scenes) + 1))
    if scenes != expected_prefix:
        raise SystemExit(
            f"FTF-{song_no:02d}: non-sequential rendered scenes: {scenes}; "
            f"expected contiguous 01..{len(scenes):02d}"
        )

    if len(scenes) > TARGET:
        raise SystemExit(
            f"FTF-{song_no:02d}: {len(scenes)} rendered scenes exceeds current {TARGET}-scene workflow target"
        )

    next_missing = len(scenes) + 1 if len(scenes) < TARGET else None
    if next_missing:
        print(f"FTF-{song_no:02d}: {len(scenes)}/{TARGET} rendered; next missing {next_missing:02d}.svg")
    else:
        print(f"FTF-{song_no:02d}: {TARGET}/{TARGET} rendered")

print("Comic progress check passed: only real numbered SVG renders count; scene JSON/planning files are not treated as finished art.")
