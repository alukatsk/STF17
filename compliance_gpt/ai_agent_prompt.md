Ты — coding agent. Нужно создать локальный проект для подготовки plain text нормативного акта по информационной безопасности к загрузке в Custom GPT как knowledge base.

Исходные данные:
- В папке input/ лежит файл regulatory_act.txt.
- Это plain text, выгруженный из правовой системы.
- Документ на русском языке.
- Нужно подготовить структурированные файлы для Custom GPT:
  1. очищенный Markdown-документ;
  2. реестр требований в CSV;
  3. реестр требований в XLSX;
  4. файл требований в JSONL;
  5. файл requirements_by_topic.md;
  6. файл requirements_by_role.md;
  7. manifest.md;
  8. changelog.md;
  9. gpt_instructions.md;
  10. test_questions.md;
  11. validation_report.md.

Главная задача:
Построить воспроизводимый pipeline обработки нормативного текста:

input/regulatory_act.txt
→ очистка текста
→ разбиение на разделы и пункты
→ выделение требований
→ обогащение метаданными
→ экспорт в CSV/XLSX/JSONL/Markdown
→ валидация результата
→ формирование knowledge-пакета для Custom GPT.

Создай структуру проекта:

reg-gpt-builder/
  input/
    regulatory_act.txt
  output/
    01_clean/
    02_clauses/
    03_requirements/
    04_gpt_knowledge_pack/
    05_validation/
  scripts/
  config/
  README.md

Используй Python.

Требования к обработке:

1. Очистка текста
Создай скрипт scripts/01_clean_text.py, который:
- читает input/regulatory_act.txt;
- нормализует пробелы;
- убирает повторяющиеся пустые строки;
- убирает лишние служебные строки, если они похожи на выгрузку из правовой системы;
- сохраняет результат в output/01_clean/regulatory_act_clean.md;
- сохраняет также чистый txt в output/01_clean/regulatory_act_clean.txt.

2. Разбиение на пункты
Создай scripts/02_split_clauses.py, который:
- разбивает документ на структурные элементы;
- распознает пункты вида:
  - 1.
  - 1.1.
  - 1.1.1.
  - Раздел I
  - Глава 1
  - Приложение N 1
- сохраняет результат в output/02_clauses/clauses.jsonl;
- каждый объект должен содержать:
  - clause_id;
  - clause_number;
  - heading;
  - text;
  - parent_section;
  - char_start;
  - char_end.

3. Выделение требований
Создай scripts/03_extract_requirements.py, который:
- анализирует каждый пункт;
- выделяет потенциальные требования по маркерам:
  - должен
  - обязана
  - обязан
  - обязаны
  - необходимо
  - требуется
  - обеспечивает
  - осуществляется
  - проводится
  - не допускается
  - запрещается
  - подлежит
  - устанавливается
- если в одном пункте несколько требований, разделяет их на несколько записей;
- сохраняет результат в output/03_requirements/requirements_raw.jsonl.

Каждое требование должно иметь поля:
- requirement_id;
- source_file;
- clause_number;
- parent_section;
- requirement_text;
- original_clause_text;
- extraction_method;
- confidence;
- needs_human_review.

4. Метаданные
Создай scripts/04_enrich_metadata.py, который добавляет к каждому требованию поля:
- topic;
- subtopic;
- requirement_type;
- addressee;
- control_type;
- suggested_evidence;
- implementation_artifact;
- frequency;
- criticality;
- business_process;
- comments;
- review_status.

Важно:
- Если поле невозможно надежно определить, ставь "требует экспертной проверки".
- Не выдумывай юридические выводы.
- Поле comments должно объяснять, почему выбрана такая классификация.
- Поле review_status по умолчанию: "not_reviewed".

Тему выбирай из списка:
- управление ИБ;
- управление рисками;
- инциденты;
- доступ;
- идентификация и аутентификация;
- журналирование и мониторинг;
- защита данных;
- персональные данные;
- криптография;
- подрядчики;
- разработка ПО;
- эксплуатация ИС;
- резервное копирование;
- обучение и осведомленность;
- аудит и контроль;
- отчетность;
- иное.

