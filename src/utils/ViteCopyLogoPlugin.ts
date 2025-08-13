import fs from 'fs';
import path from 'path';

/**
 * 개발: public/logo/.../에 있는 logo.png 중 CLIENT에 맞는 폴더에서 꺼내 public/logo.png로 생성.
 * 
 * 빌드: public/logo/.../에 있는 logo.png 중 CLIENT에 맞는 폴더에서 꺼내 dist/logo.png로 생성 및 dist/logo폴더 제거.
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


    if (!fs.existsSync(path.resolve('./', `${dest}`))) {
      console.error('dist 폴더가 존재하지 않습니다.');
      return;
    }

    const distLogoPath = path.resolve('./', `${dest}/logo.png`);
    fs.copyFileSync(srcPath, distLogoPath);

    if (mode === 'BUILD') {
      const distLogoFolderPath = path.resolve('./', `${dest}/logo/`);
      if (fs.existsSync(distLogoFolderPath)) {
        fs.rm(distLogoFolderPath, { recursive: true }, (err) => {
          console.error(err);
        })
      }
    }

    console.log(`✅ 복사 완료: ${distLogoPath}`);
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