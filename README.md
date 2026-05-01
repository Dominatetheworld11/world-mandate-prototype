# World Mandate Prototype

Browser-based geopolitical strategy prototype inspired by grand strategy war games.

Players choose a country, control strategic provinces, watch a live political map, and build toward war, economy, or diplomacy victories.

## Current Focus

- Real-world vector strategy map
- CON-style regional theater camera
- Adaptive country labels and map readability
- Strategic terrain, borders, capitals, and province interaction
- Account/lobby/server prototype flow

## Run Locally

```bash
npm start
```

Then open:

```text
http://127.0.0.1:4173/
```

## Discord Changelogs

This repo includes a GitHub Actions workflow for posting changelogs to Discord.

After the repo is on GitHub:

1. Create a Discord webhook in your server channel.
2. Add it as a GitHub repository secret named `DISCORD_WEBHOOK_URL`.
3. Run the `Post Discord Changelog` workflow manually from GitHub Actions.

The workflow reads `CHANGELOG.md` and posts it to Discord.

