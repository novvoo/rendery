"use client";

import { computeTimeSpan, formatDateRange, formatSingleDate } from '@/lib/date-formatter';
import { getTheme } from '@/lib/theme-manager';
import { BulletEntry, CVDocument, defaultLocale, EducationEntry, ExperienceEntry, ProjectEntry, PublicationEntry, SkillEntry } from '@/types/cv';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Divider, Link, Stack, Typography } from '@mui/material';

interface CVPreviewProps {
  data: CVDocument;
  customTypography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    headingFont?: string;
  };
}

export default function CVPreview({ data, customTypography }: CVPreviewProps) {
  // 验证数据
  if (!data || typeof data !== 'object') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="error">
          无效的 CV 数据格式
        </Typography>
      </Box>
    );
  }

  const { cv, design, locale = defaultLocale } = data;
  
  // 验证必需字段
  if (!cv || !cv.name) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="error">
          CV 数据缺少必需的 name 字段
        </Typography>
      </Box>
    );
  }

  const theme = design?.theme || 'classic';
  
  // 从主题管理器获取主题配置
  const themeConfig = getTheme(theme);
  const themeColors = themeConfig?.colors;
  const designColors = design?.colors;
  
  // 合并颜色配置，提供默认值
  const colors = {
    body: (themeColors as any)?.body || designColors?.body || 'rgb(0, 0, 0)',
    name: (themeColors as any)?.name || designColors?.name || 'rgb(0, 79, 144)',
    headline: (themeColors as any)?.headline || designColors?.headline || 'rgb(0, 79, 144)',
    connections: (themeColors as any)?.connections || designColors?.connections || 'rgb(0, 79, 144)',
    section_titles: (themeColors as any)?.section_titles || designColors?.section_titles || 'rgb(0, 79, 144)',
    links: (themeColors as any)?.links || designColors?.links || 'rgb(0, 79, 144)',
    background: (themeColors as any)?.background || 'white',
    text: (themeColors as any)?.text || (themeColors as any)?.body || designColors?.body || 'rgb(0, 0, 0)',
    border: (themeColors as any)?.border || 'rgb(229, 231, 235)',
    primary: (themeColors as any)?.primary || 'rgb(0, 79, 144)',
    secondary: (themeColors as any)?.secondary || 'rgb(107, 114, 128)',
  };
  
  const typography = themeConfig?.typography || {
    fontFamily: '"Source Sans 3", "Noto Sans SC", sans-serif',
    fontSize: '10pt',
    lineHeight: '1.5',
  };

  // 应用自定义字体设置
  const finalTypography = {
    fontFamily: customTypography?.fontFamily || typography.fontFamily,
    fontSize: customTypography?.fontSize || typography.fontSize,
    lineHeight: customTypography?.lineHeight || typography.lineHeight,
    headingFont: customTypography?.headingFont || typography.headingFont || typography.fontFamily,
  };

  const singleDateTemplate = 'MONTH_ABBREVIATION YEAR';
  const dateRangeTemplate = 'START_DATE – END_DATE';
  const timeSpanTemplate = 'HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS';

  // 根据主题应用不同的布局样式
  const getThemeStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          headerAlign: 'left' as const,
          headerJustify: 'flex-start' as const,
          sectionTitleStyle: {
            borderBottom: `2px solid ${colors.section_titles}`,
            paddingBottom: '3px',
            marginBottom: '10px',
          },
          nameSize: '32pt',
          headlineSize: '13pt',
        };
      case 'minimal':
        return {
          headerAlign: 'left' as const,
          headerJustify: 'flex-start' as const,
          sectionTitleStyle: {
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: '2px',
            marginBottom: '8px',
          },
          nameSize: '26pt',
          headlineSize: '11pt',
        };
      default: // classic, engineeringresumes, sb2nov, moderncv
        return {
          headerAlign: 'left' as const,
          headerJustify: 'flex-start' as const,
          sectionTitleStyle: {
            marginBottom: '10px',
          },
          nameSize: '30pt',
          headlineSize: '12pt',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <Box 
      className="cv-preview-container" 
      sx={{ 
        p: 0,
        mx: 'auto',
        my: 2,
        maxWidth: '210mm',
        minHeight: '297mm', // A4纸张高度
        bgcolor: colors.background || 'white', 
        fontFamily: finalTypography.fontFamily,
        fontSize: finalTypography.fontSize,
        lineHeight: finalTypography.lineHeight,
        color: colors.text || colors.body,
        boxShadow: 1,
        textAlign: 'left',
      }}
    >
      {/* 头部 */}
      <Box sx={{ mb: 2, textAlign: themeStyles.headerAlign, px: 5, pt: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 0.5,
            color: colors.name,
            fontSize: themeStyles.nameSize,
            fontFamily: finalTypography.headingFont,
          }}
        >
          {cv.name}
        </Typography>
        
        {cv.headline && (
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              color: colors.headline,
              fontSize: themeStyles.headlineSize,
            }}
          >
            {cv.headline}
          </Typography>
        )}
        
        <Stack 
          direction="row" 
          spacing={1.5} 
          justifyContent={themeStyles.headerJustify}
          flexWrap="wrap"
          sx={{ 
            gap: 1,
            color: colors.connections,
            fontSize: '9pt',
          }}
        >
          {cv.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <LocationOnIcon sx={{ fontSize: '14px' }} />
              <Typography variant="body2" sx={{ fontSize: '9pt' }}>{cv.location}</Typography>
            </Box>
          )}
          {cv.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <EmailIcon sx={{ fontSize: '14px' }} />
              <Link href={`mailto:${Array.isArray(cv.email) ? cv.email[0] : cv.email}`} color="inherit" sx={{ fontSize: '9pt' }}>
                {Array.isArray(cv.email) ? cv.email[0] : cv.email}
              </Link>
            </Box>
          )}
          {cv.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <PhoneIcon sx={{ fontSize: '14px' }} />
              <Typography variant="body2" sx={{ fontSize: '9pt' }}>{Array.isArray(cv.phone) ? cv.phone[0] : cv.phone}</Typography>
            </Box>
          )}
          {cv.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <LanguageIcon sx={{ fontSize: '14px' }} />
              <Link href={Array.isArray(cv.website) ? cv.website[0] : cv.website} target="_blank" color="inherit" sx={{ fontSize: '9pt' }}>
                {Array.isArray(cv.website) ? cv.website[0] : cv.website}
              </Link>
            </Box>
          )}
          {cv.social_networks?.map((social, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              {social.network === 'LinkedIn' && <LinkedInIcon sx={{ fontSize: '14px' }} />}
              {social.network === 'GitHub' && <GitHubIcon sx={{ fontSize: '14px' }} />}
              <Link href={`https://${social.network.toLowerCase()}.com/${social.username}`} target="_blank" color="inherit" sx={{ fontSize: '9pt' }}>
                {social.username}
              </Link>
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 1.5, mx: 5, borderColor: colors.section_titles }} />

      {/* 各个部分 */}
      {cv.sections && Object.keys(cv.sections).length > 0 ? (
        Object.entries(cv.sections).map(([title, entries]) => {
          // 验证 entries 是数组
          if (!Array.isArray(entries)) {
            console.warn(`Section "${title}" entries is not an array:`, entries);
            return null;
          }
          
          return (
            <Box key={title} sx={{ mb: 2, px: 5 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: colors.section_titles,
                  fontSize: '13pt',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: finalTypography.headingFont,
                  ...themeStyles.sectionTitleStyle,
                }}
              >
                {title}
              </Typography>
              
              {entries.map((entry: any, index: number) => {
                try {
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      {renderEntry(entry, locale, singleDateTemplate, dateRangeTemplate, timeSpanTemplate)}
                    </Box>
                  );
                } catch (error) {
                  console.error(`Error rendering entry in section "${title}":`, error, entry);
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
                        渲染条目时出错
                      </Typography>
                    </Box>
                  );
                }
              })}
            </Box>
          );
        })
      ) : (
        <Box sx={{ p: 2, px: 5, textAlign: 'left' }}>
          <Typography variant="body2" color="text.secondary">
            暂无内容
          </Typography>
        </Box>
      )}
      {/* 底部留白 */}
      <Box sx={{ pb: 4 }} />
    </Box>
  );
}

