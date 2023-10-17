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

globalStyle("::-webkit-scrollbar", {
  width: "6px", // Adjust the width as needed
});

globalStyle("::-webkit-scrollbar-track", {
  background: themeVars.accent4,
});

globalStyle("::-webkit-scrollbar-thumb", {
  background: "gray",
  borderRadius: "6px", // Half the width for a circular thumb
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  background: "darkgray",
});
