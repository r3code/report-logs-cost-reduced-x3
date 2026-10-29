---
layout: default
clicks: 4
---

# Фундамент для AI и автоматизации

<ul class="progressive">
  <li v-show="$clicks >= 0" :class="{ active: $clicks === 0 }">Переход от хаоса к строгой схеме OTel Logs Data Model</li>
  <li v-show="$clicks >= 1" :class="{ active: $clicks === 1 }">Структурированные данные в ClickStack — Attributes, Resource</li>
  <li v-show="$clicks >= 2" :class="{ active: $clicks === 2 }">AI-ассистенты через MCP делают точные SQL-запросы</li>
  <li v-show="$clicks >= 3" :class="{ active: $clicks === 3 }">Поиск и анализ логов ускоряется в разы, без галлюцинаций</li>
</ul>

<div class="mt-4">

```sql
SELECT body,
       attributes['service.name'] AS service,
       resource['host.name']      AS host
FROM logs
WHERE attributes['http.status_code'] = '500'
  AND timestamp > now() - INTERVAL 1 HOUR
ORDER BY timestamp DESC
```

</div>

<!--
Почему это важно для AI? Раньше логи были неструктурированным текстом — ассистенты могли только "гадать" по содержимому и галлюцинировать. Теперь — строгая схема OpenTelemetry Logs Data Model: каждая запись имеет Timestamp, Body, Attributes и Resource. Структурированные данные в ClickStack позволяют AI-ассистентам через Model Context Protocol — MCP — выполнять точные и молниеносные SQL-запросы к конкретным полям. Не "похоже на ошибку", а конкретно: дай мне все 500-е за последний час с разбивкой по сервисам и хостам. Поиск и анализ логов ускоряется в разы. Это и есть фундамент для AI-аналитики инцидентов — без него любые ассистенты бесполезны.
-->
