# Move Block Frontend

## 프레임워크

- React.js
  - 옛날의 클래스 컴포넌트가 아닌 [함수 컴포넌트](https://ko.reactjs.org/docs/components-and-props.html#function-and-class-components) 사용
  - [hooks](https://ko.reactjs.org/docs/hooks-state.html) 사용. 주로 useEffect, useState 쓰실 것.
- [Next.js](https://nextjs.org/docs/basic-features/pages) (프론트엔드 프레임워크 - 페이지 등 구분)
- [Recoil](https://recoiljs.org/docs/basic-tutorial/atoms) (상태관리)
  - 전역 저장. atom 선언해서 참조. atom 선언시 key 값은 고유해야함.
- [AntDesign](https://ant.design/components/overview) (UI 라이브러리)
- [tailwindCSS](https://tailwindcss.com/docs) (CSS 프레임워크)
  - 클래스명이 CSS 프로퍼티 거의 1:1 대응

### atom 사용법 요약

```typescript
// 선언 - 컴포넌트 밖
const valueAtom = atom({ key: '이름', default: null });

// 사용 - 컴포넌트 안
const [value, setValue] = useRecoilState(valueAtom); // get,set 모두 필요할 때
const value = useRecoilValue(valueAtom); // get만
const setValue = useSetRecoilState(valueAtom); // set만
```

### API 추가시 워크플로우소개

원문: https://github.com/a41ventures/moveblock-front/pull/3 참고

아래 1234 순으로 올라가서 응답받고, 1에서 그 정보를 moduleAtom에 저장하고, 각 컴포넌트(ModuleInfo.tsx 등)에서 moduleAtom 값 접근

1. `[...moduleParams].tsx`: 웹페이지 그려주는 컴포넌트
2. `useModule.ts`: 응답 결과 캐싱하는 훅
3. `fetchModule.ts`: 응답 결과를 정제하는 훅
4. `/pages/api/modules.ts`: 외부 API 프록시

### CSS 관련 주의사항 - globals.css

AntDesign + tailwind 의 끔찍한 혼종..  
AntDesign은 컴포넌트의 일부 엘리먼트에 대해서만 클래스명을 설정할 수 있다.  
따라서 더 세부적인 엘리먼트를 커스터마이즈 하려면 globals.css에 직접 설정해줘야한다.

## 폴더 구조

- pages/ 라우터 같은 구조. (Next.js에 따름)
  - 폴더 아래에서 index.tsx, [변수] -> router.query.변수
- src/ 페이지별로 나눠둠. 아래는 하위폴더 구조 설명.
  - components/ - UI
  - hooks/ - 로직
- [absolute import](https://create-react-app.dev/docs/importing-a-component/#absolute-imports) 사용
  - `tsconfig.json` 에 `paths` 선언

## 실행 방식

1. `.env` 파일 추가

```
RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED=false
```

2. 터미널에 `$ npm run dev`
3. 브라우저에서 `http://localhost:3000` 접속

## 깃헙

- 브랜치 나눠서 PR 올려주시면 됩니다~
- 스쿼시 머지 할 거라 커밋 메시지는 너무 신경 쓰시지 않아도 됩니다
