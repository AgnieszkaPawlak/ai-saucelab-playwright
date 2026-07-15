# SauceDemo — biblioteka wzorców promptów GenAI

**Wersja:** 1.0  
**Data:** 2026-07-14  
**Framework:** ISTQB CT-GenAI v1.1 §2.1.1 (prompty 6-składnikowe)  
**Powiązane:** [Plan testów](saucedemo-test-plan.md) · [Prompt planowania](saucedemo-test-planning-prompt.md)

---

## Zasady użycia

1. Używaj **wyłącznie zatwierdzonych** wzorców poniżej (polityka Shadow AI — CT-GenAI §5.1.1).
2. **Weryfikuj ręcznie** wszystkie wyniki na żywo na https://www.saucedemo.com/ przed dodaniem do inwentarza testów.
3. Oceniaj metrykami: Accuracy, Precision, Recall, Relevance, Diversity, Execution success rate, Time efficiency (§2.3.1).
4. Preferuj **prompt chaining** przy pracy wieloetapowej; **few-shot** dla Gherkin; **meta prompting** tylko do szablonów.

---

## PAT-ANALYSIS-01 — Warunki testowe z UI na żywo

| Składnik | Treść |
|----------|-------|
| **Rola** | Starszy analityk testów; zgodność z ISTQB Foundation |
| **Kontekst** | SauceDemo (Swag Labs) — publiczne demo e-commerce pod https://www.saucedemo.com/. Sześć person na stronie logowania. Brak kodu źródłowego. Fakty z badania: 6 produktów, podatek checkout ~8%, SPA bez REST API. |
| **Instrukcja** | Wyprowadź uporządkowane warunki testowe dla obszaru funkcjonalnego z Input data. Użyj partycji równoważności i przejść stanów. Oznacz każdy warunek jako Fakt lub Założenie. |
| **Dane wejściowe** | Obszar: `{FEATURE}` (np. Login, Cart, Checkout). Opcjonalnie: opis screenshotu lub ścieżka URL. |
| **Ograniczenia** | Nie wymyślaj endpointów API ani tabel DB. Nie zakładaj naprawy osobliwości problem_user/error_user/visual_user na ścieżce standard_user. Dołącz co najmniej jeden warunek NF lub bezpieczeństwa na obszar. |
| **Format wyjścia** | Tabela Markdown: ID, Warunek, Priorytet (P0–P3), Technika (TK1–TK8), Fakt/Założenie, Runnable now / Design only |

**Technika:** Prompt chaining (krok 1: analiza → projekt)

---

## PAT-DESIGN-01 — Generowanie przypadków testowych funkcjonalnych

| Składnik | Treść |
|----------|-------|
| **Rola** | Projektant testów tworzący wykonywalne przypadki dla SauceDemo |
| **Kontekst** | Katalog: Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings() T-Shirt (Red) $15.99. Hasło: secret_sauce. Reset App State między testami mutującymi stan. |
| **Instrukcja** | Wygeneruj przypadki testowe dla podanych warunków. Każdy przypadek mapuje poziom (L1–L4), typ testu i technikę. |
| **Dane wejściowe** | Tabela warunków z PAT-ANALYSIS-01. Persona docelowa: `{PERSONA}` (domyślnie standard_user). |
| **Ograniczenia** | Pola minimum: ID `TC-L{n}-{TYPE}-{seq}`, Preconditions, Steps, Expected, Tool (domyślnie Playwright), Feasibility. Bez duplikatów ID. |
| **Format wyjścia** | Tabela zgodna z §8 inwentarza w saucedemo-test-plan.md |

**Technika:** Prompt chaining (krok 2 po analizie)

**Brama weryfikacji:** Architekt przegląda macierz pokrycia; ≥90% kroków zgodnych z UI na próbce.

---

## PAT-DESIGN-02 — Scenariusze Gherkin (few-shot)

| Składnik | Treść |
|----------|-------|
| **Rola** | Projektant testów BDD |
| **Kontekst** | Testy akceptacyjne SauceDemo; tagi @L3, @functional, @regression, @persona, @nf-* |
| **Instrukcja** | Napisz scenariusze Gherkin dla podanej user story lub listy warunków. |
| **Dane wejściowe** | **Few-shot:** (1) Login standard_user → inventory; (2) locked_out_user → Epic sadface; (3) Pusty checkout → First Name required. **Nowe:** `{USER_STORY_OR_CONDITION}` |
| **Ograniczenia** | Tylko Given/When/Then; bez kodu; komunikaty błędów z aplikacji dosłownie gdy Fakt. |
| **Format wyjścia** | Bloki Gherkin z tagami |

**Technika:** Few-shot prompting (CT-GenAI §2.1.2)

---

## PAT-IMPL-01 — Skrypt Playwright z przypadku testowego

