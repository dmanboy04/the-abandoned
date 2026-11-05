/* =========================================
   THE ABANDONED — MAIN JAVASCRIPT
   ========================================= */

/* ---------- HELPERS ---------- */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function addTerminalMessage(message) {
    const output = $("#terminalOutput");
    if (!output) return;

    const line = document.createElement("div");
    line.textContent = message;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function revealSection(section) {
    if (!section) return;
    section.classList.add("visible");
    section.style.display = "block";
}

function closeModal() {
    $$(".modal.active").forEach(modal => {
        modal.classList.remove("active");
    });
}

/* ---------- SECTION ANIMATIONS ---------- */

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.1
});

$$(".section").forEach(section => {
    sectionObserver.observe(section);
});

/* ---------- CLASSIFIED FILES ---------- */

$$("[data-modal]").forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) modal.classList.add("active");
    });
});

$$(".close-modal").forEach(button => {
    button.addEventListener("click", closeModal);
});

$$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });
});

/* ---------- CAMERA SYSTEM ---------- */

const cameraData = {
    CAM01: {
        name: "MAIN ENTRANCE",
        description: "The main entrance appears empty.",
        status: "SIGNAL STABLE"
    },
    CAM02: {
        name: "NORTH HALLWAY",
        description: "A light is flickering at the end of the hallway.",
        status: "LOW SIGNAL"
    },
    CAM03: {
        name: "PATIENT WARD",
        description: "Several beds are visible. One appears occupied.",
        status: "MOTION DETECTED"
    },
    CAM04: {
        name: "BASEMENT",
        description: "The basement camera is covered in static.",
        status: "SIGNAL UNSTABLE"
    },
    CAM05: {
        name: "ROOM 13",
        description: "Someone is standing in the corner. Do not look away.",
        status: "UNKNOWN ACTIVITY"
    }
};

function selectCamera(cameraId) {
    const camera = cameraData[cameraId];
    if (!camera) return;

    const screen = $("#cameraScreen");
    if (!screen) return;

    const label = screen.querySelector(".camera-label");
    const description = screen.querySelector("span");
    const time = screen.querySelector(".camera-time");

    if (label) label.textContent = camera.name;
    if (description) description.textContent = camera.description;
    if (time) time.textContent = camera.status;

    $$(".camera-controls button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.camera === cameraId
        );
    });

    addTerminalMessage(`[CAMERA] Switched to ${cameraId}`);

    if (cameraId === "CAM05") {
        setTimeout(() => {
            if (description) {
                description.textContent = "IT KNOWS YOU ARE WATCHING.";
            }
        }, 4500);
    }
}

const cameraControls = $(".camera-controls");

if (cameraControls) {
    cameraControls.addEventListener("click", event => {
        const button = event.target.closest("[data-camera]");
        if (!button) return;

        selectCamera(button.dataset.camera);
    });
}

/* ---------- NIGHT VISION ---------- */

const nightVisionToggle = $("#nightVisionToggle");

if (nightVisionToggle) {
    nightVisionToggle.addEventListener("click", () => {
        document.body.classList.toggle("night-vision");

        const active = document.body.classList.contains("night-vision");

        nightVisionToggle.textContent = active
            ? "DISABLE NIGHT VISION"
            : "ENABLE NIGHT VISION";

        addTerminalMessage(
            active
                ? "[SYSTEM] Night vision activated."
                : "[SYSTEM] Night vision disabled."
        );
    });
}

/* ---------- CAMERA CONTROL ROOM ---------- */

const controlRoomToggle = $("#controlRoomToggle");
const controlRoom = $("#controlRoom");

if (controlRoomToggle && controlRoom) {
    controlRoomToggle.addEventListener("click", () => {
        controlRoom.classList.toggle("active");

        const active = controlRoom.classList.contains("active");

        controlRoomToggle.textContent = active
            ? "CLOSE CONTROL ROOM"
            : "OPEN CONTROL ROOM";
    });
}

