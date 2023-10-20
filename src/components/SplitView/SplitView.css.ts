import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { themeTokens, themeVars } from "@codeui/kit";

export const splitView = recipe({
  base: {
    overflow: "hidden",
    height: "100%",
  },
  variants: {
    mode: {
      both: {
        display: "grid",
        gridTemplateColumns: "1fr 10px 1fr",
      },
      single: {
        width: "100%",
      },
    },
  },
});

export const gutterCol = style({
  gridRow: "1/-1",
  cursor: "col-resize",
  backgroundColor: themeVars.accent6,
  backgroundImage:
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50%",
});

export const gutterCol1 = style({
  gridColumn: 2,
});
