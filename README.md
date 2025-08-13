# borrow it

[플러그인 형식 기능](#기능1), [개별 파일 빌드](#기능2), [역할 별 페이지 제어](#기능3)를 주 특징으로 한 포트폴리오 입니다.

## 구성

| 종류 | 패키지 이름 | 버전 |
| --- | --- | --- |
| 프레임워크 | [React](https://react.dev/) | 19.1.1 |
| 언어 | Typescript | - |
| 스타일시트 | CSS(+module.css) | - |
| 빌드 도구 | [Vite](https://vitejs.dev/) | 7.1.0 |
| 상태 관리 | [zustand](https://zustand-demo.pmnd.rs/) | 5.0.7 |
| 라우터 | [React Router](https://reactrouter.com/en/main) | 7.8.0 |

## 기능1

### 플러그인 구조 기능

``` html
<List plugins={[Copy]} />
<List plugins={[Popup]} />
```

같은 컴포넌트이지만 특정 상황에 따라 필요한 기능이 다를 수 있습니다.

유연한 기능 추가를 위해 **플러그인을 객체로 정의하고, 독립적인 컴포넌트로 분리하여 확장성을 높였습니다**.

``` tsx
// src\plugins\BookDetailPopupPlugin.tsx
const Popup = {
  name: 'popup',
  event: 'click',
  component: (props) => <ComponentUI {...props} />
}
```

각 플러그인은 고유한 컴포넌트를 가지고 있습니다.

이러한 플러그인을 주입 후 원하는 상황에서 활성화 시킵니다 (예: 버튼 클릭)

``` ts
openPlugins(props.plugins, 'click', [
  { name: 'copy', data: { onFail: () => {} } },
  { name: 'popup', data: { ref: e.currentTarget } },
]);
```

`PluginProvider.tsx`은 플러그인을 받아 해당 tsx를 랜더링합니다.

``` tsx
// src\plugins\PluginProvider.tsx
const PluginManagerProvider = () => {
  return (
    <Provider>
      {children}
      {activePlugin && activePlugin?.map((actPlug) => {
        const PluginComponent = actPlug.plugin.component;
        return <PluginComponent />;
      })}
    </Provider>
  )
}
```

## 기능2

### 개별 파일 빌드

하나의 프로젝트에서 다양한 업체 별로 개발해야 하는 경우가 있습니다.

이를 위해 업체 별로 폴더 구조를 분리하였습니다.

```
menu/
├── global/
│   └── Menu.tsx
└── clients/
    └── google/
        └── Menu.tsx
```

env파일을 활용 해 동적으로 컴포넌트를 불러오는 것이 일반적입니다.

``` tsx
const CLIENT = import.meta.env.VITE_CLIENT; // global or google
const CustomMenu = lazy(() => import(`/menu/${CLIENT}/Menu.tsx`));
```

#### 이슈

그러나 vite는 `빌드` 시 CLIENT 변수의 값을 알 수 없기에, 최대한 일치하는 모든 파일을 번들에 포함시키는 특징이 있습니다.

(예: google 관련 코드만 빌드 --> global, google, 기타 다른 업체 파일도 같이 빌드)

#### 해결

vite의 `plugins` 설정에 커스텀 요소를 추가하여 동적으로 가져올 파일을 직접 제어하도록 변경하였습니다.

``` tsx
const CustomMenu = lazy(() => import('virtual:client-menu'));
```

위 명령을 통해 vite는 아래와 같이 동적으로 컴포넌트를 분리하여 돌려줍니다.

``` ts
// src/utils/ViteCopyLogoPlugin.ts
const clientPath = path.resolve(layoutsDir, `${name}/clients/${CLIENT}/${capitalize(name)}.tsx`);
const globalPath = path.resolve(layoutsDir, `${name}/global/${capitalize(name)}.tsx`);

return fs.existsSync(clientPath) ? clientPath : globalPath;
```

이를 통해 빌드 뿐만이 아닌 개발 시에도 실시간으로 파일을 제어할 수 있습니다.

(예: `어딘가에있는/google/logo.png`를 `public/logo.png`으로 옮겨 개발 시에도 이미지 파일을 볼 수 있음)

## 기능3

### 역할 별 페이지 제어

다양한 계정에 따라 메뉴, 컴포넌트 등을 다르게 처리해야할 때가 있습니다.

일반적인 role 기반 관리는 직책이 많을 경우 세밀한 관리가 불가능합니다.

``` ts
export const PERMISSIONS = {
  BOOK_READ: 'BOOK_READ', // 도서 목록 권한
  BOOK_EDIT: 'BOOK_EDIT', // 도서 생성/수정 권한
  BOOK_DELETE: 'BOOK_DELETE' // 도서 삭제 권한
};

const admin = {
  roleName: '전체 관리자',
  permissions: ['BOOK_READ', 'BOOK_EDIT', 'BOOK_DELETE']
}
const user = {
  roleName: '일반 회원',
  permissions: ['BOOK_READ', 'BOOK_EDIT']
}
```

위와 같이 `권한`으로 사용자를 분리하여 화면을 구상하였습니다.

``` tsx
// 라우터 src\routes\router.tsx
const routes = [{
  path: '/book/edit',
  Components: <Guard key={PERMISSIONS.BOOK_EDIT}><Item /></Guard>
}]

// 특정 컴포넌트
function Button() {
  const enable = hasPermission(PERMISSIONS.BOOK_EDIT);
  if (!enable) return null;

  return <Button>버튼</Button>
}
```

| 종류 | 내용 |
| -- | -- |
| 메뉴 | 메뉴 데이터에 써진 permissions으로 동적으로 새로운 메뉴 리스트 생성 |
| 라우터 | 특정 페이지 접근을 막기 위해 Guard 컴포넌트로 활용하여 체크 |
| 특정 컴포넌트 | 최초 진입 시 권한 체크 |

## 실행 방법

0. [**최초**] `npm install`

1. [**필수**] `.env` 파일 추가

```
# 기본
VITE_CLIENT=

# google 업체
VITE_CLIENT=google
```

2. `npm run dev`

---

| 종류 | 내용 | 비고 |
| -- | -- | -- |
| 개발 | `npm run:dev` | |
| 진입 경로 | http://localhost:5174/ |
| 빌드 | `npm run build` |

## 구조

```
resource/
└── data # 목차/검색용 데이터 (toc.json, search.json)
src/
├── capture # 메인 상위 컴포넌트
├── context # 전역 관리
├── core # epub 파일을 뷰어로 만들어주는 핵심 코어
├── site # 출판사/과목별 컴포넌트
└── utils
```

## 규칙

1. [필수] 폴더 이름에 대시(-) 금지

```
/book-list # X
/bookList # O
```

2. [선택] public/logo 폴더 내 규칙에 맞게 `logo.png`라는 이름으로 파일 넣기

- 없으면 기본 logo로 개발/빌드 됨.

```
/public/logo/global/logo.png
/public/logo/clients/google/logo.png
```

## 진행률

- [x] 기본 화면 구성 
- [x] 개별 파일 빌드 처리
- [x] 플러그인 형식 처리
- [x] 역할 별 페이지 제어 처리
- [ ] 업체 별 화면 처리
- [ ] 다른 기능 구상

<style>
  h1 {color: #09de53}
</style>