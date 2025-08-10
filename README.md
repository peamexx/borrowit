# borrow it

[플러그인 형식 기능](#기능1), [개별 파일 빌드](#기능2), [역할 별 페이지 제어](#3)를 주 특징으로 한 포트폴리오 프로젝트 입니다.

# 구성

| 종류 | 패키지 이름 | 버전 |
| --- | --- | --- |
| 프레임워크 | [React](https://react.dev/) | 19.1.1 |
| 언어 | Typescript | - |
| 스타일시트 | CSS(+module.css) | - |
| 빌드 도구 | [Vite](https://vitejs.dev/) | 7.1.0 |
| 상태 관리 | [zustand](hhttps://zustand-demo.pmnd.rs/) | 5.0.7 |
| 라우터 | [React Router](https://reactrouter.com/en/main) | 7.8.0 |

# 기능1

## 플러그인 형식 기능

# 기능2

## 개별 파일 빌드

하나의 프로젝트에서 다양한 업체/조건 별로 개발해야 하는 경우가 있습니다.

이를 위해 공통인 global과 업체인 google을 예시로 하여 폴더 구조를 만들었다고 가정하겠습니다.

```
menu/
├── global/
│   └── Menu.tsx
└── clients/
    └── google/
        └── Menu.tsx
```

그리고 env파일을 활용 해 아래와 같이 동적으로 컴포넌트를 불러옵니다.

``` tsx
const CLIENT = import.meta.env.VITE_CLIENT;
const CustomHeader = lazy(() => import(`/menu/${CLIENT}/Menu.tsx`));
```

### 이슈

그러나 vite는 `빌드` 시 CLIENT 변수의 값을 알 수 없어, 최대한 일치하는 모든 파일을 번들에 포함시킵니다.

예: google 관련 코드만 빌드 --> global, google, 기타 다른 업체 파일도 같이 빌드

이를 방지하기 위해 vite 설정에서 `plugins`를 활용해 동적으로 가져올 파일을 직접 제어하도록 변경하였습니다.

### 해결

``` tsx
const CustomHeader = lazy(() => import('virtual:client-menu'));
```

위 명령을 통해 vite는 아래와 같이 동적으로 컴포넌트를 분리하여 돌려줍니다.

``` ts
// src/utils/createAutoLayoutPlugin.ts 참고
const clientPath = path.resolve(layoutsDir, `${name}/clients/${CLIENT}/${capitalize(name)}.tsx`);
const globalPath = path.resolve(layoutsDir, `${name}/global/${capitalize(name)}.tsx`);

return fs.existsSync(clientPath) ? clientPath : globalPath;
```

# 실행 방법

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

# 구조

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

# 규칙

1. 폴더 이름에 대시(-) 금지

```
/book-list # X
/bookList # O
```


<style>
  h1 {color: #09de53}
</style>