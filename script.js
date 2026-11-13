
/* =====================================================
   THE ABANDONED // FACILITY CONTROL SYSTEM
   Complete repaired website controller
   ===================================================== */

(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const GAME_URL =
    "https://www.roblox.com/games/116357638869409/The-Abandoned";

  // -----------------------------------------------------
  // STORAGE
  // -----------------------------------------------------

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Website still works if storage is unavailable.
      }
    }
  };

  const state = {
    emergency: false,
    nightVision: false,
    selectedCamera: 0,
    sequence: 0
  };

  // -----------------------------------------------------
  // GENERAL HELPERS
  // -----------------------------------------------------

  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3500);
  }

  function reveal(element, scroll = false) {
    if (!element) return;

    element.hidden = false;
    element.classList.add("is-visible");

    if (scroll) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  function safeText(element, value) {
    if (element) element.textContent = value;
  }

  // -----------------------------------------------------
  // NAVIGATION
  // -----------------------------------------------------

  const menuButton = $("#menuButton");
  const navigation = $("#navigation");

  menuButton?.addEventListener("click", () => {
    const isOpen = navigation?.classList.toggle("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(Boolean(isOpen))
    );
  });

  $$("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
      navigation?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  // -----------------------------------------------------
  // TERMINAL
  // -----------------------------------------------------

  const terminalForm = $("#terminalForm");
  const terminalInput = $("#terminalInput");
  const terminalOutput = $("#terminalOutput");

  function printLine(message, type = "") {
    if (!terminalOutput) return;

    const line = document.createElement("p");
    line.textContent = message;

    if (type) {
      line.classList.add(type);
    }

    terminalOutput.appendChild(line);

    while (terminalOutput.children.length > 90) {
      terminalOutput.firstElementChild.remove();
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function printGameLink() {
    if (!terminalOutput) return;

    const line = document.createElement("p");
    const link = document.createElement("a");

    link.href = GAME_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "OPEN THE ABANDONED ON ROBLOX ↗";

    line.appendChild(link);
    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // -----------------------------------------------------
  // CLASSIFIED FILES
  // -----------------------------------------------------

  const fileModal = $("#fileModal");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");
  const closeModal = $("#closeModal");

  const documents = {
    patient: {
      title: "PATIENT RECORDS // FILE 001",
      text: `PATIENT: UNKNOWN
STATUS: MISSING
LOCATION: LOWER HOSPITAL WING

The patient was last seen near the elevator at 03:17 AM.

Security footage has been removed.

A handwritten note was found:

"IT KNOWS MY NAME."

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
    const documentData = documents[id];

    if (!documentData || !fileModal) {
      printLine("DOCUMENT NOT FOUND.", "terminal-red");
      return;
    }

    safeText(modalTitle, documentData.title);
    safeText(modalText, documentData.text);

    fileModal.hidden = false;
    document.body.classList.add("has-overlay");

    closeModal?.focus();
  }

  function closeFile() {
    if (!fileModal) return;

    fileModal.hidden = true;
    document.body.classList.remove("has-overlay");
  }

  // IMPORTANT: Your HTML uses data-file, not .file-button.
  $$("[data-file]").forEach(button => {
    button.addEventListener("click", () => {
      openFile(button.dataset.file);
    });
  });

  closeModal?.addEventListener("click", closeFile);

  fileModal?.addEventListener("click", event => {
    if (event.target === fileModal) {
      closeFile();
    }
  });

  // -----------------------------------------------------
  // SECURITY CAMERAS
  // -----------------------------------------------------

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
      const active =
        Number(button.dataset.camera) === index;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (announce) {
      printLine(
        `[CAMERA] CONNECTED TO CAM 0${index + 1}.`
      );
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

  selectCamera(0, false);

  // -----------------------------------------------------
  // NIGHT VISION
  // -----------------------------------------------------

  const nightVisionButton = $("#nightVisionButton");

  function toggleNightVision() {
    state.nightVision = !state.nightVision;

    document.body.classList.toggle(
      "night-vision",
      state.nightVision
    );

    safeText(
      nightVisionButton,
      state.nightVision
        ? "NIGHT VISION: ON"
        : "NIGHT VISION: OFF"
    );

    nightVisionButton?.setAttribute(
      "aria-pressed",
      String(state.nightVision)
    );

    showToast(
      state.nightVision
        ? "NIGHT VISION ACTIVATED."
        : "NIGHT VISION DISABLED."
    );
  }

  nightVisionButton?.addEventListener(
    "click",
    toggleNightVision
  );

  // -----------------------------------------------------
  // SECRET FILES AND CODES
  // -----------------------------------------------------

  const secretCodes = {
    THEPATIENT: "filePatient",
    NIGHTSHIFT: "fileNightshift",
    "0427": "file0427",
    DONTLOOK: "fileDontlook",
    THEST4LKER: "fileStalker"
  };

  const secretFragments = Object.keys(secretCodes);

  const secretFiles = $("#secretFiles");

  function allFragmentsUnlocked() {
    return secretFragments.every(code =>
      storage.get(`secret_${code}`) === "true"
    );
  }

  function unlockProjectArchive(scroll = true) {
    if (!allFragmentsUnlocked()) {
      printLine(
        "ACCESS DENIED // ALL FIVE FRAGMENTS REQUIRED.",
        "terminal-red"
      );
      return false;
    }

    const project = $("#projectArchive");

    if (!project) {
      printLine(
        "PROJECT ARCHIVE NOT FOUND.",
        "terminal-red"
      );
      return false;
    }

    reveal(project, scroll);

    storage.set("projectAbandonedUnlocked", "true");

    printLine(
      "PROJECT ABANDONED DECLASSIFIED.",
      "terminal-green"
    );

    printLine("ALL CLASSIFIED DATA RECOVERED.");

    showToast("PROJECT ABANDONED UNLOCKED.");

    return true;
  }

  function unlockSecretCode(rawCode) {
    const code = String(rawCode)
      .trim()
      .toUpperCase();

    const fileId = secretCodes[code];

    if (!fileId) return false;

    const file = document.getElementById(fileId);

    if (!file || !secretFiles) {
      printLine(
        "SECRET FILE NOT FOUND.",
        "terminal-red"
      );
      return true;
    }

    reveal(secretFiles);
    file.hidden = false;
    file.classList.add("is-unlocked");

    storage.set(`secret_${code}`, "true");

    printLine("ACCESS GRANTED.", "terminal-green");
    printLine(
      `SECRET FILE RECOVERED: ${code}`,
      "terminal-green"
    );

    showToast(`SECRET FILE RECOVERED: ${code}`);

    if (allFragmentsUnlocked()) {
      printLine(
        "ALL FIVE FRAGMENTS RECOVERED.",
        "terminal-green"
      );

      printLine("PROJECT ARCHIVE UNLOCKED.");

      unlockProjectArchive(false);
    }

    return true;
  }

  // Restore previously unlocked secret files.
  function restoreSecretFiles() {
    let found = false;

    Object.entries(secretCodes).forEach(([code, fileId]) => {
      if (storage.get(`secret_${code}`) !== "true") {
        return;
      }

      const file = document.getElementById(fileId);

      if (file) {
        file.hidden = false;
        file.classList.add("is-unlocked");
        found = true;
      }
    });

    if (found) {
      reveal(secretFiles);
    }

    if (
      storage.get("projectAbandonedUnlocked") === "true" &&
      allFragmentsUnlocked()
    ) {
      reveal($("#projectArchive"));
    }
  }

  restoreSecretFiles();

  // -----------------------------------------------------
  // WARD 13
  // -----------------------------------------------------

  const ward = $("#ward13");
  const readEntryButton = $("#readEntryButton");
  const finalEntry = $("#finalEntry");

  function unlockWard13(scroll = true) {
    if (!ward) {
      printLine(
        "WARD 13 ARCHIVE NOT FOUND.",
        "terminal-red"
      );
      return;
    }

    reveal(ward, scroll);

    storage.set("ward13Unlocked", "true");

    printLine(
      "ACCESS GRANTED // WELCOME TO WARD 13.",
      "terminal-green"
    );

    printLine("THEY NEVER LEFT.");

    showToast("WARD 13 UNLOCKED.");
  }

  if (storage.get("ward13Unlocked") === "true") {
    reveal(ward);
  }

  readEntryButton?.addEventListener("click", () => {
    if (finalEntry) {
      finalEntry.hidden = false;
    }

    readEntryButton.hidden = true;

    showToast("FINAL PATIENT ENTRY RECOVERED.");
  });

  // -----------------------------------------------------
  // EMERGENCY MODE
  // -----------------------------------------------------

  const emergencyButton = $("#emergencyButton");
  const emergencyBanner = $("#emergencyBanner");

  function toggleEmergency(force) {
    state.emergency =
      typeof force === "boolean"
        ? force
        : !state.emergency;

    document.body.classList.toggle(
      "emergency-mode",
      state.emergency
    );

    if (emergencyBanner) {
      emergencyBanner.hidden = !state.emergency;
    }

    if (emergencyButton) {
      emergencyButton.textContent = state.emergency
        ? "⚠ DISABLE EMERGENCY"
        : "⚠ EMERGENCY";
    }

    printLine(
      state.emergency
        ? "!!! EMERGENCY PROTOCOL ACTIVE !!!"
        : "EMERGENCY PROTOCOL DISABLED.",
      state.emergency
        ? "terminal-red"
        : "terminal-green"
    );

    showToast(
      state.emergency
        ? "CONTAINMENT FAILURE."
        : "EMERGENCY PROTOCOL DISABLED."
    );
  }

  emergencyButton?.addEventListener("click", () => {
    toggleEmergency();
  });

  // -----------------------------------------------------
  // TERMINAL COMMANDS
  // -----------------------------------------------------

  function runCommand(rawCommand) {
    const input = String(rawCommand || "").trim();

    if (!input) return;

    const command = input.toUpperCase();

    printLine(`GUEST@FACILITY:~$ ${input}`);

    // Secret codes are checked first.
    if (unlockSecretCode(command)) {
      return;
    }

    // Camera commands: CAM 1, CAM 2, CAMERA 03, etc.
    const cameraMatch = command.match(
      /^CAM(?:ERA)?\s*0?([1-5])$/
    );

    if (cameraMatch) {
      selectCamera(Number(cameraMatch[1]) - 1);
      return;
    }

    switch (command) {
      case "HELP":
        [
          "AVAILABLE COMMANDS:",
          "HELP       - SHOW COMMANDS",
          "STATUS     - FACILITY STATUS",
          "FILES      - CLASSIFIED DOCUMENTS",
          "CAMERAS    - SURVEILLANCE NETWORK",
          "CAM 1-5    - SELECT A CAMERA",
          "NIGHTVISION- TOGGLE NIGHT VISION",
          "PLAY       - OPEN ROBLOX GAME",
          "WARD13     - UNLOCK WARD 13",
          "PROJECT    - PROJECT ARCHIVE",
          "EMERGENCY  - TOGGLE EMERGENCY MODE",
          "BROADCAST  - SEND WARNING",
          "CALLER     - UNKNOWN CALLER LOG",
          "DATABASE   - PATIENT DATABASE",
          "WAKE UP    - ...",
          "CLEAR      - CLEAR TERMINAL",
          "",
          "SECRET CODES:",
          "THEPATIENT",
          "NIGHTSHIFT",
          "0427",
          "DONTLOOK",
          "THEST4LKER"
        ].forEach(line => printLine(line));
        break;

      case "STATUS":
        [
          "FACILITY STATUS: CRITICAL",
          "LIGHTING: UNSTABLE",
          "SECURITY: COMPROMISED",
          "EXIT DOORS: LOCKED",
          "LIFE SIGNS: UNKNOWN",
          "CAMERA NETWORK: PARTIALLY ACTIVE"
        ].forEach(line => printLine(line));
        break;

      case "FILES":
        [
          "AVAILABLE DOCUMENTS:",
          "FILE 001 - PATIENT RECORDS",
          "FILE 002 - EXPERIMENT LOG",
          "FILE 003 - INCIDENT REPORT",
          "FIVE ADDITIONAL FILES ARE HIDDEN.",
          "USE THE FILES SECTION TO OPEN DOCUMENTS."
        ].forEach(line => printLine(line));

        $("#files")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        break;

      case "CAMERAS":
        cameras.forEach(camera => {
          printLine(camera.name);
        });

        $("#cameras")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        break;

      case "NIGHTVISION":
      case "NIGHT VISION":
        toggleNightVision();
        break;

      case "PLAY":
        printLine("OPENING GAME ACCESS...");
        printGameLink();
        break;

      case "WARD13":
      case "WARD 13":
        unlockWard13();
        break;

      case "PROJECT":
      case "PROJECT ABANDONED":
        unlockProjectArchive();
        break;

      case "EMERGENCY":
        toggleEmergency();
        break;

      case "BROADCAST":
        printLine(
          "EMERGENCY BROADCAST TRANSMITTED.",
          "terminal-red"
        );

        printLine(
          "WARNING: UNKNOWN MOVEMENT DETECTED."
        );

        showToast("EMERGENCY BROADCAST TRANSMITTED.");
        break;

      case "CALLER":
        printLine("INCOMING CALL DETECTED.");
        printLine("CALLER ID: UNKNOWN.");
        printLine("DO NOT ANSWER.");
        break;

      case "DATABASE":
        printLine("PATIENT DATABASE: ACCESS RESTRICTED.");
        printLine("SUBJECT 013: LOCATION UNKNOWN.");
        printLine("SUBJECT 0427: STATUS UNCONFIRMED.");
        break;

      case "WAKE UP":
        printLine("...");
        printLine(
          "YOU ARE NOT SUPPOSED TO BE HERE.",
          "terminal-red"
        );
        printLine(
          "SOMETHING HAS NOTICED YOU.",
          "terminal-red"
        );
        showToast("DON'T TURN AROUND.");
        break;

      case "CLEAR":
        terminalOutput?.replaceChildren();
        printLine("TERMINAL CLEARED.");
        break;

      default:
        printLine("UNKNOWN COMMAND.", "terminal-red");
        printLine("TYPE HELP TO SEE AVAILABLE COMMANDS.");
        break;
    }
  }

  // Prevent the browser from refreshing the page.
  terminalForm?.addEventListener("submit", event => {
    event.preventDefault();

    runCommand(terminalInput?.value || "");

    if (terminalInput) {
      terminalInput.value = "";
      terminalInput.focus();
    }
  });

  // -----------------------------------------------------
  // LIVE SYSTEM FEED AND CLOCK
  // -----------------------------------------------------

  const feed = $("#feedOutput");
  const clock = $("#clock");

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

  function updateClock() {
    const now = new Date().toLocaleTimeString([], {
      hour12: false
    });

    safeText(clock, now);
  }

  function addFeedEvent() {
    if (!feed || document.hidden) return;

    const [type, message] =
      feedEvents[feedIndex % feedEvents.length];

    feedIndex++;

    const line = document.createElement("p");
    const time = document.createElement("time");
    const label = document.createElement("span");

    time.textContent = new Date().toLocaleTimeString([], {
      hour12: false
    });

    label.textContent = `${type} // `;
    label.className = `feed-${type.toLowerCase()}`;

    line.append(
      time,
      document.createTextNode(" "),
      label,
      document.createTextNode(message)
    );

    feed.appendChild(line);

    while (feed.children.length > 7) {
      feed.firstElementChild.remove();
    }

    feed.scrollTop = feed.scrollHeight;
  }

  updateClock();
  addFeedEvent();

  setInterval(updateClock, 1000);
  setInterval(addFeedEvent, 6200);

  // -----------------------------------------------------
  // CAMERA INTERFERENCE
  // -----------------------------------------------------

  setInterval(() => {
    if (
      !cameraScreen ||
      document.hidden ||
      Math.random() > 0.17
    ) {
      return;
    }

    cameraScreen.classList.add("is-interference");

    setTimeout(() => {
      cameraScreen.classList.remove("is-interference");
    }, 520);
  }, 10500);

  // -----------------------------------------------------
  // SECRET EASTER EGGS
  // -----------------------------------------------------

  const logo = $(".logo");
  let logoClicks = 0;
  let logoTimer;

  logo?.addEventListener("click", () => {
    logoClicks++;

    clearTimeout(logoTimer);

    logoTimer = setTimeout(() => {
      logoClicks = 0;
    }, 2200);

    if (logoClicks >= 5) {
      logoClicks = 0;

      showToast("YOU FOUND THE FIRST SECRET.");

      runCommand("wake up");
    }
  });

  // Type ABANDON anywhere outside an input.
  const secretSequence = [
    "a", "b", "a", "n", "d", "o", "n"
  ];

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeFile();

      navigation?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.matches("input, textarea, select")
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === secretSequence[state.sequence]) {
      state.sequence++;

      if (state.sequence === secretSequence.length) {
        state.sequence = 0;

        showToast("THE HOSPITAL REMEMBERS YOU.");

        unlockWard13();
      }
    } else {
      state.sequence = key === "a" ? 1 : 0;
    }
  });

  // -----------------------------------------------------
  // INITIALIZE
  // -----------------------------------------------------

  printLine("SYSTEM INITIALIZED.", "terminal-green");
  printLine("CONNECTION ESTABLISHED.");
  printLine("TYPE HELP TO CONTINUE.");

  console.info(
    "THE ABANDONED // FACILITY SYSTEM ONLINE"
  );

})();
