const msOfDay = 24 * 60 * 60 * 1000;
const leftPad = n => n >= 10? `${n}` : `0${n}`;

/**
 * @param {int} current 
 * @param {int} days 
 */
function startOfDiffDays(current, days) {
    const d = new Date(current).setHours(0,0,0,0);
    return d + days * msOfDay;
}

export class AmazDate {
    /**
     * @param {int} timestamp timestamp
     */
    constructor(timestamp) {
        this.date = new Date(timestamp);
        this.timestamp = timestamp;

        this.fullDate = [
            this.date.getFullYear(),
            leftPad(this.date.getMonth() + 1),
            leftPad(this.date.getDate())
        ].join('-');
    }

    /**
     * @param {int} days
     * @return {AmazDate};
     */
    addDays(days) {
        return new AmazDate(startOfDiffDays(this.timestamp, days));
    }

    dateFmt() {
        return leftPad(this.date.getDate());
    }

    hourFmt() {
        return [this.date.getHours(), this.date.getMinutes()].map(leftPad).join(':');        
    }
}

export default class Week {
    /**
     * @param {AmazDate} current   
     * @return {Week}
     */
    static ofCurrent(current) {
        const startOfWeek = current.addDays(-current.date.getDay());
                
        return new Week(startOfWeek);
    }

    /**
     * @param {AmazDate} from 
     */
    constructor(from) {
        this.from = from;
    }

    previous() {
        return new Week(
            new AmazDate(startOfDiffDays(this.from.timestamp, -7))
        );
    }

    next() {
        return new Week(
            new AmazDate(startOfDiffDays(this.from.timestamp, 7))
        );
    }
}