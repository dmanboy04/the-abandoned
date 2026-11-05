// ==========================================
// THE ABANDONED - INTERACTIVE SYSTEM
// ==========================================

const ROBLOX_URL = "https://www.roblox.com/games/116357638869409/The-Abandoned";

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
    });
}, { threshold: 0.12 });

sections.forEach((section) => observer.observe(section));

function revealSection(element, extraClass = "") {
    if (!element) return;
    element.hidden = false;
    element.classList.add("visible");
    if (extraClass) element.classList.add(extraClass);
    observer.observe(element);
}

// ==========================================
// SECRET CODE DEFINITIONS
// ==========================================

const secretCodes = {
    THEPATIENT: "filePatient",
    NIGHTSHIFT: "fileNightshift",
    "0427": "file0427",
    DONTLOOK: "fileDontlook",
    THEST4LKER: "fileStalker"
};

function unlockSecretCode(code) {
    const normalizedCode = code.trim().toUpperCase();
    const fileId = secretCodes[normalizedCode];

    if (!fileId) return false;

    const archive = document.getElementById("secretArchives");
    const file = document.getElementById(fileId);

    if (!archive || !file) return false;

    revealSection(archive);
    file.hidden = false;

    localStorage.setItem("secret_" + normalizedCode, "true");

    setTimeout(() => {
        file.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    showSecret("SECRET FILE RECOVERED: " + normalizedCode);

    return true;
}

function restoreSecretFiles() {
    let foundAny = false;

    Object.keys(secretCodes).forEach((code) => {
        if (localStorage.getItem("secret_" + code) === "true") {
            const file = document.getElementById(secretCodes[code]);

            if (file) {
                file.hidden = false;
                foundAny = true;
            }
        }
    });

    if (foundAny) {
        revealSection(document.getElementById("secretArchives"));
    }
}

restoreSecretFiles();

// ==========================================
// CLASSIFIED FILE MODAL
// ==========================================

const documents = {
    patient: {
        title: "PATIENT RECORDS // FILE 001",
        text: `PATIENT: UNKNOWN

STATUS: MISSING

LOCATION: LOWER HOSPITAL WING

NOTES:
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

NOTES:
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

NOTES:
Emergency lights activated.

All exits were locked.

Camera 03 recorded movement after the building was evacuated.

No explanation was provided.

[REPORT SEALED]`
    }
};

const fileModal = document.getElementById("fileModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function openFile(fileId) {
    const file = documents[fileId];

    if (!file || !fileModal) return;

    modalTitle.textContent = file.title;
    modalText.textContent = file.text;

    fileModal.hidden = false;
    document.body.style.overflow = "hidden";

    showSecret("CONFIDENTIAL FILE ACCESSED");
}

document.querySelectorAll(".file-button").forEach((button) => {
    button.addEventListener("click", () => {
        openFile(button.dataset.file);
    });
});

function closeFile() {
    if (!fileModal) return;

    fileModal.hidden = true;
    document.body.style.overflow = "";
}

const closeModalButton = document.getElementById("closeModal");

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeFile);
}

if (fileModal) {
    fileModal.addEventListener("click", (event) => {
        if (event.target === fileModal) closeFile();
    });

    document.body.appendChild(fileModal);
}

// ==========================================
// SECURITY CAMERA SYSTEM
// ==========================================

const cameraData = [
    {
        name: "CAM 01 // MAIN HALL",
        message: "SIGNAL CONNECTED",
        status: "SYSTEM ONLINE"
    },
    {
        name: "CAM 02 // PATIENT WING",
        message: "MOVEMENT DETECTED",
        status: "SIGNAL UNSTABLE"
    },
    {
        name: "CAM 03 // LOWER FLOOR",
        message: "NO SIGNAL",
        status: "CONNECTION LOST"
    },
    {
        name: "CAM 04 // RESTRICTED ROOM",
        message: "UNKNOWN ENTITY",
        status: "WARNING"
    },
    {
        name: "CAM 05 // SEALED WARD",
        message: "SUBJECT STANDING STILL",
        status: "SIGNAL COMPROMISED"
    }
];

const cameraScreen = document.getElementById("cameraScreen");
const cameraName = document.getElementById("cameraName");
const cameraMessage = document.getElementById("cameraMessage");
const cameraStatus = document.getElementById("cameraStatus");
const cameraButtons = document.querySelectorAll(".camera-button");

