// Learning Log data is maintained in data/learning.json.
const LEARNING_TOPICS = window.LEARNING_TOPICS || [];
const statusMeta = {
  mastered: { emoji: "✓", label: "Comfortable", cls: "s-mastered" },
  "in-progress": { emoji: "↻", label: "In progress", cls: "s-inprogress" },
  struggling: { emoji: "!", label: "Needs practice", cls: "s-struggling" }
};
const grid = document.getElementById("ll-grid");
const searchEl = document.getElementById("ll-search");
const statusFilter = document.getElementById("ll-status-filter");
const subjectFilter = document.getElementById("ll-subject-filter");
const semesterTabs = document.getElementById("ll-semester-tabs");
const resultsCount = document.getElementById("ll-results-count");
let activeSemester = "Sem 1";
let activeSubject = "all";

function topicSemester(t) { return t.semester || "Sem 1"; }
function semesterTopics() { return LEARNING_TOPICS.filter(t => topicSemester(t) === activeSemester); }
function safeResourceUrl(raw) {
  try { const url = new URL(raw, location.href); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}
function resourceIcon(type) {
  return ({youtube:"▶", video:"▶", book:"▤", website:"↗", slides:"▧", pdf:"▧", notes:"✎", other:"↗"})[String(type||"other").toLowerCase()] || "↗";
}
function renderSubjects() {
  const topics = semesterTopics();
  const subjects = [...new Set(topics.map(t => t.subject).filter(Boolean))].sort();
  subjectFilter.innerHTML = `<button class="ll-filter-btn ${activeSubject === "all" ? "active" : ""}" data-subject="all">All subjects</button>` + subjects.map(s => `<button class="ll-filter-btn ${activeSubject === s ? "active" : ""}" data-subject="${escapeHTML(s)}">${escapeHTML(s)}</button>`).join("");
  document.getElementById("ll-semester-title").textContent = `${activeSemester} subjects`;
  document.getElementById("ll-subject-count").textContent = `${subjects.length} ${subjects.length === 1 ? "subject" : "subjects"}`;
  document.getElementById("stat-topics").textContent = topics.length;
  document.getElementById("stat-mastered").textContent = topics.filter(t => t.status === "mastered").length;
  document.getElementById("stat-inprogress").textContent = topics.filter(t => t.status === "in-progress").length;
  document.getElementById("stat-subjects").textContent = subjects.length;
  if (!subjects.includes(activeSubject)) activeSubject = "all";
}
function resourceMarkup(resources) {
  if (!Array.isArray(resources) || !resources.length) return `<div class="ll-resources-empty">Learning resources can be added here as you collect videos, books, slides and PDFs.</div>`;
  return `<div class="ll-resource-list">${resources.map(r => {
    const href = safeResourceUrl(r.url || r.href);
    const label = escapeHTML(r.title || r.name || "Learning resource");
    const type = escapeHTML(r.type || "Resource");
    return href ? `<a class="ll-resource" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer"><span class="ll-resource-icon">${resourceIcon(r.type)}</span><span class="ll-resource-copy"><small>${type}</small><strong>${label}</strong>${r.description ? `<span>${escapeHTML(r.description)}</span>` : ""}</span><span class="ll-resource-arrow">↗</span></a>` : `<div class="ll-resource ll-resource-disabled"><span class="ll-resource-icon">${resourceIcon(r.type)}</span><span class="ll-resource-copy"><small>${type}</small><strong>${label}</strong>${r.description ? `<span>${escapeHTML(r.description)}</span>` : ""}</span></div>`;
  }).join("")}</div>`;
}
function render() {
  const term = searchEl.value.toLowerCase().trim();
  const status = statusFilter.value;
  const matches = semesterTopics().filter(t =>
    (activeSubject === "all" || t.subject === activeSubject) &&
    (status === "all" || t.status === status) &&
    (!term || [t.topic, t.note, t.subject, t.week, ...(t.resources || []).map(r => [r.title, r.type, r.description, r.url].join(" "))].join(" ").toLowerCase().includes(term))
  );
  resultsCount.textContent = `${matches.length} ${matches.length === 1 ? "learning entry" : "learning entries"}`;
  if (!matches.length) {
    const isEmptySemester = !semesterTopics().length;
    grid.innerHTML = `<div class="empty-state"><h2>${isEmptySemester ? `${activeSemester} is ready for you` : "No topics found"}</h2><p>${isEmptySemester ? "Add your subjects and learning entries to data/learning.json when this semester begins." : "Try another search or progress filter."}</p></div>`;
    return;
  }
  grid.innerHTML = matches.map(t => {
    const m = statusMeta[t.status] || statusMeta["in-progress"];
    return `<article class="ll-entry-card ${m.cls}">
      <div class="ll-entry-meta"><span class="ll-status-badge">${m.emoji} ${m.label}</span><span class="ll-week-tag">${escapeHTML(t.week || "Study note")}</span></div>
      <p class="ll-entry-subject">${escapeHTML(t.subject)}</p><h3>${escapeHTML(t.topic)}</h3>
      <p class="ll-entry-note">${escapeHTML(t.note || "Add your learning notes here.")}</p>
      <details class="ll-resources"><summary>Learning resources <span>${(t.resources || []).length}</span></summary>${resourceMarkup(t.resources)}</details>
    </article>`;
  }).join("");
}
subjectFilter.addEventListener("click", e => {
  const btn = e.target.closest(".ll-filter-btn"); if (!btn) return;
  activeSubject = btn.dataset.subject;
  subjectFilter.querySelectorAll(".ll-filter-btn").forEach(b => b.classList.toggle("active", b === btn));
  render();
});
semesterTabs.addEventListener("click", e => {
  const btn = e.target.closest(".ll-semester-tab"); if (!btn) return;
  activeSemester = btn.dataset.semester;
  activeSubject = "all";
  semesterTabs.querySelectorAll(".ll-semester-tab").forEach(b => { const active = b === btn; b.classList.toggle("active", active); b.setAttribute("aria-selected", active ? "true" : "false"); });
  renderSubjects(); render();
});
searchEl.addEventListener("input", render);
statusFilter.addEventListener("change", render);
renderSubjects(); render();
