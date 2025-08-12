import styles from './bookList.module.css';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

import { usePluginManager, type PluginType } from '@plugins/PluginProvider';

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
  const { openPlugins } = usePluginManager();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({ page: 1, per: 10 });

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentInfo]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/aladin/${import.meta.env.VITE_ALADIN_BOOKLIST_PATH}?ttbkey=${import.meta.env.VITE_ALADIN_TTBKEY}&QueryType=ItemNewAll&SearchTarget=${TARGET}&MaxResults=${currentInfo.per}&output=js&Version=20131101`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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

  const handleThumbnailHover = async (e: any, imgSrc: string) => {
    openPlugins(props.plugins || null, 'hover', [
      { name: 'hover-preview', data: { imgSrc: imgSrc, ref: e.currentTarget, onFail: (msg: string) => console.error(msg) } }
    ]);
  }

  const handleCellClick = async (e: any) => {
    switch (e.cellIndex) {
      case 1: // 타이틀
        openPlugins(props.plugins || null, 'click', [
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

  return (<>
    <DataTable className="unset-overflow" value={data} size="small" cellSelection selectionMode="single" header={headerComponents} loading={loading} {...props.tableProps}
      onCellClick={handleCellClick}>
      <Column key="cover" field="cover" header="썸네일" body={handleThumbnail} />
      <Column key="title" field="title" header="책 이름" body={handleTitle} />
      <Column key="publisher" field="publisher" header="출판사" />
      <Column key="priceStandard" field="priceStandard" header="정가" body={handlePriceStandard} />
      <Column key="priceSales" field="priceSales" header="판매가" body={handlePriceSales} />
    </DataTable>
  </>)
}

export default PaperBookList;