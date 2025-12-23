import type {
  Buyer,
  DailySchedule,
  MockCampaignData,
  SchedulerConfig,
  SectorPriority,
  SubSector,
  TimeSlot,
  TimeWindow,
  Vendor,
} from "../../types";
import { addMinutes, format, parse } from "date-fns";
import { pickRandom } from "../utils";
import { PRODUCTS_BY_SECTOR, SECTORS, SUBSECTORS_BY_SECTOR } from "../data";

/**
 * Generates discrete time slots from a time window
 * Example: window "09:00-12:00" with 30min meetings → ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
 */
export function generateSlotsFromWindow(
  date: string,
  window: TimeWindow,
  durationMinutes: number,
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const baseDate = parse(date, "yyyy-MM-dd", new Date());
  const startTime = parse(window.start, "HH:mm", baseDate);
  const endTime = parse(window.end, "HH:mm", baseDate);

  let currentTime = startTime;

  while (currentTime < endTime) {
    const slotEnd = addMinutes(currentTime, durationMinutes);

    if (slotEnd > endTime) {
      break;
    }

    const datetime = format(currentTime, "yyyy-MM-dd'T'HH:mm:ss");
    const time = format(currentTime, "HH:mm");

    slots.push({
      datetime,
      date,
      time,
    });

    currentTime = addMinutes(currentTime, durationMinutes);
  }

  return slots;
}

/**
 * Generates all discrete time slots for the entire campaign
 */
export function generateCampaignTimeSlots(
  dailySchedules: DailySchedule[],
  meetingDurationMinutes: number,
): TimeSlot[] {
  return dailySchedules.flatMap((schedule) =>
    schedule.windows.flatMap((window) =>
      generateSlotsFromWindow(schedule.date, window, meetingDurationMinutes),
    ),
  );
}

/**
 * Filter time slots by avaialable dates
 */
export function filterSlotsByDates(
  allSlots: TimeSlot[],
  avaialableDates: string[],
): TimeSlot[] {
  const dateSet = new Set(avaialableDates);
  return allSlots.filter((slot) => dateSet.has(slot.date));
}

/**
 * Generate random subset of dates from campaign
 */
export function generateAvailableDates(
  allDates: string[],
  availabilityRate: number,
) {
  return allDates.filter(() => Math.random() < availabilityRate);
}

export function getAllCampaignDates(config: SchedulerConfig) {
  return config.dailySchedules.map((ds) => ds.date);
}

// ============================================================================
// Lets generate some random vendors and buyers for our little world of
// algo testing
// ============================================================================

// ============================================================================
// VENDOR GENERATION
// ============================================================================
export function generateMockVendor(
  id: number,
  campaignDates: string[],
): Vendor {
  const sectorCount = Math.random() > 0.5 ? 2 : 1;
  const sectors = pickRandom(SECTORS, sectorCount);

  const subSectors: string[] = [];
  sectors.forEach((sector) => {
    const available = SUBSECTORS_BY_SECTOR[sector] || [];
    subSectors.push(...pickRandom(available, 2));
  });

  const products: string[] = [];
  sectors.forEach((sector) => {
    const available = PRODUCTS_BY_SECTOR[sector] || [];
    products.push(...pickRandom(available, 2));
  });

  const availableDates = generateAvailableDates(campaignDates, 0.7);

  return {
    id: `V${id}`,
    name: `Vendor ${id}`,
    sectors,
    subSectors,
    products,
    availableDates,
  };
}

/*
 * Generate multiple vendors
 */
export function generateMockVendors(
  count: number,
  config: SchedulerConfig,
): Vendor[] {
  const campaignDates = getAllCampaignDates(config);
  return Array.from({ length: count }, (_, i) =>
    generateMockVendor(i + 1, campaignDates),
  );
}

// ============================================================================
// BUYER GENERATION
// ============================================================================
//
/**
 * Generate sector priorities for a buyer
 */
export function generateSectorPriorities(): SectorPriority[] {
  const interestedSectors = pickRandom(SECTORS, Math.random() > 0.5 ? 3 : 2);

  return interestedSectors.map((sector, index) => {
    const priority = index + 1;

    // Optionally add subsector preferences ooh lalala
    const subsectors = SUBSECTORS_BY_SECTOR[sector] || [];
    const includeSubsectors = Math.random() > 0.3;

    if (includeSubsectors && subsectors.length > 0) {
      const selectedSubsectors = pickRandom(subsectors, 2);
      const subSectors: SubSector[] = selectedSubsectors.map((sub, idx) => ({
        subSector: sub,
        priority: idx + 1,
      }));

      return {
        sector,
        priority,
        subSectors,
      };
    }

    return {
      sector,
      priority,
    };
  });
}

/**
 * Generate a single mock buyer
 */
export function generateMockBuyer(id: number, campaignDates: string[]): Buyer {
  const sectorPriorities = generateSectorPriorities();

  const products: string[] = [];
  sectorPriorities.forEach((sp) => {
    const available = PRODUCTS_BY_SECTOR[sp.sector] || [];
    products.push(...pickRandom(available, 2));
  });

  const availableDates = generateAvailableDates(campaignDates, 0.8);

  return {
    id: `B${id}`,
    name: `Buyer ${id}`,
    sectorPriorities,
    products,
    availableDates,
  };
}

/**
 * Generate multiple buyers
 */
export function generateMockBuyers(
  count: number,
  config: SchedulerConfig,
): Buyer[] {
  const campaignDates = getAllCampaignDates(config);
  return Array.from({ length: count }, (_, i) =>
    generateMockBuyer(i + 1, campaignDates),
  );
}

// ============================================================================
// COMPLETE MOCK CAMPAIGN
// ============================================================================
export function generateMockCampaign(
  vendorCount: number,
  buyerCount: number,
  config: SchedulerConfig,
): MockCampaignData {
  const vendors = generateMockVendors(vendorCount, config);
  const buyers = generateMockBuyers(buyerCount, config);
  const allTimeSlots = generateCampaignTimeSlots(
    config.dailySchedules,
    config.meetingDurationMinutes,
  );

  return {
    config,
    vendors,
    buyers,
    allTimeSlots,
  };
}
