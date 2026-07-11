"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FINTECH_IMAGE_URL, STUDIO_IMAGE_URL } from "@/lib/constants";

export default function SuccessPage() {
  return (
    <div className="pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-[#adc6ff] uppercase block mb-3 bg-cyan-900/40 border border-cyan-500/35 px-4 py-1 rounded-full w-max mx-auto">
          Quantifiable Business Results
        </span>
        <h1 className="font-hanken font-extrabold text-4xl sm:text-[52px] leading-tight text-white mb-6">
          Efficiency{" "}
          <span className="bg-gradient-to-r from-blue-400 to-[#14d1ff] bg-clip-text text-transparent">
            Perfected.
          </span>
        </h1>
        <p className="font-sans text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Discover how leading enterprises are leveraging DIGIMMATIC AI to transform
          operational bottlenecks into scalable growth engines through custom
          automation systems.
        </p>
        <div className="mt-6 laser-divider" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 rounded-3xl glass-card p-8 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900 -z-10" />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#adc6ff] uppercase bg-blue-900/30 px-3 py-1 rounded border border-blue-500/20">
                FINTECH SPECIALIZATION & REGULATORY COMPLIANCE
              </span>
              <h2 className="font-hanken font-extrabold text-2xl sm:text-3xl text-white mt-4 mb-3">
                Financial Reporting Reimagined
              </h2>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6 max-w-2xl">
                A global fintech client operated manual reconciliations across
                multiple currency silos, creating severe delayed reporting times. We
                deployment end-to-end n8n validation pipelines, reducing auditing
                cycle errors by 99.9%.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-[#adc6ff]/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Weekly Audits Preservation
                    </span>
                    <span className="text-2xl sm:text-3xl font-hanken font-black text-[#14d1ff]">
                      140hrs saved / mo
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-[#adc6ff]/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      System Clean Accuracy
                    </span>
                    <span className="text-2xl sm:text-3xl font-hanken font-black text-emerald-400">
                      99.9% Perfected
                    </span>
                  </div>
                </div>
                <div className="h-40 rounded-xl overflow-hidden border border-white/5 relative bg-slate-950">
                  <Image
                    src={FINTECH_IMAGE_URL}
                    alt="Visual tech graph of fintech points of light networks"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono text-[#adc6ff]">
                    Fintech Data Visualizer v1
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs sm:text-sm text-slate-300 italic">
                *&quot;DIGIMMATIC AI didn&apos;t just automate tasks; they
                re-engineered our auditing flow entirely. Our financial system ROI
                was realized in less than 90 days.&quot;*
              </p>
              <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  — CHIEF TECHNOLOGY OFFICER, FINTECH HUB
                </span>
                <span className="text-[10px] font-mono text-[#94b3b8]">
                  RELEVANT TECH: n8n, Custom SQL
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl glass-card p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                E-COMMERCE GROWTH
              </span>
              <h3 className="font-hanken font-bold text-xl text-white mt-4 mb-2">
                Luxury Logistics Ops
              </h3>
              <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Reducing manual support tickets by up to 60% during fast trending
                product drops. Dynamic auto-notifications sync instantly with
                Shopify webhooks.
              </p>
              <div className="bg-gradient-to-br from-[#0c1f2e] to-slate-950 p-6 rounded-2xl border border-emerald-500/15 text-center my-4">
                <span className="text-xs font-mono text-[#94b3b8] block uppercase">
                  CONVERSION METRIC LIFT
                </span>
                <span className="text-4xl font-hanken font-black text-emerald-400">
                  32%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">
                  Calculated post-launch
                </span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>60% Support Load Cutback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Immediate Shipping Dispatch</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl glass-card p-8 relative overflow-hidden">
            <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase bg-rose-400/10 px-2 py-0.5 rounded">
              HIPAA Compliant Medical Portal
            </span>
            <h3 className="font-hanken font-bold text-xl text-white mt-4 mb-2">
              BioPath Diagnostics
            </h3>
            <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Securing diagnostic entry logs with absolute privacy enforcement.
              Automating secure file transfer structures between labs and clinical
              care systems seamlessly.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-slate-500 block">
                  Manual Intake Validation Time:
                </span>
                <span className="text-lg font-hanken font-bold text-slate-400 line-through">
                  4.2 hrs
                </span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20">
                <span className="text-[10px] font-mono text-slate-500 block">
                  DIGIMMATIC AI Automation Time:
                </span>
                <span className="text-lg font-hanken font-bold text-emerald-400">
                  12 min
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 italic">
              *&quot;The scalability this automation provided allowed us to
              quadruple our processing capacity without adding administrative
              headcount.&quot;* — Operations Director
            </p>
          </div>

          <div className="lg:col-span-6 rounded-3xl glass-card p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="h-44 rounded-xl overflow-hidden border border-white/5 relative p-1 bg-slate-950 mb-6">
                <Image
                  src={STUDIO_IMAGE_URL}
                  alt="Creative asset flow lines mockup"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#adc6ff]">
                  Studio Motion Workflow v2
                </span>
              </div>
              <h3 className="font-hanken font-bold text-xl text-white mb-2">
                Studio Motion Workflow
              </h3>
              <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Automated feedback capture and raw file formatting processes for a
                top-tier 150-person creative visual visual agency.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
              <div className="flex space-x-4">
                <div>
                  <span className="font-mono text-slate-500 block">GAINS:</span>
                  <span className="font-mono font-bold text-[#adc6ff]">
                    85% Faster
                  </span>
                </div>
                <div>
                  <span className="font-mono text-slate-500 block">SAVINGS:</span>
                  <span className="font-mono font-bold text-white">
                    4.2k Hours/yr
                  </span>
                </div>
              </div>
              <Link
                href="/contact"
                className="font-mono font-bold text-cyan-300 hover:underline flex items-center space-x-1"
              >
                <span>Request Discovery Call</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-[#090d1c] border border-white/5 p-8 sm:p-12 text-center">
          <span className="text-xs font-mono tracking-widest text-[#adc6ff] uppercase block mb-3">
            ARE YOU OUR NEXT SUCCESS CASE?
          </span>
          <h3 className="font-hanken font-extrabold text-2xl sm:text-3xl text-white mb-4">
            Let&apos;s audit your repetitive tasks.
          </h3>
          <p className="font-sans text-slate-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Identify high-ROI processes suited for instant automation. Schedule a
            customized system evaluation with building leaders today.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#adc6ff] to-[#14d1ff] text-[#002e6a] font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all inline-flex items-center space-x-2"
          >
            <span>Schedule My Operations Audit</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
