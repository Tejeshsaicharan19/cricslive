# CricsLive

CricsLive is a cross-platform cricket score-tracker interface built with Expo and React Native. It provides a match browser and match-detail views designed for following innings scorecards and delivery-by-delivery commentary.

> **Sample data only:** This project currently uses fictional sample matches. It is not connected to a live cricket scores provider, and the displayed scores must not be treated as real-time results.

## Features

- Browse sample matches and their statuses.
- Save and revisit favorite matches.
- Open match details with innings scorecards and a ball-by-ball sample commentary timeline.
- See an explicit sample-data notice in the interface.

## Stack

- Expo, React Native, and Expo Router
- TypeScript and NativeWind
- Express/tRPC development API starter

## Run locally

Use Node.js and pnpm. From the project root:

```bash
pnpm install
pnpm dev
```

This starts the Expo web preview on port `8081` and the API server on port `3000`. Leave the terminal running and open `http://localhost:8081` in a browser.

### Preview on a phone with Expo Go

Stop the combined `pnpm dev` process first. In one terminal, start the API:

```bash
pnpm dev:server
```

In a second terminal, start Expo with a network tunnel:

```bash
pnpm exec expo start --tunnel
```

Scan the displayed QR code in Expo Go. The Expo Go app installed on the phone must support the same Expo SDK version as this project. If the SDKs differ, install a compatible Expo Go build or upgrade the project dependencies before connecting.

## Useful checks

```bash
pnpm check
pnpm lint
```

The sample fixtures are in `data/sampleMatches.ts`, with cricket data types in `types/cricket.ts`. No live-data provider or provider API key is configured in this repository.
