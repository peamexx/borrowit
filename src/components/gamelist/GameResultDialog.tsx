import { useEffect, useState } from 'react';
import { DataTable, type DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

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
  itemId: number;
  onClose: () => void;
}

function GameResultDialog(props: Props) {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const list = await getApi(API_KEY.GET_GAME_RESULT_LIST, { itemId: props.itemId, user: user });
      if (list.success) {
        setData(list.data);
        setOpenModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.debug(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleType = (data: any) => {
    switch (data.type) {
      case 'close':
        return '게임 창 닫음';

      case 'done':
        return '게임 완료';

      case 'start':
        return '게임 시작';

      case 'short':
        return <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Tag value={`주관식 문항: ${data.idx + 1}번`}></Tag>
            {(data.answer && data.userAnswer && data.answer !== data.userAnswer)
              ? <Tag icon="pi pi-times" severity="danger" value="틀림"></Tag>
              : <Tag className="mr-2" icon="pi pi-check" severity="success" value="맞음"></Tag>}
          </div>
          <div>정답({data.answer}), 사용자 답({data.userAnswer})</div>
        </>

      case 'ox':
        return <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Tag value={`ox 문항: ${data.idx + 1}번`}></Tag>
            {(data.answer && data.userAnswer && data.answer !== data.userAnswer)
              ? <Tag icon="pi pi-times" severity="danger" value="틀림"></Tag>
              : <Tag className="mr-2" icon="pi pi-check" severity="success" value="맞음"></Tag>}
          </div>
          <div>정답({data.answer}), 사용자 답({data.userAnswer})</div>
        </>
    }
  }

  return (<>
    <Dialog header="내역" visible={openModal} style={{ width: '50vw' }} onHide={() => { if (!openModal) return; props.onClose(); setOpenModal(false); }}>
      <div style={{ maxHeight: '500px' }}>
        <DataTable className="unset-overflow" size="small" cellSelection selectionMode="single" style={{ paddingBottom: '3rem' }}
          value={data} loading={loading}
          emptyMessage="활동 내역이 없습니다.">
          <Column key="type" field="type" header="분류" body={handleType} />
          <Column key="createDate" field="createDate" header="시간" />
        </DataTable>
      </div>
    </Dialog>
  </>)
}

export default GameResultDialog;