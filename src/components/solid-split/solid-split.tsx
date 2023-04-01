import {
  ComponentProps,
  children,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
} from "solid-js";
import Split, { Options } from "split.js";

type MaybeGutter = { __isSplitGutter?: boolean };

type Props = ComponentProps<"div"> & {
  options: Options;
  gutter?: (
    index: number,
    direction: "horizontal" | "vertical",
    element?: Element
  ) => HTMLDivElement & MaybeGutter;
  onMounted?: (split: Split.Instance) => void;
  onUpdated?: (split: Split.Instance) => void;
  onCleanup?: (split: Split.Instance) => void;
};

export const SolidSplit = (props: Props) => {
  let parentRef!: HTMLDivElement;
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "options",
    "gutter",
    "onMounted",
    "onUpdated",
    "onCleanup",
  ]);
  const [split, setSplit] = createSignal<ReturnType<typeof Split> | null>(null);
  const c = children(() => local.children);

  createEffect((split: Split.Instance | undefined) => {
    if (split == null) {
      // mount
      const gutter: NonNullable<Props["gutter"]> = (index, direction) => {
        let gutterElement: ReturnType<NonNullable<Props["gutter"]>>;
        if (local.gutter != null) {
          gutterElement = local.gutter(index, direction);
        } else {
          gutterElement = document.createElement("div");
          gutterElement.className = `gutter gutter-${direction}`;
        }
        gutterElement.__isSplitGutter = true;
        return gutterElement;
      };

      const _children = c
        .toArray()
        .filter((child): child is HTMLElement => child instanceof HTMLElement);
      const split = Split(_children, { ...local.options, gutter });

      if (typeof local.onMounted === "function") local.onMounted(split);

      setSplit(split);

      return split;
    } else {
      // update
      split.destroy(true, true);

      const _children = c
        .toArray()
        .filter((child): child is HTMLElement => child instanceof HTMLElement)
        .map((child) => child as HTMLElement & MaybeGutter)
        .filter((child) => !child.__isSplitGutter);
      // apparently, when updating we can assume the previous sibling is a gutter
      const gutter: NonNullable<Props["gutter"]> = (_i, _d, pair) =>
        pair?.previousSibling as HTMLDivElement;
      split = Split(_children, { ...local.options, gutter });

      setSplit(split);

      if (typeof local.onUpdated === "function") local.onUpdated(split);

      return split;
    }
  });

  onCleanup(() => {
    if (split() == null) return;
    split()!.destroy(); // we just checked that it's not null
    if (typeof local.onCleanup === "function") local.onCleanup(split()!);
  });

  return (
    <div
      ref={parentRef}
      class="flex"
      classList={{
        [local.class ?? ""]: local.class != null,
        ["flex-col"]: local.options.direction === "vertical",
        ["flex-row"]: local.options.direction === "horizontal",
      }}
      {...rest}
    >
      {c()}
    </div>
  );
};
