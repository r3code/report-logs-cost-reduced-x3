---
layout: two-column
clicks: 4
---

# Кейс 2: Dev-контур и No space left

<ul class="progressive">
  <li v-show="$clicks >= 0" :class="{ active: $clicks === 0 }">Vector держал fd удалённых (rotated) логов</li>
  <li v-show="$clicks >= 1" :class="{ active: $clicks === 1 }">Диск забивался, новые логи не писались</li>
  <li v-show="$clicks >= 2" :class="{ active: $clicks === 2 }">Корень: oldest_first: true залипал на старых</li>
  <li v-show="$clicks >= 3" :class="{ active: $clicks === 3 }">Фикс — две строки конфига</li>
</ul>

::right::

<div class="pl-4">

```toml
# Vector file source: фикс fd leak
[sources.logs]
type = "file"
oldest_first = false      # не залипаем на старых
max_read_bytes = 16384    # лимит чтения за такт
```

</div>

<!--
На dev-контуре начали падать диски с ошибкой "No space left on device". Разбирались — оказалось Vector держал файловые дескрипторы на удалённых лог-файлах. Ротация удаляла файл, но fd оставался открытым, и копии логов висели в inode, пока не забьют всё место. Корень проблемы — oldest_first равный true: Vector пытался дочитать старые файлы и не закрывал fd. Фикс — две строки: oldest_first false, чтобы читать свежие логи первыми, и max_read_bytes — лимит на чтение за такт. Проблема ушла за один деплой. Урок: даже простые настройки file source могут выстрелить в ногу.
-->
