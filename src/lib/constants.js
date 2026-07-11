export const PARTNER_LOGOS = [
  "TABBY",
  "REVOLUT",
  "CAREEM",
  "WIO BANK",
  "SHIPT",
  "NOON",
  "TALABAT",
  "KITOPI",
  "DUBIZZLE",
  "STC PAY",
  "NANA",
  "TAMARA",
];

export const EXPERTISE_CARDS = [
  {
    id: "agents",
    icon: "Bot",
    title: "Autonomous AI Agents",
    description:
      "Proprietary LLM agents that handle complex customer inquiries, lead qualification, and multi-step reasoning without human intervention.",
    bullets: [
      "Self-improving retrieval loops",
      "Multi-language native flow",
    ],
    glowClass: "bg-blue-500/5 group-hover:bg-blue-500/10",
    iconBgClass: "bg-blue-900/30 border-blue-500/20",
    iconColorClass: "text-[#adc6ff]",
  },
  {
    id: "workflows",
    icon: "Workflow",
    title: "Custom Workflows",
    description:
      "Eliminate manual bottlenecks with end-to-end pipelines that unify your tech stack, drive 24/7 operational efficiency, and scale your business logic.",
    bullets: [
      "Connected SaaS orchestrations",
      "Automatic error-recovery nodes",
    ],
    glowClass: "bg-cyan-500/5 group-hover:bg-cyan-500/10",
    iconBgClass: "bg-cyan-900/30 border-cyan-500/20",
    iconColorClass: "text-[#14d1ff]",
  },
  {
    id: "crm",
    icon: "Database",
    title: "CRM Integration",
    description:
      "Seamlessly sync and clean data across Salesforce, HubSpot, and Pipedrive or custom SQL engines automatically with neural sorting rules.",
    bullets: [
      "Instant bidirectional pipelines",
      "Automatic duplication removal",
    ],
    glowClass: "bg-orange-500/5 group-hover:bg-orange-500/10",
    iconBgClass: "bg-orange-500/10 border-[#df7412]/20",
    iconColorClass: "text-[#ffb786]",
  },
];


export const NEURAL_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBCigb65Hb3IeI1MN6qOjC9UTLMOg2fHVO508m-rCK5iS1mugFQ30HeSyROcj8g3Oh2hcTzmtZDC4Pygf1XMdR1jCgXAa1wIzHo1yxGYf5YkRrVglRSJLd8X33Wc-h6gLd1UiTJptqedkjCDqklnaQyxQzhj8W_VWGOdMAoLVbh8IR_L94eXmboY04qR16FOw2Pko9YvOZNjdUgyYvJs1IFyqcHhk5kFX3CwO-urPXK0T9LWfIxnJ6yswwjRZbfb2TvqOlbRoPq15DS";

export const ROI_DEFAULTS = {
  employees: 5,
  hoursPerWeek: 12,
  hourlyRate: 35,
};

export const ROI_LIMITS = {
  employees: { min: 1, max: 50 },
  hoursPerWeek: { min: 2, max: 40 },
  hourlyRate: { min: 15, max: 150 },
};

export const EFFICIENCY_ITEMS = [
  {
    id: "efficiency",
    icon: "Zap",
    title: "90% Efficiency Gain",
    description:
      "Our automated client pipelines experience dramatic time savings, freeing human minds for high-value strategic growth.",
  },
  {
    id: "security",
    icon: "Lock",
    title: "Enterprise-Grade Security",
    description:
      "Data privacy is at the core of our designs. Your proprietary files and system queries remain stored within secure VPC workspaces.",
  },
  {
    id: "audits",
    icon: "ShieldCheck",
    title: "Transparent Logic Audits",
    description:
      "Every decision node is documented. Audit and track logic flows directly via centralized monitoring dashboards.",
  },
];

