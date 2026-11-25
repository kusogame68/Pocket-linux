import {V86} from "v86";
import v86WasmUrl from "v86/build/v86.wasm?url";
import {Terminal} from "@xterm/xterm";
import {FitAddon} from "@xterm/addon-fit";

const BASE = import.meta.env.BASE_URL;

const term = new Terminal({
    cursorBlink: true,
    fontSize: (window.innerWidth < 576)? 12: 15,
    fontFamily: 'Consolas, "Courier New", monospace',
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.querySelector(".console"));
fitAddon.fit();
window.addEventListener("resize", () => fitAddon.fit());

term.writeln("Loading Linux...");

const emulator = new V86({
    wasm_path: v86WasmUrl,
    memory_size: 128 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    bios: {url: `${BASE}bios/seabios.bin`},
    vga_bios: {url: `${BASE}bios/vgabios.bin`},
    cdrom: {url: `${BASE}images/alpine.iso`},
    disable_keyboard: true,
    disable_mouse: true,
    autostart: true,
});

const encoder = new TextEncoder();

emulator.add_listener("download-progress", e => {
    if (!e.lengthComputable) return;

    const percent = Math.floor((e.loaded / e.total) * 100);
    term.write(`\r[${e.file_index + 1}/${e.file_count}] ${e.file_name} ${percent}%`);
});

emulator.add_listener("emulator-started", () => 
    term.writeln("\r\nBooting up, takes about 30 ~ 60 seconds...\r\n"));

emulator.add_listener("serial0-output-byte", byte => term.write(new Uint8Array([byte])));

term.onData(data => emulator.serial_send_bytes(0, encoder.encode(data)));

term.focus();
