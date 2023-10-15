import { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";
import "./global.css";
import { Projects } from "./components/Projects/Projects";
import { ProjectPage } from "./components/Projects/ProjectPage";
import { ProjectEditor } from "./components/Projects/ProjectEditor/ProjectEditor";
import { Profile } from "./components/Profile";

const App: Component = () => {
  document.documentElement.setAttribute("data-cui-theme", "dark");

  const Routes = useRoutes([
    {
      path: "/",
      data: ({ navigate }) => navigate("/projects"),
    },
    {
      path: "/projects",
      component: Projects,
    },
    {
      path: "/projects/:id/editor",
      component: ProjectEditor,
    },
    {
      path: "/projects/:id",
      component: ProjectPage,
    },
    {
      path: "/login",
      component: Auth,
    },
    {
      path: "/profile",
      component: Profile,
    },
  ]);

  void provideState(AuthState);

  return (
    <div class={"h-[100dvh] w-full overflow-hidden flex"}>
      <Routes />
    </div>
  );
};

export default App;