function selectCamera(index) {
    const camera = cameraData[index];

    if (!camera || !cameraScreen) return;

    cameraScreen.dataset.camera = String(index);

    if (cameraName) cameraName.textContent = camera.name;
    if (cameraMessage) cameraMessage.textContent = camera.message;
    if (cameraStatus) cameraStatus.textContent = camera.status;

    cameraButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            Number(button.dataset.camera) === index
        );
    });

    if (index === 3) {
        showSecret("SOMETHING IS WATCHING.");
    }

    if (index === 4) {
        showSecret("CAMERA 05 WAS DISCONNECTED FOR A REASON.");
        cameraScreen.classList.add("camera-five-active");
    } else {
        cameraScreen.classList.remove("camera-five-active");
    }
}

document.querySelector(".camera-controls")?.addEventListener("click", (event) => {
    const button = event.target.closest(".camera-button");

    if (!button) return;

    const index = Number(button.dataset.camera);

    if (Number.isInteger(index) && index >= 0 && index < cameraData.length) {
        selectCamera(index);
    }
});

// ==========================================
// TERMINAL + WARD 13 + PROJECT ARCHIVE
// ==========================================

const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

let terminalUnlocked = localStorage.getItem("ward13Unlocked") === "true";

function printLine(message, type = "") {
    if (!terminalOutput) return;

    const line = document.createElement("p");
    line.textContent = message;

    if (type) line.className = type;

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function printPlayLink() {
    if (!terminalOutput) return;

    const line = document.createElement("p");
    const link = document.createElement("a");

    link.href = ROBLOX_URL;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "OPEN THE ABANDONED ON ROBLOX ↗";
    link.style.color = "#83d98d";

    line.appendChild(link);
    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function unlockWard13() {
    terminalUnlocked = true;

    localStorage.setItem("ward13Unlocked", "true");

    const archive = document.getElementById("ward13Archive");

    if (archive) {
        revealSection(archive, "ward13-unlocked");

        setTimeout(() => {
            archive.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 120);
    }

    showSecret("WARD 13 UNLOCKED. ACCESS GRANTED.");
}

function unlockProjectArchive() {
    const allUnlocked = Object.keys(secretCodes).every((code) => {
        return localStorage.getItem("secret_" + code) === "true";
    });

    if (!allUnlocked) {
        printLine("ACCESS DENIED.", "terminal-red");
        printLine("FIVE SECRET FILES MUST BE RECOVERED FIRST.");
        return;
    }

    const project = document.getElementById("projectAbandoned");

    if (!project) {
        printLine("PROJECT FILE NOT FOUND.", "terminal-red");
        return;
    }

    revealSection(project);

    localStorage.setItem("projectAbandonedUnlocked", "true");

    printLine("ACCESS GRANTED.", "terminal-green");
    printLine("PROJECT ABANDONED UNLOCKED.");

    setTimeout(() => {
        project.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 120);

    showSecret("YOU FOUND PROJECT ABANDONED.");
}

function restoreUnlockedSections() {
    if (terminalUnlocked) {
        const ward = document.getElementById("ward13Archive");

        if (ward) revealSection(ward);
    }

    if (localStorage.getItem("projectAbandonedUnlocked") === "true") {
        const project = document.getElementById("projectAbandoned");

        if (project) revealSection(project);
    }
}

restoreUnlockedSections();

const readSecretButton = document.getElementById("readSecret");

if (readSecretButton) {
    readSecretButton.addEventListener("click", () => {
        const entry = document.getElementById("secretEntry");

        if (entry) entry.hidden = false;

        readSecretButton.hidden = true;
    });
}

// ==========================================
// TERMINAL COMMANDS
// ==========================================

function runCommand(rawCommand) {
    const command = rawCommand.trim().toUpperCase();

    if (!command) return;

    printLine("GUEST@FACILITY:~$ " + rawCommand);

    // Secret codes are checked before normal terminal commands.
    if (unlockSecretCode(command)) {
        printLine("ACCESS GRANTED.", "terminal-green");
        printLine("SECRET FILE RECOVERED.");
        return;
    }

    switch (command.toLowerCase()) {
        case "help":
            printLine("AVAILABLE COMMANDS:");
            printLine("help     - Show commands");
            printLine("status   - Facility status");
            printLine("files    - List classified files");
            printLine("cameras  - Surveillance overview");
            printLine("play     - Open Roblox game");
            printLine("clear    - Clear terminal");
            printLine("wake up  - Unknown command");
            printLine("ward13   - Restricted access");
            printLine("project  - Level 5 archive (requires all five secret files)");
            printLine("emergency - Toggle emergency protocol");
            break;

        case "status":
            printLine("FACILITY STATUS: CRITICAL");
            printLine("LIGHTING: UNSTABLE");
            printLine("SECURITY: COMPROMISED");
            printLine("EXIT DOORS: LOCKED");
            printLine("LIFE SIGNS: UNKNOWN");
            break;

        case "files":
            printLine("AVAILABLE DOCUMENTS:");
            printLine("FILE 001 - PATIENT RECORDS");
            printLine("FILE 002 - EXPERIMENT LOG");
            printLine("FILE 003 - INCIDENT REPORT");
            printLine("Enter the recovered secret codes to unlock hidden files.");
            break;

        case "cameras":
            printLine("SURVEILLANCE NETWORK:");
            printLine("CAM 01 - MAIN HALL");
            printLine("CAM 02 - PATIENT WING");
            printLine("CAM 03 - LOWER FLOOR");
            printLine("CAM 04 - RESTRICTED ROOM");
            printLine("CAM 05 - SEALED WARD // SIGNAL COMPROMISED");
            break;

        case "play":
            printLine("OPENING GAME ACCESS...");
            printPlayLink();
            break;

        case "clear":
            if (terminalOutput) terminalOutput.replaceChildren();
            printLine("TERMINAL CLEARED.");
            break;

        case "wake up":
            printLine("...");
            printLine("YOU ARE NOT SUPPOSED TO BE HERE.", "terminal-red");
            printLine("SOMETHING HAS NOTICED YOU.", "terminal-red");
            showSecret("DON'T TURN AROUND.");
            break;

        case "ward13":
            if (!terminalUnlocked) {
                unlockWard13();

                printLine("ACCESS GRANTED.", "terminal-green");
                printLine("WELCOME TO WARD 13.");
                printLine("THEY NEVER LEFT.");
                printLine("SECRET ARCHIVE UNLOCKED.");
            } else {
                printLine("WARD 13 ACCESS ALREADY GRANTED.");
                printLine("THE SECRET ARCHIVE IS AVAILABLE.");
            }
            break;

        case "project":
            unlockProjectArchive();
            break;

        case "emergency":
            toggleEmergencyMode();
            break;

        default:
            printLine("UNKNOWN COMMAND.", "terminal-red");
            printLine("TYPE HELP TO SEE AVAILABLE COMMANDS.");
    }
}

if (terminalForm) {
    terminalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const command = terminalInput ? terminalInput.value : "";

        runCommand(command);

        if (terminalInput) {
            terminalInput.value = "";
            terminalInput.focus();
        }
    });
}

// ==========================================
// LIVE SYSTEM FEED
// ==========================================

const liveFeedLog = document.getElementById("liveFeedLog");
const liveFeedClock = document.getElementById("liveFeedClock");

const liveFeedEvents = [
    ["NOTICE", "NORTH WING LIGHTS FLICKERING."],
    ["WARNING", "MOTION DETECTED // CORRIDOR 02."],
    ["SYSTEM", "BACKUP GENERATOR: UNSTABLE."],
    ["WARNING", "UNIDENTIFIED ACCESS CARD USED."],
    ["ERROR", "CAMERA 05 TRANSMITTING UNKNOWN SIGNAL."],
    ["NOTICE", "NO STAFF RESPONDING TO RADIO CHECK."],
    ["CRITICAL", "SOMETHING MOVED INSIDE THE SEALED WARD."],
    ["SYSTEM", "DO NOT ATTEMPT TO RESTORE THE ELEVATOR."]
];

let liveFeedIndex = 0;

function updateLiveFeedClock() {
    if (!liveFeedClock) return;

    liveFeedClock.textContent = new Date().toLocaleTimeString([], {
        hour12: false
    });
}

function addLiveFeedEvent() {
    if (!liveFeedLog) return;

    const [type, message] = liveFeedEvents[
        liveFeedIndex % liveFeedEvents.length
    ];

    liveFeedIndex++;

    const line = document.createElement("p");
    const time = document.createElement("time");
    const label = document.createElement("span");

    time.textContent = new Date().toLocaleTimeString([], {
        hour12: false
    });

    label.textContent = type + " // ";
    label.className = "feed-" + type.toLowerCase();

    line.append(time, label, document.createTextNode(message));

    liveFeedLog.appendChild(line);

    while (liveFeedLog.children.length > 6) {
        liveFeedLog.removeChild(liveFeedLog.firstElementChild);
    }

    liveFeedLog.scrollTop = liveFeedLog.scrollHeight;
}

updateLiveFeedClock();
setInterval(updateLiveFeedClock, 1000);
setInterval(addLiveFeedEvent, 5200);

// ==========================================
// EMERGENCY MODE
// ==========================================

const emergencyToggle = document.getElementById("emergencyToggle");
const emergencyBanner = document.getElementById("emergencyBanner");

let emergencyModeActive = false;

function toggleEmergencyMode(forceState) {
    emergencyModeActive = typeof forceState === "boolean"
        ? forceState
        : !emergencyModeActive;

    document.body.classList.toggle(
        "emergency-mode",
        emergencyModeActive
    );

    if (emergencyToggle) {
        emergencyToggle.setAttribute(
            "aria-pressed",
            String(emergencyModeActive)
        );

        emergencyToggle.classList.toggle(
            "active",
            emergencyModeActive
        );

        emergencyToggle.innerHTML = emergencyModeActive
            ? '<span class="emergency-light"></span> DISABLE EMERGENCY'
            : '<span class="emergency-light"></span> EMERGENCY MODE';
    }

    if (emergencyBanner) {
        emergencyBanner.hidden = !emergencyModeActive;
    }

    if (emergencyModeActive) {
        showSecret("EMERGENCY PROTOCOL INITIATED.");

        if (typeof printLine === "function") {
            printLine("!!! EMERGENCY PROTOCOL ACTIVE !!!", "terminal-red");
        }
    } else {
        showSecret("EMERGENCY PROTOCOL DISABLED.");
    }
}

if (emergencyToggle) {
    emergencyToggle.addEventListener("click", () => {
        toggleEmergencyMode();
    });
}

// ==========================================
// EASTER EGG SYSTEM
// ==========================================

const secretMessage = document.getElementById("secretMessage");

let secretTimeout;

function showSecret(message) {
    if (!secretMessage) return;

    secretMessage.textContent = message;
    secretMessage.classList.add("show");

    clearTimeout(secretTimeout);

    secretTimeout = setTimeout(() => {
        secretMessage.classList.remove("show");
    }, 3500);
}

// Click the logo five times.
const logo = document.getElementById("logo");

let logoClicks = 0;
let logoTimer;

if (logo) {
    logo.addEventListener("click", (event) => {
        event.preventDefault();

        logoClicks++;

        clearTimeout(logoTimer);

        logoTimer = setTimeout(() => {
            logoClicks = 0;
        }, 2000);

        if (logoClicks >= 5) {
            logoClicks = 0;

            showSecret("YOU FOUND THE FIRST SECRET.");
            runCommand("wake up");
        }
    });
}

// Secret keyboard sequence: A B A N D O N
const secretSequence = ["a", "b", "a", "n", "d", "o", "n"];

let sequencePosition = 0;

document.addEventListener("keydown", (event) => {
    if (
        event.target &&
        (event.target.matches("input") || event.target.matches("textarea"))
    ) {
        return;
    }

    if (event.key === "Escape" && fileModal && !fileModal.hidden) {
        closeFile();
    }

    const key = event.key.toLowerCase();

    if (key === secretSequence[sequencePosition]) {
        sequencePosition++;

        if (sequencePosition === secretSequence.length) {
            sequencePosition = 0;

            showSecret("THE HOSPITAL REMEMBERS YOU.");
            runCommand("ward13");
        }
    } else {
        sequencePosition = key === "a" ? 1 : 0;
    }
});

// ==========================================
// STARTUP
// ==========================================

console.log("THE ABANDONED SYSTEM INITIALIZED.");
console.log("ACCESS CODE: WARD13");
console.log("DO NOT TRUST CAMERA 04.");
console.log("CAMERA 05 IS NOT PART OF THE ORIGINAL NETWORK.");
