
import styles from './menu.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tree } from 'primereact/tree';
import menuJson from '@data/menu/global/menu.json';

function Menu() {
  const navigate = useNavigate();
  const [menu, setMenu]: any = useState({});
  const [expandedKeys, setExpandedKeys]: any = useState({});

  useEffect(() => {
    fetchMenu();
  }, [])

  const fetchMenu = async () => {
    if (menuJson && menuJson.menu) {
      setMenu(menuJson.menu)
    }
  }

  const handleClick = (e: any) => {
    if (e.node.key == 'manage:book') {
      // todo나중에 공통으로 만들기
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
      <Tree value={menu} className={styles.treeWrap} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} onNodeClick={handleClick} />
    </div>
  )
}

export default Menu
