# SauceDemo — prompt implementacji Visual Regression (S2)

**Wzorzec:** PAT-VISUAL-01 (rozszerzenie PAT-IMPL-01)  
**Wersja:** 1.0  
**Data:** 2026-07-14  
**Framework:** ISTQB CT-GenAI v1.1 §2.1.1 (prompt 6-składnikowy)  
**Powiązane:** [Plan testów §8](saucedemo-test-plan.md) · [Architektura §11.6](saucedemo-automation-architecture.md) · [QUIRK-004](saucedemo-bugs.md) · [Biblioteka promptów](saucedemo-genai-prompts.md)

---

## Cel

Zaimplementuj **visual regression** dla inventory SauceDemo jako formalny gate Playwright (`toHaveScreenshot`), pokrywając:

| ID | Persona | Opis |
|----|---------|------|
| `TC-L3-S2-001` | `standard_user` | Baseline layout inventory — wykrywanie dryfu UI |
| `TC-L3-S2-002` | `visual_user` | Baseline layout inventory — dokumentacja osobliwości QUIRK-004 |

**Nie** implementuj Percy/Applitools — tylko natywne snapshoty Playwright.

---

## PAT-VISUAL-01 — Implementacja suite visual regression

| Składnik | Treść |
|----------|-------|
| **Rola** | Senior inżynier automatyzacji Playwright + TypeScript; zgodność z architekturą SauceLab (POM, flows, fixtures, `core/selectors.ts`) |
| **Kontekst** | Repo: `saucelab/`. Aplikacja: https://www.saucedemo.com/. Stan po Phase 4 + refactor: 39 TC chromium, two-lane `@readonly`/`@mutating`, CI lint+smoke (PR), nightly full. Charakteryzacja `TC-L3-PERS-004` już robi `page.screenshot()` + attach — **nie duplikuj**; przenieś odpowiedzialność snapshot baseline do suite visual. Inventory: 6 produktów, sort dropdown `[data-test="product-sort-container"]`. QUIRK-004: sort **widoczny** u `visual_user` (fakt 2026-07-14). Hasło: `SAUCE_PASSWORD` z env. |
| **Instrukcja** | 1) Dodaj suite `tests/nf/visual.nf.spec.ts` z tagami `@nf-visual @mutating`. 2) Zaimplementuj `TC-L3-S2-001` i `TC-L3-S2-002` używając `loginAs` fixture + `inventoryPage`. 3) Użyj `expect(page).toHaveScreenshot(...)` lub `expect(locator).toHaveScreenshot(...)` z **stabilnym** zakresem (preferuj locator inventory listy lub pełna strona po `waitForLoadState('networkidle')` / `inventoryItems` visible). 4) Wygeneruj baseline: `npx playwright test --grep @nf-visual --project=chromium --update-snapshots`. 5) Dodaj `test:nf-visual` do `package.json` i job nightly w CI (po `test:nf` lub w ramach job `nf`). 6) Zaktualizuj `docs/saucedemo-automation-architecture.md` §11.6 (P2 → done) i README. 7) Usuń redundantny attach screenshot z `PERS-004` **lub** zostaw annotation `sort-visible` a screenshot przenieś wyłącznie do S2-002 — **nie** trzymaj dwóch baselineów tej samej strony. |
| **Dane wejściowe** | **TC-L3-S2-001:** standard_user → inventory → snapshot w tolerancji. **TC-L3-S2-002:** visual_user → inventory → snapshot baseline osobliwości. **Istniejące API:** `loginAs(persona)`, `inventoryPage`, `InventoryPage.inventoryItems`, `InventoryPage.sortDropdown`, `SELECTORS` w `core/selectors.ts`. |
| **Ograniczenia** | • Chromium only na start (`--project=chromium`) — NF5 cross-browser **nie** rozszerzaj na visual bez osobnej decyzji. • `@mutating`, `workers: 1` — shared demo. • **Brak** hardcoded selektorów w spec — tylko page objects / `page`. • **Brak** asercji w flows. • Nie psuj `standard_user` regression przez osobliwości `visual_user`. • Snapshoty w `tests/nf/visual.nf.spec.ts-snapshots/` (domyślna konwencja Playwright). • Ustaw `maxDiffPixelRatio` lub `maxDiffPixels` w `playwright.config.ts` **tylko** dla projektu visual lub per-expect — uzasadnij w komentarzu (font rendering). • Nie commituj sekretów. • Polski w docs, angielski w kodzie/ID testów. • Minimalny diff — nie refaktoruj niepowiązanego kodu. |
| **Format wyjścia** | Pliki: `tests/nf/visual.nf.spec.ts`, ewentualnie `playwright.config.ts` (snapshotPathTemplate / expect), `package.json`, `.github/workflows/saucedemo-tests.yml`, aktualizacja docs. Raport końcowy: co zmieniono, jak uruchomić baseline update, bramka pass (2/2). |

**Technika:** Prompt strukturalny + few-shot (wzór poniżej)

