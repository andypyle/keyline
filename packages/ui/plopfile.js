import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(root, "src/components");

// Elements that can't take children, so their stories shouldn't pass any.
const VOID_ELEMENTS = new Set(["area", "br", "col", "hr", "img", "input", "meta", "source", "track", "wbr"]);

/** @param {import("plop").NodePlopAPI} plop */
export default function (plop) {
  plop.setHelper("isVoid", (element) => VOID_ELEMENTS.has(element));

  plop.setGenerator("component", {
    description: "Scaffold a component in src/components",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (PascalCase):",
        validate: (value) => {
          if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) return "Use PascalCase, e.g. Button or IconButton.";
          if (existsSync(path.join(componentsDir, value))) return `src/components/${value} already exists.`;
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "One-line description:",
        validate: (value) => value.trim().length > 0 || "A description is required; it becomes the component's JSDoc.",
      },
      {
        type: "input",
        name: "element",
        message: "Root HTML element:",
        default: "div",
        validate: (value) => /^[a-z][a-z0-9]*$/.test(value) || "Use a lowercase HTML tag, e.g. button or span.",
      },
      {
        type: "confirm",
        name: "hasVariants",
        message: "Does it have CVA variants?",
        default: true,
      },
    ],
    actions: (answers) => {
      const dir = "src/components/{{name}}";
      const actions = [
        { type: "add", path: `${dir}/{{name}}.tsx`, templateFile: "plop-templates/component/Component.tsx.hbs" },
        { type: "add", path: `${dir}/{{name}}.types.ts`, templateFile: "plop-templates/component/Component.types.ts.hbs" },
        {
          type: "add",
          path: `${dir}/{{name}}.stories.tsx`,
          templateFile: "plop-templates/component/Component.stories.tsx.hbs",
        },
      ];

      if (answers?.hasVariants) {
        actions.push({
          type: "add",
          path: `${dir}/{{name}}.variants.ts`,
          templateFile: "plop-templates/component/Component.variants.ts.hbs",
        });
      }

      actions.push({
        type: "append",
        path: "src/index.ts",
        templateFile: "plop-templates/component/index-exports.hbs",
      });

      return actions;
    },
  });
}
