import styles from './dueBookList.module.css';
import { useEffect, useState } from 'react';
import { DataTable, type DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

import { type PluginType } from '@plugins/PluginProvider';
import { getApi, API_KEY } from '@services/api/api';
import { useAuthStore } from '@services/auth/userStore';
import { useToast } from '@services/toast/ToastProvider';

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
  const { openToast } = useToast();
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

  const handleReturnBook = async (data: any) => {
    const res = await getApi(API_KEY.UPDATE_RETURN_BOOK, { id: data.id, user: user });
    if (res.success) {
      openToast({ severity: 'success', summary: '성공', detail: '도서를 반납하였습니다.' });
      fetchList();
    } else {
      openToast({ severity: 'error', summary: '실패', detail: '도서 반납에 실패하였습니다.' });
    }
  }

  const handleDday = (data: any) => {
    if (data.returnYn === 'Y') return '-';
    if (data.dday === '0') return '오늘';

    if (data.dday.includes('+')) {
      return <span className={styles.red}>{`${data.dday.substring(1, data.dday.length)}일 지남`}</span>
    } else {
      return <span>{`${data.dday.substring(1, data.dday.length)}일 남음`}</span>
    }
  }

  const handleReturnButton = (data: any) => {
    if (data.returnYn === 'Y') return <Button className={styles.returnButton} size='small' label="반납하기" disabled />;

    return <Button className={styles.returnButton} size='small' label="반납하기" onClick={() => {
      confirmDialog({
        message: <div className={styles.row1}>해당 도서를 반납하시겠습니까?<br /><div className={styles.row2}>도서명: <span className={styles.point}>{data.title}</span></div></div>,
        header: '반납하기',
        defaultFocus: 'accept',
        accept: () => handleReturnBook(data),
        reject: () => { }
      });
    }} />
  }

  return (<>
    <DataTable className="unset-overflow" size="small" cellSelection selectionMode="single"
      value={data} loading={loading}
      emptyMessage="대출 내역이 없습니다.">
      <Column key="title" field="title" header="책 이름" />
      <Column key="createDate" field="createDate" header="대출 시작일" />
      <Column key="endDate" field="endDate" header="대출 종료일" />
      <Column key="dday" field="dday" header="남은 일" body={handleDday} />
      <Column key="returnDate" field="returnDate" header="반납일" body={(d: any) => d.returnDate ? d.returnDate : '-'} />
      <Column key="etc" field="etc" header="반납하기" body={handleReturnButton} />
    </DataTable>
  </>)
}

export default DueBookList;