# SauceDemo — prompt planowania i implementacji Component Testing (UI Component Contracts)

**Wzorzec:** PAT-COMP-01 (planowanie) · PAT-COMP-02 (implementacja; rozszerzenie PAT-IMPL-01)  
**Wersja:** 1.0  
**Data:** 2026-07-14  
**Framework:** ISTQB CT-GenAI v1.1 §2.1.1 (prompt 6-składnikowy)  
**Powiązane:** [Architektura §7](saucedemo-automation-architecture.md) · [Plan testów §3 L1/L2](saucedemo-test-plan.md) · [Visual PAT-VISUAL-01](saucedemo-visual-regression-prompt.md) · [Biblioteka promptów](saucedemo-genai-prompts.md)

---

## Cel

Zaprojektuj i zaimplementuj **testy kontraktowe komponentów UI** dla warstwy POM SauceLab (`components/HeaderComponent`, `components/SidebarComponent`):

| ID | Komponent | Kontrakt |
|----|-----------|----------|
| `TC-L2-COMP-001` | `HeaderComponent` | Tytuł „Products” na inventory po logowaniu |
| `TC-L2-COMP-002` | `HeaderComponent` | Badge ukryty; `getCartItemCount()` === 0 |
| `TC-L2-COMP-003` | `HeaderComponent` | Po dodaniu 1 produktu: badge „1”, count === 1 |
| `TC-L2-COMP-004` | `HeaderComponent` | `openCart()` nawiguje na stronę koszyka |
| `TC-L2-COMP-005` | `SidebarComponent` | `open()` jest idempotentne (dwukrotne wywołanie) |
| `TC-L2-COMP-006` | `SidebarComponent` | `logout()` wraca na stronę logowania |
| `TC-L2-COMP-007` | `SidebarComponent` | `resetAppState()` czyści badge koszyka |
| `TC-L2-COMP-008` | `SidebarComponent` | Z koszyka `navigateToAllItems()` → inventory |

**Nie** implementuj Vitest/RTL/Storybook — brak kodu źródłowego aplikacji. **Nie** duplikuj visual baseline (`@nf-visual`) ani pełnych journey checkout.

---

## Definicje (3 poziomy — bez mieszania odpowiedzialności)

| Poziom | Pytanie | Przykład SauceLab | Suite |
|--------|---------|-------------------|-------|
| **UI Component Contract** | Czy fragment UI spełnia swój publiczny kontrakt API? | `SidebarComponent.open()` nie psuje stanu menu | `tests/component/` `@component` |
| **L2 Integration** | Czy dwa fragmenty pozostają zsynchronizowane? | Badge „1” = 1 pozycja w koszyku (`TC-L2-INTG-002`) | regression / smoke |
| **Visual regression** | Czy layout/kolory się nie przesunęły? | Snapshot inventory (`TC-L3-S2-001`) | `tests/nf/` `@nf-visual` |

**Relacja do L1 (plan testów):** `TC-L1-COMP-*` to projekt white-box (wzór podatku, komparator sortowania) — **Design only**. `TC-L2-COMP-*` to wykonywalne kontrakty black-box na żywym demo.

---

## PAT-COMP-01 — Planowanie Component Testing

