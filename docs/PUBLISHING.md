# Preview and publish

The completed implementation is in `/Users/akash/akash-github-profile-next`, on branch `design/profile-next`. This is a separate worktree of the existing profile repository, based on the published `main` commit `d3b7033`. The original checkout on `feacture2` and its staged README edit were preserved. Nothing has been pushed by this implementation.

## Local preview

For an immediate preview, open `preview-artifacts/index.html` from the completed folder or ZIP. It uses GitHub's actual rendered HTML and the local assets, with no server required. Keep it beside the supplied `assets/` and `output/` directories. It follows the browser's light/dark and reduced-motion preferences.

```bash
cd /Users/akash/akash-github-profile-next
npm ci
npm run validate
npm run preview
```

Open `http://127.0.0.1:4173`. Use `http://127.0.0.1:4173/?theme=light` for the light version. Resize the browser to 600px or narrower to select the mobile assets. Enable your operating system's Reduce Motion preference to select the static assets. Press Ctrl+C in the terminal to stop the preview.

This uses the real Markdown source, local image assets, and GitHub Markdown CSS. It approximates GitHub's presentation; final image proxying, sanitization, and the profile's surrounding interface require a GitHub preview.

`npm run github-preview` also checks the source against GitHub's actual Markdown API. It verifies that GitHub preserves the responsive/reduced-motion pictures, images, and both tables. It writes the HTML renderer response and an evidence report to `preview-artifacts/` without publishing anything. Run `npm run export-preview` afterward to refresh the standalone preview.

Automated screenshots and browser checks:

```bash
npm run review
```

On this Mac, the review uses the existing Google Chrome installation. Other machines can set `PROFILE_CHROME_PATH` to their Chrome executable or install Playwright Chromium with `npx playwright install chromium`. Preview screenshots and the browser report are written to `preview-artifacts/`, which is ignored by Git.

## Commit and push the finished branch

These commands stage only the redesign and its tooling/documentation:

```bash
cd /Users/akash/akash-github-profile-next
git status --short
git diff --check
git add -- README.md assets output .github/workflows/github-snake.yml tools package.json package-lock.json .gitignore docs
git diff --cached --stat
git commit -m "feat: build custom animated GitHub profile"
git push -u origin design/profile-next
```

The remote is the existing `git@github.com:Akash-Dhanwate/AKASH-DHANWATE.git`. Use your existing GitHub SSH authentication. No token belongs in these files.

After pushing, open:

https://github.com/Akash-Dhanwate/AKASH-DHANWATE/blob/design/profile-next/README.md

Select the rendered **Preview** view if GitHub opens the source view. Check the hero and contact links, make the browser narrow, and inspect both GitHub appearance themes. For reduced motion, change the operating-system preference and reload. This branch preview does not change the live profile.

To publish the profile, open:

https://github.com/Akash-Dhanwate/AKASH-DHANWATE/compare/main...design/profile-next

Create a pull request targeting `main`, review the changes, and merge it. The repository name already matches the GitHub username without regard to letter case. Once the README reaches the default branch, check:

https://github.com/Akash-Dhanwate

## Activate the contribution refresh

The README already includes real local snake SVGs, so it does not depend on a successful first run to display an image.

1. After merging to `main`, open the profile repository's **Actions** tab.
2. If GitHub asks you to enable Actions, enable it for this repository.
3. Select **Refresh contribution trail**, then **Run workflow**, choosing `main`.
4. Confirm the job creates or updates the five files in `output/` on `main`.
5. Open `output/snapshot.json` to see the preparation time and provenance; refresh the profile after GitHub's image cache catches up.

The schedule is daily at 02:17 UTC, approximately 07:47 IST. GitHub schedules can be delayed, and GitHub may disable schedules on inactive public repositories. Re-enable or run the workflow manually if needed.

The job requests `contents: write` only for updating these generated files. It uses GitHub's automatic `GITHUB_TOKEN`, not a personal token. Repository or organization policy must permit the pinned checkout action, the Platane action, and commits by the Actions bot. If protected `main` rejects the bot's push, keep the existing snapshots and adapt the publishing step to your repository's approved pull-request process. No force-push is used. The former `output` branch is no longer a rendering dependency and is not modified.

## Update later

```bash
npm run assets
npm run validate
npm run review
```

`node tools/capture-project.mjs` refreshes the actual featured demo screenshot. It makes an anonymous read of the public demo and keeps an existing screenshot if the demo returns a non-200 status. Verify the screenshot after capturing. Confirm study year before adding it to the engineering profile; no certification, course completion, academic result, or project adoption claim is implied by this design.
