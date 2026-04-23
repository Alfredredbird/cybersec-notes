// script.js

const contentEl     = document.getElementById("content");
const breadcrumbEl  = document.getElementById("breadcrumb");
const treeEl        = document.getElementById("tree");
const searchInput   = document.getElementById("search");
const searchResultsEl = document.getElementById("search-results");

const noteCache = new Map(); // path -> markdown text
let activeNoteId  = null;

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
  container.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
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

  const withWiki = replaceWikiLinks(md);
  const html     = marked.parse(withWiki);
  contentEl.innerHTML = html;
  addHeadingIds(contentEl);
  wireWikiLinks();
  if (headingSlug) scrollToHeading(headingSlug);
}

function wireWikiLinks() {
  contentEl.querySelectorAll(".wikilink").forEach((link) => {
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

// --- Init -----------------------------------------------------

function init() {
  renderTree();
  searchInput.addEventListener("input", handleSearchInput);

  const defaultNote = NOTES[0];
  if (defaultNote) loadNote(defaultNote);
}

init();
