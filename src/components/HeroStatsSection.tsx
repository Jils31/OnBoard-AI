import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stats = [
	{ value: "10+", label: "Repositories Analyzed" },
	{ value: "10+ hrs", label: "Time Saved" },
	{ value: "5+", label: "Active Users" },
	{ value: "3x Faster", label: "Code Understanding" },
];

const HeroStatsSection: React.FC = () => {
	return (
		<section className="w-full bg-white py-12 px-4">
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				{/* Left Side: Headline and Images */}
				<div className="flex flex-col gap-8">
					<h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2 leading-tight">
						Precision Insights for Rapid Codebase Mastery.
					</h2>
					<div className="flex items-center gap-6">
						{/* Main Image */}
						<div className="relative">
							<img
								src="./20250709_1214_Minimalist Design_remix_01jzpyqztbecf88cn18dqgpj6d.png"
								alt="Repository Analysis"
								className="rounded-2xl border-1 shadow-xl w-64 h-44 object-cover"
								style={{ boxShadow: "0 8px 32px 0 #3b82f633" }}
							/>							
						</div>
						{/* Secondary Image */}
						<img
							src="./image.png"
							alt="Team Collaboration"
							className="rounded-2xl border-1 shadow-xl w-64 h-44 object-cover"
							style={{ boxShadow: "0 8px 32px 0 #3b82f633" }}
						/>
					</div>
				</div>

				{/* Right Side: About, Stats, CTA */}
				<div className="flex flex-col gap-6">
					<div>
						<span className="uppercase text-xs font-bold text-blue-700 tracking-widest mb-2 block">
							About Onboard AI
						</span>
						<h3 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2">
							Codebase analysis in minutes
						</h3>
						<p className="text-blue-900/80 mb-4 max-w-md">
							AI-powered repository analysis that helps developers get productive
							quickly. Perfect for onboarding, code reviews, and technical
							documentation.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-x-10 gap-y-6 w-full mb-2">
						{stats.map((stat, i) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
								viewport={{ once: true }}
								className="flex flex-col items-start"
							>
								<span className="text-2xl md:text-3xl font-extrabold text-blue-700">
									{stat.value}
								</span>
								<span className="text-sm text-blue-900/80 font-medium">
									{stat.label}
								</span>
							</motion.div>
						))}
					</div>
					<a
						href="#"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition w-max mt-2"
					>
						Get Started <ArrowRight size={18} />
					</a>
				</div>
			</div>
		</section>
	);
};

export default HeroStatsSection;