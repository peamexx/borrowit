

import styles from './header.module.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { useAuthStore } from '@services/login/global/userStore';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const toast = useRef(null);

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
      <Toast ref={toast} />
      <ConfirmDialog />
      {/* <Button icon="pi pi-cog" rounded text severity="secondary" aria-label="설정" /> */}
      <div className={styles.logo} onClick={() => navigate('/')} title="처음으로">
        <img className={styles.logoIcon} src="./logo.png" alt="" />
        services
      </div>
      <div className={styles.userWrap}>
        <Avatar icon="pi pi-user" shape="circle" label={user?.id?.substring(0, 1) || ''} style={{ backgroundColor: '#2196F3', color: '#ffffff' }}></Avatar>
        <Button icon="pi pi-sign-out" rounded text severity="secondary" aria-label="로그아웃" onClick={handleConfirm} />
      </div>
    </div>
  )
}

export default Header
