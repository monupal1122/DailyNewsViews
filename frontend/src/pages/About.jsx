import React from "react";
import { Layout } from "@/components/layout/Layout";
import {
  Newspaper,
  Users,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import SplitText from "../components/SplitText";
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);
  const elementRef = React.useRef(null);

  // Extract number and suffix (e.g., "500K+" -> { num: 500, suffix: "K+" })
  const match = value.match(/(\d+)(.*)/);
  const target = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : "";

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out quad
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
};
const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Daily News Views</title>
        <meta
          name="description"
          content="Learn about our mission to provide accurate, timely, and impactful news coverage to our global audience."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=2069"
            alt="News background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none animate-fade-in-up">
              Truth. <span className="text-red-600">Impact.</span> Excellence.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed mb-8 animate-fade-in-up-delay-1">
              <SplitText
                text=" We are more than just a news outlet. We are a dedicated team of journalists and creators committed to delivering the stories that shape our world."
                className="text-2xl font-semibold text-center"
                delay={10}
                duration={0.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
                showCallback
              />
            </p>
          </div>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest mb-6">
                <Target className="w-3 h-3" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">
                Redefining Modern Journalism
              </h2>
              <div className="space-y-6 text-zinc-600 text-lg leading-relaxed">
                <p>
                  Founded in 2024, Daily News Views emerged from a simple
                  realization: in an era of information overload, clarity is the
                  ultimate luxury. We've built a platform that filters through
                  the noise to deliver meaningful, accurate, and deeply
                  researched news.
                </p>
                <p>
                  Our commitment to journalistic integrity is unwavering. We
                  believe that a well-informed public is the bedrock of a
                  thriving society, and we take our role in fostering that
                  information seriously.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    "Unbiased reporting from ground zero",
                    "Deep investigative analysis into global trends",
                    "Commitment to diversity of thought and perspective",
                    "Innovative storytelling for the digital age",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-zinc-900 font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000"
                className="rounded-2xl shadow-2xl h-80 w-full object-cover transform translate-y-8"
                alt="Newsroom"
              />
              <img
                src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1000"
                className="rounded-2xl shadow-2xl h-80 w-full object-cover"
                alt="Analytics"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
              The Principles We Live By
            </h2>
            <p className="text-zinc-500 font-medium italic">
              Behind every headline is a set of values that guides our work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Integrity",
                description:
                  "We hold ourselves to the highest ethical standards. If we make a mistake, we own it and fix it immediately.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We believe news is a conversation. We actively listen to and represent the voices of our diverse audience.",
              },
              {
                icon: Newspaper,
                title: "Transparency",
                description:
                  "We are open about our sources, our methods, and the evidence behind every story we publish.",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                  {value.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Numbers */}
      <section className="py-24 bg-red-600 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Daily Readers", val: "500K+" },
              { label: "Countries Served", val: "120+" },
              { label: "Journalists", val: "150+" },
              { label: "Awards Won", val: "25+" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">
                  <AnimatedCounter value={stat.val} />
                </div>
                <div className="text-red-100 font-bold uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-zinc-950 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 md:p-20 text-white">
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">
                Get In Touch
              </h2>
              <p className="text-zinc-400 mb-12 text-lg font-medium leading-relaxed italic">
                We value your feedback, tips, and inquiries. Reach out to our
                team at any time.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Email
                    </div>
                    <div className="font-bold">contact@dailynewsviews.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Call Us
                    </div>
                    <div className="font-bold">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Office
                    </div>
                    <div className="font-bold">
                      Media Square, 42 News Ave, NY
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-red-600 p-12 md:p-20">
              <form className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-red-100">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border-b border-red-400 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-red-300/50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-red-100">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/10 border-b border-red-400 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-red-300/50"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-red-100">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/10 border-b border-red-400 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-red-300/50 resize-none"
                    placeholder="Your inquiry..."
                  ></textarea>
                </div>
                <button className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-red-600 transition-all shadow-xl active:scale-[0.98]">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