$$(".mini-camera").forEach(camera => {
    camera.addEventListener("click", () => {
        const cameraId = camera.dataset.camera;

        if (cameraId) {
            selectCamera(cameraId);

            $("#cameraScreen")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
});

/* ---------- LIVE FEED ---------- */

const liveEvents = [
    "CAM 02: Movement detected in north hallway.",
    "SYSTEM: Door opened in restricted area.",
    "CAM 04: Signal interruption detected.",
    "SECURITY: Unknown person detected.",
    "CAM 03: Patient count does not match records.",
    "SYSTEM: Access attempt detected at ROOM 13.",
    "CAM 05: No movement detected. Something is still there.",
    "WARNING: A camera has moved without authorization.",
    "SYSTEM: Please remain inside the building.",
    "CAM 01: Someone is standing outside the entrance."
];

const liveFeedContent = $("#liveFeedContent");

function addLiveEvent() {
    if (!liveFeedContent) return;

    const event = liveEvents[
        Math.floor(Math.random() * liveEvents.length)
    ];

    const time = new Date().toLocaleTimeString();

    const line = document.createElement("p");
    line.textContent = `[${time}] ${event}`;

    liveFeedContent.prepend(line);

    while (liveFeedContent.children.length > 7) {
        liveFeedContent.lastElementChild.remove();
    }
}

addLiveEvent();
setInterval(addLiveEvent, 12000);

/* ---------- PATIENT DATABASE ---------- */

const patients = [
    {
        id: "001",
        name: "ELLIOT GRAVES",
        age: "34",
        status: "MISSING",
        details: "Patient admitted on October 13. Disappeared from a locked room. No signs of forced entry."
    },
    {
        id: "002",
        name: "MARCUS REED",
        age: "51",
        status: "DECEASED",
        details: "Official cause of death: unknown. Medical records have been partially erased."
    },
    {
        id: "003",
        name: "ANNA VALE",
        age: "27",
        status: "TRANSFERRED",
        details: "Transferred to another facility. No receiving hospital is listed."
    },
    {
        id: "004",
        name: "JONAH BLACK",
        age: "42",
        status: "UNKNOWN",
        details: "Patient file repeatedly changes after midnight. Staff have been instructed not to access it."
    },
    {
        id: "005",
        name: "SUBJECT 13",
        age: "UNKNOWN",
        status: "CLASSIFIED",
        details: "This patient does not appear in the official admission records. Do not attempt contact."
    },
    {
        id: "006",
        name: "SARAH HOLLOW",
        age: "19",
        status: "MISSING",
        details: "Last seen near the basement elevator. Her last recorded message was: 'It followed me upstairs.'"
    }
];

const patientList = $("#patientList");
const patientSearch = $("#patientSearch");

function renderPatients(search = "") {
    if (!patientList) return;

    patientList.innerHTML = "";

    const filtered = patients.filter(patient => {
        const text = (
            patient.name + " " +
            patient.id + " " +
            patient.status
        ).toLowerCase();

        return text.includes(search.toLowerCase());
    });

    if (filtered.length === 0) {
        patientList.textContent = "NO MATCHING RECORDS FOUND.";
        return;
    }

    filtered.forEach(patient => {
        const record = document.createElement("div");
        record.className = "patient-record";

        const name = document.createElement("strong");
        name.textContent = patient.name;

        const info = document.createElement("span");
        info.textContent = `ID: ${patient.id} | ${patient.status}`;

        record.append(name, info);

        record.addEventListener("click", () => {
            showPatientDetails(patient);
        });

        patientList.appendChild(record);
    });
}

function showPatientDetails(patient) {
    const details = $("#patientDetails");
    if (!details) return;

    details.classList.add("active");
    details.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = patient.name;

    const id = document.createElement("p");
    id.textContent = `PATIENT ID: ${patient.id}`;

    const age = document.createElement("p");
    age.textContent = `AGE: ${patient.age}`;

    const status = document.createElement("p");
    status.textContent = `STATUS: ${patient.status}`;

    const description = document.createElement("p");
    description.textContent = patient.details;

    details.append(heading, id, age, status, description);
}

if (patientSearch) {
    patientSearch.addEventListener("input", () => {
        renderPatients(patientSearch.value);
    });
}

renderPatients();

/* ---------- UNKNOWN CALLER ---------- */

const callerMessages = [
    "You should not have come back.",
    "They told me you were dead.",
    "Do not use the elevator. It is already upstairs."
];

const callerAnswer = $("#answerCall");
const callerReject = $("#rejectCall");
const callerStatus = $("#callerStatus");

if (callerAnswer) {
    callerAnswer.addEventListener("click", () => {
        const message = callerMessages[
            Math.floor(Math.random() * callerMessages.length)
        ];

        if (callerStatus) {
            callerStatus.textContent = `"${message}"`;
        }

        callerAnswer.disabled = true;

        setTimeout(() => {
            if (callerStatus) {
                callerStatus.textContent = "CALL DISCONNECTED.";
            }

            callerAnswer.disabled = false;
        }, 5000);
    });
}

if (callerReject) {
    callerReject.addEventListener("click", () => {
        if (callerStatus) {
            callerStatus.textContent =
                "CALL REJECTED. INCOMING CALL DETECTED AGAIN.";
        }

        setTimeout(() => {
            if (callerStatus) {
                callerStatus.textContent =
                    "UNKNOWN CALLER IS CALLING...";
            }
        }, 4000);
    });
}

/* ---------- SECRET ELEVATOR ---------- */

const elevatorCodes = {
    "1": "1010",
    "2": "2020",
    "3": "1313",
    "B": "0427"
};

let elevatorInput = "";

const elevatorDisplay = $("#elevatorDisplay");
const elevatorStatus = $("#elevatorStatus");

function updateElevatorDisplay() {
    if (elevatorDisplay) {
        elevatorDisplay.textContent = elevatorInput || "_ _ _ _";
    }
}

$$(".elevator-buttons button").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (value === "CLEAR") {
            elevatorInput = "";
            updateElevatorDisplay();
            return;
        }

        if (value === "ENTER") {
            const floor = Object.keys(elevatorCodes).find(
                key => elevatorCodes[key] === elevatorInput
            );

            if (floor) {
                if (elevatorStatus) {
                    elevatorStatus.textContent =
                        `ACCESS GRANTED. ELEVATOR MOVING TO FLOOR ${floor}.`;
                }

                if (floor === "B") {
                    setTimeout(() => {
                        addTerminalMessage(
                            "[ELEVATOR] Basement access granted."
                        );
                    }, 1000);
                }
            } else {
                if (elevatorStatus) {
                    elevatorStatus.textContent =
                        "ACCESS DENIED. INCORRECT CODE.";
                }
            }

            elevatorInput = "";
            updateElevatorDisplay();
            return;
        }

        if (elevatorInput.length < 4) {
            elevatorInput += value;
            updateElevatorDisplay();
        }
    });
});

