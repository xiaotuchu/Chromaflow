import type { Locale } from "./config";

const messages = {
  en: {
    brandName: "Chromaflow",
    navbar: {
      practice: "Practice",
      knowledgeBase: "Knowledge Base",
      contact: "Contact",
      profile: "Profile",
      logIn: "Log in",
      signUp: "Sign up",
      logOut: "Log out",
      member: "Member",
      goHome: "Go to home",
      language: "Language",
      english: "English",
      chinese: "中文",
    },
    footer: {
      tagline:
        "The daily playground for color perfectionists. Designed with care for the creative community.",
      privacy: "Privacy",
      terms: "Terms",
      rights: "All rights reserved.",
    },
    home: {
      hero: {
        badge: "Now v2.0 Available",
        titlePrefix: "Color Practice",
        titleHighlight: "for Beginners.",
        description:
          "Practice color matching with focused exercises for beginner painters, drawing learners, and visual creatives who want stronger color judgment.",
        cta: "Start Practice",
        target: "TARGET",
        match: "MATCH 98%",
        yourMatch: "Your Match",
      },
      features: {
        eyebrow: "Features",
        title: "A focused training ground for color matching.",
        description:
          "From hue and saturation drills to practical color matching, each exercise is built to improve color sensitivity through repeatable practice.",
        items: [
          {
            title: "Multi-Mode Training",
            description:
              "Practice color matching across HSV, RGB, and HSL so you build a working understanding of hue, saturation, value, and digital color relationships.",
          },
          {
            title: "Subtle Difference Mastery",
            description:
              "Train your eyes to detect micro-variations in hue, saturation, and lightness. Develop the precision needed for professional-grade design and visual arts.",
          },
          {
            title: "Analytics & Progress",
            description:
              "Review your latest 50 rounds in this browser, compare color matches, and follow your recent accuracy. No account required.",
          },
        ],
      },
      value: {
        matchAccuracy: "Match Accuracy",
        rankTitle: "Pro-Level Vision",
        rankLabel: "Skill Progression",
        title: "Why train your color sensitivity?",
        description:
          'Color is the most immediate form of non-verbal communication. Improving your ability to perceive and manipulate color transforms your design work from "good" to "extraordinary."',
        items: [
          {
            title: "Confidence in Decisions",
            description:
              "Stop guessing. Know exactly why a color works or fails.",
          },
          {
            title: "Faster Workflow",
            description:
              "Spend less time tweaking sliders and more time creating.",
          },
          {
            title: "Refined Aesthetic",
            description:
              "Develop a sophisticated palette that stands out in a crowded market.",
          },
        ],
      },
    },
    practice: {
      display: {
        split: "Split",
        overlay: "Overlay",
        target: "Target",
        preview: "Preview",
        background: "Background",
        randomizeBackground: "Randomize Background",
        resetBackground: "Reset to Default",
        changeBackground: "Change background color",
        changeTarget: "Change target color",
        randomizeTarget: "Randomize target color",
        resetTarget: "Restore original target color",
        targetTitle: "Click to randomize, double-click to pick color",
        targetOnlyTitle: "Target (Click to randomize)",
        random: "Random",
        step1: "Observe the target color's hue, saturation, and brightness.",
        step2: "Click the target to randomize.",
        step3: "Double-click the target to pick a custom color.",
      },
      imageTools: {
        uploadImage: "Upload Image",
        useExtractedColor: "Use extracted color",
        editExtractedColors: "Edit extracted colors",
        extractColors: "Extract Colors",
        reset: "Reset",
        usePalette: "Apply",
      },
    },
    common: {
      colorPicker: {
        cancel: "Cancel",
        confirm: "Confirm",
      },
    },
    knowledgeBase: {
      articleList: "Article List",
      aiGenerated: "AI Generated",
      articleNotFound: "Article not found",
      articleNotFoundDescription:
        "Please select an article from the article list.",
    },
  },
  zh: {
    brandName: "Chromaflow",
    navbar: {
      practice: "练习",
      knowledgeBase: "知识库",
      contact: "联系我们",
      profile: "个人中心",
      logIn: "登录",
      signUp: "注册",
      logOut: "退出登录",
      member: "会员",
      goHome: "返回首页",
      language: "语言",
      english: "English",
      chinese: "中文",
    },
    footer: {
      tagline:
        "为色彩控打造的每日训练场。专为设计师、插画师和视觉创作者而设计。",
      privacy: "隐私政策",
      terms: "服务条款",
      rights: "All rights reserved.",
    },
    home: {
      hero: {
        badge: "现已上线 v2.0",
        titlePrefix: "面向初学者的",
        titleHighlight: "色彩练习",
        description:
          "围绕色相、饱和度和明度进行重复练习，提升配色判断、观察力和实际调色速度。",
        cta: "开始练习",
        target: "目标色",
        match: "匹配度 98%",
        yourMatch: "你的匹配色",
      },
      features: {
        eyebrow: "功能亮点",
        title: "专注色彩匹配训练的练习空间",
        description:
          "从 HSV 滑杆练习到实际颜色匹配，把色彩理论变成可以反复训练的肌肉记忆。",
        items: [
          {
            title: "多模式训练",
            description:
              "通过 HSV、RGB 和 HSL 三种模式练习配色，更具体地理解色相、饱和度、明度和数字色彩关系。",
          },
          {
            title: "细微差异感知",
            description:
              "训练你识别色相、饱和度和亮度中的微小变化，建立专业级设计与视觉创作所需的精度。",
          },
          {
            title: "数据分析与成长",
            description:
              "在当前浏览器保留最近 50 次练习，对比目标色与匹配色，查看近期准确率，无需注册账号。",
          },
        ],
      },
      value: {
        matchAccuracy: "匹配准确率",
        rankTitle: "专业级色彩感",
        rankLabel: "能力进阶",
        title: "为什么要训练你的色彩敏感度？",
        description:
          '色彩是设计里最直觉的语言。当你真正看懂颜色，作品就会从"还不错"变成"令人难忘"。',
        items: [
          {
            title: "决策更有把握",
            description:
              "不再凭感觉猜测，而是清楚知道为什么这个颜色有效或失效。",
          },
          {
            title: "工作流更高效",
            description: "把时间花在创作上，而不是反复拖动滑杆试错。",
          },
          {
            title: "审美更有辨识度",
            description: "建立成熟、克制且具有竞争力的个人配色语言。",
          },
        ],
      },
    },
    practice: {
      display: {
        split: "分屏",
        overlay: "叠加",
        target: "目标色",
        preview: "预览",
        background: "背景色",
        randomizeBackground: "随机背景色",
        resetBackground: "重置为默认背景色",
        changeBackground: "更改背景色",
        changeTarget: "更改目标色",
        randomizeTarget: "随机目标色",
        resetTarget: "恢复打开前的目标色",
        targetTitle: "点击目标色块随机生成颜色，双击目标色块选择自定义颜色",
        targetOnlyTitle: "目标色（点击随机生成）",
        random: "随机",
        step1: "观察目标色的色相、饱和度和亮度。",
        step2: "单击目标色块随机更换颜色。",
        step3: "双击目标色块选择自定义颜色。",
      },
      imageTools: {
        uploadImage: "上传图片",
        useExtractedColor: "使用提取颜色",
        editExtractedColors: "编辑提取颜色",
        extractColors: "提取颜色",
        reset: "重置",
        usePalette: "应用",
      },
    },
    common: {
      colorPicker: {
        cancel: "取消",
        confirm: "确定",
      },
    },
    knowledgeBase: {
      articleList: "文章列表",
      aiGenerated: "AI 生成",
      articleNotFound: "未找到文章",
      articleNotFoundDescription: "请从左侧文章列表中选择一篇文章。",
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
