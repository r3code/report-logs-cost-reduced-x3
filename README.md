# Как мы сократили стоимость хранения логов в 4.5 раза с ClickHouse и Vector

Презентация на Slidev. 12 слайдов, тема `r3code`, структура — `slides.md` + `slides/*.md`.

**Спикер:** Дмитрий Синявский, SRE

## Локальный запуск

```bash
pnpm install
pnpm dev      # http://localhost:3030
```

## Сборка

```bash
pnpm build            # статика в dist/
pnpm build:pages      # статика с --base /report-logs-cost-reduced-x3/ для GitHub Pages
```

## Экспорт

```bash
pnpm export-pdf       # PDF (нужен Chromium: npx playwright install --with-deps chromium)
pnpm exec slidev export --format png --per-slide   # PNG по слайдам
```

## CI/CD (GitHub Actions)

| Workflow | Триггер | Что делает |
|---|---|---|
| `deploy.yml` | push в `main` | Build + деплой на GitHub Pages |
| `lint.yml` | push в `main` / PR | Проверка slides.md и slides/*.md |
| `export-pdf.yml` | `workflow_dispatch` | Экспорт в PDF (artifact) |
| `export-pptx.yml` | `workflow_dispatch` | Экспорт в PPTX через PNG (artifact) |

### Активация GitHub Pages (один раз)

После первого пуша в `main`:

1. Откройте **Settings → Pages** в репозитории
2. **Source:** `GitHub Actions` (не `Deploy from a branch`)
3. Готово — следующий push в `main` задеплоит слайды на:
   `https://r3code.github.io/report-logs-cost-reduced-x3/`

### Ручной экспорт PDF/PPTX

1. Вкладка **Actions** в репозитории
2. Слева выберите `Export PDF` или `Export PPTX (images)`
3. Кнопка **Run workflow** → выберите ветку `main` → **Run**
4. После завершения — скачайте artifact `slides-pdf` или `slides-pptx`

## Структура

```
slides.md              ← главный файл (тема r3code, 12 src:-импортов)
slides/                ← по одному .md на слайд
  01-title-hook.md
  02-pain-efk.md
  ...
  12-final-qr.md
assets/                ← изображения (плейсхолдеры)
.github/workflows/     ← CI
scripts/lint-slides.mjs← линтер
```

## Плейсхолдеры

На слайдах 02, 04, 12 — плейсхолдеры изображений в `assets/`:
- `02-cost-growth.png` — график роста затрат
- `04-architecture.png` — схема архитектуры ULP
- `12-qr-code.png` — QR-код на Starter Pack

Замените их реальными изображениями перед публикацией.

## Версия

CI инжектит `__VERSION__` (формат `YYYYMMDD rev. <sha>`) в `slides.md` и `slides/*.md` при сборке. Плейсхолдер находится на титульном слайде (`slides/01-title-hook.md`).
