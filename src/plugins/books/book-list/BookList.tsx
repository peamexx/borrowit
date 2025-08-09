const arr = [{ id: 1, name: '책1' }, { id: 2, name: '책2' }]

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function BookListPlugin() {
  const [list, setList]: any[] = useState([]);

  useEffect(() => {
    setList(arr);
  }, [])

  return (
    <DataTable value={list}>
      <Column field="id" header="No"></Column>
      <Column field="name" header="책 이름"></Column>
    </DataTable>
  )
}

export default BookListPlugin;