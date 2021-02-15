import './App.css';
import { useMachine } from '@xstate/react';

import Week, { AmazDate } from './entities/Week';
import createMachine from './machine';
import ControlPanel from './components/ControlPanel';
import DailySchedule from './components/DailySchedule';


function App() {
    const current = new AmazDate(new Date().getTime());
    const currentWeek = Week.ofCurrent(current);
    const [state, send] = useMachine(createMachine(currentWeek));
    const { schedule } = state.context;
    
    return (
        <div className="App">
            <header><h1>Schedule Board</h1></header>

            <ControlPanel schedule={schedule} 
                          toPrevious = {() => send('CHECK_PREVIOUS_WEEK')}
                          toNext= {() => send('CHECK_NEXT_WEEK')} 
            />

            <section className="Calandar">
                { schedule.dailySchedules.map(sc => <DailySchedule key={`d-${sc.day}`} current={current} schedule={sc} />) }
            </section>
        </div>
    );
}

export default App;
