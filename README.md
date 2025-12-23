```ts
// Step 1: Calculate individual match for EACH sector
individualMatches = [
  {
    matchedSector: "Technology",
    matchedSubsector: "AI/ML",
    sectorScore: 0.9,
    subsectorScore: 0.85,
    compositeScore: 0.842,
    tier: "tier-1",
  },
  {
    matchedSector: "Healthcare",
    matchedSubsector: "Biotech",
    sectorScore: 0.7,
    subsectorScore: 0.6,
    compositeScore: 0.624,
    tier: "tier-1",
  },
  {
    matchedSector: "Finance",
    matchedSubsector: null,
    sectorScore: 0.5,
    subsectorScore: 0.0,
    compositeScore: 0.364,
    tier: "tier-2",
  },
];

// Step 2: Combine all scores probabilistically
individualScores = [0.842, 0.624, 0.364];
finalScore = combineScores([0.842, 0.624, 0.364]);
// = 1 - (1-0.842)(1-0.624)(1-0.364)
// = 1 - (0.158)(0.376)(0.636)
// = 1 - 0.0378
// = 0.962, we arrived at final score,,, mass
```
