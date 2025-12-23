import type {
  Buyer,
  BuyerPreferenceEntry,
  OverlapMatrix as OverlapMatrixProps,
  Vendor,
  VendorPreferenceEntry,
} from "../../types";
import { calculateMatchScore } from "./scoring";

/**
 * Build both vendor and buyer preferences in a single pass.
 * Returns an object containing both maps.
 */
export const buildSymmetricPreferences = (
  vendors: Vendor[],
  buyers: Buyer[],
  overlapMatrix: OverlapMatrixProps,
): {
  vendorPreferences: Map<string, VendorPreferenceEntry[]>;
  buyerPreferences: Map<string, BuyerPreferenceEntry[]>;
} => {
  const vendorPreferences = new Map<string, VendorPreferenceEntry[]>();
  const buyerPreferences = new Map<string, BuyerPreferenceEntry[]>();

  vendors.forEach((v) => vendorPreferences.set(v.id, []));
  buyers.forEach((b) => buyerPreferences.set(b.id, []));

  for (const vendor of vendors) {
    for (const buyer of buyers) {
      const key = `${vendor.id}-${buyer.id}`;
      const availableSlots = overlapMatrix.get(key) || [];

      if (availableSlots?.length === 0) continue;

      const matchResult = calculateMatchScore(vendor, buyer);

      vendorPreferences.get(vendor?.id)?.push({
        buyer,
        score: matchResult.score,
        tier: matchResult.tier,
        availableSlots,
      });

      buyerPreferences.get(buyer?.id)?.push({
        vendor,
        score: matchResult.score,
        tier: matchResult.tier,
        availableSlots,
      });
    }
  }

  const byScoreDesc = (a: { score: number }, b: { score: number }) =>
    b.score - a.score;

  for (const list of vendorPreferences.values()) {
    list.sort(byScoreDesc);
  }

  for (const list of buyerPreferences.values()) {
    list.sort(byScoreDesc);
  }

  return { vendorPreferences, buyerPreferences };
};
