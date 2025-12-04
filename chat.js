// chat.js
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, realtime } from "./firebase.js"; // your firebase.js

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// --- Get username/gender from UID ---
async function getUserData(uid) {
    const dbRef = ref(realtime, "users/");
    return new Promise((resolve) => {
        onValue(dbRef, (snapshot) => {
            let found = null;
            snapshot.forEach((child) => {
                const val = child.val();
                if (val.uid === uid) {
                    found = { 
                        username: child.key, // key is username
                        gender: val.gender || "other"
                    };
                }
            });
            resolve(found);
        }, { onlyOnce: true });
    });
}

// --- Format HH:mm:day ---
function formatTime() {
    const d = new Date();
    let hh = String(d.getHours()).padStart(2, "0");
    let mm = String(d.getMinutes()).padStart(2, "0");
    let day = String(d.getDate()).padStart(2, "0");
    return `${hh}:${mm}:${day}`;
}

// --- Send message ---
async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    const user = await getUserData(auth.currentUser.uid);
    const username = user?.username || "Unknown";
    const gender = user?.gender || "other";

    const msgRef = ref(realtime, "messages");
    push(msgRef, {
        text,
        username,
        gender,
        timestamp: formatTime(),
        uid: auth.currentUser.uid
    });

    msgInput.value = "";
}

// --- Render message ---
function renderMessage(msgData) {
    const div = document.createElement("div");
    div.classList.add("message");

    // Avatar circle
    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.style.border = "2px solid #ccc"; // circle border
    avatar.style.borderRadius = "50%";
    avatar.style.width = "40px";
    avatar.style.height = "40px";
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.marginRight = "10px";
    if (msgData.gender === "male") avatar.style.backgroundImage = 'url("https://i.imgur.com/2S2VpBR.png")';
    else if (msgData.gender === "female") avatar.style.backgroundImage = 'url("https://i.imgur.com/t4AhPyw.png")';
    // other left blank

    // Text block
    const textBlock = document.createElement("div");
    textBlock.classList.add("text-block");
    textBlock.innerHTML = `
        <span class="username">${msgData.username}</span>
        <span class="msg-text">${msgData.text}</span>
        <span class="timestamp">${msgData.timestamp}</span>
    `;

    div.appendChild(avatar);
    div.appendChild(textBlock);

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- Listen to messages ---
const messagesRef = ref(realtime, "messages");
onValue(messagesRef, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((child) => {
        renderMessage(child.val());
    });
});

// --- Send button click ---
sendBtn.addEventListener("click", sendMessage);

// --- Enter key sends ---
msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// --- Clear room command ---
msgInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        const text = msgInput.value.trim();
        const user = await getUserData(auth.currentUser.uid);
        const username = user?.username || "";

        if (text.toLowerCase() === "lgnd/clear") {
            if (username === "lgnd" || username.toLowerCase() === "co-owner") {
                remove(messagesRef);
                const infoDiv = document.createElement("div");
                infoDiv.classList.add("system-message");
                infoDiv.textContent = "Owner has cleared this room";
                messagesDiv.appendChild(infoDiv);
                msgInput.value = "";
            } else {
                const warningDiv = document.createElement("div");
                warningDiv.classList.add("system-message");
                warningDiv.textContent = "You are not allowed to clear the room!";
                messagesDiv.appendChild(warningDiv);
                msgInput.value = "";
            }
        }
    }
});
