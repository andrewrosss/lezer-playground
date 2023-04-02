import { ParentComponent } from "solid-js";
import { StateProvider } from "statebuilder";

export const Providers: ParentComponent = (props) => {
  return (
    <StateProvider>
      <>{props.children}</>
    </StateProvider>
  );
};
