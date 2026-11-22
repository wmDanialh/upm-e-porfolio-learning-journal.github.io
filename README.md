# My CCSE Journey

A responsive, static personal journal documenting a Computer and Communication Systems Engineering (CCSE) journey at Universiti Putra Malaysia (UPM).

## Project structure

```text
my-ccse-journey/
├── index.html
├── journal.html
├── article.html
├── learning-log.html
├── gallery.html
├── about.html
├── data/
│   ├── posts.json       # Journal entries and article content
│   ├── learning.json    # Learning topics and progress statuses
│   └── albums.json      # Gallery albums, photos and captions
└── assets/
    ├── css/style.css
    ├── images/          # Put your own photos here
    └── js/              # Website behaviour and page rendering
```

**Content is stored in JSON.** HTML controls the page structure, CSS controls the appearance, and JavaScript loads the JSON and renders it. You normally only need to edit the files inside `data/` when adding or changing content.

## Preview locally

Because the website loads JSON using `fetch()`, do not open `index.html` directly as a `file://` page. Run it through a local web server instead:

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html` and choose **Open with Live Server**.

## Add a journal entry

1. Open `data/posts.json`.
2. Add a new object inside the outer `[ ... ]` array. Put a comma after the previous entry.
3. Give the entry a unique `id`, date (`YYYY-MM-DD`), title, category, excerpt, cover image, and content paragraphs.
4. Save the file, preview locally, then commit and push the change to GitHub.

Example entry (copy the object, not the surrounding array):

```json
{
  "id": "week-5-first-lab",
  "date": "2026-11-02",
  "week": "Week 5",
  "category": "Learning Experience",
  "title": "My First Practical Session",
  "excerpt": "A short summary shown on the homepage and journal archive.",
  "cover": "assets/images/my-lab-photo.jpg",
  "coverAlt": "My notes during a practical session",
  "readTime": "3 min read",
  "content": [
    "Write your first paragraph here.",
    "Write another paragraph here."
  ],
  "photos": [],
  "attachments": []
}
```

Optional `photos` items use `src`, `alt` and `caption`. Optional `attachments` items use `name`, `description`, `icon` and `href`. See existing entries in `data/posts.json` for complete examples.

## Update the Learning Log

1. Open `data/learning.json`.
2. Add or edit an object in the array.
3. Use one of these status values:
   - `in-progress` — currently learning or revising
   - `struggling` — needs more practice or explanation
   - `mastered` — comfortable with the topic

Example:

```json
{
  "semester": "Sem 1",
  "subject": "Digital Logic",
  "topic": "Boolean Algebra",
  "status": "in-progress",
  "note": "Practising Boolean identities and simplification.",
  "week": "Week 4",
  "resources": [
    {
      "type": "youtube",
      "title": "Boolean Algebra Introduction",
      "description": "Video lesson for the topic",
      "url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
    },
    {
      "type": "pdf",
      "title": "Lecture Slides",
      "description": "Course slides or notes",
      "url": "assets/files/sem1/week4/lecture-slides.pdf"
    }
  ]
}
```

Resource types can be `youtube`, `book`, `website`, `slides`, `pdf`, `notes`, or `other`. Links are optional; omit `resources` or leave it empty until you have materials to add. Topics without a `semester` field are treated as `Sem 1` for backward compatibility.


The Learning Log uses semester tabs, subject filters, topic search and progress filters. Each topic can expand its resource section to show linked materials.

## Add a photo album

1. Put your own image files in `assets/images/` (for example, `assets/images/first-lab.jpg`).
2. Open `data/albums.json`.
3. Add a new album object with a unique `id`, `title`, `subtitle`, `cover`, and a `photos` array.
4. Add each photo with its `src` and `caption`.

Example:

```json
{
  "id": "first-lab",
  "title": "First Laboratory Session",
  "subtitle": "Semester 1 · Practical work",
  "cover": "assets/images/first-lab-cover.jpg",
  "photos": [
    {
      "src": "assets/images/first-lab-01.jpg",
      "caption": "Setting up the equipment"
    },
    {
      "src": "assets/images/first-lab-02.jpg",
      "caption": "My notes after the experiment"
    }
  ]
}
```

The gallery creates the album cards, photo grids and full-screen photo viewer automatically. Use paths relative to the project root for local images, such as `assets/images/photo-name.jpg`. Existing online sample images can be replaced with your own files.

## JSON editing tips

- Use double quotes around property names and text values.
- Separate items with commas, but do not put a comma after the final item.
- Use `true`, `false` or `null` without quotation marks when needed.
- Keep dates in `YYYY-MM-DD` format.
- Give every journal entry and album a unique `id`.
- Validate JSON before publishing if the page stops loading. A missing comma or extra comma can make the whole file invalid.
- Never put passwords, API keys, private student records or sensitive personal information in this public repository.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this project folder.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your publishing branch (usually `main`) and folder (`/root`), then save.
5. Wait for GitHub Pages to publish the site. Your website URL will appear in the Pages settings.

Whenever you edit a JSON file or add images, commit and push the changes to GitHub. GitHub Pages will publish the updated static site automatically.

## Important: how publishing works

This is a static website. Visitors can read the published content, but they cannot add entries to the live website themselves. To publish your own updates, edit the JSON files locally and push the changes to GitHub. The JSON files are public along with the rest of a public GitHub Pages website, so only put information and photographs you are comfortable sharing publicly.

## Notes

- `assets/js/data-loader.js` loads all three JSON files before starting the relevant page renderer.
- Keep the HTML, CSS and JavaScript files in place; they provide the layout and interactions. Day-to-day content editing should happen in `data/`.
- The gallery currently contains illustrative sample images. Replace these with your own UPM photographs and captions before treating them as personal memories.
