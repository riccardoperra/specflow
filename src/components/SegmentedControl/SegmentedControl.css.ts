import { themeTokens, themeVars } from "@codeui/kit";
import { createTheme, style } from "@vanilla-extract/css";

export const [segmentedFieldTheme, segmentedFieldVars] = createTheme({
  activeSegmentedBackgroundColor: themeVars.brandSecondaryAccentHover,
  segmentedTextColor: "white",
  activeSegmentedTextColor: "white",
});

export const list = style({
  display: "flex",
  gap: themeTokens.spacing["2"],
  position: "relative",
});

export const wrapper = style([
  segmentedFieldTheme,
  {
    alignItems: "stretch",
    width: "100%",
    height: "100%",
  },
  {
    display: "flex",
    flexWrap: "nowrap",
    overflow: "visible",
    borderRadius: themeTokens.radii.md,
    cursor: "default",
    textAlign: "center",
    userSelect: "none",
    backgroundColor: themeVars.formAccent,
    position: "relative",
    padding: themeTokens.spacing["1"],
  },
]);

export const indicator = style([
  {
    position: "absolute",
    height: "100%",
    transition:
      "width 250ms cubic-bezier(.2, 0, 0, 1), transform 250ms cubic-bezier(.2, 0, 0, 1)",
    backgroundColor: segmentedFieldVars.activeSegmentedBackgroundColor,
    content: "",
    boxShadow: themeTokens.boxShadow.md,
    borderRadius: themeTokens.radii.sm,
  },
]);

export const segment = style([
  {
    height: "100%",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    fontSize: themeTokens.fontSize.sm,
    padding: `${themeTokens.spacing["0"]} ${themeTokens.spacing["2"]}`,
    color: segmentedFieldVars.segmentedTextColor,
    opacity: 0.65,
    zIndex: 1,
    fontWeight: themeTokens.fontWeight.medium,
    borderRadius: themeTokens.radii.sm,
    transition:
      "opacity .2s, background-color .2s, transform .2s, outline-color 150ms ease-in-out, outline-offset 150ms ease-in",
    outlineColor: `transparent`,
    outlineOffset: "0px",
    selectors: {
      "&:not(:disabled)": {
        cursor: "pointer",
      },
      "&[data-selected]": {
        fontWeight: themeTokens.fontWeight.semibold,
        opacity: 1,
        color: segmentedFieldVars.activeSegmentedTextColor,
      },
    },
    ":focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${themeVars.brand}`,
    },
  },
]);
