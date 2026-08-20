import { useEffect, useState } from 'react';
import { ClockFill } from 'react-bootstrap-icons';
import { getCountdown } from '@/utils/dateUtils';
import { formatDate } from '@/utils/dateUtils';

interface CountdownProps {
  targetDate: string;
  label?: string;
}

export default function Countdown({ targetDate, label = 'Your trip starts in' }: CountdownProps) {
  const [now, setNow] = useState(new Date());

  // useEffect: update countdown every minute (appropriate frequency)
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, isPast } = getCountdown(targetDate, now);

  if (isPast) {
    return (
      <div className="tm-countdown tm-countdown-past">
        <ClockFill className="me-2" /> This trip has already started.
        <div className="small text-muted mt-1">Started on {formatDate(targetDate)}</div>
      </div>
    );
  }

  return (
    <div className="tm-countdown">
      <div className="tm-countdown-label">{label}</div>
      <div className="tm-countdown-grid">
        <div className="tm-countdown-unit">
          <span className="tm-countdown-num">{days}</span>
          <span className="tm-countdown-unit-label">Days</span>
        </div>
        <div className="tm-countdown-unit">
          <span className="tm-countdown-num">{hours}</span>
          <span className="tm-countdown-unit-label">Hours</span>
        </div>
        <div className="tm-countdown-unit">
          <span className="tm-countdown-num">{minutes}</span>
          <span className="tm-countdown-unit-label">Minutes</span>
        </div>
      </div>
    </div>
  );
}
