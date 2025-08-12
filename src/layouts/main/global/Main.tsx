import styles from './main.module.css';
import { Button } from 'primereact/button';

function Main() {
  return (<div className={styles.main}>
    <p className={styles.t}>
      <Button label="자세한 내용 보러가기 (README.md)" icon="pi pi-external-link" onClick={() => window.open('https://github.com/peamexx/borrowit', '_blank')} />
      <br /><br />
      <span className={styles.bold}>1. 개별 파일 빌드</span><br />
      적용되어 있음 (현재 모드: {import.meta.env.VITE_CLIENT || '기본'})<br />
      <span className={styles.bold}>2. 플러그인 기능</span><br />
      '도서 목록' 메뉴를 클릭해주세요.
    </p>
  </div>
  )
}

export default Main
