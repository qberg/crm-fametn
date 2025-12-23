import type { EventLogEntry } from "../components/event-log";

export const generateMockEvents = (): EventLogEntry[] => {
  const baseTime = new Date();

  return [
    {
      timestamp: new Date(baseTime.getTime()).toISOString(),
      type: "start",
      message: "STABLE MATCHING SCHEDULER v1.0",
    },
    {
      timestamp: new Date(baseTime.getTime() + 100).toISOString(),
      type: "info",
      message: "═══════════════════════════════════════════════════════",
    },
    {
      timestamp: new Date(baseTime.getTime() + 200).toISOString(),
      type: "phase",
      message: "Phase 1: Vendor Minimums",
    },
    {
      timestamp: new Date(baseTime.getTime() + 300).toISOString(),
      type: "info",
      message: "Target: 2 meetings per vendor",
    },
    {
      timestamp: new Date(baseTime.getTime() + 400).toISOString(),
      type: "info",
      message: "───────────────────────────────────────────────────────",
    },
    {
      timestamp: new Date(baseTime.getTime() + 500).toISOString(),
      type: "iteration",
      message: "Iteration 001",
    },
    {
      timestamp: new Date(baseTime.getTime() + 600).toISOString(),
      type: "proposal",
      message: "V1 --> B1",
      details: {
        vendorId: "V1",
        buyerId: "B1",
        slots: 3,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 700).toISOString(),
      type: "proposal",
      message: "V2 --> B1",
      details: {
        vendorId: "V2",
        buyerId: "B1",
        slots: 2,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 800).toISOString(),
      type: "proposal",
      message: "V3 --> B2",
      details: {
        vendorId: "V3",
        buyerId: "B2",
        slots: 4,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 900).toISOString(),
      type: "review",
      message: "B1 evaluating 2 proposals...",
    },
    {
      timestamp: new Date(baseTime.getTime() + 1000).toISOString(),
      type: "acceptance",
      message: "B1 <<< V1",
      details: {
        vendorId: "V1",
        buyerId: "B1",
        timeSlot: "09:00",
        score: 0.842,
        tier: "T1",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 1100).toISOString(),
      type: "rejection",
      message: "B1 xxx V2",
      details: {
        vendorId: "V2",
        buyerId: "B1",
        reason: "prefers V1",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 1200).toISOString(),
      type: "review",
      message: "B2 evaluating 1 proposal...",
    },
    {
      timestamp: new Date(baseTime.getTime() + 1300).toISOString(),
      type: "acceptance",
      message: "B2 <<< V3",
      details: {
        vendorId: "V3",
        buyerId: "B2",
        timeSlot: "09:00",
        score: 0.756,
        tier: "T1",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 1400).toISOString(),
      type: "status",
      message: "V1: [#-] 1/2  V2: [--] 0/2  V3: [#-] 1/2",
    },
    {
      timestamp: new Date(baseTime.getTime() + 1500).toISOString(),
      type: "info",
      message: "───────────────────────────────────────────────────────",
    },
    {
      timestamp: new Date(baseTime.getTime() + 1600).toISOString(),
      type: "iteration",
      message: "Iteration 002",
    },
    {
      timestamp: new Date(baseTime.getTime() + 1700).toISOString(),
      type: "proposal",
      message: "V1 --> B2",
      details: {
        vendorId: "V1",
        buyerId: "B2",
        slots: 2,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 1800).toISOString(),
      type: "proposal",
      message: "V2 --> B2",
      details: {
        vendorId: "V2",
        buyerId: "B2",
        slots: 3,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 1900).toISOString(),
      type: "review",
      message: "B2 evaluating 2 proposals...",
    },
    {
      timestamp: new Date(baseTime.getTime() + 2000).toISOString(),
      type: "acceptance",
      message: "B2 <<< V1",
      details: {
        vendorId: "V1",
        buyerId: "B2",
        timeSlot: "10:00",
        score: 0.634,
        tier: "T2",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 2100).toISOString(),
      type: "acceptance",
      message: "B2 <<< V2",
      details: {
        vendorId: "V2",
        buyerId: "B2",
        timeSlot: "11:00",
        score: 0.521,
        tier: "T2",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 2200).toISOString(),
      type: "status",
      message: "V1: [##] 2/2 ✓  V2: [#-] 1/2  V3: [#-] 1/2",
    },
    {
      timestamp: new Date(baseTime.getTime() + 2300).toISOString(),
      type: "info",
      message: "───────────────────────────────────────────────────────",
    },
    {
      timestamp: new Date(baseTime.getTime() + 2400).toISOString(),
      type: "iteration",
      message: "Iteration 003",
    },
    {
      timestamp: new Date(baseTime.getTime() + 2500).toISOString(),
      type: "proposal",
      message: "V2 --> B3",
      details: {
        vendorId: "V2",
        buyerId: "B3",
        slots: 2,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 2600).toISOString(),
      type: "proposal",
      message: "V3 --> B1",
      details: {
        vendorId: "V3",
        buyerId: "B1",
        slots: 1,
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 2700).toISOString(),
      type: "review",
      message: "B3 evaluating 1 proposal...",
    },
    {
      timestamp: new Date(baseTime.getTime() + 2800).toISOString(),
      type: "acceptance",
      message: "B3 <<< V2",
      details: {
        vendorId: "V2",
        buyerId: "B3",
        timeSlot: "14:00",
        score: 0.445,
        tier: "T2",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 2900).toISOString(),
      type: "review",
      message: "B1 evaluating 1 proposal...",
    },
    {
      timestamp: new Date(baseTime.getTime() + 3000).toISOString(),
      type: "acceptance",
      message: "B1 <<< V3",
      details: {
        vendorId: "V3",
        buyerId: "B1",
        timeSlot: "14:00",
        score: 0.712,
        tier: "T1",
      },
    },
    {
      timestamp: new Date(baseTime.getTime() + 3100).toISOString(),
      type: "status",
      message: "V1: [##] 2/2 ✓  V2: [##] 2/2 ✓  V3: [##] 2/2 ✓",
    },
    {
      timestamp: new Date(baseTime.getTime() + 3200).toISOString(),
      type: "info",
      message: "═══════════════════════════════════════════════════════",
    },
    {
      timestamp: new Date(baseTime.getTime() + 3300).toISOString(),
      type: "success",
      message: "PHASE 1 COMPLETE",
    },
    {
      timestamp: new Date(baseTime.getTime() + 3400).toISOString(),
      type: "info",
      message: "All vendors satisfied | 3 iterations | 6 meetings",
    },
    {
      timestamp: new Date(baseTime.getTime() + 3500).toISOString(),
      type: "info",
      message: "═══════════════════════════════════════════════════════",
    },
  ];
};
