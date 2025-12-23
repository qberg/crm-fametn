import { useState, useMemo } from "react";
import {
  ConfigPanel,
  DEFAULT_CONFIG,
  type ConfigPanelState,
} from "./config-panel";
import type { SchedulerConfig } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { PreferenceMatrix } from "./preference-matrix";
import { EventLogSheet } from "./event-log-sheet";
import { useScheduler } from "../hooks/use-scheduler";
import { testGenerator } from "../lib/mock-generator";
import SimpleControls from "./simple-controls";
import { generateMockCampaign } from "../lib/match-algorithm/scheduler";

const MockDataTest = () => {
  const scheduler = useScheduler();
  const [logSheetOpen, setLogSheetOpen] = useState(false);

  const [config, setConfig] = useState<ConfigPanelState>(DEFAULT_CONFIG);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleStart = () => {
    const generator = testGenerator();
    scheduler.start(generator);
    setLogSheetOpen(true);
  };

  const schedulerConfig: SchedulerConfig = useMemo(
    () => ({
      startDate: "2025-01-15",
      endDate: "2025-01-16",
      dailySchedules: [
        {
          date: "2025-01-15",
          windows: [
            { start: "09:00", end: "12:00" },
            { start: "14:00", end: "17:00" },
          ],
        },
        {
          date: "2025-01-16",
          windows: [{ start: "09:00", end: "17:00" }],
        },
      ],
      minMeetingsPerVendor: config.minMeetingsPerVendor,
      maxMeetingsPerVendor: config.maxMeetingsPerVendor,
      meetingDurationMinutes: config.meetingDurationMinutes,
    }),
    [config],
  );

  // Generate mock data based on current config
  const mockData = useMemo(
    () =>
      generateMockCampaign(
        config.vendorCount,
        config.buyerCount,
        schedulerConfig,
      ),
    [config.vendorCount, config.buyerCount, schedulerConfig, refreshKey],
  );

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setRefreshKey((k) => k + 1);
  };

  const handleRegenerate = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="flex jusfify-between w-full">
            <CardTitle className="text-3xl">Stable Meeting Scheduler</CardTitle>
            <Button onClick={() => setLogSheetOpen(true)} className="font-mono">
              [RUn ALGO]
            </Button>
          </CardHeader>
        </Card>
        {/* Main Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar: Config Panel */}
          <div className="lg:col-span-1">
            <ConfigPanel
              config={config}
              onConfigChange={setConfig}
              onReset={handleReset}
              onRegenerate={handleRegenerate}
            />
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {mockData.vendors.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Buyers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {mockData.buyers.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {mockData.allTimeSlots.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Campaign Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {schedulerConfig.dailySchedules.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Vendors ({mockData.vendors.length})</CardTitle>
                <CardDescription>
                  Generated vendor data with sectors and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{vendor.name}</span>
                      <Badge variant="secondary">{vendor.id}</Badge>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Sectors:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vendor.sectors.map((sector, idx) => (
                          <Badge key={idx} variant="outline">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Subsectors:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vendor.subSectors.map((sub, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Products:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vendor.products.slice(0, 3).map((product, idx) => (
                          <Badge
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Available: {vendor.availableDates.length} /{" "}
                      {schedulerConfig.dailySchedules.length} days
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Buyers */}
            <Card>
              <CardHeader>
                <CardTitle>Buyers ({mockData.buyers.length})</CardTitle>
                <CardDescription>
                  Generated buyer data with sector priorities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.buyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{buyer.name}</span>
                      <Badge variant="secondary">{buyer.id}</Badge>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Sector Priorities:
                      </div>
                      <div className="space-y-1">
                        {buyer.sectorPriorities.map((sp, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Badge
                              variant="default"
                              className="w-6 h-6 flex items-center justify-center p-0"
                            >
                              {sp.priority}
                            </Badge>
                            <span className="text-sm font-medium">
                              {sp.sector}
                            </span>
                            {sp.subSectors && sp.subSectors.length > 0 && (
                              <div className="flex gap-1 ml-2">
                                {sp.subSectors.map((sub, subIdx) => (
                                  <Badge
                                    key={subIdx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {sub.subSector} (p{sub.priority})
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Interested Products:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {buyer.products.slice(0, 3).map((product, idx) => (
                          <Badge
                            key={idx}
                            className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Available: {buyer.availableDates.length} /{" "}
                      {schedulerConfig.dailySchedules.length} days
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Time Slots Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Time Slots</CardTitle>
                <CardDescription>
                  All bookable slots across the campaign (showing first 20)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {mockData.allTimeSlots.slice(0, 20).map((slot, idx) => (
                    <div key={idx} className="border rounded p-2 text-sm">
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-xs text-muted-foreground">
                        {slot.date}
                      </div>
                    </div>
                  ))}
                  {mockData.allTimeSlots.length > 20 && (
                    <div className="border rounded p-2 text-sm flex items-center justify-center text-muted-foreground">
                      +{mockData.allTimeSlots.length - 20} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <PreferenceMatrix
              vendors={mockData.vendors}
              buyers={mockData.buyers}
              allTimeSlots={mockData.allTimeSlots}
            />
          </div>
        </div>
      </div>

      <EventLogSheet
        open={logSheetOpen}
        onOpenChange={setLogSheetOpen}
        events={scheduler.events}
        onClear={scheduler.reset}
        headerControls={
          <SimpleControls
            state={scheduler.state}
            speed={scheduler.speed}
            onStart={handleStart}
            onPause={scheduler.pause}
            onResume={scheduler.resume}
            onStep={scheduler.step}
            onReset={scheduler.reset}
            onSpeedChange={scheduler.setSpeed}
          />
        }
      />
    </div>
  );
};

export default MockDataTest;
