"use client";

import { useMemo, useState } from "react";
import { ROI_DEFAULTS } from "@/lib/constants";
import { calculateROI } from "@/lib/roi";

export function useROICalculator() {
  const [employees, setEmployees] = useState(ROI_DEFAULTS.employees);
  const [hoursPerWeek, setHoursPerWeek] = useState(ROI_DEFAULTS.hoursPerWeek);
  const [hourlyRate, setHourlyRate] = useState(ROI_DEFAULTS.hourlyRate);

  const results = useMemo(
    () => calculateROI({ employees, hoursPerWeek, hourlyRate }),
    [employees, hoursPerWeek, hourlyRate],
  );

  const reset = () => {
    setEmployees(ROI_DEFAULTS.employees);
    setHoursPerWeek(ROI_DEFAULTS.hoursPerWeek);
    setHourlyRate(ROI_DEFAULTS.hourlyRate);
  };

  return {
    employees,
    hoursPerWeek,
    hourlyRate,
    setEmployees,
    setHoursPerWeek,
    setHourlyRate,
    results,
    reset,
  };
}
