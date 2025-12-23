import React, { useRef, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/design-system/components/ui/sheet";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { Button } from "@repo/design-system/components/ui/button";
import type { EventLogEntry } from "../types";

type EventLogSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: EventLogEntry[];
  onClear: () => void;
  headerControls?: React.ReactNode;
};

export const EventLogSheet: React.FC<EventLogSheetProps> = ({
  open,
  onOpenChange,
  events,
  onClear,
  headerControls,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && open) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="font-mono text-base">
                [ EVENT LOG ]
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">
                Real-time algorithm execution trace
              </SheetDescription>
            </div>
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="font-mono text-xs"
            >
              [CLEAR]
            </Button>
          </div>

          {headerControls}
        </SheetHeader>

        <ScrollArea className="h-[calc(70vh-180px)] mt-4">
          <div ref={scrollRef}>
            {events.length === 0 ? (
              <div className="font-mono text-xs text-muted-foreground py-8 text-center">
                [ No events yet. Run algorithm to begin. ]
              </div>
            ) : (
              <div className="space-y-1 pb-4 font-mono text-xs pr-4">
                {events.map((event, idx) => (
                  <EventLogItem key={idx} event={event} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between w-full">
            <div className="font-mono text-xs text-muted-foreground">
              {events.length} events logged
            </div>
            <SheetClose asChild>
              <Button variant="outline" className="font-mono text-xs">
                [CLOSE]
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

type EventLogItemProps = {
  event: EventLogEntry;
};

const EventLogItem: React.FC<EventLogItemProps> = ({ event }) => {
  const getEventStyle = (type: EventLogEntry["type"]) => {
    switch (type) {
      case "start":
        return "text-chart-3 border-l-4 border-chart-3 bg-chart-3/10";
      case "phase":
        return "text-chart-2 border-l-4 border-chart-2 bg-chart-2/10";
      case "iteration":
        return "text-secondary border-l-4 border-secondary bg-secondary/10";
      case "proposal":
        return "text-chart-1 border-l-4 border-chart-1 bg-chart-1/10";
      case "acceptance":
        return "text-chart-3 border-l-4 border-chart-3 bg-chart-3/10";
      case "rejection":
        return "text-destructive border-l-4 border-destructive bg-destructive/10";
      case "review":
        return "text-chart-4 border-l-4 border-chart-4 bg-chart-4/10";
      case "status":
        return "text-muted-foreground border-l-4 border-muted bg-muted/10";
      case "success":
        return "text-primary border-l-4 border-primary bg-primary/10";
      case "error":
        return "text-destructive border-l-4 border-destructive bg-destructive/10";
      case "info":
        return "text-foreground/60 border-l-4 border-border bg-muted/5";
      default:
        return "text-muted-foreground border-l-4 border-border";
    }
  };

  const getEventPrefix = (type: EventLogEntry["type"]) => {
    switch (type) {
      case "start":
        return ">>> ";
      case "phase":
        return "[PHASE]";
      case "iteration":
        return "[ITER]";
      case "proposal":
        return "[PROPOSE]";
      case "acceptance":
        return "[ACCEPT]";
      case "rejection":
        return "[REJECT]";
      case "review":
        return "[REVIEW]";
      case "status":
        return "[STATUS]";
      case "success":
        return "*** ";
      case "error":
        return "[ERROR]";
      case "info":
        return "[INFO]";
      default:
        return "";
    }
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ms = date.getMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  return (
    <div className={`pl-3 py-1.5 rounded-sm ${getEventStyle(event.type)}`}>
      <div className="flex items-start gap-2">
        <span className="text-muted-foreground shrink-0">
          [{formatTimestamp(event.timestamp)}]
        </span>
        <div className="flex-1">
          <span className="whitespace-pre-wrap">
            {getEventPrefix(event.type)}
            {event.message}
          </span>

          {event.details && (
            <div className="ml-12 mt-0.5 text-muted-foreground">
              {event.details.vendorId && event.details.buyerId && (
                <div>
                  {event.details.vendorId} -- {event.details.buyerId}
                  {event.details.timeSlot && ` @ ${event.details.timeSlot}`}
                  {event.details.score !== undefined &&
                    ` | score=${event.details.score.toFixed(3)}`}
                  {event.details.tier && ` tier=${event.details.tier}`}
                </div>
              )}
              {event.details.slots !== undefined && (
                <div>{event.details.slots} available slots</div>
              )}
              {event.details.reason && (
                <div>reason: {event.details.reason}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
