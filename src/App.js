import React, { useState } from 'react';
import './App.css';

function App() {
    const [chatLog, setChatLog] = useState([
        { id: 1, user: "운영자", text: "안녕! 금칙어 게임 시작해볼까?", isMe: false },
        { id: 2, user: "운영자", text: "게임을 시작하겠습니다 금칙어를 설정해주세요."}
    ]);
    const [inputValue, setInputValue] = useState("");
    const [forbiddenWord,setforbiddenWord] = useState(""); // 테스트용 금칙어
    const [myId, setMyId] = useState(1);
    const [players,setPlayers] = useState([
        { id: 1, name: "플레이어 1", forbiddenWord: "", isAlive: true ,isMe: true},
        { id: 2, name: "플레이어 2", forbiddenWord: "", isAlive: true,isMe: false},
        { id: 3, name: "플레이어 3", forbiddenWord: "", isAlive: true ,isMe: false},
        { id: 4, name: "플레이어 4", forbiddenWord: "", isAlive: true ,isMe: false},
    ])
    const [isGameStarted, setIsGameStart] = useState(false);
    // const forbiddenset = () => {
    //    const answer =  prompt('금칙어를 설정해주세요',"EX) 콜라");
    //     if(answer !== null && answer.trim() !=="") {
    //         setforbiddenWord(answer);
    //         alert(`금칙어가 [${answer}]로 설정 되었습니다`);
    //     }
    //
    //
    // };

    const closeGame = () =>{

        const closegameplayer = players.map(p => {
            return {
                ...p,
                isAlive:true,
                forbiddenWord:""
            };

        });

        setPlayers(closegameplayer);
        setChatLog([]);
        setIsGameStart(false);
        alert("게임이 종료되었습니다");
    }
    const startGame = () =>{
        const notcheckWord =players.every(p => p.forbiddenWord !== "");
        if(!notcheckWord)
        {
            alert("금칙어가 설정되있지 않은 플레이어가 있습니다.");
            return;
        }


        setIsGameStart(true);
        alert("게임을 시작하겠습니다 금칙어를 말하면 탈락입니다")
        
    }
    const changePlayer = (id) => {
         setMyId(id);
        const updatedPlayers = players.map(p => ({
            ...p,
            isMe: p.id === id
        }));
        alert(`플레이어 ${id}번님이 플레이어로 설정되었습니다`);
        setPlayers(updatedPlayers);
    }

    const relayForbiddenSet =() => {
        const myInfo = players.find(p => p.id === myId);
        if (!myInfo) return;

        let targetId = myInfo.id === 4 ? 1 : myInfo.id + 1;

        const answer = prompt(`플레이어 ${targetId} 의 금칙어를 입력하세요`);

        if (!answer) return;

        const updatePlayers = players.map(p => {
            if (p.id === targetId) {
                return {...p, forbiddenWord: answer};
            }
            return p;
        });


        setPlayers(updatePlayers);
        alert(`플레이어 ${targetId} 님의 금칙어가 설정되었습니다`);

    };


    const handleSend = () => {
        if (!inputValue.trim()) return;



        const myInfo = players.find(p => p.id === myId);
        if (!myInfo) {
            alert("플레이어를 선택해주세요");
            return;
        }
        if(myInfo.isAlive === false){
            alert("탈락자는 메세지를 보낼 수 없습니다");
            return;
        }
        const myName = myInfo.name;
        //   1. 금칙어 체크 로직 (배운 것 활용!)
        if (isGameStarted) {
            const myBadWord = myInfo.forbiddenWord;

            if (myBadWord && inputValue.includes(myBadWord)) {
                const dieplayers = players.map(p => {
                    if(p.id === myId) {
                        return {...p, isAlive: false};
                    }
                    return p;
                });
                setPlayers(dieplayers);
                alert(`탈락! [${myInfo.name}] 님은 금칙어 [${myBadWord}]를 말했습니다!`);
                const survivors = dieplayers.filter(p => p.isAlive);
                if(survivors.length === 1){
                    alert(`축하드립니다 ★${survivors[0].name}★님이 우승하셨습니다`);
                    closeGame();

                }

                setInputValue("");
                return;
            }
    }


        // 2. 채팅 로그 추가
        const newChat = {
            id: Date.now(),
            user: myName,
            text: inputValue,
            senderId:myId
        };

        setChatLog([...chatLog, newChat]);
        setInputValue("");
    };

    return (
     <div className="welcomegame">
            <h1>금칙어 게임에 오신 걸 환영 합니다</h1>
        <div className="forbideenset">
            <button onClick={relayForbiddenSet}>금칙어 설정 </button>
        </div>
         <div className="gameStart">
             {/* 게임 시작 전이면 버튼을 보여주고, 시작 후면 '게임 진행 중' 텍스트를 보여줌 */}
             {!isGameStarted ? (
                 <button onClick={startGame}>게임 스타트</button>
             ) : (
                 <span style={{ color: 'red', fontWeight: 'bold' }}>🎮 게임 진행 중...
                 <button onClick={closeGame}>게임 종료</button></span>

             )}
             <div className= "player1">
                 <button onClick={() => changePlayer(1)}>플레이어 1번 설정</button>
                 <button onClick={() =>changePlayer(2)}>플레이어 2번 설정</button>
                 <button onClick={() =>changePlayer(3)}>플레이어 3번 설정</button>
                 <button onClick={() =>changePlayer(4)}>플레이어 4번 설정</button>

             </div>
         </div>

       <div className="game-player" >
            <div className="player-list-side">
                    <h3>참여 플레이어</h3>
                    <ul>
                        {players.map((p) => (
                            <li key = {p.id} className={`player-item ${p.isMe ? 'me' : ''}`}>
                        {p.name} {p.isAlive ? "" : "💀"}
                            <span>{p.forbiddenWord ? " (설정 O) " : " (설정 X)"}
                                {p.isAlive ? "[생존중]" : "[탈락]"}
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