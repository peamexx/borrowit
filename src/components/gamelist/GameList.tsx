import styles from './gameList.module.css';
import { useEffect, useState } from 'react';
import { DataTable, type DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

import { type PluginType } from '@plugins/PluginProvider';
import { getApi, API_KEY } from '@services/api/api';
import { useAuthStore } from '@services/auth/userStore';
import { useGameWindow } from '@services/game/useGameWindow';
import GameResultDialog from './GameResultDialog';

interface Book {
  id: number;
  name: string;
}
type TableProps = DataTableProps<Book[]>;
interface Props {
  tableProps?: TableProps;
  plugins?: PluginType[];
}

function GameList(_props: Props) {
  const { user } = useAuthStore();
  const { openGameWindow } = useGameWindow();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [openModalItemId, setOpenModalItemId] = useState(null);

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

  const handleGame = (book: any) => {
    return <Button outlined className={styles.returnButton} size='small' label="퀴즈" onClick={() => {
      confirmDialog({
        message: <div style={{ textAlign: 'center' }}>이 게임은
        <span style={{ fontWeight: 600, padding: '0 5px' }}>{book.itemId % 2 === 0 ? 'ox 게임' : '주관식 게임'}</span>입니다.
        <br />도서 id가 짝수인 경우 ox게임, 홀수인 경우 주관식 게임입니다.</div>,
        header: '퀴즈',
        defaultFocus: 'accept',
        accept: () => openGameWindow(book),
        reject: () => { }
      });
    }} />
  }

  const handleGameResult = (book: any) => {
    return <Button severity='secondary' outlined className={styles.returnButton} size='small' label="퀴즈 내역" onClick={() => setOpenModalItemId(book.itemId)} />
  }

  return (<>
    <DataTable className="unset-overflow" size="small" cellSelection selectionMode="single"
      value={data} loading={loading}
      emptyMessage="대출 내역이 없습니다.">
      <Column key="itemId" field="itemId" header="도서 id" />
      <Column key="title" field="title" header="책 이름" />
      <Column key="activity" field="activity" header="퀴즈 풀기" body={handleGame} />
      <Column key="activityResult" field="activityResult" header="퀴즈 내역" body={handleGameResult} />
    </DataTable>
    {openModalItemId && <GameResultDialog key={openModalItemId} itemId={openModalItemId} onClose={() => setOpenModalItemId(null)} />}
  </>)
}

export default GameList;