| Składnik | Treść |
|----------|-------|
| **Rola** | Senior QA Architect / Test Strategist; ISTQB Foundation + CT-GenAI; architektura warstwowa SauceLab |
| **Kontekst** | Repo: `saucelab/`. Aplikacja: https://www.saucedemo.com/ (SPA, shared demo, brak REST API). Stan po Phase 4 + visual S2: regression ~40 TC, NF 8 TC chromium, `HeaderComponent` + `SidebarComponent` w `components/`, fixtures `header`, `sidebar`, `loginAs`, `resetAppState`, `shoppingFlow`. **Luka:** brak `tests/component/` — zachowanie komponentów rozproszone w regression (menu, session, inventory, login). |
| **Instrukcja** | 1) Potwierdź definicje contract vs integration vs visual (§ powyżej). 2) Zinwentaryzuj API komponentów (§7 architektury). 3) Zatwierdź inwentarz 8× `TC-L2-COMP-*` (tabela Cel). 4) Zbuduj macierz pokrycia vs regression/INTG — wskaż co **nie** duplikujesz. 5) Zdefiniuj tagi i bramki CI. 6) Przejdź do PAT-COMP-02 (implementacja) po zatwierdzeniu planu. |
| **Dane wejściowe** | **HeaderComponent:** `title`, `cartLink`, `cartBadge`, `openCart()`, `getCartItemCount()`, `getCartLinkClassList()`. **SidebarComponent:** `open()`, `navigateToAllItems()`, `navigateToAbout()`, `resetAppState()`, `logout()`. **ShoppingFlow:** `addProductToCart(id)` — minimalny setup dla COMP-003/004/007. **Produkt:** `PRODUCTS.backpack.id` z `data/products.ts`. |
| **Ograniczenia** | • Black-box only — bez unit testów aplikacji. • Testy używają fixtures; **zero** importów `pages/` w `tests/`. • **Brak** asercji w flows. • `@mutating` → `workers: 1`; reset przed mutacją gdy potrzeba. • Osobliwości person → characterization, nie component suite. • Polski w docs; angielski w kodzie/ID. |
| **Format wyjścia** | Zatwierdzony plan: macierz pokrycia + lista TC (poniżej) + decyzja CI. Implementacja → PAT-COMP-02. |

**Technika:** Prompt strukturalny + prompt chaining (plan → implementacja)

**Brama weryfikacji planu:** Każdy COMP TC ma jednego właściciela komponentu; brak redundantnych kroków względem INTG-002/004.

---

## Macierz pokrycia — COMP vs INTG vs regression

| COMP TC | Kontrakt (wąski) | Pokrycie szersze (zostaje w regression) |
|---------|------------------|----------------------------------------|
| COMP-002 | API count=0, badge hidden | INTG-002 weryfikuje też zgodność z koszykiem |
| COMP-003 | badge „1” + getCartItemCount() | INTG-002: otwarcie koszyka i liczba pozycji |
| COMP-004 | openCart() → URL koszyka | FUNC-010/011: pełny flow zakupowy |
| COMP-006 | logout() → login page | FUNC-017: logout + asercje strony logowania |
| COMP-007 | resetAppState() → badge znika | menu/session regression: reset + szerszy kontekst |
| COMP-008 | navigateToAllItems() z koszyka | FUNC-015: All Items + tytuł Products |

**Zasada:** Component suite = **szybka diagnoza** przy refaktorze `components/*.ts`. Regression = **pełna regresja funkcji**.

---

## Inwentarz TC-L2-COMP-* (zatwierdzony do implementacji)

| ID | Priorytet | Lane | Preconditions | Steps (skrót) | Expected |
|----|-----------|------|---------------|---------------|----------|
| TC-L2-COMP-001 | P0 | @readonly | — | loginAs standard | header.title = Products |
| TC-L2-COMP-002 | P0 | @readonly | Zalogowany, pusty koszyk | — | badge hidden; getCartItemCount()=0 |
| TC-L2-COMP-003 | P0 | @mutating | Zalogowany | addProductToCart(backpack) | badge „1”; count=1 |
| TC-L2-COMP-004 | P1 | @mutating | 1 produkt w koszyku | header.openCart() | URL cart; cart visible |
| TC-L2-COMP-005 | P1 | @readonly | Zalogowany | open(); open() | menu aria-hidden=false |
| TC-L2-COMP-006 | P0 | @readonly | Zalogowany | sidebar.logout() | login page visible |
| TC-L2-COMP-007 | P0 | @mutating | 1 produkt w koszyku | resetAppState() | badge hidden; count=0 |
| TC-L2-COMP-008 | P1 | @mutating | 1 produkt; na cart | navigateToAllItems() | inventory URL; title Products |

