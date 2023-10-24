import { createVar, style } from "@vanilla-extract/css";
import { responsiveStyle, themeTokens, themeVars } from "@codeui/kit";

export const container = style({});

export const gradientBg = style({
  position: "absolute",
});

export const inner = style([
  {
    position: "relative",
    maxWidth: "960px",
    width: "100%",
    padding: "20px",
    display: "grid",
    gap: "20px",
    justifyItems: "center",
    borderRadius: "20px",
    opacity: "1",
    animation:
      "1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s 1 normal forwards running jkLqKc",
  },
  responsiveStyle({
    xs: {
      display: "grid",
      backgroundColor: "transparent",
    },
    lg: {
      display: "grid",
      background: "rgba(11,11,11,0.8)",
      boxShadow: "rgba(255, 255, 255, 0.3) 0px 0px 0px 0.5px inset",
      gridTemplateColumns: "360px auto",
      height: "600px",
    },
  }),
]);

export const authContainer = style([
  responsiveStyle({
    xs: {
      padding: 0,
    },
    lg: {
      padding: themeTokens.spacing["6"],
    },
  }),
]);

export const backdrop = style({
  display: "flex",
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  WebkitBoxPack: "center",
  justifyContent: "center",
  WebkitBoxAlign: "center",
  alignItems: "center",
  zIndex: "10",
  padding: "0px 20px",
  animation: "1s ease 0s 1 normal forwards running bDTdTe",
});
