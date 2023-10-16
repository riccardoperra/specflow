import { Component, Show } from "solid-js";
import { RouteDataFuncArgs, useRoutes } from "@solidjs/router";
import { Auth } from "./components/Auth/Auth";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";
import "./global.css";
import { Projects } from "./components/Projects/Projects";
import { ProjectEditor } from "./components/Projects/ProjectEditor/ProjectEditor";
import { ProfileDialog } from "./components/Profile/ProfileDialog";

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
      path: "/login",
      component: Auth,
      data: authGuard,
    },
  ]);

  return (
    <div class={"h-[100dvh] w-full overflow-hidden flex"}>
      <Show when={auth.get.ready}>
        <Routes />
      </Show>
    </div>
  );
};

export default App;
