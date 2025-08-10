import fs from 'fs';
import path from 'path';

export const copyLogoPlugin = (CLIENT: string, mode: 'DEV' | 'BUILD') => {
  const _closeBundle = () => {
    const dest = mode === 'DEV' ? 'public' : 'dist';

    const logoDir = path.resolve('./', 'public');
    let srcPath = path.resolve(logoDir, `logo/global/logo.png`);
    if (CLIENT !== 'default') {
      srcPath = path.resolve(logoDir, `logo/clients/${CLIENT}/logo.png`);
    }

    const distLogoPath = path.resolve('./', `${dest}/logo.png`)

    if (!fs.existsSync(path.resolve('./', `${dest}`))) {
      console.error('dist 폴더가 존재하지 않습니다.')
      return
    }

    fs.copyFileSync(srcPath, distLogoPath)
    console.log(`Copied ${srcPath} to ${distLogoPath}`)
  }

  if (mode === 'DEV') {
    _closeBundle();
  } else {
    return {
      name: 'copy-logo-resolver',
      closeBundle() {
        _closeBundle();
      }
    };
  }
};