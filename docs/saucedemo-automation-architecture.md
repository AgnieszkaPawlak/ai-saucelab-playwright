# SauceDemo — architektura automatyzacji testów

**Version:** 1.0  
**Date:** 2026-07-14  
**Author:** Senior QA Architect  
**Status:** Zatwierdzony do implementacji fazowej  
**Environment:** `https://www.saucedemo.com/` (publiczne demo SPA)  
**Powiązane:** [Plan testów](saucedemo-test-plan.md) · [Macierze pokrycia](saucedemo-coverage-matrix.md) · [Rejestr błędów](saucedemo-bugs.md) · [README automatyzacji](../README.md)

---

## 1. Podsumowanie wykonawcze

Niniejszy dokument definiuje **docelową architekturę warstwową** frameworka Playwright + TypeScript dla SauceLab. Architektura rozszerza istniejący scaffold (POM + fixtures) o warstwy **Components**, **Flows** i **Data**, zachowując zgodność z planem testów (85 TC) i zasadami **SOLID**.

Implementacja odbywa się **małymi krokami** (Phase 1 → Phase 2 → Phase 3). Każda faza dostarcza działający, zielony subset testów bez blokowania kolejnych iteracji.

### Stan wyjściowy (audyt 2026-07-14)

| Metryka | Wartość |
|---------|---------|
| Testy smoke (`@smoke`) | 5 passed, 0 skipped |
| Warstwy kodu | `pages/`, `fixtures/`, `config/`, `tests/smoke/` |
| Weryfikacja żywej aplikacji | Lokatory poprawne; ryzyko flakiness ze względu na współdzielony stan koszyka |
| Brakujące elementy POM (wg planu) | `HeaderComponent`, Flow Objects, reset stanu aplikacji |

### Stan docelowy (po Phase 1)

| Metryka | Wartość |
|---------|---------|
| Testy smoke | 5 passed, 0 skipped |
| Nowe warstwy | `components/`, `flows/`, `data/` |
| Stabilność | `resetAppState` w fixture przed testami mutującymi |
| Smoke flow | login → add to cart → checkout → complete (logout opcjonalny) |

---

## 2. Kontekst systemu

### 2.1 Aplikacja testowana

SauceDemo (Swag Labs) to statyczna SPA bez publicznego REST API. Stan koszyka i sesji jest **współdzielony** między użytkownikami publicznego demo. Automatyzacja musi uwzględniać reset stanu (`Reset App State` w menu bocznym) przed scenariuszami mutującymi dane.

### 2.2 Ograniczenia architektoniczne

| Ograniczenie | Wpływ na design |
|--------------|-----------------|
| Brak API | Testy wyłącznie UI/E2E; brak warstwy API client |
| Współdzielone demo | `workers: 1`, `fullyParallel: false`, reset przed mutacją |
| 6 person demo | Osobne suite'y charakteryzacyjne; `standard_user` chroni regresję |
| Brak kodu źródłowego aplikacji | Lokatory oparte na `data-test` (preferowane) i stabilnych ID |

### 2.3 Mapowanie na plan testów

