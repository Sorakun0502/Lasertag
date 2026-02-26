# 🎯 LASERTAG Terminumfrage

Moderne Terminumfrage-App für eure Lasertag-Runde, gebaut mit Node.js + PostgreSQL.

---

## 🚀 Deployment auf Railway

### 1. Vorbereitung
```bash
# Projekt auf GitHub pushen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USERNAME/lasertag-survey.git
git push -u origin main
```

### 2. Railway Setup

1. Gehe zu [railway.app](https://railway.app) und erstelle ein neues Projekt
2. Klicke auf **"Deploy from GitHub repo"** und wähle dein Repository
3. Railway erkennt automatisch die Node.js-App

### 3. PostgreSQL hinzufügen

1. Im Railway-Projekt auf **"+ Add a Service"** klicken
2. **"Database"** → **"PostgreSQL"** auswählen
3. Railway erstellt automatisch die `DATABASE_URL` Umgebungsvariable
4. Diese wird automatisch mit deiner App verknüpft

### 4. Fertig! 🎉

Railway deployed automatisch. Die App ist unter deiner Railway-URL erreichbar.

---

## 📌 URLs

| URL | Beschreibung |
|-----|-------------|
| `/` | Umfrageseite für die Freunde |
| `/admin.html` | Ergebnisse & Statistiken (passwortlos, URL geheim halten) |

## 🔌 API Endpoints

| Method | Endpoint | Beschreibung |
|--------|----------|-------------|
| `POST` | `/api/submit` | Antwort einreichen |
| `GET` | `/api/results` | Alle Ergebnisse (Admin) |
| `GET` | `/api/stats` | Kurzstatistik für Frontend |

### POST /api/submit – Body
```json
{
  "name": "Max Mustermann",
  "dates": ["2026-04-11", "2026-04-18"],
  "comment": "Bin etwas später"
}
```

---

## 💻 Lokal entwickeln

```bash
npm install

# PostgreSQL lokal oder via Docker:
docker run --name pglocal -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres

# .env Datei:
DATABASE_URL=postgresql://postgres:pass@localhost:5432/lasertag

node server.js
```
