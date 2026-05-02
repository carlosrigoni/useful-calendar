WITH holiday_seed (
  id,
  name,
  date,
  kind,
  notes
) AS (
  VALUES
    ('holiday-2026-national-01-01', 'Confraternizacao Universal', DATE '2026-01-01', 'NATIONAL', NULL),
    ('holiday-2026-optional-02-16', 'Carnaval', DATE '2026-02-16', 'OPTIONAL', NULL),
    ('holiday-2026-optional-02-17', 'Carnaval', DATE '2026-02-17', 'OPTIONAL', NULL),
    ('holiday-2026-optional-02-18', 'Quarta-feira de Cinzas', DATE '2026-02-18', 'OPTIONAL', NULL),
    ('holiday-2026-national-04-03', 'Paixao de Cristo / Sexta-feira Santa', DATE '2026-04-03', 'NATIONAL', NULL),
    ('holiday-2026-national-04-21', 'Tiradentes', DATE '2026-04-21', 'NATIONAL', NULL),
    ('holiday-2026-national-05-01', 'Dia do Trabalho', DATE '2026-05-01', 'NATIONAL', NULL),
    ('holiday-2026-optional-06-04', 'Corpus Christi', DATE '2026-06-04', 'OPTIONAL', NULL),
    ('holiday-2026-national-09-07', 'Independencia do Brasil', DATE '2026-09-07', 'NATIONAL', NULL),
    ('holiday-2026-national-10-12', 'Nossa Senhora Aparecida', DATE '2026-10-12', 'NATIONAL', 'Padroeira do Brasil'),
    ('holiday-2026-optional-10-28', 'Dia do Servidor Publico', DATE '2026-10-28', 'OPTIONAL', NULL),
    ('holiday-2026-national-11-02', 'Finados', DATE '2026-11-02', 'NATIONAL', NULL),
    ('holiday-2026-national-11-15', 'Proclamacao da Republica', DATE '2026-11-15', 'NATIONAL', NULL),
    ('holiday-2026-national-11-20', 'Dia Nacional de Zumbi e da Consciencia Negra', DATE '2026-11-20', 'NATIONAL', NULL),
    ('holiday-2026-municipal-11-28', 'Aniversario de Franca', DATE '2026-11-28', 'MUNICIPAL', NULL),
    ('holiday-2026-municipal-12-08', 'Nossa Senhora da Conceicao', DATE '2026-12-08', 'MUNICIPAL', 'Padroeira'),
    ('holiday-2026-optional-12-24', 'Vespera de Natal', DATE '2026-12-24', 'OPTIONAL', NULL),
    ('holiday-2026-national-12-25', 'Natal', DATE '2026-12-25', 'NATIONAL', NULL),
    ('holiday-2026-municipal-01-24', 'Dia Municipal da APAE', DATE '2026-01-24', 'MUNICIPAL', 'Lei 8.094/2014'),
    ('holiday-2026-municipal-01-25', 'Dia Municipal do Carteiro', DATE '2026-01-25', 'MUNICIPAL', 'Lei 7.642/2014')
)
INSERT INTO "Holiday" (
  "id",
  "name",
  "date",
  "kind",
  "isRecurringYear",
  "notes",
  "createdAt",
  "updatedAt"
)
SELECT
  holiday_seed.id,
  holiday_seed.name,
  holiday_seed.date,
  holiday_seed.kind::"HolidayKind",
  false,
  holiday_seed.notes,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM holiday_seed
WHERE NOT EXISTS (
  SELECT 1
  FROM "Holiday" existing_holiday
  WHERE existing_holiday."name" = holiday_seed.name
    AND existing_holiday."date" = holiday_seed.date
);
