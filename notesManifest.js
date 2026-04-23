// notesManifest.js

const NOTES = [
  // Root
  {
    id: "chinese-resources",
    title: "Chinese Resources",
    wikiName: "Chinese Resources",
    path: "chinese-resources.md",
    folder: ""
  },
  {
    id: "notes-format",
    title: "Notes Format",
    wikiName: "Notes Format",
    path: "notes-format.md",
    folder: ""
  },

  // Enumeration
  {
    id: "nfs-share-enum",
    title: "NFS & Share Enumeration",
    wikiName: "NFS & Share Enumeration",
    path: "enumeration/nfs-share-enumeration.md",
    folder: "enumeration"
  },

  // Linux
  {
    id: "linux-cheatsheet",
    title: "Linux Learning Cheat Sheet",
    wikiName: "Linux Learning Cheat Sheet",
    path: "linux/linux-learning-cheatsheet.md",
    folder: "linux"
  },
  {
    id: "linux-30-days",
    title: "Learn Linux in 30 Days",
    wikiName: "Learn Linux in 30 Days",
    path: "linux/learn-linux-in-30-days.md",
    folder: "linux"
  },

  // Privilege Escalation
  {
    id: "priv-esc",
    title: "Privilege Escalation",
    wikiName: "Privilege Escalation",
    path: "privilege-escalation/privilege-escalation.md",
    folder: "privilege-escalation"
  },

  // Protocols
  {
    id: "ssh",
    title: "SSH",
    wikiName: "SSH",
    path: "protocols/ssh.md",
    folder: "protocols"
  },

  // Reverse Engineering
  {
    id: "rev-resources",
    title: "Reverse Engineering Resources",
    wikiName: "Reverse Engineering Resources",
    path: "reverse-engineering/resources.md",
    folder: "reverse-engineering"
  },
  {
    id: "rev-roadmap",
    title: "Reverse Engineering Roadmap",
    wikiName: "Reverse Engineering Roadmap",
    path: "reverse-engineering/roadmap.md",
    folder: "reverse-engineering"
  },
  {
    id: "rev-core",
    title: "Reverse Engineering",
    wikiName: "Reverse Engineering",
    path: "reverse-engineering/reverse-engineering.md",
    folder: "reverse-engineering"
  },

  // Tools (inside reverse engineering)
  {
    id: "gdb",
    title: "GDB Cheatsheet",
    wikiName: "GDB Cheatsheet",
    path: "reverse-engineering/tools/gdb.md",
    folder: "reverse-engineering/tools"
  },
  {
    id: "radare2",
    title: "Radare2 Cheatsheet",
    wikiName: "Radare2 Cheatsheet",
    path: "reverse-engineering/tools/radare2.md",
    folder: "reverse-engineering/tools"
  },

  // Reverse Shells
  {
    id: "reverse-shell-linux",
    title: "Generic Linux Reverse Shell",
    wikiName: "Generic Linux Reverse Shell",
    path: "reverse-shells/generic-linux.md",
    folder: "reverse-shells"
  },

  // Terminology
  {
    id: "terminology",
    title: "Terminology",
    wikiName: "Terminology",
    path: "terminology/terminology.md",
    folder: "terminology"
  },
{
  id: "code-commands",
  title: "Code Commands",
  wikiName: "Code Commands",
  path: "Termonology/Commands/Code Commands.md",
  folder: "Termonology/Commands"
},
{
  id: "code-languages",
  title: "Code Languages",
  wikiName: "Code Languages",
  path: "Termonology/Code Languages/Code Languages.md",
  folder: "Termonology/Code Languages"
},
{
  id: "tools-term",
  title: "Tools",
  wikiName: "Tools",
  path: "Termonology/Tools/Tools.md",
  folder: "Termonology/Tools"
}

  // Volatility
  {
    id: "volatility",
    title: "Volatility Cheatsheet",
    wikiName: "Volatility Cheatsheet",
    path: "volatility/volatility-cheatsheet.md",
    folder: "volatility"
  }
];

// Folder tree builder (unchanged but now cleaner input)
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
