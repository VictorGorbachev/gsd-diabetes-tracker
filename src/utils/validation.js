// Утилиты для валидации данных
class Validation {
    static validateEntry(entry) {
        const errors = [];
        
        if (!entry.date) {
            errors.push('Дата обязательна');
        }
        
        if (!entry.time) {
            errors.push('Время обязательно');
        }
        
        if (entry.sugar !== null && entry.sugar !== undefined && entry.sugar !== '') {
            const sugar = parseFloat(entry.sugar);
            if (isNaN(sugar) || sugar < 0 || sugar > 50) {
                errors.push('Некорректное значение сахара');
            }
        }
        
        if (entry.insulinUnits !== null && entry.insulinUnits !== undefined) {
            const units = parseInt(entry.insulinUnits);
            if (isNaN(units) || units < 0 || units > 100) {
                errors.push('Некорректное количество единиц инсулина');
            }
        }
        
        if (entry.breadUnits !== null && entry.breadUnits !== undefined) {
            const breadUnits = parseFloat(entry.breadUnits);
            if (isNaN(breadUnits) || breadUnits < 0 || breadUnits > 50) {
                errors.push('Некорректное количество хлебных единиц');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static sanitizeEntry(entry) {
        return {
            date: entry.date?.trim() || '',
            time: entry.time?.trim() || '',
            sugar: entry.sugar === '' || entry.sugar === null ? null : parseFloat(entry.sugar),
            insulin: entry.insulin?.trim() || '',
            insulinUnits: entry.insulinUnits === '' || entry.insulinUnits === null ? null : parseInt(entry.insulinUnits),
            food: entry.food?.trim() || '',
            breadUnits: entry.breadUnits === '' || entry.breadUnits === null ? null : parseFloat(entry.breadUnits)
        };
    }
    
    static isValidDate(dateStr) {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }
    
    static isValidTime(timeStr) {
        if (!timeStr) return false;
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(timeStr);
    }
    
    static checkSugarLevel(sugar) {
        if (sugar === null || sugar === undefined) return 'normal';
        
        const sugarValue = parseFloat(sugar);
        if (isNaN(sugarValue)) return 'normal';
        
        if (sugarValue < 3.9) return 'low';
        if (sugarValue > 7.8) return 'high';
        return 'normal';
    }
    
    static formatSugarDisplay(sugar) {
        if (sugar === null || sugar === undefined || sugar === '') return '';
        const sugarValue = parseFloat(sugar);
        if (isNaN(sugarValue)) return '';
        return sugarValue.toFixed(1);
    }
    
    static formatUnitsDisplay(units) {
        if (units === null || units === undefined || units === '') return '';
        const unitsValue = parseInt(units);
        if (isNaN(unitsValue)) return '';
        return unitsValue.toString();
    }
    
    static formatBreadUnitsDisplay(breadUnits) {
        if (breadUnits === null || breadUnits === undefined || breadUnits === '') return '';
        const breadUnitsValue = parseFloat(breadUnits);
        if (isNaN(breadUnitsValue)) return '';
        return breadUnitsValue.toFixed(1);
    }
}