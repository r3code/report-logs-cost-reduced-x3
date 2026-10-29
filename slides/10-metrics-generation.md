---
layout: two-column
clicks: 4
---

# Побочный эффект: генерация метрик

<ul class="progressive">
  <li v-show="$clicks >= 0" :class="{ active: $clicks === 0 }">Раньше: копипаст VRL-кода для метрик каждого сервиса</li>
  <li v-show="$clicks >= 1" :class="{ active: $clicks === 1 }">Теперь: единый metrics-catalog.yml → Ansible/Jinja</li>
  <li v-show="$clicks >= 2" :class="{ active: $clicks === 2 }">Время на добавление метрики: 5 часов → 20 минут</li>
  <li v-show="$clicks >= 3" :class="{ active: $clicks === 3 }">Единый источник истины, ноль рассинхрона</li>
</ul>

::right::

<div class="pl-4">

```yaml
# metrics-catalog.yml — генерация
# VRL-правил и SQL-схем через Jinja
services:
  - name: billing
    metrics:
      - http_request_duration_seconds
      - payment_errors_total
    ttl_hours: 720
```

</div>

<!--
Приятный побочный эффект архитектуры. Раньше добавление метрик для нового сервиса — это копипаст VRL-кода, ручная правка трансформов, синхронизация SQL-схемы. Пять часов работы и высокий риск ошибиться. Теперь у нас единый каталог — metrics-catalog.yml. Из него Ansible с Jinja-шаблонами генерирует и VRL-правила для Vector, и DDL для ClickHouse. Время — 20 минут на новый сервис. Один источник истины, ноль рассинхрона между конфигами. Это и есть инженерная культура: автоматизируй рутину, освобождай время для задач посложнее.
-->
