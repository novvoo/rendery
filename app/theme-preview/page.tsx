"use client";

import ThemeComparison from '@/app/components/ThemeComparison';
import { getAllThemes } from '@/lib/theme-manager';
import { Design } from '@/types/cv';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareIcon from '@mui/icons-material/Compare';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CVPreview from '../components/CVPreview';
import Layout from '../components/Layout';

const sampleCV = {
  cv: {
    name: '张三',
    headline: '高级软件工程师',
    location: '北京, 中国',
    email: 'zhangsan@example.com',
    phone: '+86-138-0000-0000',
    website: 'https://zhangsan.dev',
    social_networks: [
      { network: 'LinkedIn', username: 'zhangsan' },
      { network: 'GitHub', username: 'zhangsan' },
    ],
    sections: {
      '工作经历': [
        {
          company: '科技公司',
          position: '高级软件工程师',
          start_date: '2022-07',
          end_date: 'present',
          location: '北京, 中国',
          highlights: [
            '领导团队开发核心业务系统，服务百万用户',
            '优化系统架构，提升性能50%，降低成本30%',
            '建立CI/CD流程，提高团队开发效率',
          ],
        },
        {
          company: '创业公司',
          position: '全栈工程师',
          start_date: '2020-03',
          end_date: '2022-06',
          location: '上海, 中国',
          highlights: [
            '从零搭建产品技术架构',
            '开发Web和移动端应用',
            '参与产品设计和用户体验优化',
          ],
        },
      ],
      '教育经历': [
        {
          institution: '清华大学',
          area: '计算机科学',
          degree: '学士',
          start_date: '2016-09',
          end_date: '2020-06',
          location: '北京, 中国',
          highlights: ['GPA: 3.8/4.0', '优秀毕业生', '国家奖学金获得者'],
        },
      ],
      '项目经历': [
        {
          name: '开源项目 - RenderY',
          date: '2023',
          summary: '一个现代化的Yaml渲染工具',
          highlights: [
            'GitHub 上获得 2000+ stars',
            '支持多种主题和导出格式',
            '被多家公司和个人采用',
          ],
        },
      ],
      '技能': [
        { label: '编程语言', details: 'Python, JavaScript, TypeScript, Java, Go' },
        { label: '前端技术', details: 'React, Next.js, Vue.js, Tailwind CSS' },
        { label: '后端技术', details: 'Node.js, Spring Boot, Django, FastAPI' },
        { label: '数据库', details: 'MySQL, PostgreSQL, MongoDB, Redis' },
        { label: '工具', details: 'Git, Docker, Kubernetes, AWS, CI/CD' },
      ],
    },
  },
  locale: {
    language: 'chinese',
    last_updated: '最后更新于',
    month: '月',
    months: '月',
    year: '年',
    years: '年',
    present: '至今',
    month_abbreviations: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    month_names: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
};

export default function ThemePreviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const allThemes = getAllThemes();

  const handleUseTheme = (themeId: string) => {
    router.push(`/editor?theme=${themeId}`);
  };

  return (
    <Layout>
      <Box sx={{ my: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.back()}
          >
            返回
          </Button>
          <Typography variant="h3" component="h1">
            主题预览中心
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.secondary" paragraph>
          浏览和对比所有可用主题，找到最适合你的风格
        </Typography>

        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="单主题预览" />
          <Tab label="主题对比" icon={<CompareIcon />} iconPosition="end" />
          <Tab label="主题列表" />
        </Tabs>

        {/* 单主题预览 */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      选择主题
                    </Typography>
                    <Stack spacing={1}>
                      {allThemes.map((theme) => (
                        <Button
                          key={theme.id}
                          variant={selectedTheme === theme.id ? 'contained' : 'outlined'}
                          onClick={() => setSelectedTheme(theme.id)}
                          fullWidth
                          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                            <Stack direction="row" spacing={0.5}>
                              <Box sx={{ width: 12, height: 12, bgcolor: theme.colors.primary, borderRadius: 0.5 }} />
                              <Box sx={{ width: 12, height: 12, bgcolor: theme.colors.secondary, borderRadius: 0.5 }} />
                            </Stack>
                            <Typography variant="body2">{theme.name}</Typography>
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => handleUseTheme(selectedTheme)}
                    >
                      使用此主题
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    {(() => {
                      const theme = allThemes.find(t => t.id === selectedTheme);
                      return theme ? (
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            {theme.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {theme.description}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip label={getCategoryLabel(theme.category)} size="small" color="primary" />
                            <Chip label={theme.typography.fontFamily.split(',')[0].replace(/"/g, '')} size="small" />
                          </Stack>
                        </Box>
                      ) : null;
                    })()}
                  </Box>
                  <Box sx={{ height: 700, overflow: 'auto' }}>
                    <CVPreview 
                      data={{
                        ...sampleCV,
                        design: { theme: selectedTheme as Design['theme'] },
                      }} 
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* 主题对比 */}
        {activeTab === 1 && (
          <ThemeComparison 
            cvData={sampleCV} 
            onSelectTheme={handleUseTheme}
          />
        )}

        {/* 主题列表 */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {allThemes.map((theme) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={theme.id}>
                <Card sx={{ height: '100%' }}>
                  <Box 
                    sx={{ 
                      height: 200, 
                      overflow: 'hidden',
                      bgcolor: theme.colors.background,
                      p: 2,
                    }}
                  >
                    <Box sx={{ fontFamily: theme.typography.fontFamily, transform: 'scale(0.7)', transformOrigin: 'top left' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: theme.colors.name,
                          fontWeight: 'bold',
                          mb: 0.5,
                        }}
                      >
                        张三
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.colors.headline,
                          mb: 1,
                        }}
                      >
                        软件工程师
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.colors.section_titles,
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          mb: 0.5,
                        }}
                      >
                        工作经历
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.colors.text }}>
                        科技公司 • 软件工程师
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {theme.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {theme.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label={getCategoryLabel(theme.category)} size="small" color="primary" variant="outlined" />
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      <Box sx={{ width: 24, height: 24, bgcolor: theme.colors.primary, borderRadius: 1 }} />
                      <Box sx={{ width: 24, height: 24, bgcolor: theme.colors.secondary, borderRadius: 1 }} />
                      <Box sx={{ width: 24, height: 24, bgcolor: theme.colors.accent, borderRadius: 1 }} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setSelectedTheme(theme.id);
                          setActiveTab(0);
                        }}
                      >
                        预览
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleUseTheme(theme.id)}
                      >
                        使用
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    professional: '专业',
    modern: '现代',
    creative: '创意',
    minimal: '极简',
  };
  return labels[category] || category;
}
