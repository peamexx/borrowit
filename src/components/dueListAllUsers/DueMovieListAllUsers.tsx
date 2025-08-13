import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { type PluginType } from '@plugins/PluginProvider';
import { getDueListAllUsers } from '@services/api/api';

interface Book {
  id: number;
  name: string;
}
type TableProps = DataTableProps<Book[]>;
interface Props {
  tableProps?: TableProps;
  plugins?: PluginType[];
}

function DueMovieListAllUsers(_props: Props) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);

      const list = await getDueListAllUsers();
      if (list) {
        setData(list);
        setLoading(false);
      }
    } catch (error) {
      console.debug(error);
      setLoading(false);
    }
  }

  const handleDday = (data: any) => {
    return `${data.dday.substring(1, data.dday.length)}일 지남`;
  }

  return (<>
    <DataTable className="unset-overflow" value={data} loading={loading} size="small" cellSelection selectionMode="single">
      <Column key="movieName" field="movieName" header="영화 이름" />
      <Column key="username" field="username" header="사용자" />
      <Column key="createDate" field="createDate" header="대출 시작일" />
      <Column key="endDate" field="endDate" header="대출 종료일" />
      <Column key="dday" field="dday" header="남은 일" body={handleDday} />
    </DataTable>
  </>)
}

export default DueMovieListAllUsers;