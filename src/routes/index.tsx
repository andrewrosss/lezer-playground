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
  <section class="w-full h-full flex flex-col items-stretch">
    <h2 class="px-4 py-2 text-sm border-b border-slate-800">Grammar</h2>
    <div class="grow bg-neutral-800" />
  </section>
);

const _SpecimenContainer = () => (
  <section class="w-full h-full flex flex-col items-stretch">
    <h2 class="px-4 py-2 text-sm border-b border-slate-800">Specimen</h2>
    <div class="grow bg-neutral-800" />
  </section>
);

const _TreeContainer = () => (
  <section class="w-full h-full flex flex-col items-stretch">
    <h2 class="px-4 py-2 text-sm border-b border-slate-800">Tree</h2>
    <div class="grow bg-neutral-800" />
  </section>
);
