const NOTES = [
  // Root
   {
    id: "readme",
    title: "Read Me",
    wikiName: "Read Me",
    path: "README.md",
    folder: ""
  },
  {
    id: "chinese-resources",
    title: "Chinese Resources",
    wikiName: "Chinese Resources",
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

  // Enumeration
  {
    id: "enumeration",
    title: "Enumeration",
    wikiName: "Enumeration",
    path: "Enumaration/Enumeration.md",
    folder: "Enumaration"
  },
  {
    id: "social-media-osint",
    title: "Social Media OSINT",
    wikiName: "Social Media OSINT",
    path: "OSINT/Types/Social Media OSINT.md",
    folder: "OSINT/Types"
  },
   {
    id: "other-osint",
    title: "Other OSINT",
    wikiName: "Other OSINT",
    path: "OSINT/Types/Other OSINT.md",
    folder: "OSINT/Types"
  },
   {
    id: "geolocation-osint",
    title: "Geolocation OSINT",
    wikiName: "Geolocation OSINT",
    path: "OSINT/Types/Geolocation OSINT.md",
    folder: "OSINT/Types"
  },
   {
    id: "domain-osint",
    title: "Domain OSINT",
    wikiName: "Domain OSINT",
    path: "OSINT/Types/Domain OSINT.md",
    folder: "OSINT/Types"
  },
  {
    id: "theharvester",
    title: "TheHarvester",
    wikiName: "TheHarvester",
    path: "OSINT/Tools/TheHarvester.md",
    folder: "OSINT/Tools"
  },
    {
    id: "people-osint",
    title: "People OSINT",
    wikiName: "People OSINT",
    path: "OSINT/Types/People OSINT.md",
    folder: "OSINT/Types"
  },
    {
    id: "osint",
    title: "OSINT",
    wikiName: "OSINT",
    path: "OSINT/OSINT.md",
    folder: "OSINT"
  },
  
  

  // Linux
  {
    id: "linux-cheatsheet",
    title: "Linux Learning Cheat Sheet",
    wikiName: "Linux Learning Cheat Sheet",
    path: "Resources to be refactored/Linux/Linux Learning Cheat Sheet.md",
    folder: "Resources to be refactored/Linux"
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
     {
    id: "ftp",
    title: "FTP",
    wikiName: "FTP",
    path: "Protocols/FTP.md",
    folder: "Protocols"
  },
  // Reverse Engineering
  {
    id: "rev-resources",
    title: "Reverse Engineering Resources",
    wikiName: "Reverse Engineering Resources",
    path: "Reverse Engenering/Resources.md",
    folder: "Reverse Engenering"
  },
  {
    id: "rev-core",
    title: "Reverse Engineering",
    wikiName: "Reverse Engineering",
    path: "Reverse Engenering/Reverse Engineering.md",
    folder: "Reverse Engenering"
  },

  // Tools
  {
    id: "gdb",
    title: "GDB Cheatsheet",
    wikiName: "GDB Cheatsheet",
    path: "Reverse Engenering/tools/GDB.md",
    folder: "Reverse Engenering/tools"
  },
  {
    id: "radare2",
    title: "Radare2 Cheatsheet",
    wikiName: "Radare2 Cheatsheet",
    path: "Reverse Engenering/tools/Radare2.md",
    folder: "Reverse Engenering/tools"
  },

  // Reverse Shells
  {
    id: "reverse-shell-linux",
    title: "Generic Linux Reverse Shell",
    wikiName: "Generic Linux Reverse Shell",
    path: "Reverse Shells/Generic Linux.md",
    folder: "Reverse Shells"
  },
  {
    id: "shells",
    title: "Shells",
    wikiName: "Shells",
    path: "Privilege Escalation/Shells.md",
    folder: "Privilege Escalation"
  },

  // Terminology
  {
    id: "terminology",
    title: "Terminology",
    wikiName: "Terminology",
    path: "Termonology/Termonology.md",
    folder: "Termonology"
  },
  {
  id: "stenography",
  title: "Stenography",
  wikiName: "Stenography",
  path: "Stenography/Stenography.md",
  folder: "Stenography"
},
  {
  id: "stenography",
  title: "Stenography",
  wikiName: "Stenography",
  path: "Stenography/Stenography.md",
  folder: "Stenography"
},
  {
    id: "code-commands",
    title: "Code Commands",
    wikiName: "Code Commands",
    path: "Termonology/Commands/Code Commands.md",
    folder: "Termonology/Commands"
  },
    {
    id: "linux-commands",
    title: "Linux Commands",
    wikiName: "Code Commands",
    path: "Termonology/Commands/Linux Commands.md",
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
  },

  // Volatility
  {
    id: "volatility",
    title: "Volatility",
    wikiName: "Volatility",
    path: "Volatility/Volatility.md",
    folder: "Volatility"
  }
];

// Folder tree builder (unchanged)
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
