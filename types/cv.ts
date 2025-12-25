export interface SocialNetwork {
  network: string;
  username: string;
}

export interface EducationEntry {
  institution: string;
  area: string;
  degree: string;
  start_date: string | number;
  end_date: string | number;
  location: string;
  summary?: string;
  highlights?: string[];
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date: string | number;
  end_date: string | number;
  location: string;
  summary?: string;
  highlights?: string[];
}

export interface ProjectEntry {
  name: string;
  date?: string | number;
  start_date?: string | number;
  end_date?: string | number;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface PublicationEntry {
  title: string;
  authors: string[];
  date: string | number;
  journal?: string;
  doi?: string;
  url?: string;
  summary?: string;
}

export interface SkillEntry {
  label: string;
  details: string;
}

export interface BulletEntry {
  bullet: string;
}

export type Entry = 
  | EducationEntry 
  | ExperienceEntry 
  | ProjectEntry 
  | PublicationEntry 
  | SkillEntry 
  | BulletEntry
  | string;

export interface CVData {
  name: string;
  headline?: string;
  location?: string;
  email?: string | string[];
  phone?: string | string[];
  website?: string | string[];
  photo?: string;
  social_networks?: SocialNetwork[];
  sections?: {
    [key: string]: Entry[];
  };
}

export interface Locale {
  language: string;
  last_updated: string;
  month: string;
  months: string;
  year: string;
  years: string;
  present: string;
  month_abbreviations: string[];
  month_names: string[];
}

export interface PageSettings {
  size: 'a4' | 'a5' | 'us-letter' | 'us-executive';
  top_margin: string;
  bottom_margin: string;
  left_margin: string;
  right_margin: string;
  show_footer: boolean;
  show_top_note: boolean;
}

export interface Colors {
  body: string;
  name: string;
  headline: string;
  connections: string;
  section_titles: string;
  links: string;
  footer?: string;
  top_note?: string;
}

export interface Typography {
  font_family: string;
  font_size: string;
  line_spacing: string;
  alignment: 'left' | 'justified' | 'justified-with-no-hyphenation';
}

export interface Design {
  theme: 'classic' | 'modern' | 'minimal' | 'engineeringresumes' | 'sb2nov' | 'moderncv';
  page?: PageSettings;
  colors?: Colors;
  typography?: Typography;
}

export interface Settings {
  current_date?: string;
  render_command?: {
    pdf_path?: string;
    markdown_path?: string;
    html_path?: string;
  };
}

export interface CVDocument {
  cv: CVData;
  design?: Design;
  locale?: Locale;
  settings?: Settings;
}

export const defaultLocale: Locale = {
  language: 'chinese',
  last_updated: '最后更新于',
  month: '月',
  months: '月',
  year: '年',
  years: '年',
  present: '至今',
  month_abbreviations: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  month_names: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
};

export const englishLocale: Locale = {
  language: 'english',
  last_updated: 'Last updated in',
  month: 'month',
  months: 'months',
  year: 'year',
  years: 'years',
  present: 'present',
  month_abbreviations: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
