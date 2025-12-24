import React, { useState } from 'react';
import './App.css';

function App() {
    const [chatLog, setChatLog] = useState([
        { id: 1, user: "운영자", text: "안녕! 금칙어 게임 시작해볼까?", isMe: false },
        { id: 2, user: "운영자", text: "게임을 시작하겠습니다 금칙어를 설정해주세요."}
    ]);
    const [inputValue, setInputValue] = useState("");
    const [forbiddenWord,setforbiddenWord] = useState(""); // 테스트용 금칙어
    const [players,setPlayers] = useState([
        { id: 1, name: "플레이어 1", forbiddenWord: "gg", isAlive: true,isMe:true },
        { id: 2, name: "플레이어 2", forbiddenWord: "ghh", isAlive: true },
        { id: 3, name: "플레이어 3", forbiddenWord: "jfj", isAlive: true },
        { id: 4, name: "플레이어 4", forbiddenWord: "jjj", isAlive: true },
    ])
    const [isGameStarted, setIsGameStart] = useState(false);
    const forbiddenset = () => {
       const answer =  prompt('금칙어를 설정해주세요',"EX) 콜라");
        if(answer !== null && answer.trim() !=="") {
            setforbiddenWord(answer);
            alert(`금칙어가 [${answer}]로 설정 되었습니다`);
        }


    };

    const startGame = () =>{
        if(!forbiddenWord) {
            alert("금칙어를 먼저 설정해주세요!");
            return;
        }
        setIsGameStart(true);
        alert("게임을 시작하겠습니다 금칙어를 말하면 탈락입니다")
        
    }
    const handleSend = () => {
        if (!inputValue.trim()) return;

        const myInfo = players.find(p => p.isMe);
        if (!myInfo || !myInfo.name) {
            alert("플레이어 이름을 설정해주셔야 게임 참여가 가능합니다");
            return;
        }
        const myName = myInfo.name;
        //   1. 금칙어 체크 로직 (배운 것 활용!)
        if (isGameStarted) {

            if (inputValue.includes(forbiddenWord)) {
                alert(`탈락! 금칙어 [${forbiddenWord}]를 말했습니다!`);
                setInputValue("");
                return;
            }
    }


        // 2. 채팅 로그 추가
        const newChat = {
            id: Date.now(),
            user: myName,
            text: inputValue,
            isMe: true
        };

        setChatLog([...chatLog, newChat]);
        setInputValue("");
    };

    return (
     <div className="welcomegame">
            <h1>금칙어 게임에 오신 걸 환영 합니다</h1>
        <div className="forbideenset">
            <button onClick={forbiddenset}>금칙어 설정 </button>
        </div>
         <div className="gameStart">
             {/* 게임 시작 전이면 버튼을 보여주고, 시작 후면 '게임 진행 중' 텍스트를 보여줌 */}
             {!isGameStarted ? (
                 <button onClick={startGame}>게임 스타트</button>
             ) : (
                 <span style={{ color: 'red', fontWeight: 'bold' }}>🎮 게임 진행 중...</span>
             )}
         </div>
       <div className="game-player" >
            <div className="player-list-side">
                    <h3>참여 플레이어</h3>
                    <ul>
                        {players.map((p) => (
                            <li key = {p.id} className={`player-item ${p.isMe ? 'me' : ''}`}>
                        {p.name}
                            <span>{p.forbiddenWord ? " 🔒" : " 🔓"}</span>
                          </li>
                        ))}
                      </ul>
              </div>

        <div className="chat-container">
            <div id="log">
                {chatLog.map((chat) => (
                    <div key={chat.id} className={`chat-item ${chat.isMe ? 'me' : ''}`}>
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
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSend}>전송</button>
                 </div>
              </div>
            </div>
        </div>
    );
}

export default App;