/* ---------- EMERGENCY BROADCAST ---------- */

const broadcastMessages = [
    "ATTENTION. ALL STAFF MUST REPORT TO THE MAIN HALLWAY.",
    "DO NOT ENTER ROOM 13. THE ROOM IS NOT EMPTY.",
    "ALL PATIENTS MUST REMAIN IN THEIR ROOMS.",
    "IF YOU HEAR SOMEONE CALLING YOUR NAME, DO NOT RESPOND.",
    "THE BUILDING IS UNDER LOCKDOWN. DO NOT ATTEMPT TO LEAVE."
];

const broadcastScreen = $("#broadcastScreen");
const broadcastButton = $("#broadcastButton");
const broadcastAlert = $("#broadcastAlert");

function triggerBroadcast() {
    const message = broadcastMessages[
        Math.floor(Math.random() * broadcastMessages.length)
    ];

    if (broadcastScreen) {
        broadcastScreen.textContent = message;
    }

    if (broadcastAlert) {
        const alertText = broadcastAlert.querySelector("p");

        if (alertText) alertText.textContent = message;

        broadcastAlert.classList.add("active");
    }

    addTerminalMessage("[EMERGENCY] Broadcast transmission received.");
}

function closeBroadcast() {
    broadcastAlert?.classList.remove("active");
}

if (broadcastButton) {
    broadcastButton.addEventListener("click", triggerBroadcast);
}

$("#closeBroadcast")?.addEventListener("click", closeBroadcast);

/* ---------- SYSTEM CORRUPTION ---------- */

function triggerCorruption() {
    document.body.classList.add("corrupted");

    addTerminalMessage("[WARNING] SYSTEM CORRUPTION DETECTED.");

    setTimeout(() => {
        document.body.classList.remove("corrupted");
    }, 3500);
}

setInterval(() => {
    if (Math.random() < 0.45) {
        triggerCorruption();
    }
}, 35000);

/* ---------- EMERGENCY MODE ---------- */

const emergencyToggle = $("#emergencyToggle");

