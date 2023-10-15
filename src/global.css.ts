import { globalStyle, style } from "@vanilla-extract/css";
import { themeVars } from "@codeui/kit";

globalStyle("html", {
  backgroundColor: "#111",
  color: "#fff",
});

globalStyle("button[data-cui=button]", {
  verticalAlign: "text-bottom",
  lineHeight: 1,
});

globalStyle("button, role[button]", {
  cursor: "default",
});

export const bgBrand = style({
  backgroundColor: themeVars.brand,
  color: themeVars.foreground,
});
