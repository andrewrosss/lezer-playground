import { ParentComponent } from "solid-js";
import { A } from "solid-start";
import { urls } from "~/lib/urls";

const gridTemplateAreas = `\
"header"
"main"
`;
const gridTemplateColumns = "1fr 1fr";
const gridTemplateRows = "auto 1fr";

export const RootLayout: ParentComponent = (props) => {
  return (
    <main
      class="w-full h-full"
      style={{
        display: "grid",
        "grid-template-areas": gridTemplateAreas,
        "grid-auto-columns": gridTemplateColumns,
        "grid-auto-rows": gridTemplateRows,
      }}
    >
      <Header />

      {props.children}
    </main>
  );
};

const Header = () => {
  return (
    <div
      class="px-4 py-2 border-b border-slate-800"
      style={{ "grid-area": "header" }}
    >
      <A href={urls.home()}>
        <h1 class="uppercase tracking-[0.3em]">Lezer Playground</h1>
      </A>
    </div>
  );
};
