import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (plop) {
  plop.setGenerator("feature", {
    description: "Create a full feature module",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Feature name (e.g. users):",
      },
      {
        type: "input",
        name: "icon",
        message: "Lucide icon name (e.g. Users, Settings, BarChart3):",
      },
    ],
    actions: [
      {
        type: "addMany",
        base: "plop-templates/feature",
        templateFiles: "plop-templates/feature/**/*",
        destination: "src/features/{{dashCase name}}",
      },
      {
        type: "modify",
        path: "src/routes/routes.ts",
        pattern: /(^)/,
        template:
          "import { {{camelCase name}}Route } from '../features/{{dashCase name}}/route/{{dashCase name}}.route';\n",
      },
      {
        type: "modify",
        path: "src/routes/routes.ts",
        pattern: /(export const routes = \[)/,
        template: "$1\n  {{camelCase name}}Route,",
      },
    ],
  });
}
