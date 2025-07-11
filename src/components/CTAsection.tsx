import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight } from 'lucide-react'

const CTAsection: React.FC = () => {
  const { user } = useAuth();
  return (
    <section className="py-20 bg-[#f3f4ef] dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-10 sm:p-16 text-center shadow-xl border border-blue-200 dark:border-blue-800"
        >
          <h2 className="mb-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to understand codebases faster?
          </h2>
          <p className="mb-8 text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of developers who are using Onboard AI to analyze both public and private repositories.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex justify-center"
          >
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-blue-900 font-semibold hover:bg-blue-50 border border-blue-900 shadow"
                >
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-blue-900 font-semibold hover:bg-blue-50 border border-blue-900 shadow"
                >
                  Start Free Trial <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTAsection