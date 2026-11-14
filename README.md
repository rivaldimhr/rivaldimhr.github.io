# M. Rivaldi Mahari — Portfolio

Personal portfolio website: summary, experience, projects and skills.

Live at **https://rivaldimhr.github.io**

Plain HTML and CSS, no build step. Edit `index.html` and push to update the site.

## 3D version

`3d.html` is a small 3D world drawn with a hand-written WebGL renderer (no library, no build step).

- **Scene 1, the desk:** the character sits at a computer. Clicking him or "Explore my world" goes outside.
- **Scene 2, the island:** four buildings and a mailbox. Clicking one makes the character walk in through the
  door, then the section opens: stone cottage = Summary, castle = Experience, treehouse = Projects,
  dwarf house = Skills, mailbox = Contact.

Section text lives in the `<section class="sec">` blocks. Buildings, their positions and the character's lines
are in the `B` list in the script; each building has its own draw function (`cottage`, `castle`, `treehouse`,
`dwarfHouse`, `mailbox`). Sections are deep-linkable, e.g. `3d.html#projects`.

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
