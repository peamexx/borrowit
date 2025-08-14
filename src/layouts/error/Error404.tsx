
import styles from './error.module.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';

function Menu() {
  const navigate = useNavigate();

  return (
    <div className={styles.error}>
      <div className={styles.inner}>
        <h2 className={styles.tc}>Not Found</h2>
        <span className={styles.s404}>페이지가 존재하지 않습니다.</span>
        <Button label="메인으로 돌아가기" onClick={() => navigate('/')} />
      </div>
    </div>
  )
}

export default Menu
