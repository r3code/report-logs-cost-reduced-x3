---
layout: two-column
clicks: 4
---

# Кейс 3: Динамический TTL

<ul class="progressive">
  <li v-show="$clicks >= 0" :class="{ active: $clicks === 0 }">Каждой записи — свой срок через LogTTL UInt16</li>
  <li v-show="$clicks >= 1" :class="{ active: $clicks === 1 }">Сервис сам указывает TTL в часах при записи</li>
  <li v-show="$clicks >= 2" :class="{ active: $clicks === 2 }">Критичный нюанс: ttl_only_drop_parts = 0</li>
  <li v-show="$clicks >= 3" :class="{ active: $clicks === 3 }">Иначе партиция живёт по самому длинному TTL</li>
</ul>

::right::

<div class="pl-4">

```sql
CREATE TABLE logs (
    timestamp  DateTime,
    body       String,
    LogTTL     UInt16,  -- часы
    service    String
)
ENGINE = MergeTree
PARTITION BY toYYYYMMDD(timestamp)
TTL timestamp + INTERVAL LogTTL HOUR
SETTINGS ttl_only_drop_parts = 0;
-- без этого "короткие" логи
-- будут жить неделями
```

</div>

<!--
Динамический TTL — киллер-фича нашей платформы. Каждой записи — свой срок жизни через поле LogTTL типа UInt16, в часах. Сервис сам указывает при записи: критичные логи — храни 720 часов, отладочные — 24 часа. Но есть критичный нюанс, на который мы наступили. По умолчанию ClickHouse удаляет целые партиции, и партиция живёт по самому длинному TTL внутри неё. То есть один лог с TTL 720 часов удержит всю партицию, даже если 99% записей в ней должны были удалиться через сутки. Ставим ttl_only_drop_parts равный нулю — и ClickHouse корректно удаляет отдельные записи внутри партиции. Без этой настройки ваша экономия на хранении просто не работает.
-->
