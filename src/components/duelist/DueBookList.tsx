import styles from './dueBookList.module.css';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { type PluginType } from '@plugins/PluginProvider';
import { getApi, API_KEY } from '@services/api/api';
import { useAuthStore } from '@services/auth/userStore';

interface Book {
  id: number;
  name: string;
}
type TableProps = DataTableProps<Book[]>;
interface Props {
  tableProps?: TableProps;
  plugins?: PluginType[];
}

function DueBookList(_props: Props) {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const list = await getApi(API_KEY.GET_DUELIST, user);
      if (list.success) {
        setData(list.data);
        setLoading(false);
      }
    } catch (error) {
      console.debug(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleDday = (data: any) => {
    if (data.dday === "0") return '오늘';

    if (data.dday.includes('+')) {
      return <span className={styles.red}>{`${data.dday.substring(1, data.dday.length)}일 지남`}</span>
    } else {
      return <span>{`${data.dday.substring(1, data.dday.length)}일 남음`}</span>
    }
  }

  return (<>
    <DataTable className="unset-overflow" value={data} loading={loading} size="small" cellSelection selectionMode="single"
      emptyMessage="대출 내역이 없습니다.">
      <Column key="title" field="title" header="책 이름" />
      <Column key="createDate" field="createDate" header="대출 시작일" />
      <Column key="endDate" field="endDate" header="대출 종료일" />
      <Column key="dday" field="dday" header="남은 일" body={handleDday} />
    </DataTable>
  </>)
}

export default DueBookList;