"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import CountryCodeSelect from "@/components/ui/CountryCodeSelect";
import useCalendlyRefresh from "@/hooks/useCalendlyRefresh";
import { buildCalendlyUrl } from "@/lib/calendly";
import {
  consumeCalendlyScrollIntent,
  CALENDLY_CONTAINER_ID,
  scrollToCalendly,
} from "@/lib/scroll";
import {
  CALENDLY_URL,
  PARTNER_LOGOS,
  SOLUTION_OPTIONS,
} from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [selectedSolutions, setSelectedSolutions] = useState([
    "AI Customer Support",
  ]);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState(null);
  const { refreshKey, triggerManualRefresh } = useCalendlyRefresh();
  const calendlySrc = buildCalendlyUrl(CALENDLY_URL);

  useEffect(() => {
    if (consumeCalendlyScrollIntent()) {
      scrollToCalendly();
    }
  }, []);

  useEffect(() => {
    if (status === "success") {
      triggerManualRefresh();
      scrollToCalendly();
    }
  }, [status, triggerManualRefresh]);

  const toggleSolution = (label) => {
    setSelectedSolutions((current) => {
      if (current.includes(label)) {
        return current.length > 1
          ? current.filter((item) => item !== label)
          : current;
      }
      return [...current, label];
    });
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value.replace(/\D/g, ""));
  };

  const resetForm = () => {
    setStatus("idle");
    setSubmission(null);
    setError(null);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setSelectedSolutions(["AI Customer Support"]);
    setHoneypot("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name field is mandatory.");
      return;
    }
    if (!company.trim()) {
      setError("Company Name field is mandatory.");
      return;
    }
    if (!email.trim()) {
      setError("Email Address is mandatory.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone Number is mandatory.");
      return;
    }
    if (selectedSolutions.length === 0) {
      setError("At least one AI Solution must be selected.");
      return;
    }

    setStatus("submitting");

    const fullPhone = `${countryCode} ${phone.trim()}`;
    const solutions = selectedSolutions.join(", ");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: fullPhone,
          solutions,
          _hp_website: honeypot,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to send your message.");
      }

      setStatus("success");
      setSubmission({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: fullPhone,
        solution: solutions,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (submitError) {
      setStatus("idle");
      setError(
        submitError.message ||
          "An unexpected error occurred while sending your message.",
      );
    }
  };

  return (
    <div className="pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-[#adc6ff] uppercase block mb-3 bg-blue-900/40 border border-blue-500/20 px-3 py-1 rounded-full w-max mx-auto">
          Take the Leap Into AI-Native Growth
        </span>
        <h1 className="font-hanken font-extrabold text-4xl sm:text-[52px] leading-tight text-white mb-6">
          Ready to go{" "}
          <span className="bg-gradient-to-r from-[#adc6ff] via-[#14d1ff] to-[#ffb786] bg-clip-text text-transparent animate-pulse">
            AI-Native?
          </span>
        </h1>
        <p className="font-sans text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          The bridge between raw capability and automated efficiency. Let&apos;s
          design your custom invisible infrastructure today.
        </p>
        <div className="mt-6 laser-divider" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 rounded-3xl glass-card p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px]" />

            {status !== "success" ? (
              <div>
                <div className="mb-8">
                  <h3 className="font-hanken font-bold text-2xl text-white mb-2">
                    Initiate Discovery Strategy
                  </h3>
                  <p className="font-sans text-slate-400 text-xs sm:text-sm">
                    Fill out the criteria below. Our engineering team parses
                    details and sets up a customized roadmap proposal before we
                    jump on a discovery call.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">
                      What core solutions are you looking to automate? *
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SOLUTION_OPTIONS.map((option) => {
                        const isSelected = selectedSolutions.includes(
                          option.label,
                        );

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleSolution(option.label)}
                            aria-pressed={isSelected}
                            className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(20,209,255,0.12)] ring-1 ring-cyan-400/20"
                                : "bg-black/20 border-white/5 hover:border-white/15 text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-hanken font-bold text-sm tracking-wide">
                                {option.label}
                              </span>
                              {isSelected ? (
                                <Check
                                  className="w-4 h-4 text-[#14d1ff] animate-in zoom-in-50 duration-enter-200"
                                  aria-hidden="true"
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-white/20 hover:border-white/40 transition-colors" />
                              )}
                            </div>
                            <p className="font-mono text-[10px] text-slate-400 leading-none">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-mono text-slate-400 mb-2 uppercase"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/60 transition-colors"
                        placeholder="Alex Rivera"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-[11px] font-mono text-slate-400 mb-2 uppercase"
                      >
                        Company Name *
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/60 transition-colors"
                        placeholder="TechFlow Inc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] font-mono text-slate-400 mb-2 uppercase"
                    >
                      Work Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/60 transition-colors"
                      placeholder="alex@techflow.ai"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-[11px] font-mono text-slate-400 mb-2 uppercase"
                    >
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <CountryCodeSelect
                        id="country-code-select"
                        value={countryCode}
                        onChange={setCountryCode}
                        ariaLabel="Country calling code"
                      />
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/60 transition-colors flex-grow"
                        placeholder="501234567"
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>

                  {error ? (
                    <div
                      role="alert"
                      className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    id="form-submit-button"
                    disabled={status === "submitting"}
                    className={`w-full mt-4 py-4 rounded-xl text-[#002e6a] font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                      status === "submitting"
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-80"
                        : "bg-gradient-to-r from-[#adc6ff] to-[#14d1ff] hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {status === "submitting" ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-[#002e6a]"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Dispatching Transmission...
                      </>
                    ) : (
                      "Initiate Discovery Sequence"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 animate-pulse">
                  <CheckCircle2
                    className="w-10 h-10 text-emerald-400"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
                  TRANSMISSION ESTABLISHED SECURELY
                </span>
                <h3 className="font-hanken font-bold text-3xl text-white mb-4">
                  System Strategy Locked
                </h3>
                <p className="font-sans text-slate-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Thank you,{" "}
                  <span className="font-bold text-[#adc6ff]">
                    {submission?.name}
                  </span>
                  . Our artificial intelligence system model parsed your criteria
                  and routed selection of{" "}
                  <span className="text-cyan-300 font-bold">
                    &quot;{submission?.solution}&quot;
                  </span>{" "}
                  to our core workflow architecture panel.
                </p>
                <div className="w-full max-w-md bg-black/45 p-5 rounded-2xl border border-white/10 text-left mb-8 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      CLIENT VISITOR:
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {submission?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      ENTERPRISE COMPANY:
                    </span>
                    <span className="text-white font-mono">
                      {submission?.company}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      SECURE RESPONDING TO:
                    </span>
                    <span className="text-cyan-300 font-mono">
                      {submission?.email}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      SELECTED TARGET:
                    </span>
                    <span className="text-[#adc6ff] font-mono text-right max-w-[60%]">
                      {submission?.solution}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-mono text-cyan-400 hover:text-white underline"
                >
                  Submit another proposal inquiry
                </button>
              </div>
            )}
          </div>

          <div
            id={CALENDLY_CONTAINER_ID}
            className="lg:col-span-5 rounded-3xl glass-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#ffb786]/5 rounded-full blur-[80px]" />

            {status === "success" ? (
              <div className="flex-grow">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-2">
                  Active Booking Interface
                </span>
                <h3 className="font-hanken font-bold text-xl text-white mb-2">
                  Ready to Book Your Strategy Session
                </h3>
                <p className="font-sans text-slate-400 text-xs sm:text-sm mb-6">
                  Pick an available slot below to sync 1-on-1 with our engineering
                  leadership to refine your digital architecture:
                </p>
                <div className="w-full h-[450px] bg-[#090d1c]/50 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-inner relative mb-6">
                  <iframe
                    key={refreshKey}
                    title="Calendly scheduling"
                    src={calendlySrc}
                    className="w-full h-full border-0"
                    allow="geolocation; microphone; camera; midi; encrypted-media"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between h-full text-left">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#94b3b8] uppercase block mb-4">
                    Direct Calendar Bookings Locked
                  </span>
                  <h3 className="font-hanken font-bold text-xl text-white mb-4">
                    Secure Your Discovery Slot
                  </h3>
                  <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
                    To ensure high-context alignment, our interactive Calendly
                    scheduling platform will be dynamically activated immediately
                    upon submitting the strategy formulated inquiry on the left.
                  </p>
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <p className="text-xs font-mono text-slate-500">
                      Calendar unlocks after form submission
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-mono tracking-widest text-[#94b3b8] uppercase text-center mb-4">
                    trusted by scale builders
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {PARTNER_LOGOS.slice(0, 6).map((logo) => (
                      <span
                        key={logo}
                        className="text-[10px] font-hanken font-black tracking-widest text-slate-600"
                      >
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
