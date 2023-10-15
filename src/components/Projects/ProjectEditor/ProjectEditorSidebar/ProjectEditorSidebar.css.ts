import { style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

export const sidebar = style({
  width: "280px",
  flex: "0 0 280px",
  height: "100%",
  padding: themeTokens.spacing["4"],
  borderRight: `1px solid ${themeVars.separator}`,
  paddingTop: themeTokens.spacing["2"],
});
