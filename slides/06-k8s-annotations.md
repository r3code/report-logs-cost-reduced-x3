---
layout: two-column
clicks: 4
---

# Кейс 1: Стена аннотаций K8s

<ul class="progressive">
  <li v-show="$clicks > 0" :class="{ active: $clicks === 1 }">Лимит 63 символа на ключ аннотации K8s</li>
  <li v-show="$clicks > 1" :class="{ active: $clicks === 2 }">Имена меток сервисов не влезали</li>
  <li v-show="$clicks > 2" :class="{ active: $clicks === 3 }">Выборочный сбор ломался</li>
  <li v-show="$clicks > 3" :class="{ active: $clicks === 4 }">Решение: сбор всего + исключение по namespace label</li>
</ul>

::right::

<div class="pl-4">

```toml
# Vector: исключаем шумные namespace
[transforms.filter]
type = "filter"
condition = '''
  !contains(
    tags."vitech.team/service_name",
    "noise-"
  )
'''
```

</div>

<!--
Первый технический кейс. В Kubernetes жёсткий лимит — 63 символа на ключ аннотации. Наши имена меток сервисов не влезали, и механизм выборочного сбора логов ломался на корню. Вместо того чтобы бороться с ограничениями K8s и обрезать имена, мы поменяли подход на изнанку: собираем всё подряд, а исключения делаем по namespace label — tags.vitech.team/service_name. Просто, надёжно, и не зависит от ограничений платформы. Принцип: не ломай инструмент, меняй подход.
-->
