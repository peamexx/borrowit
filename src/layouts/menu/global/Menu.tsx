
import styles from './menu.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Tree } from 'primereact/tree';

const MENU = [{
  key: 'manage:book',
  label: '도서 관리',
  icon: 'pi pi-fw pi-inbox',
  children: [
    {
      key: 'book:list',
      label: '도서 목록',
      icon: 'pi pi-fw pi-cog'
    },
    {
      key: 'book:borrow',
      label: '대출 관리',
      icon: 'pi pi-fw pi-home'
    },
    {
      key: 'book:overdue',
      label: '연체 관리',
      icon: 'pi pi-fw pi-home'
    }
  ]
}];

function Menu() {
  const navigate = useNavigate();

  const [expandedKeys, setExpandedKeys]: any = useState({});

  useEffect(() => { console.debug(expandedKeys); }, [expandedKeys])

  const handleClick = (e: any) => {
    if (e.node.key == 'manage:book') {
      if (expandedKeys['manage:book']) {
        let _expandedKeys = { ...expandedKeys };
        delete _expandedKeys['manage:book'];

        setExpandedKeys(_expandedKeys);
      } else {
        setExpandedKeys((prev: any) => ({ ...prev, 'manage:book': true }));
      }
      return;
    }
    if (e.node.key == 'book:list') {
      navigate('/book/list');
      return;
    }
  }

  return (
    <div className={styles.menu}>
      <Tree value={MENU} className={styles.treeWrap} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} onNodeClick={handleClick} />
    </div>
  )
}

export default Menu
