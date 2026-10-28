---
layout: image-right
---

# Архитектура ULP

Universal Logging Platform

- **Vector Agent** на каждой ноде — сбор
- **Kafka** — буфер между сбором и агрегацией
- **Vector Aggregator** → ClickHouse + VictoriaMetrics
- **Распределённая архитектура** в **3 ЦОД**
- Доставка логов: **99.98–100%**

<div class="mt-4 text-sm opacity-70">

Kafka защищает от пиков · ClickHouse — тяжёлые запросы · VictoriaMetrics — метрики

</div>

::right::

<div class="bg-gray-200 border-2 border-dashed border-gray-400 h-80 flex items-center justify-center text-center p-4 rounded">
  <span><b>Плейсхолдер</b><br/>Схема архитектуры ULP<br/>Vector → Kafka → Aggregator → CH+VM, 3 ЦОД</span>
</div>

<!-- ЗАМЕНИТЬ НА СХЕМУ: Vector Agent → Kafka (буфер) → Vector Aggregator → ClickHouse + VictoriaMetrics, распределённая архитектура в 3 ЦОД -->
<!-- После создания файла положить в assets/04-architecture.png и заменить блок выше на: -->
<!-- ![Схема архитектуры ULP](./assets/04-architecture.png) -->

<!-- Примечание спикера: Наша архитектура — Universal Logging Platform, ULP. На каждой ноде стоит Vector Agent: читает лог-файлы, парсит, отправляет в Kafka. Kafka — наш буфер, защищает от пиков и рассинхрона между сбором и записью. Vector Aggregator забирает из Kafka, трансформирует, пишет в ClickHouse для тяжёлых запросов и VictoriaMetrics для метрик. Архитектура распределённая в трёх ЦОД — если один дата-центр падает, логи не теряются. Доставка — 99.98–100%, это мониторится. Архитектура простая, но каждый компонент решает конкретную проблему. -->
