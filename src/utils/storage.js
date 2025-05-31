// Утилиты для работы с локальным хранилищем
class Storage {
    static STORAGE_KEY = 'gsd_entries';
    
    static saveEntries(entries) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
            return false;
        }
    }
    
    static loadEntries() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];
            
            const entries = JSON.parse(data);
            return Array.isArray(entries) ? entries : [];
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            return [];
        }
    }
    
    static addEntry(entry) {
        const entries = this.loadEntries();
        entry.id = this.generateId();
        entry.createdAt = new Date().toISOString();
        entries.push(entry);
        return this.saveEntries(entries);
    }
    
    static updateEntry(entryId, updatedEntry) {
        const entries = this.loadEntries();
        const index = entries.findIndex(entry => entry.id === entryId);
        
        if (index === -1) return false;
        
        entries[index] = { ...entries[index], ...updatedEntry, id: entryId };
        return this.saveEntries(entries);
    }
    
    static deleteEntry(entryId) {
        const entries = this.loadEntries();
        const filteredEntries = entries.filter(entry => entry.id !== entryId);
        return this.saveEntries(filteredEntries);
    }
    
    static getEntry(entryId) {
        const entries = this.loadEntries();
        return entries.find(entry => entry.id === entryId) || null;
    }
    
    static clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return false;
        }
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    static exportData() {
        const entries = this.loadEntries();
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            entries: entries
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gsd-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    static importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.entries || !Array.isArray(data.entries)) {
                        reject(new Error('Неверный формат файла'));
                        return;
                    }
                    
                    // Валидация каждой записи
                    const validEntries = data.entries.filter(entry => {
                        return entry.date && entry.time;
                    });
                    
                    if (this.saveEntries(validEntries)) {
                        resolve(validEntries.length);
                    } else {
                        reject(new Error('Ошибка сохранения данных'));
                    }
                } catch (error) {
                    reject(new Error('Ошибка чтения файла: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Ошибка чтения файла'));
            };
            
            reader.readAsText(file);
        });
    }
    
    static getStatistics() {
        const entries = this.loadEntries();
        const now = new Date();
        const today = DateUtils.formatDate(now);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: entries.length,
            today: entries.filter(e => e.date === today).length,
            thisWeek: entries.filter(e => new Date(e.date) >= weekAgo).length,
            thisMonth: entries.filter(e => new Date(e.date) >= monthAgo).length,
            avgSugar: this.calculateAverageSugar(entries),
            lastEntry: entries.length > 0 ? entries[entries.length - 1] : null
        };
    }
    
    static calculateAverageSugar(entries) {
        const sugarEntries = entries.filter(e => e.sugar !== null && e.sugar !== undefined && e.sugar !== '');
        if (sugarEntries.length === 0) return null;
        
        const sum = sugarEntries.reduce((acc, entry) => acc + parseFloat(entry.sugar), 0);
        return (sum / sugarEntries.length).toFixed(1);
    }
}