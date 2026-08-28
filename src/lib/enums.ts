// Source-of-truth TypeScript unions for the string-backed "enum" columns in
// prisma/schema.prisma. SQLite has no native enum type, so these values are
// enforced in the application layer instead of the database layer.

export type Role = "ADMIN" | "PARTNER" | "ASSOCIATE" | "ANALYST";
export type FundStatus = "FUNDRAISING" | "INVESTING" | "HARVESTING" | "CLOSED";
export type LpType =
  | "INSTITUTIONAL"
  | "FAMILY_OFFICE"
  | "FUND_OF_FUNDS"
  | "ENDOWMENT"
  | "CORPORATE"
  | "INDIVIDUAL";
export type CallStatus = "PENDING" | "PARTIAL" | "COMPLETE";
export type DistributionType = "RETURN_OF_CAPITAL" | "CAPITAL_GAIN" | "DIVIDEND_INCOME";
export type CompanyStage = "PRE_SEED" | "SEED" | "SERIES_A" | "SERIES_B" | "SERIES_C_PLUS" | "GROWTH";
export type CompanyStatus = "ACTIVE" | "EXITED" | "WRITTEN_OFF";
export type SecurityType = "SAFE" | "CONVERTIBLE_NOTE" | "PREFERRED_EQUITY" | "COMMON_EQUITY";
export type DealStage =
  | "SOURCING"
  | "SCREENING"
  | "DUE_DILIGENCE"
  | "TERM_SHEET"
  | "CLOSED_WON"
  | "CLOSED_LOST";
export type DealSource =
  | "REFERRAL"
  | "INBOUND"
  | "CONFERENCE"
  | "COLD_OUTREACH"
  | "EXISTING_PORTFOLIO"
  | "OTHER";
export type ContactType = "FOUNDER" | "LP" | "ADVISOR" | "CO_INVESTOR" | "SERVICE_PROVIDER" | "OTHER";
export type NoteType = "NOTE" | "MEETING" | "CALL" | "EMAIL";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type DocumentCategory =
  | "DATA_ROOM"
  | "LEGAL"
  | "FINANCIAL"
  | "PITCH_DECK"
  | "BOARD_MATERIALS"
  | "OTHER";
