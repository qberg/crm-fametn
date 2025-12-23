import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Slider } from "@repo/design-system/components/ui/slider";
import { Badge } from "@repo/design-system/components/ui/badge";
import { RotateCcw } from "lucide-react";

export type ConfigPanelState = {
  vendorCount: number;
  buyerCount: number;
  minMeetingsPerVendor: number;
  maxMeetingsPerVendor: number;
  meetingDurationMinutes: number;
};

type ConfigPanelProps = {
  config: ConfigPanelState;
  onConfigChange: (config: ConfigPanelState) => void;
  onReset: () => void;
  onRegenerate: () => void;
};

const DEFAULT_CONFIG: ConfigPanelState = {
  vendorCount: 4,
  buyerCount: 3,
  minMeetingsPerVendor: 2,
  maxMeetingsPerVendor: 5,
  meetingDurationMinutes: 30,
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
  onReset,
  onRegenerate,
}) => {
  const updateConfig = (key: keyof ConfigPanelState, value: number) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Configuration</CardTitle>
        <CardDescription>
          Adjust parameters to test different scenarios
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vendor Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Vendors</label>
            <Badge variant="outline" className="font-mono">
              {config.vendorCount}
            </Badge>
          </div>
          <Slider
            value={[config.vendorCount]}
            onValueChange={([value]) => updateConfig("vendorCount", value)}
            min={2}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2</span>
            <span>10</span>
          </div>
        </div>

        {/* Buyer Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Buyers</label>
            <Badge variant="outline" className="font-mono">
              {config.buyerCount}
            </Badge>
          </div>
          <Slider
            value={[config.buyerCount]}
            onValueChange={([value]) => updateConfig("buyerCount", value)}
            min={2}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2</span>
            <span>8</span>
          </div>
        </div>

        <div className="border-t pt-4" />

        {/* Min Meetings Per Vendor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Min Meetings/Vendor</label>
            <Badge variant="outline" className="font-mono">
              {config.minMeetingsPerVendor}
            </Badge>
          </div>
          <Slider
            value={[config.minMeetingsPerVendor]}
            onValueChange={([value]) =>
              updateConfig("minMeetingsPerVendor", value)
            }
            min={1}
            max={6}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>6</span>
          </div>
        </div>

        {/* Max Meetings Per Vendor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Max Meetings/Vendor</label>
            <Badge variant="outline" className="font-mono">
              {config.maxMeetingsPerVendor}
            </Badge>
          </div>
          <Slider
            value={[config.maxMeetingsPerVendor]}
            onValueChange={([value]) =>
              updateConfig("maxMeetingsPerVendor", value)
            }
            min={config.minMeetingsPerVendor} // Can't be less than min
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{config.minMeetingsPerVendor}</span>
            <span>10</span>
          </div>
        </div>

        <div className="border-t pt-4" />

        {/* Meeting Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Meeting Duration</label>
            <Badge variant="outline" className="font-mono">
              {config.meetingDurationMinutes} min
            </Badge>
          </div>
          <Slider
            value={[config.meetingDurationMinutes]}
            onValueChange={([value]) =>
              updateConfig("meetingDurationMinutes", value)
            }
            min={10}
            max={60}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10 min</span>
            <span>60 min</span>
          </div>
        </div>

        <div className="border-t pt-4" />

        {/* Validation Warning */}
        {config.minMeetingsPerVendor > config.maxMeetingsPerVendor && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive">
              ⚠️ Min meetings cannot exceed max meetings
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button onClick={onRegenerate} className="w-full" variant="dim">
            Regenerate Data
          </Button>

          <Button onClick={onReset} className="w-full" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { DEFAULT_CONFIG };
