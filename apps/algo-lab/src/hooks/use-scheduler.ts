import { useCallback, useEffect, useRef, useState } from "react";
import type { EventLogEntry, SchedulerState } from "../types";

export const useScheduler = () => {
  const [state, setState] = useState<SchedulerState>("idle");
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [speed, setSpeed] = useState<number>(1);

  // in react world re render is a pain in the a**
  // Generator<Yield, Return, Next>
  const generatorRef = useRef<Generator<EventLogEntry, void, void> | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);

  // A function for step execution
  const step = useCallback(() => {
    if (!generatorRef.current) return;

    const { value, done } = generatorRef.current.next();

    if (!done && value) {
      setEvents((prev) => [...prev, value]);
    }

    if (done) {
      setState("complete");

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, []);

  const start = useCallback(
    (generator: Generator<EventLogEntry, void, void>) => {
      generatorRef.current = generator;
      setEvents([]);
      setState("running");
    },
    [],
  );

  const pause = useCallback(() => {
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    setState("running");
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    generatorRef.current = null;
    setState("idle");
    setEvents([]);
  }, []);

  // The auto-run logic for the code execution
  useEffect(() => {
    if (state === "running") {
      const delay = 500 / speed;

      timerRef.current = window.setInterval(() => {
        step();
      }, delay);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state, speed, step]);

  return {
    state,
    events,
    speed,
    start,
    step,
    pause,
    resume,
    reset,
    setSpeed,
  };
};
