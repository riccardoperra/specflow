import { createVar, style } from "@vanilla-extract/css";

export const container = style({});

export const gradientBg = style({
  position: "absolute",
});

export const inner = style({
  position: "relative",
  maxWidth: "960px",
  width: "100%",
  padding: "20px",
  display: "grid",
  gridTemplateColumns: "360px auto",
  gap: "20px",
  justifyItems: "center",
  background: "rgba(11,11,11,0.8)",
  boxShadow: "rgba(255, 255, 255, 0.3) 0px 0px 0px 0.5px inset",
  backdropFilter: "blur(40px)",
  borderRadius: "20px",
  opacity: "1",
  animation:
    "1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s 1 normal forwards running jkLqKc",
  height: "600px",
});

export const backdrop = style({
  display: "flex",
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(10px) saturate(100%)",
  WebkitBoxPack: "center",
  justifyContent: "center",
  WebkitBoxAlign: "center",
  alignItems: "center",
  zIndex: "10",
  padding: "0px 20px",
  animation: "1s ease 0s 1 normal forwards running bDTdTe",
});
