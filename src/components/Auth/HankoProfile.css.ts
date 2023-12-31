import { style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

import { hankoComponent } from "./hanko-base.css";

export const hankoProfile = style([
  hankoComponent,
  {
    vars: {
      "--color": themeVars.foreground,
      "--color-shade-1": themeVars.accent9,
      "--color-shade-2": themeVars.accent6,

      "--brand-color": themeVars.brand,
      "--brand-color-shade-1": themeVars.brandAccentActive,
      "--brand-contrast-color": "white",

      "--background-color": themeVars.accent4,

      "--container-padding": "0",

      "--paragraph-inner-color": themeVars.accent10,
      "--paragraph-heading-color": themeVars.foreground,
      "--accordion-container-bg": themeVars.accent4,
    },
    width: "100%",
    ":focus-visible": {
      outline: "none",
    },
  },
  {
    selectors: {
      "&::part(container)": {
        borderRadius: themeTokens.radii.lg,
        backgroundColor: "transparent",
        border: "none",
        maxWidth: "100%",
        width: "100%",
      },
      "&::part(headline1)": {
        fontSize: themeTokens.fontSize.xl,
      },
      "&::part(paragraph)": {
        marginBottom: themeTokens.spacing["6"],
      },
      "&::part(input)": {
        vars: {
          "--item-height": "42px",
        },
      },
      "&::part(button)": {
        vars: {
          "--item-height": "42px",
        },
      },
    },
  },
]);
