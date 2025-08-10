import styles from './bookList.module.css';
import PaperBookList from '@components/bookList/PaperBookList';
import EBookBookList from '@components/bookList/EBookBookList';

function BookList() {
  return (
    <div className={styles.wrap}>
      <h2>국내 도서 목록</h2>
      <h3>종이책</h3>
      <PaperBookList tableProps={{ stripedRows: true, paginator: true, rows: 5 }} />
      <h3>전자책</h3>
      <EBookBookList tableProps={{ stripedRows: true, paginator: true, rows: 3 }} />
    </div>
  )
}

export default BookList