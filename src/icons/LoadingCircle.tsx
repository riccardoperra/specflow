import { JSX } from "solid-js";

export function LoadingCircle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class={`animate-spin -ml-1 mr-3 text-white ${props.class}`}
      {...props}
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function LoadingCircleWithBackdrop(props: JSX.IntrinsicElements["svg"]) {
  return (
    <div
      class={
        "absolute left-0 top-0 flex items-center justify-center w-full h-full bg-neutral-900/70 z-50"
      }
    >
      <LoadingCircle {...props} />
    </div>
  );
}
