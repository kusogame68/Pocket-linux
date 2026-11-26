# Pocket-linux

A lightweight Linux CLI that runs entirely in the browser, built with v86 (x86 emulator in WebAssembly) and xterm.js, for practicing commands without starting a VM.

**Live Demo:** https://kusogame68.github.io/Pocket-linux/

---

## Motivation

Running a VM on my computer is sometimes so slow that it barely even starts. For practicing Linux commands, I only need a shell, not a full VM, so I built this page to open a Linux terminal right in the browser. For heavier work, I still use a VM.

---

## Features

* **No Install, No VM:** Open the page and a real Alpine Linux boots inside the browser.
* **Pure Frontend:** Everything runs on the client.
* **Reset on Refresh:** Reloading the page resets the whole system.

---

## Tech Stack

* **v86**
* **xterm.js**
* **Alpine Linux 3.24**
* **SeaBIOS**
* **Vite**
* **Sass**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kusogame68/Pocket-linux.git
cd Pocket-linux
```

### 2. Prerequisites

* **Node.js 24.18.0**

If you use nvm:

```bash
# macOS / Linux
nvm install
nvm use

# Windows (PowerShell)
nvm install (Get-Content .nvmrc)
nvm use (Get-Content .nvmrc)
```

### 3. Install Dependencies

```bash
npm ci
```

### 4. Run

```bash
npm run dev
```

Booting takes about 30 ~ 60 seconds. When `localhost login:` appears, log in as `root` (no password).

---

## Project Structure

```
Pocket-linux/
├── assets/
│   ├── icon/
│   │   └── favicon.svg
│   │
│   ├── js/
│   │   └── console.js
│   │
│   └── scss/
│       ├── _base.scss
│       ├── _index.scss
│       ├── _reset.scss
│       ├── _utils.scss
│       ├── _variables.scss
│       └── all.scss
│
├── pages/
│   └── index.html
│
├── public/
│   ├── bios/
│   │   ├── seabios.bin
│   │   └── vgabios.bin
│   │
│   ├── images/
│   │   └── alpine.iso
│   │
│   └── pocket-linux.png
│
├── .gitignore
├── .npmrc
├── .nvmrc
├── main.js
├── vite.config.js
├── package.json
└── package-lock.json
```

---

## How It Works

```
Browser
  |
  |  keyboard input
  v
xterm.js  ---- UTF-8 bytes ---->  v86 serial port (ttyS0)
   ^                                     |
   |                                     v
   +-------- output bytes --------  Alpine Linux
                                    (booted from alpine.iso,
                                     SeaBIOS + 128 MB RAM)
```

v86 emulates a 32-bit x86 PC in WebAssembly and boots Alpine from the ISO.
Alpine's virt ISO enables the serial console by default, so its shell runs on `ttyS0`.
`console.js` forwards every byte from the serial port to xterm.js, and every key typed in xterm.js back to the serial port.

---

## Limitations

* **32-bit only:** v86 doesn't support 64-bit kernels, so only distributions with an i386 / x86 build can run.
* **No network:** The guest has no internet access, so `apk add` can't install new packages.
* **Not persistent:** All files are lost on page reload.
* **Slower than native:** It's an emulator. Fine for practicing commands, not for heavy work.

---

## References

* [v86](https://github.com/copy/v86) - x86 emulator, also the source of the SeaBIOS binaries.
* [xterm.js](https://xtermjs.org/) - Terminal frontend.
* [Alpine Linux Downloads](https://alpinelinux.org/downloads/) - Source of the x86 virt ISO.
