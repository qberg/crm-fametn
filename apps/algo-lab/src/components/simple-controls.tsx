import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { SchedulerState } from "../types";
import { Button } from "@repo/design-system/components/ui/button";
import { Slider } from "@repo/design-system/components/ui/slider";

type Props = {
  state: SchedulerState;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
};

function SimpleControls({
  state,
  speed,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onSpeedChange,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {state === "idle" && <Button onClick={onStart}>START</Button>}

          {state === "running" && <Button onClick={onPause}>PAUSE</Button>}

          {state === "paused" && (
            <>
              <Button onClick={onResume}>RESUME</Button>
              <Button onClick={onStep} variant="outline">
                STEP
              </Button>
            </>
          )}

          {state !== "idle" && (
            <Button onClick={onReset} variant="destructive">
              RESET
            </Button>
          )}

          <div className="space-y-2 ml-auto min-w-96">
            <div className="flex justify-between">
              <span className="text-sm font-mono">Speed</span>
              <span className="text-sm font-mono text-muted-foreground">
                {speed}x
              </span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([v]) => onSpeedChange(v)}
              min={0.5}
              max={5}
              step={0.5}
              disabled={state === "idle"}
            />
          </div>
        </div>

        {/* Status 
        <div className="border-t pt-3">
          <div className="text-xs font-mono">
            Status: <span className="text-primary">{state.toUpperCase()}</span>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
}

export default SimpleControls;
