import { useEffect, useState } from 'react';
import { DataTable, type DataTableProps } from 'primereact/datatable';
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

function MessageToAdminList(_props: Props) {
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

      const list = await getApi(API_KEY.GET_MESSAGE_TO_ADMIN_LIST, user);
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

  return (<>
    <DataTable className="unset-overflow" size="small" cellSelection selectionMode="single"
      value={data} loading={loading}
      emptyMessage="요청 내역이 없습니다.">
      <Column key="message" field="message" header="내용" />
      <Column key="username" field="username" header="사용자" />
      <Column key="createDate" field="createDate" header="작성일" />
    </DataTable>
  </>)
}

export default MessageToAdminList;