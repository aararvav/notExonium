"use client";
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '/features' },
			{ title: 'How it Works', href: '/how-it-works' },
			{ title: 'Pricing', href: '/pricing' },
			{ title: 'Get Started', href: '/signup' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '#' },
			{ title: 'Careers', href: '#' },
			{ title: 'Privacy Policy', href: '#' },
			{ title: 'Terms of Service', href: '#' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Documentation', href: '#' },
			{ title: 'System Status', href: '#' },
			{ title: 'Changelog', href: '#' },
			{ title: 'Help Center', href: '#' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'Twitter', href: '#', icon: FacebookIcon },
			{ title: 'GitHub', href: '#', icon: LinkedinIcon },
			{ title: 'Discord', href: '#', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
		],
	},
];

export function SiteFooter() {
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-zinc-800/50 bg-zinc-950 px-6 py-12 lg:py-16 overflow-hidden">
            {/* Top highlight effect */}
			<div className="bg-zinc-500/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8 relative z-10">
				<AnimatedContainer className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Image src="/image.png" alt="Exonium" width={28} height={28} className="rounded-lg brightness-0 invert" />
                        <span className="font-semibold text-white text-lg">Exonium</span>
                    </Link>
					<p className="text-zinc-400 mt-6 text-sm max-w-xs leading-relaxed">
						The fastest way to deploy your GitHub repositories. From push to production in seconds.
					</p>
					<p className="text-zinc-500 mt-8 text-sm md:mt-0 pt-4">
						© {new Date().getFullYear()} Exonium. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-sm font-semibold text-white">{section.label}</h3>
								<ul className="text-zinc-400 mt-4 space-y-3 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<Link
												href={link.href}
												className="hover:text-white inline-flex items-center transition-colors duration-300"
											>
												{link.icon && <link.icon className="mr-2 h-4 w-4" />}
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: 15, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay, duration: 0.6, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
