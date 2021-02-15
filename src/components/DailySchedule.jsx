function Slot({ time, booked }) {
    return <div className={`Daily-Schedule-Slot ${booked? 'Booked' : ''}`}>{ time }</div>
}

export default function DailySchedule({ current, schedule }) {
    return (
        <div className="Daily-Schedule">
            <h2>{ schedule.weekDayFmt() }</h2>
            <div className="Daily-Schedule-Date">{ schedule.amazDate.dateFmt() }</div>
            {
                current.fullDate < schedule.amazDate.fullDate &&
                    <div className="Daily-Schedule-Slots">
                    {
                        schedule.slots.map(time => 
                            <Slot key={time} time={time} booked={schedule.bookeds.has(time)} />
                        )
                    }
                </div>
            }
        </div>
    )
}