**Tagi suite:** `@component` · `@smoke-component` na COMP-001, COMP-002, COMP-006 (opcjonalna bramka PR)

---

## PAT-COMP-02 — Implementacja suite component

| Składnik | Treść |
|----------|-------|
| **Rola** | Senior inżynier automatyzacji Playwright + TypeScript; zgodność z architekturą SauceLab |
| **Kontekst** | Inwentarz 8 TC zatwierdzony w PAT-COMP-01. Istniejące: `fixtures/sauce.fixture.ts`, `components/`, `flows/ShoppingFlow`, `data/products.ts`. |
| **Instrukcja** | 1) Utwórz `tests/component/header.component.spec.ts` i `tests/component/sidebar.component.spec.ts` z tagiem `@component`. 2) Oznacz lane: `@readonly` lub `@mutating` per TC (patrz inwentarz). 3) COMP-003/004/007/008: użyj `shoppingFlow.addProductToCart(PRODUCTS.backpack.id)`; po mutacji opcjonalnie `resetAppState` w `test.afterEach` dla testów `@mutating` w pliku sidebar. 4) Dodaj `test:component` i opcjonalnie `test:smoke-component` do `package.json`. 5) Rozszerz CI nightly o `test:component`; opcjonalnie PR gate `@smoke-component`. 6) Zaktualizuj `docs/saucedemo-automation-architecture.md` §11.6 (P5 → done) i `README.md`. |
| **Dane wejściowe** | Fixtures: `loginAs`, `header`, `sidebar`, `shoppingFlow`, `cartPage`, `inventoryPage`, `loginPage`. Asercje URL: `page.waitForURL(/inventory\.html/)`, `/cart\.html/`. |
| **Ograniczenia** | • Chromium only (`--project=chromium`). • `@mutating` → `--workers=1`. • Brak hardcoded selektorów w spec. • Nie refaktoruj niepowiązanego kodu. • Nie commituj sekretów (`SAUCE_PASSWORD` z env). • Minimalny diff. |
| **Format wyjścia** | Pliki spec, `package.json`, ewentualnie CI, docs. Raport: 8/8 passed, lint green. |

**Technika:** Prompt strukturalny + few-shot (wzór poniżej)

**Brama weryfikacji:** `npm run lint` green; `npm run test:component` → 8 passed; brak importów `tests/` → `pages/`.

---

## Few-shot — oczekiwany kształt spec

### `tests/component/header.component.spec.ts`

```typescript
import { test, expect } from '../../fixtures/sauce.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Component — Header @component', () => {
  test('TC-L2-COMP-001: title shows Products on inventory @readonly @smoke-component', async ({
    loginAs,
    header,
  }) => {
    await loginAs('standard');
    await expect(header.title).toHaveText('Products');
  });

  test('TC-L2-COMP-002: empty cart hides badge and count is zero @readonly @smoke-component', async ({
    loginAs,
    header,
  }) => {
    await loginAs('standard');
    await expect(header.cartBadge).not.toBeVisible();
    expect(await header.getCartItemCount()).toBe(0);
  });

  test('TC-L2-COMP-003: badge reflects single item count @mutating', async ({
    loginAs,
    header,
    shoppingFlow,
  }) => {
    await loginAs('standard');
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await expect(header.cartBadge).toHaveText('1');
    expect(await header.getCartItemCount()).toBe(1);
  });

  test('TC-L2-COMP-004: openCart navigates to cart page @mutating', async ({
    loginAs,
    header,
    shoppingFlow,
    cartPage,
    page,
  }) => {
    await loginAs('standard');
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await header.openCart();
    await page.waitForURL(/cart\.html/);
    await expect(cartPage.cartList).toBeVisible();
  });
});
```

### `tests/component/sidebar.component.spec.ts`

