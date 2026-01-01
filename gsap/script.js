window.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  if (typeof SplitText !== "undefined") {
    gsap.registerPlugin(SplitText);
  }
  if (typeof MotionPathPlugin !== "undefined") {
    gsap.registerPlugin(MotionPathPlugin);
  }

  gsap.defaults({
    overwrite: "auto",
  });

  // Just 3 cool fonts
  const fonts = [
    "Inter, sans-serif",
    "Space Grotesk, sans-serif",
    "Orbitron, sans-serif",
  ];

  const container = document.querySelector(".container");
  const line1El = document.getElementById("line1");
  const line2El = document.getElementById("line2");

  let grid = document.querySelector(".grid");

  // Default display name (use 'tempo' and force uppercase for display)
  const text1 = line1El ? line1El.textContent : "tempo";
  const text2 = line2El ? line2El.textContent : "";
  const combinedText = ((text1 || "") + (text2 ? ` ${text2}` : ""))
    .trim()
    .toUpperCase();
  function fillGrid() {
    grid.innerHTML = "";
    // Use larger cell sizes to reduce density and avoid overlap
    const cols = Math.ceil(innerWidth / 560);
    const rows = Math.ceil(innerHeight / 220);
    const count = cols * rows;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "name-line";
      el.textContent = combinedText;
      grid.appendChild(el);
    }
  }

  fillGrid();
  window.addEventListener("resize", fillGrid);

  let currentAnimation = 0;
  let cleanupFunctions = [];
  let activeTimelines = [];

  // Helper to cleanup previous animation
  function cleanup() {
    // Kill all active timelines
    activeTimelines.forEach((tl) => {
      if (tl && tl.kill) tl.kill();
    });
    activeTimelines = [];

    // Run any registered cleanup helpers (remove listeners, revert plugins)
    cleanupFunctions.forEach((fn) => fn());
    cleanupFunctions = [];

    // Restore container to default structure so subsequent animations can
    // rely on a `.grid` element existing.
    container.innerHTML = `<div class="grid"></div>`;
    grid = container.querySelector(".grid");
  }

  // Helper to set font
  function setFont(elements, font) {
    if (elements.forEach) {
      elements.forEach((el) => (el.style.fontFamily = font));
    } else {
      elements.style.fontFamily = font;
    }
  }

  // Animation 1: SplitText Random Chars
  function splitTextRandom() {
    let wrapper = document.createElement("div");
    wrapper.className = "name-wrapper";
    container.appendChild(wrapper);

    const line1 = document.createElement("div");
    line1.className = "name-line";
    line1.textContent = combinedText;

    wrapper.append(line1);

    setFont([line1], fonts[0]);

    // Safely split into characters. If the SplitText plugin isn't
    // available (offline), fall back to creating span-wrapped chars.
    let split1;
    let chars = [];
    if (typeof SplitText !== "undefined") {
      split1 = new SplitText(line1, { type: "chars" });
      chars = [...split1.chars];
    } else {
      const text = line1.textContent || "";
      line1.textContent = "";
      for (let ch of text) {
        const span = document.createElement("span");
        span.textContent = ch;
        line1.appendChild(span);
        chars.push(span);
      }
    }

    const tl = gsap.from(chars, {
      yPercent: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-30, 30),
      autoAlpha: 0,
      // start with colorful hues and animate back to the CSS white
      color: (i) => `hsl(${Math.floor(gsap.utils.random(0, 360))},80%,60%)`,
      stagger: { amount: 1.0, from: "random" },
      duration: 0.7,
    });

    activeTimelines.push(tl);

    if (split1 && split1.revert) {
      cleanupFunctions.push(() => split1.revert());
    }
  }

  // Animation 2: 3D Cube Rotation Effect (Stacked Dice)
  function cubeRotationEffect() {
    requestAnimationFrame(() => {
      container.innerHTML = `
        <div class="pov">
          <div class="tray">
            <div class="die">
              <div class="cube">
                <div class="face">${combinedText}</div>
                <div class="face">${combinedText}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const pov = container.querySelector(".pov");
      const tray = container.querySelector(".tray");
      const n = 19;
      const rots = [
        { ry: 270, a: 0.5 },
        { ry: 0, a: 0.85 },
        { ry: 90, a: 0.4 },
        { ry: 180, a: 0.0 },
      ];

      // Set up first die faces (scope to this container)
      const faces = container.querySelectorAll(".face");
      gsap.set(faces, {
        z: 200,
        rotateY: (i) => rots[i % rots.length].ry,
        transformOrigin: "50% 50% -201px",
      });

      // Clone dice
      for (let i = 0; i < n; i++) {
        let die = tray.querySelector(".die");
        let cube = die.querySelector(".cube");

        if (i > 0) {
          let clone = die.cloneNode(true);
          tray.append(clone);
          cube = clone.querySelector(".cube");
        }

        const tl = gsap
          .timeline({
            repeat: -1,
            yoyo: true,
            defaults: { ease: "power3.inOut", duration: 1 },
          })
          .fromTo(
            cube,
            {
              rotateY: -90,
            },
            {
              rotateY: 90,
              ease: "power1.inOut",
              duration: 2,
            }
          )
          .fromTo(
            cube.querySelectorAll(".face"),
            {
              color: (j) =>
                `hsl(${(i / n) * 75 + 130}, 67%,${
                  100 * [rots[1].a, rots[0].a][j % 2]
                }%)`,
            },
            {
              color: (j) =>
                `hsl(${(i / n) * 75 + 130}, 67%,${
                  100 * [rots[0].a, rots[1].a][j % 2]
                }%)`,
            },
            0
          )
          .to(
            cube.querySelectorAll(".face"),
            {
              color: (j) =>
                `hsl(${(i / n) * 75 + 130}, 67%,${
                  100 * [rots[2].a, rots[1].a][j % 2]
                }%)`,
            },
            1
          )
          .progress(i / n);

        activeTimelines.push(tl);
      }

      // Animate tray
      const trayTl = gsap
        .timeline({ repeat: -1 })
        .from(
          tray,
          {
            yPercent: -3,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          },
          0
        )
        .fromTo(
          tray,
          { rotate: -15 },
          {
            rotate: 15,
            duration: 4,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          },
          0
        )
        .from(
          tray.querySelectorAll(".die"),
          {
            duration: 0.01,
            opacity: 0,
            stagger: { each: -0.05, ease: "power1.in" },
          },
          0
        )
        .to(
          tray,
          {
            scale: 1.2,
            duration: 2,
            ease: "power3.inOut",
            yoyo: true,
            repeat: -1,
          },
          0
        );

      activeTimelines.push(trayTl);

      // Set fonts
      document.querySelectorAll(".face").forEach((face) => {
        face.style.fontFamily = fonts[1];
      });

      // Resize handler
      const resize = () => {
        const h = n * 56;
        gsap.set(tray, { height: h });
        gsap.set(pov, { scale: innerHeight / h });
      };

      resize();
      window.addEventListener("resize", resize);
      cleanupFunctions.push(() => window.removeEventListener("resize", resize));
    });
  }

  function particleDisperse() {
    fillGrid();

    const items = gsap.utils.toArray(".name-line");

    const tl = gsap.timeline();

    tl.fromTo(
      items,
      {
        x: 0,
        y: 0,
        opacity: 1,
        color: "#fff",
      },
      {
        // reduce scatter distance to limit overlap during motion
        x: () => gsap.utils.random(-180, 180),
        y: () => gsap.utils.random(-180, 180),
        opacity: 0,
        color: (i) => `hsl(${(i / items.length) * 360},70%,55%)`,
        stagger: {
          amount: 1.5,
          from: "random",
        },
        duration: 1.2,
        ease: "power4.out",
      }
    ).fromTo(
      items,
      {
        opacity: 0,
        x: () => gsap.utils.random(-180, 180),
        y: () => gsap.utils.random(-180, 180),
        color: (i) => `hsl(${((i + 40) / items.length) * 360},70%,55%)`,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        color: "#fff",
        stagger: {
          amount: 1.5,
          from: "random",
        },
        duration: 1.2,
        ease: "power4.out",
      }
    );

    activeTimelines.push(tl);
  }

  function kineticTypography() {
    fillGrid();

    const items = gsap.utils.toArray(".name-line");

    gsap.set(items, {
      // reduce vertical stacking to limit overlap
      y: (i) => i * 6,
      opacity: 0,
    });

    const tl = gsap.timeline();

    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        each: 0.015,
        ease: "power3.out",
      },
    })
      .to(items, {
        x: () => gsap.utils.random(-60, 60),
        skewX: () => gsap.utils.random(-8, 8),
        // give a colorful flash during the kinetic burst
        color: (i) => `hsl(${(i / items.length) * 220 + 160},78%,58%)`,
        duration: 0.4,
        stagger: {
          each: 0.01,
          from: "center",
        },
        ease: "power2.inOut",
      })
      .to(items, {
        x: 0,
        skewX: 0,
        color: "#fff",
        duration: 0.6,
        ease: "expo.out",
      });

    activeTimelines.push(tl);
  }

  // Animation 5: SVG path chars flowing along a 3D "3" shape
  function pathTempoAnimation() {
    // Only run if MotionPathPlugin is available
    if (typeof MotionPathPlugin === "undefined") return;

    const wrapper = document.createElement("div");
    wrapper.className = "svg-anim-container";
    wrapper.innerHTML = `
      <svg class="svg-char" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <!-- Motion path of the music note (outline) -->
        <path
          class="svg-char__path"
          fill="none"
          stroke="transparent"
          stroke-width="1"
          d="M24 6v21.1c-1.18-.68-2.54-1.1-4-1.1-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8V14h8V6h-12z"
        />
      </svg>
      <p class="txt"></p>
    `;

    container.appendChild(wrapper);

    const txt = wrapper.querySelector(".txt");
    const base = combinedText || "TEMPO";
    let long = "";
    // Add dots between TEMPO words
    for (let i = 0; i < 26; i++) long += base + ". ";
    // Reverse the string
    long = long.split("").reverse().join("");
    txt.textContent = long;

    // Style text to be white
    txt.style.color = "#fff";
    txt.style.position = "absolute";
    txt.style.left = "-10000px";

    // Split into chars
    let split;
    if (typeof SplitText !== "undefined") {
      split = new SplitText(txt, {
        type: "chars",
        charsClass: "char",
        position: "relative",
      });
    } else {
      // fallback: create spans manually
      const text = txt.textContent || "";
      txt.textContent = "";
      for (let ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        span.style.color = "#fff";
        txt.appendChild(span);
      }
      split = null;
    }

    const chars = gsap.utils.toArray(".char", wrapper);
    gsap.set(chars, {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
      color: "#fff",
    });

    // Animate along path (faster duration)
    const tl = gsap.timeline();
    tl.to(
      chars,
      {
        motionPath: {
          path: ".svg-char__path",
          align: ".svg-char__path",
          autoRotate: true,
          start: 0,
          end: 1,
        },
        stagger: { each: 0.08 },
        duration: 8,
        ease: "none",
      },
      0
    );

    activeTimelines.push(tl);

    cleanupFunctions.push(() => {
      if (split && split.revert) split.revert();
      if (wrapper && wrapper.parentNode)
        wrapper.parentNode.removeChild(wrapper);
    });
  }

  const animations = [
    splitTextRandom,
    cubeRotationEffect,
    pathTempoAnimation,
    particleDisperse,
    // kineticTypography,
  ];

  function playNextAnimation() {
    const animation = animations[currentAnimation];

    // Cleanup first
    cleanup();

    // Run animation (guard so a thrown error doesn't stop the loop)
    try {
      animation();
    } catch (err) {
      console.error("Animation error:", err);
      // skip to next animation shortly
      gsap.delayedCall(0.5, () => {
        currentAnimation = (currentAnimation + 1) % animations.length;
        playNextAnimation();
      });
      return;
    }

    // Wait for animation to set up, then fade in
    requestAnimationFrame(() => {
      gsap.set(container, { opacity: 0 });
      gsap.to(container, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    currentAnimation = (currentAnimation + 1) % animations.length;

    // Change animation after 7 seconds (fade out then switch)
    // Make the split->cube transition quicker
    const delay =
      animation === splitTextRandom
        ? 4
        : animation === pathTempoAnimation
        ? 8
        : 7;
    const fadeOutCall = gsap.delayedCall(delay, () => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          playNextAnimation();
        },
      });
    });

    activeTimelines.push({ kill: () => fadeOutCall.kill() });
  }

  // Start the animation loop immediately
  playNextAnimation();
});
