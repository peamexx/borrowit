import fs from 'fs';
import path from 'path';

/**
 * 컴포넌트가 [virtual:client-이름]로 불러온다면, [이름]에 해당하는 폴더를 확인해서 동적으로 .tsx을 알아서 가져옴.
 * 
 * 만약 특정 CLIENT의 .tsx가 없다면 global에 있는 .tsx를 가져옴.
 * @param CLIENT env에 써진 VITE_CLIENT
 * @returns .tsx 파일
 */
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