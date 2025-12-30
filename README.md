<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# 🚫 forbiddenword2 (금칙어 게임)

**개발 시작일: 2025-12-23**


** 개발 일지 2025-12.23 **  
금칙어 게임 개발 시작     
메인 페이지 html / css 개발중   
금칙어 개발 로직 개발중  
채팅창 왼쪽에 참여중인 플레이어 확인  
게임 스타트 버튼 ( 버튼 누르기전엔 채팅창을 프리하게 사용하게 하기위함 )  

** 12/27 **

플레이어 시점 전환 기능: 버튼을 클릭해 현재 조작하는 플레이어(myId)를 변경하는 기능.  
동적 유저 판별 시스템: 현재 선택된 유저에 따라 채팅 이름, 말풍선 위치, 개별 금칙어 검사가 실시간으로 바뀌는 로직.  
데이터 동기화(Sync): myId 상태와 players 배열 내의 isMe 속성을 일치시켜 UI에 반영.  
플레이어 1 - > 2 , 2 - > 3 , 3 - > 4 , 4 - > 1 금칙어 설정하는 로직 구현완료   
게임 스타트 시 금칙어가 설정되있지않으면 시작 불가 로직 설정 모두 설정되어야 시작가능   
게임 자동승리 판별 및 초기화 시스템   

게임 종료시 자동으로 closeGame이 실행되게 변경 isAlive true, forbiddenword "" 상태 지정  
게임 탈락 시 채팅권한 박탈  



소켓.IO를 배워 넣기 전 
## 🛠 현재 진행 상황
* **Frontend**: 메인 페이지 HTML / CSS 개발 중
* **Backend**: 금칙어 할당 및 판정 로직 개발 중
* **UI/UX**: 
    * 채팅창 좌측 참여 플레이어 목록 구현
    * 게임 시작 버튼 (시작 전 자유 채팅 기능)

---


## 📅 12/29 학습 및 구현 기록

**멀티뷰 구축**

**서버의 데이터 저장소 화 (전체적인 상황을 기억하는 관리자 만들기)**

**데이터 동기화 로직 (새로고침 시 서버와 소통하여 데이터 복구)**

**세련된 UI/UX 디자인 적용**

---

### 🔌 Socket.io 핵심 함수 정리

**socket.emit("이름", 데이터) : 상대방에게 신호 보내기**

**socket.on("이름", (data) => { ... }) : 특정 신호 수신 시 코드 실행**

**io.emit("이름", 데이터) : 서버에 접속한 모든 사용자에게 신호 전송**
## 🎮 게임 룰 및 로직 (Game Rules)

1.  **금칙어 전달 로직**
    * 사용자가 서로의 금칙어를 지정하는 릴레이 방식
    * `1번 → 2번`, `2번 → 3번`, `3번 → 4번`, `4번 → 1번` 순으로 금칙어 부여

2.  **방장 시스템**
    * **1번 사용자**가 방장 권한을 가짐
    * 모든 인원이 입장한 것을 확인 후 1번이 '게임 시작' 버튼을 눌러 진행

3.  **개발 단계 안내**
    * 현재 로직 구현 집중 단계 (Socket.io 연동은 최종 단계에서 진행 예정)

4.  **캐릭터 선택 방식**
    * 제작자가 미리 설정한 1, 2, 3, 4번 캐릭터 사진 중 사용자가 하나를 선택하여 입장

5.  **탈락 및 관전 시스템**
    * 본인의 금칙어를 말할 경우 즉시 채팅 불가 및 **관전 상태**로 전환
    * **탈락 프로세스**: 탈락 시 해당 유저의 금칙어를 채팅창에 공개 -> 최종 1인이 남을 때까지 게임 지속
>>>>>>> 45c9b7799ad2de1ade35f9f9485d5a22288355d2
