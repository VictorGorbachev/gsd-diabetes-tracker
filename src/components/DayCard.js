// Компонент карточки дня
class DayCard {
    constructor(date, entries) {
        this.date = date;
        this.entries = entries;
    }

    render() {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // Заголовок дня
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = DateUtils.formatDisplayDate(this.date);
        dayCard.appendChild(header);
        
        // Записи
        this.entries.forEach(entryData => {
            const entry = new Entry(entryData);
            const entryElement = entry.render();
            dayCard.appendChild(entryElement);
        });
        
        return dayCard;
    }
    
    static groupAndRenderEntries(entries) {
        const container = document.getElementById('entries');
        container.innerHTML = '';
        
        if (entries.length === 0) {
            document.getElementById('emptyEntriesStub').style.display = 'block';
            return;
        }
        
        document.getElementById('emptyEntriesStub').style.display = 'none';
        
        // Группируем записи по датам
        const groupedEntries = DateUtils.groupByDate(entries);
        
        // Сортируем даты (новые сверху)
        const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
            return new Date(b) - new Date(a);
        });
        
        // Создаем карточки дней
        sortedDates.forEach(date => {
            const dayCard = new DayCard(date, groupedEntries[date]);
            const dayCardElement = dayCard.render();
            container.appendChild(dayCardElement);
        });
        
        // Проверяем награды
        DayCard.checkRewards(entries);
    }
    
    static checkRewards(entries) {
        // Проверяем, есть ли записи за вчерашний день без "вылетов"
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = DateUtils.formatDate(yesterday);
        
        const yesterdayEntries = entries.filter(entry => entry.date === yesterdayStr);
        
        if (yesterdayEntries.length > 0) {
            const hasHighSugar = yesterdayEntries.some(entry => {
                if (entry.sugar === null || entry.sugar === undefined || entry.sugar === '') {
                    return false;
                }
                const sugarLevel = parseFloat(entry.sugar);
                return sugarLevel > 10; // Высокий сахар
            });
            
            if (!hasHighSugar) {
                // Показываем награду только если еще не показывали сегодня
                const lastRewardDate = localStorage.getItem('lastRewardDate');
                const today = DateUtils.getCurrentDate();
                
                if (lastRewardDate !== today) {
                    DayCard.showReward();
                    localStorage.setItem('lastRewardDate', today);
                }
            }
        }
    }
    
    static showReward() {
        const modal = document.getElementById('rewardModal');
        modal.classList.add('show');
        
        // Показываем блок с цветами
        const flowersBlock = document.getElementById('flowersBlock');
        flowersBlock.style.display = 'block';
        flowersBlock.innerHTML = '🌸 🌺 🌻 🌹 🌷 💐';
        
        const closeBtn = document.getElementById('closeRewardBtn');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        }, { once: true });
    }
    
    getSugarStatistics() {
        const sugarEntries = this.entries.filter(entry => {
            return entry.sugar !== null && entry.sugar !== undefined && entry.sugar !== '';
        });
        
        if (sugarEntries.length === 0) {
            return null;
        }
        
        const sugarValues = sugarEntries.map(entry => parseFloat(entry.sugar));
        const avg = sugarValues.reduce((sum, val) => sum + val, 0) / sugarValues.length;
        const min = Math.min(...sugarValues);
        const max = Math.max(...sugarValues);
        
        return {
            average: avg.toFixed(1),
            min: min.toFixed(1),
            max: max.toFixed(1),
            count: sugarEntries.length
        };
    }
    
    getInsulinStatistics() {
        const insulinEntries = this.entries.filter(entry => {
            return entry.insulin && entry.insulinUnits;
        });
        
        if (insulinEntries.length === 0) {
            return null;
        }
        
        const totalUnits = insulinEntries.reduce((sum, entry) => {
            return sum + parseInt(entry.insulinUnits);
        }, 0);
        
        const insulinTypes = {};
        insulinEntries.forEach(entry => {
            const type = entry.insulin;
            if (!insulinTypes[type]) {
                insulinTypes[type] = {
                    count: 0,
                    totalUnits: 0
                };
            }
            insulinTypes[type].count++;
            insulinTypes[type].totalUnits += parseInt(entry.insulinUnits);
        });
        
        return {
            totalUnits,
            injections: insulinEntries.length,
            types: insulinTypes
        };
    }
    
    static renderStatisticsView(entries) {
        // Эта функция может быть использована для показа статистики
        // в будущих версиях приложения
        const stats = {
            totalEntries: entries.length,
            daysWithEntries: new Set(entries.map(e => e.date)).size,
            avgSugar: Storage.calculateAverageSugar(entries)
        };
        
        console.log('Статистика:', stats);
        return stats;
    }
}