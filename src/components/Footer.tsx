import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black rounded-t-3xl mt-8">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Left: Brand and Contact */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-extrabold text-2xl tracking-tight">
              Onboard AI
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Let's Connect and Collaborate
          </h2>
          <p className="mb-6 max-w-xs text-black/90">
            We’re excited to hear about your vision and explore how we can bring
            it to life together.
          </p>
          <div className="flex items-center gap-3 mb-2">
            <Phone className="h-5 w-5 text-black/80" />
            <span className="text-black/90 text-base">+1 (234) 567-8900</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-black/80" />
            <span className="text-black/90 text-base">
              contact@onboardai.com
            </span>
          </div>
        </div>
        <div className="flex items-center  gap-20">
          {/* Product */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/integrations"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  Integrations
                </Link>
              </li>
              
            </ul>
          </div>

           <div>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Right: Social Media */}
        <div className="flex flex-col gap-4 md:items-end">
          <span className="font-semibold mb-2">Follow our social media :</span>
          <div className="flex gap-6 font-medium text-black/90">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LINKEDIN
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              INSTAGRAM
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              X
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              FACEBOOK
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mx-10 px-6 py-4 border-t border-black/20 text-black/80 text-sm">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="font-bold text-black">Onboard AI</span>
        </div>
        <span className="text-black/70">Remote. Operating Globally.</span>
      </div>
    </footer>
  );
};

export default Footer;