**Brama weryfikacji:** `npm run lint` green; `npm run test:nf-visual` → 2 passed (chromium); brak nowych importów `tests/` → `pages/`.

---

## Few-shot — oczekiwany kształt spec

```typescript
import { test, expect } from '../../fixtures/sauce.fixture';

test.describe('NF — Visual regression @nf-visual @mutating', () => {
  test('TC-L3-S2-001: standard_user inventory matches visual baseline', async ({
    loginAs,
    inventoryPage,
    page,
  }) => {
    await loginAs('standard');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(page).toHaveScreenshot('inventory-standard-user.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC-L3-S2-002: visual_user inventory matches visual baseline', async ({
    loginAs,
    inventoryPage,
    page,
  }) => {
    await loginAs('visual');
    await expect(inventoryPage.sortDropdown).toBeVisible();
    await expect(page).toHaveScreenshot('inventory-visual-user.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
```

> Dostosuj nazwy plików snapshot, locator scope i tolerancję po pierwszym `--update-snapshots` jeśli flaky na CI.

---

## Checklist implementacyjny (dla agenta / developera)

### Konfiguracja

- [ ] `playwright.config.ts`: `snapshotPathTemplate` bez `{platform}` — wspólny baseline Windows dev / Linux CI
- [ ] Viewport: użyj `devices['Desktop Chrome']` (1280×720) — **nie zmieniaj** bez aktualizacji baseline
- [ ] Wyłącz animacje jeśli flaky: `page.emulateMedia({ reducedMotion: 'reduce' })` w `beforeEach` (opcjonalnie)

### Stabilność snapshotów

- [ ] Poczekaj na `inventoryPage.inventoryItems` count = 6 przed screenshot
- [ ] Ukryj / maskuj elementy niestabilne jeśli występują (badge koszyka, timestamp) — `mask: [locator]`
- [ ] Ten sam `baseURL` lokalnie i CI (`https://www.saucedemo.com`)

### Integracja z istniejącym kodem

- [ ] `PERS-004`: zostaw annotation `sort-visible`; usuń `test.info().attach` screenshot jeśli S2-002 przejmuje baseline
- [ ] Nie twórz nowego Page Object — wystarczy `inventoryPage` + `page`
- [ ] Opcjonalnie: helper `await inventoryPage.page.waitForLoadState('domcontentloaded')`

### Tooling

- [ ] `package.json`: `"test:nf-visual": "playwright test --grep @nf-visual --workers=1 --project=chromium"`
- [ ] Rozszerz `test:nf` **lub** dodaj osobny krok w CI nightly
- [ ] Dokumentuj w README: jak aktualizować baseline (`--update-snapshots`)

### Weryfikacja

- [ ] Pierwszy run lokalny: `--update-snapshots` → commit PNG w repo
- [ ] Drugi run: bez flagi → 2/2 passed
- [ ] Trzeci run: potwierdź brak flakiness

---

## Komenda do wklejenia (pełny prompt dla Cursor / agenta)

```
Zaimplementuj visual regression SauceLab według docs/saucedemo-visual-regression-prompt.md (PAT-VISUAL-01).

Wymagania:
- TC-L3-S2-001 (standard_user) i TC-L3-S2-002 (visual_user) w tests/nf/visual.nf.spec.ts
- Tagi: @nf-visual @mutating
- Playwright toHaveScreenshot, chromium only, workers=1
- Użyj loginAs fixture i inventoryPage; zero importów pages/ w tests/
- Zaktualizuj package.json, CI nightly, README, architecture doc §11.6
- Uporządkuj PERS-004 (annotation bez duplikatu baseline screenshot)
- Wygeneruj baseline lokalnie, uruchom lint + test:nf-visual, raportuj wynik

Przestrzegaj istniejących konwencji repo (flows, selectors.ts, two-lane, SAUCE_PASSWORD).
```

---

## Ryzyka (do monitorowania)

| ID | Ryzyko | Mitigacja |
|----|--------|-----------|
| VR-01 | Dryf fontów CI vs lokalnie | `maxDiffPixelRatio`; baseline generowany na CI lub pinned Chromium |
| VR-02 | Flaky przez ładowanie obrazów | Czekaj na `inventoryItems`; maskuj broken images jeśli potrzeba |
| VR-03 | Duplikat z PERS-004 | Jedna odpowiedzialność: S2 = baseline, PERS-004 = characterization metadata |
| VR-04 | Deploy demo zmienia UI | R-11 w planie — rerun `--update-snapshots` + review PR |

---

## Po implementacji — aktualizacja metryk

| Metryka | Przed | Po (oczekiwane) |
|---------|-------|-----------------|
| NF chromium | 5 TC | **7 TC** (+2 visual) |
| Unikalne TC | 39 | **41** |
| Suite `test:nf` / `test:nf-visual` | brak visual | visual w nightly |

---

## Wersjonowanie

| Wersja | Data | Zmiana |
|--------|------|--------|
| 1.0 | 2026-07-14 | Prompt inicjalny — S2-001/002, PAT-VISUAL-01 |
