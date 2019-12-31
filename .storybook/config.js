import { configure, addParameters } from "@storybook/react";
import { themes } from "@storybook/theming";

addParameters({
  options: {
    // theme: themes.dark,
  },
});

// automatically import all files ending in *.stories.tsx
configure(require.context("../stories", true, /\.stories\.tsx?$/), module);
