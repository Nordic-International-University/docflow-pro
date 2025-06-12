// scripts/generate-feature.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function camelToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Configuration loader
function loadConfig() {
    const configPath = path.join(process.cwd(), 'feature-generator.config.json');

    const defaultConfig = {
        srcDir: 'src',
        featuresDir: 'src/features',
        routingConfig: {
            enabled: true,
            routesFile: 'src/routes/routes.ts',
            routeArrayName: 'routes',
            routeObjectStructure: {
                path: 'path',
                component: 'component',
                name: 'name',
                meta: 'meta'
            }
        },
        reduxConfig: {
            enabled: true,
            storeFile: 'src/store/store.ts',
            rootReducerFile: 'src/store/rootReducer.ts',
            sliceImportPath: '../features'
        },
        featureStructure: {
            directories: ['components', 'hooks', 'services', 'store', 'types'],
            generateFiles: {
                component: true,
                hook: true,
                service: true,
                slice: true,
                types: true,
                export: true,
                routes: true
            }
        },
        templates: {
            useCustomTemplates: false,
            templatesDir: 'scripts/templates'
        }
    };

    if (fs.existsSync(configPath)) {
        try {
            const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return { ...defaultConfig, ...userConfig };
        } catch (error) {
            console.warn('Config faylini o\'qishda xatolik. Default config ishlatiladi.');
            return defaultConfig;
        }
    }

    // Create default config file
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`Config fayli yaratildi: ${configPath}`);

    return defaultConfig;
}

// Template generators
function generateComponent(featureName, config) {
    const componentName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/components/${componentName}.component.tsx
import React from 'react';
import type { ${componentName}Props } from '../types/${featureName}.types';

export default function ${componentName}Component(props: ${componentName}Props) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the ${componentName} Feature!</h1>
      <p>Props ID: {props.id}</p>
      {/* ${componentName} component content */}
    </div>
  );
}
`;
}

function generateHook(featureName, config) {
    const hookName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/hooks/use${hookName}.hook.ts
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ${featureName}Service } from '../services/${featureName}.service';

interface Use${hookName}Result {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  refetch: () => void;
}

export function use${hookName}(): Use${hookName}Result {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await ${featureName}Service.get${hookName}();
      setData(result);
      setStatus('succeeded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
      setStatus('failed');
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, status, error, refetch };
}
`;
}

