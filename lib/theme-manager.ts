/**
 * 主题管理器
 * 管理所有可用主题及其配置
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  border: string;
  // CV 特定颜色
  name?: string;
  headline?: string;
  section_titles?: string;
  links?: string;
  connections?: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  headingFont?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative' | 'minimal';
  colors: ThemeColors;
  typography: ThemeTypography;
  preview?: string;
}

export const themes: Theme[] = [
  {
    id: 'classic',
    name: '经典主题',
    description: '传统专业风格，适合各行各业',
    category: 'professional',
    colors: {
      primary: 'rgb(0, 79, 144)',
      secondary: 'rgb(100, 100, 100)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(0, 0, 0)',
      accent: 'rgb(0, 79, 144)',
      border: 'rgb(200, 200, 200)',
      name: 'rgb(0, 79, 144)',
      headline: 'rgb(0, 79, 144)',
      section_titles: 'rgb(0, 79, 144)',
      links: 'rgb(0, 79, 144)',
      connections: 'rgb(100, 100, 100)',
    },
    typography: {
      fontFamily: '"Source Sans 3", "Noto Sans SC", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5',
      headingFont: '"Source Sans 3", "Noto Sans SC", sans-serif',
    },
  },
  {
    id: 'modern',
    name: '现代主题',
    description: '简约现代风格，适合科技行业',
    category: 'modern',
    colors: {
      primary: 'rgb(37, 99, 235)',
      secondary: 'rgb(107, 114, 128)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      accent: 'rgb(59, 130, 246)',
      border: 'rgb(229, 231, 235)',
      name: 'rgb(17, 24, 39)',
      headline: 'rgb(107, 114, 128)',
      section_titles: 'rgb(37, 99, 235)',
      links: 'rgb(59, 130, 246)',
      connections: 'rgb(107, 114, 128)',
    },
    typography: {
      fontFamily: '"Inter", "Noto Sans SC", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.6',
      headingFont: '"Inter", "Noto Sans SC", sans-serif',
    },
  },
  {
    id: 'minimal',
    name: '极简主题',
    description: '极简设计，突出内容本身',
    category: 'minimal',
    colors: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgb(100, 100, 100)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(0, 0, 0)',
      accent: 'rgb(0, 0, 0)',
      border: 'rgb(230, 230, 230)',
      name: 'rgb(0, 0, 0)',
      headline: 'rgb(100, 100, 100)',
      section_titles: 'rgb(0, 0, 0)',
      links: 'rgb(0, 0, 0)',
      connections: 'rgb(100, 100, 100)',
    },
    typography: {
      fontFamily: '"Helvetica Neue", "Noto Sans SC", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5',
      headingFont: '"Helvetica Neue", "Noto Sans SC", sans-serif',
    },
  },
  {
    id: 'engineeringresumes',
    name: '工程师主题',
    description: '专为技术岗位设计',
    category: 'professional',
    colors: {
      primary: 'rgb(0, 102, 204)',
      secondary: 'rgb(85, 85, 85)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(0, 0, 0)',
      accent: 'rgb(0, 102, 204)',
      border: 'rgb(204, 204, 204)',
      name: 'rgb(0, 0, 0)',
      headline: 'rgb(85, 85, 85)',
      section_titles: 'rgb(0, 102, 204)',
      links: 'rgb(0, 102, 204)',
      connections: 'rgb(85, 85, 85)',
    },
    typography: {
      fontFamily: '"Roboto", "Noto Sans SC", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.4',
      headingFont: '"Roboto", "Noto Sans SC", sans-serif',
    },
  },
  {
    id: 'sb2nov',
    name: 'Sb2nov 主题',
    description: '简洁单栏布局',
    category: 'minimal',
    colors: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgb(128, 128, 128)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(0, 0, 0)',
      accent: 'rgb(0, 0, 0)',
      border: 'rgb(220, 220, 220)',
      name: 'rgb(0, 0, 0)',
      headline: 'rgb(128, 128, 128)',
      section_titles: 'rgb(0, 0, 0)',
      links: 'rgb(0, 0, 0)',
      connections: 'rgb(128, 128, 128)',
    },
    typography: {
      fontFamily: '"Latin Modern Roman", serif',
      fontSize: '11pt',
      lineHeight: '1.5',
      headingFont: '"Latin Modern Roman", serif',
    },
  },
  {
    id: 'creative',
    name: '创意主题',
    description: '富有创意的设计风格',
    category: 'creative',
    colors: {
      primary: 'rgb(139, 92, 246)',
      secondary: 'rgb(236, 72, 153)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(31, 41, 55)',
      accent: 'rgb(168, 85, 247)',
      border: 'rgb(243, 244, 246)',
      name: 'rgb(139, 92, 246)',
      headline: 'rgb(236, 72, 153)',
      section_titles: 'rgb(139, 92, 246)',
      links: 'rgb(168, 85, 247)',
      connections: 'rgb(107, 114, 128)',
    },
    typography: {
      fontFamily: '"Poppins", "Noto Sans SC", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.6',
      headingFont: '"Poppins", "Noto Sans SC", sans-serif',
    },
  },
  {
    id: 'corporate',
    name: '企业主题',
    description: '正式的企业风格',
    category: 'professional',
    colors: {
      primary: 'rgb(30, 58, 138)',
      secondary: 'rgb(75, 85, 99)',
      background: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      accent: 'rgb(30, 58, 138)',
      border: 'rgb(209, 213, 219)',
      name: 'rgb(30, 58, 138)',
      headline: 'rgb(75, 85, 99)',
      section_titles: 'rgb(30, 58, 138)',
      links: 'rgb(30, 58, 138)',
      connections: 'rgb(75, 85, 99)',
    },
    typography: {
      fontFamily: '"Georgia", "Noto Serif SC", serif',
      fontSize: '10pt',
      lineHeight: '1.5',
      headingFont: '"Georgia", "Noto Serif SC", serif',
    },
  },
];

/**
 * 获取主题
 */
export function getTheme(themeId: string): Theme | undefined {
  return themes.find(t => t.id === themeId);
}

/**
 * 获取所有主题
 */
export function getAllThemes(): Theme[] {
  return themes;
}

/**
 * 按分类获取主题
 */
export function getThemesByCategory(category: Theme['category']): Theme[] {
  return themes.filter(t => t.category === category);
}

/**
 * 自定义主题颜色
 */
export function customizeThemeColors(themeId: string, colors: Partial<ThemeColors>): Theme | undefined {
  const theme = getTheme(themeId);
  if (!theme) return undefined;
  
  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...colors,
    },
  };
}

/**
 * 生成主题 CSS
 */
export function generateThemeCSS(theme: Theme): string {
  return `
    .cv-preview-container {
      font-family: ${theme.typography.fontFamily};
      font-size: ${theme.typography.fontSize};
      line-height: ${theme.typography.lineHeight};
      color: ${theme.colors.text};
      background-color: ${theme.colors.background};
    }
    
    .cv-name {
      color: ${theme.colors.name || theme.colors.primary};
      font-family: ${theme.typography.headingFont || theme.typography.fontFamily};
    }
    
    .cv-headline {
      color: ${theme.colors.headline || theme.colors.secondary};
    }
    
    .cv-section-title {
      color: ${theme.colors.section_titles || theme.colors.primary};
      font-family: ${theme.typography.headingFont || theme.typography.fontFamily};
    }
    
    .cv-link {
      color: ${theme.colors.links || theme.colors.accent};
    }
    
    .cv-connections {
      color: ${theme.colors.connections || theme.colors.secondary};
    }
    
    .cv-border {
      border-color: ${theme.colors.border};
    }
  `;
}
