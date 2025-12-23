export type SubSector = {
  subSector: string;
  priority: number;
};

export type SectorPriority = {
  sector: string;
  priority: number;
  subSectors?: SubSector[];
};

export type TimeWindow = {
  start: string;
  end: string;
};

export type DailySchedule = {
  /** Date in YYYY-MM-DD format */
  date: string;
  windows: TimeWindow[];
};

export type TimeSlot = {
  /** Full datetime in ISO format (e.g., "2025-01-15T09:00:00") */
  datetime: string;
  /** Date portion for easy filtering */
  date: string;
  /** Time portion for display (e.g., "09:00") */
  time: string;
};

export type Vendor = {
  id: string;
  name: string;
  sectors: string[];
  subSectors: string[];
  products: string[];
  availableDates: string[];
};

export type Buyer = {
  id: string;
  name: string;
  sectorPriorities: SectorPriority[];
  products: string[];
  availableDates: string[];
};

export type SchedulerConfig = {
  startDate: string;
  endDate: string;
  dailySchedules: DailySchedule[];
  minMeetingsPerVendor: number;
  maxMeetingsPerVendor: number;
  meetingDurationMinutes: number;
};

// ============================================================================
// All types for preferences of all the byers and vendors in the world
// ============================================================================

export const TIERS = {
  TIER_1: "tier-1",
  TIER_2: "tier-2",
  TIER_3: "tier-3",
} as const;

export type Tier = (typeof TIERS)[keyof typeof TIERS];

export type MatchPriority<T> = T & {
  originalIndex: number;
};

export type IndividualMatch = {
  sectorScore: number;
  subSectorScore: number;
  compositeScore: number;
  tier: Tier;
  matchedSector: string;
  matchedSubsector: string | null;
};

export type MatchScore = {
  score: number;
  tier: Tier;
  scoreBreakdown?: {
    sectorMatch: number;
    subSectorMatch: number;
    productMatch: number;
    [key: string]: number;
  };
};

export type VendorPreferenceEntry = {
  buyer: Buyer;
  score: number;
  tier: Tier;
  /** Available time slots where both can meet */
  availableSlots: TimeSlot[];
};

export type BuyerPreferenceEntry = {
  vendor: Vendor;
  score: number;
  tier: Tier;
  availableSlots: TimeSlot[];
};

/**
 * Vendors and Buyers complete preference list (sorted by score, descending)
 * Key: buyer.id, Value: sorted list of vendor preferences
 */
export type VendorPreferences = Map<string, VendorPreferenceEntry[]>;
export type BuyerPreferences = Map<string, BuyerPreferenceEntry[]>;

/*
 * Overlap matrix: avaialable time slots for each vendor-buyer pair
 * Key: "vendor.id-buyer.id", Value: array of overlapping time slots
 */
export type OverlapMatrix = Map<string, TimeSlot[]>;

export type PreferencesResult = {
  vendorPreferences: VendorPreferences;
  buyerPreferences: BuyerPreferences;
  overlapMatrix: OverlapMatrix;
};

// ============================================================================
// ALGORITHM STATE & RESULTS TYPES
// ============================================================================
// Types for tracking algorithm execution state and final results so that we dont
// lose our mind!!!
export type RejectionInfo = {
  iteration: number;
  timesRejected: number;
};

export type VendorState = {
  /** Current confirmed meetings (buyer, timeslot pairs). HURAAY! */
  assignedMeetings: Array<{ buyer: Buyer; slot: TimeSlot }>;
  /** Count of meetings currently assigned */
  meetingsCount: number;
  /** Set of buyer IDs this vendor already has meetings with */
  matchedBuyers: Set<string>;
  /** History of rejections from buyers, kavalai padathe */
  rejectedProposals: Map<string, RejectionInfo>;
};

/**
 * Proposal from a vendor to a buyer for a specific time slot
 * All lovey dovey. god creates, cupid stupid
 */
export type Proposal = {
  /** The vendor making the proposal */
  vendor: Vendor;
  /** The buyer receiving the proposal */
  buyer: Buyer;
  /** ALL available time slots for this vendor-buyer pair */
  availableSlots: TimeSlot[];
  score: number;
  tier: Tier;
};

/**
 * A specific slot proposal (used internally during buyer review)
 * This represents one slot from a multi-slot proposal
 * Consider this the rose of love from the vendor!
 */
