const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export class DailySlots {
    constructor() {
        this.dataset = {}; // { date : {slots, bookeds} }
    }

    addDataSet(fullDate) {
        if(this.has(fullDate)) {
            return
        }

        this.dataset[fullDate] = {
            slots : new Set(), 
            bookeds : new Set() 
        };
    }

    addSlot(amazDate) {
        this.addDataSet(amazDate.fullDate)
        this.dataset[amazDate.fullDate].slots.add(amazDate.hourFmt());
    }
    
    addBooked(amazDate) {
        this.addSlot(amazDate);
        this.dataset[amazDate.fullDate].bookeds.add(amazDate.hourFmt());
    }  

    has(date) {
        return this.dataset[date] !== undefined;
    }

    /**
     * @param {string} date YYYY-MM-DD
     * @return Array
     */
    slotsOf(date) {
        if(!this.has(date)) {
            return [];
        }

        return [...this.dataset[date].slots].sort((ta, tb) => ta.localeCompare(tb));
    }

    /**
     * @param {string} date YYYY-MM-DD
     * @return Set
     */
    bookedsOf(date) {
        if(!this.has(date)) {
            return new Set();
        }

        return this.dataset[date].bookeds;
    }
}

class DailySchedule  {
    constructor(day, amazDate) {
        this.day = day;
        this.amazDate = amazDate;
        this.slots = [];
        this.bookeds = new Set();
    }

    set(attrs) {
        return Object.assign(
            new this.constructor(this.day, this.amazDate), 
            {...this, ...attrs}
        );
    }

    setSlots(slots, bookeds) {
        return this.set({ slots, bookeds });
    }

    weekDayFmt() {
        return weekDays[this.day];
    }
}

export default class WeeklySchedule {
    constructor(week) {
        this.week = week;
        this.dailySchedules = [...new Array(7)].map((_, day) => new DailySchedule(day, this.week.from.addDays(day)));
    }

    set(attrs) {        
        return Object.assign(
            new this.constructor(this.week), 
            {...this, ...attrs}
        );
    }

    setDailyScheduleSlots(dailySlots) {
        const dailySchedules = this.dailySchedules.map(ds => {
            const date = ds.amazDate.fullDate;
            if(!dailySlots.has(date)) {
                return ds;
            }
            
            return ds.setSlots(dailySlots.slotsOf(date), dailySlots.bookedsOf(date));
        });

        return this.set({ dailySchedules });
    }
}