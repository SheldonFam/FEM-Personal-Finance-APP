import { useEffect, useState } from "react";

/**
 * The current date, re-issued when the calendar day rolls over.
 *
 * Anything answering "is this paid yet" measures against today, and today
 * moves while the page is open. Reading `new Date()` inside a memo does not
 * track that: the memo captures whatever the clock said when its dependencies
 * last changed, so a tab left open overnight keeps yesterday's answer until
 * something unrelated happens to invalidate it.
 *
 * The value is stable for the whole of a day, so it can sit in a memo's
 * dependencies without causing a recompute on every render -- it changes once,
 * at midnight, which is exactly when the answers it feeds become wrong.
 */
export function useCurrentDate(): Date {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const nextMidnight = new Date(today);
    nextMidnight.setHours(24, 0, 0, 0);

    // A delay that has already passed fires on the next tick, so a tab waking
    // from sleep long after the boundary corrects itself rather than waiting
    // out another full day.
    const timer = setTimeout(
      () => setToday(new Date()),
      nextMidnight.getTime() - Date.now(),
    );

    return () => clearTimeout(timer);
  }, [today]);

  return today;
}
