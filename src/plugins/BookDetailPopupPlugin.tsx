import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Link } from "react-router";

import { usePluginManager, type PluginPropsType, type PluginType } from "@plugins/PluginProvider";

function ComponentUI(props: PluginPropsType) {
  if (!props.data) {
    props.onFail?.(`Fail to fire Plugin: ${props.name}`);
    return null;
  }

  const [show, setShow] = useState(false);
  const { closePlugin } = usePluginManager();

  useEffect(() => {
    setShow(true);
  }, [])

  const handleClose = () => {
    setShow(false);
    closePlugin(props.id);
  }

  return (<>
    <Dialog header="도서 상세" visible={show} style={{ width: '50vw' }} onHide={handleClose}>
      <p className="m-0">책 이름: {props.data.title || ''}</p>
      <p className="m-0">출판사: {props.data.publisher || ''}</p>
      <p className="m-0">작가: {props.data.author || ''}</p>
      <p className="m-0">출간일: {props.data.pubDate || ''}</p>
      <p className="m-0">카테고리: {props.data.categoryName || ''}</p>
      <p className="m-0">알라딘 링크: <Link to={props.data.link || ''} target="_blank">새 창 링크</Link></p>
      <p className="m-0">isbn: {props.data.isbn || ''}</p>
      <p className="m-0">설명: {props.data.description || ''}</p>
    </Dialog>
  </>)
}

export const bookDetailPopupPlugin: PluginType = {
  name: 'book-detail-popup',
  event: 'click',
  component: (props: PluginPropsType) => <ComponentUI {...props} />
}