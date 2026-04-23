// notesManifest.js

// Flat list of notes with paths relative to this HTML file
const NOTES = [
  // Root files
  {
    id: "chinneese-resources",
    title: "chinneese resources",
    wikiName: "chinneese resources",
    path: "chinneese resources.md",
    folder: ""
  },
  {
    id: "notes-format",
    title: "Notes Format",
    wikiName: "Notes Format",
    path: "Notes Format.md",
    folder: ""
  },

  // Enumaration
  {
    id: "nfs-enum",
    title: "NFS Enumeration and Share Enumeration",
    wikiName: "Enumaration",
    path: "Enumaration/NFS Enumeration and Share Enumeration.md",
    folder: "Enumaration"
  },

  // GDB
  {
    id: "gdb-cheatsheet",
    title: "GNU Debugger Cheatsheet",
    wikiName: "GNU Debugger Cheatsheet",
    path: "GDB/GNU Debugger Cheatsheet.md",
    folder: "GDB"
  },
  {
    id: "gdb-re",
    title: "Reverse Engineering with GDB",
    wikiName: "Reverse Engineering with GDB",
    path: "GDB/Reverse Engineering with GDB.md",
    folder: "GDB"
  },

  // gobuster
  {
    id: "gobuster-cheatsheet",
    title: "Gobuster cheat sheet",
    wikiName: "gobuster",
    path: "gobuster/Gobuster cheat sheet.md",
    folder: "gobuster"
  },

  // Linux
  {
    id: "linux-30-days",
    title: "learn linux in 30 days",
    wikiName: "learn linux in 30 days",
    path: "Linux/learn linux in 30 days.md",
    folder: "Linux"
  },
  {
    id: "linux-cheatsheet",
    title: "Linux Learning Cheat Sheet",
    wikiName: "Linux Learning Cheat Sheet",
    path: "Linux/Linux Learning Cheat Sheet.md",
    folder: "Linux"
  },

  // Privilege Escalation
  {
    id: "priv-esc",
    title: "Privilege Escalation",
    wikiName: "Privilege Escalation",
    path: "Privilege Escalation/Privilege Escalation.md",
    folder: "Privilege Escalation"
  },

  // Protocols
  {
    id: "ssh",
    title: "SSH",
    wikiName: "SSH",
    path: "Protocols/SSH.md",
    folder: "Protocols"
  },

  // Rev Eng
  {
    id: "radare2",
    title: "Radare2 CLI cheat-sheet",
    wikiName: "Radare2 CLI cheat-sheet",
    path: "Rev Eng/Radare2 CLI cheat-sheet.md",
    folder: "Rev Eng"
  },
  {
    id: "rev-resources",
    title: "Resources",
    wikiName: "Rev Eng Resources",
    path: "Rev Eng/Resources.md",
    folder: "Rev Eng"
  },
  {
    id: "rev-roadmap",
    title: "Reverse Engineering Learning Roadmap",
    wikiName: "Reverse Engineering Learning Roadmap",
    path: "Rev Eng/Reverse Engineering Learning Roadmap.md",
    folder: "Rev Eng"
  },

  // Reverse Shells
  {
    id: "reverse-shell-generic-linux",
    title: "Generic Linux",
    wikiName: "Generic Linux",
    path: "Reverse Shells/Generic Linux.md",
    folder: "Reverse Shells"
  },

  // Termonology
  {
    id: "termonology",
    title: "Termonology",
    wikiName: "Termonology",
    path: "Termonology/Termonology.md",
    folder: "Termonology"
  },
  {
    id: "code-languages",
    title: "Code Languages",
    wikiName: "Code Languages",
    path: "Termonology/Code Languages/Code Languages.md",
    folder: "Termonology/Code Languages"
  },

  // Volatility
  {
    id: "volatility-cheatsheet",
    title: "Volatility Cheatsheet",
    wikiName: "Volatility Cheatsheet",
    path: "Volatility/Volatility Cheatsheet.md",
    folder: "Volatility"
  }

  // Add OSINT and any new notes here as you create them
];

// Helper: group notes by folder for sidebar tree
function buildFolderTree(notes) {
  const root = {};
  for (const note of notes) {
    const parts = note.folder ? note.folder.split("/") : [];
    let node = root;
    for (const part of parts) {
      if (!node[part]) node[part] = { __children: {} };
      node = node[part].__children;
    }
    if (!node.__files) node.__files = [];
    node.__files.push(note);
  }
  return root;
}

const FOLDER_TREE = buildFolderTree(NOTES);
