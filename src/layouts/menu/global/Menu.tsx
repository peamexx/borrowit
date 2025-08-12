
import styles from './menu.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tree } from 'primereact/tree';

import menuData from '@data/menu/global/menuData';

function Menu() {
  const navigate = useNavigate();
  const [menu, setMenu]: any = useState({});
  const [expandedKeys, setExpandedKeys]: any = useState({});

  useEffect(() => {
    fetchMenu();
  }, [])

  const fetchMenu = async () => {
    if (menuData) {
      setMenu(menuData)
    }
  }

  const handleClick = (e: any) => {
    if (e.node.children && e.node.children.length !== 0) {
      expandMenu(e);
    }

    switch (e.node.key) {
      case 'manage:plugin':
        navigate('/book/list');
        break;
    }
  }

  const expandMenu = (e: any) => {
    if (Object.keys(expandedKeys).length === 0) {
      setExpandedKeys({ [e.node.key]: true });
      return;
    }

    if (expandedKeys[e.node.key]) {
      let _expandedKeys = { ...expandedKeys };
      delete _expandedKeys[e.node.key];
      setExpandedKeys(_expandedKeys);
    } else {
      setExpandedKeys((prev: any) => ({ ...prev, [e.node.key]: true }));
    }
  }

  useEffect(() => {
    console.debug('expandedKeys',expandedKeys);
  }, [expandedKeys])

  return (
    <div className={styles.menu}>
      <Tree value={menu} className={styles.treeWrap}
        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
        onNodeClick={handleClick} />
    </div>
  )
}

export default Menu
