import styles from './dueList.module.css';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

import DueBookList from '@components/duelist/DueBookList';
import SendMessageButton from '@components/button/SendMessageButton';
import GameList from '@components/gamelist/GameList';

function DueList() {
  return (
    <div className={styles.wrap}>
      <h2>내 대출 목록</h2>
      <Message severity="info" text="모든 사용자가 접근할 수 있는 페이지 입니다." />
      <span className={styles.mb10}></span>
      <DueBookList />
      <SendMessageButton />
      <Divider className="mt50 mb50" />
      <h2>도서 퀴즈 풀기</h2>
      <GameList />
    </div>
  )
}

export default DueList