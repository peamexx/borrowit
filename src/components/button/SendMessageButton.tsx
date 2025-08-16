import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { useAuthStore } from '@services/auth/userStore';
import { PERMISSIONS } from '@data/menu/global/menuData';

function SendMessageButton() {
  const { hasPermissions } = useAuthStore();
  const enable = hasPermissions(PERMISSIONS.SEND_MESSAGE_TO_ADMIN);
  if (!enable) return null;

  return (<>
    <span style={{ display: 'block', paddingTop: '30px' }}></span>
    <Message severity="info" text="유저만 볼 수 있는 버튼 입니다." />
    <span style={{ display: 'block', paddingBottom: '10px' }}></span>
    <Button label="관리자에게 메세지 남기기" />
  </>)
}

export default SendMessageButton