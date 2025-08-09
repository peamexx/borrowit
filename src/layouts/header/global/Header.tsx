
import styles from './header.module.css';
import logoImg from './logo.svg';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

function Header() {
  return (
    <div className={styles.header}>
      <Button icon="pi pi-cog" rounded text severity="secondary" aria-label="설정" />
      <div className={styles.logo}>
        <img className={styles.logoIcon} src={logoImg} alt="" />
        사내 서비스 신청
      </div>
      <div className={styles.userWrap}>
        admin
        <Avatar icon="pi pi-user" shape="circle"></Avatar>
        <Button icon="pi pi-sign-out" rounded text severity="secondary" aria-label="로그아웃" />
      </div>
    </div>
  )
}

export default Header
