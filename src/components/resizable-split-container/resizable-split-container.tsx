import { ComponentProps, JSX, createSignal, splitProps } from "solid-js";

import { createPointerPosition } from "@solid-primitives/pointer";

type Props = ComponentProps<"div"> & {
  splitDirection: "vertical" | "horizontal";
  first: JSX.Element;
  second: JSX.Element;
};

export const ResizableSplitContainer = (props: Props) => {
  let containerRef: HTMLDivElement;
  let firstRef: HTMLDivElement;
  let secondRef: HTMLDivElement;
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
      if (local.splitDirection === "vertical") {
        // minimum height of 200px for each panel when veritcal
        if (pos().y < 200) return;
        if (pos().y > window.innerHeight - 200) return;

        const rect = containerRef.getBoundingClientRect();
        console.log(rect);
        // determine percent of container above the mouse
        const percent = (pos().y - rect.top) / rect.height;
        // set the flex-basis of the first panel to that percent
        const basis = `calc(${percent * 100}% - 0.5rem)`; // 0.5rem for the divider
        firstRef.style.setProperty("flex-basis", basis);
        // set the flex-basis of the second panel to the remaining percent
        const secondBasis = `calc(${(1 - percent) * 100}% - 0.5rem)`; // 0.5rem for the divider
        secondRef.style.setProperty("flex-basis", secondBasis);
      } else {
        // minimum width of 300px for each panel when horizontal
        if (pos().x < 300) return;
        if (pos().x > window.innerWidth - 300) return;

        const rect = containerRef.getBoundingClientRect();
        // determine percent of container to the left of the mouse
        const percent = (pos().x - rect.left) / rect.width;
        // set the flex-basis of the first panel to that percent
        const basis = `calc(${percent * 100}% - 0.5rem)`; // 0.5rem for the divider
        firstRef.style.setProperty("flex-basis", basis);
        // set the flex-basis of the second panel to the remaining percent
        const secondBasis = `calc(${(1 - percent) * 100}% - 0.5rem)`; // 0.5rem for the divider
        secondRef.style.setProperty("flex-basis", secondBasis);
      }
    }
  };

  return (
    <div
      // @ts-ignore
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
      {/* @ts-ignore */}
      <div ref={firstRef} class="grow shrink-0 basis-[calc(50%-0.5rem)]">
        {local.first}
      </div>

      <div
        class="grow-0 shrink-0 flex justify-center  border-slate-800 hover:bg-slate-700/75"
        classList={{
          "flex-row cursor-row-resize border-y-2":
            local.splitDirection === "vertical",
          "flex-col cursor-col-resize border-x-2":
            local.splitDirection === "horizontal",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span
          class="w-1 h-1 rounded-full bg-slate-300"
          classList={{
            "my-0.5 mx-1": local.splitDirection === "vertical",
            "my-1 mx-0.5": local.splitDirection === "horizontal",
          }}
        ></span>
        <span
          class="w-1 h-1 rounded-full bg-slate-300"
          classList={{
            "my-0.5 mx-1": local.splitDirection === "vertical",
            "my-1 mx-0.5": local.splitDirection === "horizontal",
          }}
        ></span>
        <span
          class="w-1 h-1 rounded-full bg-slate-300"
          classList={{
            "my-0.5 mx-1": local.splitDirection === "vertical",
            "my-1 mx-0.5": local.splitDirection === "horizontal",
          }}
        ></span>
      </div>

      {/* @ts-ignore */}
      <div ref={secondRef} class="grow shrink-0 basis-[calc(50%-0.5rem)]">
        {local.second}
      </div>
    </div>
  );
};
