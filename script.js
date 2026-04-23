// script.js

const contentEl = document.getElementById("content");
const breadcrumbEl = document.getElementById("breadcrumb");
const treeEl = document.getElementById("tree");
const searchInput = document.getElementById("search");
const searchResultsEl = document.getElementById("search-results");

const noteCache = new Map(); // path -> markdown text

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
      n.title.toLowerCase() === wikiName.toLowerCase()
  );
}

function renderBreadcrumb(note) {
  breadcrumbEl.textContent = note ? `${note.folder || ""} / ${note.title}` : "";
}

// Convert Obsidian-style [[Note#Heading|Label]] links to HTML anchors
function replaceWikiLinks(markdown) {
  const wikiRegex = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;

  return markdown.replace(wikiRegex, (match, noteName, heading, label) => {
    const note = resolveWikiNote(noteName.trim());
    if (!note) return label || noteName;

    const dataAttrs = [
      `data-note-id="${note.id}"`,
      heading ? `data-heading="${slugify(heading)}"` : ""
    ]
      .filter(Boolean)
      .join(" ");

    const text = label || heading || note.title;
    return `<a href="#" class="wikilink" ${dataAttrs}>${text}</a>`;
  });
}

// After markdown is rendered, add IDs to headings for anchor scrolling
function addHeadingIds(container) {
  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((h) => {
    if (!h.id) {
      h.id = slugify(h.textContent);
    }
  });
}

// Scroll to heading if provided
function scrollToHeading(slug) {
  if (!slug) return;
  const el = document.getElementById(slug);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// --- Loading and rendering notes ------------------------------

async function loadNote(note, headingSlug = null) {
  renderBreadcrumb(note);
  contentEl.textContent = "Loading...";

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
  const html = marked.parse(withWiki);
  contentEl.innerHTML = html;
  addHeadingIds(contentEl);
  wireWikiLinks();
  if (headingSlug) scrollToHeading(headingSlug);
}

// Attach click handlers to wiki links inside rendered content
function wireWikiLinks() {
  const links = contentEl.querySelectorAll(".wikilink");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const noteId = link.getAttribute("data-note-id");
      const heading = link.getAttribute("data-heading");
      const note = NOTES.find((n) => n.id === noteId);
      if (note) {
        loadNote(note, heading || null);
      }
    });
  });
}

// --- Sidebar tree ---------------------------------------------

function renderFolderNode(node, parentEl) {
  const entries = Object.entries(node).filter(([k]) => k !== "__files");
  const files = node.__files || [];

  // Folders
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

    nameEl.addEventListener("click", () => {
      const isHidden = childrenEl.style.display === "none";
      childrenEl.style.display = isHidden ? "block" : "none";
    });

    renderFolderNode(folderNode.__children, childrenEl);
    parentEl.appendChild(folderDiv);
  }

  // Files
  for (const note of files) {
    const link = document.createElement("div");
    link.className = "note-link";
    link.textContent = note.title;
    link.addEventListener("click", () => loadNote(note));
    parentEl.appendChild(link);
  }
}

function renderTree() {
  treeEl.innerHTML = "";
  renderFolderNode(FOLDER_TREE, treeEl);
}

// --- Search ---------------------------------------------------

async function ensureAllNotesLoaded() {
  const promises = NOTES.map(async (note) => {
    if (!noteCache.has(note.path)) {
      const res = await fetch(note.path);
      if (!res.ok) return;
      const md = await res.text();
      noteCache.set(note.path, md);
    }
  });
  await Promise.all(promises);
}

async function handleSearchInput() {
  const q = searchInput.value.trim().toLowerCase();
  searchResultsEl.innerHTML = "";
  if (!q) return;

  await ensureAllNotesLoaded();

  const results = [];
  for (const note of NOTES) {
    const text = noteCache.get(note.path) || "";
    if (
      note.title.toLowerCase().includes(q) ||
      text.toLowerCase().includes(q)
    ) {
      results.push(note);
    }
  }

  results.slice(0, 30).forEach((note) => {
    const div = document.createElement("div");
    div.className = "search-result";
    div.textContent = note.title;
    div.addEventListener("click", () => {
      loadNote(note);
      searchResultsEl.innerHTML = "";
    });
    searchResultsEl.appendChild(div);
  });
}

// --- Init -----------------------------------------------------

function init() {
  renderTree();
  searchInput.addEventListener("input", () => {
    // Debounce-ish: small timeout if you want; for now, direct
    handleSearchInput();
  });

  // Optionally load a default note
  const defaultNote = NOTES.find((n) => n.id === "Termonology") || NOTES[0];
  if (defaultNote) loadNote(defaultNote);
}

init();
