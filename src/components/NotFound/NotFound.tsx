import { Button } from "@codeui/kit";
import { Link, useNavigate } from "@solidjs/router";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      class={
        "w-full h-full flex flex-col items-center justify-center p-12 gap-8"
      }
    >
      <h3 class={"text-2xl text-center"}>
        The entity you're searching for does not exists.
      </h3>
      <Button
        role={"link"}
        theme={"primary"}
        size={"lg"}
        onClick={() => navigate("/")}
      >
        Return to home
      </Button>
    </div>
  );
}
