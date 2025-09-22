const DEFAULT_PUZZLES = [
  {
    word: "BUG",
    question: "Đây là từ thể hiện lỗi phần mềm",
    img: "./image/test.jpg",
  },
  {
    word: "TEST CASE",
    question: "Tài liệu mô tả chi tiết từng bước kiểm thử gọi là gì?",
    img: "./image/test.jpg",
  },
  {
    word: "AUTOMATION",
    question: "Kiểm thử bằng công cụ thay vì thủ công gọi là gì?",
    img: "./image/test.jpg",
  },
  {
    word: "MANUAL",
    question: "Hình thức kiểm thử do con người trực tiếp thực hiện?",
    img: "./image/test.jpg",
  },
  {
    word: "REGRESSION",
    question: "Kiểm thử lại sau khi sửa lỗi hoặc thay đổi phần mềm?",
    img: "./image/test.jpg",
  },
  {
    word: "UNIT",
    question: "Mức kiểm thử nhỏ nhất, tập trung vào hàm hoặc module?",
    img: "./image/test.jpg",
  },
  {
    word: "INTEGRATION",
    question: "Kiểm thử khi kết hợp nhiều module lại với nhau?",
    img: "./image/test.jpg",
  },
  {
    word: "SMOKE",
    question: "Kiểm thử nhanh để xem phần mềm có chạy cơ bản không?",
    img: "./image/test.jpg",
  },
  {
    word: "PERFORMANCE",
    question: "Kiểm thử về tốc độ và khả năng chịu tải?",
    img: "./image/test.jpg",
  },
  {
    word: "UI",
    question: "Phần giao diện người dùng viết tắt là gì?",
    img: "./image/test.jpg",
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function normalizeForMatch(ch) {
  return ch ? ch.toUpperCase() : ch;
}
function isLetter(ch) {
  return /[A-Z]/i.test(ch);
}

// state
let puzzles = DEFAULT_PUZZLES.slice();
let idx = 0;
let chars = [];
let missCount = 0;

// elements
const puzzleEl = document.getElementById("puzzle");
const alphabetEl = document.getElementById("alphabet");
const wordIndexEl = document.getElementById("wordIndex");
const totalWordsEl = document.getElementById("totalWords");
const missCountEl = document.getElementById("missCount");
const hintTextEl = document.getElementById("hintText");
const hintImgEl = document.getElementById("hintImg");
const winMsgEl = document.getElementById("winMsg");
const fwLeft = document.getElementById("fwLeft");
const fwRight = document.getElementById("fwRight");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const revealBtn = document.getElementById("revealBtn");

// Ẩn pháo hoa sau khi nổ xong (trở lại tàng hình)
if (fwLeft) {
  fwLeft.addEventListener("animationend", () =>
    fwLeft.classList.remove("active")
  );
}
if (fwRight) {
  fwRight.addEventListener("animationend", () =>
    fwRight.classList.remove("active")
  );
}

// render alphabet buttons
function renderAlphabet() {
  alphabetEl.innerHTML = "";
  ALPHABET.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.textContent = letter;
    btn.dataset.letter = letter;
    btn.addEventListener("click", onLetterClick);
    alphabetEl.appendChild(btn);
  });
}

function buildChars(raw) {
  chars = [];
  for (const ch of raw) {
    chars.push({
      orig: ch,
      normalized: normalizeForMatch(ch),
      revealed: !isLetter(ch),
    });
  }
}

function renderPuzzle() {
  puzzleEl.innerHTML = "";
  chars.forEach((c) => {
    const d = document.createElement("div");
    d.className = "cell " + (c.revealed ? "revealed" : "hidden");
    if (!isLetter(c.orig) && c.orig === " ") d.className = "cell space";
    if (c.revealed && isLetter(c.orig)) d.textContent = c.orig;
    puzzleEl.appendChild(d);
  });
  checkWin();
}

function resetAlphabetButtons() {
  document.querySelectorAll(".letter").forEach((b) => {
    b.classList.remove("disabled");
    b.disabled = false;
  });
}