| Element planu (§13) | Implementacja architektoniczna |
|---------------------|-------------------------------|
| POM: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` | `pages/` — bez zmian nazw w Phase 1 |
| POM: `SidebarComponent`, `HeaderComponent` | `components/` |
| Suite Smoke (15 TC) | `tests/smoke/` — Phase 1 realizuje 5 pierwszych TC automatyzacji |
| Suite Regression (55 TC) | `tests/regression/` — Phase 2 |
| Charakteryzacja person | `tests/characterization/` — Phase 3 |
| NF6 Utrzymywalność | Ten dokument + separacja warstw |

---

## 3. Architektura warstwowa

### 3.1 Diagram warstw (docelowy)

```mermaid
flowchart TB
    subgraph L1["Warstwa 1 — Specs (tests/)"]
        direction LR
        TS[smoke/]
        TR[regression/]
        TC[characterization/]
    end

    subgraph L2["Warstwa 2 — Fixtures (fixtures/)"]
        FX[sauce.fixture.ts]
    end

    subgraph L3["Warstwa 3 — Flows (flows/)"]
        AF[AuthFlow]
        SF[ShoppingFlow]
        CF[CheckoutFlow]
    end

    subgraph L4["Warstwa 4 — Pages & Components"]
        direction TB
        subgraph pages["pages/"]
            LP[LoginPage]
            IP[InventoryPage]
            CP[CartPage]
            CH[CheckoutPage]
        end
        subgraph components["components/"]
            HC[HeaderComponent]
            SB[SidebarComponent]
        end
    end

    subgraph L5["Warstwa 5 — Data & Config"]
        DT[data/]
        CFG[config/credentials.ts]
        ENV[.env]
    end

    subgraph L6["Warstwa 6 — Playwright runtime"]
        PW[playwright.config.ts]
        BR[Browser / Page]
    end

    L1 --> L2
    L2 --> L3
    L2 --> L4
    L3 --> L4
    L3 --> L5
    L4 --> L6
    L5 --> ENV
    L6 --> PW
```

### 3.2 Reguły zależności między warstwami

| Warstwa | Może importować z | Nie może importować z |
|---------|-------------------|----------------------|
| `tests/` | `fixtures/`, `data/` | `pages/` bezpośrednio (preferuj flows) |
| `fixtures/` | `flows/`, `pages/`, `components/`, `config/` | `tests/` |
| `flows/` | `pages/`, `components/`, `data/` | `fixtures/`, `tests/` |
| `pages/`, `components/` | `@playwright/test` (`Page`, `Locator`) | `flows/`, `tests/` |
| `data/` | `config/` | `pages/`, `flows/` |

**Zasada:** testy nie znają lokatorów. Testy wywołują flows lub fixtures; flows orkiestrują pages i components.

### 3.3 Diagram przepływu danych (smoke checkout)

```mermaid
sequenceDiagram
    participant T as checkout.smoke.spec.ts
    participant F as sauce.fixture
    participant SB as SidebarComponent
    participant CF as CheckoutFlow
    participant SF as ShoppingFlow
    participant IP as InventoryPage
    participant CP as CartPage
    participant CH as CheckoutPage
    participant HC as HeaderComponent

    T->>F: beforeEach(resetAppState + loginAsStandardUser)
    F->>SB: resetAppState()
    F->>IP: login via LoginPage
    T->>CF: completeCheckout(backpack, defaultCustomer)
    CF->>SF: addProductToCart(backpack)
    SF->>IP: click add / handle already-in-cart
    SF->>HC: assert cartBadge
    CF->>IP: openCart()
    CF->>CP: proceedToCheckout()
    CF->>CH: fillCustomerInfo + continue + finish
    CF->>CH: assert completeHeader
    T->>T: expect Thank you for your order!
```

---

## 4. Struktura katalogów

### 4.1 Stan bieżący (przed zmianami)

```
saucelab/
├── config/
│   └── credentials.ts
├── docs/
│   ├── README.md
│   ├── saucedemo-test-plan.md
│   └── …
├── fixtures/
│   └── sauce.fixture.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── SidebarComponent.ts      # lokalizacja do migracji
├── tests/
│   └── smoke/
│       ├── login.smoke.spec.ts      # 3 × passed
│       ├── shopping.smoke.spec.ts   # 1 × skipped
│       └── checkout.smoke.spec.ts   # 1 × skipped
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

### 4.2 Stan docelowy — Phase 1 (minimalna zmiana)

```
saucelab/
├── components/                      # NOWY
│   ├── HeaderComponent.ts
│   └── SidebarComponent.ts          # PRZENIESIONY z pages/
├── config/
│   └── credentials.ts               # bez zmian
├── data/                            # NOWY
│   ├── products.ts
│   └── checkout-data.ts
├── docs/
│   └── saucedemo-automation-architecture.md   # ten dokument
├── fixtures/
│   └── sauce.fixture.ts             # rozszerzony
├── flows/                           # NOWY
│   ├── ShoppingFlow.ts
│   └── CheckoutFlow.ts
├── pages/
│   ├── LoginPage.ts                 # bez zmian
│   ├── InventoryPage.ts             # usunięte cartLink/cartBadge → HeaderComponent
│   ├── CartPage.ts                  # bez zmian (Phase 1)
│   └── CheckoutPage.ts              # bez zmian (Phase 1)
├── tests/
│   └── smoke/
│       ├── login.smoke.spec.ts
│       ├── shopping.smoke.spec.ts   # un-skip
│       └── checkout.smoke.spec.ts   # un-skip + implementacja
├── playwright.config.ts
└── …
```

