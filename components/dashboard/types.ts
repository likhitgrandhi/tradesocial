export type DashboardView =
  | { type: "active-trades" }
  | { type: "history" }
  | { type: "symbol"; symbol: string }
