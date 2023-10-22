/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Router } from "@solidjs/router";
import { StateProvider } from "statebuilder";
import { Suspense } from "solid-js";

const root = document.getElementById("root");

const isDev = import.meta.env.DEV;
const enableAuthMock = import.meta.env.VITE_ENABLE_AUTH_MOCK;

if (isDev && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

if (isDev && enableAuthMock) {
  Promise.all([import("msw/browser"), import("./mocks/handler")])
    .then(([{ setupWorker }, { handlers }]) => {
      const worker = setupWorker(...handlers);
      if (import.meta.hot) {
        import.meta.hot.accept(() => {
          worker.resetHandlers(...handlers);
        });
      }
      return worker.start();
    })
    .then(() => bootstrapApplication());
} else {
  bootstrapApplication();
}

export function bootstrapApplication() {
  return render(() => {
    return (
      <Router>
        <StateProvider>
          <Suspense>
            <App />
          </Suspense>
        </StateProvider>
      </Router>
    );
  }, root!);
}
