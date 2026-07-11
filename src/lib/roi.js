export const ROI_EFFICIENCY_RATE = 0.85;

export function calculateROI({ employees, hoursPerWeek, hourlyRate }) {
  const weeklyHoursSaved = employees * hoursPerWeek * ROI_EFFICIENCY_RATE;
  const yearlyHours = weeklyHoursSaved * 52;
  const yearlyROI = yearlyHours * hourlyRate;

  return {
    weeklyHoursSaved,
    yearlyHours,
    yearlyROI,
    efficiency: Math.round(ROI_EFFICIENCY_RATE * 100),
  };
}
