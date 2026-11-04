export interface CircuitMemory {
  id: string;
  url: string;
  caption: string;
}

export interface CircuitLocation {
  id: string;
  name: string;
  deity?: string;
  state: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  visitedDate?: string;
  notes?: string;
  memories?: CircuitMemory[];
}

export interface PilgrimageCircuit {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImage: string;
  accent: "saffron" | "forest" | "sky" | "plum" | "gold";
  locations: CircuitLocation[];
}

export const INITIAL_CIRCUITS: PilgrimageCircuit[] = [
  {
    id: "12-jyotirlingas",
    name: "12 Jyotirlingas",
    slug: "jyotirlingas",
    subtitle: "Sacred Manifestations of Lord Shiva across India",
    description: "The 12 Jyotirlinga shrines are considered the most revered abodes of Lord Shiva, radiating infinite divine light and spiritual power.",
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80",
    accent: "saffron",
    locations: [
      {
        id: "somnath",
        name: "Somnath",
        deity: "Lord Shiva",
        state: "Gujarat",
        description: "The first among the twelve Jyotirlingas, situated on the western coast of Gujarat overlooking the Arabian Sea.",
        imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "mallikarjuna",
        name: "Mallikarjuna (Srisailam)",
        deity: "Lord Shiva & Goddess Bhramaramba",
        state: "Andhra Pradesh",
        description: "Perched on the Nallamala hills along Krishna river, uniquely revered as both a Jyotirlinga and Shakti Peetha.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "mahakaleshwar",
        name: "Mahakaleshwar",
        deity: "Lord Shiva (Dakshinamoorthi)",
        state: "Madhya Pradesh (Ujjain)",
        description: "Famous for the Bhasma Aarti, it is the only south-facing (Dakshinamoorthi) Jyotirlinga on the banks of Shipra.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "omkareshwar",
        name: "Omkareshwar",
        deity: "Lord Shiva",
        state: "Madhya Pradesh",
        description: "Located on Mandhata island in the Narmada river, shaped naturally in the sacred symbol 'ॐ'.",
        imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "kedarnath-jyotirlinga",
        name: "Kedarnath",
        deity: "Lord Shiva",
        state: "Uttarakhand",
        description: "High in the Garhwal Himalayas near Mandakini river, the highest and most remote of all Jyotirlingas.",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "bhimashankar",
        name: "Bhimashankar",
        deity: "Lord Shiva",
        state: "Maharashtra",
        description: "Nestled in the Sahyadri ranges near Pune, surrounded by lush evergreen forests and the source of river Bhima.",
        imageUrl: "https://images.unsplash.com/photo-1596405344246-b329d138feb2?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "kashi-vishwanath",
        name: "Kashi Vishwanath",
        deity: "Lord Shiva",
        state: "Uttar Pradesh (Varanasi)",
        description: "Standing on the holy western bank of the sacred Ganges in Varanasi, one of the oldest living cities in the world.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "trimbakeshwar",
        name: "Trimbakeshwar",
        deity: "Lord Shiva (Three Faces: Brahma, Vishnu, Rudra)",
        state: "Maharashtra (Nashik)",
        description: "Located at the origin of holy river Godavari in Brahmagiri mountain with unique three-faced lingam.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "baidyanath",
        name: "Baidyanath (Deoghar)",
        deity: "Lord Shiva (The Divine Healer)",
        state: "Jharkhand",
        description: "Also known as Baba Baidyanath Dham, where Shiva is worshipped as the supreme physician who cured Ravana.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "nageshwar",
        name: "Nageshwar",
        deity: "Lord Shiva (Lord of Serpents)",
        state: "Gujarat (Dwarka)",
        description: "Situated near Dwarka, representing the protection from all poisons and evils in the universe.",
        imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "rameshwaram-jyotirlinga",
        name: "Ramanathaswamy (Rameshwaram)",
        deity: "Lord Shiva",
        state: "Tamil Nadu",
        description: "Consecrated by Lord Rama on the southern tip of India before crossing over to Lanka, renowned for its pillared corridors.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "grishneshwar",
        name: "Grishneshwar",
        deity: "Lord Shiva",
        state: "Maharashtra (Ellora)",
        description: "Located right next to the historic Ellora Caves, renowned as the twelfth and final Jyotirlinga in traditional scriptures.",
        imageUrl: "https://images.unsplash.com/photo-1596405344246-b329d138feb2?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
    ],
  },
  {
    id: "panch-kedar",
    name: "Panch Kedar",
    slug: "panch-kedar",
    subtitle: "The Five Sacred Shiva Temples of Garhwal Himalayas",
    description: "The holy circuit established by the Pandavas in Uttarakhand, worshipping different body manifestations of Lord Shiva.",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
    accent: "forest",
    locations: [
      {
        id: "pk-kedarnath",
        name: "Kedarnath (Hump)",
        deity: "Lord Shiva",
        state: "Uttarakhand",
        description: "The most prominent of the Panch Kedar, where Lord Shiva appeared in the form of a hump.",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "pk-tungnath",
        name: "Tungnath (Arms)",
        deity: "Lord Shiva",
        state: "Uttarakhand",
        description: "The highest Shiva temple in the world at 3,680m altitude where Shiva's arms (Bahu) appeared.",
        imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "pk-rudranath",
        name: "Rudranath (Face)",
        deity: "Lord Shiva (Neelkanth Mahadeva)",
        state: "Uttarakhand",
        description: "Where the face (Mukh) of Lord Shiva is worshipped inside a natural rock temple surrounded by alpine meadows.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "pk-madhyamaheshwar",
        name: "Madhyamaheshwar (Navel)",
        deity: "Lord Shiva",
        state: "Uttarakhand",
        description: "Set in a scenic valley framed by snow peaks where the navel (Nabhi) and stomach of Shiva are venerated.",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "pk-kalpeshwar",
        name: "Kalpeshwar (Hair Locks)",
        deity: "Lord Shiva (Jata)",
        state: "Uttarakhand",
        description: "The only Panch Kedar accessible year-round through Urgam valley where Shiva's matted hair (Jata) is worshipped.",
        imageUrl: "https://images.unsplash.com/photo-1596405344246-b329d138feb2?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
    ],
  },
  {
    id: "char-dham",
    name: "Char Dham",
    slug: "char-dham",
    subtitle: "The Four Cardinal Abodes of Spiritual Liberation",
    description: "The sacred pilgrimage circuit defined by Adi Shankaracharya marking the four cardinal corners of Bharat.",
    coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=700&q=80",
    accent: "sky",
    locations: [
      {
        id: "cd-badrinath",
        name: "Badrinath (North)",
        deity: "Lord Badri Narayan (Vishnu)",
        state: "Uttarakhand",
        description: "Nestled between Nar and Narayana mountain ranges along the Alaknanda river in the north.",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "cd-dwarka",
        name: "Dwarkadhish (West)",
        deity: "Lord Krishna",
        state: "Gujarat",
        description: "The ancient kingdom of Lord Krishna standing on the western tip of the Saurashtra peninsula.",
        imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "cd-puri",
        name: "Jagannath Puri (East)",
        deity: "Lord Jagannath, Balabhadra & Subhadra",
        state: "Odisha",
        description: "On the eastern coast by the Bay of Bengal, celebrated for the world-renowned Ratha Yatra.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "cd-rameswaram",
        name: "Ramanathaswamy (South)",
        deity: "Lord Shiva",
        state: "Tamil Nadu",
        description: "On Pamban island in the south, uniting Shaivite and Vaishnavite devotion through Lord Rama's prayer.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
    ],
  },
  {
    id: "panch-kailash",
    name: "Panch Kailash",
    slug: "panch-kailash",
    subtitle: "The Five Sacred Himalayan Abodes of Transcendence",
    description: "The five sacred mountain summits symbolizing the cosmic axis and supreme abode of Lord Shiva.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
    accent: "plum",
    locations: [
      {
        id: "kailash-mansarovar",
        name: "Mount Kailash & Lake Mansarovar",
        deity: "Lord Shiva & Goddess Parvati",
        state: "Tibet Autonomous Region",
        description: "The ultimate spiritual pilgrimage and the celestial axis mundi revered by four major world traditions.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "adi-kailash",
        name: "Adi Kailash (Chhota Kailash)",
        deity: "Lord Shiva",
        state: "Uttarakhand (Pithoragarh)",
        description: "Located in the serene Kumaon Himalayas near the sacred Parvati Sarovar and Om Parvat.",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "kinnaur-kailash",
        name: "Kinnaur Kailash",
        deity: "Lord Shiva",
        state: "Himachal Pradesh (Kinnaur)",
        description: "Famous for the natural 79-foot vertical rock monolith pillar that changes colors throughout the day.",
        imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "shrikhand-mahadev",
        name: "Shrikhand Mahadev",
        deity: "Lord Shiva",
        state: "Himachal Pradesh (Kullu)",
        description: "A 75-foot natural Shivling perched atop high alpine ridges, known as one of the most arduous pilgrimages.",
        imageUrl: "https://images.unsplash.com/photo-1596405344246-b329d138feb2?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
      {
        id: "manimahesh-kailash",
        name: "Manimahesh Kailash",
        deity: "Lord Shiva",
        state: "Himachal Pradesh (Chamba)",
        description: "A high-altitude glacial lake at the foot of Manimahesh peak, illuminated during dawn with divine shimmer.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: false,
      },
    ],
  },
  {
    id: "tirumala",
    name: "Tirumala (Tirupati)",
    slug: "tirumala",
    subtitle: "The Abode of Lord Sri Venkateswara",
    description: "The sacred Seven Hills of Tirumala in the Seshachalam range, dedicated to Lord Venkateswara (Balaji).",
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80",
    accent: "gold",
    locations: [
      {
        id: "tirumala-temple",
        name: "Sri Venkateswara Swamy Temple",
        deity: "Lord Venkateswara (Govinda)",
        state: "Andhra Pradesh (Tirupati)",
        description: "The sanctum sanctorum of Lord Srinivasa atop the sacred Venkatadri hill. Visited as the foundation of Raj's sacred journey.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        visited: true,
        visitedDate: "6 July 2026",
        notes: "A peaceful beginning. The path is open and filled with grace.",
      },
    ],
  },
];
