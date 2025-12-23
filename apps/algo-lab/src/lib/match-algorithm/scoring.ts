import {
  type Buyer,
  type IndividualMatch,
  type MatchScore,
  type SectorPriority,
  type SubSector,
  type Tier,
  type Vendor,
} from "../../types";

const WEIGHTS = {
  SECTOR: 0.4,
  SUBSECTOR: 0.4,
  PRODUCT: 0.2,
} as const;

/**
 * A hash function for idempotency
 * max will be 0.6
 */
export const getAIProductScore = (vendor: Vendor, buyer: Buyer) => {
  // TODO: AI
  let hash = 0;
  const str = vendor.id + buyer.id;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const float = (Math.abs(hash) % 100) / 100;
  return Math.min(0.6, float + 0.2);
};

const normalizePriorityScore = (priority: number) => {
  const decay = 0.1;
  const score = 1.0 - priority * decay;
  return Math.max(0.1, score);
};

const calculateCompositeScore = (
  sectorScore: number,
  subSectorScore: number,
  productScore: number,
): number =>
  WEIGHTS.SECTOR * sectorScore +
  WEIGHTS.SUBSECTOR * subSectorScore +
  WEIGHTS.PRODUCT * productScore;

const determineTier = (sectorScore: number, subSectorScore: number): Tier => {
  if (subSectorScore > 0) return "tier-1";
  if (sectorScore > 0) return "tier-2";
  return "tier-3";
};

const combineScores = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  const probabilityOfTotalFailure = scores.reduce(
    (acc, score) => acc * (1 - score),
    1.0,
  );

  return 1.0 - probabilityOfTotalFailure;
};

// ============================================================================
// SUBSECTOR MATCHING
// ============================================================================

/**
 * Find ALL matching subsectors
 */
const findAllMatchingSubSectors = (
  vendorSubSectors: string[],
  buyerSubSectors: SubSector[] | undefined,
): SubSector[] => {
  if (!buyerSubSectors || buyerSubSectors.length === 0) {
    return [];
  }

  const vendorSet = new Set(vendorSubSectors);

  return buyerSubSectors.filter((bs) => vendorSet.has(bs.subSector));
};

const calculateSubSectorScore = (
  vendorSubSectors: string[],
  buyerSubSectors: SubSector[] | undefined,
): { score: number; bestSubSector: string | null } => {
  const matchedSubSectors = findAllMatchingSubSectors(
    vendorSubSectors,
    buyerSubSectors,
  );

  if (matchedSubSectors.length === 0) {
    return {
      score: 0,
      bestSubSector: null,
    };
  }

  const subSectorScores = matchedSubSectors.map((ss) =>
    normalizePriorityScore(ss.priority),
  );

  const combinedScore = combineScores(subSectorScores);

  const bestSubSector = matchedSubSectors.reduce((best, current) =>
    normalizePriorityScore(current.priority) >
    normalizePriorityScore(best.priority)
      ? current
      : best,
  );

  return {
    score: combinedScore,
    bestSubSector: bestSubSector.subSector,
  };
};

// ============================================================================
// SECTOR MATCHING LOGIC (Global Aggregation it is)
// ============================================================================
const findAllMatchingSectors = (
  vendor: Vendor,
  buyer: Buyer,
): SectorPriority[] =>
  buyer.sectorPriorities.filter((bp) => vendor.sectors.includes(bp.sector));

const calculateIndividualSectorMatch = (
  vendor: Vendor,
  sectorPriority: SectorPriority,
  productScore: number,
): IndividualMatch => {
  const sectorScore = normalizePriorityScore(sectorPriority.priority);

  const { score: subSectorScore, bestSubSector } = calculateSubSectorScore(
    vendor.subSectors,
    sectorPriority.subSectors,
  );

  const compositeScore = calculateCompositeScore(
    sectorScore,
    subSectorScore,
    productScore,
  );

  const tier = determineTier(sectorScore, subSectorScore);

  return {
    sectorScore,
    subSectorScore,
    compositeScore,
    tier,
    matchedSector: sectorPriority.sector,
    matchedSubsector: bestSubSector,
  };
};

/**
 * Calculate ALL individual matches and combine probabilistically,
 */
const calculateAllMatches = (
  vendor: Vendor,
  buyer: Buyer,
): {
  finalScore: number;
  bestMatch: IndividualMatch | null;
  productScore: number;
} => {
  const productScore = getAIProductScore(vendor, buyer);
  const matchingSectorPriorities = findAllMatchingSectors(vendor, buyer);

  if (matchingSectorPriorities.length === 0) {
    const tier3Score = WEIGHTS.PRODUCT * productScore;

    return {
      finalScore: tier3Score,
      bestMatch: null,
      productScore,
    };
  }

  const individualMatches = matchingSectorPriorities.map((sectorPriority) =>
    calculateIndividualSectorMatch(vendor, sectorPriority, productScore),
  );

  const individualScores = individualMatches.map((m) => m.compositeScore);

  const finalScore = combineScores(individualScores);

  const bestMatch = individualMatches.reduce((best, current) =>
    current.compositeScore > best.compositeScore ? current : best,
  );

  return {
    finalScore,
    bestMatch,
    productScore,
  };
};

/*
 *This is what we will use outside of this file,
 * excuse the mess that this file is,
 */
export const calculateMatchScore = (
  vendor: Vendor,
  buyer: Buyer,
): MatchScore => {
  const { finalScore, bestMatch, productScore } = calculateAllMatches(
    vendor,
    buyer,
  );

  const tier = bestMatch?.tier ?? "tier-3";
  const sectorScore = bestMatch?.sectorScore ?? 0;
  const subSectorScore = bestMatch?.subSectorScore ?? 0;

  return {
    score: parseFloat(finalScore.toFixed(3)),
    tier,
    scoreBreakdown: {
      sectorMatch: sectorScore,
      subSectorMatch: subSectorScore,
      productMatch: productScore,
    },
  };
};
