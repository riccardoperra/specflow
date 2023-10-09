import { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";
import { provideState } from "statebuilder";
import { AuthState } from "./core/state/auth";

const App: Component = () => {
  const Routes = useRoutes([
    {
      path: "/",
      component: Home,
    },
    {
      path: "/login",
      component: Auth,
    },
  ]);

  void provideState(AuthState);

  return <Routes />;
};

export default App;
