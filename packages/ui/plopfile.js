import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(root, "src/components");

// Storybook sidebar sections, each a top-level story title. Keep in step with storySort in
// apps/docs/.storybook/preview.ts.
const SECTIONS = ["Buttons", "Forms", "Layout", "Media", "Overlays"];

// Elements that can't take children, so their stories shouldn't pass any.
const VOID_ELEMENTS = new Set(["area", "br", "col", "hr", "img", "input", "meta", "source", "track", "wbr"]);

// Asked by both generators, after the name.
const sharedPrompts = [
  {
    type: "input",
    name: "description",
    message: "One-line description:",
    validate: (value) => value.trim().length > 0 || "A description is required; it becomes the JSDoc.",
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
];

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
      ...sharedPrompts,
      {
        type: "list",
        name: "section",
        message: "Storybook section:",
        choices: SECTIONS,
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

  // A part is one piece of a compound component (CardTitle in Card). It lives in the parent's
  // parts/ folder and has no stories of its own; the parent's stories compose and test it.
  plop.setGenerator("part", {
    description: "Scaffold a part of a compound component in src/components/<Parent>/parts",
    prompts: [
      {
        type: "input",
        name: "parent",
        message: "Parent component (PascalCase):",
        validate: (value) =>
          existsSync(path.join(componentsDir, value)) || `src/components/${value} doesn't exist; generate it first.`,
      },
      {
        type: "input",
        name: "name",
        message: "Part name, including the parent's (e.g. CardTitle):",
        validate: (value, answers) => {
          if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) return "Use PascalCase, e.g. CardTitle.";
          if (!value.startsWith(answers.parent) || value === answers.parent) {
            return `Start the name with the parent's, e.g. ${answers.parent}Title.`;
          }
          if (existsSync(path.join(componentsDir, answers.parent, "parts", `${value}.tsx`))) {
            return `src/components/${answers.parent}/parts/${value}.tsx already exists.`;
          }
          return true;
        },
      },
      ...sharedPrompts,
    ],
    actions: (answers) => {
      const dir = "src/components/{{parent}}/parts";
      const actions = [
        { type: "add", path: `${dir}/{{name}}.tsx`, templateFile: "plop-templates/part/Part.tsx.hbs" },
        { type: "add", path: `${dir}/{{name}}.types.ts`, templateFile: "plop-templates/part/Part.types.ts.hbs" },
      ];

      if (answers?.hasVariants) {
        actions.push({
          type: "add",
          path: `${dir}/{{name}}.variants.ts`,
          templateFile: "plop-templates/part/Part.variants.ts.hbs",
        });
      }

      actions.push({ type: "append", path: "src/index.ts", templateFile: "plop-templates/part/index-exports.hbs" });

      return actions;
    },
  });
}
