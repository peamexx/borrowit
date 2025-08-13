import styles from './dueList.module.css';
import { Message } from 'primereact/message';

import DueMovieListAllUsers from '@components/dueListAllUsers/DueMovieListAllUsers';

function DueListAllUsers() {
  return (
    <div className={styles.wrap}>
      <h2>사용자 연체 목록</h2>
      <Message severity="info" text="관리자만 접근할 수 있는 페이지 입니다." />
      <span className={styles.mb10}></span>
      <DueMovieListAllUsers />
    </div>
  )
}

export default DueListAllUsers