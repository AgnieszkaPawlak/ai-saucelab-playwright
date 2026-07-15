# SauceLab — dokumentacja

**Język repozytorium:** polski (dokumentacja, plany, prompty).  
Identyfikatory testów, Gherkin, kod i komunikaty aplikacji pozostają po angielsku.

## Pliki

| Plik | Opis |
|------|------|
| [saucedemo-automation-architecture.md](saucedemo-automation-architecture.md) | Architektura automatyzacji (warstwy, wzorce, SOLID, roadmapa) |
| [saucedemo-test-planning-prompt.md](saucedemo-test-planning-prompt.md) | Prompt do generowania strategii testów |
| [saucedemo-test-plan.md](saucedemo-test-plan.md) | Plan i strategia testów (85 przypadków) |
| [saucedemo-bugs.md](saucedemo-bugs.md) | Błędy i osobliwości person |
| [saucedemo-genai-prompts.md](saucedemo-genai-prompts.md) | Biblioteka promptów GenAI (ISTQB CT-GenAI) |
| [saucedemo-visual-regression-prompt.md](saucedemo-visual-regression-prompt.md) | Prompt implementacji visual regression (S2-001/002) |
| [saucedemo-component-testing-prompt.md](saucedemo-component-testing-prompt.md) | Prompt planowania i implementacji component testing (COMP-001..008) |
| [saucedemo-coverage-matrix.md](saucedemo-coverage-matrix.md) | Macierze pokrycia |

**Aplikacja:** [SauceDemo (Swag Labs)](https://www.saucedemo.com/)

## Powiązania między dokumentami

```
saucedemo-test-planning-prompt.md  →  generuje / aktualizuje
        ↓
saucedemo-test-plan.md  ←→  saucedemo-bugs.md
        ↓                        ↓
saucedemo-automation-architecture.md   saucedemo-coverage-matrix.md
        ↑
saucedemo-genai-prompts.md
```
