import { AuthState } from "../../core/state/auth";
import * as styles from "./UserBadge.css";
import { provideState } from "statebuilder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@codeui/kit";
import { As } from "@kobalte/core";
import { UserCircle } from "../../icons/UserCircle";

export function CurrentUserBadge() {
  const auth = provideState(AuthState);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={"div"} class={styles.badge}>
          <UserCircle class={"w-5 h-5"} />
          <span class={"hidden sm:block"}>{auth.get.user?.email}</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => auth.goToProfile()}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => auth.logout()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
