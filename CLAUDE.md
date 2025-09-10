# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a portfolio website built with HTML, CSS, and TailwindCSS. The project structure includes:

- `index.html` - Main portfolio page with sections for hero, about, skills, projects, and contact
- `garden.html` - Secondary page (garden/blog section)
- `src/input.css` - TailwindCSS input file with `@import "tailwindcss"` directive
- `css/style.css` - Compiled/custom CSS output
- `projects/` - Individual project demos (social-calculator, simple-notes)
- `assets/`, `images/`, `video/` - Static assets
- `dist/` - Distribution/build output directory

## Development Commands

### CSS Development
```bash
# Build TailwindCSS (compile src/input.css to css/style.css)
npx tailwindcss -i src/input.css -o css/style.css

# Watch mode for development
npx tailwindcss -i src/input.css -o css/style.css --watch

# Build minified for production
npx tailwindcss -i src/input.css -o css/style.css --minify
```

### Local Development
The project uses static HTML files - can be served with any static file server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if available)
npx serve .
```

## Architecture Notes

- **Theme System**: CSS variables for light/dark theme switching via `[data-theme="dark"]` attribute
- **TailwindCSS v4**: Uses the new v4 syntax with `@import "tailwindcss"` in src/input.css
- **Responsive Design**: Mobile-first approach with responsive navigation and layouts
- **Font Integration**: Uses LXGW WenKai font from CDN for Chinese character support
- **Project Demos**: Self-contained HTML projects in the `projects/` directory
- **No Build System**: No package.json scripts defined - uses direct TailwindCSS CLI commands

## Key Features

- Dual language support (Chinese/English)
- Dark/light theme toggle
- Responsive design with mobile navigation
- Progress bars and interactive elements
- Self-contained project demonstrations
- CSS custom properties for theming