### 4.3 Stan docelowy — Phase 2+ (pełna architektura)

```
saucelab/
├── core/                            # Phase 2
│   ├── BasePage.ts
│   └── selectors.ts                 # opcjonalny rejestr lokatorów
├── components/
│   ├── HeaderComponent.ts
│   └── SidebarComponent.ts
├── config/
│   └── credentials.ts
├── data/
│   ├── products.ts
│   ├── checkout-data.ts
│   ├── checkout.builder.ts          # Phase 2
│   └── users.ts                     # Phase 2 — UserFactory (6 person)
├── fixtures/
│   └── sauce.fixture.ts             # loginAs(persona), resetAppState
├── flows/
│   ├── AuthFlow.ts                  # Phase 2
│   ├── ShoppingFlow.ts
│   └── CheckoutFlow.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts       # Phase 2 — split CheckoutPage
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
├── tests/
│   ├── smoke/
│   ├── regression/                  # Phase 2
│   └── characterization/            # Phase 3
└── …
```

---

## 5. Wzorce projektowe

### 5.1 Katalog wzorców

| Wzorzec | Warstwa | Faza | Odpowiedzialność |
|---------|---------|------|------------------|
| **Page Object Model (POM)** | `pages/` | Istniejący | Enkapsulacja lokatorów i akcji jednej strony |
| **Component Pattern** | `components/` | Phase 1 | Fragmenty UI współdzielone między stronami (header, sidebar) |
| **Facade / Flow Object** | `flows/` | Phase 1 | Orkiestracja wieloetapowych journey (shopping, checkout) |
| **Fixture Pattern** | `fixtures/` | Rozszerzenie | DI obiektów testowych; setup/teardown w Playwright |
| **Factory** | `data/users.ts` | Phase 2 | Tworzenie person demo bez modyfikacji fixture |
| **Builder** | `data/checkout.builder.ts` | Phase 2 | Syntetyczne dane checkout (plan §14) |
| **Strategy** | `data/users.ts` + characterization | Phase 3 | Oczekiwania zależne od persony (glitch, problem, visual) |
| **Data-Driven** | `tests/regression/` | Phase 2 | Parametryzacja macierzy negatywnej logowania, sortowania |
| **Object Mother** | `data/` | Phase 3 | Predefiniowane stany koszyka (empty, single-item) |

### 5.2 Diagram wzorców a artefakty

```mermaid
flowchart LR
    subgraph patterns["Wzorce"]
        POM[Page Object Model]
        COMP[Component]
        FACADE[Flow / Facade]
        FIX[Fixture]
        FACT[Factory]
        BUILD[Builder]
        STRAT[Strategy]
    end

    subgraph artifacts["Artefakty kodu"]
        pages[pages/*.ts]
        comp[components/*.ts]
        flows[flows/*.ts]
        fix[fixtures/sauce.fixture.ts]
        users[data/users.ts]
        checkout[data/checkout-data.ts]
        specs[tests/**/*.spec.ts]
    end

    POM --> pages
    COMP --> comp
    FACADE --> flows
    FIX --> fix
    FACT --> users
    BUILD --> checkout
    STRAT --> users

    specs --> fix
    specs --> flows
    flows --> pages
    flows --> comp
    fix --> flows
    fix --> pages
```

### 5.3 Uzasadnienie wyboru wzorców

