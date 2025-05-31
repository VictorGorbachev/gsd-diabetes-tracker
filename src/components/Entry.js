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
        
        // Сахар с цветным индикатором как в оригинале
        if (this.sugar !== null && this.sugar !== undefined && this.sugar !== '') {
            const sugarValue = parseFloat(this.sugar);
            const sugarSpan = document.createElement('span');
            sugarSpan.className = 'entry-sugar';
            
            // Проверяем уровень сахара для красной точки (как в оригинале)
            if (sugarValue > 10) {
                sugarSpan.classList.add('high');
                // Добавляем красную точку перед текстом
                const dot = document.createElement('span');
                dot.style.cssText = `
                    width: 6px; 
                    height: 6px; 
                    background: #FF3B30; 
                    border-radius: 50%; 
                    display: inline-block; 
                    margin-right: 4px;
                    vertical-align: middle;
                `;
                sugarSpan.appendChild(dot);
            }
            
            const textNode = document.createTextNode(`${Validation.formatSugarDisplay(this.sugar)} ммоль/л`);
            sugarSpan.appendChild(textNode);
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
        
        // Еда (без отдельного элемента для хлебных единиц)
        if (this.food) {
            const foodSpan = document.createElement('span');
            foodSpan.className = 'entry-food';
            let foodText = this.food;
            if (this.breadUnits) {
                foodText += ` (${Validation.formatBreadUnitsDisplay(this.breadUnits)} ХЕ)`;
            }
            foodSpan.textContent = foodText;
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
        
        // Собираем детали с разделителями
        details.forEach((detail, index) => {
            if (index > 0) {
                const separator = document.createElement('span');
                separator.textContent = ' • ';
                separator.style.opacity = '0.5';
                separator.style.margin = '0 4px';
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
        if (modal) modal.classList.add('show');
        
        // Сохраняем ID текущей записи
        window.currentEditingEntryId = this.id;
        if (window.gsdApp) {
            window.gsdApp.currentEditingEntryId = this.id;
        }
        
        // Обработчики кнопок
        const deleteBtn = document.getElementById('deleteEntryBtn');
        const editBtn = document.getElementById('editEntryBtn');
        const cancelBtn = document.getElementById('cancelEntryActionBtn');
        
        // Удаляем старые обработчики
        if (deleteBtn) deleteBtn.replaceWith(deleteBtn.cloneNode(true));
        if (editBtn) editBtn.replaceWith(editBtn.cloneNode(true));
        if (cancelBtn) cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        
        // Получаем новые ссылки
        const newDeleteBtn = document.getElementById('deleteEntryBtn');
        const newEditBtn = document.getElementById('editEntryBtn');
        const newCancelBtn = document.getElementById('cancelEntryActionBtn');
        
        if (newDeleteBtn) {
            newDeleteBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                this.showDeleteConfirmation();
            });
        }
        
        if (newEditBtn) {
            newEditBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                this.showEditModal();
            });
        }
        
        if (newCancelBtn) {
            newCancelBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                window.currentEditingEntryId = null;
                if (window.gsdApp) {
                    window.gsdApp.currentEditingEntryId = null;
                }
            });
        }
    }
    
    showDeleteConfirmation() {
        const modal = document.getElementById('confirmDeleteEntryModal');
        if (modal) modal.classList.add('show');
        
        const cancelBtn = document.getElementById('cancelDeleteEntryBtn');
        const confirmBtn = document.getElementById('confirmDeleteEntryBtn');
        
        // Удаляем старые обработчики
        if (cancelBtn) cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        if (confirmBtn) confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        
        // Получаем новые ссылки
        const newCancelBtn = document.getElementById('cancelDeleteEntryBtn');
        const newConfirmBtn = document.getElementById('confirmDeleteEntryBtn');
        
        if (newCancelBtn) {
            newCancelBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        if (newConfirmBtn) {
            newConfirmBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                this.delete();
            });
        }
    }
    
    showEditModal() {
        const modal = document.getElementById('editEntryModal');
        if (modal) modal.classList.add('show');
        
        // Заполняем форму текущими данными
        const editDate = document.getElementById('editDate');
        const editTime = document.getElementById('editTime');
        const editSugar = document.getElementById('editSugar');
        const editInsulin = document.getElementById('editInsulin');
        const editUnitsValue = document.getElementById('editUnitsValue');
        const editFood = document.getElementById('editFood');
        const editBreadUnitsValue = document.getElementById('editBreadUnitsValue');
        
        if (editDate) editDate.value = this.date;
        if (editTime) editTime.value = this.time;
        if (editSugar) editSugar.value = this.sugar || '';
        if (editInsulin) editInsulin.value = this.insulin || '';
        if (editUnitsValue) editUnitsValue.textContent = this.insulinUnits || 5;
        if (editFood) editFood.value = this.food || '';
        if (editBreadUnitsValue) editBreadUnitsValue.textContent = this.breadUnits || 1.0;
        
        // Показываем/скрываем блок единиц инсулина
        const editInsulinUnits = document.getElementById('editInsulinUnits');
        if (editInsulinUnits && editInsulin) {
            if (editInsulin.value) {
                editInsulinUnits.style.display = 'flex';
            } else {
                editInsulinUnits.style.display = 'none';
            }
        }
        
        // Показываем/скрываем блок хлебных единиц
        const editBreadUnits = document.getElementById('editBreadUnits');
        if (editBreadUnits && editFood) {
            if (editFood.value.trim()) {
                editBreadUnits.style.display = 'flex';
            } else {
                editBreadUnits.style.display = 'none';
            }
        }
    }
    
    delete() {
        if (Storage.deleteEntry(this.id)) {
            // Синхронизация с Airtable
            if (this.airtableId) {
                AirtableSync.getInstance().deleteEntry(this.airtableId);
            }
            
            // Обновляем интерфейс
            if (window.gsdApp) {
                window.gsdApp.loadEntries();
                window.gsdApp.showSuccessBanner('deleteSuccessBanner');
            }
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