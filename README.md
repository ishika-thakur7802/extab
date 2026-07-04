# eXtab – Smart Chrome Tab Manager

> A Chrome extension that helps reduce tab clutter by identifying duplicate tabs and surfacing long-idle tabs for cleanup.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)

---

## Why eXtab?

Like many developers, I often end up with **50–100 browser tabs** open while learning, researching, or working.

Finding duplicate tabs or remembering which tabs haven't been used for hours quickly becomes difficult.

**eXtab** aims to make browser tab management smarter by helping users identify unnecessary tabs and eventually assisting them in deciding what to keep, close, or revisit.

---

## ✨ Current Features

### 📖 Read All Open Tabs

Displays every currently open browser tab.

- Reads tab title
- Reads tab URL
- Retrieves all open tabs using the Chrome Tabs API

---

### 🔍 Detect Duplicate Tabs

Identifies duplicate tabs based on their URLs.

Example:

```text
YouTube
YouTube
YouTube

↓

Duplicate found (3)
```

---

### 🗑️ Remove Duplicate Tabs

Automatically closes duplicate tabs while preserving one instance.

This helps reduce browser clutter without manually searching for duplicates.

---

### ⏳ Show Idle Tabs (4h+)

Tracks browser activity and lists tabs that haven't been accessed for more than **4 hours**.

Displays:

- Tab title
- Idle duration
- Number of idle tabs detected

Example:

```text
Number of Idle Tabs: 9

YouTube — Idle for 20 hours
Pinterest — Idle for 20 hours
LeetCode — Idle for 22 hours
```

---

## 🛠 Tech Stack

- JavaScript (ES6)
- Chrome Extensions Manifest V3
- Chrome Tabs API
- Chrome Storage API
- HTML
- CSS

---

## 📁 Project Structure

```text
eXtab/
│
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── services/
├── utils/
└── assets/
```

---

## 🏗 Architecture

```text
                User
                  │
                  ▼
            Chrome Popup
                  │
                  ▼
            Chrome Tabs API
                  │
        ┌─────────┼──────────┐
        ▼         ▼          ▼
 Read Open Tabs  Detect   Detect Idle
                 Duplicates   Tabs
                    │
                    ▼
          Remove Duplicate Tabs
```

---

## 📸 Screenshots

### Home

> _Add screenshot of the popup with the three buttons._

### Idle Tabs Detection

> _Add screenshot showing idle tabs detected._

---

## 🚀 Roadmap

### ✅ Completed

- Read all browser tabs
- Detect duplicate tabs
- Remove duplicate tabs
- Detect idle tabs (4h+)

### 🚧 In Progress

- Card-based idle tab review
- Close individual idle tabs
- "Remind Me Later" option
- Progress indicator (e.g. **3 / 20**)

### 🔮 Planned

- Idle tab notifications
- Scheduled background scans
- Snooze reminders
- Tab grouping
- Productivity analytics
- Automatic tab archiving
- AI-generated tab summaries
- Browser usage insights

---

## 📚 What I Learned

Building eXtab helped me understand:

- Chrome Extension development
- Manifest V3 architecture
- Chrome Tabs API
- Chrome Storage API
- Event-driven programming
- DOM manipulation
- JavaScript state management

---

## ⚙️ Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/extab.git
```

2. Open Chrome and navigate to:

```text
chrome://extensions
```

3. Enable **Developer Mode**

4. Click **Load unpacked**

5. Select the project folder

---

## 🎯 Future Vision

The goal of **eXtab** is to become an intelligent browser assistant that helps users manage browser clutter through activity tracking, smart reminders, AI-powered suggestions, and automated tab organization.

Rather than simply closing tabs, eXtab aims to help users make informed decisions about what to keep, archive, revisit, or remove.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

If you'd like to improve eXtab, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
