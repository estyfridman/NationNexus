export const VALID_REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctica',
] as const;

export type RegionType = (typeof VALID_REGIONS)[number];
