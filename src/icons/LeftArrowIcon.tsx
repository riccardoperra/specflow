import { SvgIcon } from "@codeui/kit";
import type { SvgIconProps } from "@codeui/kit/dist/types/icons/SvgIcon";

export function LeftArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
      />
    </SvgIcon>
  );
}
