/* ============================================
   THE ABANDONED — COMPLETE SCRIPT
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    console.log("THE ABANDONED: JavaScript loaded.");

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const log = (message) => {
        const output = $("#terminalOutput");
        if (!output) return;

        const line = document.createElement("div");
        line.textContent = message;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    };

    const showSection = (element) => {
        if (!element) return;
        element.classList.add("visible");
        element.style.display = "block";
    };

    /* ============================================
       SECTION ANIMATIONS
       ============================================ */

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.08 });

        $$(".section").forEach(section => observer.observe(section));
    } else {
        $$(".section").forEach(section => section.classList.add("visible"));
    }

    /* ============================================
       MODALS
       ============================================ */

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add("active");
    }

    function closeModals() {
        $$(".modal.active").forEach(modal => {
            modal.classList.remove("active");
        });
    }

    $$("[data-modal]").forEach(button => {
        button.addEventListener("click", () => {
            openModal(button.dataset.modal);
        });
    });

    $$(".close-modal").forEach(button => {
        button.addEventListener("click", closeModals);
    });

    $$(".modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    /* ============================================
       CAMERA SYSTEM
       ============================================ */

    const cameras = {
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
            description: "Someone is standing in the corner.",
            status: "UNKNOWN ACTIVITY"
        }
    };

    function selectCamera(id) {
        const camera = cameras[id];
        const screen = $("#cameraScreen");

        if (!camera || !screen) {
            log("[CAMERA] Camera screen not found.");
            return;
        }

        const label = screen.querySelector(".camera-label");
        const description = screen.querySelector("span");
        const time = screen.querySelector(".camera-time");

        if (label) label.textContent = camera.name;
        if (description) description.textContent = camera.description;
        if (time) time.textContent = camera.status;

        $$(".camera-controls [data-camera]").forEach(button => {
            button.classList.toggle("active", button.dataset.camera === id);
        });

        log(`[CAMERA] Connected to ${id}.`);

        if (id === "CAM05") {
            setTimeout(() => {
                if (description && $("#cameraScreen")) {
                    description.textContent = "IT KNOWS YOU ARE WATCHING.";
                }
            }, 5000);
        }
    }

    $(".camera-controls")?.addEventListener("click", event => {
        const button = event.target.closest("[data-camera]");
        if (button) selectCamera(button.dataset.camera);
    });

    $$(".mini-camera[data-camera]").forEach(button => {
        button.addEventListener("click", () => {
            selectCamera(button.dataset.camera);
            $("#cameraScreen")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    });

    /* ============================================
       NIGHT VISION
       ============================================ */

    $("#nightVisionToggle")?.addEventListener("click", event => {
        document.body.classList.toggle("night-vision");

        const active = document.body.classList.contains("night-vision");

        event.currentTarget.textContent = active
            ? "DISABLE NIGHT VISION"
            : "ENABLE NIGHT VISION";

        log(active
            ? "[SYSTEM] Night vision activated."
            : "[SYSTEM] Night vision disabled."
        );
    });

    /* ============================================
       CAMERA CONTROL ROOM
       ============================================ */

    $("#controlRoomToggle")?.addEventListener("click", event => {
        const room = $("#controlRoom");
        if (!room) return;

        room.classList.toggle("active");

        event.currentTarget.textContent = room.classList.contains("active")
            ? "CLOSE CONTROL ROOM"
            : "OPEN CONTROL ROOM";
    });

    /* ============================================
       LIVE FEED
       ============================================ */

    const liveEvents = [
        "CAM 02: Movement detected in north hallway.",
        "SYSTEM: Door opened in restricted area.",
        "CAM 04: Signal interruption detected.",
        "SECURITY: Unknown person detected.",
        "CAM 03: Patient count does not match records.",
        "SYSTEM: Access attempt detected at ROOM 13.",
        "CAM 05: No movement detected.",
        "WARNING: A camera has moved without authorization.",
        "SYSTEM: Please remain inside the building.",
        "CAM 01: Someone is standing outside the entrance."
    ];

    function addLiveEvent() {
        const feed = $("#liveFeedContent");
        if (!feed) return;

        const message = liveEvents[
            Math.floor(Math.random() * liveEvents.length)
        ];

        const line = document.createElement("p");
        line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

        feed.prepend(line);

        while (feed.children.length > 7) {
            feed.lastElementChild.remove();
        }
    }

    addLiveEvent();
    setInterval(addLiveEvent, 12000);

    /* ============================================
       PATIENT DATABASE
       ============================================ */

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
            details: "This patient does not appear in official admission records. Do not attempt contact."
        },
        {
            id: "006",
            name: "SARAH HOLLOW",
            age: "19",
            status: "MISSING",
            details: "Last seen near the basement elevator. Her last recorded message was: It followed me upstairs."
        }
    ];

    function showPatientDetails(patient) {
        const panel = $("#patientDetails");
        if (!panel) return;

        panel.classList.add("active");
        panel.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = patient.name;

        const fields = [
            `PATIENT ID: ${patient.id}`,
            `AGE: ${patient.age}`,
            `STATUS: ${patient.status}`,
            patient.details
        ];

        panel.appendChild(heading);

        fields.forEach(text => {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            panel.appendChild(paragraph);
        });
    }

    function renderPatients(search = "") {
        const list = $("#patientList");
        if (!list) return;

        list.replaceChildren();

        const filtered = patients.filter(patient => {
            const text = `${patient.name} ${patient.id} ${patient.status}`;
            return text.toLowerCase().includes(search.toLowerCase());
        });

        if (!filtered.length) {
            list.textContent = "NO MATCHING RECORDS FOUND.";
            return;
        }

        filtered.forEach(patient => {
            const record = document.createElement("div");
            record.className = "patient-record";
            record.tabIndex = 0;

            const name = document.createElement("strong");
            name.textContent = patient.name;

            const info = document.createElement("span");
            info.textContent = `ID: ${patient.id} | ${patient.status}`;

            record.append(name, info);

            record.addEventListener("click", () => {
                showPatientDetails(patient);
            });

            record.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    showPatientDetails(patient);
                }
            });

            list.appendChild(record);
        });
    }

    $("#patientSearch")?.addEventListener("input", event => {
        renderPatients(event.target.value);
    });

    renderPatients();

    /* ============================================
       UNKNOWN CALLER
       ============================================ */

    const callerMessages = [
        "You should not have come back.",
        "They told me you were dead.",
        "Do not use the elevator. It is already upstairs."
    ];

    $("#answerCall")?.addEventListener("click", event => {
        const status = $("#callerStatus");

        const message = callerMessages[
            Math.floor(Math.random() * callerMessages.length)
        ];

        if (status) status.textContent = `"${message}"`;

        event.currentTarget.disabled = true;

        setTimeout(() => {
            if (status) status.textContent = "CALL DISCONNECTED.";
            event.currentTarget.disabled = false;
        }, 5000);
    });

    $("#rejectCall")?.addEventListener("click", () => {
        const status = $("#callerStatus");
        if (status) status.textContent = "CALL REJECTED. INCOMING CALL DETECTED AGAIN.";

        setTimeout(() => {
            if (status) status.textContent = "UNKNOWN CALLER IS CALLING...";
        }, 4000);
    });

  /* SECRET ELEVATOR — FIXED */