```typescript
import { test, expect } from '../../fixtures/sauce.fixture';
import { SELECTORS } from '../../core/selectors';
import { PRODUCTS } from '../../data/products';

test.describe('Component — Sidebar @component', () => {
  test.afterEach(async ({ resetAppState }, testInfo) => {
    if (testInfo.tags.includes('@mutating')) {
      await resetAppState();
    }
  });

  test('TC-L2-COMP-005: open is idempotent @readonly', async ({ loginAs, sidebar, page }) => {
    await loginAs('standard');
    await sidebar.open();
    await sidebar.open();
    await expect(page.locator(SELECTORS.sidebar.menuWrap)).toHaveAttribute('aria-hidden', 'false');
  });

  test('TC-L2-COMP-006: logout returns to login @readonly @smoke-component', async ({
    loginAs,
    sidebar,
    loginPage,
  }) => {
    await loginAs('standard');
    await sidebar.logout();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('TC-L2-COMP-007: resetAppState clears cart badge @mutating', async ({
    loginAs,
    header,
    sidebar,
    shoppingFlow,
  }) => {
    await loginAs('standard');
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await expect(header.cartBadge).toHaveText('1');
    await sidebar.resetAppState();
    await expect(header.cartBadge).not.toBeVisible();
    expect(await header.getCartItemCount()).toBe(0);
  });

  test('TC-L2-COMP-008: navigateToAllItems from cart reaches inventory @mutating', async ({
    loginAs,
    header,
    shoppingFlow,
    sidebar,
    page,
  }) => {
    await loginAs('standard');
    await shoppingFlow.addProductToCart(PRODUCTS.backpack.id);
    await header.openCart();
    await page.waitForURL(/cart\.html/);
    await sidebar.navigateToAllItems();
    await page.waitForURL(/inventory\.html/);
    await expect(header.title).toHaveText('Products');
  });
});
```

> Dostosuj `test.afterEach` jeśli wersja Playwright nie eksponuje tagów w `testInfo` — wtedy reset po każdym teście `@mutating` ręcznie lub przez osobny describe.

---

## Checklist implementacyjny (dla agenta / developera)

### Struktura

- [ ] `tests/component/header.component.spec.ts` — COMP-001..004
- [ ] `tests/component/sidebar.component.spec.ts` — COMP-005..008
- [ ] Tag `@component` na obu describe
- [ ] `@smoke-component` na COMP-001, COMP-002, COMP-006

### Konwencje architektury

- [ ] Import wyłącznie z `fixtures/sauce.fixture` (+ `data/products`, `core/selectors` gdy konieczne)
- [ ] Zero importów `pages/` w plikach spec
- [ ] Mutacje koszyka przez `shoppingFlow`, nie bezpośrednie kliki na inventory w spec
- [ ] `resetAppState` w `afterEach` dla `@mutating` w sidebar spec

### Tooling

- [ ] `package.json`: `"test:component": "playwright test --grep @component --workers=1 --project=chromium"`
- [ ] Opcjonalnie: `"test:smoke-component": "playwright test --grep @smoke-component --project=chromium"`
- [ ] CI nightly: krok `npm run test:component` po regression lub w job `component`
- [ ] README: sekcja uruchamiania component suite

### Weryfikacja

- [ ] `npm run lint` → green
- [ ] `npm run test:component` → 8 passed
- [ ] Drugi run → brak flakiness
- [ ] Potwierdź brak regresji: `npm run test:smoke`

---

## Strategia CI i tagów

| Tag | Zakres | Kiedy uruchamiać | Workers |
|-----|--------|------------------|---------|
| `@smoke-component` | 3 TC (COMP-001, 002, 006) | Opcjonalnie PR po smoke | 1 (readonly mix OK) |
| `@component` | 8 TC | Nightly | 1 (mutating) |
| `@readonly` | 4 TC | Można równolegle tylko w osobnym jobie | >1 tylko jeśli izolowane |

**Rekomendacja:** pełny `@component` z `--workers=1` — shared demo + mutacje.

