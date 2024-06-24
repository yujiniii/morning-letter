# morning-letter

> 🚧 구현중..

- 아침에 하루를 시작하는데 도움이 될만한 정보를 메일로 제공합니다.
- 날씨, 미세먼지, 뉴스, 오늘의 운세 등을 제공합니다. (추후 생각나는 대로 추가 예정)

## 사용법

- [somePage]() 에 접속해서 이메일과 사는 지역을 입력하면 이메일을 받아볼 수 있습니다.
- 더 이상 메일을 받고 싶지 않다면, 메일 하단의 Unsubscribe 링크를 클릭합니다.

## 기술

- NestJS
- DB (미정)

### 정보 출처

- 날씨
    - [공공데이터포털 > 기상청 단기예보 조회 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084)
- 미세먼지
    - [공공데이터포털 > 한국환경공단_에어코리아_대기오염정보](https://www.data.go.kr/data/15073861/openapi.do)
- 뉴스
    - [네이버 뉴스](https://news.naver.com/?viewType=pc)에 접속했을때 가장 먼저 뜨는
      헤드라인을 [node-html-parser](https://www.npmjs.com/package/node-html-parser)로 파싱
- 오늘의 운세
    - [OpenAi API](https://platform.openai.com/)와 [openai](https://www.npmjs.com/package/openai) 사용해 랜덤으로 운세를 생성

## 남은 작업

- [ ] DB 연결
- [ ] 메일 서비스 작성
- [ ] 스케쥴링 작성
- [ ] 메일 폼 및 구독 페이지 작성 (html)
