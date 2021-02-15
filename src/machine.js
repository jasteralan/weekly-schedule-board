import { Machine, assign } from 'xstate';

import { fetchWeeklySchedule } from './api';
import WeeklySchedule from './entities/WeeklySchedule';

/**
 * @param {Week} week 
 */
export default function createMachine(week) {
    return Machine(
        {
            id: 'weekly-schedule',
            initial: 'loadingSchedule',
            context: {
                schedule: new WeeklySchedule(week),
            },
            states: {
                toPreviousSchedule : {
                    on: {
                        '': {
                            target: 'loadingSchedule',
                            actions: ['setPreviousWeekSchedule']
                        }
                    }
                },

                toNextSchedule : {
                    on: {
                        '': {
                            target: 'loadingSchedule',
                            actions: ['setNextWeekSchedule']
                        }
                    }
                },

                loadingSchedule : {
                    invoke : {
                        src: 'fetchSchedule',
                        onDone: {
                            target: 'ready',
                            actions: ['setLoadedSchedule']
                        },
                    }
                },

                ready: {
                    on : {
                        'CHECK_PREVIOUS_WEEK' : 'toPreviousSchedule',
                        'CHECK_NEXT_WEEK' : 'toNextSchedule'
                    }
                },
            },
        },
        {
            actions: {
                setPreviousWeekSchedule: assign({ 
                    schedule: ctx => new WeeklySchedule(ctx.schedule.week.previous())
                }),
                setNextWeekSchedule: assign({ 
                    schedule: ctx => new WeeklySchedule(ctx.schedule.week.next())
                }),
                setLoadedSchedule: assign({ schedule: (ctx, evt) => evt.data.schedule }),
            },
            services : {
                fetchSchedule: async (ctx) => {
                    const schedule = await fetchWeeklySchedule(ctx.schedule);
                    return { schedule };
                },
            }
        }
    );
}