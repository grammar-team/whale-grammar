<p align="center"><img src="https://user-images.githubusercontent.com/12992959/68653789-d28a2900-056f-11ea-9687-c1e7970595e6.png" height="88" /></p>
<h1 align="center">웨않되? - 맞춤법 검사기</h1>
<p align="center">웨일 브라우저에서 한글 맞춤법을 교정받을 수 있도록 도와주는 확장앱</p>
<p align="center"><a href="https://www.notion.so/whalegrammar/3eb3c29fb8e54bb1bc62a370f676a8d3">사용방법</a> | <a href="https://store.whale.naver.com/detail/gmfkgfndfdfgbghjmmcpakibpbjpbfok">웨일 스토어 바로가기</a></p>

<img />

### 개발자
- 👱이동현 [dlehdanakf](https://github.com/dlehdanakf)
- 👱한승진 [hsj-96](https://github.com/hsj-96)

## 어떤 기능을 제공하나요?
#### - 실시간 맞춤법 검사
<img src="https://user-images.githubusercontent.com/12992959/68655038-a2905500-0572-11ea-9147-99bf075778de.gif" height="80" />
글을 작성하면서 실시간으로 맞춤법을 검사받을 수 있습니다. 맞춤법을 검사하는데 `네이버 맞춤법 검사기`를 사용하고 있는데, 해당 검사기에서 최대 500글자까지 검사할 수 있기 때문에, 본문 길이가 500글자를 넘어설 경우 "검사하기" 버튼을 사용자가 직접 클릭해야하는 아쉬움이 있습니다.

#### - 긴 문장 한 번에 검사하기
검사하고 싶은 텍스트를 드래그해서 오른쪽 마우스 클릭으로 검사하기 버튼을 누르거나 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd> 단축키를 이용하여 맞춤법을 검사할 수 있습니다.  
사용자가 검사기를 호출하면 확장앱은 웨일 사이드바를 open하고, `네이버 맞춤법 검사기` 결과화면을 보여줍니다.  
사용자가 입력한 문자열의 길이가 500글자를 넘어설 경우 `<iframe>` 태그를 활용하여 문장단위로 적절히 본문을 나눈다음 각각의 검사결과를 사용자에게 제공합니다.

#### - URL 블랙리스트
특정 사이트에서는 검사를 하고싶지 않을 수 있습니다. 블랙리스트에 사이트 URL를 등록하면 더 이상 해당 사이트에서는 실시간 검사를 진행하지 않습니다.

<img />

## 어떤 기술을 사용하였나요?
#### - Webpack + Babel
- `javascript` ES6 → ES5 트랜스파일링
- `scss` → `css` 컴파일링
- `javascript`, `css` 번들링

#### - Sass
- `<grammar-extension>` 앨리먼트에서 "검사하기" 버튼과 같은 요소들의 스타일링
- 사이드바에서 `네이버 맞춤법 검사기`를 로드할 때, 네이버 통합검색결과에서 검사기를 제외한 불필요한 요소들을 제거하기 위해 `display: none` 속성 부여

#### - CustomElement
- `<grammar-extension>`, `<grammar-mirror>` 앨리먼트는 HTML5 표준 엘리먼트가 아닌데, `content-script.js` 에서 웹페이지 내에 이미 정의된 스크립트와의 충돌을 방지하고자 도입.
- `css style`, `js event` 분리를 위해 `ShadowDOM`을 사용

<img />

## 개발 시작하기
`웨않되 - 맞춤법 검사기` Stable 버젼은 확장앱은 웨일 스토어에서 설치하실 수 있습니다. [스토어 바로가기](https://store.whale.naver.com/detail/gmfkgfndfdfgbghjmmcpakibpbjpbfok)

### 소스코드 설치 및 디버깅
Github에서 소스코드를 내려받아 테스트, 디버깅하기 위해서는 먼저 몇가지 설정을 하셔야 이용 가능합니다.  
보다 자세한 설정 방법은 [웨일 개발자 센터](https://developers.whale.naver.com/tutorials/debugging/)에서 확인 가능합니다.

```
# Github 저장소에서 로컬에 소스코드 내려받기
$ git clone https://github.com/dlehdanakf/whale-grammar

# 내려받은 소스코드가 담긴 폴더로 이동
$ cd whale-grammar

# 의존성 라이브러리 설치
$ npm install

# webpack watchman 이 실시간으로 파일이 변경될 때마다 번들링
$ npm run build:watch
```

[웨일 개발자 센터](https://developers.whale.naver.com/tutorials/debugging/)에서 안내하는 방법에 따라 `확장앱 소스폴더`를 앞서 git clone을 통해 설치한 폴더로 설정합니다.

## License
본 프로젝트에 포함된 소스코드는 MIT 라이센스를 따르며 자세한 사항은 [LICENSE 문서](./LICENSE)를 참고하세요.
`html`, `css`, `javascript`소스코드 이외의 이미지 및 기타 파일들은 다른 라이센스가 적용될 수 있으니 주의하시기 바랍니다.
