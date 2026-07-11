"use client";

import Link from "next/link";
import { ArrowRight, DollarSign } from "lucide-react";
import { ROI_LIMITS } from "@/lib/constants";
import { useROICalculator } from "@/hooks/useROICalculator";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHours(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ROICalculator() {
  const {
    employees,
    hoursPerWeek,
    hourlyRate,
    setEmployees,
    setHoursPerWeek,
    setHourlyRate,
    results,
    reset,
  } = useROICalculator();

  return (
    <section
      id="interactive-roi-widget"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
    >
      <div className="rounded-3xl glass-card p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#14d1ff]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono text-[#adc6ff] mb-4">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Savings Calculator & Real-Time Estimator</span>
              </div>
              <h3 className="font-hanken font-bold text-2xl sm:text-3xl text-white mb-4">
                Quantify Your Automation ROI
              </h3>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6">
                Adjust the dials below to calculate how much resource is saved
                weekly & yearly when moving mundane operational tasks to our AI
                Agents.
              </p>
            </div>

            <div className="space-y-6 my-6 bg-black/20 p-5 rounded-2xl border border-white/5">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Number of Affected Employees</span>
                  <span className="text-[#adc6ff] font-bold">
                    {employees} Team Members
                  </span>
                </div>
                <input
                  type="range"
                  min={ROI_LIMITS.employees.min}
                  max={ROI_LIMITS.employees.max}
                  value={employees}
                  onChange={(event) => setEmployees(Number(event.target.value))}
                  aria-label="Number of affected employees"
                  className="w-full accent-[#adc6ff] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Manual Hours Spent per Person / Week</span>
                  <span className="text-[#14d1ff] font-bold">
                    {hoursPerWeek} Hours/wk
                  </span>
                </div>
                <input
                  type="range"
                  min={ROI_LIMITS.hoursPerWeek.min}
                  max={ROI_LIMITS.hoursPerWeek.max}
                  value={hoursPerWeek}
                  onChange={(event) =>
                    setHoursPerWeek(Number(event.target.value))
                  }
                  aria-label="Manual hours spent per person per week"
                  className="w-full accent-[#14d1ff] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Average Fully-Loaded Blended Hourly Cost</span>
                  <span className="text-white font-bold">
                    ${hourlyRate} / hour
                  </span>
                </div>
                <input
                  type="range"
                  min={ROI_LIMITS.hourlyRate.min}
                  max={ROI_LIMITS.hourlyRate.max}
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(Number(event.target.value))}
                  aria-label="Average fully-loaded blended hourly cost in US dollars"
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="text-[10px] font-mono text-cyan-400 hover:text-white underline cursor-pointer"
                >
                  Reset to Default Estimates
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border border-[#adc6ff]/10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#94b3b8] uppercase block mb-1">
                ESTIMATED SAVINGS BY DIGIMMATIC AI
              </span>

              <div className="my-6">
                <p className="text-[10px] font-mono text-[#adc6ff] uppercase mb-1">
                  Weekly Resource Preserved
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-hanken font-extrabold text-white">
                    {results.weeklyHoursSaved.toFixed(1)}
                  </span>
                  <span className="text-base text-slate-400 font-medium">
                    Hours Saved / wk
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    Yearly Time Preserved
                  </p>
                  <span className="text-lg sm:text-xl font-hanken font-bold text-[#14d1ff]">
                    {formatHours(results.yearlyHours)} hrs
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    Calculated Cost Efficiency
                  </p>
                  <span className="text-lg sm:text-xl font-hanken font-bold text-emerald-400">
                    {results.efficiency}%
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/10">
                <p className="text-[10px] font-mono text-slate-400 uppercase mb-0.5">
                  Yearly Financial ROI
                </p>
                <span className="text-2xl sm:text-3xl font-hanken font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400">
                  {formatCurrency(results.yearlyROI)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#14d1ff] hover:from-blue-400 hover:to-cyan-400 text-[#002e6a] font-bold text-sm tracking-wide shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Lock In These Savings</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </Link>
              <p className="text-[9px] font-mono text-slate-500 text-center mt-2.5">
                ROI calculations are based on average integration standard cycles
                of 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
