// script.js

const contentEl      = document.getElementById("content");
const breadcrumbEl   = document.getElementById("breadcrumb-text");
const treeEl         = document.getElementById("tree");
const searchInput    = document.getElementById("search");
const searchResultsEl = document.getElementById("search-results");

const noteCache = new Map(); // path -> markdown text
let activeNoteId = null;

// --- Navigation history ([ ] shortcuts) -----------------------
const navStack = [];
let navPos    = -1;
let navSkip   = false;   // true while navigating so loadNote won't push again

function pushNav(noteId) {
  if (navSkip) return;
  if (navStack[navPos] === noteId) return; // same note, don't duplicate
  navStack.splice(navPos + 1);             // clear forward history
  navStack.push(noteId);
  navPos = navStack.length - 1;
}

function navigateBack() {
  if (navPos <= 0) return;
  navPos--;
  navSkip = true;
  const note = NOTES.find(n => n.id === navStack[navPos]);
  if (note) loadNote(note);
  navSkip = false;
}

function navigateForward() {
  if (navPos >= navStack.length - 1) return;
  navPos++;
  navSkip = true;
  const note = NOTES.find(n => n.id === navStack[navPos]);
  if (note) loadNote(note);
  navSkip = false;
}

// --- Recently viewed (localStorage) --------------------------
const RECENT_KEY = "cyberkelp_recent";
const MAX_RECENT = 6;

function getRecentIds() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}

function addToRecent(noteId) {
  let ids = getRecentIds();
  ids = [noteId, ...ids.filter(id => id !== noteId)].slice(0, MAX_RECENT);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids)); } catch {}
  renderRecentSection();
}

function renderRecentSection() {
  const existing = document.getElementById("recent-section");
  if (existing) existing.remove();

  const ids = getRecentIds();
  if (ids.length === 0) return;

  const section = document.createElement("div");
  section.id = "recent-section";

  const label = document.createElement("div");
  label.className = "sidebar-section-label";
  label.innerHTML = `<span class="section-icon">◷</span>Recent`;
  section.appendChild(label);

  for (const id of ids) {
    const note = NOTES.find(n => n.id === id);
    if (!note) continue;
    const link = document.createElement("div");
    link.className = "note-link recent-link";
    link.dataset.noteId = note.id;
    link.textContent = note.title;
    link.addEventListener("click", () => {
      loadNote(note);
      searchResultsEl.innerHTML = "";
      searchInput.value = "";
    });
    section.appendChild(link);
  }

  const divider = document.createElement("div");
  divider.className = "sidebar-divider";
  section.appendChild(divider);

  const scrollArea = document.querySelector(".sidebar-scroll");
  const tree = document.getElementById("tree");
  scrollArea.insertBefore(section, tree);
}

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
  pushNav(note.id);      // navigation history
  addToRecent(note.id);  // recently viewed

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

  // Syntax highlighting
  if (typeof hljs !== "undefined") {
    prose.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Copy-to-clipboard buttons on every code block
  addCopyButtons(prose);

  if (headingSlug) requestAnimationFrame(() => scrollToHeading(headingSlug));

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

// --- Copy-to-clipboard buttons --------------------------------

function addCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return; // guard against double-adding
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.innerHTML =
      `<svg viewBox="0 0 14 14" fill="none" width="11" height="11" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
        <path d="M2.5 9.5V2.5a1 1 0 0 1 1-1h6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg><span>Copy</span>`;

    btn.addEventListener("click", () => {
      const code = pre.querySelector("code");
      const text = (code ? code.innerText : pre.innerText).trimEnd();

      const finish = (ok) => {
        const span = btn.querySelector("span");
        span.textContent = ok ? "Copied!" : "Error";
        btn.classList.toggle("copied", ok);
        btn.classList.toggle("copy-error", !ok);
        setTimeout(() => {
          span.textContent = "Copy";
          btn.classList.remove("copied", "copy-error");
        }, 2000);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => finish(true)).catch(() => finish(false));
      } else {
        // Fallback for HTTP / older browsers
        try {
          const ta = Object.assign(document.createElement("textarea"), {
            value: text, style: "position:fixed;opacity:0"
          });
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          finish(true);
        } catch { finish(false); }
      }
    });

    pre.appendChild(btn);
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

// --- Graph View -----------------------------------------------

let graphSimulation = null; // keep ref so we can stop it on close

function graphNodeRadius(connectionCount) {
  return 5 + Math.min(connectionCount * 2, 12);
}

