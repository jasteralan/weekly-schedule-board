function canNavToPreious(week) {
    return week.from.timestamp > new Date().getTime();
}

function durationFmt(week) {
    const fromStr = week.from.fullDate.replace(/-/g, '/');

    /**
     * @param {AmazDate} from 
     */
    const endDateFmt = (from) => {
        const end = from.addDays(6);
        const [fromYear, fromMonth] = from.fullDate.split('-');
        const [year, month, date] = end.fullDate.split('-');
     
        let arr = [];
        if(year !== fromYear) {
            arr.push(year);
        }

        if(month !== fromMonth) {
            arr.push(month);
        }
        
        arr.push(date);

        return arr.join('/');
    }

    return `${fromStr} – ${endDateFmt(week.from)}`;
}

function timezoneFmt() {
    const [raw] = new Date().toString().match(/GMT.*/); // will get like GMT+0000 (XXXX)
    const [gmt, location] = raw.split(' ');

    return `${location.replace(/[()]/g, '')} (${gmt})`;
}

export default function ControlPanel({ schedule, toNext, toPrevious }) {
    const preable = canNavToPreious(schedule.week);
    
    return (
        <section className="Control-Panel">
            <div className="Control-Panel-Nav">
                <button disabled={!preable} onClick={() => preable && toPrevious()}>{`<`}</button>
                <button onClick={() => toNext()}>{`>`}</button>
            </div>
            <div className="Control-Panel-Duration">{ durationFmt(schedule.week) }</div>
            <div className="Control-Panel-Hint">
                * 時間以 {timezoneFmt()} 顯示
            </div>
        </section>
    );
}