| Problem | Wzorzec | Dlaczego nie inaczej |
|---------|---------|---------------------|
| Lokatory rozproszone w testach | POM | Już wdrożony; industry standard dla Playwright |
| Cart badge na wielu stronach | Component | Dziedziczenie page objects komplikuje hierarchię bez korzyści |
| 5+ kroków w smoke checkout | Flow / Facade | Kopiowanie kroków w każdym spec narusza DRY i SRP testów |
| Koszyk już zapełniony na demo | Fixture + Sidebar reset | Izolacja kontekstu Playwright niewystarczająca na shared SPA |
| 6 person z różnym zachowaniem | Factory + Strategy | if/else w testach narusza OCP; characterization oddzielone od smoke |
| Dane checkout w każdym teście | Builder / stałe w `data/` | Plan §14 definiuje syntetyczne wartości; jedno źródło prawdy |

---

## 6. Zgodność z SOLID

### 6.1 Macierz SOLID × warstwa

| Zasada | `pages/` | `components/` | `flows/` | `fixtures/` | `tests/` |
|--------|----------|---------------|----------|-------------|----------|
| **S** — Single Responsibility | Jedna strona = jedna klasa | Jedna sekcja UI | Jedna ścieżka biznesowa | Jedno zestawienie DI + setup | Jedna asercja scenariusza |
| **O** — Open/Closed | Rozszerzaj nowymi metodami, nie edytuj testów | Nowy component bez zmiany pages | Nowy flow bez zmiany pages | Nowa persona = nowy fixture worker | Nowy TC = nowy plik spec |
| **L** — Liskov Substitution | Wszystkie pages przyjmują `Page` | — | — | — | — |
| **I** — Interface Segregation | Test importuje flow, nie wszystkie pages | — | Wąski publiczny API flow | Fixture typowany per potrzeba | — |
| **D** — Dependency Inversion | Zależność od `Page` (abstrakcja Playwright) | j.w. | Flow zależy od pages, nie od testów | Test zależy od fixture, nie od `Page` | — |

### 6.2 Naruszenia w stanie bieżącym i remediacja

| Naruszenie | Lokalizacja | Remediacja (faza) |
|------------|-------------|-------------------|
| SRP: `CheckoutPage` obejmuje 3 kroki checkout | `pages/CheckoutPage.ts` | Phase 2: split na 3 klasy |
| SRP: `InventoryPage` posiada cart link/badge | `pages/InventoryPage.ts` | Phase 1: `HeaderComponent` |
| OCP: tylko `loginAsStandardUser` | `fixtures/sauce.fixture.ts` | Phase 2: `loginAs(persona)` + `UserFactory` |
| DRY: brak resetu stanu | shopping/checkout specs | Phase 1: `resetAppState` w fixture |
| ISP: testy mogą importować wszystkie pages | specs | Phase 1: preferuj `shoppingFlow`, `checkoutFlow` |

---

## 7. Specyfikacja komponentów (Phase 1)

### 7.1 `HeaderComponent`

| Pole / metoda | Lokator | Uwagi |
|---------------|---------|-------|
| `title` | `[data-test="title"]` | Tekst nagłówka strony (Products, Your Cart, …) |
| `cartLink` | `.shopping_cart_link` | Brak `data-test` w aplikacji — znany stabilny selektor |
| `cartBadge` | `.shopping_cart_badge` | Widoczny tylko gdy koszyk niepusty |
| `getCartItemCount()` | odczyt `cartBadge` | Zwraca `0` gdy badge niewidoczny |

**Właścicielstwo:** elementy nagłówka obecne na inventory, cart, checkout. `InventoryPage` nie powinien duplikować tych lokatorów.

### 7.2 `SidebarComponent`

| Metoda | Zachowanie |
|--------|------------|
| `open()` | Klik `#react-burger-menu-btn` |
| `resetAppState()` | `open()` → klik `#reset_sidebar_link` |
| `logout()` | `open()` → klik `#logout_sidebar_link` |

**Migracja:** `pages/SidebarComponent.ts` → `components/SidebarComponent.ts`. Aktualizacja importów w `fixtures/sauce.fixture.ts`.

### 7.3 `ShoppingFlow`

