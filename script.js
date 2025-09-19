
// === Character sprite helper (added) ===
function setCharacterSprite() {
    try {
        const el = document.getElementById('character');
        if (!el) return;
        const isBuddha = gameState && gameState.character === 'buddha';
        const src = isBuddha ? './buddha.png' : './villager.png';
        const alt = isBuddha ? 'พระพุทธเจ้า' : 'ชาวบ้าน';
        el.innerHTML = '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:100%;object-fit:contain;" />';
    } catch (e) {
        console.warn('setCharacterSprite error:', e);
    }
}
// === End helper ===
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
                question: "รูปแบบการเมืองการปกครองของแต่ละประเทศมักสัมพันธ์กับสิ่งใด?",
                options: ["ลักษณะทางภูมิศาสตร์", "ความต้องการของผู้นำประเทศ", "การดำเนินกิจกรรมทางเศรษฐกิจของประชาชน", "สภาพแวดล้อมทางเศรษฐกิจ สังคม และวัฒนธรรมของประเทศนั้น ๆ"],
                correct: 3,
                explanation: "ปัจจัยพื้นฐานของสังคม เช่น เศรษฐกิจ สังคม วัฒนธรรม ส่งผลต่อรูปแบบการปกครองมากที่สุด"
            },
            {
                question: "ลักษณะของระบอบประชาธิปไตยเป็นอย่างไร?",
                options: ["มีการควบคุมสื่ออย่างเข้มงวด", "ผู้นำมีอำนาจเบ็ดเสร็จ", "มีพรรคการเมืองเพียงพรรคเดียว", "ภาครัฐอยู่เหนือกฎหมาย", "เคารพสิทธิ เสรีภาพ ความเสมอภาค มีส่วนร่วมและตรวจสอบถ่วงดุล"],
                correct: 4,
                explanation: "ประชาธิปไตยต้องเคารพสิทธิ เสรีภาพ ความเสมอภาคของประชาชน และมีการตรวจสอบถ่วงดุล"
            },
            {
                question: "รูปแบบการปกครองของประเทศในข้อใดต่างจากประเทศอื่น",
                options: ["บรูไน", "ญี่ปุ่น", "อินเดีย", "บราซิล"],
                correct: 0,
                explanation: "บรูไนเป็นสมบูรณาญาสิทธิราชย์ ส่วนประเทศอื่นเป็นประชาธิปไตยแบบรัฐธรรมนูญ"
            },
            {
                question: "ประเทศที่ปกครองโดยพรรคการเมืองเพียงพรรคเดียว และรัฐมีบทบาทครอบครองปัจจัยการผลิตเป็นหลัก คือประเทศใด",
                options: ["จีน", "อิรัก", "อินเดีย", "บราซิล"],
                correct: 0,
                explanation: "จีนมีระบบพรรคคอมมิวนิสต์พรรคเดียว"
            },
            {
                question: "จากข้อ 4 ประเทศดังกล่าวมีลักษณะพิเศษที่เป็นแบบฉบับของตนเองอย่างไร",
                options: ["ให้สิทธิเสรีภาพแก่ประชาชนในการจัดตั้งพรรคการเมือง", "มีรัฐธรรมนูญเป็นกฎหมายสูงสุด", "ขึ้นสู่อำนาจโดยเสียงข้างมากจากการเลือกตั้งของประชาชน", "เปิดกว้างให้นักลงทุนต่างชาติเข้ามาลงทุนและผลิตเพื่อส่งออก", "สนับสนุนให้เอกชนนำเงินลงทุนมากในการบริหารประเทศ"],
                correct: 3,
                explanation: "นโยบายเปิดประเทศดึงดูดการลงทุนต่างชาติเป็นจุดเด่นสำคัญยุคปัจจุบัน"
            },
            {
                question: "“ประเทศไทยเป็นราชอาณาจักรอันหนึ่งอันเดียว จะแบ่งแยกมิได้” ข้อความนี้สะท้อนลักษณะใดของการเมืองการปกครองไทย",
                options: ["ใช้ระบบสภาคู่", "มีรูปแบบของรัฐเป็นรัฐเดี่ยว", "มีการกระจายอำนาจสู่ท้องถิ่น", "รัฐบาลมาจากการเลือกตั้งของประชาชน", "ประชาชนเป็นเจ้าของอำนาจอธิปไตย"],
                correct: 1,
                explanation: "ประเทศไทยเป็นรัฐเดี่ยว (Unitary State) อำนาจอธิปไตยรวมศูนย์เป็นหนึ่งเดียว"
            },
            {
                question: "หลักการในข้อใดส่งเสริมให้เกิดความยุติธรรมขึ้นในสังคมมากที่สุด",
                options: ["หลักนิติธรรม", "หลักความชอบธรรม", "หลักเสียงข้างมาก", "หลักการมีส่วนร่วม", "หลักความเสมอภาค"],
                correct: 4,
                explanation: "ความเสมอภาคทำให้ทุกคนได้รับการปฏิบัติอย่างเท่าเทียม เกื้อหนุนความยุติธรรม"
            },
            {
                question: "จากพระราชดำรัส แนวทางใดสอดคล้องกับวิธีการตามแนวทางประชาธิปไตยมากที่สุด",
                options: ["ยึดเสียงข้างมาก", "เน้นการทำประชามติ", "อำนาจอธิปไตยเป็นของประชาชน", "แก้ปัญหาโดยใช้เหตุผล หลีกเลี่ยงความรุนแรง", "บริหารประเทศโดยมีรัฐธรรมนูญเป็นกฎหมายสูงสุด"],
                correct: 3,
                explanation: "การใช้เหตุผลและเลี่ยงความรุนแรงเป็นหัวใจการแก้ปัญหาแบบประชาธิปไตย"
            },
            {
                question: "เหตุผลของพระราชดำรัสที่ว่า “…ถ้าสมมติว่าเฉพาะในกรุงเทพมหานครเสียหายไป ประเทศก็เสียหายไปทั้งหมด…” สะท้อนว่าอย่างไร",
                options: ["เหตุการณ์เกิดขึ้นที่กรุงเทพมหานคร", "กรุงเทพมหานครมีคนอาศัยอยู่เป็นจำนวนมาก", "ชาวกรุงเทพฯ ให้ความสนใจสิทธิเสรีภาพ", "ชาวกรุงเทพฯ ร่วมมือทำตามหลักสันติวิธี", "กรุงเทพมหานครเป็นศูนย์กลางการคมนาคมและเศรษฐกิจของประเทศ"],
                correct: 4,
                explanation: "กรุงเทพฯ เป็นศูนย์กลางเศรษฐกิจและคมนาคม ความเสียหายย่อมกระทบประเทศโดยรวม"
            },
            {
                question: "ผู้สมัคร ส.ส. จากพรรคการเมืองจำนวน 20 คน ได้รับเลือกตั้งจากประชาชนทั่วประเทศ เพื่อเป็นตัวแทนเข้าไปทำหน้าที่ใด",
                options: ["เสนอชื่อรัฐมนตรีและนโยบายต่อคณะรัฐมนตรี", "ออกกฎหมายให้กระทรวงและกรมถือปฏิบัติ", "อภิปราย ตรวจสอบและถ่วงดุลการบริหารราชการแผ่นดิน", "เสนอร่างโครงการพัฒนาและงบประมาณประเทศ", "คัดเลือกคณะกรรมการตรวจเงินแผ่นดิน"],
                correct: 2,
                explanation: "หน้าที่สำคัญของฝ่ายนิติบัญญัติ คือออกกฎหมายและตรวจสอบการบริหารราชการแผ่นดิน"
            },
            {
                question: "แทนไทไม่ได้ไปใช้สิทธิเลือกตั้งสมาชิกสภาผู้แทนราษฎร จะเสียสิทธิใดต่อไปนี้",
                options: ["สิทธิสมัครรับเลือกตั้งเป็น กำนัน/ผู้ใหญ่บ้าน", "สิทธิยื่นคำร้องต่อศาลรัฐธรรมนูญ", "สิทธิยื่นคำร้องขอถอดถอนสมาชิกสภาท้องถิ่นหรือผู้บริหารท้องถิ่น", "สิทธิเข้าชื่อเสนอกฎหมายระดับพระราชบัญญัติ", "สิทธิสมัครเป็นสมาชิกพรรคการเมือง"],
                correct: 2,
                explanation: "ไม่ไปใช้สิทธิตามกฎหมาย มีผลกระทบต่อสิทธิในการถอดถอนผู้บริหาร/สมาชิกสภาท้องถิ่น"
            },
            {
                question: "“การไปใช้สิทธิเลือกตั้ง” ตามรัฐธรรมนูญไทยสะท้อนอะไรของพลเมืองมากที่สุด",
                options: ["สิทธิ", "หน้าที่", "เกียรติ", "จริยธรรม", "จุดมุ่งหมาย"],
                correct: 1,
                explanation: "การไปเลือกตั้งเป็นหน้าที่ของพลเมืองตามรัฐธรรมนูญ"
            },
            {
                question: "พบความผิดปกติในการจัดซื้อจัดจ้างของหน่วยงานรัฐ ควรร้องเรียนหน่วยงานใดตรวจสอบข้อเท็จจริง",
                options: ["คณะกรรมการ กกต.", "คณะกรรมการ ป.ป.ส.", "คณะกรรมการ ป.ป.ช.", "คณะกรรมการ สตง.", "คณะกรรมการสิทธิมนุษยชนแห่งชาติ"],
                correct: 2,
                explanation: "ป.ป.ช. มีหน้าที่ป้องกันและปราบปรามการทุจริตของเจ้าหน้าที่รัฐ"
            },
            {
                question: "กรณีเจ้าหน้าที่รัฐได้รับของขวัญปีใหม่ ควรปฏิบัติอย่างไรจึงเหมาะสมที่สุด",
                options: ["รับแต่ซองเงินสดไว้", "รับแต่กระเช้าผลไม้ไว้", "ให้ส่งกระเช้าและซองเงินสดไปที่บ้านแทน", "ปฏิเสธทั้งกระเช้าและซองเงินสด โดยให้เหตุผลว่าผิดกฎหมาย", "ปฏิเสธโดยให้เหตุผลว่าขัดต่อธรรมเนียม"],
                correct: 3,
                explanation: "การรับทรัพย์สินหรือประโยชน์อื่นใดอาจขัดต่อกฎหมายและจริยธรรมของเจ้าหน้าที่รัฐ"
            },
            {
                question: "หากรับกระเช้าและซองเงินสดไว้ เจ้าหน้าที่รัฐดังกล่าวจะมีความผิดเรื่องใด",
                options: ["ละเว้นการปฏิบัติหน้าที่", "รับทรัพย์สินหรือประโยชน์อื่นใดของเจ้าหน้าที่ของรัฐ", "ละเมิดสิทธิของประชาชน", "ออกคำสั่งโดยมิชอบด้วยกฎหมาย", "ละเมิดหลักความโปร่งใส"],
                correct: 1,
                explanation: "การรับทรัพย์สินหรือประโยชน์อื่นใดเข้าข่ายความผิดทางจริยธรรม/กฎหมายของเจ้าหน้าที่รัฐ"
            },
            {
                question: "จากข้อ 15 หากมีผู้ร้องเรียน องค์กรใดมีอำนาจหน้าที่ในการพิจารณาและสอบสวนข้อเท็จจริง",
                options: ["รัฐสภา", "ศาลปกครอง", "ผู้ตรวจการแผ่นดิน", "คณะกรรมการตรวจเงินแผ่นดิน", "คณะกรรมการสิทธิมนุษยชนแห่งชาติ"],
                correct: 2,
                explanation: "ผู้ตรวจการแผ่นดินทำหน้าที่รับเรื่องร้องเรียนเกี่ยวกับการปฏิบัติราชการที่ไม่ชอบธรรม"
            },
            {
                question: "การเข้าร่วมเป็นสมาชิกองค์การการค้าโลก (WTO) ก่อให้เกิดผลดีต่อประเทศไทยในข้อใด",
                options: ["พื้นที่เพาะปลูกเพิ่มขึ้น", "ราคาส่งออกของไทยต่ำลง", "โรงงานอุตสาหกรรมในเขตเมืองลดลง", "มาตรฐานคุณภาพสินค้าที่ได้มาตรฐานในระดับสากลมากขึ้น", "การย้ายถิ่นฐานจากชนบทสู่เมืองลดลง"],
                correct: 3,
                explanation: "การแข่งขันและกติกาสากลผลักดันมาตรฐานสินค้าให้สูงขึ้น"
            },
            {
                question: "การเป็นสมาชิกสมาคมประชาชาติแห่งเอเชียตะวันออกเฉียงใต้ (ASEAN) จัดอยู่ในแผนหลักข้อใดของประชาคมอาเซียน",
                options: ["ASP", "AEC", "APSC", "ASEC", "ASCC"],
                correct: 1,
                explanation: "AEC = ประชาคมเศรษฐกิจอาเซียน ครอบคลุมการรวมกลุ่มทางเศรษฐกิจ"
            },
            {
                question: "คำกล่าวของนายกรัฐมนตรีในข่าว แสดงให้เห็นว่าไทยใช้เวทีใดในการสร้างความเชื่อมั่นให้นานาชาติ",
                options: ["การประชุมกลุ่มอาเซียน", "การประชุมสุดยอดอาเซียน", "การประชุมเขตการค้าเสรีอาเซียน", "การประชุมผู้นำเขตเศรษฐกิจเอเปก (APEC)", "การประชุมน้ำโขง-แม่โขงตอนล่าง"],
                correct: 3,
                explanation: "เวที APEC เป็นเวทีความร่วมมือทางเศรษฐกิจระดับภูมิภาคเอเชียแปซิฟิก"
            },
            {
                question: "ในกรณีเกิดข้อพิพาททางการเมืองระหว่างประเทศ องค์กรใดเหมาะสมที่สุดที่จะทำหน้าที่คนกลางไกล่เกลี่ย",
                options: ["สหประชาชาติ (UN)", "UNESCO", "AFTA", "สหภาพยุโรป (EU)", "CITES"],
                correct: 0,
                explanation: "UN มีบทบาทหลักด้านสันติภาพ ความมั่นคง และการระงับข้อพิพาทระหว่างประเทศ"
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
            const shareText = `🏛️ เกมตอบคำถามสังคม ม.6 🏛️\n\n` +
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
            `
            setCharacterSprite();
;
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
            
            startTimer(question.question, isBoss);
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
                "มองปัจจัยพื้นฐานของสังคมที่กำหนดการเมือง",
                "คำสำคัญ: สิทธิ เสรีภาพ เสมอภาค ตรวจสอบถ่วงดุล",
                "ประเทศที่ไม่เหมือนคนอื่น—นึกถึงราชวงศ์ที่ยังมีอำนาจสูงสุด",
                "พรรคการเมืองเดียว—คิดถึงประเทศมหาอำนาจเอเชีย",
                "นโยบายเปิดประเทศ ดึงดูดการลงทุนต่างชาติ",
                "คีย์เวิร์ด: รัฐเดี่ยว (Unitary State)",
                "ความยุติธรรมเกิดจากการปฏิบัติเท่าเทียม",
                "แนวคิด: ใช้เหตุผล เลี่ยงความรุนแรง",
                "กรุงเทพฯ = ศูนย์กลางเศรษฐกิจ/คมนาคมของไทย",
                "หน้าที่ของฝ่ายนิติบัญญัติในสภาผู้แทนราษฎร",
                "สิทธิที่เสียเมื่อไม่ไปใช้สิทธิเลือกตั้งเกี่ยวกับท้องถิ่น",
                "คำตอบคือหน้าที่ของพลเมือง",
                "หน่วยงานต่อต้านการทุจริตของเจ้าหน้าที่รัฐ",
                "ของขวัญ/ซอง = เสี่ยงผิดกฎหมาย จริยธรรม",
                "หัวข้อ: รับทรัพย์สินหรือประโยชน์อื่นใด",
                "องค์กรที่รับคำร้องต่อการปฏิบัติราชการไม่ชอบธรรม",
                "ผลดีของ WTO ต่อมาตรฐานสินค้า",
                "ตัวย่อ: AEC = ประชาคมเศรษฐกิจอาเซียน",
                "เวที: APEC – ความร่วมมือเศรษฐกิจเอเชียแปซิฟิก",
                "ข้อพิพาทระหว่างประเทศให้นึกถึง UN"
            ];
            const idx = (typeof gameState.currentQuestion === 'number' && gameState.currentQuestion >= 0) ? gameState.currentQuestion : 0;
            return hints[idx % hints.length] || "ใช้เหตุผลและความรู้สังคมศึกษา";
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
            const selectedCharacter = document.querySelector('.character-card.selected');
            
            // Check if name is provided
            if (!nameInput.value.trim()) {
                showToast('กรุณาใส่ชื่อผู้เรียนก่อนเริ่มเกม');
                nameInput.focus();
                return;
            }
            
            gameState.playerName = nameInput.value.trim();
            
            // Handle no character selected
            if (!selectedCharacter) {
                gameState.character = 'thai';
                showToast('เลือกตัวละครให้เป็นค่าเริ่มต้น');
            } else {
                gameState.character = selectedCharacter.dataset.character;
            }
            
            // Initialize game state
            gameState.score = 0;
            gameState.candies = 0;
            gameState.rank = 'ศรัทธา';
            gameState.rankIndex = 0;
            gameState.xpCorrect = 0;
            gameState.streak = 0;
            gameState.maxStreak = 0;
            gameState.siemseeTickets = 2;
            gameState.siemseeEarned = 0;
            gameState.siemseeUsedThisQ = false;
            gameState.position = 0;
            gameState.currentTile = 1;
            gameState.answered = 0;
            gameState.gameEnded = false;
            gameState.isMoving = false;
            gameState.inputDisabled = false;
            gameState.earnOverlay = false;
            gameState.earnCooldown = false;
            gameState.challengeTimer = null;
            gameState.challengeTimeLeft = 10;
            gameState.recentQuestions = [];
            // Reset new question management state
            gameState.askedSet = new Set();
            gameState.tileQuestionMap = {};
            gameState.isShowingQuestion = false;
            gameState.answeredUnique = 0;
            gameState.currentQId = null;
            gameState.questionLoadTimer = null;
            
            // Apply initial scaling
            applyScaling();
            
            // Set character icon
            if (gameState.character === 'buddha') {
                document.getElementById('character').innerHTML = `
                    <svg viewBox="0 0 60 60" style="width: 100%; height: 100%;">
                        <circle cx="30" cy="21" r="12" fill="#F4A460" stroke="#D4AF37" stroke-width="1"/>
                        <path d="M18,33 Q30,27 42,33 L39,45 Q30,51 21,45 Z" fill="#FF8C00" stroke="#D4AF37" stroke-width="1"/>
                        <circle cx="27" cy="19" r="1" fill="#8B4513"/>
                        <circle cx="33" cy="19" r="1" fill="#8B4513"/>
                        <path d="M27,24 Q30,27 33,24" stroke="#8B4513" stroke-width="1" fill="none"/>
                        <circle cx="30" cy="12" r="15" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.6"/>
                    </svg>
                `;
            } else {
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
            }
            setCharacterSprite();

            
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