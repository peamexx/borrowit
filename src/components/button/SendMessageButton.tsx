
import styles from './sendMessageButton.module.css';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';

import { useAuthStore } from '@services/auth/userStore';
import { PERMISSIONS } from '@data/menu/global/menuData';
import { API_KEY, getApi } from '@services/api/api';
import { useToast } from '@services/toast/ToastProvider';

function SendMessageButton() {
  const { hasPermissions } = useAuthStore();
  const enable = hasPermissions(PERMISSIONS.SEND_MESSAGE_TO_ADMIN);
  if (!enable) return null;

  const { user } = useAuthStore();
  const { openToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleMessage = async () => {
    const res = await getApi(API_KEY.CREATE_MESSAGE_TO_ADMIN_LIST, { message: value, user: user });
    if (res.success) {
      openToast({ severity: 'success', summary: '성공', detail: '메세지를 관리자에게 전송하였습니다.' });

      setValue('');
      setIsOpen(false);
    } else {
      openToast({ severity: 'error', summary: '실패', detail: '메세지 전송에 실패하였습니다.' });

      setIsOpen(false);
    }
  }

  return (<>
    <span style={{ display: 'block', paddingTop: '30px' }}></span>
    <Message severity="info" text="유저만 볼 수 있는 버튼 입니다." />
    <span style={{ display: 'block', paddingBottom: '10px' }}></span>
    <Button label="관리자에게 메세지 남기기" onClick={() => setIsOpen(true)} />
    <Dialog header="메세지 작성" visible={isOpen} style={{ width: '50vw' }} onHide={() => { if (!isOpen) return; setIsOpen(false); }}>
      <InputTextarea className={styles.textarea} rows={3} value={value} onChange={(e) => setValue(e.target.value)} />
      <div className={styles.flex10}>
        <Button label="닫기" text onClick={() => setIsOpen(false)} />
        <Button label="전송" onClick={handleMessage} />
      </div>
    </Dialog >
  </>)
}

export default SendMessageButton