import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "@/config/axios";
import { Trophy, Medal, Clock, ArrowLeft, Loader2 } from "lucide-react";

interface Score {
	id: string;
	name: string;
	time: number;
}

export default function Leaderboard() {
	const { mapId } = useParams<{ mapId?: string }>();
	const [scores, setScores] = useState<Score[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchScores = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await api.get("/scores", { 
					params: mapId ? { mapId } : {} 
				});
				setScores(response.data);
			} catch (err) {
				console.error("Failed to fetch scores:", err);
				setError("Could not load the leaderboard. Try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchScores();
	}, [mapId]);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
			<div className="max-w-4xl mx-auto">
				<Link 
					to="/" 
					className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-10 font-black transition-colors group"
				>
					<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
					BACK TO MISSION SELECT
				</Link>

				<header className="text-center mb-16">
					<div className="inline-block p-4 bg-yellow-400/10 rounded-full mb-4">
						<Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
					</div>
					<h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
						Hall of <span className="text-teal-500">Fame</span>
					</h1>
					<p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-4">
						The World's Elite Pixel Hunters
					</p>
				</header>

				<div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b dark:border-slate-800">
								<th className="px-10 py-6">Rank</th>
								<th className="px-10 py-6">Hunter</th>
								<th className="px-10 py-6 text-right">Completion Time</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{loading ? (
								<tr>
									<td colSpan={3} className="px-10 py-20 text-center">
										<Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto" />
										<p className="mt-4 font-black text-slate-400 uppercase text-xs">Syncing Rankings...</p>
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan={3} className="px-10 py-20 text-center text-red-500 font-bold">
										{error}
									</td>
								</tr>
							) : scores.length === 0 ? (
								<tr>
									<td colSpan={3} className="px-10 py-20 text-center font-black text-slate-400 uppercase text-sm">
										No records found. The leaderboard is empty.
									</td>
								</tr>
							) : (
								scores.map((score, index) => (
									<tr key={score.id} className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/5 transition-colors">
										<td className="px-10 py-7">
											<div className="flex items-center gap-4">
												<span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
													index === 0 ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/20' : 
													index === 1 ? 'bg-slate-300 text-white shadow-lg shadow-slate-300/20' : 
													index === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
												}`}>
													{index + 1}
												</span>
												{index < 3 && <Medal className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-orange-400'}`} />}
											</div>
										</td>
										<td className="px-10 py-7">
											<div className="font-black text-slate-800 dark:text-slate-100 text-xl uppercase italic tracking-tight">
												{score.name}
											</div>
										</td>
										<td className="px-10 py-7 text-right">
											<div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl font-mono font-black text-2xl text-teal-600 dark:text-teal-400 border border-slate-100 dark:border-slate-800">
												<Clock className="w-5 h-5 text-teal-500" />
												{score.time}s
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}