if (emergencyToggle) {
    emergencyToggle.addEventListener("click", () => {
        document.body.classList.toggle("emergency-mode");

        const active = document.body.classList.contains("emergency-mode");

        emergencyToggle.textContent = active
            ? "DISABLE EMERGENCY MODE"
            : "ENABLE EMERGENCY MODE";

        addTerminalMessage(
            active
                ? "[SYSTEM] EMERGENCY MODE ENABLED."
                : "[SYSTEM] Emergency mode disabled."
        );
    });
}

/* ---------- SECRET ARCHIVE CODES ---------- */

const secretCodes = {
    THEPATIENT: "filePatient",
    NIGHTSHIFT: "fileNightshift",
    "0427": "file0427",
    DONTLOOK: "fileDontlook",
    THEST4LKER: "fileStalker"
};

function revealSecretFile(code) {
    const fileId = secretCodes[code];
    if (!fileId) return false;

    const file = document.getElementById(fileId);
    const archive = $("#secretArchives");

    if (file) {
        file.classList.add("visible");
    }

    if (archive) {
        revealSection(archive);
    }

    localStorage.setItem(`secret_${code}`, "true");

    addTerminalMessage(`[ARCHIVE] SECRET FILE UNLOCKED: ${code}`);

    return true;
}

function restoreSecretFiles() {
    Object.keys(secretCodes).forEach(code => {
        if (localStorage.getItem(`secret_${code}`) === "true") {
            const file = document.getElementById(secretCodes[code]);
            if (file) file.classList.add("visible");
        }
    });

    const allUnlocked = Object.keys(secretCodes).every(code => {
        return localStorage.getItem(`secret_${code}`) === "true";
    });

    if (allUnlocked) {
        const archive = $("#secretArchives");
        if (archive) revealSection(archive);
    }
}

restoreSecretFiles();

/* ---------- WARD 13 ---------- */

function unlockWard13() {
    const ward = $("#ward13");
    if (!ward) return;

    revealSection(ward);
    localStorage.setItem("ward13_unlocked", "true");

    addTerminalMessage("[ACCESS GRANTED] WARD 13 ARCHIVE UNLOCKED.");
}

if (localStorage.getItem("ward13_unlocked") === "true") {
    const ward = $("#ward13");
    if (ward) revealSection(ward);
}

/* ---------- PROJECT ABANDONED ---------- */

