const express = require("express") // 웹 서버를 만들기 위한 기본 틀
const http = require("http"); //node.js에 내장된 통신기능 (소켓과 연결을 위해 필요)
const { Server } = require("socket.io"); //실시간 통신을 담당하는 Socket.io의 핵심 클래스
const cors = require("cors"); //서로 다른 주소(포트)끼리 데이터를 주고받게하는 보안설정

// 서버 설정
const app = express(); //Express 앱 생성
app.use(cors()); // 리액트가 서버에 접속할 수 있도록 통행증을 끊어줌

// HTTP 서버 제작
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
// 소켓 통신을 위한 실제 우체국 역할을 하는 io 객체를 만듭니다.

const io = new Server(server, {
    cors: {
        origin: [ "https://forbiddenword2.vercel.app",
        "https://localhost:3000"
        ],
        methods: ["GET", "POST"],

    },
});

// 서버에 '이벤트'가 발생했을때 어떻게 행동할지 정의
// connection은 사용자가 우리 게임페이지에 딱 들어 왔을떄 하는 이벤트

let gameData = {
    players: [
        { id: 1, name: "플레이어 1", forbiddenWord: "", isAlive: true },
        { id: 2, name: "플레이어 2", forbiddenWord: "", isAlive: true },
        { id: 3, name: "플레이어 3", forbiddenWord: "", isAlive: true },
        { id: 4, name: "플레이어 4", forbiddenWord: "", isAlive: true },
    ]
};
io.on("connection", (socket) => {
    //socket 변수안에는 방금 접속한 한 명의 플레이어 정보가 담겨있음
    console.log("새로운 플레이어 접속!", socket.id);
socket.emit("sync_game_data",gameData.players);


    socket.on("set_forbidden", (data) => {
        console.log("서버: 금칙어 설정 요청 받음", data);

        // 서버 메모리 업데이트
        gameData.players = gameData.players.map(p =>
            p.id === data.targetId ? { ...p, forbiddenWord: data.forbiddenWord } : p
        );

        // 업데이트된 정보를 모두에게 방송
        io.emit("update_forbidden", data);
    });



   socket.on("start_game", () => {
   console.log("서버 방장이 게임을 시작했습니다!");

   io.emit("game_started_all");

    });


   socket.on("send_message", (data) => {
   console.log("서버: 메세지 받음", data);
   io.emit("receive_message", data);
   });

   socket.on("disconnect", () => {
   console.log("유저 접속 종료")
    });
});


// 서버 구동

server.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 돌아가고 있어요`);
});