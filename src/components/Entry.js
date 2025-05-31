// Компонент записи
class Entry {
    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.sugar = data.sugar;
        this.insulin = data.insulin;
        this.insulinUnits = data.insulinUnits;
        this.food = data.food;
        this.breadUnits = data.breadUnits;
        this.createdAt = data.createdAt;
        this.airtableId = data.airtableId;
    }

    render() {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.dataset.entryId = this.id;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'entry-time';
        timeElement.textContent = this.time;
        
        const detailsElement = document.createElement('div');
        detailsElement.className = 'entry-details';
        
        const details = [];
        
        // Сахар
        if (this.sugar !== null && this.sugar !== undefined && this.sugar !== '') {
            const sugarSpan = document.createElement('span');
            sugarSpan.className = 'entry-sugar';
            sugarSpan.textContent = `${Validation.formatSugarDisplay(this.sugar)} ммоль/л`;
            details.push(sugarSpan);
        }
        
        // Инсулин
        if (this.insulin && this.insulinUnits) {
            const insulinSpan = document.createElement('span');
            insulinSpan.className = 'entry-insulin';
            const insulinName = this.getInsulinDisplayName(this.insulin);
            insulinSpan.textContent = `${insulinName} ${this.insulinUnits}ед`;
            details.push(insulinSpan);
        }
        
        // Еда
        if (this.food) {
            const foodSpan = document.createElement('span');
            foodSpan.textContent = this.food;
            if (this.breadUnits) {
                foodSpan.textContent += ` (${Validation.formatBreadUnitsDisplay(this.breadUnits)} ХЕ)`;
            }
            details.push(foodSpan);
        }
        
        // Если нет деталей, показываем placeholder
        if (details.length === 0) {
            const placeholderSpan = document.createElement('span');
            placeholderSpan.textContent = 'Без деталей';
            placeholderSpan.style.fontStyle = 'italic';
            placeholderSpan.style.opacity = '0.6';
            details.push(placeholderSpan);
        }
        
        details.forEach((detail, index) => {
            if (index > 0) {
                const separator = document.createElement('span');
                separator.textContent = ' • ';
                separator.style.opacity = '0.5';
                detailsElement.appendChild(separator);
            }
            detailsElement.appendChild(detail);
        });
        
        entry.appendChild(timeElement);
        entry.appendChild(detailsElement);
        
        // Добавляем обработчик клика
        entry.addEventListener('click', () => {
            this.handleClick();
        });
        
        return entry;
    }
    
    getInsulinDisplayName(insulin) {
        const insulinNames = {
            'novorapid': 'Новорапид',
            'levemir': 'Левемир'
        };
        return insulinNames[insulin] || insulin;
    }
    
    handleClick() {
        // Показываем модальное окно действий с записью
        const modal = document.getElementById('entryActionsModal');
        modal.classList.add('show');
        
        // Сохраняем ID текущей записи
        window.currentEditingEntryId = this.id;
        
        // Обработчики кнопок
        const deleteBtn = document.getElementById('deleteEntryBtn');
        const editBtn = document.getElementById('editEntryBtn');
        const cancelBtn = document.getElementById('cancelEntryActionBtn');
        
        // Удаляем старые обработчики
        deleteBtn.replaceWith(deleteBtn.cloneNode(true));
        editBtn.replaceWith(editBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        
        // Получаем новые ссылки
        const newDeleteBtn = document.getElementById('deleteEntryBtn');
        const newEditBtn = document.getElementById('editEntryBtn');
        const newCancelBtn = document.getElementById('cancelEntryActionBtn');
        
        newDeleteBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            this.showDeleteConfirmation();
        });
        
        newEditBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            this.showEditModal();
        });
        
        newCancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            window.currentEditingEntryId = null;
        });
    }
    
    showDeleteConfirmation() {
        const modal = document.getElementById('confirmDeleteEntryModal');
        modal.classList.add('show');
        
        const cancelBtn = document.getElementById('cancelDeleteEntryBtn');
        const confirmBtn = document.getElementById('confirmDeleteEntryBtn');
        
        // Удаляем старые обработчики
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        
        // Получаем новые ссылки
        const newCancelBtn = document.getElementById('cancelDeleteEntryBtn');
        const newConfirmBtn = document.getElementById('confirmDeleteEntryBtn');
        
        newCancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        newConfirmBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            this.delete();
        });
    }
    
    showEditModal() {
        const modal = document.getElementById('editEntryModal');
        modal.classList.add('show');
        
        // Заполняем форму текущими данными
        document.getElementById('editDate').value = this.date;
        document.getElementById('editTime').value = this.time;
        document.getElementById('editSugar').value = this.sugar || '';
        document.getElementById('editInsulin').value = this.insulin || '';
        document.getElementById('editUnitsValue').textContent = this.insulinUnits || 5;
        document.getElementById('editFood').value = this.food || '';
        document.getElementById('editBreadUnitsValue').textContent = this.breadUnits || 1.0;
        
        // Показываем/скрываем блок единиц инсулина
        const editInsulinUnits = document.getElementById('editInsulinUnits');
        if (document.getElementById('editInsulin').value) {
            editInsulinUnits.style.display = 'flex';
        } else {
            editInsulinUnits.style.display = 'none';
        }
        
        // Показываем/скрываем блок хлебных единиц
        const editBreadUnits = document.getElementById('editBreadUnits');
        if (document.getElementById('editFood').value.trim()) {
            editBreadUnits.style.display = 'flex';
        } else {
            editBreadUnits.style.display = 'none';
        }
    }
    
    delete() {
        if (Storage.deleteEntry(this.id)) {
            // Синхронизация с Airtable
            if (this.airtableId) {
                AirtableSync.getInstance().deleteEntry(this.airtableId);
            }
            
            // Обновляем интерфейс
            window.gsdApp.loadEntries();
            window.gsdApp.showSuccessBanner('deleteSuccessBanner');
        }
    }
    
    update(newData) {
        // Обновляем локальные данные
        Object.assign(this, newData);
        
        if (Storage.updateEntry(this.id, newData)) {
            // Синхронизация с Airtable
            if (this.airtableId) {
                AirtableSync.getInstance().updateEntry(this.airtableId, newData);
            }
            
            return true;
        }
        return false;
    }
    
    static fromFormData(formData) {
        return new Entry({
            date: formData.get('date') || DateUtils.getCurrentDate(),
            time: formData.get('time') || DateUtils.getCurrentTime(),
            sugar: formData.get('sugar') || null,
            insulin: formData.get('insulin') || '',
            insulinUnits: formData.get('insulinUnits') || null,
            food: formData.get('food') || '',
            breadUnits: formData.get('breadUnits') || null
        });
    }
    
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            time: this.time,
            sugar: this.sugar,
            insulin: this.insulin,
            insulinUnits: this.insulinUnits,
            food: this.food,
            breadUnits: this.breadUnits,
            createdAt: this.createdAt,
            airtableId: this.airtableId
        };
    }
}