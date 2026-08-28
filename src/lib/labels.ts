// Human-readable labels and badge color classes for enum values across the app.
// Keeping these centralized avoids drift between the pipeline board, tables, and detail pages.

export const dealStageLabels: Record<string, string> = {
  SOURCING: "Sourcing",
  SCREENING: "Screening",
  DUE_DILIGENCE: "Due Diligence",
  TERM_SHEET: "Term Sheet",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

export const dealStageOrder = [
  "SOURCING",
  "SCREENING",
  "DUE_DILIGENCE",
  "TERM_SHEET",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export const dealStageBadge: Record<string, string> = {
  SOURCING: "bg-ink-100 text-ink-600",
  SCREENING: "bg-sky-100 text-sky-700",
  DUE_DILIGENCE: "bg-gold-100 text-gold-700",
  TERM_SHEET: "bg-violet-100 text-violet-700",
  CLOSED_WON: "bg-emerald-50 text-emerald-600",
  CLOSED_LOST: "bg-rose-50 text-rose-600",
};

export const companyStageLabels: Record<string, string> = {
  PRE_SEED: "Pre-Seed",
  SEED: "Seed",
  SERIES_A: "Series A",
  SERIES_B: "Series B",
  SERIES_C_PLUS: "Series C+",
  GROWTH: "Growth",
};

export const companyStatusLabels: Record<string, string> = {
  ACTIVE: "Active",
  EXITED: "Exited",
  WRITTEN_OFF: "Written Off",
};

export const companyStatusBadge: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  EXITED: "bg-gold-100 text-gold-700",
  WRITTEN_OFF: "bg-rose-50 text-rose-600",
};

export const fundStatusLabels: Record<string, string> = {
  FUNDRAISING: "Fundraising",
  INVESTING: "Investing",
  HARVESTING: "Harvesting",
  CLOSED: "Closed",
};

export const fundStatusBadge: Record<string, string> = {
  FUNDRAISING: "bg-sky-100 text-sky-700",
  INVESTING: "bg-emerald-50 text-emerald-600",
  HARVESTING: "bg-gold-100 text-gold-700",
  CLOSED: "bg-ink-100 text-ink-500",
};

export const callStatusBadge: Record<string, string> = {
  PENDING: "bg-ink-100 text-ink-600",
  PARTIAL: "bg-gold-100 text-gold-700",
  COMPLETE: "bg-emerald-50 text-emerald-600",
};

export const lpTypeLabels: Record<string, string> = {
  INSTITUTIONAL: "Institutional",
  FAMILY_OFFICE: "Family Office",
  FUND_OF_FUNDS: "Fund of Funds",
  ENDOWMENT: "Endowment",
  CORPORATE: "Corporate",
  INDIVIDUAL: "Individual",
};

export const dealSourceLabels: Record<string, string> = {
  REFERRAL: "Referral",
  INBOUND: "Inbound",
  CONFERENCE: "Conference",
  COLD_OUTREACH: "Cold Outreach",
  EXISTING_PORTFOLIO: "Existing Portfolio",
  OTHER: "Other",
};

export const contactTypeLabels: Record<string, string> = {
  FOUNDER: "Founder",
  LP: "LP",
  ADVISOR: "Advisor",
  CO_INVESTOR: "Co-Investor",
  SERVICE_PROVIDER: "Service Provider",
  OTHER: "Other",
};

export const taskStatusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const taskStatusBadge: Record<string, string> = {
  TODO: "bg-ink-100 text-ink-600",
  IN_PROGRESS: "bg-sky-100 text-sky-700",
  DONE: "bg-emerald-50 text-emerald-600",
};

export const taskPriorityBadge: Record<string, string> = {
  LOW: "bg-ink-100 text-ink-500",
  MEDIUM: "bg-gold-100 text-gold-700",
  HIGH: "bg-rose-50 text-rose-600",
};

export const securityTypeLabels: Record<string, string> = {
  SAFE: "SAFE",
  CONVERTIBLE_NOTE: "Convertible Note",
  PREFERRED_EQUITY: "Preferred Equity",
  COMMON_EQUITY: "Common Equity",
};

export const documentCategoryLabels: Record<string, string> = {
  DATA_ROOM: "Data Room",
  LEGAL: "Legal",
  FINANCIAL: "Financial",
  PITCH_DECK: "Pitch Deck",
  BOARD_MATERIALS: "Board Materials",
  OTHER: "Other",
};

export const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  PARTNER: "Partner",
  ASSOCIATE: "Associate",
  ANALYST: "Analyst",
};

export const noteTypeLabels: Record<string, string> = {
  NOTE: "Note",
  MEETING: "Meeting",
  CALL: "Call",
  EMAIL: "Email",
};

export const distributionTypeLabels: Record<string, string> = {
  RETURN_OF_CAPITAL: "Return of Capital",
  CAPITAL_GAIN: "Capital Gain",
  DIVIDEND_INCOME: "Dividend Income",
};
