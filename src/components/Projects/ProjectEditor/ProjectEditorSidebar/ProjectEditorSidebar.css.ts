import { style } from "@vanilla-extract/css";
import { responsiveStyle, themeTokens, themeVars } from "@codeui/kit";

export const sidebar = style([
  {
    width: "280px",
    flex: "0 0 280px",
    height: "100%",
    padding: themeTokens.spacing["4"],
    paddingTop: themeTokens.spacing["2"],
    backgroundColor: "#151516",
    transition: "transform 250ms ease-in-out",
    transform: "translateX(-280px)",
  },
  responsiveStyle({
    xs: { position: "absolute", left: 0, top: 0, zIndex: 20 },
    sm: { position: "relative" },
  }),
  {
    selectors: {
      "&[data-visible]": {
        transform: "translateX(0px)",
      },
    },
  },
]);
