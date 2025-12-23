import type { EventLogEntry } from "../types";

/*
 * For testing, letss count to 1-10
 */
export function* testGenerator(): Generator<EventLogEntry, void, void> {
  yield {
    timestamp: new Date().toISOString(),
    type: "start",
    message: "Test Started!",
  };

  for (let i = 1; i <= 10; i++) {
    yield {
      timestamp: new Date().toISOString(),
      type: "iteration",
      message: `Counting ${i}`,
    };
  }

  yield {
    timestamp: new Date().toISOString(),
    type: "success",
    message: "Test Complete",
  };
}
