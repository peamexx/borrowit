import fs from 'fs';
import path from 'path';

/**
 * 개발: public/logo/.../에 있는 logo.png 중 CLIENT에 맞는 폴더에서 꺼내 public/logo.png로 생성.
 * 
 * 빌드: public/logo/.../에 있는 logo.png 중 CLIENT에 맞는 폴더에서 꺼내 dist/logo.png로 생성.
 * @param CLIENT env에 써진 VITE_CLIENT
 * @param mode 개발 또는 빌드 모드
 * @returns logo 파일 
 */
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