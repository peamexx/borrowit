import { lazy } from 'react';

const CustomDueList = lazy(() => import('virtual:client-dueList'));

function DueList() {
  return (
    <CustomDueList />
  )
}

export default DueList