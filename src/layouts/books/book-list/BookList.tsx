import { lazy } from 'react';

const CustomBookList = lazy(() => import('virtual:client-bookList'));

function BookList() {
  console.debug('BookList');
  return (
    <CustomBookList />
  )
}

export default BookList