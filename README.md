# SauceLab — testy SauceDemo

**Język repozytorium:** polski (dokumentacja, plany, prompty).  
Identyfikatory testów, Gherkin, kod i komunikaty aplikacji pozostają po angielsku.

## Dokumentacja

Pełna dokumentacja testowa znajduje się w katalogu **[docs/](docs/README.md)**:

- Plan i strategia testów (85 przypadków)
- Architektura automatyzacji (warstwy, wzorce, roadmapa Phase 1–4 + refactor)
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
npm run test:nf-visual
npm run test:cross-browser
npm run lint
```

Aktualizacja baseline visual (świadoma zmiana UI):

```bash
npx playwright test --grep @nf-visual --project=chromium --update-snapshots
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
├── core/                   # BasePage, selectors.ts (rejestr lokatorów)
├── components/             # Component Pattern (header, sidebar)
├── config/credentials.ts
├── data/                   # products, users, checkout.builder, cart-states, persona-strategy
├── fixtures/sauce.fixture.ts
├── flows/                  # Flow / Facade (auth, shopping, checkout)
├── pages/                  # Page Object Model (split checkout)
├── tests/
│   ├── smoke/              # suite Smoke (@smoke)
│   ├── regression/         # suite Regression (@regression) — 25 TC
│   ├── characterization/   # suite Persona (@characterization)
│   └── nf/                 # NF gates + cross-browser
├── .github/workflows/      # CI (lint + smoke on PR; nightly suites)
├── eslint.config.mjs
├── playwright.config.ts
└── .env.example
```

**Stan:** 42 unikalnych TC (chromium) + cross-browser NF5 (3 TC × 3 przeglądarki). Plan docelowy regression: 55 TC.
