웨않되 - 맞춤법 검사기
===================
> 실시간으로 맞춤법을 검사하고 편리하게 교정받으세요 !

<img src="./src/image/contest_logo.png" alt="contest_logo" style="height: 12px; margin-right: 4px" />  웨일 확장 앱 콘테스트 출품작입니다.

![Release](https://img.shields.io/github/release/dlehdanakf/WhaleLovesPomodoro.svg)
![NAVER](https://img.shields.io/badge/platform-NAVER%20whale-green.svg)
![NPM](https://img.shields.io/badge/npm-v6.11.3-blue.svg)
![GitHub](https://img.shields.io/github/license/dlehdanakf/WhaleLovesPomodoro.svg)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-%23ff69b4.svg)

`웨않되 - 맞춤법 검사기`는 실시간으로 검사를 통해서 맞춤법 교정을 도와주는 네이버 웨일 확장프로그램 입니다.

### 실시간 검사
(밀줄 긋는 사진)
글을 작성하면서 실시간으로 맞춤법 검사를 할 수 있습니다. 최대 500자까지 자동으로 검사가 진행되며, 500자가 넘어갈 경우에는 사용자가 직접 검사 버튼을 클릭해야 합니다.


### 긴 문장 한 번에 검사하기
(검사하는 사진 + 컨텍스트 메뉴 버튼 사진)
검사하고 싶은 텍스트를 드래그해서 오른쪽 마우스 클릭으로 검사하기 버튼을 누르거나 텍스트 입력창 우측하단에 버튼을 클릭해서 전체 텍스트를 검사할 수 있습니다.


### 호환성
(다양한 사이트에서 동작하는 사진 추가_G메일, 네이버메일, 링크드인...)
다양한 홈페이지 입력창에서 맞춤법 검사를 받을 수 있습니다.


### 블랙리스트 URL 추가
특정 사이트에서는 검사를 하고싶지 않을 수 있습니다. 블랙리스트 URL를 등록하면 더 이상 그 사이트에서는 맞춤법 자동검사를 진행하지 않습니다.

## 사용하기
`웨않되 - 맞춤법 검사기`는 네이버 웨일 브라우저에서 동작하는 확장 프로그램으로 [웨일 스토어](https://store.whale.naver.com/추가링크)에서 설치하실 수 있습니다.



### 소스코드 설치 및 디버깅
Github에서 소스코드를 내려받아 테스트, 디버깅하기 위해서는 먼저 몇가지 설정을 하셔야 이용 가능합니다.  
보다 자세한 설정 방법은 [웨일 개발자 센터](https://developers.whale.naver.com/tutorials/debugging/)에서 확인 가능합니다.

```
$ git clone https://github.com/dlehdanakf/whale-grammar
$ cd whale-grammar
$ npm install
$ npm run build
```

[웨일 개발자 센터](https://developers.whale.naver.com/tutorials/debugging/)에서 안내하는 방법에 따라 `확장앱 소스폴더`를 앞서 git clone을 통해 설치한 폴더로 설정합니다.

## License
본 프로젝트에 포함된 소스코드는 MIT 라이센스를 따르며 자세한 사항은 [LICENSE 문서](./LICENSE)를 참고하시기 바랍니다.  
