// Game State
        let gameState = {
            playerName: '',
            character: '',
            position: 0,
            score: 0,
            candies: 0,
            streak: 0,
            maxStreak: 0,
            rank: 'ศรัทธา',
            rankIndex: 0,
            xpCorrect: 0,
            siemseeTickets: 2,
            siemseeEarned: 0,
            siemseeUsedThisQ: false,
            currentQuestion: 0,
            isMoving: false,
            inputDisabled: false,
            earnOverlay: false,
            timer: null,
            timeLeft: 20,
            baseTimeLeft: 20,
            earnCooldown: false,
            challengeTimer: null,
            challengeTimeLeft: 10,
            recentQuestions: [],
            currentTile: 1,
            maxTile: 20,
            answered: 0,
            totalQuestions: 20,
            gameEnded: false,
            currentObstacleRate: 0.10,
            // New question management state
            askedSet: new Set(),
            tileQuestionMap: {},
            isShowingQuestion: false,
            answeredUnique: 0,
            currentQId: null,
            questionLoadTimer: null
        };

        // Rank System Constants
        const ranks = ["ศรัทธา", "ศีล", "สมาธิ", "ปัญญา", "นิพพาน"];
        const thresholdsCorrect = [3, 7, 12, 18];
        const timerByRank = [20, 18, 15, 12, 10];
        const obstacleRate = [0.10, 0.15, 0.20, 0.25, 0.30];

        // Questions Database
        const questions = [
            {
                question: "พระพุทธเจ้าตรัสรู้ใต้ต้นอะไร?",
                options: ["ต้นโพธิ์", "ต้นไผ่", "ต้นมะม่วง", "ต้นมะขาม"],
                correct: 0,
                explanation: "พระพุทธเจ้าตรัสรู้ใต้ต้นโพธิ์ ณ พุทธคยา"
            },
            {
                question: "อริยสัจ 4 ประการ คือข้อใด?",
                options: ["ทุกข์ สมุทัย นิโรธ มรรค", "ศีล สมาธิ ปัญญา เมตตา", "ทาน ศีล ภาวนา วิปัสสนา", "สติ สัมปชัญญะ อปปมาท เมตตา"],
                correct: 0,
                explanation: "อริยสัจ 4 คือ ทุกข์ สมุทัย นิโรธ มรรค"
            },
            {
                question: "พระไตรรัตน์ ประกอบด้วยอะไรบ้าง?",
                options: ["พระพุทธ พระธรรม พระสงฆ์", "ศีล สมาธิ ปัญญา", "ทาน ศีล ภาวนา", "กาย วาจา ใจ"],
                correct: 0,
                explanation: "พระไตรรัตน์ คือ พระพุทธ พระธรรม พระสงฆ์"
            },
            {
                question: "ศีล 5 ข้อแรกคือ การไม่ฆ่าสัตว์ ข้อที่ 2 คืออะไร?",
                options: ["ไม่ลักทรัพย์", "ไม่ประพฤติผิดในกาม", "ไม่พูดเท็จ", "ไม่ดื่มสุรา"],
                correct: 0,
                explanation: "ศีล 5 ข้อที่ 2 คือ การไม่ลักทรัพย์"
            },
            {
                question: "วันวิสาขบูชา เป็นวันที่ระลึกถึงเหตุการณ์ใด?",
                options: ["พระพุทธเจ้าประสูติ ตรัสรู้ ปรินิพพาน", "พระพุทธเจ้าออกบวช", "พระพุทธเจ้าแสดงธรรม", "พระพุทธเจ้าเดินทาง"],
                correct: 0,
                explanation: "วันวิสาขบูชาเป็นวันที่พระพุทธเจ้าประสูติ ตรัสรู้ และปรินิพพาน"
            },
            {
                question: "การทำบุญตักบาตรควรทำด้วยจิตใจอย่างไร?",
                options: ["เลื่อมใส เคารพ", "หวังผลตอบแทน", "อวดคนอื่น", "ทำตามประเพณี"],
                correct: 0,
                explanation: "การทำบุญควรทำด้วยจิตเลื่อมใสและเคารพ"
            },
            {
                question: "หลักธรรมข้อใดที่สอนให้รู้จักพอดี?",
                options: ["เศรษฐกิจพอเพียง", "อริยสัจ 4", "ไตรสิกขา", "พรหมวิหาร 4"],
                correct: 0,
                explanation: "หลักเศรษฐกิจพอเพียงสอนให้รู้จักความพอดี"
            },
            {
                question: "การให้ทานมีกี่ประเภท?",
                options: ["3 ประเภท", "4 ประเภท", "5 ประเภท", "6 ประเภท"],
                correct: 0,
                explanation: "การให้ทานมี 3 ประเภท คือ อามิสทาน อภยทาน วิชชาทาน"
            },
            {
                question: "พระพุทธเจ้าเกิดที่ไหน?",
                options: ["สวนลุมพินี", "พุทธคยา", "สารนาถ", "กุสินารา"],
                correct: 0,
                explanation: "พระพุทธเจ้าเกิดที่สวนลุมพินี"
            },
            {
                question: "กรรมดีที่ทำแล้วจะได้ผลดี เรียกว่าอะไร?",
                options: ["กุศลกรรม", "อกุศลกรรม", "อพยากฤตกรรม", "วิบากกรรม"],
                correct: 0,
                explanation: "กรรมดีเรียกว่า กุศลกรรม"
            },
            {
                question: "การปฏิบัติธรรมเพื่อดับทุกข์ เรียกว่าอะไร?",
                options: ["อริยมรรคมีองค์ 8", "ศีล 5", "ไตรสิกขา", "พรหมวิหาร 4"],
                correct: 0,
                explanation: "อริยมรรคมีองค์ 8 คือหนทางดับทุกข์"
            },
            {
                question: "วันมาฆบูชา เป็นวันที่ระลึกถึงเหตุการณ์ใด?",
                options: ["พระสงฆ์มาประชุมกัน 1,250 รูป", "พระพุทธเจ้าตรัสรู้", "พระพุทธเจ้าปรินิพพาน", "พระพุทธเจ้าแสดงธรรม"],
                correct: 0,
                explanation: "วันมาฆบูชาเป็นวันที่พระสงฆ์มาประชุมกัน 1,250 รูป"
            },
            {
                question: "หลักธรรมที่สอนให้มีความเมตตากรุณา คือข้อใด?",
                options: ["พรหมวิหาร 4", "อริยสัจ 4", "ไตรสิกขา", "ศีล 5"],
                correct: 0,
                explanation: "พรหมวิหาร 4 คือ เมตตา กรุณา มุทิตา อุเบกขา"
            },
            {
                question: "การรักษาศีลมีประโยชน์อย่างไร?",
                options: ["ทำให้จิตใจสงบ สะอาด", "ได้เงินทอง", "มีชื่อเสียง", "มีอำนาจ"],
                correct: 0,
                explanation: "การรักษาศีลทำให้จิตใจสงบและสะอาด"
            },
            {
                question: "พระพุทธเจ้าแสดงธรรมครั้งแรกที่ไหน?",
                options: ["ป่าอิสิปตนมฤคทายวัน", "พุทธคยา", "สวนลุมพินี", "กุสินารา"],
                correct: 0,
                explanation: "พระพุทธเจ้าแสดงธรรมครั้งแรกที่ป่าอิสิปตนมฤคทายวัน"
            },
            {
                question: "ไตรสิกขา ประกอบด้วยอะไรบ้าง?",
                options: ["ศีล สมาธิ ปัญญา", "ทาน ศีล ภาวนา", "เมตตา กรุณา มุทิตา", "สติ สัมปชัญญะ อปปมาท"],
                correct: 0,
                explanation: "ไตรสิกขา คือ ศีล สมาธิ ปัญญา"
            },
            {
                question: "การทำความดีเพื่อสังคม เรียกว่าอะไร?",
                options: ["บุญกิริยาวัตถุ", "กุศลกรรม", "ปุญญกิริยา", "ทานมัย"],
                correct: 0,
                explanation: "บุญกิริยาวัตถุ คือการทำความดีเพื่อสังคม"
            },
            {
                question: "วันอาสาฬหบูชา เป็นวันที่ระลึกถึงเหตุการณ์ใด?",
                options: ["พระพุทธเจ้าแสดงธรรมครั้งแรก", "พระพุทธเจ้าตรัสรู้", "พระพุทธเจ้าปรินิพพาน", "พระพุทธเจ้าประสูติ"],
                correct: 0,
                explanation: "วันอาสาฬหบูชาเป็นวันที่พระพุทธเจ้าแสดงธรรมครั้งแรก"
            },
            {
                question: "การปฏิบัติสติ มีประโยชน์อย่างไร?",
                options: ["ทำให้รู้เท่าทันตนเอง", "ได้เงินทอง", "มีชื่อเสียง", "มีอำนาจ"],
                correct: 0,
                explanation: "การปฏิบัติสติทำให้รู้เท่าทันตนเองและสิ่งรอบตัว"
            },
            {
                question: "หลักธรรมที่สอนให้อยู่อย่างมีสติ คือข้อใด?",
                options: ["สติปัฏฐาน 4", "อริยสัจ 4", "ศีล 5", "พรหมวิหาร 4"],
                correct: 0,
                explanation: "สติปัฏฐาน 4 สอนให้มีสติในทุกกิจกรรม"
            }
        ];

        // Show toast notification
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }

        // Check game end conditions
        function checkGameEnd(force = false) {
            if (gameState.gameEnded) return true;
            
            if (force || 
                gameState.currentTile >= gameState.maxTile || 
                gameState.answeredUnique >= 20 || 
                gameState.askedSet.size >= 20) {
                
                gameState.gameEnded = true;
                gameState.inputDisabled = true;
                
                // Lock all inputs
                updateAllButtonStates();
                
                // Hide dice and disable all inputs
                document.getElementById('rollDice').style.display = 'none';
                
                setTimeout(() => {
                    showTempleGateAnimation();
                }, 1000);
                
                return true;
            }
            
            // Re-enable inputs if game continues
            if (!gameState.isShowingQuestion && !gameState.earnOverlay) {
                gameState.inputDisabled = false;
                updateAllButtonStates();
            }
            
            return false;
        }

        // Show temple gate animation
        function showTempleGateAnimation() {
            const overlay = document.getElementById('templeGateOverlay');
            overlay.style.display = 'flex';
            
            setTimeout(() => {
                overlay.classList.add('visible');
            }, 100);
            
            // Hide after animation completes
            setTimeout(() => {
                overlay.classList.remove('visible');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    showGameSummary();
                }, 500);
            }, 4000);
        }

        // Show game summary
        function showGameSummary() {
            // Permanently disable all inputs
            gameState.inputDisabled = true;
            gameState.gameEnded = true;
            updateAllButtonStates();
            
            const modal = document.getElementById('questionModal');
            const questionCard = modal.querySelector('.question-card');
            
            questionCard.innerHTML = `
                <div class="game-summary">
                    <div class="summary-title">🏆 จบเกมแล้ว! 🏆</div>
                    <div class="summary-player">ผลการเล่นของ <strong>${gameState.playerName}</strong></div>
                    
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-value">${gameState.score}</div>
                            <div class="stat-label">คะแนนรวม</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${gameState.rank}</div>
                            <div class="stat-label">แรงค์สุดท้าย</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${gameState.candies}</div>
                            <div class="stat-label">ลูกอมรวม</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${gameState.maxStreak}</div>
                            <div class="stat-label">สตรีคสูงสุด</div>
                        </div>
                    </div>
                    
                    <div class="summary-buttons">
                        <button class="summary-btn" onclick="restartGame()">
                            🎮 เล่นใหม่
                        </button>
                        <button class="summary-btn share" onclick="shareResults()">
                            📤 แชร์ผลงาน
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }

        // Share results function
        function shareResults() {
            const shareText = `🏛️ เกมตอบคำถามธรรมะ ม.6 🏛️\n\n` +
                `ผู้เล่น: ${gameState.playerName}\n` +
                `คะแนนรวม: ${gameState.score} คะแนน\n` +
                `แรงค์สุดท้าย: ${gameState.rank}\n` +
                `ลูกอมรวม: ${gameState.candies} เม็ด\n` +
                `สตรีคสูงสุด: ${gameState.maxStreak} ข้อ\n\n` +
                `มาเล่นกันเถอะ! 🎮`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'เกมตอบคำถามธรรมะ ม.6',
                    text: shareText
                }).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(shareText);
                });
            } else {
                fallbackShare(shareText);
            }
        }
        
        // Fallback share function
        function fallbackShare(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('คัดลอกผลงานแล้ว! นำไปแชร์ได้เลย');
                }).catch(() => {
                    showShareModal(text);
                });
            } else {
                showShareModal(text);
            }
        }
        
        // Show share modal
        function showShareModal(text) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                ">
                    <h3 style="margin-bottom: 1rem; color: #8B4513;">แชร์ผลงาน</h3>
                    <textarea readonly style="
                        width: 100%;
                        height: 150px;
                        padding: 1rem;
                        border: 2px solid #D4AF37;
                        border-radius: 10px;
                        font-family: 'Sarabun', sans-serif;
                        resize: none;
                        margin-bottom: 1rem;
                    ">${text}</textarea>
                    <div>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                            background: #D4AF37;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 10px;
                            cursor: pointer;
                            font-family: 'Sarabun', sans-serif;
                        ">ปิด</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }

        // Restart game
        function restartGame() {
            location.reload();
        }

        // Initialize game
        function initGame() {
            createBoard();
            updateUI();
            positionCharacter();
            document.getElementById('gameHud').classList.add('visible');
        }
        
        // Reset game state
        function resetGameState() {
            gameState.playerName = '';
            gameState.character = '';
            gameState.position = 0;
            gameState.score = 0;
            gameState.candies = 0;
            gameState.streak = 0;
            gameState.rank = 'ศรัทธา';
            gameState.siemseeTickets = 2;
            gameState.siemseeEarned = 0;
            gameState.siemseeUsedThisQ = false;
            gameState.currentQuestion = 0;
            gameState.isMoving = false;
            gameState.inputDisabled = false;
            gameState.timer = null;
            gameState.timeLeft = 30;
            gameState.earnOverlay = false;
            gameState.earnCooldown = false;
            gameState.challengeTimer = null;
            gameState.challengeTimeLeft = 10;
            gameState.recentQuestions = [];
        }
        
        // Dev bypass function
        function devBypass() {
            gameState.playerName = 'ผู้เรียน';
            gameState.character = 'thai';
            document.getElementById('character').innerHTML = `
                <svg viewBox="0 0 60 60" style="width: 100%; height: 100%;">
                    <circle cx="30" cy="21" r="11" fill="#F4A460" stroke="#D4AF37" stroke-width="1"/>
                    <path d="M19,32 Q30,26 41,32 L38,44 Q30,50 22,44 Z" fill="#FF1493" stroke="#D4AF37" stroke-width="1"/>
                    <path d="M24,32 Q30,29 36,32" stroke="#FFD700" stroke-width="1" fill="none"/>
                    <circle cx="27" cy="19" r="1" fill="#8B4513"/>
                    <circle cx="33" cy="19" r="1" fill="#8B4513"/>
                    <path d="M27,24 Q30,27 33,24" stroke="#8B4513" stroke-width="1" fill="none"/>
                    <path d="M21,15 Q30,9 39,15" stroke="#8B4513" stroke-width="2" fill="none"/>
                </svg>
            `;
            document.getElementById('startScreen').classList.add('hidden');
            initGame();
        }

        // Create board
        function createBoard() {
            const boardPath = document.getElementById('boardPath');
            boardPath.innerHTML = '';
            
            for (let i = 0; i < 20; i++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                
                const cellNumber = document.createElement('div');
                cellNumber.className = 'cell-number';
                cellNumber.textContent = i + 1;
                
                const cellIcon = document.createElement('div');
                cellIcon.className = 'cell-icon';
                
                // Special cells with proper styling
                if (i === 0) {
                    cell.classList.add('start-cell');
                    cellIcon.textContent = '🏁';
                } else if (i === 19) {
                    cell.classList.add('goal-cell');
                    cellIcon.textContent = '🏆';
                } else if ([4, 9, 14, 18].includes(i)) {
                    cell.classList.add('special-boon');
                    cellIcon.textContent = '🙏';
                } else if ([6, 12, 16].includes(i)) {
                    cell.classList.add('special-karma');
                    cellIcon.textContent = '⚡';
                } else if ([10, 19].includes(i)) {
                    cell.classList.add('boss-quiz');
                    cellIcon.textContent = '🕯️';
                } else {
                    cellIcon.textContent = '🪷';
                }
                
                cell.appendChild(cellNumber);
                cell.appendChild(cellIcon);
                boardPath.appendChild(cell);
            }
        }

        // Position character
        function positionCharacter() {
            const character = document.getElementById('character');
            const cells = document.querySelectorAll('.board-cell');
            const targetCell = cells[gameState.position];
            
            if (targetCell) {
                const rect = targetCell.getBoundingClientRect();
                const boardRect = document.querySelector('.game-board').getBoundingClientRect();
                
                character.style.left = (rect.left - boardRect.left + rect.width/2 - 30) + 'px';
                character.style.top = (rect.top - boardRect.top + rect.height/2 - 30) + 'px';
            }
        }

        // Create lotus effect
        function createLotus(x, y) {
            const lotus = document.createElement('div');
            lotus.className = 'lotus';
            lotus.innerHTML = `
                <svg viewBox="0 0 40 40">
                    <g transform="translate(20,20)">
                        <path d="M0,-15 Q-8,-8 -15,0 Q-8,8 0,15 Q8,8 15,0 Q8,-8 0,-15" 
                              fill="#FFD700" stroke="#D19B00" stroke-width="1" opacity="0.8"/>
                        <path d="M0,-12 Q-6,-6 -12,0 Q-6,6 0,12 Q6,6 12,0 Q6,-6 0,-12" 
                              fill="#FFF7D6" opacity="0.6"/>
                        <circle cx="0" cy="0" r="3" fill="#FFB84D"/>
                    </g>
                </svg>
            `;
            
            lotus.style.left = x + 'px';
            lotus.style.top = y + 'px';
            
            document.querySelector('.game-board').appendChild(lotus);
            
            setTimeout(() => {
                if (lotus.parentNode) {
                    lotus.parentNode.removeChild(lotus);
                }
            }, 1200);
        }

        // Move character
        function moveCharacter(steps) {
            if (gameState.isMoving || gameState.gameEnded) return;
            
            // INPUT GUARD: Disable inputs during movement
            gameState.isMoving = true;
            gameState.inputDisabled = true;
            updateAllButtonStates();
            
            const character = document.getElementById('character');
            character.classList.add('moving');
            
            let currentStep = 0;
            
            function moveStep() {
                if (currentStep < steps && gameState.position < 19) {
                    gameState.position++;
                    gameState.currentTile = gameState.position + 1;
                    positionCharacter();
                    
                    // Create lotus effect
                    const rect = character.getBoundingClientRect();
                    const boardRect = document.querySelector('.game-board').getBoundingClientRect();
                    createLotus(
                        rect.left - boardRect.left + 15,
                        rect.top - boardRect.top + 45
                    );
                    
                    currentStep++;
                    setTimeout(moveStep, 550);
                } else {
                    character.classList.remove('moving');
                    gameState.isMoving = false;
                    
                    // Update current tile
                    gameState.currentTile = gameState.position + 1;
                    
                    // INPUT GUARD: Keep disabled until after special cell processing
                    // Will be re-enabled in checkSpecialCell or showQuestion
                    
                    // Check for special cell
                    checkSpecialCell();
                }
            }
            
            moveStep();
        }

        // Question Management Functions
        function getOrAssignQuestion(tileId) {
            // Check if tile already has a question assigned and it hasn't been asked
            if (gameState.tileQuestionMap[tileId] && !gameState.askedSet.has(gameState.tileQuestionMap[tileId])) {
                return gameState.tileQuestionMap[tileId];
            }
            
            // Need to assign a new question - find first unasked question
            const fresh = findFirstUnaskedQuestion();
            if (fresh !== null) {
                gameState.tileQuestionMap[tileId] = fresh;
                return fresh;
            }
            
            return null; // No questions available
        }
        
        function findFirstUnaskedQuestion() {
            for (let i = 0; i < questions.length; i++) {
                if (!gameState.askedSet.has(i)) {
                    return i;
                }
            }
            return null;
        }
        
        function pullFromBank() {
            // Last resort - find any unasked question
            return findFirstUnaskedQuestion();
        }
        
        function showSkeletonCard() {
            const modal = document.getElementById('questionModal');
            const questionCard = modal.querySelector('.question-card');
            
            questionCard.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
                    <div style="color: #8B4513;">กำลังโหลดคำถาม...</div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
        
        function showRetryOptions(qid) {
            const modal = document.getElementById('questionModal');
            const questionCard = modal.querySelector('.question-card');
            
            questionCard.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <div style="color: #8B4513; margin-bottom: 2rem;">โหลดคำถามช้า ลองใหม่หรือข้ามได้</div>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="retryQuestion(${qid})" style="
                            background: linear-gradient(45deg, #FF6B35, #F7931E);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 15px;
                            cursor: pointer;
                            font-family: 'Kanit', sans-serif;
                            font-weight: 500;
                        ">ลองใหม่</button>
                        <button onclick="skipQuestion()" style="
                            background: linear-gradient(45deg, #666, #888);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 15px;
                            cursor: pointer;
                            font-family: 'Kanit', sans-serif;
                            font-weight: 500;
                        ">ข้ามข้อ</button>
                    </div>
                </div>
            `;
        }
        
        function retryQuestion(qid) {
            showQuestionWithTimeout(qid, 800);
        }
        
        function skipQuestion() {
            markSkipped();
            afterAnswer(false, false); // Don't count as unique answer
        }
        
        function markSkipped() {
            if (gameState.currentQId !== null) {
                gameState.askedSet.add(gameState.currentQId);
            }
        }
        
        function showQuestionWithTimeout(qid, timeoutMs) {
            if (gameState.isShowingQuestion) return; // Prevent duplicate calls
            
            gameState.isShowingQuestion = true;
            gameState.currentQId = qid;
            
            showSkeletonCard();
            
            // Set timeout for fallback
            gameState.questionLoadTimer = setTimeout(() => {
                fallbackHandler(qid);
            }, timeoutMs);
            
            // Try to load question (simulate async loading)
            setTimeout(() => {
                tryLoadQuestion(qid);
            }, 100);
        }
        
        function tryLoadQuestion(qid) {
            // Simulate loading success/failure
            const loadSuccess = true; // In real app, this would be actual loading result
            
            if (loadSuccess && gameState.questionLoadTimer) {
                clearTimeout(gameState.questionLoadTimer);
                gameState.questionLoadTimer = null;
                renderQuestion(qid);
            }
        }
        
        function fallbackHandler(qid) {
            // Bring question card to front and show retry options
            const modal = document.getElementById('questionModal');
            modal.style.zIndex = '9999';
            modal.style.pointerEvents = 'auto';
            
            showToast('โหลดคำถามช้า ลองใหม่/ข้ามได้');
            showRetryOptions(qid);
        }
        
        function renderQuestion(qid) {
    gameState.currentQuestion = qid;
            if (qid === null || qid >= questions.length) {
                fallbackHandler(qid);
                return;
            }
            
            const question = questions[qid];
            const modal = document.getElementById('questionModal');
            const questionCard = modal.querySelector('.question-card');
            
            // Hide skeleton and restore original question card structure
            questionCard.innerHTML = `
                <div class="timer-container">
                    <div class="water-drop"></div>
                    <div class="timer" id="timer">${gameState.baseTimeLeft}</div>
                </div>
                <div class="question-text" id="questionText">${question.question}</div>
                <div class="options" id="options"></div>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="siemsee-hint-btn" id="hintBtn">🔮 เขย่าเซียมซี</button>
                    <button class="earn-siemsee-btn" id="earnBtn">อยากได้เซียมซีเพิ่มใช่ไหม??</button>
                </div>
            `;
            
            // Setup options
            const options = document.getElementById('options');
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.onclick = () => answerQuestion(index);
                options.appendChild(btn);
            });
            
            // Setup buttons
            const hintBtn = document.getElementById('hintBtn');
            const earnBtn = document.getElementById('earnBtn');
            
            updateSiemseeButton();
            hintBtn.onclick = useSiemsee;
            
            updateEarnButton();
            earnBtn.onclick = openEarnOverlay10s;
            
            // Focus on question card and re-enable inputs
            focusOnQuestionCard();
            gameState.inputDisabled = false;
            updateAllButtonStates();
            
            const cells = document.querySelectorAll('.board-cell');
            const currentCell = cells[gameState.position];
            const isBoss = currentCell.classList.contains('boss-quiz');
            
            startTimer(isBoss);
        }
        
        function focusOnQuestionCard() {
            const modal = document.getElementById('questionModal');
            modal.style.zIndex = '600';
            modal.style.pointerEvents = 'auto';
        }
        
        function ensureQuestionForTile() {
            if (gameState.isShowingQuestion) return; // Prevent duplicate calls
            
            let qid = getOrAssignQuestion(gameState.currentTile);
            if (qid === null) {
                // Try to pull from bank as backup
                qid = pullFromBank();
                if (qid === null) {
                    // No questions available - force game end
                    checkGameEnd(true);
                    return;
                }
            }
            
            showQuestionWithTimeout(qid, 800);
        }

        // On Enter Tile - Main entry point
        function onEnterTile(tileId) {
            gameState.inputDisabled = true;
            closeAllOverlaysNotInUse();
            runTileEventIfAny(tileId, ensureQuestionForTile);
        }

        // Close all overlays not in use
        function closeAllOverlaysNotInUse() {
            const challengeOverlay = document.getElementById('challengeOverlay');
            challengeOverlay.style.pointerEvents = 'none';
            challengeOverlay.classList.remove('visible');
        }

        // Run tile event if any, then callback
        function runTileEventIfAny(tileId, afterEvent) {
            const cells = document.querySelectorAll('.board-cell');
            const currentCell = cells[gameState.position];
            
            if (currentCell.classList.contains('special-boon')) {
                showFeedback('🙏 ได้รับบุญ! +1 ก้าว', 'correct');
                gameState.score += 10;
                setTimeout(() => {
                    if (!checkGameEnd()) {
                        moveCharacter(1);
                    }
                }, 1500);
                return;
            } else if (currentCell.classList.contains('special-karma')) {
                showFeedback('⚡ วิบากกรรม! ถอยหลัง 1 ก้าว', 'incorrect');
                gameState.score = Math.max(0, gameState.score - 5);
                if (gameState.position > 0) {
                    gameState.position--;
                    gameState.currentTile = gameState.position + 1;
                    positionCharacter();
                }
                setTimeout(() => {
                    gameState.inputDisabled = false;
                    updateAllButtonStates();
                    checkGameEnd();
                }, 1500);
                return;
            }
            
            // For all other tiles (including boss), proceed to question
            afterEvent();
            updateUI();
        }

        // Check special cell (legacy wrapper)
        function checkSpecialCell() {
            onEnterTile(gameState.currentTile);
        }

        // Roll dice
        function rollDice() {
            if (gameState.inputDisabled || gameState.isMoving || gameState.earnOverlay || gameState.gameEnded) return;
            
            // INPUT GUARD: Disable all inputs during dice roll
            gameState.inputDisabled = true;
            updateAllButtonStates();
            
            const diceBtn = document.getElementById('rollDice');
            const diceContainer = document.getElementById('diceContainer');
            const dice = document.getElementById('dice');
            
            diceContainer.style.display = 'block';
            
            // Animate dice
            let rollCount = 0;
            const rollInterval = setInterval(() => {
                dice.textContent = Math.floor(Math.random() * 6) + 1;
                rollCount++;
                
                if (rollCount > 20) {
                    clearInterval(rollInterval);
                    const result = Math.floor(Math.random() * 6) + 1;
                    dice.textContent = result;
                    
                    setTimeout(() => {
                        diceContainer.style.display = 'none';
                        if (!gameState.gameEnded) {
                            moveCharacter(result);
                            // INPUT GUARD: Re-enable inputs after dice animation
                            gameState.inputDisabled = false;
                            updateAllButtonStates();
                        }
                    }, 1000);
                }
            }, 100);
        }

        // Show question
        function showQuestion(isBoss = false, isFinal = false) {
            if (gameState.gameEnded) return;
            
            // INPUT GUARD: Disable inputs while setting up question
            gameState.inputDisabled = true;
            updateAllButtonStates();
            
            const modal = document.getElementById('questionModal');
            const questionText = document.getElementById('questionText');
            const options = document.getElementById('options');
            const hintBtn = document.getElementById('hintBtn');
            const earnBtn = document.getElementById('earnBtn');
            
            // Reset siemsee state for new question
            gameState.siemseeUsedThisQ = false;
            
            // Select random question
            const questionIndex = Math.floor(Math.random() * questions.length);
            const question = questions[questionIndex];
            gameState.currentQuestion = questionIndex;
            
            // Track recent questions
            gameState.recentQuestions.push(questionIndex);
            if (gameState.recentQuestions.length > 3) {
                gameState.recentQuestions.shift();
            }
            
            questionText.textContent = question.question;
            options.innerHTML = '';
            
            // Create option buttons
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.onclick = () => answerQuestion(index, isFinal);
                options.appendChild(btn);
            });
            
            // Setup hint button - always show on question screen
            hintBtn.style.display = 'block';
            updateSiemseeButton();
            hintBtn.onclick = useSiemsee;
            
            // Setup earn button
            updateEarnButton();
            earnBtn.onclick = openEarnOverlay10s;
            
            modal.style.display = 'flex';
            
            // INPUT GUARD: Re-enable inputs after question is fully set up
            gameState.inputDisabled = false;
            updateAllButtonStates();
            
            startTimer(isBoss);
        }

        // Answer question
        function answerQuestion(selectedIndex, isFinal = false) {
            // INPUT GUARD: Disable inputs during answer processing
            gameState.inputDisabled = true;
            updateAllButtonStates();
            
            const question = questions[gameState.currentQId];
            const isCorrect = selectedIndex === question.correct;
            
            stopTimer();
            
            if (isCorrect) {
                // XP and progression system
                gameState.xpCorrect++;
                gameState.score += 10;
                gameState.streak++;
                gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
                gameState.candies += Math.floor(Math.random() * 3) + 1;
                
                showFeedback('🎉 ถูกต้อง!', 'correct', question.explanation);
                createParticles();
                
                // Check for rank progression
                setTimeout(() => {
                    checkRankProgression();
                }, 1000);
                
            } else {
                gameState.streak = 0;
                showFeedback('❌ ไม่ถูกต้อง', 'incorrect', question.explanation);
                
                // Move back one step (but not below 0)
                if (gameState.position > 0) {
                    gameState.position--;
                    gameState.currentTile = gameState.position + 1;
                    positionCharacter();
                }
            }
            
            // Use new answer flow
            afterAnswer(isCorrect, true);
            
            // Re-enable inputs after feedback period
            setTimeout(() => {
                gameState.inputDisabled = false;
                updateAllButtonStates();
            }, 3000);
        }
        
        // New answer flow function
        function afterAnswer(isCorrect, countUnique = true) {
            if (countUnique && gameState.currentQId !== null && !gameState.askedSet.has(gameState.currentQId)) {
                gameState.askedSet.add(gameState.currentQId);
                gameState.answeredUnique++;
            }
            
            gameState.isShowingQuestion = false;
            gameState.inputDisabled = true;
            gameState.siemseeUsedThisQ = false;
            
            // Close question modal
            document.getElementById('questionModal').style.display = 'none';
            
            // Reset for next question
            updateEarnButton();
            updateUI();
            checkGameEnd();
        }

        // Update Siemsee button state
        function updateSiemseeButton() {
            const hintBtn = document.getElementById('hintBtn');
            
            if (gameState.siemseeUsedThisQ) {
                hintBtn.textContent = '🔮 ใช้แล้ว';
            } else {
                hintBtn.textContent = '🔮 เขย่าเซียมซี';
            }
            
            // Button state is handled by updateAllButtonStates()
        }
        
        // Update earn button state
        function updateEarnButton() {
            // Button state is handled by updateAllButtonStates()
        }

        // Use Siemsee (main button press handler)
        function useSiemsee() {
            // INPUT GUARD: Check if inputs are disabled
            if (gameState.inputDisabled) {
                return;
            }
            
            // Check if has tickets - use immediately
            if (gameState.siemseeTickets > 0) {
                useSiemseeNow();
                return;
            }
            
            // Check if can earn more (max 2 per game)
            if (gameState.siemseeEarned < 2) {
                openEarnOverlay10s();
                return;
            }
            
            // Max quota reached
            showToast('ครบโควต้าเพิ่ม 2 ครั้ง/เกมแล้ว');
        }
        
        // Actually use siemsee ticket
        function useSiemseeNow() {
            if (gameState.siemseeUsedThisQ) {
                showToast('ใช้แล้วในข้อนี้');
                return;
            }
            
            // Mark as used and consume ticket
            gameState.siemseeUsedThisQ = true;
            gameState.siemseeTickets = Math.max(0, gameState.siemseeTickets - 1);
            
            playSiemseeAnim();
            showHint();
            
            updateSiemseeButton();
            updateUI();
        }
        
        // Play Siemsee animation with wood rattle effect
        function playSiemseeAnim() {
            const hintBtn = document.getElementById('hintBtn');
            
            // Combined shake and wood rattle animation (800ms)
            hintBtn.style.animation = 'siemseeShake 0.8s ease-in-out, woodRattle 0.8s ease-in-out';
            
            setTimeout(() => {
                hintBtn.style.animation = '';
            }, 800);
        }
        
        // Show hint with feedback
        function showHint() {
            const question = questions[gameState.currentQuestion];
            const hintText = getHint(question);
            showFeedback('🔮 เซียมซี: ' + hintText, 'correct');
        }
        
        // Open earn overlay (10-second challenge)
        function openEarnOverlay10s() {
            // Check conditions
            if (gameState.siemseeEarned >= 2) {
                showToast('ครบโควต้าเพิ่ม 2 ครั้ง/เกมแล้ว');
                return;
            }
            
            if (gameState.inputDisabled) {
                return;
            }
            
            // INPUT GUARD: Disable all inputs during earn overlay
            gameState.earnOverlay = true;
            gameState.inputDisabled = true;
            updateAllButtonStates();
            hideDiceFAB();
            pauseMainQuestionTimer();
            
            // Select random question (avoid current and recent)
            const availableQuestions = questions.map((q, index) => index)
                .filter(index => 
                    index !== gameState.currentQuestion && 
                    !gameState.recentQuestions.includes(index)
                );
            
            const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            const question = questions[questionIndex];
            
            // Setup challenge UI
            const overlay = document.getElementById('challengeOverlay');
            const questionEl = document.getElementById('challengeQuestion');
            const optionsEl = document.getElementById('challengeOptions');
            const timerEl = document.getElementById('challengeTimer');
            const timerCircle = document.getElementById('challengeTimerCircle');
            
            questionEl.textContent = question.question;
            optionsEl.innerHTML = '';
            
            // Create option buttons
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'challenge-option-btn';
                btn.textContent = option;
                btn.onclick = () => submitChallengeAnswer(index, questionIndex);
                optionsEl.appendChild(btn);
            });
            
            // Show overlay
            overlay.style.display = 'flex';
            overlay.style.pointerEvents = 'auto';
            setTimeout(() => overlay.classList.add('visible'), 10);
            
            // Start timer
            gameState.challengeTimeLeft = 10;
            timerCircle.classList.remove('warning');
            startChallengeTimer();
        }
        
        // Start challenge timer (fixed 10 seconds)
        function startChallengeTimer() {
            const timerEl = document.getElementById('challengeTimer');
            const timerCircle = document.getElementById('challengeTimerCircle');
            
            gameState.challengeTimeLeft = 10; // Always 10 seconds for challenge
            updateChallengeTimer();
            
            gameState.challengeTimer = setInterval(() => {
                gameState.challengeTimeLeft -= 0.1;
                
                if (gameState.challengeTimeLeft <= 0) {
                    stopChallengeTimer();
                    challengeFail();
                    return;
                }
                
                // Warning state in last 3 seconds
                if (gameState.challengeTimeLeft <= 3 && !timerCircle.classList.contains('warning')) {
                    timerCircle.classList.add('warning');
                    // Soft beep effect (visual only due to audio limitations)
                }
                
                updateChallengeTimer();
            }, 100);
        }
        
        // Update challenge timer display
        function updateChallengeTimer() {
            const timerEl = document.getElementById('challengeTimer');
            timerEl.textContent = Math.ceil(gameState.challengeTimeLeft);
        }
        
        // Stop challenge timer
        function stopChallengeTimer() {
            if (gameState.challengeTimer) {
                clearInterval(gameState.challengeTimer);
                gameState.challengeTimer = null;
            }
        }
        
        // Submit challenge answer
        function submitChallengeAnswer(selectedIndex, questionIndex) {
            if (gameState.challengeTimeLeft <= 0) {
                challengeFail();
                return;
            }
            
            stopChallengeTimer();
            
            const question = questions[questionIndex];
            const isCorrect = selectedIndex === question.correct;
            
            // Mark challenge question as asked (track in askedSet)
            gameState.askedSet.add(questionIndex);
            
            if (isCorrect) {
                challengeSuccess();
            } else {
                challengeFail();
            }
        }
        
        // Challenge success
        function challengeSuccess() {
            gameState.siemseeEarned += 1;
            if (gameState.siemseeEarned > 2) gameState.siemseeEarned = 2;
            gameState.siemseeTickets += 1;
            
            closeChallengeOverlay();
            showToast('🎉 ชนะด่าน! ได้เซียมซี +1 และใช้ทันที');
            
            // Use immediately with current question (net result: tickets stay same)
            setTimeout(() => {
                useSiemseeNow();
            }, 500);
        }
        
        // Challenge fail
        function challengeFail() {
            closeChallengeOverlay();
            showToast('ไม่ทันเวลา—ลองใหม่ในข้อถัดไป');
        }
        
        // Close challenge overlay
        function closeChallengeOverlay() {
            const overlay = document.getElementById('challengeOverlay');
            const timerCircle = document.getElementById('challengeTimerCircle');
            
            gameState.earnOverlay = false;
            overlay.classList.remove('visible');
            timerCircle.classList.remove('warning');
            
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
                
                // INPUT GUARD: Re-enable inputs after overlay closes
                gameState.inputDisabled = false;
                updateAllButtonStates();
                showDiceFAB();
                resumeMainQuestionTimer();
            }, 250);
        }
        
        // Hide dice FAB
        function hideDiceFAB() {
            const diceFab = document.getElementById('rollDice');
            diceFab.style.display = 'none';
        }
        
        // Show dice FAB
        function showDiceFAB() {
            const diceFab = document.getElementById('rollDice');
            diceFab.style.display = 'flex';
        }
        


        // Get hint for question
        function getHint(question) {
            const hints = [
                "คิดถึงต้นไม้ที่พระพุทธเจ้านั่งสมาधิ",
                "จำหลัก 4 ข้อที่เป็นความจริงของชีวิต",
                "นึกถึงสิ่งศักดิ์สิทธิ์ 3 อย่างที่พุทธศาสนิกเคารพ",
                "คิดถึงการไม่เอาของคนอื่น",
                "วันสำคัญที่มีเหตุการณ์ 3 อย่างเกิดขึ้น",
                "การให้ด้วยใจที่บริสุทธิ์",
                "หลักเศรษฐกิจที่พระราชทานให้คนไทย",
                "การให้มี 3 แบบ",
                "สถานที่เกิดของพระพุทธเจ้า",
                "กรรมที่ทำแล้วได้ผลดี"
            ];
            
            return hints[gameState.currentQuestion % hints.length] || "ใช้สติปัญญาในการตอบ";
        }

        // Timer functions
        function startTimer(isBoss = false) {
            // Apply rank-based timer scaling
            let baseTime = gameState.baseTimeLeft;
            
            // Boss questions get 2 seconds less
            if (isBoss) {
                baseTime = Math.max(5, baseTime - 2);
            }
            
            gameState.timeLeft = baseTime;
            updateTimer();
            
            gameState.timer = setInterval(() => {
                gameState.timeLeft--;
                updateTimer();
                
                if (gameState.timeLeft <= 0) {
                    stopTimer();
                    answerQuestion(-1); // Wrong answer
                }
            }, 1000);
        }

        function stopTimer() {
            if (gameState.timer) {
                clearInterval(gameState.timer);
                gameState.timer = null;
            }
        }
        
        function pauseMainQuestionTimer() {
            if (gameState.timer) {
                clearInterval(gameState.timer);
                gameState.timer = null;
            }
        }
        
        function resumeMainQuestionTimer() {
            if (gameState.timeLeft > 0) {
                gameState.timer = setInterval(() => {
                    gameState.timeLeft--;
                    updateTimer();
                    
                    if (gameState.timeLeft <= 0) {
                        stopTimer();
                        answerQuestion(-1); // Wrong answer
                    }
                }, 1000);
            }
        }

        function updateTimer() {
            document.getElementById('timer').textContent = gameState.timeLeft;
        }

        // Show feedback
        function showFeedback(text, type, explanation = '') {
            const feedback = document.getElementById('feedback');
            const feedbackText = document.getElementById('feedbackText');
            const feedbackExplanation = document.getElementById('feedbackExplanation');
            
            feedbackText.textContent = text;
            feedbackExplanation.textContent = explanation;
            feedback.className = `feedback ${type}`;
            feedback.style.display = 'block';
            
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }

        // Create particles
        function createParticles() {
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle lotus-particle';
                    
                    const character = document.getElementById('character');
                    const rect = character.getBoundingClientRect();
                    const boardRect = document.querySelector('.game-board').getBoundingClientRect();
                    
                    particle.style.left = (rect.left - boardRect.left + Math.random() * 60) + 'px';
                    particle.style.top = (rect.top - boardRect.top + Math.random() * 60) + 'px';
                    
                    document.querySelector('.game-board').appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 2000);
                }, i * 100);
            }
        }

        // Apply scaling based on current rank
        function applyScaling() {
            gameState.baseTimeLeft = timerByRank[gameState.rankIndex];
            gameState.currentObstacleRate = obstacleRate[gameState.rankIndex];
            
            // Update HUD to show current difficulty
            updateUI();
        }

        // Play rank up animation and effects
        function playRankUp() {
            const newRankName = ranks[gameState.rankIndex];
            
            // Create rank up notification
            const rankUpNotification = document.createElement('div');
            rankUpNotification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                border: 4px solid #D4AF37;
                border-radius: 25px;
                padding: 2rem;
                font-family: 'Kanit', sans-serif;
                font-size: 1.5rem;
                font-weight: 700;
                color: #8B4513;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: rankUpPop 3s ease-out forwards;
            `;
            
            rankUpNotification.innerHTML = `
                <div style="margin-bottom: 1rem;">🎉 เลื่อนระดับ! 🎉</div>
                <div style="font-size: 2rem; margin: 1rem 0;">${newRankName}</div>
                <div style="font-size: 1rem; opacity: 0.8;">ความยากเพิ่มขึ้น - เวลาลดลง!</div>
            `;
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rankUpPop {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(rankUpNotification);
            
            // Create particles for celebration
            createRankUpParticles();
            
            // Remove notification after animation
            setTimeout(() => {
                if (rankUpNotification.parentNode) {
                    rankUpNotification.parentNode.removeChild(rankUpNotification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 3000);
        }

        // Create rank up particles
        function createRankUpParticles() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: fixed;
                        width: 15px;
                        height: 15px;
                        background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 999;
                        left: ${50 + (Math.random() - 0.5) * 20}%;
                        top: ${50 + (Math.random() - 0.5) * 20}%;
                        animation: rankParticle 2s ease-out forwards;
                    `;
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 2000);
                }, i * 50);
            }
            
            // Add particle animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rankParticle {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1) rotate(180deg);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(0) rotate(360deg) translateY(-100px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 2500);
        }

        // Check for rank progression
        function checkRankProgression() {
            if (gameState.rankIndex < thresholdsCorrect.length && 
                gameState.xpCorrect >= thresholdsCorrect[gameState.rankIndex]) {
                
                gameState.rankIndex++;
                gameState.rank = ranks[gameState.rankIndex];
                
                playRankUp();
                applyScaling();
                
                return true;
            }
            return false;
        }

        // Update all button states based on inputDisabled
        function updateAllButtonStates() {
            const diceBtn = document.getElementById('rollDice');
            const hintBtn = document.getElementById('hintBtn');
            const earnBtn = document.getElementById('earnBtn');
            
            // Dice button
            if (diceBtn) {
                diceBtn.disabled = gameState.inputDisabled || gameState.isMoving || gameState.earnOverlay || gameState.gameEnded;
            }
            
            // Siemsee hint button (only if question modal is open)
            if (hintBtn && document.getElementById('questionModal').style.display === 'flex') {
                const isEnabled = (!gameState.inputDisabled) && (!gameState.siemseeUsedThisQ);
                hintBtn.disabled = !isEnabled;
            }
            
            // Earn button (only if question modal is open)
            if (earnBtn && document.getElementById('questionModal').style.display === 'flex') {
                const shouldShow = gameState.siemseeEarned < 2 && !gameState.inputDisabled;
                if (shouldShow) {
                    earnBtn.style.display = 'block';
                    earnBtn.disabled = gameState.inputDisabled;
                } else if (gameState.siemseeEarned >= 2) {
                    earnBtn.style.display = 'none';
                } else {
                    earnBtn.style.display = 'block';
                    earnBtn.disabled = true;
                }
            }
        }

        // Update UI
        function updateUI() {
            document.getElementById('currentTile').textContent = gameState.currentTile;
            document.getElementById('maxTile').textContent = gameState.maxTile;
            document.getElementById('answered').textContent = gameState.answeredUnique; // Use unique count
            document.getElementById('candies').textContent = gameState.candies;
            document.getElementById('rank').textContent = gameState.rank;
            document.getElementById('streak').textContent = gameState.streak;
            document.getElementById('siemseeCount').textContent = gameState.siemseeTickets;
            document.getElementById('currentTimer').textContent = gameState.timeLeft || '?';
            
            // Update button states
            updateAllButtonStates();
        }

        // Event listeners
        document.getElementById('startGame').addEventListener('click', () => {
    const nameInput = document.getElementById('playerName');
    if(!nameInput.value.trim()){
        showToast('กรุณาใส่ชื่อผู้เรียนก่อนเริ่มเกม');
        nameInput.focus();
        return;
    }
    gameState.playerName = nameInput.value.trim();
    gameState.character = 'buddha';
    const holder = document.getElementById('character');
    const imgSrc = (document.getElementById('avatarPreview')||{}).src || '';
    if(imgSrc){ holder.innerHTML = '<img src="'+imgSrc+'" alt="avatar" />'; }
    document.getElementById('startScreen').classList.add('hidden');
    initGame();
});

        document.getElementById('rollDice').addEventListener('click', rollDice);

        // Character selection
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        // Initialize
        window.addEventListener('resize', positionCharacter);
    

// --------- extracted from source --------- 

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97e58bc807764ba1',t:'MTc1Nzc0NDUwMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();