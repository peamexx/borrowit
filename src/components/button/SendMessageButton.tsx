import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { useAuthStore } from '@services/login/global/userStore';
import { PERMISSIONS } from '@data/menu/global/menuData';

function SendMessageButton() {
  const { hasPermissions } = useAuthStore();
  const enable = hasPermissions(PERMISSIONS.ALERT_SEND);
  if (!enable) return null;

  return (<>
    <span style={{ display: 'block', paddingTop: '30px' }}></span>
    <Message severity="info" text="관리자만 볼 수 있는 버튼 입니다." />
    <span style={{ display: 'block', paddingBottom: '10px' }}></span>
    <Button label="유저에게 메세지 남기기" />
  </>)
}

export default SendMessageButton