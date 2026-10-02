# SaaS Platform UI

Angular front end for the multi-tenant SaaS platform (auth, devices, sessions, usage, billing). It calls the platform's API gateway.

## Run

```powershell
npm.cmd install
npm.cmd start        # http://localhost:4200
```

The dev server proxies `/api/*` to the gateway at `http://localhost:8080` ([proxy.conf.json](proxy.conf.json)). Start the backend first: `docker compose -f infra/docker-compose.yml up -d --build` in the platform repo.

## Build

```powershell
npm.cmd run build
```

## Docs

[Angular technical interview guide](docs/ANGULAR_TECHNICAL_INTERVIEW_GUIDE.md): concepts used, where they appear, and interview questions.
