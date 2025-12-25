import { BulletEntry, CVDocument, EducationEntry, ExperienceEntry, ProjectEntry, PublicationEntry, SkillEntry } from '@/types/cv';
import { formatDateRange } from './date-formatter';

export function exportToMarkdown(data: CVDocument): string {
  const { cv, locale } = data;
  const singleDateTemplate = 'MONTH_ABBREVIATION YEAR';
  const dateRangeTemplate = 'START_DATE – END_DATE';
  
  let markdown = '';
  
  // 头部
  if (cv.name) {
    markdown += `# ${cv.name}'s CV\n\n`;
  }
  
  // 联系信息
  if (cv.phone) {
    const phone = Array.isArray(cv.phone) ? cv.phone[0] : cv.phone;
    markdown += `- Phone: ${phone}\n`;
  }
  if (cv.email) {
    const email = Array.isArray(cv.email) ? cv.email[0] : cv.email;
    markdown += `- Email: [${email}](mailto:${email})\n`;
  }
  if (cv.location) {
    markdown += `- Location: ${cv.location}\n`;
  }
  if (cv.website) {
    const website = Array.isArray(cv.website) ? cv.website[0] : cv.website;
    markdown += `- Website: [${website}](${website})\n`;
  }
  if (cv.social_networks) {
    cv.social_networks.forEach(network => {
      markdown += `- ${network.network}: [${network.username}](https://${network.network.toLowerCase()}.com/${network.username})\n`;
    });
  }
  
  markdown += '\n';
  
  // 各个部分
  if (cv.sections) {
    Object.entries(cv.sections).forEach(([title, entries]) => {
      markdown += `## ${title}\n\n`;
      
      entries.forEach((entry: any) => {
        markdown += renderEntryToMarkdown(entry, locale, singleDateTemplate, dateRangeTemplate);
        markdown += '\n';
      });
    });
  }
  
  return markdown;
}

function renderEntryToMarkdown(
  entry: any,
  locale: any,
  singleDateTemplate: string,
  dateRangeTemplate: string
): string {
  let md = '';
  
  // 教育经历
  if ('institution' in entry) {
    const edu = entry as EducationEntry;
    const dateStr = formatDateRange(edu.start_date, edu.end_date, locale, singleDateTemplate, dateRangeTemplate);
    md += `### ${edu.institution}\n\n`;
    md += `- **Degree:** ${edu.degree} in ${edu.area}\n`;
    md += `- **Date:** ${dateStr}\n`;
    md += `- **Location:** ${edu.location}\n`;
    if (edu.highlights) {
      edu.highlights.forEach(h => md += `- ${h}\n`);
    }
    md += '\n';
  }
  
  // 工作经历
  else if ('company' in entry) {
    const exp = entry as ExperienceEntry;
    const dateStr = formatDateRange(exp.start_date, exp.end_date, locale, singleDateTemplate, dateRangeTemplate);
    md += `### ${exp.company}\n\n`;
    md += `- **Position:** ${exp.position}\n`;
    md += `- **Date:** ${dateStr}\n`;
    md += `- **Location:** ${exp.location}\n`;
    if (exp.highlights) {
      exp.highlights.forEach(h => md += `- ${h}\n`);
    }
    md += '\n';
  }
  
  // 项目
  else if ('name' in entry && !('company' in entry)) {
    const proj = entry as ProjectEntry;
    md += `### ${proj.name}\n\n`;
    if (proj.summary) {
      md += `${proj.summary}\n\n`;
    }
    if (proj.highlights) {
      proj.highlights.forEach(h => md += `- ${h}\n`);
    }
    md += '\n';
  }
  
  // 出版物
  else if ('title' in entry && 'authors' in entry) {
    const pub = entry as PublicationEntry;
    md += `### ${pub.title}\n\n`;
    md += `${pub.authors.join(', ')}\n\n`;
    if (pub.journal) {
      md += `*${pub.journal}*\n\n`;
    }
  }
  
  // 技能
  else if ('label' in entry && 'details' in entry) {
    const skill = entry as SkillEntry;
    md += `- **${skill.label}:** ${skill.details}\n`;
  }
  
  // Bullet
  else if ('bullet' in entry) {
    const bullet = entry as BulletEntry;
    md += `- ${bullet.bullet}\n`;
  }
  
  // 文本
  else if (typeof entry === 'string') {
    md += `${entry}\n\n`;
  }
  
  return md;
}
