// Minimal behavior for reveal + marking answers
const answers = document.querySelectorAll('.answer');
const revealBtn = document.getElementById('reveal');
let revealed = false;

answers.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!revealed) {
      // soft select for UX
      answers.forEach(b => b.classList.remove('correct','wrong'));
      btn.classList.add(btn.dataset.correct ? 'correct' : 'wrong');
    }
  });
});

revealBtn.addEventListener('click', () => {
  revealed = true;
  answers.forEach(btn => {
    btn.classList.remove('wrong');
    if (btn.dataset.correct) btn.classList.add('correct');
    else btn.classList.remove('correct');
  });
  // Optional haptic vibe on mobile
  if (navigator.vibrate) navigator.vibrate(15);
});

document.getElementById('more').addEventListener('click', () => {
  alert('เดี๋ยวเพิ่มรอบหน้า 😉');
});
