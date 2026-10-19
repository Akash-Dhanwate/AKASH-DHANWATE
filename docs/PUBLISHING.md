# Preview and publish the minimal profile

Current file: `/Users/akash/AKASH-DHANWATE/README.md`.

Open `preview-artifacts/index.html` directly for an offline preview, or use:

```bash
cd /Users/akash/AKASH-DHANWATE
npm ci
npm run preview
```

Open http://127.0.0.1:4173. Add `/?theme=light` for the light theme. Narrow the browser to see the mobile hero/cards. Reduced Motion selects static files.

To regenerate and check the files:

```bash
npm run assets
npm run validate
npm run review
npm run github-preview
npm run export-preview
```

The installed Chrome browser is used for screenshots. No remote change is made by the renderer check.

To commit only this revision from the current `main` branch:

```bash
cd /Users/akash/AKASH-DHANWATE
git diff --check
git add -- README.md assets/hero.svg assets/hero-static.svg assets/hero-mobile.svg assets/hero-mobile-static.svg assets/about.svg assets/about-mobile.svg assets/footer-static.svg assets/footer-mobile.svg assets/links assets/projects assets/skills tools/generate-assets.mjs tools/validate.mjs tools/review.mjs tools/check-github.mjs package.json package-lock.json .gitignore docs
git diff --cached --stat
git commit -m "design: simplify profile with glass logos and animated project cards"
git push origin main
```

The explicit staging list excludes the existing nested repository and installed dependencies. Only push after reviewing your staged changes.

Then open https://github.com/Akash-Dhanwate/AKASH-DHANWATE/blob/main/README.md and https://github.com/Akash-Dhanwate. GitHub image caching can delay an update.

The existing contribution workflow publishes to the `output` branch and was preserved during this design revision. The README currently uses local stored snapshots with provenance in `output/snapshot.json`. No new workflow run was triggered.