export const WORKFLOW_STEPS = [
  {
    id: "s1",
    step: "S1",
    label: "STEP 1: CAPTURE & PARSE",
    description: "Trigger event qualification",
    borderClass: "border-teal-500/20",
    badgeBgClass: "bg-teal-900/30",
    badgeTextClass: "text-teal-400",
    indicator: "ping",
    connectorClass: "from-teal-500/40 to-blue-500/40",
  },
  {
    id: "s2",
    step: "S2",
    label: "STEP 2: LLM ROUTING CORE",
    description: "Identify proper downstream action tool",
    borderClass: "border-blue-500/20",
    badgeBgClass: "bg-blue-900/30",
    badgeTextClass: "text-blue-400",
    indicator: "dot",
    connectorClass: "from-blue-500/40 to-cyan-500/40",
  },
  {
    id: "s3",
    step: "S3",
    label: "STEP 3: WRITEBACK & EXECUTION",
    description: "Update CRM & dispatch automatic callback",
    borderClass: "border-cyan-500/20",
    badgeBgClass: "bg-cyan-900/30",
    badgeTextClass: "text-cyan-400",
    indicator: "check",
    connectorClass: null,
  },
];

export const AGENT_FEATURES = [
  "24/7 Multi-modal support setup",
  "Dynamic live Knowledge Base Syncing",
  "Autonomous system error routing",
  "Zero-maintenance vector indexing",
];

export const ROADMAP_STAGES = [
  { label: "Stage 1: Technical Audit", active: true },
  { label: "Stage 2: Model Tuning", active: false },
];

export const IMPLEMENTATION_PHASES = [
  {
    title: "Discovery Audit",
    description:
      "A meticulous technical analysis of your daily workflows and system silos. We pinpoint high-ROI opportunities and formulate exact scope structures before writing a single block of code.",
  },
  {
    title: "Sandbox Engineering",
    description:
      "Rapid architecture of custom AI agents and n8n pipelines in a isolated sandbox environment. We stress-test edge-cases, validation limits, and multi-user load performance securely.",
  },
  {
    title: "VPC Deployment & Scale",
    description:
      "Seamless global transition to production with centralized logs monitoring dashboard. Our team continues tracking efficiency, and tweaking agent models as your operations grow.",
  },
];

export const SOLUTION_OPTIONS = [
  {
    id: "ai-support",
    label: "AI Customer Support",
    description: "Autonomous ticket solvers",
  },
  {
    id: "data-extract",
    label: "Data Extraction & Cleaning",
    description: "Clean CRM sync nodes",
  },
  {
    id: "workflows",
    label: "Workflow Architecture",
    description: "Complex n8n systems",
  },
  {
    id: "agentic-custom",
    label: "Custom Agentic Solutions",
    description: "Proprietary LLM agents",
  },
];

export const SOLUTION_LABELS = SOLUTION_OPTIONS.map((option) => option.label);

export const FINTECH_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDd8rJJ_RpFp6uJzn5JeWKFCnBlDJ02JNxuDjkv4zB3hbEpn-YYLefeYPKaIgi9E7gWfftSAkNW_zKqkHcOYbFOgXWgx1zFLKl62MsG6kBIaVhmPa4-49py3Zrx1ooLuKSgjhZ7sSZlqG7T1rVfOlDPIQhF1XGNPHryMDHPaU-fUQi91k45bCLGX3W7DuJER6OZtrFgPcVFMpB8yf8ssWzCjh-kOZmlUloKkKqnkPb0rBShmycEi0-WdnpPMJYjc6IetwheKcpDlBDU";

export const STUDIO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgZ7zJLAGPItWQf6WhPcfzkk2o0iN0DCKn_PydQPIdxAIolPPkWf4nXdBKdZYhA6KF5YkofcKmGlkSEy0wvySxilDCOQT0ZsKNHP2IgilEKEDnC81FPNPrbydbS0Vxvb7YrfzZ6gKn251nJmeiYI4EYZbU1Iu-9zAIg9-tPAu9welUkqHubSdySZWcJkJCUlu9yuN7ToOik2tUFnD5B3q31uz5W6yhGTEb51KVXeAP3l2piJyzJNKBBC9FRyk0OZChv9R8ak5BmsSY";

export const CALENDLY_URL = "https://calendly.com/n8nworkflowsai/30min";
