# CCTV Overview Backend

Django backend for Smart Perimeter Security & CCTV Overview.

## What is included

- Django 6 + Django REST Framework API
- Django Channels WebSocket endpoint for real-time telemetry
- SQLite by default, PostgreSQL optional via env vars
- Redis support for Channels in Docker
- Static and media support
- Admin configuration for all models
- API routes for nodes, telemetry, and alerts

## Local development

1. Create a virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and adjust values for local development:

```powershell
copy .env.example .env
```

4. Apply migrations:

```powershell
py .\backend\manage.py migrate
```

4. Start the dev server:

```powershell
py .\backend\manage.py runserver
```

5. Open the dashboard:

- Homepage: `http://127.0.0.1:8000/`
- API root: `http://127.0.0.1:8000/api/`
- WebSocket: `ws://127.0.0.1:8000/ws/telemetry/`

## Docker development

```powershell
docker compose up --build
```

Then browse:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/api/`

## API endpoints

- `GET /api/`
- `GET /api/nodes/`
- `POST /api/nodes/`
- `GET /api/nodes/<id>/`
- `PATCH /api/nodes/<id>/`
- `DELETE /api/nodes/<id>/`
- `GET /api/telemetry/`
- `POST /api/telemetry/`
- `GET /api/nodes/<id>/telemetry/`
- `GET /api/alerts/`
- `POST /api/alerts/`
- `PATCH /api/alerts/<id>/`
- `DELETE /api/alerts/<id>/`
- `PATCH /api/alerts/<id>/resolve/`

## Environment variables

A sample `.env.example` is included.

## Notes

- `DEBUG=True` is enabled by default for local development.
- For production, use an ASGI server such as Daphne or Uvicorn.
- Redis is required for WebSocket scaling in production.
