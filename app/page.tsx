"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          RenderY - Yaml渲染器
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          用 YAML 编写Yaml，生成专业的 PDF 文档
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
          <Chip label="YAML 编辑" color="primary" />
          <Chip label="实时预览" color="success" />
          <Chip label="多主题" color="info" />
          <Chip label="PDF 导出" color="secondary" />
        </Stack>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        欢迎使用 RenderY！用简单的 YAML 格式编写Yaml，自动生成专业排版的 PDF 文档。
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                YAML 编辑器
              </Typography>
              <Typography variant="body2" color="text.secondary">
                使用简洁的 YAML 格式编写Yaml，支持语法高亮和自动补全。
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">易用性</Typography>
                <LinearProgress variant="determinate" value={90} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" href="/editor">
                开始编辑
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                实时预览
              </Typography>
              <Typography variant="body2" color="text.secondary">
                编辑时即时查看Yaml效果，所见即所得的编辑体验。
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip label="实时" size="small" color="primary" />
                <Chip label="快速" size="small" color="success" />
                <Chip label="准确" size="small" color="info" />
              </Stack>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" href="/examples">查看示例</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                多种主题
              </Typography>
              <Typography variant="body2" color="text.secondary">
                提供多种专业主题模板，适合不同行业和职位需求。支持实时预览和对比。
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">主题数量</Typography>
                <LinearProgress variant="determinate" value={70} color="success" />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" href="/theme-preview" color="primary">主题预览</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                快速开始
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  1. 创建 YAML 文件
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  使用简单的 YAML 格式编写你的Yaml内容，包括个人信息、教育经历、工作经验等。
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  2. 选择主题
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  从多种专业主题中选择最适合你的风格，支持自定义颜色和排版。
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  3. 导出 PDF
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  一键生成专业排版的 PDF Yaml，完美的字体和间距，随时可以打印或发送。
                </Typography>
                
                <Button variant="contained" size="large" href="/editor" sx={{ mt: 2 }}>
                  立即开始
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                功能特性
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  5+
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  专业主题
                </Typography>
                
                <Typography variant="h3" color="success.main" gutterBottom>
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  开源免费
                </Typography>
                
                <Typography variant="h3" color="info.main" gutterBottom>
                  ∞
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  自定义可能
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
