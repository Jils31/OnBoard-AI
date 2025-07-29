import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <>
      <section className="relative overflow-hidden py-20 mt-20 sm:py-32">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full relative">
            {/* Grid lines (vertical + horizontal) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,64,175,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,64,175,0.4)_1px,transparent_1px)] [background-size:60px_60px]" />

            {/* Center glow (strong at center, fading out) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_40%,rgba(255,255,255,1)_80%)]" />

            {/* Outer glow (transparent center, white edges) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_60%,rgba(255,255,255,1)_100%)]" />
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Left: Text Content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <Badge
                className="mb-6 px-4 py-1 text-sm bg-blue-50 text-blue-900 border border-blue-200 shadow-none rounded-full"
                variant="secondary"
              >
                PRO PLAN – NOW AVAILABLE
              </Badge>
              <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 leading-tight drop-shadow-sm">
                Understand codebases in{" "}
                <span className="relative inline-block">
                  <span className="z-10 relative text-blue-700">minutes</span>
                  <span className="absolute left-0 bottom-1 w-full h-2 bg-green-400/80 z-0 rounded-sm"></span>
                </span>
                <br />
                not weeks
              </h1>
              <p className="text-lg md:text-xl text-blue-900/80 mb-10 max-w-2xl mx-auto lg:mx-0">
                Onboard AI helps engineers analyze, visualize, and document
                large codebases with AI-powered insights. Accelerate onboarding,
                code reviews, and architecture understanding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                {user ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-7 py-3 text-lg rounded-xl shadow"
                    >
                      Go to Dashboard <ArrowRight size={16} />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button
                        size="lg"
                        className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-7 py-3 text-lg rounded-xl shadow"
                      >
                        Try for Free <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border-blue-900 text-blue-900 font-semibold px-7 py-3 text-lg rounded-xl shadow hover:bg-blue-50 flex items-center"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        Sign in with GitHub
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {/* Right: Visual Representation */}
            <div className="hidden lg:flex flex-1 justify-center items-center">
              <div className="relative w-[480px] min-h-[500px] bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 flex flex-col justify-start items-center gap-y-8 px-8 pt-16 pb-10 overflow-visible transition-all duration-500 ease-in-out">
                <div
                  className="absolute top-3.5 left-8  bg-blue-700  text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-pulse"
                  style={{ zIndex: 50 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span className="text-xs font-semibold">
                    AI Analyzing Repository
                  </span>
                </div>
                {/* AI Bot Icon  */}
                <div
                  className="absolute -top-16 right-8 bg-blue-700 rounded-full p-5 shadow-lg flex items-center justify-center animate-bounce"
                  style={{ zIndex: 40 }}
                >
                  <Bot className="w-9 h-9 text-white" />
                </div>

                {/* Main dashboard card */}
                <div className="w-full rounded-2xl bg-gradient-to-br from-blue-100/80 to-white/80 p-8 shadow-xl border border-blue-50 relative z-20 flex flex-col gap-5 animate-fade-in delay-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-700 font-bold text-base">
                      /src/components/
                    </span>
                    <span className="ml-auto text-xs text-blue-400">
                      AI Summary
                    </span>
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <span className="rounded bg-blue-200/60 px-2.5 py-0.5 text-xs text-blue-900">
                      Component
                    </span>
                    <span className="rounded bg-indigo-100/60 px-2.5 py-0.5 text-xs text-indigo-800">
                      Hooks
                    </span>
                    <span className="rounded bg-gray-100/60 px-2.5 py-0.5 text-xs text-gray-700">
                      Docs
                    </span>
                  </div>
                  <div className="text-sm text-blue-900/90 font-mono leading-relaxed whitespace-pre-wrap">
                    {`// This component fetches and displays
// AI-generated documentation for your codebase.`}
                  </div>
                </div>

                {/* File tree card  */}
                <div
                  className="absolute bottom-10 left-6 w-72 bg-white/90 border border-blue-100 rounded-xl shadow-lg p-4 flex flex-col gap-2 animate-slide-up"
                  style={{ zIndex: 25 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-blue-900 font-semibold">
                      File Tree
                    </span>
                  </div>
                  <ul className="text-xs text-blue-700 font-mono mt-1 ml-2 space-y-1">
                    <li>src/</li>
                    <li className="ml-3">components/</li>
                    <li className="ml-6 text-blue-900 font-bold">
                      HeroSection.tsx
                    </li>
                    <li className="ml-3">utils/</li>
                  </ul>
                </div>

                {/* AI Graph  */}
                <div
                  className="absolute bottom-10 right-6 flex flex-col items-center animate-slide-up"
                  style={{ zIndex: 15 }}
                >
                  <svg width="120" height="70" fill="none">
                    <circle
                      cx="25"
                      cy="38"
                      r="10"
                      fill="#6366f1"
                      opacity="0.2"
                    />
                    <circle
                      cx="60"
                      cy="20"
                      r="10"
                      fill="#6366f1"
                      opacity="0.5"
                    />
                    <circle
                      cx="100"
                      cy="50"
                      r="10"
                      fill="#6366f1"
                      opacity="0.8"
                    />
                    <line
                      x1="25"
                      y1="38"
                      x2="60"
                      y2="20"
                      stroke="#6366f1"
                      strokeWidth="3"
                      opacity="0.4"
                    />
                    <line
                      x1="60"
                      y1="20"
                      x2="100"
                      y2="50"
                      stroke="#6366f1"
                      strokeWidth="3"
                      opacity="0.7"
                    />
                  </svg>
                  <span className="text-[11px] text-blue-400 mt-1">
                    AI Graph
                  </span>
                </div>
              </div>
            </div>
            {/* yaha tak */}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
