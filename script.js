// script.js

const contentEl      = document.getElementById("content");
const breadcrumbEl   = document.getElementById("breadcrumb-text");
const treeEl         = document.getElementById("tree");
const searchInput    = document.getElementById("search");
const searchResultsEl = document.getElementById("search-results");

const noteCache = new Map(); // path -> markdown text
let activeNoteId = null;

// --- Helpers --------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function resolveWikiNote(wikiName) {
  return NOTES.find(
    (n) =>
      n.wikiName.toLowerCase() === wikiName.toLowerCase() ||
      n.title.toLowerCase()    === wikiName.toLowerCase()
  );
}

function renderBreadcrumb(note) {
  if (!note) {
    breadcrumbEl.innerHTML = "~/cyber-notes";
    return;
  }
  const parts = ["~/cyber-notes"];
  if (note.folder) parts.push(...note.folder.split("/"));
  parts.push(note.title);

  breadcrumbEl.innerHTML = parts
    .map((p, i) => i === parts.length - 1
      ? `<span>${p}</span>`
      : `${p} <span style="color:var(--border-mid)">›</span> `)
    .join("");
}

// Convert Obsidian-style ![[image.ext]] embeds to <img> tags
function replaceImageEmbeds(markdown) {
  return markdown.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
    // Strip any path prefix Obsidian may have stored, keep only the filename
    const name = filename.split("/").pop().split("\\").pop();
    return `<img src="Images/${name}" alt="${name}" style="max-width:100%;border-radius:6px;" />`;
  });
}

// Convert Obsidian-style [[Note#Heading|Label]] links to HTML anchors
function replaceWikiLinks(markdown) {
  const wikiRegex = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
  return markdown.replace(wikiRegex, (match, noteName, heading, label) => {
    const note = resolveWikiNote(noteName.trim());
    if (!note) return `<span style="color:var(--text-muted)">${label || noteName}</span>`;

    const dataAttrs = [
      `data-note-id="${note.id}"`,
      heading ? `data-heading="${slugify(heading)}"` : ""
    ].filter(Boolean).join(" ");

    const text = label || heading || note.title;
    return `<a href="#" class="wikilink" ${dataAttrs}>${text}</a>`;
  });
}

function addHeadingIds(container) {
  (container || contentEl).querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent);
  });
}

function scrollToHeading(slug) {
  if (!slug) return;
  const el = document.getElementById(slug);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveLink(noteId) {
  document.querySelectorAll(".note-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.noteId === noteId);
  });
}

// --- Loading and rendering notes ------------------------------

async function loadNote(note, headingSlug = null) {
  activeNoteId = note.id;
  renderBreadcrumb(note);
  setActiveLink(note.id);

  contentEl.textContent = "Loading…";

  let md;
  if (noteCache.has(note.path)) {
    md = noteCache.get(note.path);
  } else {
    const res = await fetch(note.path);
    if (!res.ok) {
      contentEl.textContent = `Failed to load: ${note.path}`;
      return;
    }
    md = await res.text();
    noteCache.set(note.path, md);
  }

  // Process image embeds FIRST, then wiki links — order matters
  const withImages = replaceImageEmbeds(md);
  const withWiki   = replaceWikiLinks(withImages);
  const html       = marked.parse(withWiki);

  // Wrap in .prose so the column centres without breaking pre overflow
  const prose = document.createElement("div");
  prose.className = "prose";
  prose.innerHTML = html;
  contentEl.innerHTML = "";
  contentEl.appendChild(prose);

  addHeadingIds(prose);
  wireWikiLinks(prose);
  if (headingSlug) scrollToHeading(headingSlug);

  // Sync URL hash without pushing a new history entry
  history.replaceState(null, "", "#" + note.id);
}

function wireWikiLinks(container) {
  container = container || contentEl;
  container.querySelectorAll(".wikilink").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const noteId  = link.getAttribute("data-note-id");
      const heading = link.getAttribute("data-heading");
      const note    = NOTES.find((n) => n.id === noteId);
      if (note) loadNote(note, heading || null);
    });
  });
}

// --- Sidebar tree ---------------------------------------------

