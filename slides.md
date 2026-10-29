---
theme: r3code-tech
title: 'Как мы сократили стоимость хранения логов в 4.5 раза с ClickHouse и Vector'
info: 'Доклад Дмитрия Синявского · SRE'
routeAlias: cover
drawings:
  persist: false
export:
  showProgress: false
highlighter:
  theme: vitesse-light
favicon: /favicon.png
fonts:
  sans: 'Noto Sans'
  mono: 'Fira Code'
layout: cover
logo: true
version: __VERSION__
---

# Как мы сократили стоимость хранения логов в 4.5 раза

### ClickHouse + Vector вместо EFK

<div class="pt-8">
  <span class="text-xl opacity-70">Дмитрий Синявский · SRE</span>
</div>

<div class="pt-4 text-sm opacity-70">

Масштаб: 3.8 ТБ/день · 200+ сервисов · 4 кластера K8s (800+ нод)

</div>

<!--
Всем привет! Сегодня расскажу, как мы полностью переехали с EFK-стека на ClickHouse и Vector. Контекст: почти 4 терабайта логов в день, двести с лишним микросервисов, четыре кластера Kubernetes с восемью сотнями нод. Результат — стоимость хранения упала в 4.5 раза, время хранения выросло с 5 часов до недель, и мы получили фундамент для AI-аналитики. Будет техническая начинка, бизнес-цифры и пара историй про грабли. Поехали.
-->

---
src: ./slides/02-pain-efk.md
---

---
src: ./slides/03-business-tco-fte.md
---

---
src: ./slides/04-architecture-ulp.md
---

---
src: ./slides/05-foundation-ai.md
---

---
src: ./slides/06-k8s-annotations.md
---

---
src: ./slides/07-dev-no-space-left.md
---

---
src: ./slides/08-dynamic-ttl.md
---

---
src: ./slides/09-imperial-bug.md
---

---
src: ./slides/10-metrics-generation.md
---

---
src: ./slides/11-results-principles.md
---

---
src: ./slides/12-final-qr.md
---
