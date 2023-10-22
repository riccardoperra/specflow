import { createVar, globalStyle } from "@vanilla-extract/css";
import { responsiveStyle, themeTokens, themeVars } from "@codeui/kit";

const inputPasscodeBorderRadius = createVar();

globalStyle("hanko-auth", {
  vars: {
    "--color": themeVars.foreground,
    "--color-shade-1": themeVars.accent9,
    "--color-shade-2": themeVars.accent6,

    "--brand-color": themeVars.brand,
    "--brand-color-shade-1": themeVars.brandAccentActive,
    "--brand-contrast-color": "white",

    "--background-color": themeVars.background,
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

    "--container-padding": "30px",
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

    [inputPasscodeBorderRadius]: "12px",
  },
});

globalStyle(
  "hanko-auth::part(container)",
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

/**
 * Buttons and Links
 */
globalStyle("hanko-auth::part(button)", {
  border: "none",
  transition: transitions,
  outlineColor: `transparent`,
  outlineOffset: "0px",
});

globalStyle("hanko-auth::part(link):focus-visible", {
  outline: `unset`,
  textDecoration: "underline",
});

globalStyle("hanko-auth::part(button):focus-visible", {
  outlineOffset: "4px",
  outline: `2px solid ${themeVars.brand}`,
});

globalStyle("hanko-auth::part(button):active", {
  scale: "0.97",
  transition: "scale 0.2s ease",
});

globalStyle("hanko-auth::part(button secondary-button)", {
  border: "none",
});

/**
 * For passcode input and text-input
 */

globalStyle("hanko-auth::part(input)", {
  border: "none",
  backgroundColor: themeVars.formAccent,
  transition: transitions,
  outlineColor: `transparent`,
  outlineOffset: "0px",
});

globalStyle("hanko-auth::part(input text-input)", {
  padding: `0 ${themeTokens.spacing["4"]}`,
});

globalStyle("hanko-auth::part(input passcode-input)", {
  borderRadius: inputPasscodeBorderRadius,
});

globalStyle(
  "hanko-auth::part(input):focus, hanko-auth::part(input):focus-visible",
  {
    outlineOffset: "3px",
    outline: `2px solid ${themeVars.brand}`,
  },
);

globalStyle(
  "hanko-auth::part(input):-webkit-autofill, " +
    "hanko-auth::part(input):-webkit-autofill:hover, " +
    "hanko-auth::part(input):-webkit-autofill:focus",
  {
    boxShadow: `0 0 0 50px ${themeVars.brandSoft} inset`,
  },
);

globalStyle("hanko-auth::part(form-item)", {
  vars: {
    "--button-min-width": "150px",
  },
});
