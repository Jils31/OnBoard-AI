import React from "react";
import {motion} from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from '@/components/ui/button'
import {ArrowUpRight} from 'lucide-react'

const FAQsection: React.FC = () => {
  return (
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
                answer:
                  "Our AI scans your repository's code structure, identifies key patterns and dependencies, and generates comprehensive insights about architecture, critical paths, and code organization. This helps developers understand the codebase more quickly and efficiently.",
              },
              {
                question: "Is my code secure when using Onboarding Buddy?",
                answer:
                  "Yes, we take security very seriously. We use secure OAuth connections with GitHub, and your code is only accessed temporarily during analysis. We don't store your code, only the metadata and insights generated from the analysis.",
              },
              {
                question: "Can I analyze private repositories?",
                answer:
                  "Yes, our Premium and Unlimited plans allow analysis of private repositories. You'll need to authorize our GitHub integration to access your private repositories securely.",
              },
              {
                question: "How long does an analysis take?",
                answer:
                  "Most repositories are analyzed within minutes. Larger codebases may take a bit longer, depending on size and complexity, but our system is optimized for quick turnarounds.",
              },
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your subscription at any time. Plan changes take effect at the beginning of your next billing cycle.",
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-gray-200 dark:border-gray-700"
              >
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
      </div>
    </section>
  );
};

export default FAQsection
