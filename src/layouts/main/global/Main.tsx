import styles from './main.module.css';
import { Button } from 'primereact/button';

function Main() {
  return (<div className={styles.main}>
    <p className={styles.t}>
      <Button label="자세한 내용 보러가기 (README.md)" icon="pi pi-external-link" onClick={() => window.open('https://github.com/peamexx/borrowit', '_blank')} />
      <span className={styles.mb10}></span>
      <span className={styles.bold}>1. 개별 파일 빌드</span><br />
      적용되어 있음 (현재 모드: {__CLIENT__ || '기본'})<br />
      <span className={styles.mb10}></span>
      <span className={styles.bold}>2. 플러그인 기능</span><br />
      '플러그인' 메뉴를 클릭해주세요.
      <span className={styles.mb10}></span>
      <span className={styles.bold}>3. 권한 별 로드 기능</span><br />
      '권한 할당' 메뉴를 클릭해주세요.<br/>
      - 관리자 계정(admin): 메뉴 2개 접근 가능<br/>
      - 일반 계정(user1): 메뉴 1개 접근 가능
    </p>
  </div>
  )
}

export default Main
