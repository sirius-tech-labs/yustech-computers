
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, ChevronRight, Clock, ArrowRight, GraduationCap, Briefcase, Code, Gamepad2, Shield, Battery, Monitor, Cpu } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    subtitle: string;
    readTime: string;
    icon: React.ReactNode;
    accentColor: string;
    bgColor: string;
    content: {
        intro: string;
        sections: { heading: string; body: string }[];
        conclusion: string;
    };
}

const ARTICLES: Article[] = [
    {
        id: 'best-student-laptops',
        title: 'Best Laptops for Students in Nigeria (2026)',
        subtitle: 'Budget-friendly picks that handle assignments, research, and campus life.',
        readTime: '5 min read',
        icon: <GraduationCap size={28} />,
        accentColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        content: {
            intro: "Choosing the right laptop as a student in Nigeria can feel overwhelming given the sheer number of options available. Whether you're studying medicine at UNILAG, engineering at UI, or business at LASU, you need a laptop that balances performance, portability, and most importantly — affordability. Here's our definitive guide.",
            sections: [
                {
                    heading: 'What to Prioritize as a Student',
                    body: "Battery life is king. You'll be moving between lecture halls, libraries, and hostels — not all of which have reliable power. Look for laptops with at least 4-5 hours of battery life. 8GB RAM is the sweet spot for running Microsoft Office, Chrome tabs, and Zoom simultaneously. An SSD (not HDD) is non-negotiable for speed. Finally, weight matters: anything under 1.8kg is ideal for daily commutes."
                },
                {
                    heading: 'Our Top Picks Under ₦200,000',
                    body: "The HP EliteBook 840 G3 remains our best-seller for students at ₦185,000. It's a workhorse with a full metal chassis that survives the daily grind. The Dell Latitude 5480 at ₦195,000 is a close second, offering a slightly newer processor and military-grade durability. For ultra-portability, the HP EliteBook 820 G3 at ₦175,000 is a compact 12.5-inch option that slips into any backpack."
                },
                {
                    heading: 'UK-Used vs Brand New: What You Need to Know',
                    body: "Grade A+ UK-Used laptops are former corporate machines from banks and enterprises in the UK. They're typically 2-4 years old but have been professionally refurbished and tested. You get premium build quality (aluminum chassis, business-grade keyboards) at 40-60% less than a new consumer laptop. At Yustech, every machine goes through our 10-point quality check before listing."
                }
            ],
            conclusion: "Don't overspend on specs you won't use. A student laptop should last you through your degree — reliable, portable, and affordable. Shop our Student Collection for hand-picked options starting from ₦145,000."
        }
    },
    {
        id: 'buying-uk-used-laptops',
        title: 'What to Look for When Buying UK-Used Laptops',
        subtitle: 'Avoid scams and get the best value. A checklist for smart buyers.',
        readTime: '6 min read',
        icon: <Shield size={28} />,
        accentColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        content: {
            intro: "The UK-Used laptop market in Nigeria is massive, but it's also full of pitfalls. Fake specs, dying batteries, damaged screens sold as 'Grade A' — the horror stories are real. This guide teaches you exactly what to check before you buy, whether from Computer Village or online.",
            sections: [
                {
                    heading: 'The 10-Point Inspection Checklist',
                    body: "1. Screen: Check for dead pixels, backlight bleed, and flickering. Open a white image and inspect every corner. 2. Battery: Ask for the battery cycle count. Under 500 cycles is good. Test it unplugged for at least 15 minutes. 3. Keyboard: Test every single key, especially the spacebar, enter, and shift keys. 4. Trackpad: Test gestures and clicking. 5. Ports: Plug something into EVERY port — USB, HDMI, headphone jack. 6. Hinges: Open and close the laptop multiple times; it should feel firm, not wobbly. 7. Speakers: Play music at max volume. 8. Wi-Fi: Connect to a network and test speed. 9. Hard Drive Health: Use CrystalDiskInfo to check SSD/HDD health. 10. Original Charger: Always insist on the original manufacturer's charger."
                },
                {
                    heading: 'Red Flags to Walk Away From',
                    body: "If the seller refuses to let you test the laptop, walk away. If the price seems too good to be true (a Core i7 for ₦80,000), it's likely a scam or the machine has hidden damage. Watch out for refurbished screens (check for uneven brightness), replaced batteries (check if the serial matches the chassis), and downgraded RAM (verify in BIOS, not just the sticker)."
                },
                {
                    heading: 'Why Buy from a Trusted Retailer',
                    body: "When you buy from Yustech Logic System, every laptop has already passed our 10-point inspection. We provide a realistic description of battery health, cosmetic condition, and included accessories. You get what you pay for — no surprises."
                }
            ],
            conclusion: "Knowledge is power. Use this checklist whether you're buying in Computer Village, Ikeja, or online. And if you want the peace of mind of a pre-tested machine, browse our verified inventory."
        }
    },
    {
        id: 'programming-vs-gaming',
        title: 'Programming vs Gaming Laptops: Which Do You Need?',
        subtitle: "They look similar on paper, but they're built for very different things.",
        readTime: '4 min read',
        icon: <Code size={28} />,
        accentColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        content: {
            intro: "One of the most common questions we get at Yustech is: 'Can I use a gaming laptop for programming?' or 'Will a ThinkPad run games?' The short answer is: it depends. Here's a detailed breakdown to help you decide.",
            sections: [
                {
                    heading: 'The Programming Laptop',
                    body: "Developers need fast multitasking (running VS Code, Docker, Chrome, terminal, databases simultaneously), a great keyboard for all-day typing, long battery life for working in cafes or co-working spaces, and a portable form factor. The Lenovo ThinkPad T480 and X1 Carbon are gold standards. 16GB RAM minimum, a fast NVMe SSD, and that legendary ThinkPad keyboard. You do NOT need a dedicated GPU for web development, mobile dev, or data science (unless you're doing heavy ML training)."
                },
                {
                    heading: 'The Gaming Laptop',
                    body: "Gamers need a powerful dedicated GPU (GTX 1650 or higher), a high-refresh-rate display (144Hz), and robust cooling systems. The Dell G3 15 and HP Pavilion Gaming 15 are excellent value options. These laptops are heavier (2.2-2.5kg), have shorter battery life (2-3 hours), and their fans can get loud — all trade-offs for raw graphical power."
                },
                {
                    heading: 'The Verdict',
                    body: "If you code 80% of the time and game 20%, get a programming laptop — you'll be more productive daily. If you game seriously and also code, the gaming laptop handles both but sacrifices portability and battery. If budget allows, the Dell XPS 15 or MacBook Pro bridges both worlds at a premium price point."
                }
            ],
            conclusion: "The best laptop is the one that fits your primary use case. Don't let a flashy GPU distract you from what you actually need. Explore our Programming and Gaming collections to find the right fit."
        }
    },
    {
        id: 'complete-buying-guide',
        title: 'Complete Laptop Buying Guide for Nigerian Professionals',
        subtitle: 'Everything you need to know before investing in your next work machine.',
        readTime: '7 min read',
        icon: <Briefcase size={28} />,
        accentColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        content: {
            intro: "As a working professional in Nigeria — whether you're in banking, real estate, consulting, or freelancing — your laptop is your most important tool. This guide covers everything from understanding specs to choosing the right brand for your career.",
            sections: [
                {
                    heading: 'Understanding the Specs That Actually Matter',
                    body: "Processor (CPU): Intel Core i5 8th Gen or newer is the baseline for 2024. Anything below will feel sluggish. RAM: 8GB is minimum, 16GB is recommended if you use Excel with large datasets, run virtual meetings, and multitask. Storage: 256GB SSD is the minimum. If you store lots of files locally, go for 512GB. Display: Full HD (1920x1080) is essential. Avoid HD (1366x768) screens in 2024. Build Quality: Aluminum chassis (HP EliteBook, Dell Latitude 7000) lasts longer than plastic consumer laptops."
                },
                {
                    heading: 'Best Brands for Business in Nigeria',
                    body: "HP EliteBook series: The most popular business laptop in Nigeria. Reliable, great keyboards, excellent support. Dell Latitude series: Known for durability and port selection. Corporate favorite. Lenovo ThinkPad: The keyboard king. Best for professionals who type all day. Apple MacBook: Premium option for creatives, designers, and the Apple ecosystem. Each brand has a sweet spot at every price range."
                },
                {
                    heading: 'Budget Planning',
                    body: "₦150k-₦200k: Solid entry-level for basic office work (email, documents, browsing). ₦200k-₦400k: The sweet spot. Gets you 8th Gen processors, 8-16GB RAM, and premium build quality. ₦400k-₦700k: High-performance territory. 16-32GB RAM, latest processors, premium displays. ₦700k+: Ultra-premium. MacBook Pro, Dell XPS, top-tier machines for demanding workloads."
                }
            ],
            conclusion: "Your laptop is an investment in your productivity and career growth. Spend wisely based on your actual needs, not marketing hype. Visit our Business collection for hand-picked professional machines."
        }
    }
];

