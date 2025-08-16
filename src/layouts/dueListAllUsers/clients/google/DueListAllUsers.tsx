import styles from './dueList.module.css';
import { Message } from 'primereact/message';

import DueBookListAllUsers from '@components/dueListAllUsers/DueBookListAllUsers';
import MessageToAdminList from '@components/messageList/MessageToAdminList';

function DueListAllUsers() {
  return (
    <div className={styles.wrap}>
      <h2>사용자 연체 목록</h2>
      <Message severity="info" text="관리자만 접근할 수 있는 페이지 입니다." />
      <span className={styles.mb10}></span>
      <DueBookListAllUsers />
      <span className={styles.mb50}></span>
      <h2>사용자 요청 내역</h2>
      <MessageToAdminList />
    </div>
  )
}

export default DueListAllUsers