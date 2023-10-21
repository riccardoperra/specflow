import {
  createBreakpoints as _createBreakpoints,
  createMediaQuery,
} from "@solid-primitives/media";

export const breakpoints = {
  sm: "640px",
  lg: "1024px",
  xl: "1280px",
};

export const createBreakpoints = () => _createBreakpoints(breakpoints);
