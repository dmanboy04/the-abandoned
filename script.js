/* ==========================================================
   THE ABANDONED // FACILITY CONTROL SYSTEM
   Interactive website controller — no external dependencies
   ========================================================== */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const GAME_URL = "https://www.roblox.com/games/116357638869409/The-Abandoned";

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
  };

  const state = {
    selectedCamera: 0,
    nightVision: false,
    emergency: false,
    warningOpen: false,
    modalOpen: false,
    sequenceIndex: 0,
    logoClicks: 0
  };

  const timers = new Set();
  const intervals = new Set();
  const later = (fn, ms) => {
    const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  };
  const every = (fn, ms) => {
    const id = window.setInterval(fn, ms);
    intervals.add(id);
    return id;
  };

  function safeText(element, value) {
    if (element) element.textContent = value;
  }

  // Reveal only when observed; hidden archives stay hidden until unlocked.
  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.08 })
    : null;

  $$(".reveal").forEach(section => {
    if (revealObserver) revealObserver.observe(section);
    else section.classList.add("is-visible");
  });

  function reveal(element, scroll = false) {
    if (!element) return;
    element.hidden = false;
    element.classList.add("is-visible");
    if (revealObserver) revealObserver.observe(element);
    if (scroll) later(() => element.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const primaryNav = $("#primaryNav");
  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav?.classList.toggle("is-open", !expanded);
  });
  $$("#primaryNav a").forEach(link => link.addEventListener("click", () => {
    primaryNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Toast / secret message
  const toast = $("#secretMessage");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    safeText(toast, message);
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = later(() => toast.classList.remove("is-visible"), 3600);
  }

  // Terminal
  const terminalOutput = $("#terminalOutput");
  const terminalForm = $("#terminalForm");
  const terminalInput = $("#terminalInput");

  function printLine(message, type = "") {
    if (!terminalOutput) return;
    const p = document.createElement("p");
    p.textContent = message;
    if (type) p.classList.add(type);
    terminalOutput.appendChild(p);
    while (terminalOutput.children.length > 90) terminalOutput.firstElementChild.remove();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function printGameLink() {
    if (!terminalOutput) return;
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = GAME_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "OPEN THE ABANDONED ON ROBLOX ↗";
    p.appendChild(a);
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Document modal
  const fileModal = $("#fileModal");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");
  const closeModalButton = $("#closeModal");
  const documents = {
    patient: {
      title: "PATIENT RECORDS // FILE 001",
      text: `PATIENT: UNKNOWN
STATUS: MISSING
LOCATION: LOWER HOSPITAL WING

The patient was last seen near the elevator at 03:17 AM.

Security footage has been removed.

A handwritten note was found:

“IT KNOWS MY NAME.”

[ADDITIONAL INFORMATION REDACTED]`
    },
    experiment: {
      title: "EXPERIMENT LOG // FILE 002",
      text: `PROJECT: UNKNOWN
LOCATION: RESTRICTED LABORATORY
STATUS: TERMINATED

Unusual sounds were reported beneath the hospital.

Staff members refused to enter the lower floors.

The final recording contains only breathing.

[RECORDING LOST]`
    },
    incident: {
      title: "INCIDENT REPORT // FILE 003",
      text: `INCIDENT: 03:17 AM
LOCATION: MAIN HALL
ALL STAFF: UNACCOUNTED FOR

Emergency lights activated.
All exits were locked.

Camera 03 recorded movement after the building was evacuated.

No explanation was provided.

[REPORT SEALED]`
    }
  };

  function openFile(id) {
    const data = documents[id];
    if (!data || !fileModal) return;
    safeText(modalTitle, data.title);
    safeText(modalText, data.text);
    fileModal.hidden = false;
    state.modalOpen = true;
    document.body.classList.add("has-overlay");
    closeModalButton?.focus();
  }

  function closeFile() {
    if (!fileModal) return;
    fileModal.hidden = true;
    state.modalOpen = false;
    document.body.classList.remove("has-overlay");
  }

  $$("[data-file]").forEach(button => {
    button.addEventListener("click", () => openFile(button.dataset.file));
  });

  closeModalButton?.addEventListener("click", closeFile);

  fileModal?.addEventListener("click", event => {
    if (event.target === fileModal) closeFile();
  });

  // Camera network
  const cameras = [
    {
      name: "CAM 01 // MAIN HALL",
      message: "SIGNAL CONNECTED",
      status: "SYSTEM ONLINE",
      scene: "hall"
    },
    {
      name: "CAM 02 // PATIENT WING",
      message: "MOVEMENT DETECTED",
      status: "SIGNAL UNSTABLE",
      scene: "wing"
    },
    {
      name: "CAM 03 // LOWER FLOOR",
      message: "NO SIGNAL",
      status: "CONNECTION LOST",
      scene: "dark"
    },
    {
      name: "CAM 04 // RESTRICTED ROOM",
      message: "UNKNOWN ENTITY",
      status: "WARNING",
      scene: "entity"
    },
    {
      name: "CAM 05 // SEALED WARD",
      message: "SUBJECT STANDING STILL",
      status: "SIGNAL COMPROMISED",
      scene: "sealed"
    }
  ];

  const cameraScreen = $("#cameraScreen");
  const cameraButtons = $$(".camera-button");
  const cameraName = $("#cameraName");
  const cameraMessage = $("#cameraMessage");
  const cameraStatus = $("#cameraStatus");
  const cameraTime = $("#cameraTime");

  function selectCamera(index, announce = true) {
    const camera = cameras[index];
    if (!camera || !cameraScreen) return;

    state.selectedCamera = index;
    cameraScreen.dataset.camera = String(index);
    cameraScreen.dataset.scene = camera.scene;

    safeText(cameraName, camera.name);
    safeText(cameraMessage, camera.message);
    safeText(cameraStatus, camera.status);

    cameraButtons.forEach(button => {
      const active = Number(button.dataset.camera) === index;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (announce) {
      printLine(`[CAMERA] CONNECTED TO CAM 0${index + 1}.`);
    }

    if (index === 3) {
      showToast("CAMERA 04 // SOMETHING IS WATCHING.");
    }

    if (index === 4) {
      showToast("CAMERA 05 WAS REMOVED FROM THE ORIGINAL NETWORK.");
    }
  }

  cameraButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectCamera(Number(button.dataset.camera));
    });
  });

  function updateClock() {
    const now = new Date().toLocaleTimeString([], { hour12: false });
    safeText(cameraTime, `REC ● ${now}`);
    safeText($("#liveFeedClock"), now);
  }

  updateClock();
  every(updateClock, 1000);

  every(() => {
    if (!cameraScreen || document.hidden || Math.random() > 0.17) return;

    cameraScreen.classList.add("is-interference");
    later(() => cameraScreen.classList.remove("is-interference"), 520);
  }, 10500);

  // Night vision
  const nightVisionButton = $("#nightVisionToggle");

  function toggleNightVision() {
    state.nightVision = !state.nightVision;

    document.body.classList.toggle("night-vision", state.nightVision);

    nightVisionButton?.setAttribute(
      "aria-pressed",
      String(state.nightVision)
    );

    safeText(
      nightVisionButton,
      state.nightVision ? "◉ NIGHT VISION: ON" : "◉ NIGHT VISION: OFF"
    );

    showToast(
      state.nightVision
        ? "NIGHT VISION ACTIVATED."
        : "NIGHT VISION DISABLED."
    );
  }

  nightVisionButton?.addEventListener("click", toggleNightVision);

  // Secret archive codes
  const secretCodes = {
    THEPATIENT: "filePatient",
    NIGHTSHIFT: "fileNightshift",
    "0427": "file0427",
    DONTLOOK: "fileDontlook",
    THEST4LKER: "fileStalker"
  };

  const secretFragments = [
    "THEPATIENT",
    "NIGHTSHIFT",
    "0427",
    "DONTLOOK",
    "THEST4LKER"
  ];

  function storageGet(key) {
    return storage.get(key);
  }

  function isAllFragmentsUnlocked() {
    return secretFragments.every(
      code => storageGet(`secret_${code}`) === "true"
    );
  }

  function unlockSecretCode(rawCode) {
    const code = rawCode.trim().toUpperCase();
    const fileId = secretCodes[code];

    if (!fileId) return false;

    const archive = $("#secretArchives");
    const file = document.getElementById(fileId);

    if (!archive || !file) {
      printLine("ARCHIVE FILE NOT FOUND.", "terminal-red");
      return true;
    }

    reveal(archive, true);
    file.hidden = false;
    file.classList.add("is-unlocked");

    storage.set(`secret_${code}`, "true");

    printLine("ACCESS GRANTED.", "terminal-green");
    printLine(`SECRET FILE RECOVERED: ${code}`, "terminal-green");

    showToast("SECRET FILE RECOVERED.");

    if (isAllFragmentsUnlocked()) {
      printLine("ALL FIVE FRAGMENTS RECOVERED.", "terminal-green");
      printLine("THE PROJECT ARCHIVE IS NOW AVAILABLE.");
      unlockProjectArchive(false);
    }

    return true;
  }

  function restoreSecretFiles() {
    let any = false;

    Object.entries(secretCodes).forEach(([code, id]) => {
      if (storage.get(`secret_${code}`) !== "true") return;

      const file = document.getElementById(id);

      if (file) {
        file.hidden = false;
        file.classList.add("is-unlocked");
        any = true;
      }
    });

    if (any) reveal($("#secretArchives"));
  }

  // Ward 13 and final entry
  const ward = $("#ward13Archive");

  function unlockWard13(shouldScroll = true) {
    if (!ward) {
      printLine("WARD 13 ARCHIVE NOT FOUND.", "terminal-red");
      return;
    }

    reveal(ward, shouldScroll);
    storage.set("ward13Unlocked", "true");

    printLine("ACCESS GRANTED // WELCOME TO WARD 13.", "terminal-green");
    printLine("THEY NEVER LEFT.");

    showToast("WARD 13 UNLOCKED.");
  }

  if (storage.get("ward13Unlocked") === "true") {
    reveal(ward);
  }

  const readSecretButton = $("#readSecret");

  readSecretButton?.addEventListener("click", () => {
    const entry = $("#secretEntry");

    if (entry) entry.hidden = false;

    readSecretButton.hidden = true;
    showToast("FINAL PATIENT ENTRY RECOVERED.");
  });

  // Project archive: requires every secret fragment.
  function unlockProjectArchive(shouldScroll = true) {
    if (!isAllFragmentsUnlocked()) {
      printLine(
        "ACCESS DENIED // ALL FIVE FRAGMENTS REQUIRED.",
        "terminal-red"
      );
      return false;
    }

    const project = $("#projectAbandoned");

    if (!project) {
      printLine("PROJECT ARCHIVE NOT FOUND.", "terminal-red");
      return false;
    }

    reveal(project, shouldScroll);
    storage.set("projectAbandonedUnlocked", "true");

    printLine("PROJECT ABANDONED DECLASSIFIED.", "terminal-green");
    showToast("YOU FOUND PROJECT ABANDONED.");

    return true;
  }

  restoreSecretFiles();

  if (
    storage.get("projectAbandonedUnlocked") === "true" &&
    isAllFragmentsUnlocked()
  ) {
    reveal($("#projectAbandoned"));
  }

  // Emergency mode
  const emergencyToggle = $("#emergencyToggle");
  const emergencyBanner = $("#emergencyBanner");

  function toggleEmergency(force) {
    state.emergency = typeof force === "boolean"
      ? force
      : !state.emergency;

    document.body.classList.toggle(
      "emergency-mode",
      state.emergency
    );

    emergencyToggle?.setAttribute(
      "aria-pressed",
      String(state.emergency)
    );

    emergencyToggle?.classList.toggle(
      "is-active",
      state.emergency
    );

    if (emergencyToggle) {
      emergencyToggle.innerHTML =
        `<span class="status-light"></span> ${
          state.emergency ? "DISABLE EMERGENCY" : "EMERGENCY MODE"
        }`;
    }

    if (emergencyBanner) {
      emergencyBanner.hidden = !state.emergency;
    }

    printLine(
      state.emergency
        ? "!!! EMERGENCY PROTOCOL ACTIVE !!!"
        : "EMERGENCY PROTOCOL DISABLED.",
      state.emergency ? "terminal-red" : "terminal-green"
    );

    showToast(
      state.emergency
        ? "CONTAINMENT FAILURE."
        : "EMERGENCY PROTOCOL DISABLED."
    );
  }

  emergencyToggle?.addEventListener("click", () => toggleEmergency());

  // Broadcast warning modal. No automatic repeating popup.
  const broadcast = $("#broadcastAlert");
  const alertHeadline = $("#alertHeadline");
  const alertMessage = $("#alertMessage");
  const closeBroadcast = $("#closeBroadcastAlert");

  const warnings = [
    "ALL STAFF MUST REPORT TO THE MAIN HALLWAY.",
    "DO NOT ENTER ROOM 13. THE ROOM IS NOT EMPTY.",
    "IF YOU HEAR SOMEONE CALLING YOUR NAME, DO NOT RESPOND.",
    "UNKNOWN MOVEMENT DETECTED IN THE BASEMENT.",
    "CAMERA CONNECTION LOST. DO NOT INVESTIGATE.",
    "PLEASE IGNORE ANY VOICES COMING FROM EMPTY ROOMS.",
    "THE BUILDING IS UNDER LOCKDOWN.",
    "DO NOT APPROACH THE FIGURE IN THE EASTERN HALL."
  ];

  function showWarning(customMessage) {
    if (!broadcast || state.warningOpen) return;

    state.warningOpen = true;

    safeText(alertHeadline, "FACILITY ALERT");

    safeText(
      alertMessage,
      customMessage || warnings[Math.floor(Math.random() * warnings.length)]
    );

    broadcast.hidden = false;
    document.body.classList.add("has-overlay");

    closeBroadcast?.focus();
  }

  function closeWarning() {
    if (!broadcast) return;

    broadcast.hidden = true;
    state.warningOpen = false;

    document.body.classList.remove("has-overlay");
  }

  closeBroadcast?.addEventListener("click", closeWarning);

  broadcast?.addEventListener("click", event => {
    if (event.target === broadcast) closeWarning();
  });

  // Terminal commands
  function runCommand(raw) {
    const input = String(raw || "").trim();

    if (!input) return;

    const command = input.toUpperCase();

    printLine(`GUEST@FACILITY:~$ ${input}`);

    if (unlockSecretCode(command)) return;

    const camMatch = command.match(/^CAM(?:ERA)?\s*0?([1-5])$/);

    if (camMatch) {
      selectCamera(Number(camMatch[1]) - 1);
      return;
    }

    switch (command.toLowerCase()) {
      case "help":
        [
          "AVAILABLE COMMANDS:",
          "HELP       — SHOW THIS LIST",
          "STATUS     — FACILITY STATUS",
          "FILES      — CLASSIFIED DOCUMENTS",
          "CAMERAS    — SURVEILLANCE NETWORK",
          "CAM 1-5    — SELECT A CAMERA",
          "NIGHTVISION— TOGGLE NIGHT VISION",
          "PLAY       — OPEN ROBLOX GAME",
          "WARD13     — RESTRICTED ARCHIVE",
          "PROJECT    — LEVEL 5 ARCHIVE (ALL FIVE FRAGMENTS)",
          "BROADCAST  — EMERGENCY WARNING",
          "EMERGENCY  — TOGGLE EMERGENCY MODE",
          "CALLER     — UNKNOWN CALLER LOG",
          "DATABASE   — PATIENT DATABASE",
          "WAKE UP    — ...",
          "CLEAR      — CLEAR TERMINAL",
          "SECRET CODES: THEPATIENT / NIGHTSHIFT / 0427 / DONTLOOK / THEST4LKER"
        ].forEach(line => printLine(line));
        break;

      case "status":
        [
          "FACILITY STATUS: CRITICAL",
          "LIGHTING: UNSTABLE",
          "SECURITY: COMPROMISED",
          "EXIT DOORS: LOCKED",
          "LIFE SIGNS: UNKNOWN",
          "CAMERA NETWORK: PARTIALLY ACTIVE"
        ].forEach(line => printLine(line));
        break;

      case "files":
        [
          "AVAILABLE DOCUMENTS:",
          "FILE 001 — PATIENT RECORDS",
          "FILE 002 — EXPERIMENT LOG",
          "FILE 003 — INCIDENT REPORT",
          "FIVE ADDITIONAL FILES ARE HIDDEN."
        ].forEach(line => printLine(line));
        break;

      case "cameras":
        cameras.forEach(camera => printLine(camera.name));
        break;

      case "nightvision":
      case "night vision":
        toggleNightVision();
        break;

      case "play":
        printLine("OPENING GAME ACCESS...");
        printGameLink();
        break;

      case "ward13":
        unlockWard13();
        break;

      case "project":
        unlockProjectArchive();
        break;

      case "emergency":
        toggleEmergency();
        break;

      case "broadcast":
        showWarning();
        printLine("EMERGENCY BROADCAST TRANSMITTED.", "terminal-red");
        break;

      case "caller":
        printLine("INCOMING CALL DETECTED.");
        printLine("CALLER ID: UNKNOWN.");
        printLine("DO NOT ANSWER.");
        break;

      case "database":
        printLine("PATIENT DATABASE: ACCESS RESTRICTED.");
        printLine("SUBJECT 013: LOCATION UNKNOWN.");
        printLine("SUBJECT 0427: STATUS UNCONFIRMED.");
        break;

      case "wake up":
        printLine("...");
        printLine("YOU ARE NOT SUPPOSED TO BE HERE.", "terminal-red");
        printLine("SOMETHING HAS NOTICED YOU.", "terminal-red");
        showToast("DON'T TURN AROUND.");
        break;

      case "clear":
        terminalOutput?.replaceChildren();
        printLine("TERMINAL CLEARED.");
        break;

      default:
        printLine("UNKNOWN COMMAND.", "terminal-red");
        printLine("TYPE HELP TO SEE AVAILABLE COMMANDS.");
    }
  }

  terminalForm?.addEventListener("submit", event => {
    event.preventDefault();

    runCommand(terminalInput?.value || "");

    if (terminalInput) {
      terminalInput.value = "";
      terminalInput.focus();
    }
  });

  // Live facility feed
  const feed = $("#liveFeedLog");

  const feedEvents = [
    ["NOTICE", "NORTH WING LIGHTS FLICKERING."],
    ["WARNING", "MOTION DETECTED // CORRIDOR 02."],
    ["SYSTEM", "BACKUP GENERATOR: UNSTABLE."],
    ["WARNING", "UNIDENTIFIED ACCESS CARD USED."],
    ["ERROR", "CAMERA 05 TRANSMITTING UNKNOWN SIGNAL."],
    ["NOTICE", "NO STAFF RESPONDING TO RADIO CHECK."],
    ["CRITICAL", "SOMETHING MOVED INSIDE THE SEALED WARD."],
    ["SYSTEM", "DO NOT ATTEMPT TO RESTORE THE ELEVATOR."],
    ["WARNING", "ROOM 13 DOOR SENSOR ACTIVATED."]
  ];

  let feedIndex = 0;

  function addFeedEvent() {
    if (!feed || document.hidden) return;

    const [type, message] = feedEvents[feedIndex++ % feedEvents.length];

    const p = document.createElement("p");
    const time = document.createElement("time");
    const label = document.createElement("span");

    time.textContent = new Date().toLocaleTimeString([], {
      hour12: false
    });

    label.textContent = `${type} // `;
    label.className = `feed-${type.toLowerCase()}`;

    p.append(time, label, document.createTextNode(message));
    feed.appendChild(p);

    while (feed.children.length > 7) {
      feed.firstElementChild.remove();
    }

    feed.scrollTop = feed.scrollHeight;
  }

  addFeedEvent();
  every(addFeedEvent, 6200);

  // Easter eggs: five logo clicks and keyboard sequence ABANDON.
  const logo = $("#logo");
  let logoTimer;

  logo?.addEventListener("click", () => {
    state.logoClicks++;

    window.clearTimeout(logoTimer);

    logoTimer = later(() => {
      state.logoClicks = 0;
    }, 2200);

    if (state.logoClicks >= 5) {
      state.logoClicks = 0;
      showToast("YOU FOUND THE FIRST SECRET.");
      runCommand("wake up");
    }
  });

  const secretSequence = ["a", "b", "a", "n", "d", "o", "n"];

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (state.modalOpen) closeFile();
      if (state.warningOpen) closeWarning();

      primaryNav?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.matches("input, textarea, select")
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === secretSequence[state.sequenceIndex]) {
      state.sequenceIndex++;

      if (state.sequenceIndex === secretSequence.length) {
        state.sequenceIndex = 0;

        showToast("THE HOSPITAL REMEMBERS YOU.");
        unlockWard13();
      }
    } else {
      state.sequenceIndex = key === "a" ? 1 : 0;
    }
  });

  // Occasional subtle visual corruption; never blocks interaction.
  every(() => {
    if (!document.hidden && Math.random() < 0.22) {
      document.body.classList.add("is-corrupted");

      later(() => {
        document.body.classList.remove("is-corrupted");
      }, 420);
    }
  }, 52000);

  // Initial state
  selectCamera(0, false);

  printLine("SYSTEM INITIALIZED.", "terminal-green");
  printLine("CONNECTION ESTABLISHED.");
  printLine("TYPE HELP TO CONTINUE.");

  console.info("THE ABANDONED // FACILITY SYSTEM ONLINE");
})();
