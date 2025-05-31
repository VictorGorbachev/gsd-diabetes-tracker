// Утилиты для работы с датами
class DateUtils {
    static formatDate(date) {
        if (!date) return '';
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toISOString().split('T')[0];
    }

    static formatTime(date) {
        if (!date) return '';
        if (typeof date === 'string') {
            const timeMatch = date.match(/\d{2}:\d{2}/);
            if (timeMatch) return timeMatch[0];
            date = new Date(date);
        }
        return date.toTimeString().slice(0, 5);
    }

    static parseDateTime(dateStr, timeStr) {
        if (!dateStr || !timeStr) return null;
        return new Date(`${dateStr}T${timeStr}:00`);
    }

    static formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dateOnly = date.toDateString();
        const todayOnly = today.toDateString();
        const yesterdayOnly = yesterday.toDateString();
        
        if (dateOnly === todayOnly) {
            return 'Сегодня';
        } else if (dateOnly === yesterdayOnly) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    static getCurrentDate() {
        return this.formatDate(new Date());
    }

    static getCurrentTime() {
        return this.formatTime(new Date());
    }

    static isToday(dateStr) {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    static isYesterday(dateStr) {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
    }

    static sortByDateTime(entries) {
        return entries.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}:00`);
            const dateB = new Date(`${b.date}T${b.time}:00`);
            return dateB - dateA; // Новые сверху
        });
    }

    static groupByDate(entries) {
        const groups = {};
        entries.forEach(entry => {
            const date = entry.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
        });
        
        // Сортируем записи внутри каждой группы
        Object.keys(groups).forEach(date => {
            groups[date].sort((a, b) => {
                return new Date(`1970-01-01T${b.time}:00`) - new Date(`1970-01-01T${a.time}:00`);
            });
        });
        
        return groups;
    }
}