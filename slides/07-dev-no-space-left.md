---
layout: two-cols
---

# Кейс 2: Dev-контур и No space left

- Vector держал **fd** удалённых (rotated) лог-файлов
- Диск забивался → новые логи не писались
- Корень: `oldest_first: true` залипал на старых файлах
- Фикс — **две строки** конфига

::right::

<div class="pl-4">

```toml {all|3-4|5|all}
# Vector file source: фикс fd leak
[sources.logs]
type = "file"
oldest_first = false      # не залипаем на старых
max_read_bytes = 16384    # лимит чтения за такт
```

<div class="mt-4 text-sm opacity-70">

oldest_first: false — читаем свежие логи первыми
max_read_bytes — не утаскиваем весь fd за раз

</div>

</div>

<!-- Примечание спикера: На dev-контуре начали падать диски с ошибкой "No space left on device". Разбирались — оказалось Vector держал файловые дескрипторы на удалённых лог-файлах. Ротация удаляла файл, но fd оставался открытым, и копии логов висели в inode, пока не забьют всё место. Корень проблемы — oldest_first равный true: Vector пытался дочитать старые файлы и не закрывал fd. Фикс — две строки: oldest_first false, чтобы читать свежие логи первыми, и max_read_bytes — лимит на чтение за такт. Проблема ушла за один деплой. Урок: даже простые настройки file source могут выстрелить в ногу. -->
