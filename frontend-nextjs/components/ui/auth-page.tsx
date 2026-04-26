'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from './button';

import {
	AtSign as AtSignIcon,
	ChevronLeft as ChevronLeftIcon,
	Github as GithubIcon,
	Hexagon as Grid2x2PlusIcon,
} from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function AuthPage() {
	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-zinc-950 text-white">
			<div className="bg-zinc-900/60 relative hidden h-full flex-col border-r border-zinc-800/50 p-10 lg:flex overflow-hidden">
				<div className="from-zinc-950 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<Link href="/" className="z-10 flex items-center gap-2 hover:opacity-80 transition">
					<Image src="/image.png" alt="Exonium" width={28} height={28} className="rounded-lg brightness-0 invert" />
					<span className="text-xl font-semibold text-zinc-100">Exonium</span>
				</Link>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl text-zinc-300">
							&ldquo;Exonium has completely transformed how our team ships code. We went from hours of setup to seconds of deployment.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold text-zinc-500">
							~ Harmeet Singh Jatana
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0 opacity-30">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4 bg-zinc-950">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.02)_50%,transparent_80%)] absolute top-0 right-0 h-[320px] w-[140px] -translate-y-[87.5px] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,transparent_80%)] absolute top-0 right-0 h-[320px] w-[60px] translate-x-[5%] -translate-y-[50%] rounded-full" />
				</div>
				<Button variant="ghost" className="absolute top-7 left-5 text-zinc-400 hover:text-white hover:bg-zinc-900" asChild>
					<Link href="/">
						<ChevronLeftIcon className='size-4 me-2' />
						Home
					</Link>
				</Button>
				<div className="mx-auto space-y-4 sm:w-[400px]">
					<div className="flex items-center gap-2 lg:hidden">
						<Grid2x2PlusIcon className="size-6 text-zinc-100" />
						<p className="text-xl font-semibold text-zinc-100">Exonium</p>
					</div>
					<div className="flex flex-col space-y-1">
						<h1 className="text-2xl font-bold tracking-wide text-zinc-100">
							Sign In or Join Now!
						</h1>
						<p className="text-zinc-500 text-base">
							Login or create your Exonium account.
						</p>
					</div>
					<div className="space-y-2 mt-4">
						<Button type="button" size="lg" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 h-12">
							<GoogleIcon className='size-4 me-2' />
							Continue with Google
						</Button>
						<Button type="button" size="lg" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 h-12">
							<AppleIcon className='size-4 me-2' />
							Continue with Apple
						</Button>
						<Button type="button" size="lg" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 h-12">
							<GithubIcon className='size-4 me-2' />
							Continue with GitHub
						</Button>
					</div>

					<AuthSeparator />

					<form className="space-y-4 mt-4">
						<p className="text-zinc-500 text-start text-xs">
							Enter your email address to sign in or create an account
						</p>
						<div className="relative h-max">
							<Input
								placeholder="your.email@example.com"
								className="peer ps-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-12"
								type="email"
							/>
							<div className="text-zinc-500 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<AtSignIcon className="size-4" aria-hidden="true" />
							</div>
						</div>

						<Button type="button" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 h-12 font-medium">
							<span>Continue With Email</span>
						</Button>
					</form>
					<p className="text-zinc-500 mt-8 text-sm text-center">
						By clicking continue, you agree to our{' '}
						<a
							href="#"
							className="hover:text-zinc-300 underline underline-offset-4 transition"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="hover:text-zinc-300 underline underline-offset-4 transition"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(255,255,255,${0.05 + i * 0.01})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-zinc-500"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const AppleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.689.79-1.311 2.221-1.129 3.598 1.35.104 2.571-.572 3.416-1.586z" />
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center my-6">
			<div className="bg-zinc-800 h-px w-full" />
			<span className="text-zinc-500 px-4 text-xs font-medium">OR</span>
			<div className="bg-zinc-800 h-px w-full" />
		</div>
	);
};
