import { Component, Show } from "solid-js";
import { RouteDataFunc, RouteDataFuncArgs, useRoutes } from "@solidjs/router";
import { Auth } from "./components/Auth/Auth";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";
import "./global.css";
import { Projects } from "./components/Projects/Projects";
import { ProjectPage } from "./components/Projects/ProjectPage";
import { ProjectEditor } from "./components/Projects/ProjectEditor/ProjectEditor";
import { Profile } from "./components/Profile";

const App: Component = () => {
  document.documentElement.setAttribute("data-cui-theme", "dark");

  const auth = provideState(AuthState);

  const authGuard = ({ navigate }: RouteDataFuncArgs) =>
    auth.loggedIn() ? void 0 : navigate("/login");

  const Routes = useRoutes([
    {
      path: "/",
      data: ({ navigate }) => navigate("/projects"),
    },
    {
      path: "/projects",
      component: Projects,
      data: authGuard,
    },
    {
      path: "/projects/:id/editor",
      component: ProjectEditor,
      data: authGuard,
    },
    {
      path: "/projects/:id",
      component: ProjectPage,
      data: authGuard,
    },
    {
      path: "/login",
      component: Auth,
      data: authGuard,
    },
    {
      path: "/profile",
      component: Profile,
      data: authGuard,
    },
  ]);

  return (
    <div class={"h-[100dvh] w-full overflow-hidden flex"}>
      <Show when={auth.ready()}>
        <Routes />
      </Show>
    </div>
  );
};

export default App;
