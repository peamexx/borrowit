import { lazy } from 'react';

const CustomDueListAllUsers = lazy(() => import('virtual:client-dueListAllUsers'));

function DueListAllUsers() {
  return (
    <CustomDueListAllUsers />
  )
}

export default DueListAllUsers