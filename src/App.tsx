import { Component, lazy, onMount, Show, Suspense } from "solid-js";
import { RouteDataFuncArgs, useRoutes } from "@solidjs/router";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";
import "./global.css";
import { PlatformState } from "./core/state/platform";
import { LoadingCircleWithBackdrop } from "./icons/LoadingCircle";
import { NotFound } from "./components/NotFound/NotFound";
import { Footer } from "./components/Footer/Footer";
import { getUmami } from "./core/utils/umami";
import { Auth } from "./components/Auth/Auth";

const App: Component = () => {
  document.documentElement.setAttribute("data-cui-theme", "dark");

  const auth = provideState(AuthState);
  const platform = provideState(PlatformState);

  const authGuard = (
    data: RouteDataFuncArgs,
    onLoggedIn: (data: RouteDataFuncArgs) => void,
  ) => (auth.loggedIn() ? onLoggedIn(data) : data.navigate("/login"));

  const Routes = useRoutes([
    {
      path: "/",
      data: ({ navigate }) => {
        getUmami().trackView("/");
        navigate("/projects");
      },
    },
    {
      path: "/projects",
      data: (data) => authGuard(data, () => getUmami().trackView("/projects")),
      component: lazy(() =>
        import("./components/Projects/Projects").then(({ Projects }) => ({
          default: Projects,
        })),
      ),
    },
    {
      path: "/projects/:id/editor",
      data: (data) =>
        authGuard(data, ({ params }) =>
          getUmami().trackView(`/projects/${data.params.id}`),
        ),
      component: lazy(() =>
        import("./components/Projects/ProjectEditor/ProjectEditor").then(
          ({ ProjectEditorRoot }) => ({ default: ProjectEditorRoot }),
        ),
      ),
    },
    {
      path: "/login",
      data: () => getUmami().trackView(`/login`),
      component: Auth,
    },
    {
      path: "/not-found",
      component: NotFound,
    },
    {
      path: "/*",
      data: ({ navigate }) => navigate("/projects"),
    },
  ]);

  return (
    <div class={"h-[100dvh] w-full overflow-hidden flex"}>
      <Suspense fallback={<LoadingCircleWithBackdrop width={32} height={32} />}>
        <Show
          when={auth.get.ready && platform.state === "ready" && !!platform()}
        >
          <Routes />
        </Show>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;
