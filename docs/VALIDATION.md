# Validation — minimal glass revision

Date: 19 October 2026.

- Source validation: 48 image/link/source references; heading structure; meaningful alt text; all local paths; 43 SVG files checked with `xmllint`; gradient references; animation keyframes; reduced-motion rules; 150 KB per-SVG size budget.
- Browser checks: desktop dark/light at 1440px; mobile dark and reduced motion at 390px; narrow light/reduced motion at 320px. All images decoded; no horizontal overflow; twelve logo tiles and three repository cards present.
- Motion checks: screenshots differ for the hero and featured card with animation enabled; static alternatives produce identical frames under reduced motion. Dedicated mobile variants are selected.
- GitHub renderer: HTTP 200 from the actual Markdown API; six pictures, sixteen source variants, twenty-two images, zero layout tables, one expandable contribution section, and all three linked project cards preserved.
- Existing facts: verified project descriptions and contact links retained; no new deployment, achievement, experience, or skill mastery claim.
- Repository: nested repository left untouched; existing contribution workflow retained; no commit, push, or remote workflow run performed.

Evidence: `preview-artifacts/browser-report.json`, `preview-artifacts/github-render-report.json`, and the desktop/mobile screenshots. Regenerate with `npm run validate`, `npm run review`, and `npm run github-preview`.

Limitations: live GitHub image-proxy behavior requires publishing; other browsers and GitHub mobile apps were not separately tested. Study year remains unverified and omitted. Existing local contribution snapshots retain their original provenance; the unchanged workflow publishes separate assets to the remote output branch. The original project checks establish the features included in the cards; the full dashboard backend was not retested in this visual revision.
