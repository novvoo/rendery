"use client";

import { Alert, Box, Divider, Link, Paper, Typography } from '@mui/material';
import Layout from '../components/Layout';

export default function DocsPage() {
  return (
    <Layout>
      <Box sx={{ my: 4, maxWidth: '900px', mx: 'auto' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          使用文档
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          RenderY Next.js 版本 - 在浏览器中创建专业Yaml
        </Alert>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            快速开始
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            1. 选择模板
          </Typography>
          <Typography variant="body1" paragraph>
            访问<Link href="/examples">示例模板</Link>页面，选择一个适合你的模板作为起点。
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. 编辑内容
          </Typography>
          <Typography variant="body1" paragraph>
            在<Link href="/editor">编辑器</Link>中使用 YAML 格式编写你的Yaml内容。左侧是编辑区，右侧实时预览效果。
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. 选择主题
          </Typography>
          <Typography variant="body1" paragraph>
            从顶部的主题选择器中选择你喜欢的主题风格：经典、现代、简约等。
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. 导出Yaml
          </Typography>
          <Typography variant="body1" paragraph>
            点击"导出 PDF"按钮生成 PDF 文档，或导出 YAML 文件保存你的Yaml数据。
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            YAML 格式说明
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            基本结构
          </Typography>
          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
{`cv:
  name: 你的姓名
  headline: 职位标题
  location: 城市, 国家
  email: your@email.com
  phone: +86-138-0000-0000
  website: https://yourwebsite.com
  sections:
    # 各个部分...`}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            教育经历
          </Typography>
          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
{`教育经历:
  - institution: 大学名称
    degree: 学位
    area: 专业
    start_date: 2018-09
    end_date: 2022-06
    location: 城市, 国家
    highlights:
      - 成就 1
      - 成就 2`}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            工作经历
          </Typography>
          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
{`工作经历:
  - company: 公司名称
    position: 职位
    start_date: 2022-07
    end_date: present
    location: 城市, 国家
    highlights:
      - 工作内容 1
      - 工作内容 2
      - 工作成果 3`}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            技能
          </Typography>
          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
{`技能:
  - label: 编程语言
    details: Python, JavaScript, Java
  - label: 框架
    details: React, Node.js, Django`}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            日期格式
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            支持以下日期格式：
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">年份：<code>2023</code></Typography></li>
            <li><Typography variant="body1">年月：<code>2023-06</code></Typography></li>
            <li><Typography variant="body1">完整日期：<code>2023-06-15</code></Typography></li>
            <li><Typography variant="body1">至今：<code>present</code></Typography></li>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            系统会自动计算工作时长，例如 "3 年 6 个月"。
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            主题配置
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            可用主题：
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1"><strong>classic</strong> - 经典主题，适合各行各业</Typography></li>
            <li><Typography variant="body1"><strong>modern</strong> - 现代主题，简约时尚</Typography></li>
            <li><Typography variant="body1"><strong>minimal</strong> - 极简主题，突出内容</Typography></li>
            <li><Typography variant="body1"><strong>engineeringresumes</strong> - 工程师专用主题</Typography></li>
            <li><Typography variant="body1"><strong>sb2nov</strong> - 单栏布局主题</Typography></li>
          </Box>

          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto', mt: 2 }}>
{`design:
  theme: classic`}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            多语言支持
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            支持中文和英文：
          </Typography>
          
          <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
{`locale:
  language: chinese  # 或 english`}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            常见问题
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Q: 如何保存我的Yaml？
          </Typography>
          <Typography variant="body1" paragraph>
            A: 点击编辑器顶部的"保存"按钮，输入名称后保存到浏览器本地存储。你也可以导出 YAML 文件到本地。
          </Typography>

          <Typography variant="h6" gutterBottom>
            Q: 如何导入已有的Yaml？
          </Typography>
          <Typography variant="body1" paragraph>
            A: 点击"导入 YAML"按钮，选择之前导出的 YAML 文件即可。
          </Typography>

          <Typography variant="h6" gutterBottom>
            Q: PDF 导出的格式可以调整吗？
          </Typography>
          <Typography variant="body1" paragraph>
            A: 可以通过选择不同的主题来改变 PDF 的样式和布局。
          </Typography>

          <Typography variant="h6" gutterBottom>
            Q: 数据存储在哪里？
          </Typography>
          <Typography variant="body1" paragraph>
            A: 所有数据都存储在浏览器的本地存储中，不会上传到服务器，保证隐私安全。
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
