const list = document.getElementById("journal-list");
const search = document.getElementById("search-input");
const filter = document.getElementById("category-filter");
const sort = document.getElementById("sort-order");
const count = document.getElementById("results-count");
const posts = window.JOURNAL_POSTS || [];

[...new Set(posts.map(p => p.category))].sort().forEach(category => {
  const option = document.createElement("option");
  option.value = category; option.textContent = category; filter.appendChild(option);
});
const requestedCategory = new URLSearchParams(location.search).get("category");
if (requestedCategory && [...filter.options].some(o => o.value === requestedCategory)) filter.value = requestedCategory;

function renderJournal() {
  const term = search.value.toLowerCase().trim();
  let result = posts.filter(p =>
    (filter.value === "all" || p.category === filter.value) &&
    [p.title,p.excerpt,p.category,p.week].join(" ").toLowerCase().includes(term)
  );
  result.sort((a,b) => sort.value === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  count.textContent = `${result.length} ${result.length === 1 ? "entry" : "entries"}`;
  list.innerHTML = result.length ? result.map(p => `
    <article class="journal-row">
      <div class="journal-date"><strong>${new Date(p.date+"T00:00:00").getDate()}</strong><span>${new Date(p.date+"T00:00:00").toLocaleDateString("en-MY",{month:"short",year:"numeric"})}</span><small>${escapeHTML(p.week)}</small></div>
      <a class="journal-thumb" href="article.html?id=${encodeURIComponent(p.id)}"><img src="${p.cover}" alt="${escapeHTML(p.coverAlt)}" onerror="this.src='https://placehold.co/600x400/e8e8e4/606b78?text=Add+your+photo'"></a>
      <div class="journal-row-copy"><p class="eyebrow">${escapeHTML(p.category)} · ${p.readTime}</p><h2><a href="article.html?id=${encodeURIComponent(p.id)}">${escapeHTML(p.title)}</a></h2><p>${escapeHTML(p.excerpt)}</p><a class="text-link" href="article.html?id=${encodeURIComponent(p.id)}">Continue reading ↗</a></div>
    </article>`).join("") : `<div class="empty-state"><h2>No entries found</h2><p>Try another search or category.</p></div>`;
}
[search,filter,sort].forEach(el => el.addEventListener("input", renderJournal));
renderJournal();
