import { style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

export const content = style({
  backgroundColor: "#151516",
  flex: 1,
  position: "relative",
  paddingLeft: themeTokens.spacing["1"],
  minWidth: "1px",
});

export const innerContent = style({
  height: "100%",
  flex: "1",
  position: "relative",
  backgroundColor: "#111",
  transition: "background-color .2s",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  borderRadius: "22px 0 22px 22px",
  borderTop: `1px solid #252525`,
  minHeight: 0,
  "@media": {
    "(min-width: 768px)": {
      borderRadius: "22px 22px 0 0",
      border: `1px solid #252525`,
    },
  },
});
