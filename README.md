# 🚀 Course Hero Auto Accept Extension

## 📌 Overview
This Chrome Extension automatically detects Course Hero questions, accepts them, and plays a 1-minute audio alert with a toast notification.

---

## ⚙️ Features
- ✅ Auto Accept Course Hero questions
- 🔊 Plays 1-minute looping audio alert
- 📢 Toast notification (bottom-right popup)
- ⏱ Configurable refresh interval
- 🎛 Enable/Disable controls via popup
- 💾 Saves settings in Chrome storage

---

## 📁 Project Structure
audio/
└── question.mp3

background.js
content.js
manifest.json
popup.html
popup.js
README.md


---

## 🛠 Installation

1. Clone or download this repository
2. Open Chrome and go to:

chrome://extensions/

3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select this project folder
6. Open Course Hero dashboard page

---

## 🔊 How Audio Works

- Plays when a new question is detected
- Automatically stops after 60 seconds
- Requires first user click due to Chrome autoplay policy

---

## 🧠 Tech Stack

- JavaScript (Vanilla)
- Chrome Extension Manifest V3
- MutationObserver API
- Chrome Storage API
- DOM Manipulation

---

## 📸 Screenshots

_Add screenshots here (optional but recommended)_

---

## ⚠️ Disclaimer

This project is for educational and automation testing purposes only.

---

## 👨‍💻 Author

Developed by **ATHILINGAM S**
