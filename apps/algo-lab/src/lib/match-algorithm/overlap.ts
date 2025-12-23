import type { Vendor, Buyer, TimeSlot } from "../../types";

export const calculateOverlap = (
  vendor: Vendor,
  buyer: Buyer,
  allTimeSlots: TimeSlot[],
): TimeSlot[] => {
  const vendorDates = new Set(vendor.availableDates);
  const buyerDates = new Set(buyer.availableDates);

  return allTimeSlots.filter((slot) => {
    return vendorDates.has(slot.date) && buyerDates.has(slot.date);
  });
};

export const buildOverlapMatrix = (
  vendors: Vendor[],
  buyers: Buyer[],
  allTimeSlots: TimeSlot[],
): Map<string, TimeSlot[]> => {
  const matrix = new Map<string, TimeSlot[]>();

  for (const vendor of vendors) {
    for (const buyer of buyers) {
      const key = `${vendor.id}-${buyer.id}`;
      const overlap = calculateOverlap(vendor, buyer, allTimeSlots);
      matrix.set(key, overlap);
    }
  }

  return matrix;
};
