import { Tabs } from "@kobalte/core";
import * as styles from "./SegmentedControl.css";
import { splitProps } from "solid-js";

interface SegmentedControlItemProps<T = string>
  extends Omit<Tabs.TabsTriggerProps, "value"> {
  value: T;
}

export function SegmentedControlItem<T>(props: SegmentedControlItemProps<T>) {
  // TODO: merge classes
  const [local, others] = splitProps(props, ["class"]);
  return (
    // @ts-ignore
    <Tabs.Trigger
      class={[styles.segment, local.class].filter(Boolean).join(" ")}
      {...others}
    />
  );
}

type TypedTabsRootProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

type SegmentedControlProps<T = string> = Omit<
  Tabs.TabsRootProps,
  "orientation" | "value" | "defaultValue" | "onChange"
> &
  TypedTabsRootProps<T>;

export function SegmentedControl(props: SegmentedControlProps) {
  return (
    <Tabs.Root
      activationMode={"manual"}
      class={styles.wrapper}
      {...props}
      orientation={"horizontal"}
    >
      <Tabs.List class={styles.list}>
        {props.children}
        <Tabs.Indicator class={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
}
