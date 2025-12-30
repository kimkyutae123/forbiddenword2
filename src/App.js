import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import './App.css';
const SERVER_URL = "https://forbidden.onrender.com"
const socket = io(SERVER_URL);

function App() {
    // 0: lobby(메인), 1: game(게임방)
    const [view, setView] = useState(0);
    const [chatLog, setChatLog] = useState([
        { id: 1, user: "운영자", text: "안녕! 금칙어 게임 시작해볼까?", isMe: false },
        { id: 2, user: "운영자", text: "게임을 시작하겠습니다 금칙어를 설정해주세요." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [myId, setMyId] = useState(1);
    const [players, setPlayers] = useState([
        { id: 1, name: "플레이어 1", forbiddenWord: "", isAlive: true, isMe: true },
        { id: 2, name: "플레이어 2", forbiddenWord: "", isAlive: true, isMe: false },
        { id: 3, name: "플레이어 3", forbiddenWord: "", isAlive: true, isMe: false },
        { id: 4, name: "플레이어 4", forbiddenWord: "", isAlive: true, isMe: false },
    ]);
    const [isGameStarted, setIsGameStart] = useState(false);



    // 캐릭터 선택 로직
    const selectPlayerAndEnter = (id) => {
        setMyId(id);
        localStorage.setItem("savedMyId", id);
              setView(1); // 게임 화면(1)으로 이동
        socket.emit("request_sync");

    };

    useEffect(() => {
        const savedId = localStorage.getItem("savedMyId");
        if(savedId){
            setMyId(Number(savedId));
            setView(1);
        }
    }, []);

    const closeGame = () => {
        const resetPlayers = players.map(p => ({
            ...p,
            isAlive: true,
            forbiddenWord: ""
        }));
        setPlayers(resetPlayers);
        setChatLog([]);
        setIsGameStart(false);
        alert("게임이 종료되었습니다");
    };

    const checkForbiddenWord = (data) => {
        if (!isGameStarted) return;
        const sender = players.find(p => p.id === data.senderId);
        if (!sender || !sender.isAlive) return;

        const badWord = sender.forbiddenWord;
        if (badWord && data.text.includes(badWord)) {
            setPlayers(prevPlayers => {
                const updated = prevPlayers.map(p =>
                    p.id === data.senderId ? { ...p, isAlive: false } : p
                );
                const survivors = updated.filter(p => p.isAlive);
                if (survivors.length === 1) {
                    alert(`축하드립니다 ★ ${survivors[0].name} 님이 우승하셨습니다`);
                    closeGame();
                }
                return updated;
            });

            const systeMsg = {
                id: Date.now() + 1,
                user: "시스템",
                text: ` [${sender.name}] 탈락! 금칙어 [${badWord}]를 말했습니다`
            };
            setChatLog(prev => [...prev, systeMsg]);
        }
    };

    useEffect(() => {
        socket.on("connect", () => {

            console.log("서버 연결됨:", socket.id);
        });
         socket.on("sync_game_data", (serverPlayers)=>{
             console.log("데이터 동기화 완료!");
             setPlayers(serverPlayers.map(sp => ({
                 ...sp,
                 isMe: sp.id === myId
             })));
         });


        socket.on("update_forbidden", (data) => {
            setPlayers((prevPlayers) => prevPlayers.map(p =>
                p.id === data.targetId ? { ...p, forbiddenWord: data.forbiddenWord } : p
            ));
        });
        socket.on("game_started_all", () => {
            setIsGameStart(true);
            setChatLog(prev => [...prev, {
                id: Date.now(), user: "시스템", text: "🚨 게임이 시작되었습니다! 금칙어를 말하면 탈락입니다."
            }]);
        });
        socket.on("receive_message", (data) => {
            setChatLog(prev => [...prev, data]);
        });



        return () => {
            socket.off("sync_game_data");
            socket.off("connect");
            socket.off("update_forbidden");
            socket.off("game_started_all");
            socket.off("receive_message");
        };
    }, [myId]);

    useEffect(() => {
        if (chatLog.length > 0) {
            const lastChat = chatLog[chatLog.length - 1];
            if (lastChat.senderId) {
                checkForbiddenWord(lastChat);
            }
        }
    }, [chatLog]);

    const startGame = () => {
        const nocheckWord = players.every(p => p.forbiddenWord !== "");
        if (!nocheckWord) {
            alert("금칙어가 설정되있지 않은 플레이어가 있습니다.");
            return;
        }
        socket.emit("start_game");
    };



    const relayForbiddenSet = () => {

        const myInfo = players.find(p => p.id === myId);
        if (!myInfo) return;

        let targetId = myInfo.id === 4 ? 1 : myInfo.id + 1;
        const targetPlayer = players.find(p => p.id === targetId);

        if(targetPlayer && targetPlayer.forbiddenWord) {
            alert(`플레이어 ${targetId}의 금칙어는 이미 설정되있습니다!`);
            return;
        }
        const answer = prompt(`플레이어 ${targetId} 의 금칙어를 입력하세요`);

        if(answer && answer.trim()) {
            socket.emit("set_forbidden", {
                targetId: targetId,
                forbiddenWord: answer.trim()

                });
            alert(`플레이어 ${targetId} 님의 금칙어가 설정되었습니다`);
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const myInfo = players.find(p => p.id === myId);
        if (!myInfo || !myInfo.isAlive) return;

        const chatData = {
            id: Date.now(),
            user: myInfo.name,
            text: inputValue,
            senderId: myId
        };
        socket.emit("send_message", chatData);
        setInputValue("");
    };

    return (
        <div className="App">
            {view === 0 ? (
                /* 로비 화면 */
                <div className="lobby-container">
                    <h1>🚫 금칙어 데스게임</h1>
                    <p>플레이할 캐릭터를 선택하고 입장하세요 </p>
                    <div className="player-grid">
                        {[1, 2, 3, 4].map((id) => (
                            <div key={id} className="player-card">
                                <h3>플레이어 {id}</h3>
                                <button onClick={() => selectPlayerAndEnter(id)}>
                                    선택하기
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* 게임 화면 */
                <div className="welcomegame">
                    <button className="back-btn" onClick={() => setView(0)}>🏠 메인으로</button>
                    <h1>금칙어 게임 진행중 (나: 플레이어 {myId})</h1>
                    <div className="forbideenset">
                        {!isGameStarted && <button onClick={relayForbiddenSet}>금칙어 설정 </button>}
                    </div>
                    <div className="gameStart">
                        {myId === 1 && !isGameStarted && (
                            <button className="start-btn" onClick={startGame}>게임 시작 (방장)</button>
                        )}

                    </div>

                    <div className="game-player">
                        <div className="player-list-side">
                            <h3>참여 플레이어</h3>
                            <ul>
                                {players.map((p) => (
                                    <li key={p.id} className={`player-item ${p.isMe ? 'me' : ''}`}>
                                        {p.name} {p.isAlive ? "" : "💀"}
                                        <span>
                                            {p.isAlive ? (
                                                p.id === myId ? (
                                                    p.forbiddenWord ? " [내 금칙어 : ??? ] " : " [ 설정 대기 중 ]"
                                                ) : (
                                                    p.forbiddenWord ? ` [ 금칙어: ${p.forbiddenWord} ]` : " [설정 대기중 ] "
                                                )
                                            ) : (
                                                ` [ 탈락! 금칙어 : ${p.forbiddenWord} ]`
                                            )}
                                            {p.isAlive ? "[생존]" : "[탈락"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="chat-container">
                            <div id="log">
                                {chatLog.map((chat) => (
                                    <div key={chat.id} className={`chat-item ${chat.senderId === myId ? 'me' : ''}`}>
                                        <span className="meta">{chat.user}</span>
                                        <div className="message">{chat.text}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="input-area">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend}>전송</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;