---

## Pytania kontrolne (odpowiedz w raporcie implementacji)

1. Czym różni się `TC-L2-COMP-003` od `TC-L2-INTG-002`?
2. Czy istniejące regression TC można uprościć po wprowadzeniu component suite (bez utraty coverage)?
3. Czy czas `@smoke-component` mieści się w <60s na CI?
4. Jakie 2 komponenty wyekstrahować w Phase B (`InventoryProductCard`, `CheckoutFormFields`)?

---

## Komenda do wklejenia — planowanie (PAT-COMP-01)

```
Zaprojektuj strategię Component Testing (UI Component Contracts) dla SauceLab według docs/saucedemo-component-testing-prompt.md (PAT-COMP-01).

Kontekst: HeaderComponent/SidebarComponent w components/, brak tests/component/.

Dostarcz plan Markdown (bez kodu):
- definicje contract vs integration vs visual
- macierz 8 TC-L2-COMP-* vs regression/INTG
- tagi @component, bramki CI, two-lane
- roadmapa Phase A/B/C i ryzyka

Przestrzegaj reguł repo: fixtures-only, SELECTORS, @readonly/@mutating, SAUCE_PASSWORD z env.
```

---

## Komenda do wklejenia — implementacja (PAT-COMP-02)

```
Zaimplementuj Component Testing SauceLab według docs/saucedemo-component-testing-prompt.md (PAT-COMP-02).

Wymagania:
- TC-L2-COMP-001..008 w tests/component/header.component.spec.ts i sidebar.component.spec.ts
- Tagi: @component, @readonly/@mutating, @smoke-component na 001/002/006
- Fixtures: loginAs, header, sidebar, shoppingFlow; zero importów pages/ w tests/
- test:component (workers=1, chromium), opcjonalnie test:smoke-component
- Zaktualizuj package.json, CI nightly, README, architecture doc §11.6
- Uruchom lint + test:component + test:smoke, raportuj wynik

Przestrzegaj istniejących konwencji repo (flows, selectors.ts, two-lane, SAUCE_PASSWORD).
```

---

## Roadmapa faz

| Faza | Zakres | Kryterium |
|------|--------|-----------|
| **Phase A** | Header + Sidebar (8 TC) | `test:component` 8/8 |
| **Phase B** | Ekstrakcja `InventoryProductCard`, `SortDropdown` | Nowy plik spec + component class |
| **Phase C** | Opcjonalny locator-scoped visual per component | Osobna decyzja; nie duplikuj S2 full-page |

---

## Ryzyka (do monitorowania)

| ID | Ryzyko | Mitigacja |
|----|--------|-----------|
| CT-01 | Duplikacja kroków z regression/INTG | Macierz § powyżej; wąskie asercje kontraktu |
| CT-02 | Flaky menu (`open()` / overlay) | Idempotent `open()`; `aria-hidden` z `SELECTORS.sidebar.menuWrap` |
| CT-03 | Shared demo — kolejność mutacji | `workers: 1`; `resetAppState` w afterEach |
| CT-04 | Mylenie z L1 COMP (Design only) | Osobne ID: L2-COMP = runnable UI contract |
| CT-05 | Import pages/ w spec | Code review + lint import rules |

---

## Po implementacji — aktualizacja metryk

| Metryka | Przed | Po (oczekiwane) |
|---------|-------|-----------------|
| Suite `tests/component/` | brak | 8 TC |
| Unikalne TC (chromium) | ~41 | **~49** (+8 COMP) |
| Czas diagnozy refaktoru components/ | pośredni (regression) | bezpośredni (component) |
| Skrypt npm | brak | `test:component` (+ opcjonalnie `test:smoke-component`) |

---

## Wersjonowanie

| Wersja | Data | Zmiana |
|--------|------|--------|
| 1.0 | 2026-07-14 | Prompt inicjalny — PAT-COMP-01/02, inwentarz COMP-001..008 |
