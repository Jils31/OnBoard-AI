import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code, BrainCog, Rocket, GithubIcon, Check, Clock, ArrowUpRight, ChevronDown } from "lucide-react";
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggeredContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <Badge className="mb-4 px-3 py-1 text-sm" variant="secondary">
                Pro Plan - Now Available
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Understand codebases in 
                <span className="text-blue-600 dark:text-blue-400"> minutes not weeks</span>
              </h1>
              <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                AI-powered repository analysis that helps developers get productive quickly.
                Perfect for onboarding, code reviews, and technical documentation.
              </p>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={staggeredContainer}
              >
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard <ArrowRight size={16} />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        Try for Free <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="outline" size="lg" className="gap-2">
                        <GithubIcon className="h-5 w-5" />
                        Sign in with GitHub
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-5/12"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-30"></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative">
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-2 text-gray-500">Repository Analysis</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="flex gap-3">
                      <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <motion.div 
                  className="animate-bounce"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="container mx-auto px-4 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
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
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Trusted by developers from</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Google", "Meta", "Stripe", "Airbnb", "Microsoft"].map((partner, index) => (
              <div key={index} className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Powerful tools to help you understand any codebase faster and more efficiently
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Repository Analysis",
                description: "Our AI analyzes repository structure, dependencies, and code paths to create a comprehensive understanding of your project.",
                icon: <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              },
              {
                title: "Interactive Documentation",
                description: "Generate visual maps, dependency graphs, and interactive guides that make understanding complex codebases intuitive.",
                icon: <BrainCog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              },
              {
                title: "Accelerated Onboarding",
                description: "Reduce onboarding time by 70% with personalized learning paths and step-by-step walkthroughs of critical workflows.",
                icon: <Rocket className="h-8 w-8 text-green-600 dark:text-green-400" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 rounded-full bg-blue-100 p-3 w-fit dark:bg-blue-900/30">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold mb-4">Analyze any repository instantly</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Simply connect your GitHub account or paste a repository URL. Our AI will analyze the codebase structure, identify key patterns, and generate comprehensive insights.
              </p>
              <ul className="space-y-3">
                {["Identify critical code paths", "Map dependencies", "Document architecture", "Highlight important components"].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-700 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-16">
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonials</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              See what other developers are saying about Onboarding Buddy
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image || ""} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated to match Pricing.tsx */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Choose the plan that works best for you
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "For personal projects and exploration",
                features: [
                  "1 repository analysis per month",
                  "Basic code structure visualization",
                  "Limited documentation generation",
                  "Community support"
                ],
                cta: "Start Free",
                popular: false,
                productId: ""
              },
              {
                name: "Premium",
                price: "$19.99",
                period: "per month",
                description: "For professional developers",
                features: [
                  "7 repository analyses per month",
                  "Advanced visualization tools",
                  "Full documentation generation",
                  "Critical path analysis",
                  "Priority support"
                ],
                cta: "Get Premium",
                popular: true,
                productId: "16c1bcc2-bac7-4444-85e8-e0872f90e224"
              },
              {
                name: "Unlimited",
                price: "$99.99",
                period: "per month",
                description: "For teams and organizations",
                features: [
                  "30 repository analyses per month",
                  "Team collaboration features",
                  "Custom onboarding workflows",
                  "Advanced analytics",
                  "API access",
                  "Dedicated support"
                ],
                cta: "Contact Us",
                popular: false,
                productId: "843c09eb-c979-4946-a9db-5e58baf9b560"
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-blue-500 dark:border-blue-400 scale-105 relative' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                    <Badge className="bg-blue-600 hover:bg-blue-700 mx-auto">Most Popular</Badge>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with gradient */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 p-8 text-center text-white shadow-xl border border-blue-400/20 sm:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to understand codebases faster?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of developers who are using Onboarding Buddy to analyze both public and private repositories.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Go to Dashboard <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="gap-2 backdrop-blur-sm bg-white/30 hover:bg-white/40 border border-white/40">
                    Start Free Trial <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
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
                <AccordionItem key={index} value={`faq-${index}`} className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Still have questions? We're here to help.
            </p>
            <Button variant="outline" className="gap-2">
              Contact Support <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white dark:from-blue-800 dark:to-blue-900 sm:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to understand codebases faster?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of developers who are using Onboarding Buddy to analyze both public and private repositories.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Go to Dashboard <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Free Trial <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link to="/integrations" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link to="/api" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API</Link></li>
                <li><Link to="/support" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover
