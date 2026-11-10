import "./App.css"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"

/* ============ Types ============ */

type Lang = "en" | "fr"
type Theme = "light" | "dark"
type Text = string | { en: string; fr: string }

/* ============ UI strings ============ */

const en = {
    navAbout: "About",
    navEducation: "Education",
    navProjects: "Projects",
    navSkills: "Skills",
    navContact: "Contact",
    sectionEducation: "Education",
    sectionProjects: "Projects",
    sectionSkills: "Skills",
    sectionContact: "Contact",
    sectionExtra: "Extra",
    sectionCertificates: "Other certificates",
    viewProjects: "View projects",
    getInTouch: "Get in touch",
    viewCertificate: "View certificate",
    download: "Download",
    close: "Close",
    backToTop: "Back to top",
    backToPortfolio: "Back to portfolio",
    seeOtherCertificates: "See other certificates",
    viewProject: "View project",
    featured: "Featured",
    courses: "Courses",
    honorsEvents: "Honors & events",
    downloadCv: "Download CV",
    resume: "Resume",
    contactHero: "Let's build something useful together.",
    rights: "All rights reserved.",
    statProjects: "Projects",
    statCertificates: "Certificates",
    statSkills: "Skills listed",
    statEvents: "Events",
    emptyCertificates: "Minor certificates will be listed here.",
    certificateMissing: "Certificate file not found. Check its name in the assets folder.",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    switchLanguage: "Français",
    photoAlt: "Portrait of Serge Auronss Gbaguidi",
}

const fr: typeof en = {
    navAbout: "À propos",
    navEducation: "Formation",
    navProjects: "Projets",
    navSkills: "Compétences",
    navContact: "Contact",
    sectionEducation: "Formation",
    sectionProjects: "Projets",
    sectionSkills: "Compétences",
    sectionContact: "Contact",
    sectionExtra: "Extra",
    sectionCertificates: "Autres certificats",
    viewProjects: "Voir les projets",
    getInTouch: "Me contacter",
    viewCertificate: "Voir le certificat",
    download: "Télécharger",
    close: "Fermer",
    backToTop: "Retour en haut",
    backToPortfolio: "Retour au portfolio",
    seeOtherCertificates: "Voir les autres certificats",
    viewProject: "Voir le projet",
    featured: "Mis en avant",
    courses: "Cours",
    honorsEvents: "Distinctions et événements",
    downloadCv: "Télécharger le CV",
    resume: "CV",
    contactHero: "Construisons ensemble quelque chose d'utile.",
    rights: "Tous droits réservés.",
    statProjects: "Projets",
    statCertificates: "Certificats",
    statSkills: "Compétences recensées",
    statEvents: "Événements",
    emptyCertificates: "Les certificats supplémentaires apparaîtront ici.",
    certificateMissing: "Fichier du certificat introuvable. Vérifiez son nom dans le dossier assets.",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    switchLanguage: "English",
    photoAlt: "Portrait de Serge Auronss Gbaguidi",
}

const ui: Record<Lang, typeof en> = { en, fr }

/* ============ App context ============ */

type AppContextValue = {
    lang: Lang
    setLang: (lang: Lang) => void
    theme: Theme
    setTheme: (theme: Theme) => void
    t: (key: keyof typeof en) => string
    tx: (text: Text) => string
}

const AppContext = createContext<AppContextValue | null>(null)

function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error("useApp must be used inside AppContext.Provider")
    return context
}

export function App() {
    const [lang, setLang] = useState<Lang>(() => {
        const saved = localStorage.getItem("lang")
        if (saved === "en" || saved === "fr") return saved
        return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"
    })

    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme")
        if (saved === "light" || saved === "dark") return saved
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    })

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        document.documentElement.lang = lang
        localStorage.setItem("lang", lang)
    }, [lang])

    const value: AppContextValue = {
        lang,
        setLang,
        theme,
        setTheme,
        t: (key) => ui[lang][key],
        tx: (text) => (typeof text === "string" ? text : text[lang]),
    }

    return (
        <AppContext.Provider value={value}>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )
}

