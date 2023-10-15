import { style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

export const sidebar = style({
  width: "280px",
  flex: "0 0 280px",
  height: "100%",
  padding: themeTokens.spacing["4"],
  paddingTop: themeTokens.spacing["2"],
  backgroundColor: "#151516",
});
