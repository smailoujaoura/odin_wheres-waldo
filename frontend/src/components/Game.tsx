import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link here
import api from "@/config/axios";
import { XCircle } from "lucide-react";

interface Character {
	id: string;
	name: string;
	iconUrl: string;
	found: boolean;
}

interface Marker {
	id: string;
	x: number;
	y: number;
}

export default function Game() {
	const { id } = useParams();
	const navigate = useNavigate();
	
	const [map, setMap] = useState<any>(null);
	const [characters, setCharacters] = useState<Character[]>([]);
	const [markers, setMarkers] = useState<Marker[]>([]);
	const [gameId, setGameId] = useState<string>("");
	const [clickPos, setClickPos] = useState({ x: 0, y: 0, clientX: 0, clientY: 0 });
	const [showModal, setShowModal] = useState(false);
	const [errorToast, setErrorToast] = useState<string | null>(null);
	const [time, setTime] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [playerName, setPlayerName] = useState("");
	
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				const mapRes = await api.get(`/maps/${id}`);
				const gameRes = await api.post("/game/start", { mapId: id });
				setMap(mapRes.data);
				setGameId(gameRes.data.gameId);
				setCharacters(mapRes.data.characters.map((c: any) => ({ ...c, found: false })));
			} catch (err) {
				console.error("Initialization failed", err);
			}
		};
		init();
	}, [id]);

	useEffect(() => {
		if (!isGameOver) {
			timerRef.current = setInterval(() => setTime(t => t + 10), 10);
		} else if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		return () => { if (timerRef.current) clearInterval(timerRef.current); };
	}, [isGameOver]);

	useEffect(() => {
		if (characters.length > 0 && characters.every(c => c.found)) {
			setIsGameOver(true);
		}
	}, [characters]);

	const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
		if (isGameOver) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		
		setClickPos({ x, y, clientX: e.pageX, clientY: e.pageY });
		setShowModal(true);
	};

	const validateSelection = async (charId: string) => {
		setShowModal(false);
		try {
			const { data } = await api.post("/game/validate", {
				mapId: id,
				characterId: charId,
				x: clickPos.x,
				y: clickPos.y
			});

			if (data.found) {
				setCharacters(prev => prev.map(c => c.id === charId ? { ...c, found: true } : c));
				setMarkers(prev => [...prev, { id: charId, x: clickPos.x, y: clickPos.y }]);
			} else {
				setErrorToast(`That is not ${characters.find(c => c.id === charId)?.name}!`);
				setTimeout(() => setErrorToast(null), 2500);
			}
		} catch (err) {
			console.error("Validation error", err);
		}
	};

	const submitScore = async () => {
		if (!playerName.trim()) return;
		try {
			await api.post("/scores", {
				name: playerName,
				gameId: gameId
			});
			navigate("/leaderboard");
		} catch (err) {
			console.error("Score submission failed", err);
		}
	};

	if (!map) return <div className="h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white font-bold text-2xl uppercase">Initializing...</div>;

	return (
		<div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden">
			{errorToast && (
				<div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 font-black">
					<XCircle className="w-6 h-6" />
					{errorToast}
				</div>
			)}

			<nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 shadow-sm">
				{/* Made the Logo Clickable */}
				<Link 
					to="/" 
					className="text-xl font-black text-slate-800 dark:text-white hover:opacity-70 transition-opacity"
				>
					Pixel<span className="text-teal-600">Hunt</span>
				</Link>

				<div className="font-mono text-2xl tabular-nums text-slate-700 dark:text-teal-400 font-bold">{formatTime(time)}</div>
				<div className="flex gap-3">
					{characters.map(char => (
						<div key={char.id} className={`flex items-center gap-2 p-1 pr-3 rounded-xl border transition-all duration-300 ${char.found ? 'bg-slate-200 dark:bg-slate-800 border-transparent opacity-30 grayscale pointer-events-none' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
							<img src={char.iconUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
							<span className="text-xs font-black uppercase dark:text-slate-200">{char.name}</span>
						</div>
					))}
				</div>
			</nav>

			<div className="relative cursor-crosshair">
				<img src={map.imageUrl} onClick={handleImageClick} className="w-full h-auto block" alt="Game Level" />
				
				{markers.map(m => (
					<div key={m.id} className="absolute w-16 h-16 border-4 border-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
						<div className="w-2 h-2 bg-emerald-500 rounded-full" />
					</div>
				))}

				{showModal && (
					<div className="absolute w-16 h-16 border-4 border-dashed border-teal-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse shadow-[0_0_15px_rgba(20,184,166,0.5)]" style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }} />
				)}
			</div>

			{showModal && (
				<div className="absolute z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 flex flex-col gap-1 min-w-[200px]" style={{ top: clickPos.clientY, left: clickPos.clientX }}>
					<p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">Identify Target</p>
					{characters.map(char => (
						<button key={char.id} disabled={char.found} onClick={() => validateSelection(char.id)} className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all ${char.found ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:bg-teal-500 hover:text-white dark:text-slate-200 group'}`}>
							<img src={char.iconUrl} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-slate-100 group-hover:border-white/50" />
							<span className="font-bold text-sm">{char.name}</span>
						</button>
					))}
				</div>
			)}

			{isGameOver && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
					<div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in duration-300">
						<div className="text-6xl mb-4">🏆</div>
						<h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">MISSION COMPLETE</h2>
						<p className="text-slate-500 dark:text-slate-400 mb-8 font-bold">Time: <span className="text-teal-500 tabular-nums">{formatTime(time)}</span></p>
						<input type="text" placeholder="YOUR HERO NAME" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:border-teal-500 outline-none transition-all font-black text-center mb-4 uppercase" />
						<button onClick={submitScore} className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white font-black text-lg rounded-2xl shadow-[0_5px_0_rgb(13,148,136)] active:translate-y-1 active:shadow-none transition-all">UPLOAD SCORE</button>
					</div>
				</div>
			)}
		</div>
	);
}

const formatTime = (ms: number) => {
	const mins = Math.floor(ms / 60000);
	const secs = Math.floor((ms % 60000) / 1000);
	const centi = Math.floor((ms % 1000) / 10);
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${centi.toString().padStart(2, '0')}`;
};