function renderFolderNode(node, parentEl) {
  const entries = Object.entries(node).filter(([k]) => k !== "__files");
  const files   = node.__files || [];

  for (const [folderName, folderNode] of entries) {
    const folderDiv = document.createElement("div");
    folderDiv.className = "folder";

    const nameEl = document.createElement("div");
    nameEl.className = "folder-name";
    nameEl.textContent = folderName;
    folderDiv.appendChild(nameEl);

    const childrenEl = document.createElement("div");
    childrenEl.className = "folder-children";
    folderDiv.appendChild(childrenEl);

    // Start collapsed
    childrenEl.style.display = "none";

    nameEl.addEventListener("click", () => {
      const isHidden = childrenEl.style.display === "none";
      childrenEl.style.display = isHidden ? "block" : "none";
      nameEl.classList.toggle("open", isHidden);
    });

    renderFolderNode(folderNode.__children, childrenEl);
    parentEl.appendChild(folderDiv);
  }

  for (const note of files) {
    const link = document.createElement("div");
    link.className = "note-link";
    link.textContent = note.title;
    link.dataset.noteId = note.id;
    link.addEventListener("click", () => {
      loadNote(note);
      // Auto-clear search results when a note is clicked from tree
      searchResultsEl.innerHTML = "";
      searchInput.value = "";
    });
    parentEl.appendChild(link);
  }
}

function renderTree() {
  treeEl.innerHTML = "";
  renderFolderNode(FOLDER_TREE, treeEl);
}

// --- Search ---------------------------------------------------

async function ensureAllNotesLoaded() {
  await Promise.all(NOTES.map(async (note) => {
    if (!noteCache.has(note.path)) {
      const res = await fetch(note.path);
      if (!res.ok) return;
      noteCache.set(note.path, await res.text());
    }
  }));
}

async function handleSearchInput() {
  const q = searchInput.value.trim().toLowerCase();
  searchResultsEl.innerHTML = "";
  if (!q) return;

  await ensureAllNotesLoaded();

  const results = NOTES.filter((note) => {
    const text = noteCache.get(note.path) || "";
    return note.title.toLowerCase().includes(q) || text.toLowerCase().includes(q);
  });

  results.slice(0, 30).forEach((note) => {
    const div = document.createElement("div");
    div.className = "search-result";
    div.textContent = note.title;
    div.addEventListener("click", () => {
      loadNote(note);
      searchResultsEl.innerHTML = "";
      searchInput.value = "";
    });
    searchResultsEl.appendChild(div);
  });

  if (results.length === 0) {
    const empty = document.createElement("div");
    empty.className = "search-result";
    empty.style.color = "var(--text-muted)";
    empty.style.cursor = "default";
    empty.textContent = "No results found.";
    searchResultsEl.appendChild(empty);
  }
}

// --- Mobile sidebar toggle ------------------------------------

function initMobileMenu() {
  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!menuBtn || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    menuBtn.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    menuBtn.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  treeEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("note-link") && window.innerWidth <= 768) {
      closeSidebar();
    }
  });
}

// --- Hash routing ---------------------------------------------

function noteFromHash() {
  const hash = window.location.hash.slice(1); // strip leading #
  if (!hash) return null;
  // Try exact id match first, then slug/title match
  return (
    NOTES.find((n) => n.id === hash) ||
    NOTES.find((n) => n.wikiName.toLowerCase() === hash.toLowerCase()) ||
    NOTES.find((n) => n.title.toLowerCase().replace(/\s+/g, "-") === hash.toLowerCase())
  );
}

function initHashRouting() {
  // On back/forward navigation update the loaded note
  window.addEventListener("hashchange", () => {
    const note = noteFromHash();
    if (note) loadNote(note);
  });
}

// --- Splash screen --------------------------------------------

function dismissSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add("hidden");
    splash.addEventListener("transitionend", () => splash.remove(), { once: true });
  }, 2200);
}

// --- Init -----------------------------------------------------

function init() {
  renderTree();
  searchInput.addEventListener("input", handleSearchInput);
  initMobileMenu();
  initHashRouting();

  // Honour the URL hash on first load; fall back to first note
  const startNote = noteFromHash() || NOTES[0];
  if (startNote) loadNote(startNote);

  dismissSplash();
}

init();
