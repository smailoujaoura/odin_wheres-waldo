import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../config/zustand';
import { Link } from 'react-router-dom';

export default function Navbar() {
	const { isDark, toggleTheme } = useThemeStore();

	return (
		<nav className="flex items-center justify-between px-8 py-4 bg-slate-50 dark:bg-slate-900 transition-colors">
			<div className="text-2xl font-bold text-slate-800 dark:text-white">
				Pixel<span className="text-teal-600">Hunt</span>
			</div>

			<div className="flex items-center gap-6 text-slate-600 dark:text-slate-300">
				<Link to="/leaderboard" className="hover:text-teal-600 transition-colors">
					Leaderboard
				</Link>
				
				<button 
					onClick={toggleTheme}
					className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-all"
				>
					{isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-teal-600" />}
				</button>
			</div>
		</nav>
	);
}