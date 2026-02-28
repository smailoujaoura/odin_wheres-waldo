import Navbar from "./Nav"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "@/config/axios";

interface Map {
	id: string;
	name: string;
	imageUrl: string;
}

export default function Home() {
	const [maps, setMaps] = useState<Map[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMaps = async () => {
			try {
				const { data } = await api.get("/maps");
				setMaps(data);
			} catch (error) {
				console.error("Failed to fetch maps:", error);
			} finally {
				setTimeout(() => setLoading(false), 600);
			}
		};
		fetchMaps();
	}, []);

	return (
		<div className="min-h-screen bg-[#f0f9f6] dark:bg-[#0a0f0d] transition-colors duration-500">
			<Navbar />
			
			<main className="max-w-7xl mx-auto px-6 py-12">
				<header className="text-center mb-16">
					<h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
						Select Your <span className="text-teal-500">World</span>
					</h1>
					<p className="text-slate-500 dark:text-slate-400 font-medium">
						Find the hidden targets before the clock runs out.
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{loading ? (
						// Show 3 skeletons while loading
						Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
					) : (
						maps.map((map) => (
							<GameCard key={map.id} map={map} />
						))
					)}
				</div>
			</main>
		</div>
	);
}

function GameCard({ map }: { map: Map }) {
	return (
		<div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-5 border border-slate-200 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.1)] transition-all duration-300 hover:-translate-y-2">
			<div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
				<img 
					src={map.imageUrl} 
					alt={map.name} 
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 px-2">
				{map.name}
			</h2>

			<Link 
				to={`/game/${map.id}`}
				className="flex items-center justify-center w-full py-4 bg-teal-500 hover:bg-teal-400 text-white font-black text-lg rounded-xl shadow-[0_4px_0_rgb(13,148,136)] active:shadow-none active:translate-y-[4px] transition-all"
			>
				START MISSION
			</Link>
		</div>
	);
}

function SkeletonCard() {
	return (
		<div className="bg-white dark:bg-slate-900/50 rounded-3xl p-5 border border-slate-200 dark:border-white/5 animate-pulse">
			<div className="bg-slate-200 dark:bg-slate-800 aspect-[4/3] rounded-2xl mb-6" />
			<div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mx-auto mb-8" />
			<div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
		</div>
	);
}