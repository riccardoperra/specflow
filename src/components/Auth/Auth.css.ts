import { keyframes, style } from "@vanilla-extract/css";
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
      // background: "rgba(14, 5, 29, 0.3)",
      background: themeVars.accent1,
      backdropFilter: "blur(16px) saturate(180%)",
      // boxShadow:
      //   "rgba(101, 39, 153, 0.2) 0px 30px 60px, rgba(255, 255, 255, 0.3) 0px 0px 0px 0.5px inset",
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

export const leftContainer = style(
  responsiveStyle({
    xs: {
      width: "100%",
      paddingBottom: themeTokens.spacing["6"],
      borderBottom: `1px solid ${themeVars.separator}`,
      borderRadius: 0,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
    },
    lg: {
      width: "360px",
      background: themeVars.brandSoftAccentHover,
      borderRadius: themeTokens.radii.lg,
      // background: themeVars.accent2,
      // background: "rgba(31, 31, 71, 0.6)",}
    },
  }),
);

const float = keyframes({
  "0%": {
    transform: "scale(2) translateY(0px)",
  },
  "50%": {
    transform: "scale(2) translateY(10px)",
  },
  "100%": {
    transform: "scale(2) translateY(0px)",
  },
});

export const leftContainerImage2 = style({
  transform: `scale(2)`,
  animation: `${float} 6s ease-in-out infinite`,
});
