interface MenuType {
  key: string;
  label: string;
  icon?: string;
  permission?: string;
}

export interface MenuListType {
  key: string;
  label: string;
  icon?: string;
  permission?: string;
  children?: MenuType[];
}

export const PERMISSIONS = {
  OVERDUE_READ: 'OVERDUE_READ',
  MOVIE_ADD: 'MOVIE_ADD',
  ALERT_SEND: 'ALERT_SEND'
};

export const menuData = [
  {
    key: 'manage:plugin',
    label: '플러그인',
    icon: 'pi pi-microchip',
    path: '/book/list',
  },
  {
    key: 'manage:auth',
    label: '권한 할당',
    icon: 'pi pi-ticket',
    children: [
      {
        key: 'my:book:due:list',
        label: '내 대출 목록',
        icon: 'pi pi-check',
        path: '/due/list',
      },
      {
        key: 'book:overdue:list',
        label: '사용자 연체 목록',
        icon: 'pi pi-bookmark-fill',
        permission: PERMISSIONS.OVERDUE_READ,
        path: '/due/users',
      },
    ]
  },
]