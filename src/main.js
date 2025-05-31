// Основной скрипт приложения
class GSDApp {
    constructor() {
        this.entries = [];
        this.currentEditingEntryId = null;
        this.airtableSync = AirtableSync.getInstance();
        
        this.init();
    }
    
    init() {
        this.loadEntries();
        this.setupEventListeners();
        this.setupFormDefaults();
        this.setupModalHandlers();
    }
    
    setupFormDefaults() {
        // Устанавливаем текущую дату и время
        document.getElementById('date').value = DateUtils.getCurrentDate();
        document.getElementById('time').value = DateUtils.getCurrentTime();
        
        // Обновляем время каждую минуту
        setInterval(() => {
            const timeInput = document.getElementById('time');
            if (!timeInput.value || timeInput === document.activeElement) {
                return; // Не обновляем если поле активно или уже заполнено
            }
            timeInput.value = DateUtils.getCurrentTime();
        }, 60000);
    }
    
    setupEventListeners() {
        // Основная форма
        const form = document.getElementById('gsdForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Управление единицами инсулина
        this.setupUnitsControls('', 'unitsValue');
        this.setupUnitsControls('edit', 'editUnitsValue');
        
        // Управление хлебными единицами
        this.setupBreadUnitsControls('', 'breadUnitsValue');
        this.setupBreadUnitsControls('edit', 'editBreadUnitsValue');
        
        // Обработка выбора инсулина
        this.setupInsulinSelectHandlers();
        
        // Обработка поля еды
        this.setupFoodFieldHandlers();
        
        // Настройки
        const settingsIcon = document.querySelector('.settings-icon');
        if (settingsIcon) {
            settingsIcon.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }
        
        // Закрытие модальных окон по клику вне них
        this.setupModalCloseHandlers();
    }
    
    setupUnitsControls(prefix, valueElementId) {
        const decreaseBtn = document.getElementById(`${prefix}decreaseUnits`);
        const increaseBtn = document.getElementById(`${prefix}increaseUnits`);
        const valueElement = document.getElementById(valueElementId);
        
        if (!decreaseBtn || !increaseBtn || !valueElement) return;
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(valueElement.textContent);
            if (value > 1) {
                valueElement.textContent = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseInt(valueElement.textContent);
            if (value < 50) {
                valueElement.textContent = value + 1;
            }
        });
    }
    
