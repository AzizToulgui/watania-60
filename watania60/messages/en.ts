// English messages. fr.ts and ar.ts must match this shape (enforced by the Messages type).
// Strings may contain <em>…</em> and <br/>, rendered by `rich()` in lib/i18n.tsx.
const en = {
  meta: {
    title: "Watania 60 — From Memory to the Future",
    description:
      "Sixty years of Tunisian television, reimagined with AI. Search scenes by memory, rediscover restored classics, and share them across generations.",
  },
  header: {
    brand: "Watania",
    home: "Watania 60, back to top",
    onAir: "On air since 1966",
    language: "Language",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  intro: { skip: "Skip", signal: "CH 01 · Signal" },
  hero: {
    label: "Watania archive",
    words: ["From", "Memory", "to", "the", "Future"],
    italic: 4,
    breakAfter: 1,
    alt: "من الذاكرة إلى المستقبل",
    channel: "CH 01 — Archive 1966/2026",
    intro:
      "Sixty years of Tunisian television, searchable by memory, restored with care, and ready to be shared again. The originals are always preserved.",
    enter: "Enter the archive",
    film: "Watch the film",
    counter: "15 / 4,200+ hours",
    cue: "Drag to rotate · Scroll to enter",
  },
  grid: {
    kicker: "The archive · 1966 — 2026",
    title: "Fifteen moments, <em>sixty years</em>",
    alt: "الأرشيف",
    toggle: "Toggle grid view",
  },
  lightbox: {
    close: "Close",
    version: "Version",
    original: "Original",
    restored: "Restored",
    restoredSuffix: ", restored",
    restore: "Restore this scene",
    ask: "Ask the companion",
  },
  menu: {
    nav: "Main",
    links: {
      archive: "The Archive",
      search: "Search by Memory",
      restoration: "Restoration",
      studio: "Creator Studio",
      together: "Watch Together",
      about: "About",
    },
    alt: {
      archive: "الأرشيف",
      search: "البحث بالذاكرة",
      restoration: "الترميم",
      studio: "استوديو المبدعين",
      together: "نشاهد معاً",
      about: "عن المشروع",
    },
    city: "Tunis · Since 1966",
  },
  search: {
    chapter: "01 / Search by memory",
    title: "Describe it. <em>We’ll find the scene.</em>",
    alt: "صِف الذكرى، ونجد لك المشهد",
    lead: "No titles, no dates needed. Describe what you remember — a voice, a song, a kitchen, a summer evening — and Watania 60 finds the moment in six decades of footage.",
    label: "Describe a memory",
    placeholder: "Describe a memory…",
    submit: "Search",
    memories: [
      "the grandmother laughing at a Ramadan family table",
      "musicians playing under Roman columns at night",
      "the national team celebrating at the World Cup",
    ],
  },
  restoration: {
    chapter: "02 / Restoration",
    title: "Restored. <em>Never replaced.</em>",
    alt: "نُرمّم دون أن نُلغي الأصل",
    lead: "AI restoration cleans damage, colorizes black-and-white footage and lifts old broadcasts to today’s screens. Drag the line to compare. The original is kept, untouched, beside every restored version.",
    original: "Original · 1968 · 576i",
    restored: "Restored · AI colorized · 4K",
    altBefore: "The fishing harbor, original 1968 black-and-white footage",
    altAfter: "The fishing harbor, restored and colorized",
    slider: "Compare original and restored",
    stats: [
      { t: "Restoration", d: "Scratches, dropouts and tape noise removed frame by frame." },
      { t: "Colorization", d: "Period-aware color, reviewed by archivists before release." },
      { t: "Upscaling", d: "Standard-definition masters lifted to 4K without losing grain." },
    ],
    kept: "The original version is always one tap away.",
  },
  companion: {
    chapter: "03 / AI companion",
    title: "Ask the archive <em>anything.</em>",
    alt: "اسأل الأرشيف",
    lead: "Programs, actors, characters, the year a song first aired, the story behind a broadcast. The companion answers in Arabic, French or English, and always points back to the footage it learned from.",
    name: "Companion",
    footer: "Ask about a program, an actor, a year…",
    typing: "Companion is typing",
    source: "Source:",
    // Scripted placeholder exchanges. `lang` marks a message in another language.
    script: [
      { from: "user", text: "Who played the father in that 1990s family series?" },
      {
        from: "ai",
        text: "That role was played by [Actor name], who appeared in four seasons between 1992 and 1996.",
        source: "Archive · 1993 · EP 07",
        link: "Watch his first scene",
      },
      { from: "user", text: "Why was this program so popular?" },
      {
        from: "ai",
        text: "It aired after iftar, when whole families watched together, and its characters spoke the way people really spoke at home.",
        source: "Archive · 1987 · EP 03",
      },
      { from: "user", text: "متى بُثّت أول نشرة أخبار ملونة؟", lang: "ar" },
      {
        from: "ai",
        text: "بُثّت أول نشرة أخبار بالألوان في [السنة]. يمكنك مشاهدة مقتطف منها في الأرشيف.",
        lang: "ar",
        source: "Archive · [year] · News",
      },
    ] as Message[],
  },
  subtitles: {
    chapter: "04 / Subtitles & translation",
    title: "Every voice, <em>in every language.</em>",
    alt: "كل صوت، بكل لغة",
    lead: "Automatic subtitles for every episode, in Tunisian Arabic, French and English, so a grandmother’s favorite series reaches a grandchild abroad.",
    auto: "Auto",
    group: "Subtitle language",
    live: "● Live subtitles",
  },
  studio: {
    chapter: "05 / Creator Studio",
    title: "Turn a scene <em>into a story.</em>",
    alt: "حوّل المشهد إلى قصة",
    lead: "Pick a moment and Creator Studio does the rest: it reframes it for vertical screens, writes the captions and finds the highlights, ready to share in seconds.",
    crop: "Smart crop · tracking subject",
    ready: "Ready to share",
    phoneAlt: "A finished vertical clip with Arabic captions, ready to share",
    highlight: "Highlight",
    features: [
      { t: "Smart crop", d: "Follows faces and action from 16:9 to 9:16." },
      { t: "Auto captions", d: "Burned-in, in the language you choose." },
      { t: "Highlights", d: "The strongest seconds, found for you." },
    ],
    cta: "Open Creator Studio",
  },
  together: {
    chapter: "06 / Watch together",
    title: "Watch it again. <em>Together.</em>",
    alt: "نشاهدها معاً من جديد",
    lead: "Watch parties across cities and generations, in sync. Shared playlists let a family build its own archive of the evenings it remembers.",
    party: "Watch party · 5 watching",
    playlist: "Sunday evenings",
    playlistMeta: "Shared · 4 titles · 2:59:27",
    addedBy: ["Added by Sami’s grandmother", "Added by Leila", "Added by Youssef", "Added by Ines"],
  },
  timeline: {
    chapter: "07 / Sixty years",
    title: "Sixty years <em>on one line.</em>",
    alt: "ستون عاماً على خط واحد",
    // Placeholder milestones — replace with verified history.
    stops: [
      "The first broadcast. A single channel, in black and white.",
      "A decade of variety evenings and the first great series.",
      "Color reaches every home; Ramadan evenings become a ritual.",
      "Satellite carries the signal to Tunisians abroad.",
      "A new generation of drama, and a new generation watching.",
      "Fifty years on air, and the archive begins to be digitized.",
      "Today — the archive becomes intelligent.",
    ],
  },
  cta: {
    line1: "Sixty years of memory.",
    line2: "Ready when you are.",
    alt: "ستون عاماً من الذاكرة، في انتظارك",
    logoAlt: "Watania 60",
    label: "Email address",
    placeholder: "your@email.com",
    submit: "Request early access",
    done: "You’re on the list",
  },
  footer: {
    tagline: "Watania 60 — From Memory to the Future",
    alt: "من الذاكرة إلى المستقبل",
    links: {
      archive: "Archive",
      restoration: "Restoration",
      studio: "Creator Studio",
      together: "Watch Parties",
      about: "About",
    },
    rights: "© 2026 Établissement de la Télévision Tunisienne",
    end: "CH 01 · End of transmission",
  },
  archive: {
    "first-broadcast": {
      program: "The First Broadcast",
      genre: "RTT · News",
      note: "The first evening of Tunisian television: one desk, one microphone, one camera.",
    },
    "harbor-original": {
      program: "The Fishing Harbor",
      genre: "Documentary",
      note: "Everyday life at a fishing port, filmed for the archive in 1968.",
    },
    carthage: {
      program: "Carthage Nights",
      genre: "Concert",
      note: "Musicians under the Roman columns, broadcast live from the ruins.",
    },
    malouf: {
      program: "A Night of Malouf",
      genre: "Concert",
      note: "An orchestra, a singer and a full amphitheater.",
    },
    "world-cup": {
      program: "Tunisia at the World Cup",
      genre: "Sports",
      note: "The national team celebrating, watched by the whole country at once.",
    },
    oasis: {
      program: "Oasis Development",
      genre: "Documentary",
      note: "Farmers and engineers in the south, talking about water and palms.",
    },
    "ommi-traki": {
      program: "Ommi Traki",
      genre: "Comedy",
      note: "A comedy duo whose lines families still repeat.",
    },
    sitcom: {
      program: "Living-Room Laughs",
      genre: "Sitcom",
      note: "A studio sitcom from the VTR era.",
    },
    "ramadan-table": {
      program: "At the Ramadan Table",
      genre: "Ramadan series",
      note: "Three generations around one table after iftar.",
    },
    "choufli-hal": {
      program: "Choufli Hal",
      genre: "Sitcom",
      note: "The sitcom an entire generation quotes from memory.",
    },
    "warda-wa-bab": {
      program: "Warda wa Bab",
      genre: "Drama",
      note: "Tea in a courtyard of blue tiles and old arches.",
    },
    "el-douar": {
      program: "El Douar",
      genre: "Drama",
      note: "A village at night and an argument no one will forget.",
    },
    "khatem-el-yasmine": {
      program: "Khatem El Yasmine",
      genre: "Ramadan drama",
      note: "A family story told under a canopy of jasmine.",
    },
    "comedy-night": {
      program: "Comedy Night",
      genre: "Talk show",
      note: "Stand-up and laughter, clipped and shared the same evening.",
    },
    "harbor-restored": {
      program: "The Fishing Harbor, Restored",
      genre: "AI restoration",
      note: "The 1968 harbor, restored and colorized. The original stays in the archive beside it.",
    },
  },
};

export type Message = {
  from: "user" | "ai";
  text: string;
  lang?: "ar" | "fr" | "en";
  source?: string;
  link?: string;
};

export type Messages = typeof en;
export default en;
