import { Component, lazy, Show, Suspense } from "solid-js";
import { RouteDataFuncArgs, useRoutes } from "@solidjs/router";
import { Auth } from "./components/Auth/Auth";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";
import "./global.css";
import { Projects } from "./components/Projects/Projects";
import { PlatformState } from "./core/state/platform";
import { LoadingCircleWithBackdrop } from "./icons/LoadingCircle";
import { ContainerState } from "./core/+container";

const App: Component = () => {
  document.documentElement.setAttribute("data-cui-theme", "dark");

  const auth = provideState(AuthState);
  const platform = ContainerState.get(PlatformState);

  const authGuard = ({ navigate }: RouteDataFuncArgs) =>
    auth.loggedIn() ? void 0 : navigate("/login");

  const Routes = useRoutes([
    {
      path: "/",
      data: ({ navigate }) => navigate("/projects"),
    },
    {
      path: "/projects",
      component: lazy(() =>
        import("./components/Projects/Projects").then(({ Projects }) => ({
          default: Projects,
        })),
      ),
      data: authGuard,
    },
    {
      path: "/projects/:id/editor",
      component: lazy(() =>
        import("./components/Projects/ProjectEditor/ProjectEditor").then(
          ({ ProjectEditor }) => ({ default: ProjectEditor }),
        ),
      ),
      data: authGuard,
    },
    {
      path: "/login",
      component: Auth,
      data: authGuard,
    },
  ]);

  return (
    <div class={"h-[100dvh] w-full overflow-hidden flex"}>
      <Suspense fallback={<LoadingCircleWithBackdrop width={32} height={32} />}>
        {/* TODO: cannot use Suspense in this case since ContainerState is in root context. */}
        <Show
          when={auth.get.ready && platform.state === "ready" && !!platform()}
        >
          <Routes />
        </Show>
      </Suspense>
    </div>
  );
};

export default App;
