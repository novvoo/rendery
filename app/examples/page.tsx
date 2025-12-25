"use client";

import { CVDocument, defaultLocale } from '@/types/cv';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import yaml from 'js-yaml';
import { useState } from 'react';
import CVPreview from '../components/CVPreview';
import GenericPreview from '../components/GenericPreview';
import Layout from '../components/Layout';

const examples = {
  general: `# application-config.yaml
# 主配置：微服务应用配置（支持多环境）
# 生成时间: 2025-12-25

# 默认配置（作为基础模板）
_defaults: &defaults
  logging:
    level: INFO
    format: json
    outputs:
      - stdout
      - file:///var/log/app.log
  metrics:
    enabled: true
    endpoint: /metrics
    prometheus: true
  database:
    pool_size: 10
    timeout: 30s
    ssl_mode: require
  cache:
    type: redis
    ttl: 3600
  feature_flags:
    new_checkout: false
    dark_mode: true

# ===== 开发环境配置 =====
dev:
  <<: *defaults
  logging:
    level: DEBUG
    outputs:
      - stdout
  database:
    host: localhost
    port: 5432
    name: app_dev
    user: dev_user
    password: "dev_password_123"
  cache:
    host: localhost
    port: 6379
  feature_flags:
    new_checkout: true  # 开发环境启用新功能

# ===== 预发布环境配置 =====
staging:
  <<: *defaults
  database:
    host: db-staging.internal
    port: 5432
    name: app_staging
    user: staging_user
    password: "\${STAGING_DB_PASSWORD}"  # 从环境变量注入
  cache:
    host: redis-staging.internal
    port: 6380
    cluster_mode: true
    nodes:
      - host: redis-staging-01
        port: 6380
      - host: redis-staging-02
        port: 6380
  observability:
    tracing:
      enabled: true
      provider: jaeger
      endpoint: http://jaeger-staging:14268/api/traces

# ===== 生产环境配置 =====
prod:
  <<: *defaults
  logging:
    level: WARN
    outputs:
      - file:///var/log/app.prod.log
      - syslog://prod-logger.internal:514
  database:
    host: prod-db-cluster.internal
    port: 5432
    name: app_production
    user: prod_user
    password: "\${PROD_DB_PASSWORD}"
    replicas:
      - host: prod-db-replica-01
        port: 5432
      - host: prod-db-replica-02
        port: 5432
  cache:
    host: redis-prod-cluster.internal
    port: 6381
    cluster_mode: true
    sentinel:
      masters:
        - name: cache-master-a
          quorum: 2
      sentinels:
        - host: sentinel-01
          port: 26379
        - host: sentinel-02
          port: 26379
        - host: sentinel-03
          port: 26379
  security:
    tls:
      enabled: true
      cert_file: /etc/ssl/certs/app.crt
      key_file: /etc/ssl/private/app.key
    cors:
      allowed_origins:
        - https://app.example.com
        - https://admin.example.com
      allowed_methods: [GET, POST, PUT, DELETE]
      max_age: 86400
  autoscaling:
    min_replicas: 3
    max_replicas: 20
    cpu_threshold: 70
    memory_threshold: 80`,
  
  basic: `cv:
  name: 张三
  headline: 软件工程师
  location: 北京, 中国
  email: zhangsan@example.com
  phone: +86-138-0000-0000
  sections:
    教育经历:
      - institution: 清华大学
        degree: 学士
        area: 计算机科学
        start_date: 2018-09
        end_date: 2022-06
        location: 北京, 中国
        highlights:
          - GPA: 3.8/4.0
          - 优秀毕业生
    技能:
      - label: 编程语言
        details: Python, JavaScript, Java
      - label: 框架
        details: React, Django, Spring Boot
design:
  theme: classic
locale:
  language: chinese`,
  
  complete: `cv:
  name: John Doe
  headline: Senior Software Engineer
  location: San Francisco, CA
  email: john.doe@example.com
  phone: +1-234-567-8900
  website: https://johndoe.com
  social_networks:
    - network: LinkedIn
      username: johndoe
    - network: GitHub
      username: johndoe
  sections:
    Experience:
      - company: Tech Company
        position: Senior Software Engineer
        start_date: 2020-01
        end_date: present
        location: San Francisco, CA
        highlights:
          - Led development of microservices architecture
          - Improved system performance by 50%
          - Mentored 5 junior developers
    Education:
      - institution: Stanford University
        degree: Master of Science
        area: Computer Science
        start_date: 2016-09
        end_date: 2018-06
        location: Stanford, CA
        highlights:
          - "GPA: 3.9/4.0"
          - Research in Machine Learning
    Skills:
      - label: Languages
        details: Python, JavaScript, TypeScript, Go
      - label: Frameworks
        details: React, Node.js, Django, FastAPI
design:
  theme: modern
locale:
  language: english`,

  chinese: `cv:
  name: 李明
  headline: 全栈工程师
  location: 上海, 中国
  email: liming@example.com
  phone: +86-138-0000-0000
  website: https://liming.dev
  social_networks:
    - network: GitHub
      username: liming
  sections:
    工作经历:
      - company: 互联网公司
        position: 高级全栈工程师
        start_date: 2020-03
        end_date: present
        location: 上海, 中国
        highlights:
          - 负责核心业务系统的架构设计和开发
          - 带领团队完成多个重要项目
          - 优化系统性能，提升用户体验
    教育经历:
      - institution: 复旦大学
        degree: 硕士
        area: 软件工程
        start_date: 2017-09
        end_date: 2020-06
        location: 上海, 中国
        highlights:
          - "GPA: 3.7/4.0"
          - 优秀毕业生
    项目经历:
      - name: 电商平台
        start_date: 2021-01
        end_date: 2022-12
        summary: 大型电商平台的微服务架构设计与实现
        highlights:
          - 支持日均百万级订单处理
          - 系统可用性达到99.99%
    技能:
      - label: 编程语言
        details: Java, Python, JavaScript, Go
      - label: 框架技术
        details: Spring Boot, React, Vue.js, Django
      - label: 数据库
        details: MySQL, Redis, MongoDB
      - label: 云服务
        details: AWS, Docker, Kubernetes
design:
  theme: minimal
locale:
  language: chinese`,
};

