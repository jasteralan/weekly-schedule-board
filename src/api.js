import { AmazDate } from './entities/Week';
import { DailySlots } from './entities/WeeklySchedule';

/**
 * Generate dummay data like { available: [period, ...], booked : [period, ...]}
 * which period is like { "start" : "2020-07-18T11:30:00Z", "end" : "2020-07-17T13:00:00Z" }
 * 
 * @param {AmazDate} amazDate 
 * 
 */
function dummyData(amazDate) {
    const date = amazDate.fullDate;
    let available = [], booked = [];

    [
       ['00:00', '00:30'],
       ['00:30', '01:00'],
       ['01:00', '01:30'],
       ['01:30', '02:00'],
       ['02:00', '02:30'],

       ['08:00', '08:30'],
       ['08:30', '09:00'],
       ['09:00', '09:30'],
       ['09:30', '10:00'],
       ['10:00', '10:30'],
       ['10:30', '11:00'],
       ['11:00', '11:30'],
       ['11:30', '12:00'],
       ['12:00', '12:30'],

       ['22:00', '22:30'],
       ['22:30', '23:00'],
       ['23:00', '23:30'],
    ].forEach(([start, end]) => {
            const take = Math.random() > 0.5;
            if(!take) {
                return;
            }

            const data = {
                "start" : `${date}T${start}:00Z`,
                "end"   : `${date}T${end}:00Z`
            };

            if(Math.random() > 0.3) {
                available.push(data);
            } else {
                booked.push(data);
            }
    });

    return [available, booked];
}

async function createDummyData(schedule) {
    let payload = { available: [], booked : [] };

    schedule.dailySchedules.forEach(ds => {
        const [available, booked] = dummyData(ds.amazDate);

        payload.available = [...payload.available, ...available];
        payload.booked    = [...payload.booked, ...booked];
    });

    return Promise.resolve(payload);
}

/**
 * @param {Schedule} schedule
 */
export async function fetchWeeklySchedule(schedule) {
    const dummy = await createDummyData(schedule);
    const dailySlots = new DailySlots();
    dummy.available.forEach(({ start, end }) => {
        dailySlots.addSlot(new AmazDate(new Date(start).getTime()));
        dailySlots.addSlot(new AmazDate(new Date(end).getTime()));
    });

    dummy.booked.forEach(({ start, end }) => {
        dailySlots.addBooked(new AmazDate(new Date(start).getTime()));
        dailySlots.addBooked(new AmazDate(new Date(end).getTime()));
    });
    
    return schedule.setDailyScheduleSlots(dailySlots);
}