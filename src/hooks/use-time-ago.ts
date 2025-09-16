
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export const useTimeAgo = (date: Date | undefined) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!date) {
        setTimeAgo('');
        return;
    }
    
    const update = () => {
      setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    };

    update();
    const interval = setInterval(update, 60000); // update every minute

    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
};