| Metoda | Kontrakt |
|--------|----------|
| `addProductToCart(productId: string)` | Jeśli `[data-test="add-to-cart-{id}"]` widoczny — klik. Jeśli `[data-test="remove-{id}"]` — produkt już w koszyku (po resecie nie powinno wystąpić). |
| `getCartItemCount()` | Delegacja do `HeaderComponent` |

**Zależności:** `InventoryPage`, `HeaderComponent`.

### 7.4 `CheckoutFlow`

| Metoda | Kontrakt |
|--------|----------|
| `completeCheckout(productId, customer)` | `ShoppingFlow.addProductToCart` → open cart → checkout → fill → continue → finish |
| `cancelCheckout(productId)` | Phase 2 — `TC-L3-FUNC-020` |

**Zależności:** `ShoppingFlow`, `InventoryPage`, `CartPage`, `CheckoutPage`.

### 7.5 `data/products.ts`

```typescript
export const SAUCE_LABS_BACKPACK = 'sauce-labs-backpack';
// Phase 2: pozostałe 5 produktów
```

### 7.6 `data/checkout-data.ts`

| Stała | Wartość | Źródło |
|-------|---------|--------|
| `DEFAULT_CUSTOMER.firstName` | `Test` | Plan testów §14 |
| `DEFAULT_CUSTOMER.lastName` | `User` | Plan testów §14 |
| `DEFAULT_CUSTOMER.postalCode` | `12345` | Plan testów §14 |

---

## 8. Specyfikacja fixtures (Phase 1)

### 8.1 Rozszerzenie `SauceFixtures`

| Fixture | Typ | Zakres |
|---------|-----|--------|
| `loginPage` | `LoginPage` | istniejący |
| `inventoryPage` | `InventoryPage` | istniejący |
| `cartPage` | `CartPage` | istniejący |
| `checkoutPage` | `CheckoutPage` | istniejący |
| `sidebar` | `SidebarComponent` | istniejący (nowy import path) |
| `header` | `HeaderComponent` | **nowy** |
| `shoppingFlow` | `ShoppingFlow` | **nowy** |
| `checkoutFlow` | `CheckoutFlow` | **nowy** |
| `loginAsStandardUser` | `() => Promise<void>` | istniejący |
| `resetAppState` | `() => Promise<void>` | **nowy** |

### 8.2 Diagram lifecycle fixture (test mutujący)

```mermaid
stateDiagram-v2
    [*] --> NavigateLogin: test start
    NavigateLogin --> LoggedIn: loginAsStandardUser()
    LoggedIn --> StateReset: resetAppState() [shopping/checkout only]
    StateReset --> Ready: inventory loaded, cart empty
    Ready --> ExecuteFlow: shoppingFlow / checkoutFlow
    ExecuteFlow --> Assert: expect(...)
    Assert --> [*]
```

### 8.3 Konfiguracja Playwright (bez zmian w Phase 1)

| Parametr | Wartość | Uzasadnienie |
|----------|---------|--------------|
| `workers` | `1` | Współdzielone demo; unikanie race na stanie koszyka |
| `fullyParallel` | `false` | j.w. |
| `retries` | `1` (CI) / `0` (local) | Łagodzenie transient failures na publicznym demo |
| `baseURL` | `process.env.BASE_URL` | Zgodność z `.env.example` |

---

## 9. Mapowanie testów smoke (Phase 1)

| ID testu | Plik | Warstwa wywołania | Stan po Phase 1 |
|----------|------|-------------------|-----------------|
| `TC-L3-SMOKE-001` | `login.smoke.spec.ts` | `loginPage` | passed (bez zmian) |
| `TC-L3-FUNC-001` | `login.smoke.spec.ts` | `loginPage`, `inventoryPage` | passed (bez zmian) |
| `TC-L3-NEG-001` | `login.smoke.spec.ts` | `loginPage` | passed (bez zmian) |
| `TC-L3-FUNC-010` | `shopping.smoke.spec.ts` | `shoppingFlow`, `header` | **passed** (un-skip) |
| `TC-L3-SMOKE-002` | `checkout.smoke.spec.ts` | `checkoutFlow`, `checkoutPage` | **passed** (un-skip) |

