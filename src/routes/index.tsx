import { Editor } from "~/components/editor";
import { ResizableSplitContainer } from "~/components/resizable-split-container";

export default function Home() {
  return (
    <ResizableSplitContainer
      style={{ "grid-area": "main" }}
      splitDirection="horizontal"
      first={<_GrammarContainer />}
      second={
        <ResizableSplitContainer
          splitDirection="vertical"
          first={<_SpecimenContainer />}
          second={<_TreeContainer />}
        />
      }
    />
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
