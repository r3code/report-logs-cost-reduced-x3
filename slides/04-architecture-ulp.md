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

![Схема архитектуры ULP](./assets/04-architecture.png)

<!-- ЗАМЕНИТЬ НА СХЕМУ: Vector Agent → Kafka (буфер) → Vector Aggregator → ClickHouse + VictoriaMetrics, распределённая архитектура в 3 ЦОД -->

<!-- Примечание спикера: Наша архитектура — Universal Logging Platform, ULP. На каждой ноде стоит Vector Agent: читает лог-файлы, парсит, отправляет в Kafka. Kafka — наш буфер, защищает от пиков и рассинхрона между сбором и записью. Vector Aggregator забирает из Kafka, трансформирует, пишет в ClickHouse для тяжёлых запросов и VictoriaMetrics для метрик. Архитектура распределённая в трёх ЦОД — если один дата-центр падает, логи не теряются. Доставка — 99.98–100%, это мониторится. Архитектура простая, но каждый компонент решает конкретную проблему. -->