const elevatorCodes = {
    "1": "1010",
    "2": "2020",
    "3": "1313",
    "B": "0427"
};

let elevatorInput = "";

const elevatorDisplay = document.getElementById("elevatorDisplay");
const elevatorStatus = document.getElementById("elevatorStatus");

function updateElevatorDisplay() {
    if (elevatorDisplay) {
        elevatorDisplay.textContent =
            elevatorInput.split("").join(" ") || "_ _ _ _";
    }
}

document.querySelectorAll(".elevator-buttons button").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (!value) return;

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
                elevatorStatus.textContent =
                    "ACCESS GRANTED — FLOOR " + floor + " UNLOCKED.";
            } else {
                elevatorStatus.textContent =
                    "ACCESS DENIED — WRONG CODE.";
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

updateElevatorDisplay();

    /* ============================================
       EMERGENCY BROADCAST
       ============================================ */

    const broadcastMessages = [
        "ATTENTION. ALL STAFF MUST REPORT TO THE MAIN HALLWAY.",
        "DO NOT ENTER ROOM 13. THE ROOM IS NOT EMPTY.",
        "ALL PATIENTS MUST REMAIN IN THEIR ROOMS.",
        "IF YOU HEAR SOMEONE CALLING YOUR NAME, DO NOT RESPOND.",
        "THE BUILDING IS UNDER LOCKDOWN. DO NOT ATTEMPT TO LEAVE."
    ];

    function closeBroadcast() {
        $("#broadcastAlert")?.classList.remove("active");
    }

    function triggerBroadcast() {
        const message = broadcastMessages[
            Math.floor(Math.random() * broadcastMessages.length)
        ];

        const screen = $("#broadcastScreen");
        const alert = $("#broadcastAlert");

        if (screen) screen.textContent = message;

        if (alert) {
            const text = alert.querySelector("p");
            if (text) text.textContent = message;
            alert.classList.add("active");
        }

        log("[EMERGENCY] Broadcast transmission received.");
    }

    $("#broadcastButton")?.addEventListener("click", triggerBroadcast);
    $("#closeBroadcast")?.addEventListener("click", closeBroadcast);

    /* ============================================
       SYSTEM CORRUPTION
       ============================================ */

    function triggerCorruption() {
        document.body.classList.add("corrupted");

        log("[WARNING] SYSTEM CORRUPTION DETECTED.");

        setTimeout(() => {
            document.body.classList.remove("corrupted");
        }, 3500);
    }

    setInterval(() => {
        if (Math.random() < 0.35) {
            triggerCorruption();
        }
    }, 45000);

    /* ============================================
       EMERGENCY MODE
       ============================================ */

    function toggleEmergencyMode(button) {
        document.body.classList.toggle("emergency-mode");

        const active = document.body.classList.contains("emergency-mode");

        if (button) {
            button.textContent = active
                ? "DISABLE EMERGENCY MODE"
                : "ENABLE EMERGENCY MODE";
        }

        log(active
            ? "[SYSTEM] EMERGENCY MODE ENABLED."
            : "[SYSTEM] EMERGENCY MODE DISABLED."
        );
    }

    $("#emergencyToggle")?.addEventListener("click", event => {
        toggleEmergencyMode(event.currentTarget);
    });

    /* ============================================
       SECRET ARCHIVE CODES
       ============================================ */

    const secretCodes = {
        THEPATIENT: "filePatient",
        NIGHTSHIFT: "fileNightshift",
        "0427": "file0427",
        DONTLOOK: "fileDontlook",
        THEST4LKER: "fileStalker"
    };

    function unlockSecretFile(code) {
        const fileId = secretCodes[code];
        if (!fileId) return false;

        const file = document.getElementById(fileId);
        const archive = $("#secretArchives");

        if (file) file.classList.add("visible");
        showSection(archive);

        try {
            localStorage.setItem(`secret_${code}`, "true");
        } catch (error) {
            console.warn("Could not save archive progress.", error);
        }

        log(`[ARCHIVE] SECRET FILE UNLOCKED: ${code}`);

        checkProjectArchive();
        return true;
    }

    function restoreSecretFiles() {
        Object.keys(secretCodes).forEach(code => {
            try {
                if (localStorage.getItem(`secret_${code}`) === "true") {
                    const file = document.getElementById(secretCodes[code]);
                    if (file) file.classList.add("visible");
                }
            } catch (error) {
                console.warn("Could not restore secret files.", error);
            }
        });

        checkProjectArchive();
    }

    function allSecretFilesUnlocked() {
        try {
            return Object.keys(secretCodes).every(code => {
                return localStorage.getItem(`secret_${code}`) === "true";
            });
        } catch (error) {
            return false;
        }
    }

    /* ============================================
       WARD 13
       ============================================ */

    function unlockWard13() {
        const ward = $("#ward13");
        if (!ward) {
            log("[ERROR] WARD 13 SECTION NOT FOUND.");
            return;
        }

        showSection(ward);

        try {
            localStorage.setItem("ward13_unlocked", "true");
        } catch (error) {
            console.warn(error);
        }

        log("[ACCESS GRANTED] WARD 13 ARCHIVE UNLOCKED.");
    }

    try {
        if (localStorage.getItem("ward13_unlocked") === "true") {
            showSection($("#ward13"));
        }
    } catch (error) {
        console.warn(error);
    }

    /* ============================================
       PROJECT ABANDONED
       ============================================ */

    function checkProjectArchive() {
        if (!allSecretFilesUnlocked()) return;

        const archive = $("#projectArchive");

        if (archive) {
            showSection(archive);
        }
    }

    function unlockProjectArchive() {
        if (!allSecretFilesUnlocked()) {
            log("[ACCESS DENIED] ALL FIVE FRAGMENTS ARE REQUIRED.");
            return;
        }

        const archive = $("#projectArchive");

        if (!archive) {
            log("[ERROR] PROJECT ARCHIVE NOT FOUND.");
            return;
        }

        showSection(archive);

        try {
            localStorage.setItem("project_unlocked", "true");
        } catch (error) {
            console.warn(error);
        }

        archive.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        log("[ACCESS GRANTED] PROJECT ABANDONED DECLASSIFIED.");
    }

    try {
        if (localStorage.getItem("project_unlocked") === "true") {
            showSection($("#projectArchive"));
        }
    } catch (error) {
        console.warn(error);
    }

    restoreSecretFiles();

    /* ============================================
       TERMINAL COMMANDS
       ============================================ */

    const terminalCommands = {
        help: () => {
            [
                "AVAILABLE COMMANDS:",
                "HELP - SHOW COMMANDS",
                "STATUS - SYSTEM STATUS",
                "FILES - SECRET FILE INFORMATION",
                "CAMERAS - CAMERA INFORMATION",
                "DATABASE - PATIENT DATABASE",
                "ELEVATOR - ELEVATOR INFORMATION",
                "CALLER - UNKNOWN CALLER",
                "BROADCAST - EMERGENCY BROADCAST",
                "CORRUPT - TRIGGER CORRUPTION",
                "WARD13 - OPEN WARD 13",
                "PROJECT - OPEN PROJECT ARCHIVE",
                "EMERGENCY - TOGGLE EMERGENCY MODE",
                "CLEAR - CLEAR TERMINAL",
                "WAKE UP - ...",
                "SECRET CODES: THEPATIENT, NIGHTSHIFT, 0427, DONTLOOK, THEST4LKER"
            ].forEach(log);
        },

        status: () => {
            [
                "SYSTEM STATUS: UNSTABLE",
                "BUILDING STATUS: LOCKDOWN",
                "CAMERA STATUS: PARTIALLY ONLINE",
                "PATIENT STATUS: UNKNOWN",
                "STAFF STATUS: UNACCOUNTED FOR"
            ].forEach(log);
        },

        files: () => {
            log("FIVE SECRET FILES ARE HIDDEN IN THE SYSTEM.");
            log("FIND THEIR ACCESS CODES.");
            log("THE FRAGMENTS FORM A WORD.");
        },

        cameras: () => {
            Object.entries(cameras).forEach(([id, camera]) => {
                log(`${id} - ${camera.name}`);
            });
        },

        database: () => {
            $("#patientSearch")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            log("PATIENT DATABASE OPENED.");
        },

        elevator: () => {
            log("FLOOR 1: CODE REQUIRED.");
            log("FLOOR 2: CODE REQUIRED.");
            log("FLOOR 3: RESTRICTED.");
            log("BASEMENT: CLASSIFIED.");
        },

        caller: () => {
            $("#callerStatus")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            log("UNKNOWN CALLER DETECTED.");
        },

        broadcast: triggerBroadcast,
        corrupt: triggerCorruption,
        ward13: unlockWard13,
        project: unlockProjectArchive,

        emergency: () => {
            toggleEmergencyMode(null);
        },

        play: () => {
            log("AUDIO TRANSMISSION NOT AVAILABLE.");
        },

        clear: () => {
            const output = $("#terminalOutput");
            if (output) output.replaceChildren();
        },

        "wake up": () => {
            log("YOU ARE NOT SUPPOSED TO BE HERE.");
            setTimeout(() => log("LOOK BEHIND YOU."), 1500);
        }
    };

    function runTerminalCommand(raw) {
        const command = raw.trim().toUpperCase();
        if (!command) return;

        log(`> ${command}`);

        if (secretCodes[command]) {
            unlockSecretFile(command);
            return;
        }

        const action = terminalCommands[command.toLowerCase()];

        if (action) {
            action();
        } else {
            log("UNKNOWN COMMAND. TYPE HELP.");
        }
    }

    $("#terminalInput")?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            runTerminalCommand(event.currentTarget.value);
            event.currentTarget.value = "";
        }
    });

    /* ============================================
       SECRET MESSAGE
       ============================================ */

    let secretSequence = "";

    document.addEventListener("keydown", event => {
        if (event.key.length !== 1) return;

        secretSequence += event.key.toUpperCase();
        secretSequence = secretSequence.slice(-20);

        if (secretSequence.includes("ABANDONED")) {
            $("#secret-message")?.classList.add("active");
            secretSequence = "";
        }
    });

    /* ============================================
       KEYBOARD SHORTCUTS
       ============================================ */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModals();
            closeBroadcast();
            $("#secret-message")?.classList.remove("active");
        }
    });

    /* ============================================
       AUTOMATIC BROADCAST
       ============================================ */

    setInterval(() => {
        if (Math.random() < 0.2) {
            triggerBroadcast();
        }
    }, 90000);

    /* ============================================
       INITIALIZE TERMINAL
       ============================================ */

    log("THE ABANDONED SECURITY TERMINAL");
    log("CONNECTION ESTABLISHED.");
    log("WARNING: UNAUTHORIZED ACCESS IS LOGGED.");
    log("TYPE HELP TO VIEW AVAILABLE COMMANDS.");

});
