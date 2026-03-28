
import { Category, Laptop, Testimonial } from './types';

export const WHATSAPP_NUMBER = "2347065354260";
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/.../viewform";

// Reliable Unsplash IDs for laptops
const getImg = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1000`;

export const LAPTOPS: Laptop[] = [
  {
    id: 's1', name: 'HP EliteBook 840 G3', brand: 'HP', specs: '8GB RAM 256GB SSD', price: 185000, originalPrice: 225000,
    category: Category.STUDENT, condition: 'UK-Used', isBestForSchool: true,
    image: getImg('1496181133206-80ce9b88a853'),
    moreImages: [
      getImg('1588872498964-646eef88f12d'),
      getImg('1517336713381-e252309873a0'),
      getImg('1496181133206-80ce9b88a853'),
      getImg('1525547710557-7aa86881f74a')
    ],
    description: "The HP EliteBook 840 G3 is a thin and light laptop that is perfect for students and mobile professionals. It features a robust magnesium-reinforced chassis and a spill-resistant keyboard, making it ideal for the daily commute or university lecture halls.",
    detailedSpecs: [
      'Intel Core i5-6300U @ 2.4GHz',
      '8GB DDR4 RAM (Upgradable)',
      '256GB Solid State Drive (SSD)',
      '14-inch Full HD Anti-glare Display',
      'Bang & Olufsen Dual Speakers',
      'Windows 10/11 Pro Pre-installed',
      'Tested 3-4 Hours Battery Backup'
    ]
  },
  {
    id: 's2', name: 'Dell Latitude 5480', brand: 'Dell', specs: '8GB RAM 256GB SSD', price: 195000, originalPrice: 240000,
    category: Category.STUDENT, condition: 'UK-Used', isBestForSchool: true,
    image: getImg('1525547710557-7aa86881f74a'),
    moreImages: [
      getImg('1544006659-f0b21884cb1d'),
      getImg('1593642828139-f122ec76902c'),
      getImg('1499951360447-b19be8fe80f5'),
      getImg('1453928582365-b6ad33cbcf64')
    ],
    description: "Rugged, reliable, and powerful. The Dell Latitude 5480 is a workhorse designed for longevity. With a durable hinge and a chassis that meets military-grade testing, it handles the Nigerian environment with ease.",
    detailedSpecs: [
      'Intel Core i5-7200U 7th Generation',
      '8GB High-speed RAM',
      '256GB Fast SSD Storage',
      '14.1-inch Crystal Clear Display',
      'Full HDMI, VGA, and USB-C Ports',
      'Precision Touchpad',
      'Original Dell Charger Included'
    ]
  },
  {
    id: 's3', name: 'HP EliteBook 820 G3', brand: 'HP', specs: '8GB RAM 256GB SSD', price: 175000, originalPrice: 210000,
    category: Category.STUDENT, condition: 'UK-Used', isBestForSchool: true,
    image: getImg('1588872498964-646eef88f12d'),
    moreImages: [
      getImg('1496181133206-80ce9b88a853'),
      getImg('1517336713381-e252309873a0')
    ],
    description: "Compact and powerful. The 820 G3 is the 12.5-inch version of the EliteBook series, perfect for students who need something extremely portable for campus.",
    detailedSpecs: [
      'Intel Core i5-6200U',
      '8GB RAM',
      '256GB SSD',
      '12.5-inch HD Display',
      'Backlit Keyboard',
      'Lightweight Magnesium Chassis'
    ]
  },
  {
    id: 'b1', name: 'HP EliteBook 840 G5', brand: 'HP', specs: '8GB RAM 256GB SSD', price: 280000, originalPrice: 350000,
    category: Category.BUSINESS, condition: 'UK-Used',
    image: getImg('1541807084-5c52b6b3adef'),
    moreImages: [
      getImg('1588872498964-646eef88f12d'),
      getImg('1611078480385-8475a7521c71'),
      getImg('1517336713381-e252309873a0'),
      getImg('1496181133206-80ce9b88a853')
    ],
    description: "A premium business ultrabook with an all-aluminum design. The G5 is sleeker, faster, and more stylish than its predecessors. It features a privacy camera shutter and high-fidelity sound for professional video calls.",
    detailedSpecs: [
      'Intel Core i5-8250U Quad-Core (8th Gen)',
      'Premium Silver Aluminum Unibody',
      'Face Recognition Login (IR Camera)',
      '14" IPS Full HD Wide Viewing Angle',
      'Backlit Keyboard for night work',
      'Ultra-fast USB-C Thunderbolt support',
      'Excellent 4-5 hours battery health'
    ]
  },
  {
    id: 'b2', name: 'Dell Latitude 7490', brand: 'Dell', specs: '16GB RAM 256GB SSD', price: 310000, originalPrice: 380000,
    category: Category.BUSINESS, condition: 'UK-Used',
    image: getImg('1499951360447-b19be8fe80f5'),
    moreImages: [
      getImg('1525547710557-7aa86881f74a'),
      getImg('1544006659-f0b21884cb1d')
    ],
    description: "The Latitude 7000 series is Dell's highest-end business line. The 7490 features a carbon fiber lid and a stunning display, built for professionals who demand the best.",
    detailedSpecs: [
      'Intel Core i7-8650U vPro',
      '16GB DDR4 RAM',
      '256GB NVMe SSD',
      '14-inch Full HD IPS',
      'Carbon Fiber Reinforced Chassis',
      'Excellent Port Selection'
    ]
  },
  {
    id: 'p1', name: 'ThinkPad T480 (Dev Edition)', brand: 'Lenovo', specs: '16GB RAM 512GB SSD', price: 360000, originalPrice: 450000,
    category: Category.PROGRAMMING, condition: 'UK-Used',
    image: getImg('1611078480385-8475a7521c71'),
    moreImages: [
      getImg('1525547710557-7aa86881f74a'),
      getImg('1603302576837-37561b2e2302'),
      getImg('1453928582365-b6ad33cbcf64'),
      getImg('1544006659-f0b21884cb1d')
    ],
    description: "The ultimate machine for software developers and data scientists. With 16GB of RAM, this ThinkPad T480 handles virtual machines, Docker containers, and complex IDEs without breaking a sweat.",
    detailedSpecs: [
      'Intel Core i5-8350U (8th Gen) vPro',
      '16GB Dual Channel RAM',
      '512GB NVMe PCIe Ultra-Fast SSD',
      'Dual Battery Bridge Technology',
      'Legendary Spill-resistant Keyboard',
      'Multiple Ports: RJ45, USB-C, HDMI',
      'Tough Military-Grade Durability'
    ]
  },
  {
    id: 'p2', name: 'ThinkPad X1 Carbon G6', brand: 'Lenovo', specs: '16GB RAM 512GB SSD', price: 420000, originalPrice: 550000,
    category: Category.PROGRAMMING, condition: 'UK-Used',
    image: getImg('1603302576837-37561b2e2302'),
    moreImages: [
      getImg('1611078480385-8475a7521c71'),
      getImg('1453928582365-b6ad33cbcf64')
    ],
    description: "The gold standard for ultra-portable professional laptops. Weighing just 1.1kg, the X1 Carbon Gen 6 is incredibly light yet powerful enough for full-stack development.",
    detailedSpecs: [
      'Intel Core i7-8650U vPro',
      '16GB RAM',
      '512GB NVMe SSD',
      '14-inch WQHD HDR Display',
      'Carbon Fiber Construction',
      'Legendary Keyboard Experience'
    ]
  },
  {
    id: 'g1', name: 'Dell G3 15 Gaming', brand: 'Dell', specs: '16GB RAM GTX 1650', price: 650000, originalPrice: 750000,
    category: Category.GAMING, condition: 'UK-Used',
    image: getImg('1593642702821-c8da6a599684'),
    moreImages: [
      getImg('1593642828139-f122ec76902c'),
      getImg('1517336713381-e252309873a0'),
      getImg('1496181133206-80ce9b88a853'),
      getImg('1544006659-f0b21884cb1d')
    ],
    description: "A high-performance gaming laptop that doesn't scream 'gamer'. The Dell G3 is perfect for both intense gaming sessions and professional 3D rendering or video editing work in Nigeria.",
    detailedSpecs: [
      'Intel Core i7-9750H Hexa-Core',
      'Nvidia GTX 1650 4GB Dedicated Graphics',
      '16GB DDR4 2666MHz RAM',
      '15.6-inch 144Hz Smooth Gaming Display',
      'Dual Fan Cooling System',
      'Game Shift Dynamic Performance Mode',
      'Blue Backlit Keyboard'
    ]
  },
  {
    id: 'g2', name: 'HP Pavilion Gaming 15', brand: 'HP', specs: '16GB RAM GTX 1650 Ti', price: 680000, originalPrice: 780000,
    category: Category.GAMING, condition: 'UK-Used',
    image: getImg('1544006659-f0b21884cb1d'),
    moreImages: [
      getImg('1593642702821-c8da6a599684'),
      getImg('1593642828139-f122ec76902c')
    ],
    description: "Experience high-grade graphics and processing power for gaming and multitasking, plus improved thermal cooling for overall performance and stability.",
    detailedSpecs: [
      'Intel Core i5-10300H',
      '16GB DDR4 RAM',
      'Nvidia GTX 1650 Ti 4GB',
      '512GB SSD + 1TB HDD',
      'Acid Green Backlit Keyboard',
      '15.6-inch Full HD IPS'
    ]
  },
  {
    id: 'pr1', name: 'MacBook Pro 16 M1', brand: 'Apple', specs: '16GB RAM 512GB SSD', price: 1250000, originalPrice: 1450000,
    category: Category.PREMIUM, condition: 'UK-Used',
    image: getImg('1517336713381-e252309873a0'),
    moreImages: [
      getImg('1517336713381-e252309873a0'),
      getImg('1588872498964-646eef88f12d'),
      getImg('1496181133206-80ce9b88a853'),
      getImg('1525547710557-7aa86881f74a')
    ],
    description: "The peak of laptop performance. The M1 Pro chip delivers incredible speed and battery life. Perfect for creative professionals and high-end users.",
    detailedSpecs: [
      'Apple M1 Pro Chip',
      '16GB Unified Memory',
      '512GB Super-fast SSD',
      '16.2-inch Liquid Retina XDR Display',
      'Six-speaker Sound System',
      'MagSafe 3 Charging',
      'Up to 21 Hours Battery Life'
    ]
  },
  {
    id: 'pr2', name: 'Dell XPS 15 9500', brand: 'Dell', specs: '32GB RAM 1TB SSD', price: 950000, originalPrice: 1150000,
    category: Category.PREMIUM, condition: 'UK-Used',
    image: getImg('1453928582365-b6ad33cbcf64'),
    moreImages: [
      getImg('1593642828139-f122ec76902c'),
      getImg('1499951360447-b19be8fe80f5')
    ],
    description: "The world's smallest 15.6-inch performance class laptop. Features a stunning 4-sided InfinityEdge display and 10th Gen Intel Core processors.",
    detailedSpecs: [
      'Intel Core i7-10750H',
      '32GB DDR4 RAM',
      '1TB NVMe SSD',
      '15.6" 4K UHD+ Touch Display',
      'Nvidia GTX 1650 Ti',
      'CNC Machined Aluminum'
    ]
  },
  {
    id: 'bu1', name: 'Lenovo IdeaPad 3', brand: 'Lenovo', specs: '4GB RAM 128GB SSD', price: 145000, originalPrice: 175000,
    category: Category.BUDGET, condition: 'UK-Used',
    image: getImg('1588872498964-646eef88f12d'),
    moreImages: [
      getImg('1588872498964-646eef88f12d'),
      getImg('1525547710557-7aa86881f74a'),
      getImg('1496181133206-80ce9b88a853'),
      getImg('1517336713381-e252309873a0')
    ],
    description: "An affordable entry-level laptop for basic tasks like web browsing, document editing, and online classes. Great value for money.",
    detailedSpecs: [
      'Intel Celeron N4020',
      '4GB DDR4 RAM',
      '128GB SSD Storage',
      '14-inch HD Display',
      'Lightweight Design',
      'Windows 10 Home S Mode',
      'Reliable Daily Performance'
    ]
  },
  {
    id: 'bu2', name: 'Acer Aspire 3', brand: 'Acer', specs: '8GB RAM 256GB SSD', price: 165000, originalPrice: 195000,
    category: Category.BUDGET, condition: 'UK-Used',
    image: getImg('1496171367470-9ed9a9179d14'),
    moreImages: [
      getImg('1504707748692-419802cf939d'),
      getImg('1496181133206-80ce9b88a853')
    ],
    description: "A solid budget laptop with a full-sized keyboard and decent performance for everyday use.",
    detailedSpecs: [
      'AMD Ryzen 3 3250U',
      '8GB RAM',
      '256GB SSD',
      '15.6-inch Full HD',
      'Precision Touchpad',
      'Narrow Bezel Design'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Tunde Adebayo', location: 'Lagos', text: 'Yustech Logic System delivered my HP EliteBook within 24 hours. The condition was exactly as described. Clean UK-used machine!', rating: 5 },
  { id: '2', name: 'Chioma Okeke', location: 'Abuja', text: 'Bought a ThinkPad for my coding bootcamp. Reliable service and the price was the best I found in Nigeria. No issues.', rating: 5 },
  { id: '3', name: 'Musa Ibrahim', location: 'Port Harcourt', text: 'Was worried about delivery but the packaging was very secure. Laptop arrived in perfect state. Highly trust Yustech.', rating: 5 },
  { id: '4', name: 'Adaeze Nwankwo', location: 'Enugu', text: 'I ordered the Dell Latitude 7490 for my office work. The 16GB RAM handles everything I throw at it. Battery still lasts 4+ hours. Amazing value!', rating: 5 },
  { id: '5', name: 'Femi Ogunlade', location: 'Ibadan', text: 'Third laptop I am buying from Yustech. My whole family now uses their laptops. The student deals are unbeatable in Nigeria.', rating: 5 },
  { id: '6', name: 'Hauwa Bello', location: 'Kaduna', text: 'The Smart Finder recommended the perfect laptop for my daughter. She uses it for school and it runs smoothly. Great customer service too.', rating: 4 },
  { id: '7', name: 'Emeka Obi', location: 'Benin City', text: 'I compared prices across Computer Village and online. Yustech gave me the best deal on the MacBook Pro. Genuine product, no stories.', rating: 5 },
  { id: '8', name: 'Blessing Adekunle', location: 'Osogbo', text: 'Walked into their branch and tested the laptop before paying. Transparent and honest business. Will definitely come back!', rating: 5 },
  { id: '9', name: 'Yusuf Abubakar', location: 'Kano', text: 'They shipped my gaming laptop all the way to Kano safely. The Dell G3 runs GTA and FIFA perfectly. Worth every naira!', rating: 5 },
];

export interface HappyTechie {
  name: string;
  city: string;
  quote: string;
  laptop: string;
  emoji: string;
}

export const HAPPY_TECHIES: HappyTechie[] = [
  { name: 'Segun A.', city: 'Lagos', quote: 'Received my HP EliteBook in perfect condition. Battery lasts all day at the office!', laptop: 'HP EliteBook 840 G5', emoji: '💼' },
  { name: 'Amina B.', city: 'Abuja', quote: 'Ordered for my daughter heading to UNILAG. She loves it for coding and assignments.', laptop: 'Dell Latitude 5480', emoji: '🎓' },
  { name: 'Chidi O.', city: 'Port Harcourt', quote: 'Third purchase from Yustech. This ThinkPad handles Docker and VS Code like a champ.', laptop: 'ThinkPad T480', emoji: '💻' },
  { name: 'Funmi D.', city: 'Ibadan', quote: 'The gaming laptop arrived safely with bubble wrap. FIFA runs at 144fps!', laptop: 'Dell G3 15 Gaming', emoji: '🎮' },
  { name: 'Ibrahim K.', city: 'Kano', quote: 'Was skeptical about ordering online from Lagos. The delivery was faster than expected.', laptop: 'Acer Aspire 3', emoji: '🚀' },
  { name: 'Ngozi E.', city: 'Enugu', quote: 'Beautiful MacBook Pro. My design clients are impressed with the screen quality.', laptop: 'MacBook Pro 16', emoji: '🎨' },
];

export const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`;
};
