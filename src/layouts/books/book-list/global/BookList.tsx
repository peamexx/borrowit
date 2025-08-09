import styles from './bookList.module.css';
import BookListPlugin from '@plugins/books/book-list/BookList';

function BookList() {
  console.debug('global booklist');
  return (
    <div className={styles.wrap}>
      <h2>도서 목록</h2>
      <BookListPlugin />
    </div>
  )
}

export default BookList