### 9.1 Przykładowy kontrakt spec (po Phase 1)

Test `TC-L3-SMOKE-002` powinien mieć postać:

- `beforeEach`: `resetAppState` → `loginAsStandardUser`
- body: `checkoutFlow.completeCheckout(SAUCE_LABS_BACKPACK, DEFAULT_CUSTOMER)`
- assert: `checkoutPage.completeHeader` = `"Thank you for your order!"`

Bez jawnych lokatorów i bez powielania kroków nawigacji w spec.

---

## 10. Strategia lokatorów

### 10.1 Hierarchia preferencji

| Priorytet | Typ | Przykład | Zastosowanie |
|-----------|-----|----------|--------------|
| 1 | `data-test` | `[data-test="add-to-cart-sauce-labs-backpack"]` | Przyciski, pola checkout, tytuły |
| 2 | Stabilne ID | `#user-name`, `#login-button` | Login (brak data-test w aplikacji) |
| 3 | Semantyczna klasa | `.inventory_item`, `.cart_item` | Listy produktów |
| 4 | Klasa bez data-test | `.shopping_cart_link` | Header — brak alternatywy w DOM |

### 10.2 Polityka duplikacji (plan §13 NF6)

| Reguła | Enforcement |
|--------|-------------|
| Selektor użyty na 2+ stronach → `components/` | `HeaderComponent` |
| Selektor użyty w 1 page → `pages/` | `InventoryPage.sortDropdown` |
| Selektor użyty w 0 testów → usuń | Przegląd przy każdej fazie |

Phase 2 opcjonalnie wprowadza `core/selectors.ts` jako rejestr centralny.

---

## 11. Roadmapa implementacji

### 11.1 Phase 1 — Smoke complete (priorytet natychmiastowy)

| Krok | Zadanie | Pliki | Kryterium akceptacji |
|------|---------|-------|---------------------|
| 1.1 | Utworzenie `HeaderComponent` | `components/HeaderComponent.ts` | Kompilacja TS bez błędów |
| 1.2 | Migracja `SidebarComponent` | `components/SidebarComponent.ts` | Importy zaktualizowane |
| 1.3 | Utworzenie `data/products.ts`, `data/checkout-data.ts` | `data/*` | Stałe zgodne z planem §14 |
| 1.4 | Utworzenie `ShoppingFlow` | `flows/ShoppingFlow.ts` | Idempotentne dodawanie produktu |
| 1.5 | Utworzenie `CheckoutFlow` | `flows/CheckoutFlow.ts` | Pełny journey do complete |
| 1.6 | Rozszerzenie fixture | `fixtures/sauce.fixture.ts` | `resetAppState`, nowe fixtures |
| 1.7 | Refaktor `InventoryPage` | `pages/InventoryPage.ts` | Usunięte cart link/badge |
| 1.8 | Implementacja shopping spec | `tests/smoke/shopping.smoke.spec.ts` | `TC-L3-FUNC-010` passed |
| 1.9 | Implementacja checkout spec | `tests/smoke/checkout.smoke.spec.ts` | `TC-L3-SMOKE-002` passed |
| 1.10 | Aktualizacja README | `README.md` | Struktura katalogów zgodna z §4.2 |

**Bramka Phase 1:** `npm run test:smoke` → 5 passed, 0 skipped.

### 11.2 Phase 2 — Regression foundation

| Zadanie | Opis |
|---------|------|
| Split `CheckoutPage` | `CheckoutStepOnePage`, `CheckoutOverviewPage`, `CheckoutCompletePage` |
| `data/users.ts` | Factory 6 person; fixture `loginAs(persona)` |
| `flows/AuthFlow.ts` | Logowanie z walidacją URL |
| `tests/regression/` | Suite `@regression`; skrypt `npm run test:regression` |
| `core/BasePage.ts` | Wspólne `goto`, `waitForUrl` |
| Parametryzacja | `TC-L3-NEG-002–004`, `TC-L3-REG-001` (sort) |

