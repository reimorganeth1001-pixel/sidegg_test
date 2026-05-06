'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import AboutModal from '@/components/AboutModal';
import EventFeed from '@/components/EventFeed';
import GameEventBar from '@/components/GameEventBar';
import Header from '@/components/Header';
import SideSelectionModal from '@/components/SideSelectionModal';
import {
  sideGG_back_Config,
  websocket,
} from '@/config';
import { DetailedUserGameDataCtx } from '@/context/detailedGameContext';
import { GameDataCtx } from '@/context/userGameContext';
import { MessageCtx } from '@/context/messageContext';
import { UserInfoCtx } from '@/context/userInfoContext';
import useSocket from '@/hook/useSocket';
import {
  chatType,
  gameType,
} from '@/type';
import {
  playGame,
  getUserGameDetails,
  getUserGameGetOrLoassScore,
} from '@/utils/functions';
import { formatTime } from '@/utils/help';
import { GameEventInfoCtx } from '@/context/gameEventInfoContext';
import { AuthCtx } from '@/context/authContext';
import Loading from '@/components/Loading';

import ScoreModal from '@/components/UserScoreModal'; 

let timeOUtForScore: string | number | NodeJS.Timeout | undefined;
let apiLoadingFlag = false;
let ScoreModalShown = false;
let lastError = false;

