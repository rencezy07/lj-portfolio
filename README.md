# Portfolio

A minimal, elegant, typography-driven developer portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Theming:** next-themes (dark mode default)
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and theme
│   ├── page.tsx            # Home page assembling all sections
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Fixed nav with mobile menu
│   │   └── Footer.tsx      # Site footer
│   ├── sections/
│   │   ├── Hero.tsx        # Hero with name and CTA
│   │   ├── About.tsx       # Bio and skills
│   │   ├── Projects.tsx    # Filterable project grid
│   │   ├── Experience.tsx  # Timeline layout
│   │   └── Contact.tsx     # Contact form and info
│   ├── ui/
│   │   ├── AnimatedSection.tsx  # Scroll-triggered animations
│   │   ├── Badge.tsx       # Tech stack badges
│   │   ├── Button.tsx      # Animated button component
│   │   ├── ProjectCard.tsx # Project display card
│   │   ├── SectionHeader.tsx # Numbered section headers
│   │   └── ThemeToggle.tsx # Dark/light mode switch
│   └── providers/
│       └── ThemeProvider.tsx
├── data/
│   └── portfolio.ts        # All portfolio content (edit this!)
└── lib/
    └── utils.ts            # Utility functions
```

## Customization

### 1. Update Your Information

Edit `src/data/portfolio.ts` to replace placeholder content with your own:

- **siteConfig**: Name, title, description, email, location, social links
- **skills**: Your technical skills
- **projects**: Your project showcase
- **experience**: Your work history

### 2. SEO & Metadata

Update `src/app/layout.tsx` to customize:

- Page title and description
- Open Graph metadata
- Keywords

### 3. Colors & Theme

Modify CSS variables in `src/app/globals.css` to change the color scheme. Both light and dark themes are defined there.

### 4. Typography

Fonts are configured in `src/app/layout.tsx`. The project uses Inter (sans) and JetBrains Mono (mono) by default.

## Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy — no configuration needed

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Personal Branding Suggestions

- **Custom domain:** Use a clean domain like `firstname.dev` or `firstnamelastname.com`
- **Consistent identity:** Use the same name, bio, and avatar across GitHub, LinkedIn, and Twitter
- **Blog section:** Consider adding a blog to showcase your thinking (can be added as a `/blog` route)
- **Case studies:** Expand project descriptions into detailed case studies showing your process
- **Open source:** Link to meaningful open-source contributions
- **Resume download:** Add a downloadable PDF resume link to the header or about section
- **Analytics:** Add privacy-friendly analytics (e.g., Plausible or Umami) to track visitors

## License

MIT
