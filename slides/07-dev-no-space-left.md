---
layout: two-column
clicks: 4
---

# Кейс 2: Dev-контур и No space left

<ProgressiveList :items="['Vector держал fd удалённых (rotated) логов', 'Диск забивался, новые логи не писались', 'Корень: oldest_first: true залипал на старых', 'Фикс — две строки конфига']" />

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