**Bramka Phase 2:** `npm run test:smoke` → 5 passed; `npm run test:regression` → 25 passed. **Zrealizowano 2026-07-14.**

| Krok | Zadanie | Pliki | Stan |
|------|---------|-------|------|
| 2.1 | `core/BasePage.ts` | `core/BasePage.ts` | done |
| 2.2 | Split checkout | `CheckoutStepOnePage`, `CheckoutOverviewPage`, `CheckoutCompletePage` | done |
| 2.3 | `data/users.ts` + `AuthFlow` | `data/users.ts`, `flows/AuthFlow.ts` | done |
| 2.4 | Fixture `loginAs(persona)` | `fixtures/sauce.fixture.ts` | done |
| 2.5 | Suite regression | `tests/regression/*.spec.ts` | 25 TC |
| 2.6 | Skrypt npm | `package.json` → `test:regression` | done |
| 2.7 | Rozszerzenie regression | menu, cart, checkout, inventory | done |


### 11.3 Phase 3 — Full suite i NF

| Zadanie | Opis |
|---------|------|
| `tests/characterization/` | QUIRK-001–004 z `saucedemo-bugs.md` |
| Strategy per persona | Progi czasowe glitch; elastyczne asercje visual/error |
| ESLint + CI | GitHub Actions wg szkicu planu §13 |
| `@nf-a11y`, `@nf-performance` | Projekty Playwright per tag |

**Bramka Phase 3:** characterization 4/4 + NF 5/5 + lint green. **Zrealizowano 2026-07-14.**

| Krok | Zadanie | Pliki | Stan |
|------|---------|-------|------|
| 3.1 | Persona strategy | `data/persona-strategy.ts` | done |
| 3.2 | Characterization suite | `tests/characterization/persona.characterization.spec.ts` | 4 TC |
| 3.3 | NF performance/security/a11y | `tests/nf/*.nf.spec.ts` | 5 TC |
| 3.4 | ESLint | `eslint.config.mjs`, `npm run lint` | done |
| 3.5 | GitHub Actions | `.github/workflows/saucedemo-tests.yml` | done |

### 11.4 Phase 4 — Cross-browser (NF5)

| Zadanie | Opis |
|---------|------|
| Projekty Playwright | `chromium`, `firefox`, `webkit` w `playwright.config.ts` |
| Suite NF5 | `tests/nf/cross-browser.nf.spec.ts` — `TC-L3-NF5-001–003` |
| Izolacja chromium | Smoke/regression/characterization/NF bazowe → `--project=chromium` |
| Skrypt | `npm run test:cross-browser` — 3 TC × 3 przeglądarki |

**Bramka Phase 4:** `npm run test:cross-browser` → 9 passed (3 TC × 3 browsers).

| Krok | Zadanie | Pliki | Stan |
|------|---------|-------|------|
| 4.1 | Projekty firefox/webkit | `playwright.config.ts` | done |
| 4.2 | Testy NF5 | `tests/nf/cross-browser.nf.spec.ts` | done |
| 4.3 | Skrypt npm | `test:cross-browser` | done |
| 4.4 | CI nightly | `.github/workflows/saucedemo-tests.yml` | done |

### 11.5 Diagram roadmapy

```mermaid
gantt
    title Roadmapa automatyzacji SauceLab
    dateFormat YYYY-MM-DD
    section Phase 1
    Components + Flows + Data     :p1a, 2026-07-14, 2d
    Fixture reset + smoke specs   :p1b, after p1a, 1d
    Bramka 5/5 smoke passed       :milestone, p1m, after p1b, 0d
    section Phase 2
    Checkout split + UserFactory  :p2a, after p1m, 3d
    Regression suite              :p2b, after p2a, 5d
    section Phase 3
    Characterization + NF gates   :p3a, after p2b, 7d
```

---

## 12. Kryteria weryfikacji architektury

### 12.1 Metryki jakości (NF6)

