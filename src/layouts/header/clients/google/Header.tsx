
import styles from './header.module.css';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

function Header() {
  return (
    <div className={styles.header}>
      <Button icon="pi pi-cog" rounded text severity="secondary" aria-label="설정" />
      <div className={styles.logo}>
        <img className={styles.logoIcon} src="./logo.png" alt="" />
        Upgrade your skills
      </div>
      <div className={styles.userWrap}>
        <Avatar icon="pi pi-user" shape="circle" label="A" style={{ backgroundColor: '#2196F3', color: '#ffffff' }}></Avatar>
        <Button icon="pi pi-sign-out" rounded text severity="secondary" aria-label="로그아웃" />
      </div>
    </div>
  )
}

export default Header
