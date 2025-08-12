import styles from './bookList.module.css';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

import PaperBookList from '@components/bookList/PaperBookList';
import { bookDetailPopupPlugin } from '@plugins/BookDetailPopupPlugin';
import { HoverPreviewPlugin } from '@plugins/HoverPreviewPlugin';

function BookList() {
  return (
    <div className={styles.wrap}>
      <h2>국내 도서 목록</h2>
      <Message severity="info" text="플러그인 2개가 추가된 목록입니다. 썸네일 hover 또는 책 이름을 click해보세요." />
      <PaperBookList
        tableProps={{ stripedRows: true, paginator: true, rows: 5 }}
        plugins={[bookDetailPopupPlugin, HoverPreviewPlugin]}
      />
      <Divider className="mt50 mb50" />
      <Message className="mb20" severity="info" text="플러그인이 추가되지 않은 목록입니다." />
      <PaperBookList
        tableProps={{ stripedRows: true, paginator: true, rows: 1 }}
      />
    </div>
  )
}

export default BookList