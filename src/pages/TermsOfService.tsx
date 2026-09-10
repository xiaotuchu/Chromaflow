import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useLocale } from '../i18n/LocaleProvider';
import { createPageSeo } from '../utils/seo';
import { usePageSeo } from '../hooks/usePageSeo';

export default function TermsOfService() {
  const { locale } = useLocale();
  usePageSeo(createPageSeo(locale, 'terms'));
  const zh = locale === 'zh';
  return <div className="min-h-screen flex flex-col"><Navbar/><main className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-20"><h1 className="text-4xl font-bold mb-8">{zh ? '使用说明' : 'Terms of use'}</h1><div className="space-y-6 text-slate-600 leading-8">
    <p>{zh ? 'Chromaflow2 提供免费的色彩匹配练习和色彩知识内容，练习评分仅供学习参考。' : 'Chromaflow2 provides free color matching exercises and educational content. Scores are intended as learning feedback.'}</p>
    <p>{zh ? '本版本不提供账号、云端备份、打卡服务或数据恢复。浏览器本地存储最多保留最近 20 条练习记录。' : 'This version offers no accounts, cloud backup, check-in service, or data recovery. Browser storage retains at most the latest 20 practice records.'}</p>
    <p>{zh ? '请使用你有权使用的图片。图片在本机处理，显示效果可能因屏幕设置和设备而异。' : 'Use images you have permission to use. Images are processed locally, and displayed colors may vary with your screen and device settings.'}</p>
  </div></main><Footer/></div>;
}
