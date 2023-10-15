import { globalStyle } from "@vanilla-extract/css";

globalStyle("html", {
  backgroundColor: "#111",
  color: "#fff",
});

globalStyle("button[data-cui=button]", {
  verticalAlign: "text-bottom",
  lineHeight: 1,
});
