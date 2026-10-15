
const SECRET_CODE = "LOVE";

const screens = [
  "intro",
  "clue1",
  "clue2",
  "clue3",
  "unlock",
  "reveal"
];

const feedbackMessages = {
  clue1: "Correct! Faith is the foundation of meaningful service.",
  clue2: "Correct! A true leader helps others grow.",
  clue3: "Correct! Love is the key to the final file."
};

const questions = ["clue1", "clue2", "clue3"];

let currentQuestion = 0;
let countdownTimer = null;

const birthdayMessage = `
Dear Ma'am,

Today, we want to pause from our usual activities
and celebrate someone who has become a meaningful
part of our Campus Ministry family.

Thank you for your guidance, encouragement,
patience, prayers, and the time you give to help
us grow in faith and in service.

You may not always see the impact of every word
of encouragement or every act of kindness, but
please know that these things matter to us.

On your special day, we pray that God blesses you
with renewed strength, lasting joy, good health,
peace, and countless reasons to smile.

May He continue to guide your steps and bless the
work you do for His people.

You spend so much time helping others feel valued.
Today, we hope you feel just how valued you are.

Happy Birthday, Ma'am!

With love, gratitude, and prayers,
Your Campus Ministry Family
`;

function showScreen(id) {
  screens.forEach(screen => {
    document.getElementById(screen).classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// START INVESTIGATION
function startCase() {
  currentQuestion = 0;
  showScreen("clue1");
}

// ANSWER THE CLUES
function answer(button, isCorrect) {
  const screen = button.closest(".screen");
  const screenId = screen.id;
  const feedback = screen.querySelector(".feedback");
  const buttons = screen.querySelectorAll(".option");

  if ([...buttons].some(option => option.disabled)) return;

  if (!isCorrect) {
    button.classList.add("wrong");
    feedback.style.color = "#e6a2a2";
    feedback.textContent =
      "Not quite. Read the clue and try another answer.";
    return;
  }

  buttons.forEach(option => {
    option.disabled = true;
  });

  button.classList.remove("wrong");
  button.classList.add("correct");

  feedback.style.color = "#91d6ae";
  feedback.textContent = feedbackMessages[screenId];

  currentQuestion++;

  setTimeout(() => {
    if (currentQuestion < questions.length) {
      showScreen(questions[currentQuestion]);
    } else {
      showScreen("unlock");
      document.getElementById("secretCode").focus();
    }
  }, 1300);
}

// UNLOCK THE BIRTHDAY REVEAL
function unlockCase() {
  const input = document.getElementById("secretCode");
  const feedback = document.getElementById("codeFeedback");

  if (input.value.trim().toUpperCase() !== SECRET_CODE) {
    feedback.style.color = "#e6a2a2";
    feedback.textContent =
      "ACCESS DENIED. Think about what makes service meaningful.";
    input.value = "";
    input.focus();
    return;
  }

  feedback.textContent = "";

  document.getElementById("birthdayMessage").textContent =
    birthdayMessage;

  showScreen("reveal");
  createConfetti();

  // Start music when the secret code is accepted.
  const music = document.getElementById("birthdayMusic");

  if (music) {
    music.volume = 0.7;

    music.play().catch(() => {
      console.log("Browser requires a click to play the music.");
    });
  }
}

// COUNTDOWN THEN SHOW THE ENVELOPE
function startCountdown() {
  if (countdownTimer !== null) return;

  const button = document.getElementById("surpriseButton");
  const box = document.getElementById("countdownBox");
  const text = document.getElementById("countdownText");

  button.disabled = true;
  button.classList.add("hidden");
  box.classList.remove("hidden");

  let count = 5;
  text.textContent = count;

  // Make sure the birthday music keeps playing.
  const music = document.getElementById("birthdayMusic");

  if (music && music.paused) {
    music.volume = 0.7;

    music.play().catch(() => {
      console.log("Tap the surprise button to enable music.");
    });
  }

  countdownTimer = setInterval(() => {
    count--;

    if (count > 0) {
      text.textContent = count;
      return;
    }

    clearInterval(countdownTimer);
    countdownTimer = null;

    box.classList.add("hidden");

    // Show the envelope surprise without stopping the music.
    showEnvelopeSurprise();

    createConfetti();
  }, 1000);
}

// CLOSE ORIGINAL PICTURE POPUP

function closePicture() {
  document.getElementById("picturePopup")
    .classList.add("hidden");

  // Ayaw i-stop o i-reset ang music diri.
  // Aron magpadayon ang music samtang nagtan-aw sa envelope/gallery.

  const button = document.getElementById("surpriseButton");
  button.disabled = false;
  button.classList.remove("hidden");

  document.getElementById("countdownBox").classList.add("hidden");
}


// CONFETTI ANIMATION
function createConfetti() {
  const container = document.getElementById("confetti");
  container.innerHTML = "";

  const symbols = ["✦", "✧", "♥", "✦", "·", "✺"];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");

    piece.textContent = symbols[i % symbols.length];
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty(
      "--duration",
      `${3 + Math.random() * 4}s`
    );
    piece.style.setProperty(
      "--delay",
      `${Math.random() * 1.5}s`
    );

    container.appendChild(piece);
  }
}

// REPLAY CELEBRATION
function celebrateAgain() {
  closePicture();
  showScreen("reveal");
  createConfetti();
}

// CONNECT ORIGINAL BUTTONS
document.getElementById("startButton")
  .addEventListener("click", startCase);

document.getElementById("unlockButton")
  .addEventListener("click", unlockCase);

document.getElementById("surpriseButton")
  .addEventListener("click", startCountdown);

document.getElementById("closePopup")
  .addEventListener("click", closePicture);

document.getElementById("finishButton")
  .addEventListener("click", closePicture);

document.getElementById("celebrateButton")
  .addEventListener("click", celebrateAgain);

document.getElementById("secretCode")
  .addEventListener("keydown", event => {
    if (event.key === "Enter") {
      unlockCase();
    }
  });

// Close original popup when clicking the dark background.
document.getElementById("picturePopup")
  .addEventListener("click", event => {
    if (event.target.id === "picturePopup") {
      closePicture();
    }
  });

// Close original popup with Escape key.
document.addEventListener("keydown", event => {
  const popup = document.getElementById("picturePopup");

  if (event.key === "Escape" && !popup.classList.contains("hidden")) {
    closePicture();
  }
});

// ===== ENVELOPE AND SIX-PHOTO GALLERY =====

const envelopeCover = document.getElementById("envelopeCover");
const envelopeLanding = document.getElementById("envelopeLanding");
const openEnvelopeButton = document.getElementById("openEnvelope");
const sixPhotosGallery = document.getElementById("sixPhotos");
const minimizeEnvelopeButton = document.getElementById("minimizeEnvelope");
const miniEnvelopeButton = document.getElementById("miniEnvelope");

// Display the envelope after the countdown.
function showEnvelopeSurprise() {
  envelopeLanding.classList.remove("hidden");
  sixPhotosGallery.classList.add("hidden");
  openEnvelopeButton.classList.remove("opening");

  envelopeCover.classList.remove("hidden");
  miniEnvelopeButton.classList.add("hidden");
}

// Open the envelope and show all six pictures.
openEnvelopeButton.addEventListener("click", () => {
  if (openEnvelopeButton.classList.contains("opening")) return;

  openEnvelopeButton.classList.add("opening");

  window.setTimeout(() => {
    envelopeLanding.classList.add("hidden");
    sixPhotosGallery.classList.remove("hidden");
  }, 600);
});

// Minimize the gallery and show the floating envelope icon.
minimizeEnvelopeButton.addEventListener("click", () => {
  envelopeCover.classList.add("hidden");
  miniEnvelopeButton.classList.remove("hidden");
});

// Reopen the six pictures anytime.
miniEnvelopeButton.addEventListener("click", () => {
  envelopeCover.classList.remove("hidden");
  envelopeLanding.classList.add("hidden");
  sixPhotosGallery.classList.remove("hidden");
  miniEnvelopeButton.classList.add("hidden");
});