    setupBreadUnitsControls(prefix, valueElementId) {
        const decreaseBtn = document.getElementById(`${prefix}decreaseBreadUnits`);
        const increaseBtn = document.getElementById(`${prefix}increaseBreadUnits`);
        const valueElement = document.getElementById(valueElementId);
        
        if (!decreaseBtn || !increaseBtn || !valueElement) return;
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseFloat(valueElement.textContent);
            if (value > 0.5) {
                valueElement.textContent = (value - 0.5).toFixed(1);
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseFloat(valueElement.textContent);
            if (value < 20) {
                valueElement.textContent = (value + 0.5).toFixed(1);
            }
        });
    }
    
    setupInsulinSelectHandlers() {
        // Основная форма
        const insulinSelect = document.getElementById('insulin');
        const insulinUnits = document.getElementById('insulinUnits');
        
        if (insulinSelect && insulinUnits) {
            insulinSelect.addEventListener('change', () => {
                if (insulinSelect.value) {
                    insulinUnits.style.display = 'flex';
                } else {
                    insulinUnits.style.display = 'none';
                }
            });
            
            // Инициализация на старте
            if (insulinSelect.value) {
                insulinUnits.style.display = 'flex';
            }
        }
        
        // Форма редактирования
        const editInsulinSelect = document.getElementById('editInsulin');
        const editInsulinUnits = document.getElementById('editInsulinUnits');
        
        if (editInsulinSelect && editInsulinUnits) {
            editInsulinSelect.addEventListener('change', () => {
                if (editInsulinSelect.value) {
                    editInsulinUnits.style.display = 'flex';
                } else {
                    editInsulinUnits.style.display = 'none';
                }
            });
        }
    }
    
    setupFoodFieldHandlers() {
        // Основная форма
        const foodField = document.getElementById('food');
        const breadUnits = document.getElementById('breadUnits');
        
        if (foodField && breadUnits) {
            foodField.addEventListener('input', () => {
                if (foodField.value.trim()) {
                    breadUnits.style.display = 'flex';
                } else {
                    breadUnits.style.display = 'none';
                }
            });
        }
        
        // Форма редактирования
        const editFoodField = document.getElementById('editFood');
        const editBreadUnits = document.getElementById('editBreadUnits');
        
        if (editFoodField && editBreadUnits) {
            editFoodField.addEventListener('input', () => {
                if (editFoodField.value.trim()) {
                    editBreadUnits.style.display = 'flex';
                } else {
                    editBreadUnits.style.display = 'none';
                }
            });
        }
    }
    
    setupModalHandlers() {
        // Форма редактирования
        const editForm = document.getElementById('editEntryForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        }
        
        // Кнопка удаления в форме редактирования
        const editDeleteBtn = document.getElementById('editDeleteBtn');
        if (editDeleteBtn) {
            editDeleteBtn.addEventListener('click', () => {
                const modal = document.getElementById('editEntryModal');
                if (modal) modal.classList.remove('show');
                
                if (this.currentEditingEntryId) {
                    const entry = this.entries.find(e => e.id === this.currentEditingEntryId);
                    if (entry) {
                        const entryObj = new Entry(entry);
                        entryObj.showDeleteConfirmation();
                    }
                }
            });
        }
        
        // Настройки
        this.setupSettingsHandlers();
    }
    
    setupSettingsHandlers() {
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                Storage.exportData();
                this.closeAllModals();
            });
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.showImportDialog();
            });
        }
    }
    
    setupModalCloseHandlers() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const entryData = {
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            sugar: document.getElementById('sugar').value || null,
            insulin: document.getElementById('insulin').value,
            insulinUnits: document.getElementById('insulin').value ? document.getElementById('unitsValue').textContent : null,
            food: document.getElementById('food').value,
            breadUnits: document.getElementById('food').value.trim() ? document.getElementById('breadUnitsValue').textContent : null
        };
        
        const sanitizedEntry = Validation.sanitizeEntry(entryData);
        const validation = Validation.validateEntry(sanitizedEntry);
        
        if (!validation.isValid) {
            alert('Ошибка: ' + validation.errors.join(', '));
            return;
        }
        
        if (Storage.addEntry(sanitizedEntry)) {
            // Синхронизация с Airtable
            this.airtableSync.syncEntry(sanitizedEntry);
            
            this.loadEntries();
            this.resetForm();
            this.showSuccessBanner('editSuccessBanner');
        }
    }
    
    handleEditSubmit(e) {
        e.preventDefault();
        
        if (!this.currentEditingEntryId) return;
        
        const entryData = {
            date: document.getElementById('editDate').value,
            time: document.getElementById('editTime').value,
            sugar: document.getElementById('editSugar').value || null,
            insulin: document.getElementById('editInsulin').value,
            insulinUnits: document.getElementById('editInsulin').value ? document.getElementById('editUnitsValue').textContent : null,
            food: document.getElementById('editFood').value,
            breadUnits: document.getElementById('editFood').value.trim() ? document.getElementById('editBreadUnitsValue').textContent : null
        };
        
        const sanitizedEntry = Validation.sanitizeEntry(entryData);
        const validation = Validation.validateEntry(sanitizedEntry);
        
        if (!validation.isValid) {
            alert('Ошибка: ' + validation.errors.join(', '));
            return;
        }
        
        const existingEntry = this.entries.find(e => e.id === this.currentEditingEntryId);
        if (existingEntry) {
            const entry = new Entry(existingEntry);
            if (entry.update(sanitizedEntry)) {
                this.loadEntries();
                this.closeAllModals();
                this.showSuccessBanner('editSuccessBanner');
                this.currentEditingEntryId = null;
            }
        }
    }
    
    resetForm() {
        const form = document.getElementById('gsdForm');
        if (form) form.reset();
        
        // Восстанавливаем значения по умолчанию
        const dateField = document.getElementById('date');
        const timeField = document.getElementById('time');
        const unitsValue = document.getElementById('unitsValue');
        const breadUnitsValue = document.getElementById('breadUnitsValue');
        const insulinUnits = document.getElementById('insulinUnits');
        const breadUnits = document.getElementById('breadUnits');
        
        if (dateField) dateField.value = DateUtils.getCurrentDate();
        if (timeField) timeField.value = DateUtils.getCurrentTime();
        if (unitsValue) unitsValue.textContent = '8';
        if (breadUnitsValue) breadUnitsValue.textContent = '1.0';
        
        // Сбрасываем видимость блоков
        if (insulinUnits) insulinUnits.style.display = 'flex';
        if (breadUnits) breadUnits.style.display = 'none';
    }
    
    loadEntries() {
        this.entries = Storage.loadEntries();
        const sortedEntries = DateUtils.sortByDateTime(this.entries);
        DayCard.groupAndRenderEntries(sortedEntries);
    }
    
    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) modal.classList.add('show');
    }
    
    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const modal = document.getElementById('importConfirmModal');
                if (modal) modal.classList.add('show');
                
                const cancelBtn = document.getElementById('cancelImport');
                const confirmBtn = document.getElementById('confirmImport');
                
                const handleCancel = () => {
                    if (modal) modal.classList.remove('show');
                    cleanup();
                };
                
                const handleConfirm = async () => {
                    if (modal) modal.classList.remove('show');
                    
                    try {
                        const importedCount = await Storage.importData(file);
                        this.loadEntries();
                        this.showSuccessBanner('importSuccessBanner');
                    } catch (error) {
                        alert('Ошибка импорта: ' + error.message);
                    }
                    
                    cleanup();
                };
                
                const cleanup = () => {
                    if (cancelBtn) cancelBtn.removeEventListener('click', handleCancel);
                    if (confirmBtn) confirmBtn.removeEventListener('click', handleConfirm);
                };
                
                if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
                if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
                
            } catch (error) {
                alert('Ошибка чтения файла: ' + error.message);
            }
        });
        
        input.click();
    }
    
    showSuccessBanner(bannerId) {
        const banner = document.getElementById(bannerId);
        if (banner) {
            banner.style.display = 'block';
            
            setTimeout(() => {
                banner.style.display = 'none';
            }, 3000);
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.gsdApp = new GSDApp();
});

// Глобальные переменные для совместимости
window.currentEditingEntryId = null;