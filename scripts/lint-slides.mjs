#!/usr/bin/env node
/**
 * Linter для slides.md + slides/*.md
 *
 * Адаптировано из report-logs-collection-in-ai-era под структуру с src:-импортами.
 *
 * ПРАВИЛА:
 * - В тексте (вне code-блоков) используются ТОЛЬКО кавычки-ёлочки « »
 * - В тексте используется СРЕДНЕЕ тире – (en dash, U+2013), не дефис и не длинное —
 * - В code-блоках разрешены любые символы (синтаксис языка)
 * - Запрещён text-gray-* (кроме подсветки кода)
 *
 * Запуск:
 *   node scripts/lint-slides.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = process.cwd()
const SLIDES_MD = resolve(ROOT, 'slides.md')
const SLIDES_DIR = resolve(ROOT, 'slides')

// Собираем все файлы для проверки: slides.md + slides/*.md
const filesToLint = []

if (existsSync(SLIDES_MD)) {
  filesToLint.push({ path: SLIDES_MD, rel: 'slides.md' })
} else {
  console.error(`✗ Файл не найден: ${SLIDES_MD}`)
  process.exit(2)
}

if (existsSync(SLIDES_DIR)) {
  const slideFiles = readdirSync(SLIDES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
  for (const f of slideFiles) {
    filesToLint.push({ path: join(SLIDES_DIR, f), rel: `slides/${f}` })
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────

function isTextLine(line, inCodeBlock) {
  return !inCodeBlock
}

// Регэксп для поиска HTML-атрибутов: <tag attr="value"> или v-if="..."
const HTML_ATTR_REGEX = /(\s\w+|\s[:@v-][\w-]+)="[^"]*"/g
// Регэксп для инлайн-кода: `code`
const INLINE_CODE_REGEX = /`[^`]*`/g

const FORBIDDEN_IN_TEXT = [
  { ch: '\u201C', name: 'левая smart-кавычка', replacement: '«' },
  { ch: '\u201D', name: 'правая smart-кавычка', replacement: '»' },
  { ch: '\u2018', name: 'левая одинарная кавычка', replacement: "'" },
  { ch: '\u2019', name: 'правая одинарная кавычка', replacement: "'" },
  // Прямую " не запрещаем жёстко — она часто в HTML-атрибутах и в speaker notes
  // Длинное тире — тоже не запрещаем жёстко (стиль r3code может его использовать)
]

// ─── прогон по каждому файлу ─────────────────────────────────────────────

let totalErrors = 0
let totalWarnings = 0
const perFileReport = []

for (const { path: filePath, rel } of filesToLint) {
  const src = readFileSync(filePath, 'utf8')
  const lines = src.split('\n')
  const errors = []
  const warnings = []

  function addError(line, msg) { errors.push(`  L${line + 1}: ✗ ${msg}`) }
  function addWarning(line, msg) { warnings.push(`  L${line + 1}: ⚠ ${msg}`) }

  // ─── 1. Frontmatter (только для slides.md и первых слайдов) ─────────
  const fmMatch = src.match(/^---\n([\s\S]*?)\n---/)
  if (fmMatch) {
    const fm = fmMatch[1]
    if (rel === 'slides.md') {
      // Главный файл: проверяем обязательные поля
      const required = ['theme:', 'title:']
      for (const key of required) {
        if (!fm.includes(key)) {
          errors.push(`  ✗ Frontmatter: отсутствует поле "${key}"`)
        }
      }
      // theme может быть default или r3code (или любой другой) — не проверяем жёстко
      if (!fm.includes('drawings:')) {
        warnings.push('  ⚠ Frontmatter: нет блока drawings (рекомендуется drawings.persist: false)')
      }
    }
  }

  // ─── 2. Отслеживание code-блоков, SpeakerNotes и HTML-комментариев ───
  let inCodeBlock = false
  let inHtmlComment = false
  const textLines = []

  lines.forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }
    // Многострочные HTML-комментарии (используются для speaker notes)
    if (/<!--/.test(line) && !/-->/.test(line)) {
      inHtmlComment = true
      return
    }
    if (inHtmlComment) {
      if (/-->/.test(line)) inHtmlComment = false
      return
    }
    // Однострочный <!-- ... -->
    if (/<!--.*-->/.test(line)) return

    if (!inCodeBlock) {
      textLines.push({ line: i, text: line })
    }
  })

  // ─── 3. Проверка кавычек ВНЕ code-блоков ─────────────────────────────
  textLines.forEach(({ line, text }) => {
    const cleaned = text
      .replace(HTML_ATTR_REGEX, '')
      .replace(INLINE_CODE_REGEX, '')

    for (const { ch, name, replacement } of FORBIDDEN_IN_TEXT) {
      if (cleaned.includes(ch)) {
        addError(line, `Запрещённый символ "${name}" в тексте — замените на ${replacement}`)
      }
    }
  })

  // ─── 4. Проверка speaker notes (для файлов слайдов) ─────────────────
  if (rel.startsWith('slides/')) {
    if (!src.includes('Примечание спикера')) {
      warnings.push('  △ Не найден блок "Примечание спикера" (рекомендуется для каждого слайда)')
    }
  }

  // ─── 5. Запрет text-gray-* ──────────────────────────────────────────
  textLines.forEach(({ line, text }) => {
    const grayMatch = text.match(/text-gray-(?:50|100|200|300|400|500|600|700|800|900)/g)
    if (grayMatch) {
      addError(line, `Запрещён серый цвет: ${grayMatch.join(', ')}`)
    }
  })

  // ─── 6. Плейсхолдеры изображений без комментария ────────────────────
  textLines.forEach(({ line, text }) => {
    if (/!\[.*\]\(.*assets.*\)/.test(text)) {
      // Проверяем, что в следующих 1-2 строках есть комментарий ЗАМЕНИТЬ
      const nextLines = lines.slice(line + 1, line + 3).join('\n')
      if (!/ЗАМЕНИТЬ/.test(nextLines)) {
        warnings.push(`  L${line + 1}: ⚠ Плейсхолдер изображения без комментария "ЗАМЕНИТЬ НА ..."`)
      }
    }
  })

  perFileReport.push({ rel, errors, warnings, slideCount: src.split('\n---\n').length })
  totalErrors += errors.length
  totalWarnings += warnings.length
}

// ─── Глобальные проверки slides.md ──────────────────────────────────────

const mainSrc = readFileSync(SLIDES_MD, 'utf8')

// Должны быть импорты слайдов через src:
const importCount = (mainSrc.match(/^src:\s*\.\//gm) || []).length
if (importCount < 5) {
  totalWarnings++
  perFileReport[0].warnings.push(`  ⚠ slides.md: мало src:-импортов (${importCount}). Ожидалось 12`)
}

// ─── Report ──────────────────────────────────────────────────────────────

console.log('\n── Lint slides ─────────────────────────────────────────')
console.log(`Файлов проверено: ${filesToLint.length}`)
console.log(`Errors:   ${totalErrors}`)
console.log(`Warnings: ${totalWarnings}`)
console.log('')

for (const { rel, errors, warnings, slideCount } of perFileReport) {
  console.log(`── ${rel} (слайдов: ~${slideCount}) ──`)
  if (warnings.length) {
    warnings.forEach(w => console.log(w))
  }
  if (errors.length) {
    errors.forEach(e => console.log(e))
  }
  if (!warnings.length && !errors.length) {
    console.log('  ✓ OK')
  }
  console.log('')
}

if (totalErrors > 0) {
  console.log(`✗ Линтер упал с ${totalErrors} ошибками\n`)
  process.exit(1)
}

console.log('✓ Линтер прошёл без ошибок\n')
process.exit(0)