async function buildGraphData() {
  await ensureAllNotesLoaded();

  // De-duplicate NOTES by id (manifest may have duplicates)
  const seen = new Set();
  const uniqueNotes = NOTES.filter(n => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });

  const nodes = uniqueNotes.map(n => ({ id: n.id, title: n.title, note: n }));
  const linkSet = new Set();
  const links   = [];

  const wikiRegex = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

  for (const note of uniqueNotes) {
    const md = noteCache.get(note.path) || "";
    let match;
    wikiRegex.lastIndex = 0;
    while ((match = wikiRegex.exec(md)) !== null) {
      const target = resolveWikiNote(match[1].trim());
      if (!target || target.id === note.id) continue;
      const key = [note.id, target.id].sort().join("|||");
      if (linkSet.has(key)) continue;
      linkSet.add(key);
      links.push({ source: note.id, target: target.id });
    }
  }

  // Count connections per node
  const connCount = {};
  nodes.forEach(n => { connCount[n.id] = 0; });
  links.forEach(l => {
    connCount[l.source] = (connCount[l.source] || 0) + 1;
    connCount[l.target] = (connCount[l.target] || 0) + 1;
  });

  return { nodes, links, connCount };
}

function renderGraph({ nodes, links, connCount }) {
  const svgEl  = document.getElementById("graph-svg");
  const tooltip = document.getElementById("graph-tooltip");
  const svg    = d3.select(svgEl);
  svg.selectAll("*").remove();

  const W = svgEl.clientWidth  || 800;
  const H = svgEl.clientHeight || 600;

  // Zoom container
  const g = svg.append("g");

  const zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on("zoom", e => g.attr("transform", e.transform));
  svg.call(zoom);

  // Simulation
  if (graphSimulation) graphSimulation.stop();
  graphSimulation = d3.forceSimulation(nodes)
    .force("link",      d3.forceLink(links).id(d => d.id).distance(90).strength(0.4))
    .force("charge",    d3.forceManyBody().strength(-220))
    .force("center",    d3.forceCenter(W / 2, H / 2))
    .force("collision", d3.forceCollide().radius(d => graphNodeRadius(connCount[d.id]) + 10));

  // ── Defs: glow filter ──
  const defs = svg.append("defs");

  const glowFilter = defs.append("filter").attr("id", "node-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
  glowFilter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
  const feMerge = glowFilter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "blur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const activeGlow = defs.append("filter").attr("id", "active-glow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
  activeGlow.append("feGaussianBlur").attr("stdDeviation", "7").attr("result", "blur");
  const feMerge2 = activeGlow.append("feMerge");
  feMerge2.append("feMergeNode").attr("in", "blur");
  feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

  // ── Links ──
  const linkGroup = g.append("g").attr("class", "links");
  const linkSel = linkGroup.selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "rgba(0,201,177,0.18)")
    .attr("stroke-width", 1);

  // ── Nodes ──
  const nodeGroup = g.append("g").attr("class", "nodes");
  const nodeSel = nodeGroup.selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "graph-node")
    .style("cursor", "pointer")
    .call(
      d3.drag()
        .on("start", (e, d) => {
          if (!e.active) graphSimulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end",   (e, d) => {
          if (!e.active) graphSimulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
    );

  // Outer glow ring (only visible on hover / active)
  nodeSel.append("circle")
    .attr("class", "node-ring")
    .attr("r", d => graphNodeRadius(connCount[d.id]) + 5)
    .attr("fill", "none")
    .attr("stroke", d => d.id === activeNoteId ? "rgba(0,201,177,0.35)" : "transparent")
    .attr("stroke-width", 1.5);

  // Main circle
  nodeSel.append("circle")
    .attr("class", "node-circle")
    .attr("r", d => graphNodeRadius(connCount[d.id]))
    .attr("fill", d => d.id === activeNoteId ? "#00c9b1"
                     : connCount[d.id] > 0   ? "#1e3a55"
                                             : "#112135")
    .attr("stroke", d => d.id === activeNoteId ? "#00c9b1" : "rgba(0,201,177,0.3)")
    .attr("stroke-width", d => d.id === activeNoteId ? 2 : 1)
    .attr("filter", d => d.id === activeNoteId ? "url(#active-glow)" : "url(#node-glow)");

  // Label
  nodeSel.append("text")
    .attr("class", "graph-label")
    .attr("dy", d => graphNodeRadius(connCount[d.id]) + 13)
    .attr("text-anchor", "middle")
    .attr("fill", d => d.id === activeNoteId ? "#00c9b1" : "#4a7a8a")
    .attr("font-size", "9.5px")
    .attr("font-family", "IBM Plex Mono, monospace")
    .text(d => d.title);

  // ── Interaction ──
  nodeSel
    .on("mouseenter", function(e, d) {
      // Highlight this node
      d3.select(this).select(".node-circle")
        .attr("fill",   "#00c9b1")
        .attr("stroke", "#00c9b1")
        .attr("filter", "url(#active-glow)");
      d3.select(this).select(".node-ring")
        .attr("stroke", "rgba(0,201,177,0.3)");
      d3.select(this).select("text").attr("fill", "#00c9b1");

      // Highlight connected links
      const connIds = new Set();
      linkSel
        .attr("stroke", l => {
          const connected = l.source.id === d.id || l.target.id === d.id;
          if (connected) {
            connIds.add(l.source.id === d.id ? l.target.id : l.source.id);
          }
          return connected ? "rgba(0,201,177,0.6)" : "rgba(0,201,177,0.05)";
        })
        .attr("stroke-width", l =>
          l.source.id === d.id || l.target.id === d.id ? 1.5 : 1
        );

      // Dim unconnected nodes
      nodeSel.style("opacity", n =>
        n.id === d.id || connIds.has(n.id) ? 1 : 0.25
      );

      // Tooltip
      tooltip.textContent = d.title;
      tooltip.classList.add("visible");
    })
    .on("mousemove", e => {
      const rect = svgEl.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 14) + "px";
      tooltip.style.top  = (e.clientY - rect.top  - 10) + "px";
    })
    .on("mouseleave", function(e, d) {
      // Restore node appearance
      d3.select(this).select(".node-circle")
        .attr("fill",   d.id === activeNoteId ? "#00c9b1" : connCount[d.id] > 0 ? "#1e3a55" : "#112135")
        .attr("stroke", d.id === activeNoteId ? "#00c9b1" : "rgba(0,201,177,0.3)")
        .attr("filter", d.id === activeNoteId ? "url(#active-glow)" : "url(#node-glow)");
      d3.select(this).select(".node-ring")
        .attr("stroke", d.id === activeNoteId ? "rgba(0,201,177,0.35)" : "transparent");
      d3.select(this).select("text")
        .attr("fill", d.id === activeNoteId ? "#00c9b1" : "#4a7a8a");

      linkSel
        .attr("stroke", "rgba(0,201,177,0.18)")
        .attr("stroke-width", 1);
      nodeSel.style("opacity", 1);
      tooltip.classList.remove("visible");
    })
    .on("click", (e, d) => {
      e.stopPropagation();
      closeGraphView();
      loadNote(d.note);
    });

  // ── Tick ──
  graphSimulation.on("tick", () => {
    linkSel
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
  });
}