| Składnik | Treść |
|----------|-------|
| **Rola** | Inżynier automatyzacji — Playwright + TypeScript + POM |
| **Kontekst** | POM: LoginPage, InventoryPage, CartPage, CheckoutPage, SidebarComponent, HeaderComponent. BASE_URL z env. Dane logowania z env. Preferuj atrybuty data-test. |
| **Instrukcja** | Zaimplementuj jeden test Playwright dla podanego ID przypadku. Dołącz reset/cleanup w afterEach lub na końcu testu. |
| **Dane wejściowe** | Wiersz przypadku: `{TC_ID}` z saucedemo-test-plan.md §8 |
| **Ograniczenia** | Bez hasła w repo; process.env. Asercje względne przy sortowaniu. Nie psuj testów standard_user przez osobliwości person. |
| **Format wyjścia** | Jeden plik `.spec.ts` z jednym test() |

**Technika:** Few-shot + prompt strukturalny

**Brama weryfikacji:** Execution success rate — skrypt przechodzi lokalnie bez modyfikacji.

---

## PAT-REG-01 — Analiza wpływu regresji

| Składnik | Treść |
|----------|-------|
| **Rola** | Lider testów — analiza wpływu zmiany |
| **Kontekst** | Suite smoke (15 TC) ⊂ regression (55) ⊂ full (85). Opis zmiany od użytkownika. |
| **Instrukcja** | Wypisz które TC z §8 uruchomić po zmianie, P0 pierwsze. Nowe TC tylko przy luce w pokryciu. |
| **Dane wejściowe** | Zmiana: `{CHANGE_DESCRIPTION}` (np. „zaktualizowano copy walidacji checkout”) |
| **Ograniczenia** | Bez load/stress na publicznym demo. Sprawdź macierze A–D. |
| **Format wyjścia** | Tabela: TC ID, Uruchomić? (T/N), Priorytet, Uzasadnienie |

**Technika:** Prompt chaining + model reasoning (§5.1.3)

**Brama weryfikacji:** Architekt zatwierdza zakres przed CI.

---

## PAT-REPORT-01 — Podsumowanie przebiegu testów

| Składnik | Treść |
|----------|-------|
| **Rola** | Reporter podsumowujący wyniki CI dla interesariuszy |
| **Kontekst** | Raport Playwright JSON lub junit XML. KPI: smoke ≥98%, regression ≥95%, a11y critical = 0. |
| **Instrukcja** | Podsumuj pass/fail, flaky, nowe defekty, wyniki charakteryzacji person, status KPI. |
| **Dane wejściowe** | Fragment raportu: `{REPORT_DATA}` |
| **Ograniczenia** | Nie wymyślaj failureów. Podejrzane defekty w formacie saucedemo-bugs.md. |
| **Format wyjścia** | Executive summary (5 punktów) + tabela failureów + rekomendacje |

**Technika:** Prompt strukturalny (CT-GenAI §2.2.4)

**Brama weryfikacji:** Lider weryfikuje liczby z dashboardu CI.

---

## PAT-NF-01 — Propozycja progów niefunkcjonalnych

| Składnik | Treść |
|----------|-------|
| **Rola** | Architekt testów wydajności / dostępności |
| **Kontekst** | Baseline: standard_user login ~242 ms; performance_glitch_user ~5081 ms. Delikatne obciążenie na współdzielonym demo. |
| **Instrukcja** | Zaproponuj progi liczbowe dla podmetryk NF1–NF8. Oznacz Założenie gdy brak baseline. |
| **Format wyjścia** | Tabela: ID NF, Metryka, Próg, Narzędzie, Założenie? (T/N) |

**Technika:** Zero-shot ze strukturalnym wyjściem

**Kontrola bias:** NF4 i S1 nie mogą być niedoreprezentowane (§3.1.2).

---

## Wybór techniki promptowania (referencja)

| Zadanie | Technika |
|---------|----------|
| Analiza → Projekt → Inwentarz | Prompt chaining |
| Gherkin, przykłady Playwright | Few-shot |
| Szablony tabel | Meta prompting |

---

## Wybór LLM (§5.1.3)

| Wzorzec | Zalecana klasa modelu |
|---------|----------------------|
| PAT-ANALYSIS-01, PAT-DESIGN-01 | Instruction-tuned |
| PAT-REG-01 | Reasoning |
| PAT-IMPL-01 | Instruction-tuned z kodem |
| PAT-VISUAL-01 | Instruction-tuned z kodem (visual snapshots) — [saucedemo-visual-regression-prompt.md](saucedemo-visual-regression-prompt.md) |
| PAT-COMP-01 | Reasoning (planowanie strategii) — [saucedemo-component-testing-prompt.md](saucedemo-component-testing-prompt.md) |
| PAT-COMP-02 | Instruction-tuned z kodem (UI component contracts) — [saucedemo-component-testing-prompt.md](saucedemo-component-testing-prompt.md) |
| PAT-REPORT-01 | Instruction-tuned |

---

## Wersjonowanie

| Wersja | Data | Zmiana |
|--------|------|--------|
| 1.0 | 2026-07-14 | Początkowa biblioteka dla planu SauceDemo |
| 1.1 | 2026-07-14 | PAT-VISUAL-01 — visual regression S2-001/002 |
| 1.2 | 2026-07-14 | PAT-COMP-01/02 — component testing COMP-001..008 |
| 1.1 | 2026-07-14 | Tłumaczenie na polski |