export default function ChatRoom() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEventFeed, setShowEventFeed] = useState(false);
  // Change selectedSide to hold a team name (string) instead of 'A'|'B'
  const [newMessage, setNewMessage] = useState('');
  const [charError, setCharError] = useState(false);
  const [displayClock, setDisplayClock] = useState<string>("00:00");
  // const [walletAddress] = useState('7x2K...9fG4');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHARACTER_LIMIT = 50;
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [quarter, setQuarter] = useState<number>(4);

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const [getOrLossScore, setGetOrLossScore] = useState<number>(0);
  const [getOrLossSol, setGetOrLossSol] = useState<number>(0);
  const [startScore, setStartScore] = useState<number>(0);
  const [startSol, setStartSol] = useState<number>(0);

  const [ isScoreModalOpen, setIsScoreModalOpen ] = useState<boolean>(false);

  const { messageData, setMessageData, messageError } = useContext(
    MessageCtx
  );
  const { userInfoData, userInfoError } = useContext(
    UserInfoCtx
  )
  const { userGameInfo, userGameError } = useContext(GameDataCtx);

  const { gameEventInfo, gameEventError } = useContext(
    GameEventInfoCtx
  )

  const { userGameData, setUserGameData } = useContext(
    DetailedUserGameDataCtx
  )

  const { authState } = useContext(AuthCtx);


  const [game, setGame] = useState<gameType.DetailedGame>();
  
  const curSocket = useSocket();
  
  useEffect(() => {
    if(userInfoError) {
      toast.error(userInfoError, {
        style: {
          background: "#111827",
          color: "white",
        }
      });
    }
    if(messageError) {
      toast.error(messageError, {
        style: {
          background: "#111827",
          color: "white",
        }
      });
    }
    if(userGameError) {
      toast.error(userGameError, {
        style: {
          background: "#111827",
          color: "white",
        }
      });
    }
    if(gameEventError) {
      toast.error(gameEventError, {
        style: {
          background: "#111827",
          color: "white",
        }
      });
    }
  }, [userInfoError, messageError, gameEventError, userGameError])

  useEffect(() => {
  }, [messageData]);

  const userPlayGame = async () => {

    if(!userInfoData.id || !gameEventInfo?.gameId || !userGameInfo.teamId){
      return ;
    }

    const playGameResult = await playGame({
      userId: userInfoData.id,
      gameId: gameEventInfo.gameId,
      teamId: userGameInfo.teamId,
    });

    if(playGameResult.error){
      toast.error(playGameResult.error, {
        style: {
          background: "#111827",
          color: "white",
        }
      });
    }
  }

  useEffect(() => {

    if(gameEventInfo?.gameId == '') {
      return;
    }

    if(userInfoData.status >= 2){
      setShowModal(false);
      startInterval();
      userPlayGame();
    } else {
      setShowModal(true); 
    }
  }, [userInfoData, userGameInfo, gameEventInfo])


  const init = async () => {
    if(gameEventInfo?.gameId) {            
        setGame(gameEventInfo);    
    }
  };

  useEffect(() => {
    setTeamA(gameEventInfo?.teamA?.name || "");
    setTeamB(gameEventInfo?.teamB?.name || "");
  }, [game]);

  useEffect(() => {
    init();
  }, [gameEventInfo]);

  const newMessageHandler = useCallback(async (newChatRecord: chatType.newMessageResponse) => {
    if(!newChatRecord) return;
    setMessageData([...messageData, newChatRecord]);
  }, [messageData]);

  useEffect(() => {
    if(curSocket){
      curSocket.on(websocket.WEBSOCKET_NEW_MESSAGE, newMessageHandler);
      return () => {
        curSocket.off(websocket.WEBSOCKET_NEW_MESSAGE, newMessageHandler);
      }
    }
  }, [curSocket, messageData]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value;

    setCharError(message.length > CHARACTER_LIMIT);
    setNewMessage(message);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {

    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/gi;
    if (urlPattern.test(newMessage)) {
      e.preventDefault();
      toast.error("URLs are not allowed in messages", {
        style: {
          background: "#111827",
          color: "white",
        }
      });
      return false;
    }

    e.preventDefault();
    if (!newMessage.trim() || newMessage.length > CHARACTER_LIMIT) return;

    if(!userInfoData.id || !gameEventInfo?.gameId){
      return "userInfo or gameId is invalid"
    }

    if(curSocket){
      console.log("curSocket", curSocket);
      curSocket.emit(websocket.WEBSOCKET_SEND_NEW_MESSAGE, { 
        userId: userInfoData.id, 
        gameId: gameEventInfo?.gameId, 
        message: newMessage 
      });
    }
    
    setNewMessage('');
    setCharError(false);
    scrollToBottom();
  };


  const getUserGameData = async () => {
    await getUserGame();
    clearTimeout(timeOUtForScore);    
    timeOUtForScore = setTimeout(getUserGameData, sideGG_back_Config.FETCH_GAME_ACTIONS_INTERVAL);
  }


  const getUserGame = async () => {
    try {
      if(apiLoadingFlag) {
        return;
      }

      apiLoadingFlag = true;

      if(!userInfoData.id || !gameEventInfo?.gameId || !userGameInfo.teamId) {
        apiLoadingFlag = false;
        return;
      }
      
      const detailedUserGameData = await getUserGameDetails({
        userId: userInfoData.id,
        gameId: gameEventInfo?.gameId,
        teamId: userGameInfo.teamId
      })
      
      if(detailedUserGameData.error){
        throw new Error(detailedUserGameData.error);
      }
      
      setUserGameData(detailedUserGameData?.data?.data);
      
      apiLoadingFlag = false;
      
    } catch (error) {
      if(!lastError){
        toast.error(error instanceof Error ? error.message : "Unknown Error: getUserGameEvent", {
          style: {
            background: "#111827",
          color: "white",
          }
        })
        lastError = true;
      }
      apiLoadingFlag = false;
      return;
    }
  }

  useEffect(() => {
    if(userGameData.teamScores?.length){
      if (teamA == userGameData.teamScores[0].teamName){
        setScoreA(userGameData.teamScores[0].totalScore)
        setScoreB(userGameData.teamScores[1].totalScore)
      } else {
        setScoreB(userGameData.teamScores[0].totalScore)
        setScoreA(userGameData.teamScores[1].totalScore)
      }
    }
    if(userGameData.periodClock){
      if(userGameData.periodClock.data){
        setQuarter(userGameData.periodClock.data.period)
        const timeString = formatTime(userGameData.periodClock.data.clock);
        setDisplayClock(timeString);
      }
    }
    if(userGameData?.gameActions?.data?.length && userGameData?.gameActions?.data[userGameData?.gameActions?.data.length - 1]?.action === sideGG_back_Config.GAME_STATUS_FINAL){
      const getUserGameGetOrLoassScoreResult = async () => {
        const result = await getUserGameGetOrLoassScore({
          userId: userInfoData.id,
          gameId: gameEventInfo?.gameId,
          teamId: userGameInfo.teamId
        })
        if(result.error){
          throw new Error(result.error);
        }
        setGetOrLossScore(result.data?.data?.score || 0);
        setGetOrLossSol(result.data?.data?.sol || 0);
        setStartScore(result.data?.data?.startScore || 0);
        setStartSol(result.data?.data?.startSol || 0);
      }
      
      getUserGameGetOrLoassScoreResult();

      if(!ScoreModalShown){
        setIsScoreModalOpen(true);
        ScoreModalShown = true
      } else{
        return;
      }
    }
  }, [userGameData, userInfoData, gameEventInfo, userGameInfo])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
      scrollToBottom()
  }, [messageData])

  // Modified handleSideSelect to accept a team name
  const handleSideSelect = async () => {
    startInterval();
    setShowModal(false);
  };

  const startInterval = () => {
    getUserGame();
    getUserGameData();
  }

  useEffect(() => {
    if(authState === 'failure')
      router.push('/')
  }, [authState])

  useEffect(() => {
    if(authState === "success" && userInfoData.status < 1)
      router.push('/entry');
  }, [authState])

  if (authState === "pending")
    return (
      <Loading />
    )
  else if (authState === "success" && userInfoData.status >= 1)

  return (
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      {/* Render the modal only if showModal is true and game info is loaded */}
      {showModal && game && gameEventInfo && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <SideSelectionModal 
            onSideSelect={handleSideSelect} 
            teamAName={gameEventInfo.teamA?.name || "Team A"} 
            teamBName={gameEventInfo.teamB?.name || "Team B"} 
            teamAId={gameEventInfo.teamA?.id || "1"}
            teamBId={gameEventInfo.teamB?.id || "2"}
          />
        </div>
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}

      {showEventFeed && (
        <EventFeed onClose={() => setShowEventFeed(false)} />
      )}
      
      <Header
        setShowAboutModal={setShowAboutModal}
        setShowEventFeed={setShowEventFeed}
        handleDisconnect={() => router.push('/connect')}
        // walletAddress={walletAddress}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 md:w-full order-2 md:order-1 min-h-0">
          <div className="flex-none h-[30px] bg-gray-900 border-b border-gray-800 flex items-center px-4">
            <div className="w-1/3 text-left flex items-center">
              <span className="text-xs text-gray-300 font-semibold mr-2">
                {teamA}
              </span>
              <span className="text-xs text-gray-300 font-bold">
                {scoreA}
              </span>
            </div>
            <div className="w-1/3 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-400">
                Q{quarter}
              </span>
              <span className="text-xs text-gray-300 font-semibold">
                {displayClock}
              </span>
            </div>
            <div className="w-1/3 text-right flex items-center justify-end">
              <span className="text-xs text-gray-300 font-bold mr-2">
                {scoreB}
              </span>
              <span className="text-xs text-gray-300 font-semibold">
                {teamB}
              </span>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {messageData && messageData.length &&
                messageData.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.teamName === teamB ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col max-w-[80%]">
                      <span
                        className={`text-xs text-gray-400 mb-0.5 ${
                          message.teamName === teamB ? "text-right" : "text-left"
                        }`}
                      >
                        {message.userName}
                      </span>
                      <div
                        className={`py-2 px-3 rounded-lg ${
                          message.teamName === teamB
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
                            : "bg-gradient-to-r from-indigo-600 to-indigo-700"
                        } text-white text-sm`}
                      >
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex-none bg-gray-900 border-t border-gray-800">
            <form 
              onSubmit={
                (e) => {
                  e.preventDefault(); // Add this to the form
                  // ... rest of your submit handler
                  handleSubmitMessage(e);
                }
              }
              className="p-4"
            >
              <div className="flex flex-col gap-2">
                {charError && (
                  <span className="text-xs text-red-500">
                    Message must be 50 characters or less
                  </span>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Chat here (50 characters or less)..."
                    maxLength={CHARACTER_LIMIT}
                    // disabled={!selectedSide}
                    className={`flex-grow px-4 py-2 bg-gray-800 border border-gray-700 
                             rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                             text-gray-100 placeholder-gray-500 disabled:opacity-50
                             disabled:cursor-not-allowed ${charError ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="submit"
                    // disabled={!selectedSide || charError}
                    className="px-6 bg-gradient-to-r from-indigo-600 to-emerald-600 
                             text-white rounded-lg hover:from-indigo-700 hover:to-emerald-700 
                             transform hover:scale-[1.02] transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <GameEventBar />
        {isScoreModalOpen && <ScoreModal userScore={userGameData.userScore?.score.toString() || ""} onClose={() => setIsScoreModalOpen(false)} getOrLossScore={getOrLossScore} getOrLossSol={getOrLossSol} startScore={startScore} startSol={startSol} />}
      
      </div>
    </div>
  );

  return null
}
