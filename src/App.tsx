import React from 'react';
import {useEffect, useState} from 'react';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

type Status = 'run' | 'stop' | 'wait';

function App() {
    const [sec, setSec] = useState<number>(0);
    const [status, setStatus] = useState<Status>('stop');
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe$ = new Subject();
        interval(1000)
            .pipe(takeUntil(unsubscribe$))
            .subscribe(() => {
                if (status === "run") {
                    setSec(val => val + 1000);
                }
            });
        return () => {
            unsubscribe$.next(0);
            unsubscribe$.complete();
        };
    }, [status]);

    const start = React.useCallback(() => {
        setDisabled(true)
        setStatus('run');
    }, []);

    const stop = React.useCallback(() => {
        setDisabled(false)
        setStatus('stop');
        setSec(0);
    }, []);

    const reset = React.useCallback(() => {
        setSec(0);
    }, []);

    const wait = React.useCallback(() => {
        setDisabled(false)
        setStatus('wait');
    }, []);

    return (
        <div>
            <div>
                <span> {new Date(sec).toISOString().slice(11, 19)}</span>
                <button className="start-button" onClick={start} disabled={disabled}>
                    Start
                </button>
                <button className="stop-button" onClick={stop} >
                    Stop
                </button>
                <button onClick={reset} >Reset</button>
                <button onClick={wait} >Wait</button>
            </div>
        </div>
    );
}

export default App;
