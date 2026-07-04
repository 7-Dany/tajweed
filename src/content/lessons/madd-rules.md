```yaml
lesson: madd-rules
language: ar
title: "المدود في التجويد"
```

<!-- slide -->
```yaml
kind: cover
eyebrow: "علم التجويد"
eyebrowIcon: book
title: "المدود في التجويد"
subtitle: "أحكام المد الطبيعي والفرعي مع الأمثلة القرآنية"
chips:
  - { tone: primary, label: "المد الطبيعي" }
  - { tone: madd, label: "حرف المد" }
  - { tone: hamza, label: "الهمزة" }
```

---

<!-- slide -->
```yaml
kind: divider
num: "١"
eyebrow: "الدرس الأول"
title: "المدود في التجويد"
desc: "أحكام المد الطبيعي والفرعي، مع الأمثلة القرآنية المُلوَّنة."
```

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الطبيعي · ١"
title: "حروف المد الثلاثة"
```
حروف المدّ ثلاثة، وهي أصل كل مدٍّ في القرآن الكريم:

```grid:letters
- glyph: ا
  label: الألف
  hint: ساكنة، قبلها فتح
- glyph: و
  label: الواو
  hint: ساكنة، قبلها ضم
- glyph: ي
  label: الياء
  hint: ساكنة، قبلها كسر
```

> [!INFO]
> المد الطبيعي يُمدّ بمقدار [em]حركتين[/em] فقط، وهو الأصل الذي تُبنى عليه بقية أنواع المدّ.

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الطبيعي · ٢"
title: "شروط حروف المد"
```
يشترط في كل حرف من حروف المدّ أن يكون ساكناً، ويكون الحرف الذي قبله مفتوحاً أو مضموناً أو مكسوراً بحسب نوعه:

```list:conditions
- glyph: ا
  desc: "الألف: تكون ساكنة، وقبلها حرف [em]مفتوح[/em]."
- glyph: و
  desc: "الواو: تكون ساكنة، وقبلها حرف [em]مضموم[/em]."
- glyph: ي
  desc: "الياء: تكون ساكنة، وقبلها حرف [em]مكسور[/em]."
```

> [!WARNING]
> إن لم تتحقّق هذه الشروط، فلا تُعدّ الحروف مداً طبيعياً، بل حروف لينٍ أو حروف علة.

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الطبيعي · ٣"
title: "أمثلة المد الطبيعي"
```
```grid:examples-single
- "قَ‍[madd]‍ا[/madd]لَ"
- "كَتَ‍[madd]‍ا[/madd]ب"
- "يَقُ‍[madd]‍و[/madd]لُ"
```

### الأمثلة العُليا، الألف والواو

```grid:examples-single
- "نُ‍[madd]‍و[/madd]ر"
- "قِ‍[madd]‍ي‍[/madd]لَ"
- "كَرِ[madd]ي‍[/madd]‍م"
```

```legend
- { tone: madd, label: "حرف المد (يُمدّ حركتين)" }
```

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الفرعي · ١"
title: "سبب المد الفرعي وعلامته"
```
يكون المدّ الفرعي بسبب أحد الأمرين:

```grid:causes
- glyph: ء
  label: الهمزة
- glyph: ْ
  label: السكون
```

```symbol
glyph: "ٓ"
caption: "علامة المدّ في المصحف الشريف، تُرسم فوق حرف المدّ لتدلّ على وجود مدٍّ زائدٍ على المدّ الطبيعي."
```

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الفرعي · ٢"
title: "المد بسبب الهمزة، نوعان"
```
```grid:compare
- emphasis: default
  badge: "واجب متصل"
  title: "المدّ الواجب المتصل"
  desc: "حرف المدّ والهمزة في نفس الكلمة، يجب مدّه أربع حركات."
  example: "جَ‍[madd]‍ا[/madd][hamza]ءَ[/hamza]"
- emphasis: accent
  badge: "جائز منفصل"
  title: "المدّ الجائز المنفصل"
  desc: "حرف المدّ في كلمة، والهمزة في الكلمة التي بعدها، يُمدّ أربع حركات."
  example: "يَ‍[madd]‍ا[/madd] [hamza]أَ[/hamza]يُّهَا"
```

> [!INFO]
> للتبسيط: يُمدّ النوعان معاً بمقدار [em]أربع حركات[/em].

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الفرعي · ٣"
title: "المدّ الواجب المتصل، أمثلة"
```
حرف المدّ والهمزة في نفس الكلمة، يُمدّ أربع حركات.

```grid:examples
- "جَ‍[madd]‍ا[/madd][hamza]ءَ[/hamza]"
- "شَ‍[madd]‍ا[/madd][hamza]ءَ[/hamza]"
- "سُ‍[madd]‍و[/madd][hamza]ءَ[/hamza]"
```

```grid:examples
- "تَبُ‍[madd]‍و[/madd][hamza]ءَ[/hamza]"
- "ﺟِ[madd]ﻲ[/madd][hamza]ءَ[/hamza]"
- "هَنِ‍[madd]‍ي‍[/madd][hamza]ئًا[/hamza]"
```

```legend
- { tone: madd, label: "حرف المد" }
- { tone: hamza, label: "الهمزة" }
```

---

<!-- slide -->
```yaml
kind: content
eyebrow: "المد الفرعي · ٤"
title: "المدّ الجائز المنفصل، أمثلة"
```
حرف المدّ في آخر كلمة، والهمزة في أول الكلمة التي تليها.

```grid:examples
- "فِيهَ‍[madd]‍ا[/madd]\u00A0 [hamza]أَ[/hamza]نْهَارٌ"
- "يَ‍[madd]‍ا[/madd]\u00A0 [hamza]أَ[/hamza]يُّهَا"
- "قَالُ‍[madd]‍وا[/madd]\u00A0 [hamza]إِ[/hamza]نَّا"
```

```grid:examples
- "آمَنُ‍[madd]‍وا[/madd]\u00A0 [hamza]أَ[/hamza]نْزَلْنَا"
- "فِ‍[madd]‍ي[/madd]\u00A0 [hamza]أَ[/hamza]نْفُسِكُمْ"
- "إِنِّ‍[madd]‍ي[/madd]\u00A0 [hamza]أَ[/hamza]عْلَمُ"
```

```legend
- { tone: madd, label: "حرف المد" }
- { tone: hamza, label: "الهمزة" }
```

---

<!-- slide -->
```yaml
kind: table
eyebrow: "خلاصة"
title: "ملخّص سريع، جدول المقارنة"
```
| النوع | السبب | مقدار المد |
| --- | --- | :---: |
| المد الطبيعي | لا همزة ولا سكون | {slide} حركتان |
| المد الواجب المتصل | همزة بعد حرف المد في نفس الكلمة | {accent} ٤ حركات |
| المد الجائز المنفصل | حرف المد في كلمة، والهمزة في الكلمة التالية | {accent} ٤ حركات |

> [!INFO]
> القاعدة الذهبية: المد الطبيعي [em]حركتان[/em]، والمدّ بسبب الهمزة [em]أربع حركات[/em].

---

<!-- slide -->
```yaml
kind: cover
variant: closing
title: "تمّ الدرس"
subtitle: "الحمد لله الذي علّمنا"
```