export type SlotProposal = {
  vendor: Vendor;
  slot: TimeSlot;
  score: number;
  tier: Tier;
  buyerPreferenceRank?: number;
};

export type BuyerState = {
  /** Current slot proposals being considered this iteration (flattened from multi-slot proposals) */
  currentProposals: SlotProposal[];
  /** Accepted slot proposals from previous iterations */
  acceptedMeetings: SlotProposal[];
  /** Total capacity (number of available slots) */
  capacity: number;
};

/**
 * A confirmed meeting assignment
 */
export type Meeting = {
  vendor: Vendor;
  buyer: Buyer;
  timeSlot: string;
  roomId: string;
  score: number;
  tier: Tier;
  phase?: 1 | 2;
};

/**
 * Error/failure information for a vendor who couldn't meet minimum requirements
 */
export type VendorFailure = {
  vendorId: string;
  achieved: number;
  required: number;
  totalPreferences: number;
  rejectionCount: number;
};

/**
 * Result from Phase 1 (Vendor Minimums)
 */
export type Phase1Result = {
  success: boolean;
  /** Current vendor states (if successful) */
  vendorState?: Map<string, VendorState>;
  /** Current buyer states (if successful) */
  buyerState?: Map<string, BuyerState>;
  /** Time slots occupied by vendors */
  vendorTimeOccupancy?: Map<string, Set<string>>; // vendorId -> Set of times
  /** Buyer slots that are booked */
  buyerSlotOccupancy?: Map<string, string>; // "(time,buyerId)" -> vendorId
  /** Current assignments (if successful) */
  assignments?: Meeting[];
  /** Failure details (if failed) */
  errors?: VendorFailure[];
  /** Partial assignments achieved before failure */
  partialAssignments?: Meeting[];
  /** Reason for failure */
  reason?: string;
};

export type Phase2Result = {
  success: boolean;
  assignments: Meeting[];
  vendorMeetingCounts: Map<string, number>;
  filledBuyerSlots: number;
  totalBuyerSlots: number;
  unfilledSlots: number;
};

export type BlockingPair = {
  vendor: Vendor;
  buyer: Buyer;
  reason: string;
  /** Current vendor assignment they'd break */
  vendorCurrentMatch?: Meeting;
  /** Current buyer assignment they'd break */
  buyerCurrentMatch?: Meeting;
};

/**
 * Stability verification report
 */
export type StabilityReport = {
  /** Whether the schedule is stable */
  isStable: boolean;
  /** Any blocking pairs found */
  blockingPairs: BlockingPair[];
  /** Total pairs checked */
  totalPairsChecked: number;
};

/**
 * Statistics about the final schedule
 */
export type Statistics = {
  /** Total meetings scheduled */
  totalMeetings: number;
  /** Total available slots */
  totalAvailableSlots: number;
  /** Utilization percentage */
  utilizationRate: number;
  /** Meetings per vendor */
  vendorMeetingCounts: Map<string, number>;
  /** Meetings per buyer */
  buyerMeetingCounts: Map<string, number>;
  /** Average match score */
  averageScore: number;
  /** Distribution by tier */
  tierDistribution: Map<Tier, number>;
};

/**
 * Final result from the complete scheduling algorithm
 */
export type ScheduleResult = {
  /** Whether scheduling succeeded */
  success: boolean;
  /** Final meeting assignments */
  assignments: Meeting[];
  /** Statistics about the schedule */
  statistics?: Statistics;
  /** Stability verification report */
  stabilityReport?: StabilityReport;
  /** Meeting counts per vendor */
  vendorMeetingCounts?: Map<string, number>;
  /** Any errors that occurred */
  errors?: VendorFailure[];
  /** Reason for failure (if failed) */
  failureReason?: string;
};

/**
 * See we need mock for this and that!
 */
export type MockCampaignData = {
  config: SchedulerConfig;
  vendors: Vendor[];
  buyers: Buyer[];
  allTimeSlots: TimeSlot[];
};

export type EventLogEntry = {
  timestamp: string;
  type:
    | "start"
    | "phase"
    | "iteration"
    | "proposal"
    | "acceptance"
    | "rejection"
    | "review"
    | "status"
    | "success"
    | "error"
    | "info";
  message: string;
  details?: {
    vendorId?: string;
    buyerId?: string;
    score?: number;
    tier?: string;
    timeSlot?: string;
    slots?: number;
    reason?: string;
  };
};

export type SchedulerState = "idle" | "running" | "paused" | "complete";
