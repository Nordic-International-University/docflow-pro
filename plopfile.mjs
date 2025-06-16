import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (plop) {
    plop.setGenerator('feature', {
        description: 'Create a full feature module',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Feature name (e.g. users):',
            },
        ],
        actions: [
            {
                type: 'addMany',
                base: 'plop-templates/feature',
                templateFiles: "plop-templates/feature/*/*.hbs",
                destination: 'src/features/{{dashCase name}}',
            },
        ],
    });
}
//test11
//2222222
//3453453
