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
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNextMidnight = () => {
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);

      // A second past the boundary, and never nearer than a second away.
      // Timers may fire fractionally early; without the floor, one that did
      // would find itself still on the old day, rearm with a ~0ms delay, and
      // spin -- re-rendering every dependent memo -- until the clock caught
      // up. A tab waking long after the boundary still lands on the floor and
      // corrects on the next tick rather than waiting out another day.
      const delay = Math.max(nextMidnight.getTime() - Date.now() + 1_000, 1_000);

      timer = setTimeout(() => {
        // Only a genuine day change mints a new object. Returning the previous
        // one keeps identity stable, so a timer that fired early costs nothing
        // downstream.
        setToday((prev) => {
          const now = new Date();
          return prev.toDateString() === now.toDateString() ? prev : now;
        });
        scheduleNextMidnight();
      }, delay);
    };

    scheduleNextMidnight();
    return () => clearTimeout(timer);
  }, []);

  return today;
}
