import { useEffect, useState } from "react";
import { defaultSettings, type TimesheetSettings } from "@lib/time";
import TimeTracker from "@lib/timetracker";

interface UseTimerProps {
  startTimeSeconds: number;
  use24Hour: boolean;
}

interface UseTimerHook {
  seconds: number;
  isLoading: boolean;
  isPlaying: boolean;
  resetTime: (value?: number) => void;
  setPlaying: (playing: boolean) => void;
}

export function useTimer({
  startTimeSeconds = 0,
  use24Hour = true,
}: UseTimerProps): UseTimerHook {
  const [seconds, setTime] = useState<number>(startTimeSeconds);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isPlaying, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setTime((previousTime) => previousTime + TimeTracker.SECOND_INTERVAL);
      }, TimeTracker.SECOND_INTERVAL * 1000);
      setLoading(false);
    }
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [use24Hour, isPlaying]);

  const resetTime = (value: number = 0) => {
    if (seconds) setTime(0);
  };

  return { seconds, isLoading, isPlaying, resetTime, setPlaying };
}