function ScrollToTop() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (!hash) window.scrollTo(0, 0)
    }, [pathname, hash])

    return null
}

/* ============ Shared pieces ============ */

function Icon({ name }: { name: string }) {
    return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>
}

function CertificateButton({ src, title, label }: { src?: string; title: string; label?: string }) {
    const { t } = useApp()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [previewing, setPreviewing] = useState(false)

    const isPdf = src ? /\.pdf$/i.test(src.split("?")[0]) : false

    const open = () => {
        setPreviewing(true)
        dialogRef.current?.showModal()
    }

    const close = () => dialogRef.current?.close()

    return (
        <>
            <button type="button" className="btn btn--small" onClick={open}>
                <Icon name="workspace_premium" />
                {label ?? t("viewCertificate")}
            </button>

            <dialog
                ref={dialogRef}
                className="certDialog"
                aria-label={title}
                onClick={(event) => {
                    if (event.target === event.currentTarget) close()
                }}
                onClose={() => setPreviewing(false)}
            >
                <div className="certDialogPanel">
                    <div className="certDialogBar">
                        <span>{title}</span>
                        <div className="certDialogActions">
                            {src && (
                                <a className="btn btn--small" href={src} download>
                                    <Icon name="download" />
                                    {t("download")}
                                </a>
                            )}
                            <button type="button" className="btn btn--small" onClick={close}>
                                <Icon name="close" />
                                {t("close")}
                            </button>
                        </div>
                    </div>

                    {previewing && (src ? (
                        isPdf ? (
                            <iframe className="certFrame" src={src} title={title} />
                        ) : (
                            <img className="certImage" src={src} alt={title} />
                        )
                    ) : (
                        <p className="certMissing">{t("certificateMissing")}</p>
                    ))}
                </div>
            </dialog>
        </>
    )
}

function SectionTitle({ index, title }: { index: string; title: string }) {
    return (
        <div className="sectionTitle">
            <span className="eyebrow">{index}</span>
            <h2>{title}</h2>
        </div>
    )
}

function InfoCard({ icon, title, certificate, children }: {
    icon: string
    title: Text
    certificate?: { src?: string; label?: Text }
    children?: ReactNode
}) {
    const { tx } = useApp()
    return (
        <article className="infoCard">
            <span className="infoIcon"><Icon name={icon} /></span>
            <h4>{tx(title)}</h4>
            {children}
            {certificate && (
                <CertificateButton
                    src={certificate.src}
                    title={tx(title)}
                    label={certificate.label ? tx(certificate.label) : undefined}
                />
            )}
        </article>
    )
}

type CertLink = { title: Text; src?: string; label?: Text }

