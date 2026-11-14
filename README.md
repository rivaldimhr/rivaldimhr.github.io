# M. Rivaldi Mahari — Portfolio

Personal portfolio website: summary, experience, projects and skills.

Live at **https://rivaldimhr.github.io**

Plain HTML and CSS, no build step. Edit `index.html` and push to update the site.

## CV

The "CV" button in the navigation offers two downloads:

- **Visual CV**: `assets/M-Rivaldi-Mahari-CV.pdf`, generated from `cv/index.html` (same colours as the site).
- **ATS-friendly CV**: `assets/M-Rivaldi-Mahari-CV-ATS.pdf`, a plain two-page PDF. Replace the file to update it.
 After editing `cv/index.html`, regenerate the visual PDF:

```
google-chrome --headless --no-pdf-header-footer --print-to-pdf=assets/M-Rivaldi-Mahari-CV.pdf cv/index.html
```

or open `cv/` in Chrome and print to PDF (A4, no margins, background graphics on).
