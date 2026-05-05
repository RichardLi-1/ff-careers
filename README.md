# FF Careers Local README

## Overview

This repo has two main projects:

- `ff-careers/`: Expo React Native app (iOS, Android, Web)
- `backend/`: Express + TypeScript API

Postgres is the single source of truth.

## Prerequisites

- Node.js 20+ (recommended)
- npm
- Expo tooling for local mobile/web testing
- Local or remote Postgres instance

## Install

From repo root:

```bash
npm run install:backend
npm run install:app
```

## Run Locally

From repo root:

```bash
# Start backend
npm run backend

# In a second terminal, start Expo app
npm run app
```

Useful shortcuts:

- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run lint`

## Project Commands

Root scripts (run from repo root):

- `npm run backend` -> runs `backend` dev server (`nodemon` + `tsx`)
- `npm run app` -> runs Expo app
- `npm run ios` / `android` / `web` -> platform launchers
- `npm run lint` -> Expo linting in `ff-careers/`

## Deployment Notes (Web)

App web export/deploy lives in `ff-careers/README.md`.
Quick path:

```bash
npm --prefix ff-careers run export && vercel --prod
```

## Environment Notes

- Keep secrets local and out of git.
- Verify backend and app env values are set before login/API testing.


Postgres is the single source of truth.