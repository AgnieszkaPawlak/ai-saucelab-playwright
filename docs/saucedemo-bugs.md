# SauceDemo — rejestr błędów i osobliwości

**Wersja:** 1.0  
**Data:** 2026-07-14  
**Środowisko:** https://www.saucedemo.com/  
**Powiązane:** [Plan testów](saucedemo-test-plan.md) · [Prompt planowania](saucedemo-test-planning-prompt.md)

---

## Podsumowanie

| Status | Liczba |
|--------|--------|
| Znana osobliwość (potwierdzona) | 2 |
| Znana osobliwość (nie odtworzona) | 2 |
| Podejrzewany / nowy defekt | 0 |

---

## QUIRK-001: problem_user — wszystkie obrazy produktów uszkodzone

- **Status:** Potwierdzona (znana osobliwość)
- **Persona:** problem_user
- **Poziom testów:** Systemowy
- **Typ testu:** Poprawność funkcjonalna / wizualna
- **URL / przepływ:** `/inventory.html` po zalogowaniu
- **Zaobserwowano:** Wszystkie 6 obrazów ładuje `/assets/sl-404-Cq1a9k9X.jpg` z `naturalWidth: 0`
- **Oczekiwane:** Zamierzona wada demo — obrazy pozostają uszkodzone dla tej persony
- **Dowód:** Badanie Playwright 2026-07-14
- **Wpływ:** Średni (tylko UI; dodawanie do koszyka działa)
- **Wpływ na testy:** Charakteryzacja — `TC-L3-PERS-001`

---

## QUIRK-002: performance_glitch_user — wolne logowanie

- **Status:** Potwierdzona (znana osobliwość)
- **Persona:** performance_glitch_user
- **Poziom testów:** Systemowy
- **Typ testu:** Wydajność
- **URL / przepływ:** Logowanie → inventory
- **Zaobserwowano:** Logowanie zakończone w **5081 ms** (vs ~242 ms dla `standard_user`)
- **Oczekiwane:** Sztuczne opóźnienie; inventory ostatecznie się ładuje
- **Dowód:** Badanie Playwright 2026-07-14
- **Wpływ:** Niski (scenariusz szkoleniowy)
- **Wpływ na testy:** Charakteryzacja — `TC-L3-PERS-002`; próg Założenie: ≤ 10000 ms

---

## QUIRK-003: error_user — klasa błędu ikony koszyka

- **Status:** Znana osobliwość — **nie odtworzona** (2026-07-14)
- **Persona:** error_user
- **Poziom testów:** Systemowy
- **Typ testu:** Poprawność funkcjonalna
- **URL / przepływ:** Inventory po dodaniu do koszyka
- **Zaobserwowano:** Klasa linku koszyka to tylko `shopping_cart_link` — brak klasy `error`
- **Oczekiwane (społeczność/dokumentacja):** Ikona koszyka może otrzymać klasę `error`
- **Dowód:** Badanie Playwright; może zależeć od wersji demo
- **Wpływ:** Niski
- **Wpływ na testy:** Charakteryzacja — `TC-L3-PERS-003` z elastyczną asercją; loguj wynik bez psucia suite `standard_user`

---

## QUIRK-004: visual_user — układ kontrolki sortowania

- **Status:** Znana osobliwość — **nie odtworzona** (2026-07-14)
- **Persona:** visual_user
- **Poziom testów:** Systemowy
- **Typ testu:** Regresja wizualna / użyteczność
- **URL / przepływ:** `/inventory.html`
- **Zaobserwowano:** Lista rozwijana sortowania **jest widoczna** i działa
- **Oczekiwane (społeczność/dokumentacja):** Kontrolka sortowania może być przesunięta lub niewidoczna
- **Dowód:** Playwright `visualUserSortVisible: true`
- **Wpływ:** Niski
- **Wpływ na testy:** Charakteryzacja — `TC-L3-PERS-004`; zapisz baseline screenshot do porównań

---

## Notatki z badania (Fakty)

| Element | Wartość |
|---------|---------|
| Komunikat `locked_out_user` | `Epic sadface: Sorry, this user has been locked out.` |
| Walidacja checkout (puste pola) | `Error: First Name is required` |
| Podatek od $29.99 | $2.40 (~8%) |
| Sieć SPA | Tylko HTML + JS + CSS; brak publicznego REST API |

---

## Historia zmian

| Data | Zmiana |
|------|--------|
| 2026-07-14 | Początkowy rejestr po badaniu na żywo |
