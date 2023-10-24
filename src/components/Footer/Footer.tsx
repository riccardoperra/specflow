import { Link } from "@codeui/kit";
import { For, Match, Switch } from "solid-js";

const items = [
  {
    name: "GitHub",
    href: "https://github.com/riccardoperra/specflow",
    type: "link",
  },
  {
    name: "Made with Hanko",
    href: "https://hanko.io",
    type: "link",
  },
];

export function Footer() {
  return (
    <div class={"fixed bottom-0 right-0 z-50"}>
      <div class={"flex px-2 py-1 text-sm gap-4 text-blue-400"}>
        <For each={items}>
          {(item) => (
            <Switch>
              <Match when={item.type === "link"}>
                <Link variant={"underline"} target="_blank" href={item.href}>
                  {item.name}
                </Link>
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  );
}
