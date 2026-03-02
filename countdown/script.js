// Simple "Death of the 20s" countdown + slideshow
// Usage for multiple people:
// - Create a folder: data/<personId>/
// - Add an info.json file with: { "name": "...", "birthdate": "YYYY-MM-DD", "images": ["1.jpg", ...] }
// - Put the images in the same folder
// - Open: index.html?person=<personId>

(function () {
  const params = new URLSearchParams(window.location.search);
  const personId = params.get("person") || "rainbow";

  const headlineEl = document.getElementById("headline");
  const subheadlineEl = document.getElementById("subheadline");
  const afterMessageEl = document.getElementById("after-message");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const slideshowEl = document.getElementById("slideshow");

  let countdownInterval = null;
  let slideshowInterval = null;

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function computeTarget30th(birthdateStr) {
    // Expecting YYYY-MM-DD
    const [year, month, day] = birthdateStr.split("-").map(Number);
    if (!year || !month || !day) {
      return null;
    }
    const birth = new Date(year, month - 1, day);
    const target = new Date(birth);
    target.setFullYear(birth.getFullYear() + 30);
    return target;
  }

  function startCountdown(targetDate, name) {
    function update() {
      const now = new Date();
      const diffMs = targetDate - now;

      if (diffMs <= 0) {
        // Countdown finished
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        afterMessageEl.classList.remove("hidden");
        if (headlineEl && name) {
          headlineEl.textContent = `Long live ${name}'s 30s`;
        }
        if (subheadlineEl) {
          subheadlineEl.textContent = "The death of their 20s has arrived.";
        }
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  function startSlideshow(imageUrls) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return;
    }

    slideshowEl.innerHTML = "";
    const slides = imageUrls.map((url) => {
      const div = document.createElement("div");
      div.className = "slide";
      div.style.backgroundImage = `url("${url}")`;
      slideshowEl.appendChild(div);
      return div;
    });

    let current = 0;
    slides[current].classList.add("active");

    if (slides.length === 1) {
      return; // nothing to rotate
    }

    slideshowInterval = setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 5000);
  }

  async function init() {
    // If opened directly from the filesystem, fetch() to local JSON will fail.
    if (window.location.protocol === "file:") {
      console.error(
        "This page is opened as a file:// URL. Start a local server so fetch() can load data."
      );
      if (headlineEl) {
        headlineEl.textContent = "Open this page via http://, not file://";
      }
      if (subheadlineEl) {
        subheadlineEl.textContent =
          'From the "countdown" folder, run a local server (for example: python -m http.server 8000) and visit http://localhost:8000/index.html?person=rainbow';
      }
      return;
    }

    try {
      const res = await fetch(`data/${personId}/info.json`, {
        cache: "no-cache",
      });
      if (!res.ok) {
        throw new Error(`Could not load data for "${personId}"`);
      }
      const data = await res.json();

      const name = data.name || personId;
      const birthdateStr = data.birthdate;
      const images = Array.isArray(data.images) ? data.images : [];

      if (headlineEl) {
        headlineEl.textContent = `Death of ${name}'s 20s`;
      }
      if (subheadlineEl) {
        subheadlineEl.textContent = `Countdown to 30`;
      }

      const targetDate = computeTarget30th(birthdateStr);
      if (!targetDate) {
        console.error("Invalid birthdate in info.json");
      } else {
        startCountdown(targetDate, name);
      }

      const basePath = `data/${personId}/`;
      const imageUrls = images.map((img) => basePath + img);
      startSlideshow(imageUrls);
    } catch (err) {
      console.error(err);
      if (headlineEl) {
        headlineEl.textContent = "Error loading person data";
      }
      if (subheadlineEl) {
        subheadlineEl.textContent = `Check the folder "data/${personId}" and its info.json`;
      }
    }
  }

  init();
})();
