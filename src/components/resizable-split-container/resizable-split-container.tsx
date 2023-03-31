import { ComponentProps, JSX, createSignal, splitProps } from "solid-js";

import { createPointerPosition } from "@solid-primitives/pointer";

type Props = ComponentProps<"div"> & {
  splitDirection: "vertical" | "horizontal";
  first: JSX.Element;
  second: JSX.Element;
};

export const ResizableSplitContainer = (props: Props) => {
  let containerRef!: HTMLDivElement;
  let firstRef!: HTMLDivElement;
  let secondRef!: HTMLDivElement;
  const [local, rest] = splitProps(props, [
    "splitDirection",
    "first",
    "second",
    "class",
  ]);

  const pos = createPointerPosition({ target: () => containerRef });
  const [isPressed, setIsPressed] = createSignal(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseMove = () => {
    if (isPressed()) {
      const rect = containerRef.getBoundingClientRect();
      // determine percent of container above (vertical) or
      // to the left (horizontal) of the mouse
      const percent =
        local.splitDirection === "vertical"
          ? (pos().y - rect.top) / rect.height
          : (pos().x - rect.left) / rect.width;
      // set the flex-basis of the first panel to that percent
      const basis = `calc(${percent * 100}% - 3px)`; // 3px for the divider
      firstRef.style.setProperty("flex-basis", basis);
      // set the flex-basis of the second panel to the remaining percent
      const secondBasis = `calc(${(1 - percent) * 100}% - 3px)`; // 3px for the divider
      secondRef.style.setProperty("flex-basis", secondBasis);
    }
  };

  return (
    <div
      ref={containerRef}
      class="w-full h-full flex items-stretch"
      classList={{
        [local.class ?? ""]: true,
        "flex-col": local.splitDirection === "vertical",
        "flex-row": local.splitDirection === "horizontal",
      }}
      {...rest}
      onMouseMove={handleMouseMove}
    >
      <div ref={firstRef} class="grow shrink-0 basis-[calc(50%-3px)]">
        {local.first}
      </div>

      <div
        class="grow-0 shrink-0 flex justify-center  bg-slate-700"
        classList={{
          "cursor-row-resize h-[6px]": local.splitDirection === "vertical",
          "cursor-col-resize w-[6px]": local.splitDirection === "horizontal",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

      <div ref={secondRef} class="grow shrink-0 basis-[calc(50%-3px)]">
        {local.second}
      </div>
    </div>
  );
};
