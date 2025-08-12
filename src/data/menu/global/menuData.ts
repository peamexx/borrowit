const menus = [
  {
    key: 'manage:plugin',
    label: '플러그인',
    icon: 'pi pi-microchip'
  },
  {
    key: 'manage:auth',
    label: '권한 할당',
    icon: 'pi pi-ticket',
    children: [
      {
        key: 'book:list',
        label: '도서 목록',
        icon: 'pi pi-book'
      },
      {
        key: 'my:book:due:list',
        label: '내 대출 목록',
        icon: 'pi pi-check'
      },
      {
        key: 'book:overdue:list',
        label: '연체 도서 목록',
        icon: 'pi pi-bookmark-fill'
      },
    ]
  },
]

export default menus;