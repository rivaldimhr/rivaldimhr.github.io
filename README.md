# M. Rivaldi Mahari — Portfolio

Personal portfolio website: summary, experience, projects and skills.

Live at **https://rivaldimhr.github.io**

Plain HTML and CSS, no build step. Edit `index.html` and push to update the site.

## 3D version

`3d.html` is a small 3D world drawn with a hand-written WebGL renderer (no library, no build step).
The 3D button on the classic page plays a short glitch effect before switching.

1. **Desk:** the character sits at his computer. "Start" (or clicking him) zooms into the monitor.
2. **Computer screen:** a menu of buildings to choose from, plus Contact.
3. **Outside:** the character appears in front of the chosen building and walks in through the door.
4. **Inside:** a 3D room you can drag to look around, with the section shown beside it:
   stone cottage = Summary, castle = Experience, treehouse = Projects, dwarf house = Skills.

Section text lives in the `<section class="sec">` blocks. Buildings and the character's lines are in the `B`
list in the script; each building has an exterior draw function (`cottage`, `castle`, `treehouse`, `hillHouse`)
and an interior one (`cottageIn`, `castleIn`, `treeIn`, `hillIn`). All buildings are original designs.
Sections are deep-linkable, e.g. `3d.html#projects`.

## CV

The "CV" button in the navigation opens a preview of either version, each with a download button
(`cv/` and `cv/ats.html`):

- **Visual CV**: `assets/M-Rivaldi-Mahari-CV.pdf`, generated from `cv/index.html` (same colours as the site).
- **ATS-friendly CV**: `assets/M-Rivaldi-Mahari-CV-ATS.pdf`, a plain two-page PDF. To update it, replace the file and the preview images `assets/cv-ats-1.jpg` and `assets/cv-ats-2.jpg` (`pdftoppm -jpeg -r 130`).
 After editing `cv/index.html`, regenerate the visual PDF:

```
google-chrome --headless --no-pdf-header-footer --print-to-pdf=assets/M-Rivaldi-Mahari-CV.pdf cv/index.html
```

or open `cv/` in Chrome and print to PDF (A4, no margins, background graphics on).