function generateService(featureName, config) {
    const serviceName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/services/${featureName}.service.ts
import type { ${serviceName}State, Create${serviceName}Request, Update${serviceName}Request } from '../types/${featureName}.types';

// API base URL - environment variable dan oling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const ${featureName}Service = {
  get${serviceName}: async (): Promise<${serviceName}State[]> => {
    const response = await fetch(\`\${API_BASE_URL}/${featureName}\`);
    if (!response.ok) {
      throw new Error('Ma\'lumotlarni olishda xatolik');
    }
    return response.json();
  },

  get${serviceName}ById: async (id: string): Promise<${serviceName}State> => {
    const response = await fetch(\`\${API_BASE_URL}/${featureName}/\${id}\`);
    if (!response.ok) {
      throw new Error('Ma\'lumotni olishda xatolik');
    }
    return response.json();
  },

  create${serviceName}: async (data: Create${serviceName}Request): Promise<${serviceName}State> => {
    const response = await fetch(\`\${API_BASE_URL}/${featureName}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Yaratishda xatolik');
    }
    return response.json();
  },

  update${serviceName}: async (id: string, data: Update${serviceName}Request): Promise<${serviceName}State> => {
    const response = await fetch(\`\${API_BASE_URL}/${featureName}/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Yangilashda xatolik');
    }
    return response.json();
  },

  delete${serviceName}: async (id: string): Promise<void> => {
    const response = await fetch(\`\${API_BASE_URL}/${featureName}/\${id}\`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('O\'chirishda xatolik');
    }
  },
};
`;
}

function generateSlice(featureName, config) {
    const sliceName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/store/${featureName}.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ${sliceName}State } from '../types/${featureName}.types';
import { ${featureName}Service } from '../services/${featureName}.service';

interface ${sliceName}StoreState {
  items: ${sliceName}State[];
  currentItem: ${sliceName}State | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ${sliceName}StoreState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetch${sliceName} = createAsyncThunk(
  '${featureName}/fetch${sliceName}',
  async () => {
    const response = await ${featureName}Service.get${sliceName}();
    return response;
  }
);

export const fetch${sliceName}ById = createAsyncThunk(
  '${featureName}/fetch${sliceName}ById',
  async (id: string) => {
    const response = await ${featureName}Service.get${sliceName}ById(id);
    return response;
  }
);

export const create${sliceName} = createAsyncThunk(
  '${featureName}/create${sliceName}',
  async (data: any) => {
    const response = await ${featureName}Service.create${sliceName}(data);
    return response;
  }
);

export const update${sliceName} = createAsyncThunk(
  '${featureName}/update${sliceName}',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await ${featureName}Service.update${sliceName}(id, data);
    return response;
  }
);

export const delete${sliceName} = createAsyncThunk(
  '${featureName}/delete${sliceName}',
  async (id: string) => {
    await ${featureName}Service.delete${sliceName}(id);
    return id;
  }
);

const ${featureName}Slice = createSlice({
  name: '${featureName}',
  initialState,
  reducers: {
    clear${sliceName}Error: (state) => {
      state.error = null;
    },
    setCurrentItem: (state, action: PayloadAction<${sliceName}State | null>) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ${sliceName}
      .addCase(fetch${sliceName}.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetch${sliceName}.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetch${sliceName}.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Xatolik yuz berdi';
      })
      // Fetch ${sliceName} by ID
      .addCase(fetch${sliceName}ById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      // Create ${sliceName}
      .addCase(create${sliceName}.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update ${sliceName}
      .addCase(update${sliceName}.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      // Delete ${sliceName}
      .addCase(delete${sliceName}.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      });
  },
});

export const { clear${sliceName}Error, setCurrentItem } = ${featureName}Slice.actions;
export default ${featureName}Slice.reducer;
`;
}

function generateTypes(featureName, config) {
    const typeName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/types/${featureName}.types.ts

export interface ${typeName}State {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Qoshimcha fieldlar qoshish
}

export interface ${typeName}Props {
  id: string;
  className?: string;
  // Qoshimcha props
}

export interface Create${typeName}Request {
  name: string;
  description?: string;
  // Yaratish uchun kerakli fieldlar
}

export interface Update${typeName}Request {
  name?: string;
  description?: string;
  // Yangilash uchun kerakli fieldlar
}

// API Response types
export interface ${typeName}ApiResponse {
  data: ${typeName}State[];
  total: number;
  page: number;
  limit: number;
}

export interface ${typeName}SingleApiResponse {
  data: ${typeName}State;
}
`;
}

function generateExport(featureName, config) {
    const componentName = capitalizeFirstLetter(kebabToCamel(featureName));

    return `// ${featureName}/export.ts
// Components
export { default as ${componentName}Component } from './components/${componentName}.component';

// Hooks
export { use${componentName} } from './hooks/use${componentName}.hook';

// Services
export { ${featureName}Service } from './services/${featureName}.service';

// Store
export { default as ${featureName}Reducer } from './store/${featureName}.slice';
export * from './store/${featureName}.slice';

// Types
export type * from './types/${featureName}.types';
`;
}

function generateRoutes(featureName, config) {
    const componentName = capitalizeFirstLetter(kebabToCamel(featureName));
    const routePath = `/${camelToKebab(featureName)}`;

    return `// ${featureName}/routes/${featureName}.routes.ts
import { lazy } from 'react';

const ${componentName}Component = lazy(() => import('../components/${componentName}.component'));

export const ${featureName}Routes = [
  {
    path: '${routePath}',
    component: ${componentName}Component,
    name: '${componentName}',
    meta: {
      title: '${componentName}',
      requiresAuth: false,
      // Qoshimcha meta ma'lumotlar
    }
  },
  {
    path: '${routePath}/:id',
    component: ${componentName}Component,
    name: '${componentName}Detail',
    meta: {
      title: '${componentName} Detail',
      requiresAuth: false,
    }
  },
  // Qoshimcha routelar
];
`;
}

// File updaters
function updateRoutesFile(featureName, config) {
    const routesFilePath = path.join(process.cwd(), config.routingConfig.routesFile);
    const componentName = capitalizeFirstLetter(kebabToCamel(featureName));

    if (!fs.existsSync(routesFilePath)) {
        // Create routes file if it doesn't exist
        const routesContent = `// src/routes/routes.ts
import { ${featureName}Routes } from '../features/${featureName}/routes/${featureName}.routes';

export const routes = [
  ...${featureName}Routes,
  // Boshqa routelar
];
`;
        fs.mkdirSync(path.dirname(routesFilePath), { recursive: true });
        fs.writeFileSync(routesFilePath, routesContent);
        console.log(`✅ Routes fayli yaratildi: ${routesFilePath}`);
        return;
    }

    let routesContent = fs.readFileSync(routesFilePath, 'utf8');

    // Add import
    const importStatement = `import { ${featureName}Routes } from '../features/${featureName}/routes/${featureName}.routes';`;

    if (!routesContent.includes(importStatement)) {
        const importRegex = /(import[\s\S]*?from[\s\S]*?;)/g;
        const imports = routesContent.match(importRegex) || [];
        const lastImport = imports[imports.length - 1];

        if (lastImport) {
            routesContent = routesContent.replace(lastImport, lastImport + '\n' + importStatement);
        } else {
            routesContent = importStatement + '\n\n' + routesContent;
        }
    }

    // Add routes to array
    const routeArrayName = config.routingConfig.routeArrayName;
    const routeSpread = `...${featureName}Routes,`;

    if (!routesContent.includes(routeSpread)) {
        const arrayRegex = new RegExp(`(export\\s+const\\s+${routeArrayName}\\s*=\\s*\\[)`, 'g');
        routesContent = routesContent.replace(arrayRegex, `$1\n  ${routeSpread}`);
    }

    fs.writeFileSync(routesFilePath, routesContent);
    console.log(`✅ Routes fayli yangilandi: ${routesFilePath}`);
}

function updateStoreFile(featureName, config) {
    const storeFilePath = path.join(process.cwd(), config.reduxConfig.storeFile);
    const componentName = capitalizeFirstLetter(kebabToCamel(featureName));

    if (!fs.existsSync(storeFilePath)) {
        // Create store file if it doesn't exist
        const storeContent = `// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import ${featureName}Reducer from '${config.reduxConfig.sliceImportPath}/${featureName}/store/${featureName}.slice';

export const store = configureStore({
  reducer: {
    ${featureName}: ${featureName}Reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
        fs.mkdirSync(path.dirname(storeFilePath), { recursive: true });
        fs.writeFileSync(storeFilePath, storeContent);
        console.log(`✅ Store fayli yaratildi: ${storeFilePath}`);
        return;
    }

    let storeContent = fs.readFileSync(storeFilePath, 'utf8');

    // Add import
    const importStatement = `import ${featureName}Reducer from '${config.reduxConfig.sliceImportPath}/${featureName}/store/${featureName}.slice';`;

    if (!storeContent.includes(importStatement)) {
        const importRegex = /(import[\s\S]*?from[\s\S]*?;)/g;
        const imports = storeContent.match(importRegex) || [];
        const lastImport = imports[imports.length - 1];

        if (lastImport) {
            storeContent = storeContent.replace(lastImport, lastImport + '\n' + importStatement);
        } else {
            storeContent = importStatement + '\n\n' + storeContent;
        }
    }

    // Add reducer to store
    const reducerEntry = `${featureName}: ${featureName}Reducer,`;

    if (!storeContent.includes(reducerEntry)) {
        const reducerRegex = /(reducer:\s*\{)/g;
        storeContent = storeContent.replace(reducerRegex, `$1\n    ${reducerEntry}`);
    }

    fs.writeFileSync(storeFilePath, storeContent);
    console.log(`✅ Store fayli yangilandi: ${storeFilePath}`);
}

function updateHooksFile(config) {
    const hooksFilePath = path.join(process.cwd(), 'src/store/hooks.ts');

    if (!fs.existsSync(hooksFilePath)) {
        const hooksContent = `// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
        fs.mkdirSync(path.dirname(hooksFilePath), { recursive: true });
        fs.writeFileSync(hooksFilePath, hooksContent);
        console.log(`✅ Hooks fayli yaratildi: ${hooksFilePath}`);
    }
}

// Main function
function generateFeature() {
    const featureName = process.argv[2];
    const configFlag = process.argv[3];

    if (!featureName) {
        console.error('❌ Iltimos, feature nomini kiriting: node scripts/generate-feature.js <feature-name>');
        console.log('📖 Misol: node scripts/generate-feature.js user-management');
        console.log('⚙️  Config yaratish: node scripts/generate-feature.js <feature-name> --config');
        process.exit(1);
    }

    const config = loadConfig();

    if (configFlag === '--config') {
        console.log('⚙️  Config fayli:', path.join(process.cwd(), 'feature-generator.config.json'));
        console.log('✅ Config sozlamalarini o\'zgartirishingiz mumkin.');
        return;
    }

    const srcDir = path.join(process.cwd(), config.srcDir);
    const featuresDir = path.join(process.cwd(), config.featuresDir);

    // Check if features directory exists
    if (!fs.existsSync(featuresDir)) {
        console.log(`📁 "${config.featuresDir}" papkasi topilmadi. Yaratilmoqda...`);
        fs.mkdirSync(featuresDir, { recursive: true });
    }

    const featureDir = path.join(featuresDir, featureName);

    // Check if feature already exists
    if (fs.existsSync(featureDir)) {
        console.error(`❌ Xato: "${featureName}" nomli feature allaqachon mavjud.`);
        process.exit(1);
    }

    console.log(`🚀 "${featureName}" feature yaratilmoqda...`);

    // Create feature directory
    fs.mkdirSync(featureDir, { recursive: true });

    // Create subdirectories
    const directories = [...config.featureStructure.directories];
    if (config.routingConfig.enabled) {
        directories.push('routes');
    }

    directories.forEach(dir => {
        const dirPath = path.join(featureDir, dir);
        fs.mkdirSync(dirPath);
    });

    // Generate files
    const files = config.featureStructure.generateFiles;

    if (files.component) {
        const componentName = capitalizeFirstLetter(kebabToCamel(featureName));
        fs.writeFileSync(
            path.join(featureDir, 'components', `${componentName}.component.tsx`),
            generateComponent(featureName, config)
        );
    }

    if (files.hook) {
        const hookName = capitalizeFirstLetter(kebabToCamel(featureName));
        fs.writeFileSync(
            path.join(featureDir, 'hooks', `use${hookName}.hook.ts`),
            generateHook(featureName, config)
        );
    }

    if (files.service) {
        fs.writeFileSync(
            path.join(featureDir, 'services', `${featureName}.service.ts`),
            generateService(featureName, config)
        );
    }

    if (files.slice && config.reduxConfig.enabled) {
        fs.writeFileSync(
            path.join(featureDir, 'store', `${featureName}.slice.ts`),
            generateSlice(featureName, config)
        );
    }

    if (files.types) {
        fs.writeFileSync(
            path.join(featureDir, 'types', `${featureName}.types.ts`),
            generateTypes(featureName, config)
        );
    }

    if (files.routes && config.routingConfig.enabled) {
        fs.writeFileSync(
            path.join(featureDir, 'routes', `${featureName}.routes.ts`),
            generateRoutes(featureName, config)
        );
    }

    if (files.export) {
        fs.writeFileSync(
            path.join(featureDir, 'export.ts'),
            generateExport(featureName, config)
        );
    }

    // Update external files
    if (config.routingConfig.enabled) {
        updateRoutesFile(featureName, config);
    }

    if (config.reduxConfig.enabled) {
        updateStoreFile(featureName, config);
        updateHooksFile(config);
    }

    // Success message
    console.log(`\n✅ "${featureName}" feature muvaffaqiyatli yaratildi!`);
    console.log(`📍 Joylashuv: ${featureDir}`);

    console.log(`\n📂 Yaratilgan fayl tuzilmasi:`);
    console.log(`${featureName}/`);
    directories.forEach(dir => {
        console.log(`  ├── ${dir}/`);

        if (dir === 'components' && files.component) {
            const componentName = capitalizeFirstLetter(kebabToCamel(featureName));
            console.log(`  │   └── ${componentName}.component.tsx`);
        }
        if (dir === 'hooks' && files.hook) {
            const hookName = capitalizeFirstLetter(kebabToCamel(featureName));
            console.log(`  │   └── use${hookName}.hook.ts`);
        }
        if (dir === 'services' && files.service) {
            console.log(`  │   └── ${featureName}.service.ts`);
        }
        if (dir === 'store' && files.slice) {
            console.log(`  │   └── ${featureName}.slice.ts`);
        }
        if (dir === 'types' && files.types) {
            console.log(`  │   └── ${featureName}.types.ts`);
        }
        if (dir === 'routes' && files.routes) {
            console.log(`  │   └── ${featureName}.routes.ts`);
        }
    });

    if (files.export) {
        console.log(`  └── export.ts`);
    }

    console.log(`\n🔧 Qo'shimcha xususiyatlar:`);
    if (config.routingConfig.enabled) {
        console.log(`  ✅ Routing sozlandi`);
    }
    if (config.reduxConfig.enabled) {
        console.log(`  ✅ Redux store yangilandi`);
    }

    console.log(`\n💡 Keyingi qadamlar:`);
    console.log(`  1. Component logikasini to'ldiring`);
    console.log(`  2. API endpoint-larini sozlang`);
    console.log(`  3. Type definitionlarini yangilang`);
    console.log(`  4. Route-larni test qiling`);

    console.log(`\n📖 Qo'llanish:`);
    console.log(`  import { ${capitalizeFirstLetter(kebabToCamel(featureName))}Component } from './features/${featureName}/export';`);
}

// Run the generator
generateFeature();