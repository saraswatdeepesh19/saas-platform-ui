# SaaS Platform UI

Angular front end for the multi-tenant SaaS platform (auth, devices, sessions, usage, billing). It calls the platform's API gateway.

## Run

```powershell
npm.cmd install
npm.cmd start        # http://localhost:4200
```

The dev server proxies `/api/*` to the gateway at `http://localhost:8080` ([proxy.conf.json](proxy.conf.json)). Start the backend first: `docker compose -f infra/docker-compose.yml up -d --build` in the platform repo.

## Run in Docker

```powershell
docker build -t saas-platform-ui .
docker run --name saas-platform-ui --rm -p 7001:80 -e SENTRY_DSN="<your-public-Sentry-DSN>" saas-platform-ui
```

Open `http://localhost:7001`. The container proxies `/api/*` to `host.docker.internal:8080` by default; set `API_UPSTREAM` to override the gateway URL.

Sentry reporting is disabled when `SENTRY_DSN` is unset. When configured, it captures JavaScript errors, sampled page/navigation traces, Core Web Vitals, and API request spans. The browser DSN is public; do not put secrets in it. For a local Lighthouse audit, run `npx lighthouse http://localhost:7001 --view`.

## Build

```powershell
npm.cmd run build
```

## Docs

[Angular technical interview guide](docs/ANGULAR_TECHNICAL_INTERVIEW_GUIDE.md): concepts used, where they appear, and interview questions.
