
import styles from './menu.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tree } from 'primereact/tree';

import { menuData, type MenuListType } from '@data/menu/clients/google/menuData';
import { useAuthStore } from '@services/auth/userStore';

function Menu() {
  const navigate = useNavigate();
  const { hasPermissions } = useAuthStore();
  const [menu, setMenu]: any = useState<MenuListType[]>([]);
  const [expandedKeys, setExpandedKeys]: any = useState({});

  useEffect(() => {
    fetchMenu();
  }, [])

  const fetchMenu = async () => {
    if (menuData) {
      const _m = authorizedMenu(menuData);
      setMenu(_m);
    }
  }

  const authorizedMenu = (menuData: MenuListType[]) => {
    let r: MenuListType[] = [];
    menuData.forEach((menu: MenuListType) => {
      if (menu.children && menu.children.length !== 0) {
        const newChildren: any = authorizedMenu(menu.children);
        r.push({ ...menu, children: newChildren });
        return;
      }

      if (!menu.permission) {
        r.push(menu);
        return;
      }

      if (hasPermissions(menu.permission)) {
        r.push(menu);
        return;
      }
    })
    return r;
  }

  const handleClick = (e: any) => {
    if (e.node.children && e.node.children.length !== 0) {
      expandMenu(e);
    }

    if (e.node.path) {
      navigate(e.node.path);
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

  return (
    <div className={styles.menu}>
      <Tree value={menu} className={styles.treeWrap}
        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
        onNodeClick={handleClick} />
    </div>
  )
}

export default Menu
