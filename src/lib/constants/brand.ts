export const ORKTRA_BRAND = {
  name: "ORKTRA",
  palette: {
    primary: "#0E4759",
    secondary: "#26788C",
    graphite: "#202932",
    neutral: "#5A6672",
    lightBg: "#F0F6F8",
    white: "#FFFFFF",
  },
  references: ["Notion", "Stripe", "SAP"],
} as const;

export const ORKTRA_DEFAULT_THEME = {
  light: {
    background: ORKTRA_BRAND.palette.lightBg,
    foreground: ORKTRA_BRAND.palette.graphite,
    card: ORKTRA_BRAND.palette.white,
    border: "#D8E2E8",
  },
  dark: {
    background: "#0D1419",
    foreground: "#ECF3F6",
    card: "#111D24",
    border: "#29414E",
  },
} as const;

