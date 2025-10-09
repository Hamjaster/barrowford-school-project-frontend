import type { YearGroup } from '@/types';

/**
 * Get year group name from year_group_id
 * @param yearGroupId - The year group ID
 * @param yearGroups - Array of year groups from Redux store
 * @returns The year group name or "N/A" if not found
 */
export const getYearGroupName = (yearGroupId: number | undefined, yearGroups: YearGroup[]): string => {
  if (!yearGroupId || !yearGroups || yearGroups.length === 0) {
    return "N/A";
  }
  
  const yearGroup = yearGroups.find(yg => yg.id === yearGroupId);
  return yearGroup?.name || "N/A";
};

/**

 * @param yearGroupId - The year group ID
 * @param yearGroups - Array of year groups from Redux store
 * @returns The year group name with "Year" prefix or "N/A" if not found
 */
export const getYearGroupDisplayName = (yearGroupId: number | undefined, yearGroups: YearGroup[]): string => {
  const yearGroupName = getYearGroupName(yearGroupId, yearGroups);
  return yearGroupName === "N/A" ? "N/A" : `${yearGroupName}`;
};

