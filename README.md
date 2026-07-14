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
├── config/credentials.ts
├── fixtures/sauce.fixture.ts
├── pages/                  # Page Object Model
├── tests/smoke/            # suite Smoke (@smoke)
├── playwright.config.ts
└── .env.example
```

**Stan:** scaffold — 3 działające testy login smoke; shopping/checkout jako placeholdery (`test.skip`).
