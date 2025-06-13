// // generate-feature.js – v2 (fixed nested template literals, improved typing)
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// /* -------------------------------------------------------------------------- */
// /*                                   utils                                    */
// /* -------------------------------------------------------------------------- */
// const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
// const kebabToCamel = (str) => str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
//
// /* -------------------------------------------------------------------------- */
// /*                               loadConfig                                   */
// /* -------------------------------------------------------------------------- */
// function loadConfig() {
//     const configPath = path.join(process.cwd(), 'feature-generator.config.json');
//     const defaultConfig = {
//         srcDir: 'src',
//         featuresDir: 'src/features',
//         axiosImportPath: '@/lib/axios',
//         axiosInstanceName: 'axiosInstance',
//         rootStorePath: 'src/store/index.ts',
//         autoRegisterReducer: true,
//         featureStructure: {
//             directories: ['components', 'hooks', 'services', 'types', 'store'],
//             generateFiles: {
//                 component: true,
//                 hook: true,
//                 service: true,
//                 types: true,
//                 slice: true,
//                 export: true,
//             },
//         },
//     };
//
//     if (fs.existsSync(configPath)) {
//         try {
//             const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
//             return { ...defaultConfig, ...userConfig };
//         } catch {
//             return defaultConfig; // corrupted JSON – fall back to defaults
//         }
//     }
//     // create config on first run
//     fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
//     return defaultConfig;
// }
//
// /* -------------------------------------------------------------------------- */
// /*                                 templates                                  */
// /* -------------------------------------------------------------------------- */
// const generateComponent = (name) => {
//     const Comp = capitalizeFirstLetter(kebabToCamel(name));
//     return `export default function ${Comp}Component() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">${Comp}</h1>
//     </div>
//   );
// }
// `;
// };
//
// const generateTypes = (name) => {
//     const Type = capitalizeFirstLetter(kebabToCamel(name));
//     return `export interface ${Type}State {
//   id: string;
//   name: string;
//   createdAt?: string;
//   updatedAt?: string;
// }
//
// export interface ${Type}FormValues {
//   name: string;
// }
//
// export interface ${Type}QueryParams {
//   page?: number;
//   limit?: number;
//   search?: string;
// }
// `;
// };
//
// const generateService = (name, cfg) => {
//     const Type = capitalizeFirstLetter(kebabToCamel(name));
//     return `import type { ${Type}State, ${Type}FormValues, ${Type}QueryParams } from '../types/${name}.types';
// import { ${cfg.axiosInstanceName} } from '${cfg.axiosImportPath}';
//
// export const ${name}Service = {
//   get${Type}: async (params: ${Type}QueryParams = {}): Promise<${Type}State[]> => {
//     const { data } = await ${cfg.axiosInstanceName}.get('/${name}', { params });
//     return data;
//   },
//   get${Type}ById: async (id: string): Promise<${Type}State> => {
//     const { data } = await ${cfg.axiosInstanceName}.get('/${name}/' + id);
//     return data;
//   },
//   create${Type}: async (payload: ${Type}FormValues): Promise<${Type}State> => {
//     const { data } = await ${cfg.axiosInstanceName}.post('/${name}', payload);
//     return data;
//   },
//   update${Type}: async (id: string, payload: Partial<${Type}FormValues>): Promise<${Type}State> => {
//     const { data } = await ${cfg.axiosInstanceName}.put('/${name}/' + id, payload);
//     return data;
//   },
//   delete${Type}: async (id: string): Promise<void> => {
//     await ${cfg.axiosInstanceName}.delete('/${name}/' + id);
//   },
// };
// `;
// };
//
// const generateHook = (name) => {
//     const Type = capitalizeFirstLetter(kebabToCamel(name));
//     return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { ${name}Service } from '../services/${name}.service';
// import type { ${Type}FormValues, ${Type}QueryParams } from '../types/${name}.types';
//
// export const useFetch${Type} = (params: ${Type}QueryParams = {}) =>
//   useQuery({ queryKey: ['${name}', params], queryFn: () => ${name}Service.get${Type}(params) });
//
// export const useCreate${Type} = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: ${Type}FormValues) => ${name}Service.create${Type}(payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['${name}'] }),
//   });
// };
//
// export const useUpdate${Type} = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<${Type}FormValues> }) =>
//       ${name}Service.update${Type}(id, payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['${name}'] }),
//   });
// };
//
// export const useDelete${Type} = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ${name}Service.delete${Type}(id),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['${name}'] }),
//   });
// };
// `;
// };
//
// const generateSlice = (name) => {
//     const camel = kebabToCamel(name);
//     const Type = capitalizeFirstLetter(camel);
//     return `import { createSlice } from '@reduxjs/toolkit';
// import type { ${Type}State } from '../types/${name}.types';
//
// const initialState: ${Type}State[] = [];
//
// const ${camel}Slice = createSlice({
//   name: '${camel}',
//   initialState,
//   reducers: {
//     set${Type}(state, action) {
//       return action.payload;
//     },
//   },
// });
//
// export const { set${Type} } = ${camel}Slice.actions;
// export default ${camel}Slice.reducer;
// `;
// };
//
// /* -------------------------------------------------------------------------- */
// /*                         Root‑store auto‑registration                       */
// /* -------------------------------------------------------------------------- */
// function updateRootStore(name, cfg) {
//     if (!cfg.autoRegisterReducer) return;
//
//     const camel = kebabToCamel(name);
//     const storePath = path.join(process.cwd(), cfg.rootStorePath);
//
//     if (!fs.existsSync(storePath)) {
//         console.warn(`⚠️  Root store not found at ${cfg.rootStorePath}; skipping auto‑register.`);
//         return;
//     }
//
//     let content = fs.readFileSync(storePath, 'utf8');
//     const importLine = `import ${camel}Reducer from '../features/${name}/store/${name}.slice';`;
//
//     if (!content.includes(importLine)) {
//         content = importLine + '\n' + content;
//     }
//
//     const reducerPattern = /reducer:\s*{([\s\S]*?)}/m;
//     const match = content.match(reducerPattern);
//     if (match && !match[0].includes(`${camel}: ${camel}Reducer`)) {
//         const updated = match[0].replace('{', '{\n  ' + `${camel}: ${camel}Reducer,`);
//         content = content.replace(reducerPattern, updated);
//     }
//
//     fs.writeFileSync(storePath, content);
//     console.log('🧩  Root store updated with new reducer');
// }
//
// /* -------------------------------------------------------------------------- */
// /*                                   main                                     */
// /* -------------------------------------------------------------------------- */
// function generateFeature() {
//     const featureName = process.argv[2];
//     if (!featureName) {
//         console.error('Usage: node scripts/generate-feature.js <feature-name>');
//         process.exit(1);
//     }
//
//     const cfg = loadConfig();
//     const featuresDir = path.join(process.cwd(), cfg.featuresDir);
//     const featureDir = path.join(featuresDir, featureName);
//
//     if (fs.existsSync(featureDir)) {
//         console.error(`❌  Feature "${featureName}" already exists.`);
//         process.exit(1);
//     }
//
//     // create directory tree
//     fs.mkdirSync(featureDir, { recursive: true });
//     cfg.featureStructure.directories.forEach((d) => fs.mkdirSync(path.join(featureDir, d)));
//
//     const g = cfg.featureStructure.generateFiles;
//     const CompName = capitalizeFirstLetter(kebabToCamel(featureName));
//
//     if (g.component)
//         fs.writeFileSync(
//             path.join(featureDir, 'components', `${CompName}.component.tsx`),
//             generateComponent(featureName)
//         );
//
//     if (g.types)
//         fs.writeFileSync(path.join(featureDir, 'types', `${featureName}.types.ts`), generateTypes(featureName));
//
//     if (g.service)
//         fs.writeFileSync(
//             path.join(featureDir, 'services', `${featureName}.service.ts`),
//             generateService(featureName, cfg)
//         );
//
//     if (g.hook)
//         fs.writeFileSync(
//             path.join(featureDir, 'hooks', `use${CompName}.hook.ts`),
//             generateHook(featureName)
//         );
//
//     if (g.slice)
//         fs.writeFileSync(
//             path.join(featureDir, 'store', `${featureName}.slice.ts`),
//             generateSlice(featureName)
//         );
//
//     if (cfg.autoRegisterReducer && g.slice) updateRootStore(featureName, cfg);
//
//     if (g.export) {
//         const exportContent = `
// export { default as ${CompName}Component } from './components/${CompName}.component';
// export * from './hooks/use${CompName}.hook';
// export { ${featureName}Service } from './services/${featureName}.service';
// export { default as ${featureName}Reducer, set${CompName} } from './store/${featureName}.slice';
// export type * from './types/${featureName}.types';
// `;
//         fs.writeFileSync(path.join(feature
