# Akash Dhanwate — identity system

## Creative foundation

Visual thesis: a midnight engineering poster, combining large editorial lettering with a precise, data-built AD monogram and slow cyan signals.

Content plan: introduce the identity, show real projects immediately, explain the student profile and learning direction, organize the technology inventory, then offer contribution history and contact links.

Motion thesis: trace the monogram once; move a few signals along its connections; use one quiet typing sequence. The contribution trail has a separate job: visualize an actual stored contribution graph.

The [first Pinterest reference](https://in.pinterest.com/pin/930626710524474169/) was inspected through its original pin image. It uses a black field, mint/cyan terminal lettering, sharp technical frames, densely arranged microcopy, and a large ASCII figure. The design borrows the contrast, precision, and data-built focal point. It does not reproduce the figure, hostile slogans, terminal contents, or layout.

The [second reference](https://in.pinterest.com/pin/928234173221708146/) was also inspected through its original image. It is a long dark GitHub profile with a large name banner, compact code-style introduction, a personal image, dense technology icons, violet analytics, and contact links. The useful ideas are the clear banner-to-content hierarchy and compact profile information. Akash's version prioritizes projects, readable Markdown, and fewer image dependencies.

The frontend design skill influenced the restrained composition: one visual anchor, a clear hierarchy, sparse accent use, and sections with distinct jobs. Website-specific effects were adapted to the SVG and Markdown features GitHub supports.

## Design tokens

| Role | Value | Use |
| --- | --- | --- |
| Midnight | `#080B14` | Self-contained SVG canvas |
| Secondary surface | `#101524` | Contact badges |
| Structural line | `#27324B` | Fine grid, circuits, dividers |
| Primary text | `#F2F4FC` | Identity and display lettering |
| Secondary text | `#A8B3CC` | Supporting labels |
| Violet | `#AE94FF` | AD lattice and restrained brand color |
| Cyan | `#79E8E0` | Signal points and small highlights |

The signature is the open, geometric AD monogram, expressed as a violet-to-cyan lattice. It appears as the hero focal point and returns at the footer. Gradients are limited to the monogram, signature lines, and quiet atmosphere. Glow uses one small Gaussian blur on an underlay; it never carries essential text. There are no neon paragraphs or competing brand palettes.

Display lettering is Space Grotesk Bold converted to vector paths by `opentype.js`. Its SIL Open Font License is included in `tools/fonts/OFL.txt`. Small labels use `ui-monospace, SFMono-Regular, Consolas, monospace`. README paragraphs and headings use GitHub's own typography. No external font request is needed when a visitor opens the profile.

Body spacing follows native Markdown paragraphs, H2 sections, and H3 project titles. Tables are reserved for genuinely parallel profile facts and technology groups. Contact badges share one local SVG treatment and a common display height. There is no badge service, tracking counter, or trophy deck.

## Assets and motion

| Asset | Behavior | Timing and fallback |
| --- | --- | --- |
| `hero.svg`, `hero-mobile.svg` | A complete static lattice is always present. A SMIL stroke trace draws once, while four small dots travel along circuit paths. | Trace: 3 seconds. Signals: 8–11 seconds. Static variants are selected through `<picture>` for reduced motion. |
| `focus.svg`, `focus-mobile.svg` | One clipped SVG typing sequence cycles through three short learning directions. | 6 seconds per message, 18 seconds total; stepped reveal then a reading pause. First message remains when animation is unsupported. Static variants remove SMIL. |
| `footer.svg` | A single small signal moves along a line beside the AD signature. | 12 seconds. A static alternative is selected for reduced motion. Mobile has larger, static lettering. |
| `output/github-snake*.svg` | An authentic previously generated contribution grid is traversed by the snake. Future snapshots come from Actions. | Generator-controlled CSS animation. Static variants force animation off. Theme-aware light/dark sources. |
| `assets/links/*.svg` | Four consistent local contact badges. | Static; meaningful alternative text and ordinary clickable links. |
| `assets/github-metrics.jpg` | Actual anonymous browser screenshot of the working Cloudflare demo homepage. | Static; capture provenance is in `docs/project-capture.json`. |

SVGs contain no JavaScript, external CSS, embedded web fonts, or remote images. `<picture>` selects static files explicitly because reduced-motion propagation into an SVG loaded through `<img>` can differ between browsers. Embedded media rules provide another fallback. The static contribution images preserve the original grid without playing the snake.

The midnight hero is intentionally the same in light and dark GitHub themes. All lettering has its own controlled background. The contribution trail changes palette with the viewer's color scheme. Mobile hero, focus, and footer compositions are separate assets, so display lettering remains legible without shrinking a desktop poster.

## Content decisions

- The source of truth is the latest published profile README plus the background supplied in this task. The local `feacture2` draft was inspected but contains extra claims that were not carried forward automatically.
- The degree is AI and Data Science as supplied by Akash. The old typing service's conflicting “B.Tech IT” wording was removed.
- Study year is omitted because “2rd Year” is ambiguous and current enrollment year has not been confirmed. No inferred promotion date is published.
- Course-completion, CGPA, daily-practice, ranking, achievement, and adoption claims are omitted where unverified.
- Freelance work is presented as an interest and contact direction, without inventing client or employment history.
- The stack is explicitly an inventory of practice and exposure. PyTorch is identified as learning.
- The featured work is the dashboard, the house-price model, and the notes app. A repository list and source files were checked before selection. Planned or nonexistent projects were excluded.
- The dashboard uses REST for most profile/repository requests and GraphQL for contributions. Its implemented export is JSON plus browser printing, not native CSV/PDF export.
- The Cloudflare demo returned HTTP 200. The Vercel homepage listed in repository metadata returned 404 and was excluded.
- The analytics section uses one stored contribution visualization plus a native GitHub link. No claimed streak, private contribution count, synthetic language percentage, or hard-coded statistics are shown.

## External services

| Service | Purpose | Visitor dependency |
| --- | --- | --- |
| GitHub | Repository, Markdown rendering, contributions, and Actions | The hosting platform itself |
| `Platane/snk/svg-only` (v3, pinned to a verified commit) | Regenerate the contribution snapshots in Actions | None at render time; committed images remain available |
| `actions/checkout` (v6, pinned to a verified commit) | Check out `main` for the asset refresh job | None at render time |
| GitHub REST/GraphQL | Repository/project verification and contribution generation | No browser request from the README assets |
| Cloudflare Workers demo | Clickable featured project | Optional; project description and repository link remain available |
| LinkedIn, X, and email | User-supplied contact destinations | Optional clicked links |
| npm / Fontsource | Development tooling and openly licensed font source | Build-time only; never requested by the README |

Pinterest is reference research only. Its images are not redistributed or hotlinked. The core identity works without third-party image, statistics, typing, or badge services.

## Maintenance

Run `npm ci` once, edit `tools/generate-assets.mjs`, then run `npm run assets` and `npm run validate`. Commit generated assets with their source. Edit facts in `README.md`; do not replace learning descriptions with expertise claims without supporting evidence.

The refresh workflow only changes files in `output/`. It does not rebuild the identity or require the development dependencies. Existing legacy SVGs in the repository root are retained to preserve unrelated history; the new README does not reference them.
