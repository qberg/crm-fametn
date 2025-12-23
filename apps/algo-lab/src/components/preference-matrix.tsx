import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import type { Vendor, Buyer, TimeSlot } from "../types";
import { calculateMatchScore } from "../lib/match-algorithm/scoring";

type PreferenceMatrixProps = {
  vendors: Vendor[];
  buyers: Buyer[];
  allTimeSlots: TimeSlot[];
};

export function PreferenceMatrix({
  vendors,
  buyers,
  allTimeSlots,
}: PreferenceMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor × Buyer Preference Matrix</CardTitle>
        <CardDescription>
          Match scores and tiers for all vendor-buyer pairs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-2 p-3 bg-muted text-left min-w-[150px] sticky left-0 z-10">
                  <div className="font-semibold">Vendor / Buyer </div>
                </th>
                {buyers.map((buyer) => (
                  <th
                    key={buyer.id}
                    className="border-2 p-3 text-center min-w-[140px]"
                  >
                    <div className="font-semibold text-sm">{buyer.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {buyer.id}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {buyer.sectorPriorities.length} sectors
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="border-2 p-3 sticky left-0 z-10">
                    <div className="font-semibold text-sm">{vendor.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {vendor.id}
                    </Badge>
                    <div className="text-xs mt-1">
                      {vendor.sectors.join(", ")}
                    </div>
                  </td>
                  {buyers.map((buyer) => (
                    <MatrixCell
                      key={`${vendor.id}-${buyer.id}`}
                      vendor={vendor}
                      buyer={buyer}
                      allTimeSlots={allTimeSlots}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

type MatrixCellProps = {
  vendor: Vendor;
  buyer: Buyer;
  allTimeSlots: TimeSlot[];
};

const MatrixCell: React.FC<MatrixCellProps> = ({
  vendor,
  buyer,
  allTimeSlots,
}) => {
  // Calculate overlapping time slots
  const overlappingSlots = useMemo(() => {
    const vendorDates = new Set(vendor.availableDates);
    const buyerDates = new Set(buyer.availableDates);

    return allTimeSlots.filter((slot) => {
      return vendorDates.has(slot.date) && buyerDates.has(slot.date);
    });
  }, [vendor, buyer, allTimeSlots]);

  // Calculate match score
  const matchResult = useMemo(() => {
    return calculateMatchScore(vendor, buyer);
  }, [vendor, buyer]);

  const hasOverlap = overlappingSlots.length > 0;

  // Tier-based styling
  const getCellStyle = (tier: string) => {
    if (!hasOverlap) return "bg-gray-100 text-gray-400 border-gray-300";

    switch (tier) {
      case "tier-1":
        return "bg-green-50 text-gray-400 border-green-400 hover:bg-green-100";
      case "tier-2":
        return "bg-blue-50 text-gray-400 border-blue-400 hover:bg-blue-100";
      case "tier-3":
        return "bg-orange-50 text-gray-400 border-orange-400 hover:bg-orange-100";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "tier-1":
        return "bg-green-600 text-white hover:bg-green-700";
      case "tier-2":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "tier-3":
        return "bg-orange-600 text-white hover:bg-orange-700";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "tier-1":
        return "T1";
      case "tier-2":
        return "T2";
      case "tier-3":
        return "T3";
      default:
        return "—";
    }
  };

  return (
    <td
      className={`border-2 p-3 text-center transition-all cursor-pointer ${getCellStyle(matchResult.tier)}`}
      title={`${vendor.name} × ${buyer.name}`}
    >
      {hasOverlap ? (
        <div className="space-y-2">
          {/* Tier Badge */}
          <div className="flex justify-center">
            <Badge
              className={`${getTierBadgeClass(matchResult.tier)} text-xs font-bold`}
            >
              {getTierLabel(matchResult.tier)}
            </Badge>
          </div>

          {/* Score */}
          <div className="text-2xl font-bold">
            {matchResult.score.toFixed(3)}
          </div>

          {/* Score Breakdown */}
          <div className="text-xs space-y-0.5 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sector:</span>
              <span className="font-mono">
                {matchResult.scoreBreakdown?.sectorMatch.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subsector:</span>
              <span className="font-mono">
                {matchResult.scoreBreakdown?.subSectorMatch.toFixed(2) ??
                  "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-mono">
                {matchResult.scoreBreakdown?.productMatch.toFixed(2) ?? "0.00"}
              </span>
            </div>
          </div>

          {/* Slots count */}
          <div className="text-xs text-muted-foreground pt-1 border-t">
            {overlappingSlots.length} time slots
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm py-8">
          <div className="text-lg font-bold">—</div>
          <div className="text-xs mt-1">No overlap</div>
        </div>
      )}
    </td>
  );
};
