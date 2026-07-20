# Brand logos

Derived from the source lockup at `C:\Projects\Docs\timo.png` (1448×1086, opaque
RGB, white background). The source is **raster** — if a vector original exists,
prefer it and regenerate these.

| File                   | Size    | Weight | Use                                              |
| ---------------------- | ------- | ------ | ------------------------------------------------ |
| `timo-logo.png`        | 943×818 | 333 KB | Full lockup — **light backgrounds only**         |
| `timo-logo-dark.png`   | 943×818 | 340 KB | Full lockup, wordmark lightened for dark themes  |
| `timo-mark.png`        | 493×480 | 215 KB | Icon tile at full size — safe on any background  |
| `timo-mark-96.png`     | 96×96   | 15 KB  | **Nav/header use** — covers up to 3× DPI at 28px |
| `apple-touch-icon.png` | 180×180 | 43 KB  | iOS home screen                                  |
| `favicon-32.png`       | 32×32   | 2.8 KB | Browser tab                                      |

Prefer `timo-mark-96.png` in UI chrome. The full-size `timo-mark.png` is 14×
heavier and pointless behind a 28px box.

## How the background was removed

Two strategies, because one does not fit both regions of the lockup:

- **Icon tile** — masked geometrically as a rounded rect at (478,141)–(971,621),
  radius 75. A flood fill leaks _into_ the tile through the arrow's white
  stroke, which touches the tile edge, silently turning the chart, circle, and
  arrow transparent. That failure is invisible on a white page and only shows up
  on a dark one.
- **Wordmark / tagline** — flood-filled inward from the border. The glyphs are
  dark green on white with no leak path, and the counter of the "O" is enclosed
  by the ring, so the gem survives.

`timo-logo-dark.png` inverts lightness on the wordmark region only, leaving the
tile untouched.

## Known limits

The source is raster, so these do not scale cleanly beyond their native size.
The arrow's white tip reads as a notch cut into the tile's right edge — in the
original it is white-on-white and therefore unrecoverable as artwork.