export default function ExamplesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<CVDocument | null>(null);
  const [genericPreviewData, setGenericPreviewData] = useState<any>(null);
  
  const exampleKeys = Object.keys(examples) as Array<keyof typeof examples>;
  const currentExample = examples[exampleKeys[activeTab]];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentExample);
    alert('已复制到剪贴板！');
  };

  const handleUseTemplate = () => {
    localStorage.setItem('cv-last-edit', currentExample);
    window.location.href = '/editor';
  };

  const handlePreview = () => {
    try {
      const parsed = yaml.load(currentExample);
      
      // 检查是否是 CV 类型
      if (activeTab === 0) {
        // general.yaml - 使用通用预览
        setGenericPreviewData(parsed);
        setPreviewData(null);
      } else {
        // CV 类型
        const cvData = parsed as CVDocument;
        
        // 设置默认值
        if (!cvData.design) {
          cvData.design = { theme: 'classic' };
        }
        if (!cvData.locale) {
          cvData.locale = defaultLocale;
        }
        
        setPreviewData(cvData);
        setGenericPreviewData(null);
      }
      
      setPreviewOpen(true);
    } catch (e) {
      alert('YAML 解析错误: ' + (e as Error).message);
    }
  };

  return (
    <Layout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          示例模板
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          选择一个示例模板开始创建你的Yaml
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="通用配置（General）" />
            <Tab label="基础模板" />
            <Tab label="完整示例（英文）" />
            <Tab label="完整示例（中文）" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {activeTab === 0 && '通用配置示例'}
                    {activeTab === 1 && '基础模板'}
                    {activeTab === 2 && '完整示例（英文）'}
                    {activeTab === 3 && '完整示例（中文）'}
                  </Typography>
                  <Box>
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                      onClick={handlePreview} 
                      sx={{ mr: 1 }}
                    >
                      预览
                    </Button>
                    <Button size="small" onClick={handleCopy} sx={{ mr: 1 }}>
                      复制
                    </Button>
                    <Button size="small" variant="contained" onClick={handleUseTemplate}>
                      使用此模板
                    </Button>
                  </Box>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    maxHeight: '600px',
                  }}
                >
                  {currentExample}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  使用说明
                </Typography>
                <Typography variant="body2" paragraph>
                  1. 选择一个模板
                </Typography>
                <Typography variant="body2" paragraph>
                  2. 点击"预览"查看效果
                </Typography>
                <Typography variant="body2" paragraph>
                  3. 点击"使用此模板"进入编辑器
                </Typography>
                <Typography variant="body2" paragraph>
                  4. 在编辑器中修改内容
                </Typography>
                <Typography variant="body2" paragraph>
                  5. 导出为 PDF 或其他格式
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  YAML 语法提示
                </Typography>
                <Typography variant="body2" paragraph>
                  • 使用缩进表示层级关系（2个空格）
                </Typography>
                <Typography variant="body2" paragraph>
                  • 列表项使用 - 开头
                </Typography>
                <Typography variant="body2" paragraph>
                  • 键值对使用 : 分隔
                </Typography>
                <Typography variant="body2" paragraph>
                  • 字符串通常不需要引号
                </Typography>
                <Typography variant="body2" paragraph>
                  • 特殊字符需要用引号包裹
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  主题说明
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>classic:</strong> 经典专业风格
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>modern:</strong> 现代简洁风格
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>minimal:</strong> 极简主义风格
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 预览对话框 */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Yaml预览</Typography>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleUseTemplate}
            >
              使用此模板
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            {previewData && <CVPreview data={previewData} />}
            {genericPreviewData && <GenericPreview data={genericPreviewData} title="应用配置" />}
          </Paper>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
