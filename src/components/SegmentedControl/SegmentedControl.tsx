import { Tabs } from "@kobalte/core";
import * as styles from "./SegmentedControl.css";
import { splitProps } from "solid-js";

interface SegmentedControlItemProps extends Tabs.TabsTriggerProps {
  value: string;
}

export function SegmentedControlItem(props: SegmentedControlItemProps) {
  // TODO: merge classes
  const [local, others] = splitProps(props, ["class"]);
  return (
    <Tabs.Trigger
      class={[styles.segment, local.class].filter(Boolean).join(" ")}
      {...others}
    />
  );
}

type SegmentedControlProps = Omit<Tabs.TabsRootProps, "orientation">;

export function SegmentedControl(props: SegmentedControlProps) {
  return (
    <Tabs.Root class={styles.wrapper} {...props} orientation={"horizontal"}>
      <Tabs.List class={styles.list}>
        {props.children}
        <Tabs.Indicator class={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
}
