
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code, BrainCog, Rocket, GithubIcon, Check, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation configs
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const staggeredContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Pricing plans (for Pricing and this page)
const plans = [
  {
    name: "Free",
    description: "For personal projects and exploration",
    price: "$0",
    period: "forever",
    features: [
      "1 repository analysis per month",
      "Basic code structure visualization",
      "Limited documentation generation",
      "Community support"
    ],
    buttonText: "Start Free",
    highlight: false,
    productId: ""
  },
  {
    name: "Premium",
    description: "For professional developers",
    price: "$19.99",
    period: "per month",
    features: [
      "7 repository analyses per month",
      "Advanced visualization tools",
      "Full documentation generation",
      "Critical path analysis",
      "Priority support"
    ],
    buttonText: "Get Premium",
    highlight: true,
    productId: "16c1bcc2-bac7-4444-85e8-e0872f90e224"
  },
  {
    name: "Unlimited",
    description: "For teams and organizations",
    price: "$99.99",
    period: "per month",
    features: [
      "30 repository analyses per month",
      "Team collaboration features",
      "Custom onboarding workflows",
      "Advanced analytics",
      "API access",
      "Dedicated support"
    ],
    buttonText: "Contact Us",
    highlight: false,
    productId: "843c09eb-c979-4946-a9db-5e58baf9b560"
  }
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      {/* Grid lines - uses custom utility in App.css */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg"></div>

      {/* Header with logo */}
      <header className="w-full flex items-center justify-between py-6 px-6 md:px-12 bg-white/80 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center">
          <img src="/logo.png" alt="Onboarding Buddy Logo" className="h-12 w-12 rounded-2xl shadow-lg mr-3 border-2 border-primary/20 bg-white" />
          <span className="text-2xl font-black tracking-tight text-gray-900 select-none">
            Onboarding Buddy
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover-scale text-gray-700/90 hover:text-blue-700 transition">Home</Link>
          <Link to="/pricing" className="hover-scale text-gray-700/90 hover:text-blue-700 transition">Pricing</Link>
          <Link to="/auth" className="hover-scale">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg hover:opacity-90 hover:scale-105 transition-all">
              {user ? "Dashboard" : "Sign In"}
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-white z-10">
        <motion.div
          initial="initial" animate="animate"
          variants={fadeInUp}
          className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-4"
        >
          <div className="max-w-2xl flex-1">
            <Badge className="mb-4 px-3 py-1 text-base rounded-full bg-gradient-to-r from-blue-600 to-purple-400 text-white shadow-lg border-0 animate-fade-in">
              Now with Pro features ✨
            </Badge>
            <h1 className="mb-8 text-5xl font-black tracking-tight leading-[1.13] sm:text-6xl bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Effortless AI<br /><span className="text-gray-900">Codebase Onboarding</span>
            </h1>
            <motion.p
              className="mb-8 text-xl text-blue-800/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              Instantly visualize, document, and master any codebase with interactive AI-powered guidance.
              <span className="block mt-2 text-blue-500/80 text-lg">
                Designed for rapid onboarding and developer productivity.
              </span>
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={staggeredContainer}>
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg text-white px-8 rounded-xl hover:scale-105 transition">
                    Go to Dashboard <ArrowRight size={18} />
                  </Button>
                </Link>
              ) : (
                <>
                <Link to="/auth">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white px-8 rounded-xl hover:scale-105 transition animate-pulse">
                    Try for Free <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="gap-2 border-blue-400 bg-white/10 text-blue-900 hover:bg-blue-50 rounded-xl shadow-md">
                    <GithubIcon className="h-5 w-5" />
                    Sign in with GitHub
                  </Button>
                </Link>
                </>
              )}
            </motion.div>
          </div>
          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="w-full md:w-5/12 flex justify-center"
          >
            <div className="relative animate-fade-in-up">
              {/* Inner card with micro-animation */}
              <div className="absolute -inset-2 bg-gradient-to-tl from-blue-200/60 to-purple-100/40 rounded-3xl blur-[8px] opacity-50"></div>
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-blue-100/50">
                <div className="flex items-center gap-2 text-sm mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-blue-800/70">AI Code Analysis</span>
                </div>
                <div className="space-y-2">
                  <div className="h-7 bg-gradient-to-r from-blue-100 via-violet-100 to-blue-50/70 rounded w-full animate-pulse" />
                  <div className="h-32 bg-gradient-to-br from-purple-100/40 to-blue-200/30 rounded w-full" />
                  <div className="h-8 bg-gradient-to-r from-blue-100 via-violet-50 to-blue-50/60 rounded w-3/5" />
                  <div className="flex gap-3">
                    <div className="h-7 bg-gradient-to-r from-blue-50 via-blue-100/80 to-blue-100/70 rounded w-1/2" />
                    <div className="h-7 bg-gradient-to-r from-purple-100/90 via-indigo-100/90 to-sky-50/70 rounded w-1/2" />
                  </div>
                </div>
              </div>
              {/* Floating grid accent ring */}
              <div className="absolute -z-10 -inset-4 rounded-2xl border-8 border-purple-200/40 border-dashed animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
        <div className="mt-10 flex justify-center">
          <motion.div
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <ChevronDown className="h-8 w-8 text-blue-400/60" />
          </motion.div>
        </div>
        {/* Arcade Interactive Tutorial Embed */}
        <div className="container mx-auto px-4 py-10">
          <h2 className="mb-2 text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">See It in Action</h2>
          <div className="flex w-full justify-center mt-4 mb-8">
            {/* Embedded Arcade Tutorial */}
            <div style={{ position: "relative", paddingBottom: "calc(45.27777777777778% + 41px)", height: 0, width: "100%", maxWidth: "878px" }}>
              <iframe
                src="https://demo.arcade.software/B2XwUmuYzLaasGfuiWnR?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                title="Effortless Codebase Onboarding with Onboarding Buddy"
                frameBorder="0"
                loading="lazy"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  colorScheme: "light"
                }}
                allow="clipboard-write"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (light cards) */}
      <motion.div
        className="container mx-auto px-4 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Repositories Analyzed", value: "10,000+" },
            { label: "Time Saved", value: "1000+ hrs" },
            { label: "Active Users", value: "5,000+" },
            { label: "Code Understanding", value: "3x Faster" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.1 }}
              className="text-center bg-white shadow rounded-2xl py-8 px-6 border border-gray-100"
            >
              <div className="text-3xl font-bold text-blue-700 drop-shadow">{stat.value}</div>
              <div className="text-sm text-blue-800 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Partner logos */}
      <section className="py-16 bg-white/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-blue-800 mb-3">Trusted by engineers from</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-90">
            {["Google", "Meta", "Stripe", "Airbnb", "Microsoft"].map((partner, index) => (
              <div key={index} className="grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="h-10 w-28 bg-gradient-to-br from-blue-50/50 via-purple-100/30 to-blue-100/10 rounded-lg flex items-center justify-center border border-blue-200/30 backdrop-blur-sm">
                  <span className="text-lg text-blue-800 font-semibold">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow bg-gradient-to-r from-blue-500 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Features
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-7 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-blue-800/90 text-lg mb-2">
              Unlock the full potential of your team's engineering velocity.
            </p>
          </motion.div>
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Repository Analysis",
                description: "AI deeply scans your repository, uncovering structure, dependencies, and the critical workflows that matter.",
                icon: <Code className="h-10 w-10 text-blue-500" />
              },
              {
                title: "Interactive Documentation",
                description: "Visual guides, architecture maps, and dependency graphs help you truly understand systems in minutes.",
                icon: <BrainCog className="h-10 w-10 text-fuchsia-500" />
              },
              {
                title: "Accelerated Onboarding",
                description: "Cut onboarding by 70% with stepwise walkthroughs, role-based learning, and personalized AI suggestions.",
                icon: <Rocket className="h-10 w-10 text-green-600" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="bg-white border border-blue-100 rounded-3xl p-10 shadow-xl hover:scale-105 hover:shadow-2xl transition-all"
              >
                <div className="mb-6 rounded-xl bg-blue-50/70 p-4 w-fit">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-800/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 bg-gradient-to-r from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">How It Works</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-7 rounded-full"></div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-14 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold mb-4">Instantly analyze any repository</h3>
              <p className="text-blue-800/90 mb-5">
                Connect GitHub or paste a repo URL. Get actionable insights—AI identifies best practices, technical debt, & critical flows—documented visually.
              </p>
              <ul className="space-y-3 text-blue-900/80">
                {["Critical path maps", "Dependency graphs", "Onboarding walkthroughs", "Architecture visuals"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-1 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-blue-50 border border-blue-100/40">
                <div className="p-6 md:p-10">
                  <div className="space-y-2">
                    <div className="h-5 bg-indigo-200/30 rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-20 bg-violet-100/40 rounded w-full" />
                    <div className="h-4 bg-blue-200/20 rounded w-1/2" />
                    <div className="h-4 bg-blue-200/20 rounded w-11/12" />
                    <div className="h-12 bg-indigo-100/30 rounded w-full mt-4" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl border-dotted border-4 border-blue-100/30"></div>
            </motion.div>
          </div>
          <div className="flex justify-center mt-20">
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-400 to-fuchsia-600 px-10 shadow-xl hover:scale-105 transition">
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Testimonials</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-7 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-blue-800/80 text-lg">
              See how Onboarding Buddy has transformed engineering orgs
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Sarah Chen",
                role: "CTO at DevFlow",
                quote: "Onboarding Buddy cut our new developer ramp-up time in half. The visual repository maps are incredibly helpful.",
                image: null
              },
              {
                name: "Marcus Johnson",
                role: "Software Engineer",
                quote: "As a new developer, the guided walkthroughs helped me understand our complex codebase in days instead of weeks.",
                image: null
              },
              {
                name: "Aisha Patel",
                role: "Lead Developer at TechSprint",
                quote: "The dependency mapping feature alone is worth the subscription. It's like having a senior developer guide you through the code.",
                image: null
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 + index * 0.1 }}
                className="bg-white p-7 rounded-2xl shadow-xl border border-blue-100/40"
              >
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image || ""} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-blue-800/80">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-xl text-blue-800/90">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-100 bg-clip-text text-transparent">
              Pricing
            </h2>
            <div className="w-24 h-1 bg-blue-300 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-blue-900 mb-4">
              Choose the plan that fits your needs. Ramp up your team in days, not weeks.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.06 + index * 0.12 }}
                className={`rounded-3xl shadow-2xl border border-blue-200/60 hover:border-purple-400 bg-gradient-to-tr ${
                  plan.highlight
                    ? 'from-blue-100/60 to-purple-100/60 scale-105 ring-4 ring-blue-100/40 relative'
                    : 'from-blue-50/40 to-purple-50/40'
                } hover:scale-105 transition-all`}
              >
                {plan.highlight && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-400 text-white shadow">Most Popular</Badge>
                  </div>
                )}
                <div className="p-10 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-blue-800/70 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-blue-900/90 mb-7">{plan.description}</p>
                  <ul className="space-y-2 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-blue-900/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing" className="mt-auto">
                    <Button
                      className={`w-full px-8 rounded-lg ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 text-white'
                          : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-tl from-white via-blue-50 to-purple-100 text-blue-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">FAQ</h2>
            <div className="w-24 h-1 bg-blue-300 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-blue-800/80 text-lg mb-2">
              Answers to commonly asked questions
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How does the repository analysis work?",
                  answer: "Our AI scans your repository's code structure, identifies key patterns and dependencies, and generates comprehensive insights about architecture, critical paths, and code organization. This helps developers understand the codebase more quickly and efficiently."
                },
                {
                  question: "Is my code secure when using Onboarding Buddy?",
                  answer: "Yes, we take security very seriously. We use secure OAuth connections with GitHub, and your code is only accessed temporarily during analysis. We don't store your code, only the metadata and insights generated from the analysis."
                },
                {
                  question: "Can I analyze private repositories?",
                  answer: "Yes, our Premium and Unlimited plans allow analysis of private repositories. You'll need to authorize our GitHub integration to access your private repositories securely."
                },
                {
                  question: "How long does an analysis take?",
                  answer: "Most repositories are analyzed within minutes. Larger codebases may take a bit longer, depending on size and complexity, but our system is optimized for quick turnarounds."
                },
                {
                  question: "Can I upgrade or downgrade my plan anytime?",
                  answer: "Yes, you can upgrade or downgrade your subscription at any time. Plan changes take effect at the beginning of your next billing cycle."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-b border-blue-100/40">
                  <AccordionTrigger className="text-left font-medium py-4 text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-blue-800/80 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="text-center mt-16">
            <p className="text-blue-800 mb-4 font-medium">
              Still have questions? We're here to help.
            </p>
            <Button variant="outline" className="gap-2 px-6 py-2 rounded-xl border-blue-400 text-blue-900/90 hover:bg-blue-100 shadow-md transition">
              Contact Support <ArrowUpRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-gradient-to-r from-blue-100 via-purple-100 to-fuchsia-50 p-10 text-center text-blue-900 shadow-2xl border border-blue-100/20 sm:p-16 flex flex-col justify-center items-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl drop-shadow">Ready to understand codebases faster?</h2>
            <p className="mb-8 text-lg">
              Join thousands of developers using Onboarding Buddy for effortless onboarding, reviews, and documentation.
            </p>
            <motion.div whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2 rounded-xl px-10 bg-blue-700 hover:bg-blue-800 text-white border-0">
                    Go to Dashboard <ArrowRight size={20} />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="gap-2 rounded-xl px-10 bg-blue-700 hover:bg-blue-800 text-white border-0">
                    Start For Free <ArrowRight size={20} />
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
