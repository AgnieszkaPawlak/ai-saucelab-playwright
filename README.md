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
cp .env.example .env   # wymagane — SAUCE_PASSWORD
npm run test:smoke
npm run test:regression
npm run test:characterization
npm run test:nf
npm run test:cross-browser
npm run lint
```

### Credentials

| Środowisko | Hasło | Usernames |
|------------|-------|-----------|
| Lokalnie | `.env` → `SAUCE_PASSWORD` | `.env` (domyślnie publiczne demo) |
| CI | Environment **`SAUCE_PASSWORD`** → secret `SAUCE_PASSWORD` | Workflow uses `environment: SAUCE_PASSWORD` |

### Wykonywanie (two-lane)

| Skrypt | Lane | Workers |
|--------|------|---------|
| `test:readonly` | `@readonly` — login negatywny, NF bez koszyka | 4 |
| `test:mutating` | `@mutating` — cart, checkout, characterization | 1 |
| `test` | readonly → mutating | jak wyżej |
| `test:smoke` | PR gate — oba lane | mutating serial |

### Struktura

```
saucelab/
├── core/                   # BasePage (wspólne operacje)
├── components/             # Component Pattern (header, sidebar)
├── config/credentials.ts
├── data/                   # produkty, użytkownicy, dane checkout
├── fixtures/sauce.fixture.ts
├── flows/                  # Flow / Facade (auth, shopping, checkout)
├── pages/                  # Page Object Model
├── tests/
│   ├── smoke/              # suite Smoke (@smoke)
│   ├── regression/         # suite Regression (@regression)
│   ├── characterization/   # suite Persona (@characterization)
│   └── nf/                 # NF gates (@nf-performance, @nf-security, @nf-a11y)
├── .github/workflows/      # CI (lint + smoke on PR; nightly suites)
├── playwright.config.ts
└── .env.example
```

**Stan:** 39 TC (chromium) + cross-browser NF5 (3 TC × 3 przeglądarki).
