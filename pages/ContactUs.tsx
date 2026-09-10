import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { CONTACT_EMAIL } from '../services/appConfig';
import { useLocale } from '../i18n/LocaleProvider';
import { createPageSeo } from '../utils/seo';
import { usePageSeo } from '../utils/usePageSeo';

export default function ContactUs() {
  const { locale } = useLocale();
  usePageSeo(createPageSeo(locale, 'contact'));
  return <div className="min-h-screen flex flex-col"><Navbar/>
    <main className="flex-1 w-full max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-6">{locale === 'zh' ? '联系我们' : 'Contact us'}</h1>
      <section className="bg-white border border-slate-200 rounded-3xl p-8">
        <p className="text-slate-600 leading-7 mb-6">{locale === 'zh' ? '有问题或建议，欢迎通过邮件联系。点击下方地址将在你的邮件应用中打开新邮件，请在那里完成发送。' : 'Questions or feedback? Contact us by email. The link opens your email app, where you can compose and send your message.'}</p>
        <a className="text-indigo-600 font-semibold break-all underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </section>
    </main><Footer/>
  </div>;
}
