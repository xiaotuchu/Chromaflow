import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useLocale } from '../i18n/LocaleProvider';
import { createPageSeo } from '../utils/seo';
import { usePageSeo } from '../hooks/usePageSeo';

export default function PrivacyPolicy() {
  const { locale } = useLocale();
  usePageSeo(createPageSeo(locale, 'privacy'));
  const zh = locale === 'zh';
  const paragraphs = zh ? [
    'Chromaflow2 无需注册或登录。最近 20 条练习记录和语言偏好仅保存在当前浏览器的本地存储中，不会发送到应用后端。',
    '记录不跨设备同步。你可以在练习历史页清空记录，也可以通过浏览器设置清除本站数据。清理浏览器数据或更换浏览器后，记录无法恢复；旧版账号的云端记录不会自动迁移。',
    '选择的图片在浏览器内读取和处理，不会上传或写入练习历史。本版本未启用广告或访问统计脚本。',
    '静态托管服务可能产生访问日志。通过邮件联系我们时，你的邮件由所使用的邮件服务处理。',
  ] : [
    'Chromaflow2 requires no account. The latest 20 practice records and your language preference are stored in this browser and are not sent to an application backend.',
    'History does not sync between devices. Clear it from the history page or your browser settings. Deleted browser data cannot be recovered. Previous cloud account records are not automatically migrated.',
    'Selected images are processed in your browser, without being uploaded or stored in practice history. This version includes no advertising or analytics scripts.',
    'The static hosting provider may keep access logs. Contact emails are handled by the email services you use.',
  ];
  return <div className="min-h-screen flex flex-col"><Navbar/><main className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-20"><h1 className="text-4xl font-bold mb-8">{zh ? '隐私说明' : 'Privacy'}</h1><div className="space-y-6 text-slate-600 leading-8">{paragraphs.map(text => <p key={text}>{text}</p>)}</div></main><Footer/></div>;
}
