
import styles from './header.module.css';
import { useNavigate } from 'react-router';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useAuthStore } from '@services/auth/userStore';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleConfirm = () => {
    confirmDialog({
      message: '로그아웃 하시겠습니까?',
      header: '확인',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: handleLogout,
      reject: () => { },
    });
  };

  const handleLogout = async () => {
    const res = await logout();

    if (res) {
      setTimeout(() => {
        navigate("/");
      }, 200);
    }
  }

  return (
    <div className={styles.header}>
      <ConfirmDialog />
      {/* <Button icon="pi pi-cog" rounded text severity="secondary" aria-label="설정" /> */}
      <div className={styles.logo} onClick={() => navigate('/')} title="처음으로">
        <img className={styles.logoIcon} src="./logo.png" alt="" />
        services
      </div>
      <div className={styles.userWrap}>
        <div className={styles.text}>{user?.username} (<span className={styles.point}>{user?.roleName}</span>)</div>
        <Avatar icon="pi pi-user" shape="circle"></Avatar>
        <Button icon="pi pi-sign-out" rounded text severity="secondary" aria-label="로그아웃" onClick={handleConfirm} />
      </div>
    </div>
  )
}

export default Header