| Metryka | Próg | Pomiar |
|---------|------|--------|
| Separacja warstw | 0 importów `tests/` → `pages/` bezpośrednich w nowych spec | grep / review |
| Duplikacja lokatorów cart | 1 właściciel (`HeaderComponent`) | code review |
| Smoke pass rate | 100% (5/5) | `npm run test:smoke` |
| Czas smoke suite | ≤ 30 s lokalnie | Playwright report |
| Flakiness (3 kolejne runy) | 0 losowych fail | manual CI check |

### 12.2 Checklist review architektonicznego

- [ ] Test nie zawiera selektorów CSS/XPath
- [ ] Flow nie zawiera asercji (asercje w spec)
- [ ] Page nie zawiera logiki wieloetapowej nawigacji
- [ ] Component nie zawiera logiki specyficznej dla jednej strony
- [ ] Fixture dostarcza reset przed mutacją na shared demo
- [ ] ID testu (`TC-L3-*`) zgodne z planem §8
- [ ] Nowa persona → nowy plik characterization, nie modyfikacja smoke

---

## 13. Ryzyka i mitigacje

| ID | Ryzyko | Prawdop. | Wpływ | Mitigacja |
|----|--------|----------|-------|-----------|
| AR-01 | Reset App State nie czyści koszyka | Niska | Wysoki | Weryfikacja na żywej aplikacji w kroku 1.6; fallback: reload + re-login |
| AR-02 | Zbyt wczesny split CheckoutPage | Średnia | Niski | Odroczenie do Phase 2 (ten dokument) |
| AR-03 | Over-engineering przed regression | Średnia | Średni | Phase 1 ograniczona do 5 nowych plików |
| AR-04 | Niespójność lokatorów login (#id) vs reszta (data-test) | Niska | Niski | Login stabilny; dokumentacja §10 |
| AR-05 | Równoległość na demo | Wysoka | Wysoki | `workers: 1` — bez zmian do odcięcia środowiska |

---

## 14. Powiązania dokumentacyjne

```mermaid
flowchart LR
    ARCH[saucedemo-automation-architecture.md]
    PLAN[saucedemo-test-plan.md]
    COV[saucedemo-coverage-matrix.md]
    BUGS[saucedemo-bugs.md]
    GENAI[saucedemo-genai-prompts.md]
    README[../README.md]

    ARCH --> PLAN
    ARCH --> COV
    ARCH --> BUGS
    GENAI --> ARCH
    README --> ARCH
    PLAN --> ARCH
```

| Dokument | Relacja |
|----------|---------|
| `saucedemo-test-plan.md` | Plan §13 POM — źródło wymagań nazw klas |
| `saucedemo-coverage-matrix.md` | Macierz A — mapowanie TC → suite → warstwa |
| `saucedemo-bugs.md` | QUIRK-* → `tests/characterization/` (Phase 3) |
| `saucedemo-genai-prompts.md` | PAT-IMPL-01 — kontekst POM dla generowania kodu |
| `README.md` | Instrukcja uruchomienia; struktura katalogów |

---

## 15. Otwarte decyzje

| # | Pytanie | Opcje | Rekomendacja |
|---|---------|-------|--------------|
| D-01 | Logout w smoke checkout? | A) Tak — pełny flow planu · B) Nie — stop na complete | **B** w Phase 1; logout jako osobny TC w Phase 2 |
| D-02 | Przeniesienie `SidebarComponent` do `components/` | A) Tak · B) Zostaw w `pages/` | **A** — zgodność z planem i SRP |
| D-03 | Split `CheckoutPage` w Phase 1 | A) Tak · B) Nie | **B** — odroczenie do Phase 2 |

---

## 16. Historia wersji

| Wersja | Data | Autor | Zmiany |
|--------|------|-------|--------|
| 1.0 | 2026-07-14 | Senior QA Architect | Wersja inicjalna — audyt scaffold, Phase 1–3, SOLID, wzorce |

---

## 17. Sign-off implementacji Phase 1

| Rola | Akcja | Data |
|------|-------|------|
| QA Architect | Dokument zatwierdzony | 2026-07-14 |
| Developer / Automation Engineer | Implementacja Phase 2 | 2026-07-14 |
| Weryfikacja Phase 4 | cross-browser 9/9 passed | 2026-07-14 |
