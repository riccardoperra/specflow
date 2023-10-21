type Color = "success" | "info" | "error" | "warning";

const colors: Record<Color, string> = {
  success: "#34d537",
  info: "#0099ff",
  error: "#da4d4d",
  warning: "#e88632",
};

const createLog = (color: Color) => {
  return (...args: any[]) => {
    const [arg0, ...others] = args;
    console.info(`%c${arg0}`, `color:${colors[color]}`, ...others);
  };
};

export const logger = {
  info: createLog("info"),
  success: createLog("success"),
  error: createLog("error"),
  warn: createLog("warning"),
};
