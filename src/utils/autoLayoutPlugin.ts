import fs from 'fs';
import path from 'path';

export const createAutoLayoutPlugin = (CLIENT: string) => {
  const layoutsDir = path.resolve('./', 'src/layouts');
  const components = fs.readdirSync(layoutsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  console.debug('AutoLayoutPlugin: ', components);

  return {
    name: 'auto-layout-resolver',
    resolveId(id: any) {
      const match = id.match(/^virtual:client-(.+)$/);
      if (match) {
        const componentName = match[1];
        console.debug('componentName', componentName);

        if (components.includes(componentName)) {
          const clientPath = path.resolve(layoutsDir, `${componentName}/clients/${CLIENT}/${capitalize(componentName)}.tsx`);
          const globalPath = path.resolve(layoutsDir, `${componentName}/global/${capitalize(componentName)}.tsx`);

          return fs.existsSync(clientPath) ? clientPath : globalPath;
        }
      }
    }
  };
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}