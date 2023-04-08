import {
  ComponentProps,
  For,
  Show,
  createSignal,
  onMount,
  splitProps,
} from "solid-js";
import { getAppStore } from "~/lib/state";

type Tree = { name: string; from: number; to: number; children: Tree[] };

export const TreeViewer = (props: ComponentProps<"div">) => {
  const { state, actions } = getAppStore();

  const tree = () => {
    const parseTree = state.parser.tree;
    if (parseTree == null) return null;
    const stack = [] as Tree[];
    let root = null as Tree | null;
    parseTree.iterate({
      enter: (node) => {
        const { name, from, to } = node;
        const tree = { name, from, to, children: [] as Tree[] };
        if (stack.length > 0) stack[stack.length - 1].children.push(tree);
        else root = tree;
        stack.push(tree);
      },
      leave: () => stack.pop(),
    });
    return root;
  };

  onMount(() => actions.rebuildTree());

  return (
    <section
      class="w-full h-full grid"
      style={{ "grid-template-rows": "auto 1fr" }}
    >
      <h2 class="px-4 py-2 text-sm border-b border-slate-700">Tree</h2>

      {/* the classes: 'flex-auto overflow-y-auto h-24' are inspired by this
          answer (https://stackoverflow.com/a/14964944) to make the element
          grow and scroll when it's bigger */}
      <div class="px-2 overflow-x-auto" {...props}>
        <Show when={tree() != null}>
          <TreeAccordion tree={tree()} />
        </Show>
      </div>
    </section>
  );
};

const TreeAccordion = (
  props: ComponentProps<"div"> & { tree: Tree | null }
) => {
  const [local, rest] = splitProps(props, ["tree"]);
  const [open, setOpen] = createSignal(false);

  return (
    <Show when={local.tree != null}>
      <div class="flex flex-col items-stretch" {...rest}>
        <h3>
          <button
            class="flex items-center justify-between w-full py-1 text-sm font-medium text-left text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75"
            onClick={() => setOpen((prev) => !prev)}
          >
            {local.tree!.name}
          </button>
        </h3>
        <div
          class="pl-2 border-l border-l-slate-700"
          classList={{
            "h-0 hidden": !open(),
            "h-auto": open(),
          }}
        >
          <For each={local.tree!.children}>
            {(child) => <TreeAccordion tree={child} />}
          </For>
        </div>
      </div>
    </Show>
  );
};
