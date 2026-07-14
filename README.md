# SauceLab — testy SauceDemo

**Język repozytorium:** polski (dokumentacja, plany, prompty).  
Identyfikatory testów, Gherkin, kod i komunikaty aplikacji pozostają po angielsku.

## Dokumentacja

Pełna dokumentacja testowa znajduje się w katalogu **[docs/](docs/README.md)**:

- Plan i strategia testów (85 przypadków)
- Architektura automatyzacji (warstwy, wzorce, roadmapa Phase 1–3)
- Rejestr błędów i osobliwości person
- Biblioteka promptów GenAI (ISTQB CT-GenAI)
- Macierze pokrycia
- Prompt do generowania strategii testów

**Aplikacja:** [SauceDemo (Swag Labs)](https://www.saucedemo.com/)

## Automatyzacja (Playwright)

```bash
cd saucelab
npm install
npx playwright install chromium
cp .env.example .env   # opcjonalnie
npm run test:smoke
```

### Struktura

```
saucelab/
├── docs/                   # dokumentacja testowa
├── components/             # Component Pattern (header, sidebar)
├── config/credentials.ts
├── data/                   # produkty, dane checkout
├── fixtures/sauce.fixture.ts
├── flows/                  # Flow / Facade (shopping, checkout)
├── pages/                  # Page Object Model
├── tests/smoke/            # suite Smoke (@smoke)
├── playwright.config.ts
└── .env.example
```

**Stan:** Phase 1 — 5 testów smoke (login, shopping, checkout); warstwy components, flows, data.