function onLetterClick(e) {
  const btn = e.currentTarget;
  if (btn.classList.contains("disabled")) return;
  const letter = btn.dataset.letter;
  handleGuess(letter);
  btn.classList.add("disabled");
  btn.disabled = true;
}

function handleGuess(letter) {
  const key = normalizeForMatch(letter);
  let found = 0;
  chars.forEach((c) => {
    if (isLetter(c.orig) && !c.revealed && c.normalized === key) {
      c.revealed = true;
      found++;
    }
  });
  if (found === 0) {
    missCount++;
    missCountEl.textContent = missCount;
  } else {
    renderPuzzle();
  }
}

function checkWin() {
  const done = chars.every((c) => !isLetter(c.orig) || c.revealed);
  if (done) {
    winMsgEl.style.display = "block";
    // kích hoạt animation 2 pháo hoa, tụ vào giữa một chút rồi bay lên
    if (fwLeft && fwRight) {
      fwLeft.classList.remove("active");
      fwRight.classList.remove("active");
      void fwLeft.offsetWidth; // reflow để phát lại animation
      void fwRight.offsetWidth;
      fwLeft.classList.add("active");
      fwRight.classList.add("active");
    }
    nextBtn.disabled = idx >= puzzles.length - 1;
    if (idx < puzzles.length - 1) nextBtn.disabled = false;
  } else {
    winMsgEl.style.display = "none";
    if (fwLeft) fwLeft.classList.remove("active");
    if (fwRight) fwRight.classList.remove("active");
  }
}

function loadPuzzle(i) {
  idx = (i + puzzles.length) % puzzles.length;
  wordIndexEl.textContent = idx + 1;
  totalWordsEl.textContent = puzzles.length;
  buildChars(puzzles[idx].word);
  missCount = 0;
  missCountEl.textContent = missCount;
  resetAlphabetButtons();
  renderPuzzle();
  hintTextEl.textContent = puzzles[idx].question;
  hintImgEl.src = puzzles[idx].img || "";
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = true;
  if (idx === puzzles.length - 1) nextBtn.disabled = true;
}

// reveal event
revealBtn.addEventListener("click", () => {
  chars.forEach((c) => {
    if (isLetter(c.orig)) c.revealed = true;
  });
  renderPuzzle();
  if (idx < puzzles.length - 1) nextBtn.disabled = false;
});
nextBtn.addEventListener("click", () => {
  if (nextBtn.disabled) return;
  loadPuzzle(idx + 1);
});
prevBtn.addEventListener("click", () => {
  if (prevBtn.disabled) return;
  loadPuzzle(idx - 1);
});

// keyboard support
document.addEventListener("keydown", (ev) => {
  const k = ev.key.toUpperCase();
  if (k.length === 1 && /[A-Z]/i.test(k)) {
    const btn = Array.from(document.querySelectorAll(".letter")).find(
      (b) => b.textContent === k && !b.disabled
    );
    if (btn) btn.click();
  }
});

// init
renderAlphabet();
loadPuzzle(0);
// ===== Định vị 2 panel 2 bên theo chiều cao/ vị trí của .app =====
function positionCFPanels() {
  const app = document.querySelector(".app");
  const left = document.querySelector(".cf-panel.left-panel");
  const right = document.querySelector(".cf-panel.right-panel");
  if (!app || !left || !right) return;
  const rect = app.getBoundingClientRect();
  const panelW = parseInt(getComputedStyle(left).width) || 310;
  const gap =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--panel-gap")
    ) || 28;
  const top = window.scrollY + rect.top;
  const leftX = window.scrollX + rect.left - gap - panelW;
  const rightX = window.scrollX + rect.right + gap;
  const h = rect.height;
  left.style.top = `${top}px`;
  left.style.left = `${leftX}px`;
  left.style.height = `${h}px`;
  right.style.top = `${top}px`;
  right.style.left = `${rightX}px`;
  right.style.height = `${h}px`;
}
window.addEventListener("resize", positionCFPanels);
window.addEventListener("scroll", positionCFPanels, { passive: true });
const __cfObs = new MutationObserver(() => positionCFPanels());
__cfObs.observe(document.querySelector(".app"), {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
});
positionCFPanels();
