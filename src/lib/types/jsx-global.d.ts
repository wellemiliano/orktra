import type * as React from "react";

declare global {
  namespace JSX {
    type Element = React.ReactElement<unknown>;
    type ElementClass = React.Component<unknown>;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

export {};
