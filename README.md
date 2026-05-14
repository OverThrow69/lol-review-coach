# LoL Review Coach

Desktop League of Legends improvement coach for Windows.

It connects to the local League Client API, detects your profile/champion/role where Riot exposes it, records live-game snapshots, and creates a post-game review when the match ends.

## Local dev

```powershell
npm install
npm start
```

## Build for testers

```powershell
npm run dist
```

Build output is in `dist/`. Send the installer to friends for testing.

## Enable auto-updates

1. Create a GitHub repo, for example `yourname/lol-review-coach`.
2. In `package.json`, replace `CHANGE_ME_GITHUB_USERNAME` with your GitHub username or organization.
3. Commit and push the project.
4. Publish a release:

```powershell
$env:GH_TOKEN="your_token_here"
npm run release
```

For every new release:

1. Bump `version` in `package.json`.
2. Run `npm install` so `package-lock.json` updates.
3. Run `npm run release`.
4. Friends who installed the app will receive update checks automatically.

## GitHub Actions

If you use the included workflow, push a version tag:

```powershell
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will build and attach the Windows release files.

## Notes

This is not affiliated with Riot Games. It uses League Client local APIs while the client/game are running.
