import {
  globalKeyframes,
  globalStyle,
  keyframes,
  style,
} from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

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
  width: "18px",
  height: "18px",
});

globalStyle("::-webkit-scrollbar-track", {
  backgroundColor: "transparent",
});

globalStyle("::-webkit-scrollbar-corner", {
  backgroundColor: themeVars.accent6,
  borderRadius: themeTokens.radii.full,
  backgroundClip: "content-box",
  border: "6px solid transparent",
});

globalStyle("::-webkit-scrollbar-thumb", {
  backgroundColor: themeVars.accent6,
  borderRadius: themeTokens.radii.full,
  border: "6px solid transparent",
  backgroundClip: "content-box",
  transition: "background-color .2s",
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  backgroundColor: themeVars.accent8,
});

const backdropFilter = keyframes({
  "0%": {
    backdropFilter: "blur(0px) saturate(180%)",
  },
  "100%": {
    backdropFilter: "blur(8px) saturate(180%)",
  },
});

// Add backdrop filter blur for modals

globalStyle("div[data-panel-size]", {
  animation: `${backdropFilter} 250ms normal forwards ease-in-out`,
});
