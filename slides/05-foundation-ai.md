---
layout: default
---

# Фундамент для AI и автоматизации

- Переход от хаоса к **строгой схеме** OpenTelemetry Logs Data Model
- Структурированные данные в **ClickStack** — `Attributes`, `Resource`
- AI-ассистенты через **MCP** делают **точные и молниеносные SQL-запросы**
- Поиск и анализ логов ускоряется **в разы**, без галлюцинаций

<div class="mt-4">

```sql {all|1-2|3-4|all}
SELECT body,
       attributes['service.name'] AS service,
       resource['host.name']      AS host
FROM logs
WHERE attributes['http.status_code'] = '500'
  AND timestamp > now() - INTERVAL 1 HOUR
ORDER BY timestamp DESC
```

</div>

<!-- Примечание спикера: Почему это важно для AI? Раньше логи были неструктурированным текстом — ассистенты могли только "гадать" по содержимому и галлюцинировать. Теперь — строгая схема OpenTelemetry Logs Data Model: каждая запись имеет Timestamp, Body, Attributes и Resource. Структурированные данные в ClickStack позволяют AI-ассистентам через Model Context Protocol — MCP — выполнять точные и молниеносные SQL-запросы к конкретным полям. Не "похоже на ошибку", а конкретно: дай мне все 500-е за последний час с разбивкой по сервисам и хостам. Поиск и анализ логов ускоряется в разы. Это и есть фундамент для AI-аналитики инцидентов — без него любые ассистенты бесполезны. -->
