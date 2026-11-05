// ==========================================
// THE ABANDONED - COMPLETE INTERACTIVE SYSTEM
// ==========================================

const ROBLOX_URL =
    "https://www.roblox.com/games/116357638869409/The-Abandoned";

// ==========================================
// SECRET CODES
// ==========================================

const secretCodes = {
    THEPATIENT: "filePatient",
    NIGHTSHIFT: "fileNightshift",
    "0427": "file0427",
    DONTLOOK: "fileDontlook",
    THEST4LKER: "fileStalker"
};

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.12
});

sections.forEach(section => observer.observe(section));

// ==========================================
// SECRET MESSAGE
// ==========================================

const secretMessage = document.getElementById("secretMessage");

let secretTimeout;

function showSecret(message) {
    secretMessage.textContent = message;
    secretMessage.classList.add("show");

    clearTimeout(secretTimeout);

    secretTimeout = setTimeout(() => {
        secretMessage.classList.remove("show");
    }, 3500);
}

// ==========================================
// CLASSIFIED FILES
// ==========================================

const documents = {
    patient: {
        title: "PATIENT RECORDS // FILE 001",
        text: `PATIENT: UNKNOWN

STATUS: MISSING

LOCATION: LOWER HOSPITAL WING

NOTES:
The patient was last seen near the
elevator at 03:17 AM.

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
Unusual sounds were reported
beneath the hospital.

Staff members refused to enter
the lower floors.

The final recording contains
only breathing.

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

Camera 03 recorded movement
after the building was evacuated.

No explanation was provided.

[REPORT SEALED]`
    }
};

const fileModal = document.getElementById("fileModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function openFile(fileId) {
    const file = documents[fileId];

    if (!file) return;

    modalTitle.textContent = file.title;
    modalText.textContent = file.text;

    fileModal.hidden = false;
    document.body.style.overflow = "hidden";

    showSecret("CONFIDENTIAL FILE ACCESSED");
}

document.querySelectorAll(".file-button").forEach(button => {
    button.addEventListener("click", () => {
        openFile(button.dataset.file);
    });
});

function closeFile() {
    fileModal.hidden = true;
    document.body.style.overflow = "";
}

document.getElementById("closeModal").addEventListener(
    "click",
    closeFile
);

fileModal.addEventListener("click", event => {
    if (event.target === fileModal) {
        closeFile();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !fileModal.hidden) {
        closeFile();
    }
});

document.body.appendChild(fileModal);

// ==========================================
// SECURITY CAMERAS
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
    }
];

const cameraScreen = document.getElementById("cameraScreen");
const cameraName = document.getElementById("cameraName");
const cameraMessage = document.getElementById("cameraMessage");
const cameraStatus = document.getElementById("cameraStatus");

const cameraButtons = document.querySelectorAll(".camera-button");

function selectCamera(index) {
    const camera = cameraData[index];

    if (!camera) return;

    cameraScreen.dataset.camera = index;
    cameraName.textContent = camera.name;
    cameraMessage.textContent = camera.message;
    cameraStatus.textContent = camera.status;

    cameraButtons.forEach(button => {
        button.classList.toggle(
            "active",
            Number(button.dataset.camera) === index
        );
    });

    if (index === 3) {
        showSecret("SOMETHING IS WATCHING.");
    }
}

cameraButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectCamera(Number(button.dataset.camera));
    });
});

// ==========================================
// ARCHIVE UNLOCKING
// ==========================================

function showArchive(archive) {
    if (!archive) return;

    archive.hidden = false;
    archive.classList.add("visible");

    observer.observe(archive);
}