function unlockProjectArchive() {
    const allUnlocked = Object.keys(secretCodes).every(code => {
        return localStorage.getItem(`secret_${code}`) === "true";
    });

    if (!allUnlocked) {
        addTerminalMessage(
            "[ACCESS DENIED] ALL FIVE FRAGMENTS ARE REQUIRED."
        );
        return;
    }

    const archive = $("#projectArchive");

    if (archive) {
        revealSection(archive);
        archive.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    localStorage.setItem("project_unlocked", "true");

    addTerminalMessage(
        "[ACCESS GRANTED] PROJECT ABANDONED FILES DECLASSIFIED."
    );
}

if (localStorage.getItem("project_unlocked") === "true") {
    const archive = $("#projectArchive");
    if (archive) revealSection(archive);
}

/* ---------- TERMINAL ---------- */

const terminalInput = $("#terminalInput");

const terminalCommands = {
    help: () => {
        addTerminalMessage("AVAILABLE COMMANDS:");
        addTerminalMessage("HELP - SHOW COMMANDS");
        addTerminalMessage("STATUS - SYSTEM STATUS");
        addTerminalMessage("FILES - SHOW SECRET FILE CODES");
        addTerminalMessage("CAMERAS - CAMERA INFORMATION");
        addTerminalMessage("DATABASE - PATIENT DATABASE");
        addTerminalMessage("ELEVATOR - ELEVATOR INFORMATION");
        addTerminalMessage("CALLER - UNKNOWN CALLER");
        addTerminalMessage("BROADCAST - EMERGENCY BROADCAST");
        addTerminalMessage("CORRUPT - TRIGGER SYSTEM CORRUPTION");
        addTerminalMessage("WARD13 - OPEN WARD 13 ARCHIVE");
        addTerminalMessage("PROJECT - OPEN PROJECT ARCHIVE");
        addTerminalMessage("EMERGENCY - TOGGLE EMERGENCY MODE");
        addTerminalMessage("CLEAR - CLEAR TERMINAL");
        addTerminalMessage("WAKE UP - ...");
    },

    status: () => {
        addTerminalMessage("SYSTEM STATUS: UNSTABLE");
        addTerminalMessage("BUILDING STATUS: LOCKDOWN");
        addTerminalMessage("CAMERA STATUS: PARTIALLY ONLINE");
        addTerminalMessage("PATIENT STATUS: UNKNOWN");
        addTerminalMessage("STAFF STATUS: UNACCOUNTED FOR");
    },

    files: () => {
        addTerminalMessage("SECRET FILES REQUIRE ACCESS CODES.");
        addTerminalMessage("FIVE FRAGMENTS FORM A WORD.");
        addTerminalMessage("FIND THE WORD. DO NOT TRUST THE RECORDS.");
    },

    cameras: () => {
        addTerminalMessage("CAM 01 - MAIN ENTRANCE");
        addTerminalMessage("CAM 02 - NORTH HALLWAY");
        addTerminalMessage("CAM 03 - PATIENT WARD");
        addTerminalMessage("CAM 04 - BASEMENT");
        addTerminalMessage("CAM 05 - ROOM 13");
    },

    database: () => {
        $("#patientSearch")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        addTerminalMessage("PATIENT DATABASE OPENED.");
    },

    elevator: () => {
        addTerminalMessage("ELEVATOR ACCESS CODES REQUIRED.");
        addTerminalMessage("FLOOR 1: UNKNOWN");
        addTerminalMessage("FLOOR 2: UNKNOWN");
        addTerminalMessage("FLOOR 3: RESTRICTED");
        addTerminalMessage("BASEMENT: CLASSIFIED");
    },

    caller: () => {
        addTerminalMessage("INCOMING CALL: UNKNOWN NUMBER.");
        $("#callerStatus")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    },

    broadcast: () => {
        triggerBroadcast();
    },

    corrupt: () => {
        triggerCorruption();
    },

    ward13: () => {
        unlockWard13();
    },

    project: () => {
        unlockProjectArchive();
    },

    emergency: () => {
        document.body.classList.toggle("emergency-mode");
        addTerminalMessage("[SYSTEM] EMERGENCY MODE TOGGLED.");
    },

    play: () => {
        addTerminalMessage("AUDIO TRANSMISSION NOT AVAILABLE.");
    },

    clear: () => {
        const output = $("#terminalOutput");
        if (output) output.innerHTML = "";
    },

    "wake up": () => {
        addTerminalMessage("YOU ARE NOT SUPPOSED TO BE HERE.");
        setTimeout(() => {
            addTerminalMessage("LOOK BEHIND YOU.");
        }, 1500);
    }
};

function runTerminalCommand(rawCommand) {
    const command = rawCommand.trim().toUpperCase();

    if (!command) return;

    addTerminalMessage(`> ${command}`);

    if (secretCodes[command]) {
        revealSecretFile(command);
        return;
    }

    if (command === "PROJECT") {
        unlockProjectArchive();
        return;
    }

    const action = terminalCommands[command.toLowerCase()];

    if (action) {
        action();
    } else {
        addTerminalMessage("UNKNOWN COMMAND. TYPE HELP.");
    }
}

if (terminalInput) {
    terminalInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            runTerminalCommand(terminalInput.value);
            terminalInput.value = "";
        }
    });
}

/* ---------- KEYBOARD SHORTCUTS ---------- */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
        closeBroadcast();
        $("#secret-message")?.classList.remove("active");
    }
});

/* ---------- SECRET MESSAGE ---------- */

let secretKeySequence = "";

document.addEventListener("keydown", event => {
    if (event.key.length !== 1) return;

    secretKeySequence += event.key.toUpperCase();

    if (secretKeySequence.length > 20) {
        secretKeySequence = secretKeySequence.slice(-20);
    }

    if (secretKeySequence.includes("ABANDONED")) {
        const secretMessage = $("#secret-message");

        if (secretMessage) {
            secretMessage.classList.add("active");
        }

        secretKeySequence = "";
    }
});

/* ---------- AUTOMATIC BROADCAST ---------- */

setInterval(() => {
    if (Math.random() < 0.3) {
        triggerBroadcast();
    }
}, 90000);

/* ---------- INITIALIZATION ---------- */

addTerminalMessage("THE ABANDONED SECURITY TERMINAL");
addTerminalMessage("CONNECTION ESTABLISHED.");
addTerminalMessage("WARNING: UNAUTHORIZED ACCESS IS LOGGED.");
addTerminalMessage("TYPE HELP TO VIEW AVAILABLE COMMANDS.");

console.log("THE ABANDONED — SYSTEM ONLINE.");
