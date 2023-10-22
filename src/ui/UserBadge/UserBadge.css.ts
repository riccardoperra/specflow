import { style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

export const badge = style({
  height: "36px",
  borderRadius: themeTokens.radii.md,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  fontSize: themeTokens.fontSize.xs,
  padding: `0 ${themeTokens.spacing["3"]}`,
  gap: themeTokens.spacing["4"],
});
