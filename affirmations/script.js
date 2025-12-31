const affirmations = {
  grounded: [
    "I don’t need urgency to be effective.",
    "I am allowed to take up space without explanation.",
    "Nothing is wrong just because it’s quiet.",
    "I can move slowly and still be intentional.",
    "I trust myself to handle what comes next.",
    "Consistency matters more than intensity.",
    "I don’t need to prove progress for it to count.",
    "I can pause without falling behind.",
    "Clarity comes from doing, not overthinking.",
    "Today does not require perfection.",
  ],

  aggressive: [
    "I will succeed out of pure spite.",
    "I am calm, but not forgiving.",
    "I am not asking for permission.",
    "Today, I choose violence (internally).",
    "I do not negotiate with self-doubt.",
    "Underestimate me. Please.",
    "I finish things.",
    "I am not fragile.",
  ],

  delusional: [
    "Everyone is secretly impressed by me.",
    "I could disappear for a year and come back iconic.",
    "My potential is genuinely intimidating.",
    "People will quote me one day.",
    "I am someone’s unrealistic standard.",
    "This is my flop era before the glow-up.",
    "I make difficult things look easy.",
    "I am already ahead of the version of me that quit.",
  ],

  petty: [
    "I’m not wrong, I’m just early.",
    "They doubted me and they were loud about it.",
    "Success is my response.",
    "I remember everything.",
    "I will be gracious later.",
    "I don’t chase closure — I move on.",
    "I noticed. I always do.",
    "Being underestimated works in my favour.",
  ],
};

const affirmationEl = document.getElementById("affirmation");
const nextBtn = document.getElementById("nextBtn");
const filterButtons = document.querySelectorAll(".filter");

let currentCategory = "grounded";
let isTyping = false;
let lastAffirmation = "";

function typeText(text, speed = 35) {
  if (isTyping) return;

  isTyping = true;
  affirmationEl.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    affirmationEl.textContent += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(interval);
      isTyping = false;
    }
  }, speed);
}

function getRandomAffirmation() {
  const list = affirmations[currentCategory];
  let random;

  do {
    random = list[Math.floor(Math.random() * list.length)];
  } while (random === lastAffirmation && list.length > 1);

  lastAffirmation = random;
  return random;
}

function showAffirmation() {
  typeText(getRandomAffirmation());
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    showAffirmation();
  });
});

nextBtn.addEventListener("click", showAffirmation);

// Initial render
showAffirmation();
