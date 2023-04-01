import { Editor } from "~/components/editor";
import { SolidSplit } from "~/components/solid-split";

export default function Home() {
  return (
    <SolidSplit
      style={{ "grid-area": "main" }}
      options={{ direction: "horizontal", gutterSize: 8, minSize: 100 }}
      gutter={gutterFn}
    >
      <_GrammarContainer />
      <SolidSplit
        options={{ direction: "vertical", gutterSize: 8, minSize: 100 }}
        gutter={gutterFn}
      >
        <_SpecimenContainer />
        <_TreeContainer />
      </SolidSplit>
    </SolidSplit>
  );
}

const _GrammarContainer = () => (
  <section
    class="w-full h-full grid"
    style={{ "grid-template-rows": "auto 1fr" }}
  >
    <h2 class="px-4 py-2 text-sm border-b border-slate-700">Grammar</h2>

    {/* the classes: 'flex-auto overflow-y-auto h-24' are inspired by this
        answer (https://stackoverflow.com/a/14964944) to make the element
        grow and scroll when it's bigger */}
    <div class="overflow-auto flex flex-col">
      <Editor class="flex-auto overflow-y-auto h-24 text-sm" />
    </div>
  </section>
);

const _SpecimenContainer = () => (
  <section
    class="w-full h-full grid"
    style={{ "grid-template-rows": "auto 1fr" }}
  >
    <h2 class="px-4 py-2 text-sm border-b border-slate-700">Specimen</h2>

    <div class="overflow-auto flex flex-col">
      <Editor class="flex-auto overflow-y-auto h-24 text-sm" />
    </div>
  </section>
);

const _TreeContainer = () => (
  <section
    class="w-full h-full grid"
    style={{ "grid-template-rows": "auto 1fr" }}
  >
    <h2 class="px-4 py-2 text-sm border-b border-slate-700">Tree</h2>

    <div class="overflow-auto flex flex-col">
      <Editor class="flex-auto overflow-y-auto h-24 text-sm" />
    </div>
  </section>
);

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
