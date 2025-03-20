export const validationMessages = {
  required: (field: string) => `${field} is required`,
  invalidRegion: (value: string, validRegions: string[]) => `'${value}' is not a valid region. Valid regions: ${validRegions.join(', ')}`,
};
