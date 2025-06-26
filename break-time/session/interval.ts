const timeThreshold = 60000;
const interval = 1000;

export function startSessionInterval(
  session: Record<string, number>,
  action: (id: string, elapsed: number) => void,
) {
  setInterval(() => {
    const now = Date.now();
    for (const [id, startTime] of Object.entries(session)) {
      const elapsed = now - startTime;
      if (elapsed % timeThreshold <= interval && elapsed > interval) {
        action(id, elapsed);
        // You can add additional actions here, e.g., send a message or notification
      }
    }
  }, interval);
}
