import { globalStyle } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

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
    "--border-radius": "8px",
    "--border-style": "solid",
    "--border-width": "1px",

    "--item-height": "44px",
    "--item-margin": "0.5rem 0",

    "--container-padding": "30px",
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
  },
});

globalStyle("hanko-auth::part(container)", {
  borderRadius: themeTokens.radii.lg,
  backgroundColor: "transparent",
  border: "none",
});

globalStyle("hanko-auth::part(input text-input)", {
  border: "none",
  padding: `0 ${themeTokens.spacing["4"]}`,
  backgroundColor: themeVars.formAccent,
});

globalStyle("hanko-auth::part(button secondary-button)", {
  border: "none",
});

globalStyle(
  "hanko-auth::part(input text-input):-webkit-autofill, " +
    "hanko-auth::part(input text-input):-webkit-autofill:hover, " +
    "hanko-auth::part(input text-input):-webkit-autofill:focus",
  {
    boxShadow: `0 0 0 50px ${themeVars.accent9} inset`,
  },
);