Адресата выбирай из списка:
- организация;
- руководитель организации;
- CISO / служба ИБ;
- ИТ;
- владелец процесса;
- владелец информационной системы;
- пользователь;
- подрядчик;
- юридическая служба;
- DPO / ответственный за ПДн;
- аудит / внутренний контроль;
- не определено.

Тип требования выбирай из списка:
- обязанность;
- запрет;
- ограничение;
- процедура;
- срок;
- отчетность;
- контроль;
- рекомендация;
- определение;
- не определено.

5. Экспорт
Создай scripts/05_export.py, который формирует:
- output/04_gpt_knowledge_pack/requirements_register.csv;
- output/04_gpt_knowledge_pack/requirements_register.xlsx;
- output/04_gpt_knowledge_pack/requirements.jsonl;
- output/04_gpt_knowledge_pack/requirements_by_topic.md;
- output/04_gpt_knowledge_pack/requirements_by_role.md;
- output/04_gpt_knowledge_pack/regulatory_act_clean.md.

В XLSX сделай листы:
- Requirements;
- Topics;
- Roles;
- Review;
- Metadata.

В Requirements должны быть колонки:
- requirement_id;
- clause_number;
- topic;
- subtopic;
- requirement_type;
- addressee;
- control_type;
- requirement_text;
- suggested_evidence;
- implementation_artifact;
- frequency;
- criticality;
- parent_section;
- confidence;
- needs_human_review;
- review_status;
- comments.

6. Manifest
Создай scripts/06_build_manifest.py, который формирует output/04_gpt_knowledge_pack/manifest.md.

В manifest.md укажи:
- название knowledge-пакета;
- дату сборки;
- исходный файл;
- список созданных файлов;
- назначение каждого файла;
- предупреждение, что автоматическая разметка требует экспертной проверки.

7. Changelog
Создай output/04_gpt_knowledge_pack/changelog.md с первой записью:
- v1.0;
- дата сборки;
- исходный файл;
- что было создано;
- какие ограничения есть у автоматической разметки.

8. Инструкция для Custom GPT
Создай output/04_gpt_knowledge_pack/gpt_instructions.md.

Инструкция должна задавать роль GPT:
- специализированный консультант по нормативным требованиям в области ИБ;
- отвечает только на основе загруженных документов;
- не выдумывает требований;
- указывает пункт и requirement_id;
- разделяет прямое требование, интерпретацию и рекомендацию;
- честно говорит, если данных нет;
- при чеклистах указывает подтверждающие артефакты;
- при сравнении с внутренними документами использует статусы:
  - покрыто;
  - частично покрыто;
  - не покрыто;
  - требует уточнения.

9. Тестовые вопросы
Создай output/04_gpt_knowledge_pack/test_questions.md с наборами вопросов:
- поиск требований по теме;
- поиск требований по роли;
- составление чеклиста;
- подготовка evidence pack;
- сравнение с внутренней политикой;
- проверка на отсутствие данных;
- проверка ссылок на пункты;
- проверка версионности.

10. Валидация
Создай scripts/07_validate.py, который проверяет:
- у каждого требования есть requirement_id;
- нет дублей requirement_id;
- у каждого требования есть clause_number;
- у каждого требования есть requirement_text;
- confidence заполнен;
- review_status заполнен;
- requirements_register.csv и xlsx созданы;
- manifest.md создан;
- gpt_instructions.md создан;
- test_questions.md создан.

Результат сохранить в:
output/05_validation/validation_report.md.

11. Главный запуск
Создай run_pipeline.py, который последовательно запускает все скрипты.

12. README
Создай README.md, где объясни:
- как положить исходный файл;
- как запустить pipeline;
- где лежат результаты;
- какие файлы загружать в Custom GPT;
- какие поля требуют ручной проверки;
- как обновлять knowledge-пакет при новой версии нормативного акта.

Важно:
- Код должен быть понятным и комментированным.
- Используй стандартные Python-библиотеки, а для XLSX можно использовать openpyxl.
- Не используй внешние API.
- Если для какой-то части нужна LLM-классификация, сделай пока эвристическую классификацию по ключевым словам и явно пометь такие поля как требующие проверки.
- Не делай вид, что автоматическая классификация юридически точна.
- Цель проекта — подготовить качественный черновик knowledge-пакета, который потом проверит эксперт.
