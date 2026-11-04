# VLSI Recall

A self-contained study website for **83413 Introduction to VLSI, Midterm 1, Lectures 1–4**. Open [index.html](index.html) to start.

The site contains all **63 questions** from Ari Sharon's **2026–2027** question bank for the Hebrew University of Jerusalem. Questions, answer choices, diagrams and the original answer explanations are preserved as lossless images rendered directly from the supplied PDF. Additional English teaching explanations include properly rendered mathematics, prerequisite knowledge and common mistakes.

## Start studying

Open `index.html` in a modern browser. Keep the complete folder together: the scripts, question images, fonts and mathematical renderer are all included locally. There is no installation, build step, account, backend or CDN requirement. The downloaded folder can be used offline.

- **Learn:** answer before revealing the solution, read the explanation, and rate how well you recalled it. Missed questions return for further practice.
- **Question bank:** browse the full set and focus on a lecture, difficulty or topic.
- **Formula-sheet path:** go through all 63 questions grouped and ordered by the sections of the course formula sheet (I–V, small-signal, amplifier stages, Miller, silicon, threshold and body effect, capacitances, performance measures, SPICE). Each section shows its key formulas first; study one section, the whole path, or continue from any section onward. Defined in `path.js`. The same page can also run the questions in plain numerical order (1 → 63) from any starting question.
- **Formula sheet:** a Hebrew formula sheet for the midterm, `assets/formula-sheet.pdf`, linked from the sidebar and the path page.
- **Mock exam:** measure your current performance. Exam answers do not change the spaced-repetition schedule. After an exam, use the missed-question review action to practice weak areas.
- **Your progress:** inspect coverage and retention estimates across the bank.
- **Settings & data:** change the retention target, export or import a backup, or reset learning history to start again.

For the best use of the explanations, say the reasoning to yourself before revealing the answer. Recognizing a familiar answer choice is weaker evidence of learning than being able to explain why the other choices fail.

## How review scheduling works

The app uses **ts-fsrs 5.4.2**, an implementation of the Free Spaced Repetition Scheduler. Review history updates each question's difficulty, memory stability and estimated recall probability, which inform the next review time. The library version is pinned in this download. See the [official ts-fsrs project](https://github.com/open-spaced-repetition/ts-fsrs) for the underlying scheduler.

Choose a target retention of **85%, 90% or 95%**. A higher target generally means more frequent reviews. The target is a model estimate of recall at a scheduled review, not a promise that every answer will be remembered. Follow the due reviews and rate your recall honestly.

The site's **Well retained** indicator requires all three conditions:

1. Correct learning reviews on at least three distinct days.
2. Estimated memory stability of at least seven days.
3. Current estimated recall of at least 85%.

This indicator is separate from a mock-exam score. A high score today does not establish durable recall, and the estimate can fall as time passes without review. No scheduling algorithm can guarantee permanent memory.

## Save and move your progress

Progress is stored in your browser on this device. It does not automatically sync between devices, browsers, profiles or website addresses. Clearing site data, using a temporary/private browsing session, or resetting history can remove it.

Use **Settings & data** to export a JSON backup. Keep that backup outside the website folder. To continue elsewhere, open the destination copy of the site and import the backup there.

In particular, a local preview and your published GitHub Pages address use different browser storage. **Export from the preview, then import on GitHub Pages** to transfer the history. The same applies when moving to another domain. Storage for directly opened local files can also vary between browsers; regular backups are useful.

## Publish on GitHub Pages

1. Create a GitHub repository, or use the repository where you want to host the site.
2. Upload the **contents of the `vlsi-recall` folder** to the repository root, preserving all subfolders. The root should contain `index.html`, `styles.css`, `app.js`, `engine.js`, `questions.js`, `.nojekyll`, `assets/` and `vendor/`. Upload the actual files, not a ZIP archive and not an extra enclosing `vlsi-recall` folder.
3. Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**.
5. Select **main** and **/ (root)**, then **Save**.
6. When GitHub finishes publishing, open the address shown in the Pages settings. A project site normally uses `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

For uploading the whole folder at once, GitHub Desktop is convenient: open the local repository folder, copy the site contents into it, commit, and push. If you use GitHub’s website and reach its file-count limit, upload the files in smaller batches while preserving the folders.

No custom deployment workflow is needed. The site uses relative paths, so it works at a GitHub Pages repository path as well as at a domain root. Keep `.nojekyll` with the uploaded files. For the current publishing controls, see [GitHub's official Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

If a published page is missing styling, mathematics or question images, check that the entire `assets/` and `vendor/` folders were uploaded with their original names and structure. If GitHub shows a 404, check that `index.html` is at the root of the branch selected in Pages settings.

## Content and mathematical rendering

The [original question-bank PDF](assets/original-question-bank.pdf) is included for reference. Its wording, notation, figures and official answer key remain intact in the original images. The extra teaching material is separate from those source images; scientific qualifications or corrections are identified in the explanations where relevant. These additions are study aids, not revised official course solutions.

The course conventions apply unless a question says otherwise: NMOS, long-channel square law, temperature 300 K, and thermal voltage approximately 26 mV. Some questions explicitly use approximations or lecture-specific examples. Their explanations retain those assumptions rather than presenting them as universal device behavior.

New explanatory formulas are rendered with **KaTeX 0.19.1**, bundled with its fonts. See the [official KaTeX documentation](https://katex.org/docs/supported.html) for supported mathematical notation.

## Credits

Source: **Ari Sharon · 2026–2027 · 83413 Introduction to VLSI · Hebrew University of Jerusalem**, *Midterm 1 Question Bank, Lectures 1–4*.

Third-party software credits and license locations are in [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt). The source PDF and its reproduced images retain their original authorship; the software-library licenses do not assign a license to the course content.