async function openGraphView() {
  const overlay = document.getElementById("graph-overlay");
  overlay.classList.add("visible");

  // Show spinner while fetching
  const svgEl = document.getElementById("graph-svg");
  const existing = document.getElementById("graph-loading");
  if (existing) existing.remove();

  const loading = document.createElement("div");
  loading.id = "graph-loading";
  loading.innerHTML = `<div class="graph-spinner"></div><span>Charting the depths…</span>`;
  overlay.appendChild(loading);

  const data = await buildGraphData();
  loading.remove();
  renderGraph(data);

  // Escape key closes
  document.addEventListener("keydown", onGraphEscape);
}

function closeGraphView() {
  const overlay = document.getElementById("graph-overlay");
  overlay.classList.remove("visible");
  if (graphSimulation) { graphSimulation.stop(); graphSimulation = null; }
  document.getElementById("graph-svg").innerHTML = "";
  document.removeEventListener("keydown", onGraphEscape);
}

function onGraphEscape(e) {
  if (e.key === "Escape") closeGraphView();
}

function initGraphView() {
  document.getElementById("graph-toggle").addEventListener("click", openGraphView);
  document.getElementById("graph-close").addEventListener("click", closeGraphView);
}

// --- Keyboard shortcuts ---------------------------------------

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    const graphOpen = document.getElementById("graph-overlay").classList.contains("visible");
    const tag = (document.activeElement || {}).tagName?.toLowerCase() ?? "";
    const inInput = tag === "input" || tag === "textarea" || tag === "select";

    // Ctrl+K  or  /  → focus search
    if (!graphOpen && (
      (e.key === "/" && !inInput) ||
      (e.key === "k" && (e.ctrlKey || e.metaKey))
    )) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }

    // Escape → clear/close search (graph escape is handled separately in onGraphEscape)
    if (e.key === "Escape" && !graphOpen) {
      if (document.activeElement === searchInput || searchInput.value) {
        e.preventDefault();
        searchInput.blur();
        searchInput.value = "";
        searchResultsEl.innerHTML = "";
      }
      return;
    }

    // [  → navigate back in note history
    if (e.key === "[" && !inInput && !graphOpen) {
      e.preventDefault();
      navigateBack();
      return;
    }

    // ]  → navigate forward in note history
    if (e.key === "]" && !inInput && !graphOpen) {
      e.preventDefault();
      navigateForward();
      return;
    }
  });
}

// --- Init -----------------------------------------------------

function init() {
  renderTree();
  renderRecentSection();        // populate recent panel from localStorage on load
  searchInput.addEventListener("input", handleSearchInput);
  initMobileMenu();
  initHashRouting();
  initGraphView();
  initKeyboardShortcuts();      // / · Ctrl+K · Escape · [ · ]

  // Honour the URL hash on first load; fall back to first note
  const startNote = noteFromHash() || NOTES[0];
  if (startNote) loadNote(startNote);

  dismissSplash();
}

init();
