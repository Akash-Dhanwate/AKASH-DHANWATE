# Validation report

Validation date: 18 October 2026. Scope: the completed redesign in the `design/profile-next` worktree. No remote branch, profile README, or workflow run was published during implementation.

## Completed checks

| Check | Result and evidence |
| --- | --- |
| Existing content and repository | Inspected the local checkout, its staged README edit, current public README, public repository metadata, and project source. The redesign starts from published `main` commit `d3b7033` in a separate worktree. |
| References | Retrieved and visually inspected both Pinterest pin images. The web reader could not open Pinterest, but direct page metadata and original image downloads succeeded. No reference image is redistributed. |
| Markdown structure | One H1; ordered H2 sections and H3 project titles; no skipped heading levels. Both tables render. All five navigation targets resolve in the preview. |
| Supported HTML | Only supported image/picture/source/link/paragraph markup is authored. No scripts, custom README CSS, iframe, canvas, inline SVG, or browser event handlers. |
| GitHub rendering | GitHub's actual `POST /markdown` endpoint returned HTTP 200 for the final source. It preserved 4 pictures, 11 responsive/theme/reduced-motion source elements, 9 images, and 2 tables. Evidence and a SHA-256 of the checked README are in `preview-artifacts/github-render-report.json`. |
| Local paths | All 40 detected image, source, navigation, contact, project, and provenance references were checked. Every local target exists. All profile image assets are local. |
| SVG syntax | All 19 referenced SVG files passed `xmllint --noout`. ViewBoxes, titles, gradient/clip references, animation keyframe lengths, source-free image content, motion declarations, and size budgets passed automated checks. |
| Font consistency and licensing | Display lettering is converted into paths. The licensed font comes from the locked development dependency. SIL OFL 1.1 is included. No profile visitor needs a font download. |
| Actual project image | Anonymous browser capture of the Cloudflare demo, HTTP 200, title “GitHub Metrics.” The image is a real homepage screenshot. Provenance: `docs/project-capture.json`. |
| GitHub username | `Akash-Dhanwate` is used consistently for public links, source data, and workflow generation. The verified repository name is `AKASH-DHANWATE`; default branch is `main`. |
| Project links | All three featured repositories were found in the authenticated-free public repository listing and inspected through their README/source. No planned project is presented as shipped. |
| Social links | GitHub, LinkedIn, X, and the email match the values supplied by Akash. URL and mailto format checked. No email or social message was sent. |
| Desktop | Chrome, 1440 × 1080, dark and light themes: images decode, anchors resolve, and no horizontal overflow. |
| Mobile | Chrome, 390 × 844: mobile hero/focus/footer selected; contact badges wrap; tables and text stay within the viewport. |
| Narrow mobile | Chrome, 320 × 740, light and reduced motion: all images decode; no horizontal page overflow. |
| Motion | Hero screenshots taken at different times differ with motion enabled. The three typing states and growing reveal mask were checked against the SVG's actual animation timeline. |
| Reduced motion | Dedicated static assets are selected by `<picture>`. Repeated hero screenshots are identical. The SVG's direct reduced-motion styling was also checked. The contribution static files disable CSS animation. |
| Light/dark behavior | The self-contained midnight identity remains readable against both page themes. Contribution images switch between light and dark palettes. The same checks cover static variants. |
| Contribution assets | Real previously generated SVGs were retrieved from the existing public `output` branch. Both local theme variants and static alternatives exist. Provenance explicitly says that the original generation date is unknown. |
| Contribution workflow | YAML parsed; correct repository/username/default branch; manual and daily schedule triggers; both expected output filenames; static variants and provenance committed together; write permission limited to the refresh job. No force-push or custom secret is required. |
| Action dependencies | Current published v3 generator and v6 checkout references were resolved through GitHub's API and pinned to their verified full commit IDs. The generator's published action inputs were checked. |
| External image services | None. No badge endpoint, stats-card server, typing service, view counter, or remote font can break the identity. |
| Worktree hygiene | `git diff --check` passed. The original checkout's staged README edit was preserved. Existing root-level legacy SVGs were retained; the redesigned asset directory contains only required new visuals. |

The browser evidence is in `preview-artifacts/browser-report.json`, alongside desktop, light, mobile, and reduced-motion screenshots. Run `npm run validate`, `npm run review`, and `npm run github-preview` to reproduce the applicable checks.

## Verified project facts

**GitHub Metrics.** The [published repository](https://github.com/Akash-Dhanwate/github-metrics) and source confirm Next.js/React/TypeScript, FastAPI, developer comparison, repository/profile analytics, contribution history, and request caching. The implementation uses REST for profile/repository data and GraphQL for contributions. [`ExportStats.tsx`](https://github.com/Akash-Dhanwate/github-metrics/blob/main/frontend/components/dashboard/ExportStats.tsx) implements a JSON download and `window.print()`. Native CSV/PDF export was not carried forward from the older README. The Cloudflare URL returned HTTP 200 and rendered in Chrome. The Vercel URL listed in repository metadata returned 404 and was excluded.

**House Price Prediction.** The [repository](https://github.com/Akash-Dhanwate/HousePrice-Prediction-Model), file tree, and [`src/train.py`](https://github.com/Akash-Dhanwate/HousePrice-Prediction-Model/blob/main/src/train.py) confirm a Random Forest model and preprocessing/train/predict workflow. No performance score or deployment claim is published in the profile.

**Smart Notes.** The [repository](https://github.com/Akash-Dhanwate/Smart-Notes-App), README, and [`script.js`](https://github.com/Akash-Dhanwate/Smart-Notes-App/blob/main/script.js) confirm create/edit/delete, pinning, category filtering, searching, theme handling, and localStorage persistence. No backend, authentication, or live deployment is invented.

The SVG action's supported inputs and output options were verified against its [pinned action specification](https://github.com/Platane/snk/blob/d8f6715049803e982ee5ff501b6b9b7d5deeb09b/svg-only/action.yml).

## Remaining limitations

- The design has passed GitHub's Markdown API, but an end-to-end preview through the live GitHub profile, image proxy, and mobile GitHub clients requires pushing the branch. Nothing was pushed automatically. GitHub caching may delay visible image updates.
- The Actions job is configured and source-validated, but has not run in GitHub during this task. It can run after merging to `main`. Repository policies or branch protection may block its write; instructions are in `PUBLISHING.md`. The existing local snapshot remains a graceful fallback.
- The initial contribution snapshot comes from real public generated output, but its original generation time is unknown. `prepared_at` is the local preparation time, not proof of current contribution totals. After a successful workflow run, provenance will identify freshly generated data.
- Study year remains unverified because the published README says “2rd Year.” It is omitted rather than inferred. Course completion, CGPA, awards, professional experience, and adoption metrics were not asserted.
- Link checks and the screenshot establish public homepage availability at check time. The dashboard's entire backend, authentication behavior, every API result, and all deployment infrastructure were not tested end to end as part of this profile task.
- Social ownership and email deliverability were not independently established beyond the supplied details; LinkedIn/X can also limit anonymous access.
- Motion was exercised in the installed Chrome browser. The source includes static-first fallbacks for unsupported animation; Safari, Firefox, assistive technologies, and GitHub's mobile apps were not separately tested.
