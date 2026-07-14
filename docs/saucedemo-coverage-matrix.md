# SauceDemo — macierze śledzenia pokrycia

**Wersja:** 1.0  
**Data:** 2026-07-14  
**Powiązane:** [Plan testów §9](saucedemo-test-plan.md) · [Inwentarz testów](saucedemo-test-plan.md#8-inwentarz-przypadków-testowych-85-przypadków)

---

## Macierz A — Poziom × Obszar funkcjonalny

W komórkach — reprezentatywne ID TC (pełny zestaw w planie §8).

| Obszar | L1 Komponentowy | L2 Integracyjny | L3 Systemowy | L4 Akceptacyjny |
|--------|-----------------|-----------------|--------------|-----------------|
| **Logowanie** | TC-L1-WBOX-004 | TC-L2-INTG-001, TC-L2-GRYB-003 | TC-L3-FUNC-001, TC-L3-NEG-001–004, TC-L3-NF1-001, TC-L3-S1-001, TC-L3-SEC-001–002, TC-L3-SMOKE-002 | TC-L4-UAT-001, TC-L4-OPS-001 |
| **Inventory** | TC-L1-WBOX-003 | TC-L2-INTG-003 | TC-L3-FUNC-002–013, TC-L3-PERS-001/004, TC-L3-S2-001/002, TC-L3-NF5-*, TC-L3-NF8-001, TC-L3-REG-* | TC-L4-UAT-002 |
| **Koszyk** | — | TC-L2-INTG-002, TC-L2-INTG-004 | TC-L3-FUNC-004,014, TC-L3-NEG-008, TC-L3-PERS-003, TC-L3-T3-001 | TC-L4-UAT-003 |
| **Checkout** | TC-L1-COMP-001, TC-L1-COMP-002 | TC-L2-API-002 (design) | TC-L3-FUNC-005–008,019–020, TC-L3-NEG-005–007, TC-L3-S6-001, TC-L3-SEC-003 | TC-L4-UAT-001, TC-L4-OPS-002 |
| **Menu/Sesja** | — | TC-L2-INTG-003 | TC-L3-FUNC-015–018, TC-L3-NF2-001/002, TC-L3-T5-001 | TC-L4-OPS-001 |

**Reguła pokrycia:** Brak pustych komórek — L1 jako design only przy braku kodu źródłowego.

---

## Macierz B — Typ testu × Obszar

| Obszar | T1 Statyczny | T7 Funkcjonalny | T11 Regresja | T13 Smoke | NF1 Wydajność | NF4 Bezpieczeństwo | S1 Dostępność | S2 Wizualny | S3 API |
|--------|--------------|-----------------|--------------|-----------|---------------|-------------------|---------------|-------------|--------|
| Logowanie | P | E | E | E | E | P | E | — | D |
| Inventory | P | E | E | E | P | — | P | E | D |
| Koszyk | — | E | E | E | — | — | — | — | D |
| Checkout | P | E | E | E | — | P | E | — | D |
| Menu | P | E | E | — | — | — | — | — | — |
| **API (globalnie)** | — | — | — | — | — | — | — | — | D |

**Legenda:** P = zaplanowane w strategii · E = wykonywalne w fazie 1 (Runnable now) · D = tylko projekt (design only)

---

## Macierz C — Technika × Warunek testowy

| Warunek testowy | TK1 EP | TK2 BVA | TK3 Tabela decyzji | TK4 Przejścia stanów | TK5 Use case | TK6 Drzewo klasyf. | TK7 Pairwise | TK8 Domena |
|-----------------|--------|---------|-------------------|----------------------|--------------|-------------------|--------------|------------|
| Poprawne logowanie standard | ✓ | | ✓ | ✓ | ✓ | | | |
| Zablokowane logowanie | ✓ | | ✓ | ✓ | ✓ | | | |
| Niepoprawne/puste dane logowania | ✓ | ✓ | ✓ | | | | | |
| Dodaj/usuń z koszyka | ✓ | ✓ | | ✓ | ✓ | | | |
| Walidacja pól checkout | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| Poprawność podatku/sumy | | | | | ✓ | | | ✓ |
| Sortowanie (4 tryby) | | | | ✓ | ✓ | ✓ | | ✓ |
| Cross-browser/viewport | | | | | | ✓ | ✓ | |
| Charakteryzacja person | ✓ | | | ✓ | ✓ | ✓ | | |
| Hipotetyczne API (design) | | | | | | | | TK11 |

---

## Macierz D — Aktywność GenAI × Proces testowy ISTQB

| Aktywność procesu | Wzorzec GenAI | CT-GenAI § | Brama weryfikacji człowieka | Metryka |
|-------------------|---------------|------------|----------------------------|---------|
| Planowanie testów | PAT-ANALYSIS-01 (szkic) | 2.2.1 | Architekt zatwierdza plan | Relevance |
| Analiza testów | PAT-ANALYSIS-01 | 2.2.1 | Tester vs aplikacja na żywo | Accuracy |
| Projektowanie testów | PAT-DESIGN-01, PAT-DESIGN-02 | 2.2.2 | Przegląd macierzy pokrycia | Recall, Diversity |
| Implementacja testów | PAT-IMPL-01 | 2.2.3 | Zielony przebieg lokalny | Execution success rate |
| Wybór regresji | PAT-REG-01 | 2.2.3 | Architekt zatwierdza zakres | Precision |
| Monitorowanie testów | PAT-REPORT-01 | 2.2.4 | Lider weryfikuje liczby | Time efficiency |
| Zakończenie testów | PAT-REPORT-01 | 2.2.4 | Sign-off | Accuracy |
| Progi NF | PAT-NF-01 | 2.2.2 | Architekt zatwierdza progi | Relevance |

---

## Macierz E — Pokrycie kategorii typów testów (A–I)

| Kategoria | Reprezentatywne TC | Minimum spełnione? |
|-----------|-------------------|-------------------|
| A Statyczny/Dynamiczny | TC-L3-STAT-001, TC-L3-FUNC-001 | ✓ |
| B Black/White/Grey box | TC-L3-T3-001, TC-L1-WBOX-*, TC-L3-T5-001 | ✓ |
| C Funkcjonalny T6–T9 | TC-L3-FUNC-*, TC-L4-UAT-* | ✓ |
| D Zmiany T10–T14 | TC-L3-REG-*, TC-L3-SMOKE-*, TC-L3-SAN-001 | ✓ |
| E Doświadczeniowy T15–T17 | TC-L3-EXPL-*, TC-L3-CHK-001 | ✓ |
| F Techniki TK1–TK8 | Macierz C | ✓ |
| G White-box TK9–TK11 | TC-L1-*, TC-L2-API-* (design) | ✓ |
| H NF1–NF8 | TC-L3-NF*, TC-L3-PERS-002 | ✓ |
| I Specjalistyczne S1–S8 | TC-L3-S*, TC-L3-SEC-*, TC-L4-CONT-001 | ✓ |

---

## Macierz F — Warstwowanie suite’ów (utrzymywalność)

| Suite | Liczba | Prefiks / lista ID TC |
|-------|--------|------------------------|
| **Smoke** | 15 | SMOKE-*, FUNC-001–004, FUNC-010, FUNC-020, NEG-001–002, INTG-001–002, REG-001, UAT-001 |
| **Regression** | 55 | Smoke + FUNC-005–019, NEG-003–008, PERS-001–004, NF1-001, NF2-*, NF5-001, S1-001, SEC-001, REG-002, itd. |
| **Full** | 85 | Cały inwentarz §8 |

Smoke ⊂ Regression ⊂ Full — dokumentacja do wyboru jobów CI.

---

## Wyzwalacze aktualizacji (kiedy rewizja macierzy)

| Wyzwalacz | Działanie |
|-----------|-----------|
| Zmiana katalogu/cen SauceDemo | Aktualizuj macierz A/C, TC FUNC, przykłady Gherkin |
| Nowa osobliwość persony | Aktualizuj TC PERS, saucedemo-bugs.md |
| Odkrycie REST API | Komórki S3 z D na E; dodaj TC L2 API |
| Zmiana narzędzia (np. Selenium) | Tylko kolumna narzędzia w macierzy D |
| Odroczenie interesariusza | Oznacz komórkę macierzy B; nie usuwaj wiersza |

---

## Historia zmian

| Wersja | Data | Zmiana |
|--------|------|--------|
| 1.0 | 2026-07-14 | Wersja początkowa |
| 1.1 | 2026-07-14 | Tłumaczenie na polski |
