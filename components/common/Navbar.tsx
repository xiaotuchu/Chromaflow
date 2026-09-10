import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Palette } from 'lucide-react';
import { getRoutePath } from '../../routes';
import { getLocalizedPath, stripLocalePrefix } from '../../i18n/config';
import { useLocale } from '../../i18n/LocaleProvider';

export default function Navbar() {
  const { locale, messages } = useLocale();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const links = [
    { route: 'practice' as const, label: messages.navbar.practice },
    { route: 'knowledgeBase' as const, label: messages.navbar.knowledgeBase },
    { route: 'profile' as const, label: locale === 'zh' ? '练习历史' : 'History' },
    { route: 'contact' as const, label: messages.navbar.contact },
  ];
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
      <Link to={getRoutePath(locale, 'home')} onClick={() => setOpen(false)} className="flex items-center gap-2 text-xl font-bold text-slate-900">
        <span className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white"><Palette size={18}/></span>Chromaflow
      </Link>
      <button type="button" aria-label={locale === 'zh' ? '切换导航菜单' : 'Toggle navigation'} aria-expanded={open} aria-controls="main-nav" className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav id="main-nav" className={`${open ? 'flex' : 'hidden'} md:flex w-full md:w-auto flex-col md:flex-row md:items-center gap-4 md:gap-6`}>
        {links.map(link => <NavLink key={link.route} to={getRoutePath(locale, link.route)} onClick={() => setOpen(false)} className={({ isActive }) => `py-2 text-sm font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}>{link.label}</NavLink>)}
        <div className="flex gap-1 border border-slate-200 rounded-full p-1 self-start">
          {(['en', 'zh'] as const).map(option => <button key={option} type="button" aria-pressed={locale === option} onClick={() => { navigate(getLocalizedPath(option, stripLocalePrefix(location.pathname))); setOpen(false); }} className={`px-3 py-1 rounded-full text-xs font-semibold ${locale === option ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>{option === 'zh' ? '中文' : 'English'}</button>)}
        </div>
      </nav>
    </div>
  </header>;
}
