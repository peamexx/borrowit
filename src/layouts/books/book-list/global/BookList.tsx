import styles from './bookList.module.css';
import PaperBookListPlugin from '@plugins/books/book-list/PaperBookListPlugin';
import EBookBookListPlugin from '@plugins/books/book-list/EBookBookListPlugin';

function BookList() {
  return (
    <div className={styles.wrap}>
      <h2>국내 도서 목록</h2>
      <h3>종이책</h3>
      <PaperBookListPlugin
        tableProps={{ stripedRows: true, paginator: true, rows: 5 }}
      />
      <h3>전자책</h3>
      <EBookBookListPlugin
        tableProps={{ stripedRows: true, paginator: true, rows: 3 }}
      />
    </div>
  )
}

export default BookList