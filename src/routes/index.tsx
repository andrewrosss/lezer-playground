import { GrammarEditor } from "~/components/grammar-editor";
import { SolidSplit } from "~/components/solid-split";
import { SpecimenEditor } from "~/components/specimen-editor";
import { TreeEditor } from "~/components/tree-editor";

export default function Home() {
  return (
    <SolidSplit
      style={{ "grid-area": "main" }}
      options={{ direction: "horizontal", gutterSize: 8, minSize: 100 }}
      gutter={gutterFn}
    >
      <GrammarEditor />
      <SolidSplit
        options={{ direction: "vertical", gutterSize: 8, minSize: 100 }}
        gutter={gutterFn}
      >
        <SpecimenEditor />
        <TreeEditor />
      </SolidSplit>
    </SolidSplit>
  );
}

const gutterFn = (_: number, direction: "horizontal" | "vertical") =>
  (direction === "vertical" ? (
    <div class="flex items-center justify-center gap-2 bg-slate-700">
      <span class="w-1 h-1 rounded-full bg-slate-300" />
      <span class="w-1 h-1 rounded-full bg-slate-300" />
      <span class="w-1 h-1 rounded-full bg-slate-300" />
    </div>
  ) : (
    <div class="flex flex-col items-center justify-center gap-2 bg-slate-700">
      <span class="w-1 h-1 rounded-full bg-slate-300" />
      <span class="w-1 h-1 rounded-full bg-slate-300" />
      <span class="w-1 h-1 rounded-full bg-slate-300" />
    </div>
  )) as HTMLDivElement;
