import { cookieStorage as storage } from "@solid-primitives/storage";
import { createRoot } from "solid-js";

export const cookieStorage = createRoot(() => storage);
