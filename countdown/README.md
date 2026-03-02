## Death of the 20s – Countdown

This mini app shows a countdown to someone's 30th birthday ("death of the 20s") over a fullscreen slideshow of their photos.

It is driven by simple JSON files in the `data` folder so you can easily add more people.

---

### How to run it locally

- **From this folder (`countdown`) in a terminal:**

  ```bash
  cd countdown
  python -m http.server 8000
  ```

- **Open in your browser:**
  - `http://localhost:8000/index.html` → default person (`rainbow`)
  - `http://localhost:8000/index.html?person=rainbow` → explicitly `rainbow`
  - `http://localhost:8000/index.html?person=alex` → another person you add

Opening `index.html` directly as a `file://` URL will not work because the browser blocks `fetch()` of the JSON files.

---

### How the person is chosen (URLs)

The script figures out which person to show from the URL in two ways:

- **Query parameter (always works):**

  - `.../index.html?person=rainbow`
  - `.../index.html?person=alex`

- **Path segment (for deployments like GitHub Pages):**
  - `.../countdown/` → default person `rainbow`
  - `.../countdown/rainbow` → uses `data/rainbow/info.json`
  - `.../countdown/alex` → uses `data/alex/info.json`

Internally this is handled in `script.js` by looking at `window.location.search` and `window.location.pathname`.

---

### How to add a new person

1. **Create a folder** under `data` with the ID you want to use in the URL:

   ```text
   countdown/data/alex/
   ```

2. **Put their photos** in that folder (e.g. `1.jpg`, `2.jpg`, `3.jpg`, ...).

3. **Create an `info.json` file** in that folder with this shape:

   ```json
   {
     "name": "Alex",
     "birthdate": "1999-07-15",
     "images": ["1.jpg", "2.jpg", "3.jpg"]
   }
   ```

   - **`name`**: Display name that appears in the headline.
   - **`birthdate`**: Must be in `YYYY-MM-DD` format; the app counts down to their 30th birthday.
   - **`images`**: Filenames of images in the same folder.

4. **Open the page for that person:**
   - Locally: `http://localhost:8000/index.html?person=alex`
   - With path-based routing (e.g. GitHub Pages): `.../countdown/alex`

---
