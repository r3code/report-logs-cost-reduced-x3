---
layout: two-column
---

# Архитектура ULP

Universal Logging Platform

<ProgressiveList :items="['Vector Agent на каждой ноде — сбор', 'Kafka — буфер между сбором и агрегацией', 'Vector Aggregator → ClickHouse + VictoriaMetrics', 'Распределённая архитектура в 3 ЦОД', 'Доставка логов: 99.98–100%']" />

::right::

<div class="pl-4 h-full flex items-center justify-center">

<div class="text-center p-8 border-2 border-dashed border-gray-400 bg-gray-100 rounded w-full">

**[ ПЛЕЙСХОЛДЕР: СХЕМА ]**

Vector Agent → Kafka (буфер)

→ Vector Aggregator → ClickHouse + VictoriaMetrics

Распределённая архитектура в 3 ЦОД

<!-- ЗАМЕНИТЬ: положить картинку в assets/ и вставить markdown-изображение в блок выше -->

</div>

</div>

<!--
Наша архитектура — Universal Logging Platform, ULP. На каждой ноде стоит Vector Agent: читает лог-файлы, парсит, отправляет в Kafka. Kafka — наш буфер, защищает от пиков и рассинхрона между сбором и записью. Vector Aggregator забирает из Kafka, трансформирует, пишет в ClickHouse для тяжёлых запросов и VictoriaMetrics для метрик. Архитектура распределённая в трёх ЦОД — если один дата-центр падает, логи не теряются. Доставка — 99.98–100%, это мониторится. Архитектура простая, но каждый компонент решает конкретную проблему.
-->
