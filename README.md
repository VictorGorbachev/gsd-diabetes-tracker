# 🤰 Дневник сахара - ГСД (Гестационный сахарный диабет)

Современное веб-приложение для мониторинга уровня глюкозы при гестационном сахарном диабете.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-victorgorbachev.github.io-blue?style=for-the-badge)](https://victorgorbachev.github.io/gsd-diabetes-tracker/)

## 🎯 Специально для ГСД

Приложение адаптировано под медицинские стандарты для беременных с гестационным диабетом:

### ✅ Целевые значения ГСД:
- **Натощак**: < 5.1 ммоль/л
- **Через 1 час после еды**: < 10.0 ммоль/л  
- **Через 2 часа после еды**: < 8.5 ммоль/л

### 🎨 Умная цветовая маркировка:
- 🟢 **Зеленый** - в пределах нормы ГСД
- 🟡 **Желтый** - пограничные значения  
- 🟠 **Красный** - превышение нормы ГСД
- 🔴 **Темно-красный** - критически высокие значения

## 🌟 Основные функции

- 📅 **Точное время измерений** с десятичными значениями (5.1, 4.8, 6.2)
- 🍯 **Тип измерения** (натощак/1ч/2ч после еды) 
- 💉 **Учет инсулина** (Новорапид, Левемир, Актрапид)
- 🍞 **Заметки о еде** для контекста измерений
- 📊 **История записей** с визуальными индикаторами
- 📱 **Адаптивный дизайн** для смартфонов
- 🎓 **Образовательная информация** о нормах ГСД

## 🚀 Использование

1. **Откройте приложение**: [victorgorbachev.github.io/gsd-diabetes-tracker](https://victorgorbachev.github.io/gsd-diabetes-tracker/)

2. **Заполните данные**:
   - Выберите тип измерения (натощак/после еды)
   - Введите точное значение глюкозы (например, 5.1)
   - Укажите тип и дозу инсулина
   - Добавьте заметки о еде

3. **Отслеживайте результаты**:
   - Цветовые метки покажут соответствие нормам ГСД
   - История сохранится для анализа врачом
   - Легенда поможет интерпретировать результаты

## 🛠 Технологии

- **Frontend**: React 18, Tailwind CSS
- **Иконки**: Lucide React (медицинская тематика)
- **Деплой**: GitHub Pages + GitHub Actions
- **Хранение**: Локальное (в браузере)

## 🏥 Медицинская точность

### Нормы при ГСД согласно международным стандартам:

| Время измерения | Норма (ммоль/л) | Наша интерпретация |
|----------------|-----------------|-------------------|
| Натощак | < 5.1 | 🟢 Норма / 🟡 Погранично / 🔴 Выше |
| 1 час после еды | < 10.0 | 🟢 Норма / 🟡 Погранично / 🔴 Выше |
| 2 часа после еды | < 8.5 | 🟢 Норма / 🟡 Погранично / 🔴 Выше |

### ⚠️ Важно
Приложение предназначено для ведения дневника и не заменяет консультацию врача. Всегда следуйте рекомендациям вашего эндокринолога и акушера-гинеколога.

## 📸 Примеры интерфейса

- ✨ Современный дизайн в стиле мобильных приложений
- 🎯 Интуитивные элементы управления (+/- кнопки)
- 📋 Четкая история с временными метками
- 🎨 Визуальные индикаторы для быстрой оценки

## 👨‍💻 Разработка

### Локальная установка:
```bash
git clone https://github.com/VictorGorbachev/gsd-diabetes-tracker.git
cd gsd-diabetes-tracker
# Откройте index.html в браузере или запустите локальный сервер
python -m http.server 8000
```

### Архитектура:
- **React компоненты** для интерактивности
- **Tailwind CSS** для стилизации
- **Lucide Icons** для медицинских иконок
- **GitHub Actions** для автоматического деплоя

## 🤝 Вклад в проект

Приветствуются улучшения для беременных с ГСД:
- Расширение функционала мониторинга
- Улучшение UX/UI для мобильных устройств
- Интеграция с медицинскими стандартами

## 📝 Лицензия

Проект создан в образовательных целях для помощи беременным с ГСД.

---

**Здоровья вам и вашему малышу! 👶💚**

*Создано с заботой о беременных с гестационным диабетом*