const Blog: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#f1f1f2] min-h-screen pb-20">
            <Helmet>
                <title>Buying Guides | Yustech Logic System — Laptop Tips Nigeria</title>
                <meta name="description" content="Expert laptop buying guides for Nigerian students and professionals. Learn what specs to look for, compare UK-used vs new, and find the best deals." />
            </Helmet>

            {/* Hero */}
            <section className="bg-white pt-16 pb-12 md:pt-24 md:pb-16 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
                        <BookOpen size={14} /> Expert Guides
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Laptop Buying Guides
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                        Honest, practical advice to help you make the smartest laptop purchase in Nigeria — written by engineers, not marketers.
                    </p>
                </div>
            </section>

            {/* Article Cards Grid */}
            <section className="max-w-6xl mx-auto px-4 -mt-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ARTICLES.map(article => (
                        <a
                            key={article.id}
                            href={`#${article.id}`}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                        >
                            <div className={`${article.bgColor} p-8 flex items-start justify-between`}>
                                <div className={`${article.accentColor}`}>
                                    {article.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                    <Clock size={10} /> {article.readTime}
                                </span>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-brand-primary transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium flex-grow">{article.subtitle}</p>
                                <div className="mt-6 flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Read Guide <ArrowRight size={14} />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Full Articles */}
            {ARTICLES.map(article => (
                <article
                    key={article.id}
                    id={article.id}
                    className="max-w-3xl mx-auto px-4 mb-20 scroll-mt-24"
                >
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        {/* Article Header */}
                        <div className={`${article.bgColor} p-8 md:p-12`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${article.accentColor}`}>{article.icon}</div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                    <Clock size={10} /> {article.readTime}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {article.title}
                            </h2>
                        </div>

                        {/* Article Body */}
                        <div className="p-8 md:p-12 space-y-8">
                            <p className="text-gray-600 text-base leading-relaxed font-medium">
                                {article.content.intro}
                            </p>

                            {article.content.sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center text-sm font-black">{idx + 1}</span>
                                        {section.heading}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed font-medium pl-10">
                                        {section.body}
                                    </p>
                                </div>
                            ))}

                            {/* Conclusion + CTA */}
                            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                                <p className="text-gray-700 text-base leading-relaxed font-bold mb-6">
                                    {article.content.conclusion}
                                </p>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-brand-dark transition-colors shadow-lg"
                                >
                                    Browse Our Collection <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            ))}

            {/* Bottom CTA */}
            <section className="max-w-3xl mx-auto px-4 text-center">
                <div className="bg-brand-dark text-white rounded-[2rem] p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-4">Still Need Help Deciding?</h2>
                        <p className="text-gray-400 mb-8 font-medium max-w-lg mx-auto">
                            Our Smart Finder uses AI to recommend the perfect laptop based on your budget and needs. Try it — it's free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/finder" className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black hover:bg-emerald-500 transition-colors shadow-lg">
                                Try Smart Finder
                            </Link>
                            <Link to="/shop" className="bg-white/10 text-white px-8 py-4 rounded-xl font-black hover:bg-white/20 transition-colors border border-white/10">
                                Browse All Laptops
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
