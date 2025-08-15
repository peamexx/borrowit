import styles from './bookList.module.css';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { usePluginManager, type PluginType } from '@plugins/PluginProvider';
import { getApi, API_KEY } from '@services/api/api';
import { useAuthStore } from '@services/auth/userStore';

interface Book {
  id: number;
  name: string;
}
type TableProps = DataTableProps<Book[]>;
interface Props {
  tableProps: TableProps;
  plugins?: PluginType[];
}

const TARGET = 'Book';
const DROPDOWN_RANGE = [
  { name: '10개', value: 10 },
  { name: '30개', value: 30 },
  { name: '50개', value: 50 }
];

function PaperBookList(props: Props) {
  const { user } = useAuthStore();
  const { openPlugins } = usePluginManager();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({ page: 1, per: 10 });
  const toast = useRef<any>(null); //todo 공통화

  useEffect(() => {
    fetchBooks();
  }, [currentInfo]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/aladin?MaxResults=${currentInfo.per}&SearchTarget=${TARGET}`, { method: 'GET' });
      if (res) {
        const list = await res.json();
        setData(list.item);
        setLoading(false);
      }
    } catch (error) {
      console.debug(error);
      setLoading(false);
    }
  }

  const handleBorrowBook = async (book: any) => {
    const res = await getApi(API_KEY.CREATE_BORROW_BOOK, { title: book.title, itemId: book.itemId, user: user });
    if (res.success) {
      toast.current?.show({ severity: 'success', summary: '성공', detail: '도서를 대출하였습니다.' });
    } else {
      toast.current?.show({ severity: 'error', summary: '실패', detail: '도서 대출에 실패하였습니다.' });
    }
  }

  const handleThumbnailHover = async (e: any, imgSrc: string) => {
    openPlugins(props.plugins, 'hover', [
      { name: 'hover-preview', data: { imgSrc: imgSrc, ref: e.currentTarget, onFail: (msg: string) => console.error(msg) } }
    ]);
  }

  const handleCellClick = async (e: any) => {
    switch (e.cellIndex) {
      case 1: // 타이틀
        openPlugins(props.plugins, 'click', [
          { name: 'book-detail-popup', data: e.rowData }
        ]);
        break;
    }
  }

  const headerComponents = () => {
    return <div className={styles.flexEnd10}>불러올 도서 개수: <Dropdown value={currentInfo.per} onChange={(e) => setCurrentInfo((prev) => ({ ...prev, per: e.value }))} options={DROPDOWN_RANGE} optionLabel="name" /></div>
  }

  const handleThumbnail = (book: any) => {
    return <div style={{ position: 'relative' }} onMouseEnter={(e: any) => handleThumbnailHover(e, book.cover)}>
      <img className="hover-preview-area" src={book.cover} height={50} alt="" />
    </div>
  }

  const handleTitle = (book: any) => {
    let slicedText = book.title;
    if (book.title.length > 50) {
      slicedText = book.title.slice(0, 50) + "...";
    }
    return <div title={book.title}>{slicedText}</div>;
  }

  const handlePriceStandard = (book: any) => {
    return book.priceStandard.toLocaleString();
  }

  const handlePriceSales = (book: any) => {
    return book.priceSales.toLocaleString();
  }

  const handleBorrowButton = (book: any) => {
    return <Button size='small' label="대출하기" onClick={() => {
      confirmDialog({
        message: <div className={styles.row1}>해당 도서를 대여하시겠습니까?<br /><div className={styles.row2}>도서명: <span className={styles.point}>{book.title}</span></div></div>,
        header: '대출하기',
        defaultFocus: 'accept',
        accept: () => handleBorrowBook(book),
        reject: () => { }
      });
    }} />
  }

  return (<>
    <DataTable className="unset-overflow" value={data} size="small" cellSelection selectionMode="single" header={headerComponents} loading={loading} {...props.tableProps}
      onCellClick={handleCellClick}>
      <Column key="cover" field="cover" header="썸네일" body={handleThumbnail} />
      <Column key="title" field="title" header="책 이름" body={handleTitle} />
      <Column key="publisher" field="publisher" header="출판사" />
      <Column key="priceStandard" field="priceStandard" header="정가" body={handlePriceStandard} />
      <Column key="priceSales" field="priceSales" header="판매가" body={handlePriceSales} />
      <Column key="etc" field="etc" header="대출 버튼" body={handleBorrowButton} />
    </DataTable>
    <Toast ref={toast} />
  </>)
}

export default PaperBookList;