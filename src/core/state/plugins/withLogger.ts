import { makePlugin } from "statebuilder";

type Color = "success" | "info" | "error" | "warning";

const colors: Record<Color, string> = {
  success: "#34d537",
  info: "#0099ff",
  error: "#da4d4d",
  warning: "#e88632",
};

const createLog = (prefix: string, color: Color) => {
  return (...args: any[]) => {
    const [arg0, ...others] = args;
    console.info(`%c[${prefix}] ${arg0}`, `color:${colors[color]}`, ...others);
  };
};

export const logger = (prefix: string) => ({
  info: createLog(prefix, "info"),
  success: createLog(prefix, "success"),
  error: createLog(prefix, "error"),
  warn: createLog(prefix, "warning"),
});

export const withLogger = (config: { name: string }) =>
  makePlugin(
    (_) => ({
      logger: logger(config.name),
    }),
    { name: "withLogger" },
  );