function renderEntry(
  entry: any, 
  locale: any, 
  singleDateTemplate: string,
  dateRangeTemplate: string,
  timeSpanTemplate: string
) {
  // 验证 entry
  if (!entry || (typeof entry !== 'object' && typeof entry !== 'string')) {
    return (
      <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
        无效的条目数据
      </Typography>
    );
  }
  // 教育经历
  if ('institution' in entry) {
    const edu = entry as EducationEntry;
    
    // 验证必需字段
    if (!edu.institution || !edu.degree || !edu.area) {
      return (
        <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
          教育经历缺少必需字段
        </Typography>
      );
    }
    
    const dateStr = formatDateRange(edu.start_date, edu.end_date, locale, singleDateTemplate, dateRangeTemplate);
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'baseline' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '10.5pt' }}>
            {edu.institution}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>
            {dateStr}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'baseline' }}>
          <Typography variant="body1" sx={{ fontSize: '9.5pt' }}>
            {edu.degree} - {edu.area}{(edu as any).GPA ? ` (GPA: ${(edu as any).GPA})` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>
            {edu.location}
          </Typography>
        </Box>
        {edu.summary && (
          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9.5pt' }}>
            {edu.summary}
          </Typography>
        )}
        {edu.highlights && edu.highlights.length > 0 && (
          <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 0, '& li': { mb: 0.2 } }}>
            {edu.highlights.map((highlight: any, i: number) => {
              // 处理 GPA 对象
              if (typeof highlight === 'object' && highlight.GPA) {
                return (
                  <li key={i}>
                    <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>
                      GPA: {highlight.GPA}
                    </Typography>
                  </li>
                );
              }
              return (
                <li key={i}>
                  <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>
                    {typeof highlight === 'string' ? highlight : JSON.stringify(highlight)}
                  </Typography>
                </li>
              );
            })}
          </Box>
        )}
      </Box>
    );
  }

  // 工作经历
  if ('company' in entry) {
    const exp = entry as ExperienceEntry;
    
    // 验证必需字段
    if (!exp.company || !exp.position) {
      return (
        <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
          工作经历缺少必需字段
        </Typography>
      );
    }
    
    const dateStr = formatDateRange(exp.start_date, exp.end_date, locale, singleDateTemplate, dateRangeTemplate);
    const timeSpan = computeTimeSpan(exp.start_date, exp.end_date, locale, new Date(), timeSpanTemplate);
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'baseline' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '10.5pt' }}>
            {exp.company}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>
            {dateStr}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'baseline' }}>
          <Typography variant="body1" sx={{ fontSize: '9.5pt', fontStyle: 'italic' }}>
            {exp.position}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>
            {exp.location}
          </Typography>
        </Box>
        {timeSpan && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '8.5pt' }}>
            {timeSpan}
          </Typography>
        )}
        {exp.summary && (
          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9.5pt' }}>
            {exp.summary}
          </Typography>
        )}
        {exp.highlights && exp.highlights.length > 0 && (
          <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 0, '& li': { mb: 0.2 } }}>
            {exp.highlights.map((highlight: any, i: number) => (
              <li key={i}>
                <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>
                  {typeof highlight === 'string' ? highlight : JSON.stringify(highlight)}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // 项目
  if ('name' in entry && !('company' in entry)) {
    const proj = entry as ProjectEntry;
    
    // 验证必需字段
    if (!proj.name) {
      return (
        <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
          项目缺少名称
        </Typography>
      );
    }
    
    const dateStr = proj.date 
      ? formatSingleDate(proj.date, locale, singleDateTemplate)
      : proj.start_date && proj.end_date
      ? formatDateRange(proj.start_date, proj.end_date, locale, singleDateTemplate, dateRangeTemplate)
      : '';
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'baseline' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '10.5pt' }}>
            {proj.name}
          </Typography>
          {dateStr && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>
              {dateStr}
            </Typography>
          )}
        </Box>
        {proj.summary && (
          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9.5pt' }}>
            {proj.summary}
          </Typography>
        )}
        {proj.highlights && proj.highlights.length > 0 && (
          <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 0, '& li': { mb: 0.2 } }}>
            {proj.highlights.map((highlight: any, i: number) => (
              <li key={i}>
                <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>
                  {typeof highlight === 'string' ? highlight : JSON.stringify(highlight)}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // 出版物
  if ('title' in entry && 'authors' in entry) {
    const pub = entry as PublicationEntry;
    
    // 验证必需字段
    if (!pub.title || !pub.authors || !Array.isArray(pub.authors)) {
      return (
        <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
          出版物数据格式错误
        </Typography>
      );
    }
    
    const dateStr = pub.date ? formatSingleDate(pub.date, locale, singleDateTemplate) : '';
    
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '10.5pt', mb: 0.3 }}>
          {pub.title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '9.5pt', mb: 0.3 }}>
          {pub.authors.join(', ')}
        </Typography>
        {pub.journal && (
          <Typography variant="body2" sx={{ fontSize: '9.5pt', fontStyle: 'italic' }}>
            {pub.journal}{dateStr && ` (${dateStr})`}
          </Typography>
        )}
        {pub.doi && (
          <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>
            DOI: <Link href={`https://doi.org/${pub.doi}`} target="_blank">{pub.doi}</Link>
          </Typography>
        )}
      </Box>
    );
  }

  // 技能
  if ('label' in entry && 'details' in entry) {
    const skill = entry as SkillEntry;
    
    // 验证必需字段
    if (!skill.label || !skill.details) {
      return (
        <Typography variant="body2" color="error" sx={{ fontSize: '9pt' }}>
          技能数据不完整
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', gap: 0.8, mb: 0.3 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '100px', fontSize: '9.5pt' }}>
          {skill.label}:
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '9.5pt' }}>{skill.details}</Typography>
      </Box>
    );
  }

  // Bullet 条目
  if ('bullet' in entry) {
    const bullet = entry as BulletEntry;
    
    if (!bullet.bullet) {
      return null;
    }
    
    return <Typography variant="body2" sx={{ fontSize: '9.5pt', mb: 0.2 }}>• {bullet.bullet}</Typography>;
  }

  // 默认文本条目
  if (typeof entry === 'string') {
    return <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>{entry}</Typography>;
  }

  // 未知类型
  console.warn('Unknown entry type:', entry);
  return (
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt', fontStyle: 'italic' }}>
      未知条目类型
    </Typography>
  );
}
