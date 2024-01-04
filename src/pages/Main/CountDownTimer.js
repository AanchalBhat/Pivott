import React from 'react';
import { useCountdown } from './useCountDown';
import "./Timer.css";

const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
        <div className='countdown'>
            <p>{value}</p>
            <span>{type}</span>
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter">

            <a
                style={{ pointerEvents: "none" }}
                className="countdown-link"
            >
                <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
                <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
                <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
                <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
            </a>
        </div>
    );
};

const CountdownTimer = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <span></span>;
    } else {
        return (
            <section className="ps-trusted-customers ps-bg-timer">
                <div>
                <div className="ps-heading-title">
                  <h2>
                  We are launching Soon
                  </h2>
                </div>
                    <ShowCounter
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                    />
                </div>
            </section>

        );
    }
};

export default CountdownTimer;