function unlockWard13() {
    localStorage.setItem("ward13Unlocked", "true");

    const archive = document.getElementById("ward13Archive");

    if (archive) {
        showArchive(archive);
        archive.classList.add("ward13-unlocked");

        archive.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    showSecret("WARD 13 UNLOCKED. ACCESS GRANTED.");
}

function unlockSecretCode(code) {
    const normalizedCode = code.trim().toUpperCase();
    const fileId = secretCodes[normalizedCode];

    if (!fileId) return false;

    const archive = document.getElementById("secretArchives");
    const file = document.getElementById(fileId);

    if (!archive || !file) return false;

    showArchive(archive);

    file.hidden = false;

    localStorage.setItem("secret_" + normalizedCode, "true");

    file.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    return true;
}

// ==========================================
// RESTORE SAVED UNLOCKS
// ==========================================

function restoreArchives() {

    if (localStorage.getItem("ward13Unlocked") === "true") {
        showArchive(document.getElementById("ward13Archive"));
    }

    Object.keys(secretCodes).forEach(code => {

        if (localStorage.getItem("secret_" + code) === "true") {

            const archive = document.getElementById("secretArchives");
            const file = document.getElementById(secretCodes[code]);

            showArchive(archive);

            if (file) {
                file.hidden = false;
            }
        }
    });

    if (localStorage.getItem("projectAbandonedUnlocked") === "true") {
        showArchive(document.getElementById("projectAbandoned"));
    }
}

restoreArchives();

// ==========================================
// WARD 13 PATIENT JOURNAL
// ==========================================

document.getElementById("readSecret").addEventListener("click", () => {

    const entry = document.getElementById("secretEntry");
    const button = document.getElementById("readSecret");

    entry.hidden = false;
    button.hidden = true;

    showSecret("FINAL PATIENT RECORD ACCESSED.");
});

// ==========================================
// TERMINAL
// ==========================================

const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

function printLine(message, type = "") {

    const line = document.createElement("p");

    line.textContent = message;

    if (type) {
        line.className = type;
    }

    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function printPlayLink() {

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

// ==========================================
// PROJECT ABANDONED
// ==========================================

function allSecretFilesFound() {

    return Object.keys(secretCodes).every(code =>
        localStorage.getItem("secret_" + code) === "true"
    );
}

function unlockProjectAbandoned() {

    if (!allSecretFilesFound()) {

        printLine("ACCESS DENIED.", "terminal-red");
        printLine("FIVE SECRET FILES ARE REQUIRED.");

        return;
    }

    const archive = document.getElementById("projectAbandoned");

    if (!archive) {
        printLine("PROJECT ARCHIVE NOT FOUND.", "terminal-red");
        return;
    }

    showArchive(archive);

    localStorage.setItem("projectAbandonedUnlocked", "true");

    printLine("ALL FRAGMENTS VERIFIED.", "terminal-green");
    printLine("PROJECT ABANDONED UNLOCKED.", "terminal-green");
    printLine("YOU HAVE FOUND THE FINAL ARCHIVE.");

    archive.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showSecret("PROJECT ABANDONED // ACCESS GRANTED");
}

// ==========================================
// COMMAND HANDLER
// ==========================================

function runCommand(rawCommand) {

    const command = rawCommand.trim().toLowerCase();

    if (!command) return;

    printLine("GUEST@FACILITY:~$ " + rawCommand);

    // SECRET CODES

    if (unlockSecretCode(command)) {

        printLine("ACCESS GRANTED.", "terminal-green");
        printLine("SECRET FILE RECOVERED.");

        if (allSecretFilesFound()) {
            printLine("ALL FIVE FRAGMENTS RECOVERED.");
            printLine("FINAL CODE DISCOVERED: PROJECT");
        }

        return;
    }

    // FINAL PROJECT CODE

    if (command === "project") {
        unlockProjectAbandoned();
        return;
    }

    // NORMAL COMMANDS

    switch (command) {

        case "help":
            printLine("AVAILABLE COMMANDS:");
            printLine("help     - Show commands");
            printLine("status   - Facility status");
            printLine("files    - List classified files");
            printLine("cameras  - Surveillance overview");
            printLine("play     - Open Roblox game");
            printLine("clear    - Clear terminal");
            printLine("wake up  - Unknown command");
            printLine("WARD13   - Restricted access");
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
            printLine("Use the Classified Files section to open them.");
            break;

        case "cameras":
            printLine("SURVEILLANCE NETWORK:");
            printLine("CAM 01 - MAIN HALL");
            printLine("CAM 02 - PATIENT WING");
            printLine("CAM 03 - LOWER FLOOR");
            printLine("CAM 04 - RESTRICTED ROOM");
            break;

        case "play":
            printLine("OPENING GAME ACCESS...");
            printPlayLink();
            break;

        case "clear":
            terminalOutput.replaceChildren();
            printLine("TERMINAL CLEARED.");
            break;

        case "wake up":
            printLine("...");
            printLine("YOU ARE NOT SUPPOSED TO BE HERE.", "terminal-red");
            printLine("SOMETHING HAS NOTICED YOU.", "terminal-red");
            showSecret("DON'T TURN AROUND.");
            break;

        case "ward13":

            if (localStorage.getItem("ward13Unlocked") !== "true") {

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

        default:
            printLine("UNKNOWN COMMAND.", "terminal-red");
            printLine("TYPE HELP TO SEE AVAILABLE COMMANDS.");
    }
}

// ==========================================
// TERMINAL INPUT
// ==========================================

terminalForm.addEventListener("submit", event => {

    event.preventDefault();

    const command = terminalInput.value;

    runCommand(command);

    terminalInput.value = "";
    terminalInput.focus();
});

// ==========================================
// SECRET LOGO CLICK
// ==========================================

const logo = document.getElementById("logo");

let logoClicks = 0;
let logoTimer;

logo.addEventListener("click", event => {

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

// ==========================================
// SECRET KEYBOARD SEQUENCE
// ==========================================

const secretSequence = [
    "a", "b", "a", "n", "d", "o", "n"
];

let sequencePosition = 0;

document.addEventListener("keydown", event => {

    if (event.target.matches("input")) return;

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
console.log("PROJECT ABANDONED IS WAITING.");
