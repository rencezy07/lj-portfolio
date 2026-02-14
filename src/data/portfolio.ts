export const siteConfig = {
  name: "LJ Perez",
  title: "Full Stack Developer",
  description:
    "I craft elegant digital experiences with clean code and thoughtful design.",
  email: "laurencejayperez07@gmail.com",
  location: "Butuan City, Philippines",
  social: {
    github: "https://github.com/rencezy07",
    upwork: "https://www.upwork.com/freelancers/~01c55eb89206482373?mp_source=share",
    facebook: "https://www.facebook.com/rencezzyy",
  },
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const skillCategories = [
  {
    label: "Frontend",
    skills: ["React", "Vue.js", "HTML", "CSS", "JavaScript"],
  },
  {
    label: "Backend",
    skills: ["PHP", "Laravel", "Yii"],
  },
  {
    label: "Tools & DevOps",
    skills: ["Git", "GitHub", "Docker"],
  },
  {
    label: "Blockchain",
    skills: ["Fabric Blockchain"],
  },
  {
    label: "Productivity",
    skills: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"],
  },
];

export const aboutHighlights = [
  { label: "Years Experience", value: "3+" },
  { label: "Projects Completed", value: "10+" },
  { label: "Technologies", value: "15+" },
  { label: "Cups of Coffee", value: "∞" },
];

export const specializations = [
  {
    title: "Frontend Development",
    description:
      "Building responsive, performant interfaces with modern frameworks like React and Vue.js. Pixel-perfect from design to deployment.",
    icon: "frontend",
  },
  {
    title: "Full Stack Solutions",
    description:
      "End-to-end development from database schema to polished UI. APIs, authentication, and everything in between.",
    icon: "fullstack",
  },
  {
    title: "Blockchain Development",
    description:
      "Developing decentralized applications on Hyperledger Fabric. Smart contracts, chaincode, and distributed ledger solutions.",
    icon: "blockchain",
  },
];

export const projects = [
  {
    title: "Drone Security Scanner",
    description:
      "A desktop-based AI surveillance system that detects and classifies soldiers and civilians in real-time aerial drone footage using deep learning.",
    tech: ["Python", "YOLOv11", "OpenCV", "Flask", "PyTorch"],
    image: "/drone-security-scanner.png",
    liveUrl: null,
    githubUrl: "https://github.com/rencezy07/final-project_CSC126.git",
    category: "Full Stack",
  },
  {
    title: "OpportuniSeek",
    description: "A full-stack internship platform connecting students with companies — featuring listings, application tracking, and real-time status notifications.",
    tech: ["Laravel", "Vue.js", "Inertia.js", "Tailwind CSS", "PHP"],
    image: "/opportuniseek.png",
    liveUrl: null,
    githubUrl: "https://github.com/rencezy07/internshesh.git",
    category: "Full Stack",
  },
  {
    title: "TransCrypt",
    description:
      "A blockchain-powered credential system for universities — featuring OCR processing, IPFS storage, and immutable transcript records on Hyperledger Fabric.",
    tech: ["Node.js", "Express", "PostgreSQL", "React", "Hyperledger Fabric", "IPFS", "Material-UI"],
    image: "/transcrypt.png",
    liveUrl: null,
    githubUrl: "https://github.com/rencezy07/thesis.git",
    category: "Full Stack",
  },
  {
    title: "CyberTrio",
    description:
      "A modern job recruitment and hiring platform for a tech company specializing in cybersecurity, digital transformation, and emerging technologies. Features user authentication, job listings, and application management.",
    tech: ["HTML5", "Bootstrap 5", "CSS3", "JavaScript"],
    image: "/cybertrio.png",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    category: "Frontend",
  },
];

export const experience = [
  {
    role: "Senior Frontend Engineer",
    company: "Acme Corp",
    companyUrl: "https://example.com",
    period: "2023 — Present",
    description:
      "Leading frontend architecture for the core product. Introduced component-driven development practices and improved performance metrics by 40%.",
  },
  {
    role: "Full Stack Developer",
    company: "Startup Studio",
    companyUrl: "https://example.com",
    period: "2021 — 2023",
    description:
      "Built and shipped 3 products from concept to launch. Owned the full stack — from database schema design to pixel-perfect UI implementation.",
  },
  {
    role: "Frontend Developer",
    company: "Digital Agency",
    companyUrl: "https://example.com",
    period: "2019 — 2021",
    description:
      "Developed responsive web applications for enterprise clients. Focused on accessibility, performance, and clean code practices.",
  },
];

export const categories = ["All", "Full Stack", "Frontend"];
