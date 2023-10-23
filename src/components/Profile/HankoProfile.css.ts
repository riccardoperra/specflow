import { createVar, globalStyle } from "@vanilla-extract/css";
import { responsiveStyle, themeTokens, themeVars } from "@codeui/kit";

globalStyle("hanko-profile", {
  vars: {
    "--color": themeVars.foreground,
    "--color-shade-1": themeVars.accent9,
    "--color-shade-2": themeVars.accent6,

    "--brand-color": themeVars.brand,
    "--brand-color-shade-1": themeVars.brandAccentActive,
    "--brand-contrast-color": "white",

    "--background-color": themeVars.accent4,

    "--error-color": themeVars.critical,
    "--link-color": themeVars.brandLink,

    "--font-weight": "400",
    "--font-size": "16px",
    "--font-family": "'Manrope', sans-serif",
    "--border-radius": "14px",
    "--border-style": "solid",
    "--border-width": "1px",

    "--item-height": "48px",
    "--item-margin": "0.5rem 0",

    "--container-padding": "0",
    "--container-padding-xs": themeTokens.spacing["0"],
    "--container-max-width": "440px",

    "--headline1-font-size": "32px",
    "--headline1-font-weight": "600",
    "--headline1-margin": "0 0 1.5rem",

    "--headline2-font-size": "16px",
    "--headline2-font-weight": "600",
    "--headline2-margin": "1rem 0 0.5rem",

    "--divider-padding": "0 42px",
    "--divider-visibility": "visible",

    "--link-text-decoration": "none",
    "--link-text-decoration-hover": "underline",

    "--input-min-width": "14em",

    "--button-min-width": "max-content",

    "--elastic-out":
      "linear(0, 0.2178 2.1%, 1.1144 8.49%, 1.2959 10.7%, 1.3463 11.81%," +
      " 1.3705 12.94%, 1.3726, 1.3643 14.48%, " +
      "1.3151 16.2%, 1.0317 21.81%, " +
      "0.941 24.01%, 0.8912 25.91%, " +
      "0.8694 27.84%, 0.8698 29.21%, " +
      "0.8824 30.71%, 1.0122 38.33%," +
      " 1.0357, 1.046 42.71%," +
      " 1.0416 45.7%, 0.9961 53.26%, " +
      "0.9839 57.54%, 0.9853 60.71%," +
      "1.0012 68.14%, 1.0056 72.24%, 0.9981 86.66%, 1)",
  },
});

globalStyle("hanko-profile::part(container)", {
  borderRadius: themeTokens.radii.lg,
  backgroundColor: "transparent",
  border: "none",
  maxWidth: "100%",
});

globalStyle("hanko-profile::part(headline1)", {
  fontSize: themeTokens.fontSize.xl,
});

globalStyle("hanko-profile::part(paragraph)", {
  marginBottom: themeTokens.spacing["6"],
});

const inputPasscodeBorderRadius = createVar();
const secondaryButtonBackground = createVar();

globalStyle(
  "hanko-profile::part(container)",
  responsiveStyle({
    xs: {
      padding: "var(--container-padding-xs)",
      borderRadius: themeTokens.radii.lg,
      backgroundColor: "transparent",
    },
    sm: {
      padding: "var(--container-padding)",
      border: "none",
    },
  }),
);

const transitions =
  "opacity .2s, background-color .2s, scale 1s var(--elastic-out), outline-color 150ms ease-in-out, outline-offset 150ms ease-in";

globalStyle("hanko-profile::part(form-item)", {
  minWidth: "100%",
});

/**
 * Buttons and Links
 */
globalStyle("hanko-profile::part(button)", {
  border: "none",
  transition: transitions,
  outlineColor: `transparent`,
  outlineOffset: "0px",
  padding: `0 ${themeTokens.spacing["3"]}`,
});

globalStyle("hanko-profile::part(link):focus-visible", {
  outline: `unset`,
  textDecoration: "underline",
});

globalStyle("hanko-profile::part(button):focus-visible", {
  outlineOffset: "4px",
  outline: `2px solid ${themeVars.brand}`,
});

globalStyle("hanko-profile::part(button):active", {
  scale: "0.97",
  transition: "scale 0.2s ease",
});

globalStyle("hanko-profile::part(button secondary-button)", {
  border: "none",
  backgroundColor: secondaryButtonBackground,
});

globalStyle("hanko-profile::part(button dangerous-button)", {
  border: "none",
  backgroundColor: themeVars.critical,
  color: themeVars.foreground,
});

globalStyle("hanko-profile::part(button dangerous-button):hover", {
  backgroundColor: themeVars.criticalAccentHover,
});

globalStyle("hanko-profile::part(button dangerous-button):active", {
  backgroundColor: themeVars.criticalAccentActive,
});

/**
 * For passcode input and text-input
 */

globalStyle("hanko-profile::part(input)", {
  border: "none",
  backgroundColor: themeVars.formAccent,
  transition: transitions,
  outlineColor: `transparent`,
  outlineOffset: "0px",
});

globalStyle("hanko-profile::part(input text-input)", {
  padding: `0 ${themeTokens.spacing["4"]}`,
});

globalStyle("hanko-profile::part(input passcode-input)", {
  borderRadius: inputPasscodeBorderRadius,
});

globalStyle(
  "hanko-profile::part(input):focus, hanko-profile::part(input):focus-visible",
  {
    outlineOffset: "3px",
    outline: `2px solid ${themeVars.brand}`,
  },
);

globalStyle(
  "hanko-profile::part(input):-webkit-autofill, " +
    "hanko-profile::part(input):-webkit-autofill:hover, " +
    "hanko-profile::part(input):-webkit-autofill:focus",
  {
    boxShadow: `0 0 0 50px ${themeVars.brandSoft} inset`,
  },
);

globalStyle("hanko-profile::part(error)", {
  vars: {
    backgroundColor: "#500f1c",
    color: themeVars.foreground,
    border: "unset",
    padding: `0 ${themeTokens.spacing["4"]}`,
  },
});

/**
 * Checkbox
 */
globalStyle("hanko-profile::part(input checkbox-input)", {
  position: "relative",
  height: "24px",
  width: "24px",
  overflow: "hidden",
  borderRadius: themeTokens.radii.sm,
});

globalStyle("hanko-profile::part(input checkbox-input):focus-visible", {
  outline: `2px solid ${themeVars.brand}`,
});

globalStyle("hanko-profile::part(input checkbox-input):hover::before", {
  backgroundColor: themeVars.formAccent,
});

globalStyle("hanko-profile::part(input checkbox-input):after", {
  position: "absolute",
  opacity: 1,
  background: themeVars.brand,
  borderRadius: themeTokens.radii.sm,
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  transitionProperty: "transform, opacity",
  transitionTimingFunction: "ease",
  transitionDuration: ".25s",
  transformOrigin: "center",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});
