import { createTheme, style } from "@vanilla-extract/css";
import { responsiveStyle, themeTokens } from "@codeui/kit";
import { hankoComponent, hankoVars } from "./hanko-base.css";

export const [hankoAuthTheme, hankoAuthThemeVars] = createTheme({
  containerPaddingXs: "0px",
  containerPadding: hankoVars.containerPadding,
});

export const hankoAuth = style([
  hankoComponent,
  hankoAuthTheme,
  {
    vars: {
      "--container-padding": hankoAuthThemeVars.containerPadding,
    },
    selectors: {
      "&::part(headline1)": responsiveStyle({
        xs: {
          textAlign: "center",
        },
        lg: {
          textAlign: "left",
        },
      }),
      "&::part(paragraph)": responsiveStyle({
        xs: {
          textAlign: "center",
        },
        lg: {
          textAlign: "left",
        },
      }),
      "&::part(form-item)": {
        minWidth: "100%",
      },
      "&::part(input)": {
        minWidth: "100%",
        // backgroundColor: "rgba(10, 10, 10, .75)",
      },
      "&::part(input passcode-input)": {
        minWidth: "100%",
      },
      "&::part(container)": responsiveStyle({
        xs: {
          vars: {
            "--container-padding": hankoAuthThemeVars.containerPaddingXs,
          },
          border: "none",
          borderRadius: themeTokens.radii.lg,
          backgroundColor: "transparent",
        },
        sm: {
          vars: {
            "--container-padding": hankoAuthThemeVars.containerPadding,
          },
        },
      }),
    },
  },
]);