function TimelineItem({ period, title, certificates = [], children }: {
    period: Text
    title: Text
    certificates?: Array<CertLink>
    children?: ReactNode
}) {
    const { tx } = useApp()
    return (
        <li className="timelineItem">
            <span className="timelinePeriod">{tx(period)}</span>
            <div className="timelineCard">
                <h3>{tx(title)}</h3>
                {children}
                {certificates.length > 0 && (
                    <div className="timelineActions">
                        {certificates.map((cert) => (
                            <CertificateButton
                                key={tx(cert.title)}
                                src={cert.src}
                                title={tx(cert.title)}
                                label={cert.label ? tx(cert.label) : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </li>
    )
}

function ThemeToggle() {
    const { theme, setTheme, t } = useApp()
    const isDark = theme === "dark"

    return (
        <button
            type="button"
            className="themeToggle"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <Icon name={isDark ? "light_mode" : "dark_mode"} />
            {isDark ? t("lightMode") : t("darkMode")}
        </button>
    )
}

function LanguageToggle() {
    const { lang, setLang, t } = useApp()

    return (
        <button
            type="button"
            className="themeToggle"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
        >
            <Icon name="translate" />
            {t("switchLanguage")}
        </button>
    )
}

function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <header id="top"><Header /></header>
            <main>{children}</main>
            <footer><Footer /></footer>
        </>
    )
}

function Header() {
    const { t } = useApp()
    return (
        <>
            <Link className="logo" to="/">
                <span className="monogram">SA</span>
                Serge Auronss
            </Link>
            <ul>
                <li><a href="/#About">{t("navAbout")}</a></li>
                <li><a href="/#Education">{t("navEducation")}</a></li>
                <li><a href="/#Projects">{t("navProjects")}</a></li>
                <li><a href="/#Skills">{t("navSkills")}</a></li>
                <li><a href="/#Contact">{t("navContact")}</a></li>
            </ul>
            <div className="headerTools">
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </>
    )
}

function Footer() {
    const { t } = useApp()
    return (
        <>
            <div className="footerBrand">
                <span className="monogram">SA</span>
                Serge Auronss Gbaguidi
            </div>
            <p>© {new Date().getFullYear()} {t("rights")}</p>
            <button
                type="button"
                className="btn btn--small"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                {t("backToTop")}
                <Icon name="arrow_upward" />
            </button>
        </>
    )
}

/* ============ Pages ============ */

function Home() {
    return (
        <Layout>
            <section id="About"><About /></section>
            <section id="Education"><Education /></section>
            <section id="Projects"><Projects /></section>
            <section id="Skills"><Skills /></section>
            <section id="Contact"><Contact /></section>
        </Layout>
    )
}

function CertificatesPage() {
    return (
        <Layout>
            <section id="Certificates"><Certificates /></section>
        </Layout>
    )
}

/* ============ Assets (src/assets) ============ */

const assetFiles = import.meta.glob("./assets/*", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

// Finds an asset whose filename contains the keyword, ignoring case, spaces and punctuation
function assetFor(keyword: string): string | undefined {
    const wanted = normalize(keyword)
    const match = Object.keys(assetFiles).find((path) =>
        normalize(path.split("/").pop() ?? "").includes(wanted)
    )

    if (!match) {
        console.warn(
            `No asset matching "${keyword}". Files found: ` +
            Object.keys(assetFiles).map((path) => path.split("/").pop()).join(", ")
        )
        return undefined
    }

    return assetFiles[match]
}

const certificates = {
    ibm: assetFor("ibm"),
    indabax: assetFor("indabax"),
    datatour: assetFor("participation"),
}

const cvSrc = assetFor("cv")

/* ============ Data ============ */

type Project = {
    title: string
    description: Text
    link: string
    icon: string
    tags: Array<string>
    featured?: boolean
}

const projects: Array<Project> = [
    {
        title: "Echo",
        description: {
            en: "Self-hosted personal music manager. Downloads songs from YouTube, identifies tracks by audio fingerprint (Chromaprint and AcoustID), enriches metadata with MusicBrainz and LRCLib, and handles playlists and listening history.",
            fr: "Gestionnaire de musique personnel auto-hébergé. Télécharge des titres depuis YouTube, identifie les morceaux par empreinte audio (Chromaprint et AcoustID), enrichit les métadonnées avec MusicBrainz et LRCLib, et gère les playlists et l'historique d'écoute.",
        },
        link: "https://github.com/sergeauronss01/Echo",
        icon: "music_note",
        tags: ["Node.js", "Express", "PostgreSQL", "Supabase", "JavaScript", "AcoustID", "MusicBrainz"],
        featured: true,
    },
    {
        title: "simpleml",
        description: {
            en: "A scikit-learn-style machine learning library written from scratch in Python and NumPy. Includes classifiers, regressors, clustering, preprocessing, cross-validation, and metrics. Published on PyPI as simpleml-auronss.",
            fr: "Bibliothèque de machine learning inspirée de scikit-learn, écrite de zéro en Python et NumPy. Inclut classifieurs, régresseurs, clustering, prétraitement, validation croisée et métriques. Publiée sur PyPI sous le nom simpleml-auronss.",
        },
        link: "https://github.com/sergeauronss01/simpleml",
        icon: "data_object",
        tags: ["Python", "NumPy", "pytest", "PyPI"],
    },
    {
        title: "Sindô",
        description: {
            en: "A French-language legal assistant prototype. A Flutter mobile app sends a situation, a PDF or image, or a video link to a FastAPI backend, which returns a structured legal analysis generated by Gemini.",
            fr: "Prototype d'assistant juridique en français. Une application mobile Flutter envoie une situation, un PDF ou une image, ou un lien vidéo à un backend FastAPI, qui renvoie une analyse juridique structurée générée par Gemini.",
        },
        link: "https://github.com/sergeauronss01/Sindo",
        icon: "gavel",
        tags: ["Flutter", "Dart", "FastAPI", "Gemini API", "pytest"],
    },
    {
        title: "Vulnerability Updater",
        description: {
            en: "A defensive vulnerability intelligence tool. It crawls CVE advisories, summarizes them into structured reports with Google Gemini, and serves the results through a FastAPI dashboard and API backed by SQLite.",
            fr: "Outil défensif de veille sur les vulnérabilités. Il parcourt les avis CVE, les résume en rapports structurés avec Google Gemini, et expose les résultats via un tableau de bord et une API FastAPI adossés à SQLite.",
        },
        link: "https://github.com/sergeauronss01/Vulnerabilities-Updater",
        icon: "shield",
        tags: ["FastAPI", "SQLite", "Gemini API", "BeautifulSoup", "Pydantic"],
    },
]

type Item = {
    title: Text
    description: Text
    icon: string
    certificate?: { src?: string }
}

// No certificates for these, so no buttons
const courses: Array<Item> = [
    {
        title: {
            en: "Preparing for Google Cloud Machine Learning Engineer Professional Certificate",
            fr: "Préparation au certificat professionnel Google Cloud Machine Learning Engineer",
        },
        description: {
            en: "Covers production machine learning systems, including distributed training, model deployment, and MLOps with CI/CD on Google Cloud Platform, using TensorFlow and Keras. Prepares for the Google Cloud Professional Machine Learning Engineer exam.",
            fr: "Couvre les systèmes de machine learning en production, notamment l'entraînement distribué, le déploiement de modèles et le MLOps avec CI/CD sur Google Cloud Platform, avec TensorFlow et Keras. Prépare à l'examen Google Cloud Professional Machine Learning Engineer.",
        },
        icon: "cloud",
    },
    {
        title: {
            en: "Machine Learning Specialization, DeepLearning.AI",
            fr: "Spécialisation Machine Learning, DeepLearning.AI",
        },
        description: {
            en: "Three-course specialization taught by Andrew Ng covering linear and logistic regression, neural networks, decision trees and ensembles, clustering, anomaly detection, recommender systems, and reinforcement learning.",
            fr: "Spécialisation en trois cours enseignée par Andrew Ng : régression linéaire et logistique, réseaux de neurones, arbres de décision et ensembles, clustering, détection d'anomalies, systèmes de recommandation et apprentissage par renforcement.",
        },
        icon: "model_training",
    },
    {
        title: {
            en: "Deep Learning for NLP and Computer Vision (CS224N & CS231N), Stanford University",
            fr: "Deep Learning pour le NLP et la vision par ordinateur (CS224N & CS231N), université de Stanford",
        },
        description: {
            en: "CS224N covers word vectors, recurrent networks and attention, transformers, pretraining with BERT, and adapting large language models. CS231N covers convolutional networks, training methods, object detection, and segmentation.",
            fr: "CS224N couvre les word vectors, les réseaux récurrents et l'attention, les transformers, le pré-entraînement avec BERT et l'adaptation des grands modèles de langage. CS231N couvre les réseaux convolutifs, les méthodes d'entraînement, la détection d'objets et la segmentation.",
        },
        icon: "school",
    },
]

const honors: Array<Item> = [
    {
        title: {
            en: "Deep Learning IndabaX Benin Republic",
            fr: "Deep Learning IndabaX Bénin",
        },
        description: {
            en: "A locally organized event within the Deep Learning IndabaX network, which spreads knowledge and builds machine learning and AI capacity across Africa. The network started in 2018 and included 47 countries in 2025.",
            fr: "Événement organisé localement au sein du réseau Deep Learning IndabaX, qui diffuse les connaissances et renforce les capacités en machine learning et en IA à travers l'Afrique. Le réseau a été lancé en 2018 et comptait 47 pays en 2025.",
        },
        icon: "hub",
        certificate: { src: certificates.indabax },
    },
    {
        title: "Datatour 2026",
        description: {
            en: "A pan-African data science competition. My team, P&A Data, finished 6th out of 92 teams in the national round.",
            fr: "Compétition panafricaine de data science. Mon équipe, P&A Data, a terminé 6e sur 92 équipes lors de la phase nationale.",
        },
        icon: "emoji_events",
        certificate: { src: certificates.datatour },
    },
]

// Certificates shown on the /certificates page. "match" is a keyword from the filename.
const minorCertificates: Array<{ title: Text; issuer: string; match: string }> = [
    { title: { en: "Data Visualization with Python", fr: "Visualisation de données avec Python" }, issuer: "IBM · Coursera", match: "visuali" },
    { title: { en: "Data Analysis with Python", fr: "Analyse de données avec Python" }, issuer: "IBM · Coursera", match: "dataanalysis" },
    { title: { en: "Data Science Methodology", fr: "Méthodologie de la data science" }, issuer: "IBM · Coursera", match: "methodology" },
    { title: { en: "Data Scientist Career Guide and Interview Preparation", fr: "Guide de carrière du data scientist et préparation aux entretiens" }, issuer: "IBM · Coursera", match: "careerguide" },
    { title: { en: "Databases and SQL for Data Science with Python", fr: "Bases de données et SQL pour la data science avec Python" }, issuer: "IBM · Coursera", match: "databases" },
    { title: { en: "Generative AI: Elevate Your Data Science Career", fr: "IA générative : faire progresser votre carrière en data science" }, issuer: "IBM · Coursera", match: "generativeai" },
    { title: { en: "Getting Started With Microsoft PowerPoint", fr: "Premiers pas avec Microsoft PowerPoint" }, issuer: "Coursera", match: "microsoftpowerpoint" },
    { title: { en: "Getting Started With Microsoft Word", fr: "Premiers pas avec Microsoft Word" }, issuer: "Coursera", match: "microsoftword" },
    { title: "Google Drive", issuer: "Coursera", match: "googledrive" },
    { title: { en: "Machine Learning with Python", fr: "Machine Learning avec Python" }, issuer: "IBM · Coursera", match: "machinelearning" },
    { title: { en: "Python for Data Science, AI & Development", fr: "Python pour la data science, l'IA et le développement" }, issuer: "IBM · Coursera", match: "pythonfordatascienceai" },
    { title: { en: "Python Project for Data Science", fr: "Projet Python pour la data science" }, issuer: "IBM · Coursera", match: "pythonproject" },
    { title: { en: "Tools for Data Science", fr: "Outils pour la data science" }, issuer: "IBM · Coursera", match: "toolsfordatascience" },
    { title: { en: "Web Development", fr: "Développement web" }, issuer: "SoloLearn", match: "webdevelopment" },
    { title: { en: "What is Data Science", fr: "Qu'est-ce que la data science ?" }, issuer: "IBM · Coursera", match: "whatisdatascience" },
]

const skillGroups: Array<{ id: string; icon: string; label: Text; wide?: boolean; skills: Array<Text> }> = [
    {
        id: "technical",
        icon: "psychology",
        label: { en: "Technical", fr: "Techniques" },
        wide: true,
        skills: [
            "Machine Learning",
            "Deep Learning",
            { en: "Natural Language Processing", fr: "Traitement automatique du langage" },
            { en: "Computer Vision", fr: "Vision par ordinateur" },
            { en: "Data Analysis & Visualization", fr: "Analyse et visualisation de données" },
            { en: "REST API Design", fr: "Conception d'API REST" },
            { en: "Database Design & SQL", fr: "Conception de bases de données et SQL" },
            { en: "Authentication & Authorization", fr: "Authentification et autorisation" },
            { en: "Automated Testing", fr: "Tests automatisés" },
            { en: "Systems Analysis & Design", fr: "Analyse et conception de systèmes" },
        ],
    },
    {
        id: "languages",
        icon: "code",
        label: { en: "Languages", fr: "Langages" },
        skills: ["Python", "JavaScript", "TypeScript", "SQL", "C"],
    },
    {
        id: "frameworks",
        icon: "widgets",
        label: { en: "Frameworks & Libraries", fr: "Frameworks et bibliothèques" },
        skills: ["PyTorch", "scikit-learn", "NumPy", "pandas", "FastAPI", "Flutter", "Node.js", "Express", "React", "pytest"],
    },
    {
        id: "tools",
        icon: "build",
        label: { en: "Tools & Platforms", fr: "Outils et plateformes" },
        skills: ["Git", "GitHub", "Linux", "PostgreSQL", "Supabase", "Google Cloud Platform", "Gemini API", "VS Code"],
    },
    {
        id: "transversal",
        icon: "groups",
        label: { en: "Transversal", fr: "Transversales" },
        skills: [
            { en: "English", fr: "Anglais" },
            { en: "French", fr: "Français" },
            "Communication",
            { en: "Adaptability", fr: "Adaptabilité" },
            { en: "Autonomy", fr: "Autonomie" },
            { en: "Critical Thinking", fr: "Esprit critique" },
        ],
    },
]

const contacts: Array<{ icon: string; label: Text; value: string; href: string; external: boolean; wide?: boolean }> = [
    { icon: "mail", label: { en: "Email", fr: "E-mail" }, value: "auronss.ms@gmail.com", href: "mailto:auronss.ms@gmail.com", external: false, wide: true },
    { icon: "code", label: "GitHub", value: "sergeauronss01", href: "https://github.com/sergeauronss01", external: true },
    { icon: "work", label: "LinkedIn", value: "Serge Auronss G.", href: "https://www.linkedin.com/in/serge-auronss-g-2220a13a9", external: true },
]

const heroEyebrow: Text = {
    en: "Machine Learning · AI Research · Python",
    fr: "Machine Learning · Recherche en IA · Python",
}

const heroTitle: Text = {
    en: "Aspiring Machine Learning Engineer and AI researcher",
    fr: "Futur ingénieur en Machine Learning et chercheur en IA",
}

const heroBio: Text = {
    en: "I am Serge Auronss Gbaguidi. I study Business Computing, precisely IT Systems Analysis & Programming, at the Benin School of Applied Economics and Management. My aim is to be a Machine Learning Engineer and AI researcher. For that matter, besides school, I study AI & ML. I mainly use python for most things and Javascript when a GUI is needed. I am currently expanding my abilities to quantitative finance.",
    fr: "Je m'appelle Serge Auronss Gbaguidi. J'étudie l'informatique de gestion, plus précisément l'analyse informatique et la programmation, à l'École béninoise d'économie appliquée et de management. Mon objectif est de devenir ingénieur en Machine Learning et chercheur en IA. En parallèle de mes études, je me forme à l'IA et au ML. J'utilise principalement Python pour la plupart de mes travaux, et JavaScript lorsqu'une interface graphique est nécessaire. J'élargis actuellement mes compétences en finance quantitative.",
}

/* ============ Sections ============ */

function About() {
    const { t, tx } = useApp()

    return (
        <>
            <div className="aboutGrid">
                <div className="aboutText">
                    <span className="eyebrow">{tx(heroEyebrow)}</span>
                    <h1>Serge Auronss Gbaguidi</h1>
                    <h2>{tx(heroTitle)}</h2>
                    <p>{tx(heroBio)}</p>
                    <div className="heroActions">
                        <a className="btn btn--solid" href="/#Projects">
                            {t("viewProjects")}
                            <Icon name="arrow_downward" />
                        </a>
                        <a className="btn" href="/#Contact">{t("getInTouch")}</a>
                    </div>
                </div>
                <div className="aboutPhoto">
                    <img src="/profile.jpg" alt={t("photoAlt")} />
                </div>
            </div>
        </>
    )
}

function Education() {
    const { t, tx } = useApp()

    const bscTitle: Text = {
        en: "Bachelor of Science in Business Computing, IT Systems Analysis & Programming",
        fr: "Licence en informatique de gestion, analyse des informatique et programmation",
    }

    const bscSchool: Text = {
        en: "Benin School of Applied Economics and Management",
        fr: "École Nationale d'Économie Appliquée et de Management",
    }

    const bscCoursework: Text = {
        en: "Key coursework: Linear Algebra, Mathematical Analysis, Probability and Statistics, Mathematics for Computing, Algorithmics, Python Programming, Database Theory and DBMS, Data Structures, Object-Oriented Analysis and Design with UML, Computer Networks, Dynamic Web, Operations Research, Linux Systems, Information Theory and Coding.",
        fr: "Cours principaux : Algèbre linéaire, Analyse mathématique, Probabilités et statistique, Mathématiques pour l'informatique, Initiation à l'algorithmique, Programmation Python, Théorie des bases de données et SGBD, Structures de données, Analyse et conception orientées objet avec UML, Réseaux informatiques, Web dynamique, Recherche opérationnelle, Système Linux, Théorie de l'information et codage.",
    }

    const bscGrade: Text = {
        en: "Grade: 16.19/20 for 1st year",
        fr: "Moyenne : 16,19/20 pour la première année",
    }

    const ibmCredential: Text = {
        en: "Coursera · Credential ID: RLN1CF0O6HFQ",
        fr: "Coursera · Identifiant : RLN1CF0O6HFQ",
    }

    const ibmCoursework: Text = {
        en: "Key coursework: Python for Data Science and AI, Databases and SQL, Data Visualization with Python, Machine Learning with Python, Applied Data Science Capstone.",
        fr: "Cours principaux : Python pour la data science et l'IA, Bases de données et SQL, Visualisation de données avec Python, Machine Learning avec Python, Projet final en data science appliquée.",
    }

    return (
        <>
            <SectionTitle index="01" title={t("sectionEducation")} />

            <ol className="timeline">
                <TimelineItem period="2025 – 2028" title={bscTitle}>
                    <p>{tx(bscSchool)}</p>
                    <p>{tx(bscCoursework)}</p>
                    <p>{tx(bscGrade)}</p>
                </TimelineItem>

                <TimelineItem
                    period="2026"
                    title="IBM Data Science Professional Certificate"
                    certificates={[
                        { title: "IBM Data Science Professional Certificate", src: certificates.ibm },
                    ]}
                >
                    <p>{tx(ibmCredential)}</p>
                    <p>{tx(ibmCoursework)}</p>
                </TimelineItem>
            </ol>

            <div className="subsection">
                <h3 className="subhead"><Icon name="menu_book" />{t("courses")}</h3>
                <ul className="cardGrid">
                    {courses.map((course) => (
                        <li key={tx(course.title)}>
                            <InfoCard icon={course.icon} title={course.title}>
                                <p>{tx(course.description)}</p>
                            </InfoCard>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="subsection">
                <h3 className="subhead"><Icon name="emoji_events" />{t("honorsEvents")}</h3>
                <ul className="cardGrid">
                    {honors.map((item) => (
                        <li key={tx(item.title)}>
                            <InfoCard icon={item.icon} title={item.title} certificate={item.certificate}>
                                <p>{tx(item.description)}</p>
                            </InfoCard>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sectionAction">
                <Link className="btn btn--solid" to="/certificates">
                    <Icon name="workspace_premium" />
                    {t("seeOtherCertificates")}
                </Link>
            </div>
        </>
    )
}

function Projects() {
    const { t, tx } = useApp()
    return (
        <>
            <SectionTitle index="02" title={t("sectionProjects")} />
            <div className="projectGrid">
                {projects.map((project, index) => (
                    <article
                        className={`projectCard${project.featured ? " isFeatured" : ""}`}
                        key={project.title}
                    >
                        <div className="projectTop">
                            <span className="infoIcon"><Icon name={project.icon} /></span>
                            {project.featured && <span className="badge">{t("featured")}</span>}
                            <span className="projectIndex">{String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <h3>{project.title}</h3>
                        <p>{tx(project.description)}</p>
                        <ul className="tagList">
                            {project.tags.map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                        <a className="textLink" href={project.link} target="_blank" rel="noopener noreferrer">
                            {t("viewProject")}
                            <Icon name="arrow_outward" />
                        </a>
                    </article>
                ))}
            </div>
        </>
    )
}

function Skills() {
    const { t, tx } = useApp()
    return (
        <>
            <SectionTitle index="03" title={t("sectionSkills")} />
            <div className="skillGrid">
                {skillGroups.map((group) => (
                    <article className={`skillCard${group.wide ? " isWide" : ""}`} key={group.id}>
                        <h3><Icon name={group.icon} />{tx(group.label)}</h3>
                        <ul className="chipList">
                            {group.skills.map((skill) => (
                                <li key={tx(skill)}>{tx(skill)}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </>
    )
}

function Contact() {
    const { t, tx } = useApp()
    return (
        <>
            <SectionTitle index="04" title={t("sectionContact")} />
            <p className="contactHero">{t("contactHero")}</p>
            <div className="contactGrid">
                {contacts.map((contact) => (
                    <a
                        className={`contactCard${contact.wide ? " isWide" : ""}`}
                        key={contact.value}
                        href={contact.href}
                        target={contact.external ? "_blank" : undefined}
                        rel={contact.external ? "noopener noreferrer" : undefined}
                    >
                        <span className="infoIcon"><Icon name={contact.icon} /></span>
                        <span>
                            <span className="contactLabel">{tx(contact.label)}</span>
                            <strong>{contact.value}</strong>
                        </span>
                    </a>
                ))}
                <a className="contactCard" href={cvSrc} download>
                    <span className="infoIcon"><Icon name="download" /></span>
                    <span>
                        <span className="contactLabel">{t("resume")}</span>
                        <strong>{t("downloadCv")}</strong>
                    </span>
                </a>
            </div>
        </>
    )
}

function Certificates() {
    const { t } = useApp()
    return (
        <>
            <Link className="backLink" to="/">
                <Icon name="arrow_back" />
                {t("backToPortfolio")}
            </Link>
            <SectionTitle index={t("sectionExtra")} title={t("sectionCertificates")} />

            {minorCertificates.length === 0 ? (
                <p className="emptyState">{t("emptyCertificates")}</p>
            ) : (
                <ul className="cardGrid">
                    {minorCertificates.map((cert) => (
                        <li key={cert.match}>
                            <InfoCard
                                icon="verified"
                                title={cert.title}
                                certificate={{ src: assetFor(cert.match) }}
                            >
                                <p>{cert.issuer}</p>
                            </InfoCard>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}