// Синхронизация с Airtable (опционально)
class AirtableSync {
    constructor(apiKey, baseId, tableName) {
        this.apiKey = apiKey;
        this.baseId = baseId;
        this.tableName = tableName;
        this.isConfigured = !!(apiKey && baseId && tableName);
    }
    
    static getInstance() {
        if (!this.instance) {
            // Здесь можно настроить параметры Airtable
            this.instance = new AirtableSync(
                localStorage.getItem('airtable_api_key'),
                localStorage.getItem('airtable_base_id'),
                localStorage.getItem('airtable_table_name') || 'Entries'
            );
        }
        return this.instance;
    }
    
    async syncEntry(entry) {
        if (!this.isConfigured) {
            console.log('Airtable не настроен, синхронизация пропущена');
            return null;
        }
        
        try {
            const base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
            
            const record = await base(this.tableName).create({
                'Дата': entry.date,
                'Время': entry.time,
                'Сахар': entry.sugar,
                'Инсулин': entry.insulin,
                'Единицы инсулина': entry.insulinUnits,
                'Еда': entry.food,
                'Хлебные единицы': entry.breadUnits,
                'ID': entry.id
            });
            
            return record.id;
        } catch (error) {
            console.error('Ошибка синхронизации с Airtable:', error);
            return null;
        }
    }
    
    async updateEntry(airtableId, entry) {
        if (!this.isConfigured || !airtableId) {
            return null;
        }
        
        try {
            const base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
            
            const record = await base(this.tableName).update(airtableId, {
                'Дата': entry.date,
                'Время': entry.time,
                'Сахар': entry.sugar,
                'Инсулин': entry.insulin,
                'Единицы инсулина': entry.insulinUnits,
                'Еда': entry.food,
                'Хлебные единицы': entry.breadUnits
            });
            
            return record.id;
        } catch (error) {
            console.error('Ошибка обновления в Airtable:', error);
            return null;
        }
    }
    
    async deleteEntry(airtableId) {
        if (!this.isConfigured || !airtableId) {
            return false;
        }
        
        try {
            const base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
            await base(this.tableName).destroy(airtableId);
            return true;
        } catch (error) {
            console.error('Ошибка удаления из Airtable:', error);
            return false;
        }
    }
    
    configure(apiKey, baseId, tableName) {
        this.apiKey = apiKey;
        this.baseId = baseId;
        this.tableName = tableName || 'Entries';
        this.isConfigured = !!(apiKey && baseId && tableName);
        
        // Сохраняем настройки
        if (apiKey) localStorage.setItem('airtable_api_key', apiKey);
        if (baseId) localStorage.setItem('airtable_base_id', baseId);
        if (tableName) localStorage.setItem('airtable_table_name', tableName);
    }
    
    isEnabled() {
        return this.isConfigured;
    }
}