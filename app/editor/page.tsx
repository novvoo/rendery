'use client';

import { exportToMarkdown } from '@/lib/markdown-exporter';
import { getAllThemes } from '@/lib/theme-manager';
import { validateCV, ValidationError } from '@/lib/yaml-validator';
import { CVDocument, defaultLocale, Design } from '@/types/cv';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import PaletteIcon from '@mui/icons-material/Palette';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import yaml from 'js-yaml';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CVPreview from '../components/CVPreview';
import DockerComposePreview from '../components/DockerComposePreview';
import GenericPreview from '../components/GenericPreview';
import GitHubActionsPreview from '../components/GitHubActionsPreview';
import K8sPreview from '../components/K8sPreview';
import Layout from '../components/Layout';

type TemplateType = 'cv' | 'k8s' | 'docker-compose' | 'github-actions' | 'generic';

function detectTemplateType(yamlText: string): TemplateType {
  if (yamlText.includes('apiVersion:') && yamlText.includes('kind:')) {
    return 'k8s';
  }
  if (yamlText.includes('version:') && yamlText.includes('services:')) {
    return 'docker-compose';
  }
  if (yamlText.includes('on:') && (yamlText.includes('jobs:') || yamlText.includes('runs-on:'))) {
    return 'github-actions';
  }
  if (yamlText.includes('cv:') || yamlText.includes('name:') && yamlText.includes('sections:')) {
    return 'cv';
  }
  return 'generic';
}

const defaultYamls: Record<TemplateType, string> = {
  cv: `cv:
  name: 张三
  headline: 软件工程师
  location: 北京, 中国
  email: zhangsan@example.com
  phone: +86-138-0000-0000
  website: https://example.com
  social_networks:
    - network: LinkedIn
      username: zhangsan
    - network: GitHub
      username: zhangsan
  sections:
    教育经历:
      - institution: 清华大学
        area: 计算机科学
        degree: 学士
        start_date: 2018-09
        end_date: 2022-06
        location: 北京, 中国
        highlights:
          - GPA: 3.8/4.0
          - 优秀毕业生
    工作经历:
      - company: 科技公司
        position: 软件工程师
        start_date: 2022-07
        end_date: present
        location: 北京, 中国
        highlights:
          - 开发和维护核心业务系统
          - 优化系统性能，提升响应速度50%
          - 领导团队完成多个重要项目
    技能:
      - label: 编程语言
        details: Python, JavaScript, TypeScript, Java, Go
      - label: 框架
        details: React, Next.js, Node.js, Spring Boot
design:
  theme: classic
locale:
  language: chinese`,
  
  k8s: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
  labels:
    app: web-app
    tier: frontend
    environment: production
    version: v1.2.0
  annotations:
    description: "Web application deployment with full production configuration"
    version: "1.2.0"
    maintainer: "devops@example.com"
spec:
  replicas: 3
  revisionHistoryLimit: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: web-app
      tier: frontend
  template:
    metadata:
      labels:
        app: web-app
        tier: frontend
        version: v1.2.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
    spec:
      serviceAccountName: web-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      initContainers:
      - name: init-db-check
        image: busybox:1.35
        command: ['sh', '-c', 'until nc -z postgres-service 5432; do echo waiting for db; sleep 2; done']
      containers:
      - name: web-app
        image: registry.example.com/web-app:v1.2.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        - containerPort: 9090
          name: metrics
          protocol: TCP
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: LOG_LEVEL
          value: "info"
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db.host
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db.password
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /health/startup
            port: 8080
          initialDelaySeconds: 0
          periodSeconds: 5
          failureThreshold: 30
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
          readOnly: true
        - name: cache-volume
          mountPath: /var/cache
      volumes:
      - name: config-volume
        configMap:
          name: app-config
      - name: cache-volume
        emptyDir:
          sizeLimit: 500Mi
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - web-app
              topologyKey: kubernetes.io/hostname
---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: production
  labels:
    app: web-app
spec:
  type: LoadBalancer
  sessionAffinity: ClientIP
  selector:
    app: web-app
    tier: frontend
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  db.host: "postgres-service.production.svc.cluster.local"
  db.port: "5432"
  app.properties: |
    server.port=8080
    spring.datasource.url=jdbc:postgresql://postgres-service:5432/webapp_prod
    logging.level.root=INFO
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: web-app-tls
  namespace: production
spec:
  secretName: web-app-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - app.example.com
  - www.app.example.com`,
  
  'docker-compose': `version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: example
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,
  
  'github-actions': `name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build`,
  
  generic: `# application-config.yaml
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
};

export default function EditorPage() {
  return (
    <Suspense fallback={
      <Layout>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    }>
      <EditorPageContent />
    </Suspense>
  );
}

function EditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [templateType, setTemplateType] = useState<TemplateType>('generic');
  const [yamlText, setYamlText] = useState(defaultYamls.generic);
  const [parsedData, setParsedData] = useState<any>(null);
  const [cvData, setCvData] = useState<CVDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [theme, setTheme] = useState('classic');
  const [activeTab, setActiveTab] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedCVs, setSavedCVs] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [leftWidth, setLeftWidth] = useState(35); // 左侧面板宽度百分比，降低以增加预览占比
  const [isDragging, setIsDragging] = useState(false);
  const [themePreviewId, setThemePreviewId] = useState<string | null>(null);
  const [themeDialogTab, setThemeDialogTab] = useState(0);
  
  // 字体和字号自定义设置
  const [customFontFamily, setCustomFontFamily] = useState<string>('');
  const [customFontSize, setCustomFontSize] = useState<string>('');
  const [customLineHeight, setCustomLineHeight] = useState<string>('');
  const [customHeadingFont, setCustomHeadingFont] = useState<string>('');
  
  // 保存自定义字体设置到 localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('custom-font-family', customFontFamily);
    localStorage.setItem('custom-font-size', customFontSize);
    localStorage.setItem('custom-line-height', customLineHeight);
    localStorage.setItem('custom-heading-font', customHeadingFont);
  }, [customFontFamily, customFontSize, customLineHeight, customHeadingFont, mounted]);
  
  const allThemes = getAllThemes();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // 从 URL 参数获取主题
    const themeParam = searchParams.get('theme');
    if (themeParam) {
      setTheme(themeParam);
    }
    
    // 加载保存的列表
    const saved = localStorage.getItem('saved-yamls');
    if (saved) {
      setSavedCVs(JSON.parse(saved));
    }
    
    // 尝试加载上次编辑的内容
    const lastEdit = localStorage.getItem('yaml-last-edit');
    const lastType = localStorage.getItem('yaml-last-type') as TemplateType;
    if (lastEdit && lastType) {
      setYamlText(lastEdit);
      setTemplateType(lastType);
    }
    
    // 加载自定义字体设置
    const savedFontFamily = localStorage.getItem('custom-font-family');
    const savedFontSize = localStorage.getItem('custom-font-size');
    const savedLineHeight = localStorage.getItem('custom-line-height');
    const savedHeadingFont = localStorage.getItem('custom-heading-font');
    
    if (savedFontFamily) setCustomFontFamily(savedFontFamily);
    if (savedFontSize) setCustomFontSize(savedFontSize);
    if (savedLineHeight) setCustomLineHeight(savedLineHeight);
    if (savedHeadingFont) setCustomHeadingFont(savedHeadingFont);
  }, [searchParams, mounted]);

  useEffect(() => {
    try {
      // 自动检测模板类型
      const detectedType = detectTemplateType(yamlText);
      if (detectedType !== templateType) {
        setTemplateType(detectedType);
      }
      
      let parsed: any;
      
      // 对于 K8s、Docker Compose 和 GitHub Actions，可能包含多个文档
      if (detectedType === 'k8s' || detectedType === 'docker-compose' || detectedType === 'github-actions') {
        // 检查是否包含多个文档
        if (yamlText.includes('\n---\n') || yamlText.includes('\n---')) {
          const docs: any[] = [];
          yaml.loadAll(yamlText, (doc) => {
            if (doc) docs.push(doc);
          });
          // 如果只有一个文档，直接使用；否则使用数组
          parsed = docs.length === 1 ? docs[0] : docs;
        } else {
          parsed = yaml.load(yamlText);
        }
      } else {
        parsed = yaml.load(yamlText);
      }
      
      setParsedData(parsed);
      
      // 如果是Yaml类型，进行特殊处理
      if (detectedType === 'cv') {
        const cvDoc = parsed as CVDocument;
        
        // 设置默认值
        if (!cvDoc.design) {
          cvDoc.design = { theme: theme as Design['theme'] };
        } else if (cvDoc.design.theme) {
          setTheme(cvDoc.design.theme);
        }
        if (!cvDoc.locale) {
          cvDoc.locale = defaultLocale;
        }
        
        // 验证数据
        const errors = validateCV(cvDoc);
        setValidationErrors(errors);
        setCvData(cvDoc);
      } else {
        setCvData(null);
        setValidationErrors([]);
      }
      
      setError(null);
      
      // 自动保存到 localStorage
      localStorage.setItem('yaml-last-edit', yamlText);
      localStorage.setItem('yaml-last-type', detectedType);
    } catch (e) {
      setError('YAML 解析错误: ' + (e as Error).message);
      setValidationErrors([]);
      setParsedData(null);
      setCvData(null);
    }
  }, [yamlText, theme]);

  const handleSave = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    if (saveName && parsedData) {
      const key = `yaml-${saveName}`;
      localStorage.setItem(key, yamlText);
      localStorage.setItem(`${key}-type`, templateType);
      
      const newSavedCVs = [...savedCVs, saveName];
      setSavedCVs(newSavedCVs);
      localStorage.setItem('saved-yamls', JSON.stringify(newSavedCVs));
      
      setSaveDialogOpen(false);
      setSaveName('');
      alert('保存成功！');
    }
  };

  const handleLoad = (name: string) => {
    const key = `yaml-${name}`;
    const saved = localStorage.getItem(key);
    const savedType = localStorage.getItem(`${key}-type`) as TemplateType;
    if (saved) {
      setYamlText(saved);
      if (savedType) {
        setTemplateType(savedType);
      }
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`确定要删除 "${name}" 吗？`)) {
      const key = `yaml-${name}`;
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-type`);
      
      const newSavedCVs = savedCVs.filter(n => n !== name);
      setSavedCVs(newSavedCVs);
      localStorage.setItem('saved-yamls', JSON.stringify(newSavedCVs));
    }
  };

  const handleExportPDF = async () => {
    if (!parsedData) return;
    
    setExporting(true);
    try {
      // 动态导入库以避免SSR问题
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      // 找到预览区域
      const previewElement = document.querySelector('.cv-preview-container, .k8s-preview-container, .docker-compose-preview, .github-actions-preview, .generic-preview-container') as HTMLElement;
      if (!previewElement) {
        alert('无法找到预览区域');
        return;
      }
      
      // 保存原始样式
      const originalOverflow = previewElement.style.overflow;
      const originalHeight = previewElement.style.height;
      const parentElement = previewElement.parentElement as HTMLElement;
      const parentOriginalOverflow = parentElement?.style.overflow;
      
      // 临时移除滚动条限制，让内容完全展开
      previewElement.style.overflow = 'visible';
      previewElement.style.height = 'auto';
      if (parentElement) {
        parentElement.style.overflow = 'visible';
      }
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 创建canvas，捕获完整内容
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null, // 不强制背景色，保留原始背景
        windowHeight: previewElement.scrollHeight,
        height: previewElement.scrollHeight,
        allowTaint: true, // 允许跨域图片
        foreignObjectRendering: false, // 禁用 foreignObject 渲染，提高兼容性
      });
      
      // 恢复原始样式
      previewElement.style.overflow = originalOverflow;
      previewElement.style.height = originalHeight;
      if (parentElement) {
        parentElement.style.overflow = parentOriginalOverflow;
      }
      
      // 转换为PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4宽度
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // 如果内容超过一页，需要分页
      const pageHeight = 297; // A4高度
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = templateType === 'cv' && cvData?.cv.name 
        ? `${cvData.cv.name}.pdf`
        : `${templateType}-export.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleExportYAML = () => {
    const blob = new Blob([yamlText], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = templateType === 'cv' && cvData?.cv.name 
      ? `${cvData.cv.name}.yaml`
      : `${templateType}-export.yaml`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (cvData) {
      const markdown = exportToMarkdown(cvData);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.cv.name || 'cv'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportYAML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setYamlText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCopyYAML = () => {
    navigator.clipboard.writeText(yamlText);
    alert('已复制到剪贴板！');
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (cvData && templateType === 'cv') {
      const updatedYaml = yamlText.replace(
        /theme:\s*\w+/,
        `theme: ${newTheme}`
      );
      setYamlText(updatedYaml);
    }
  };
  
  const handleTemplateTypeChange = (newType: TemplateType) => {
    if (confirm('切换模板类型将替换当前内容，是否继续？')) {
      setTemplateType(newType);
      setYamlText(defaultYamls[newType]);
    }
  };
  
  const getTemplateTypeLabel = (type: TemplateType): string => {
    const labels: Record<TemplateType, string> = {
      cv: 'Yaml',
      k8s: 'Kubernetes',
      'docker-compose': 'Docker Compose',
      'github-actions': 'GitHub Actions',
      generic: '通用',
    };
    return labels[type] || type;
  };

  // 拖动分隔条处理
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const container = document.getElementById('editor-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        if (newWidth > 20 && newWidth < 80) {
          setLeftWidth(newWidth);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // 防止 hydration 错误
  if (!mounted) {
    return (
      <Layout>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ my: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
          {/* 模板类型选择 */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>模板类型</InputLabel>
            <Select
              value={templateType}
              label="模板类型"
              onChange={(e) => handleTemplateTypeChange(e.target.value as TemplateType)}
            >
              <MenuItem value="cv">Yaml (CV)</MenuItem>
              <MenuItem value="k8s">Kubernetes</MenuItem>
              <MenuItem value="docker-compose">Docker Compose</MenuItem>
              <MenuItem value="github-actions">GitHub Actions</MenuItem>
              <MenuItem value="generic">通用 YAML</MenuItem>
            </Select>
          </FormControl>
          
          {/* 当前类型标签 */}
          <Chip 
            label={`当前: ${getTemplateTypeLabel(templateType)}`} 
            color="primary" 
            variant="outlined"
          />
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            保存
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} 
            onClick={handleExportPDF}
            disabled={!parsedData || !!error || exporting}
          >
            {exporting ? '导出中...' : '导出 PDF'}
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportYAML}>
            导出 YAML
          </Button>
          {templateType === 'cv' && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportMarkdown}>
              导出 Markdown
            </Button>
          )}
          <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
            导入 YAML
            <input type="file" hidden accept=".yaml,.yml" onChange={handleImportYAML} />
          </Button>
        </Stack>
        
        {/* 主题选择和字体设置 */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
          {/* 主题设置 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>主题</InputLabel>
            <Select
              value={theme}
              label="主题"
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              {allThemes.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            startIcon={<PaletteIcon />}
            onClick={() => setThemeDialogOpen(true)}
          >
            浏览主题
          </Button>
          
          {/* 字体设置 */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>正文字体</InputLabel>
            <Select
              value={customFontFamily}
              label="正文字体"
              onChange={(e) => setCustomFontFamily(e.target.value)}
            >
              <MenuItem value="">默认</MenuItem>
              <MenuItem value='"Arial", "Noto Sans SC", sans-serif'>Arial</MenuItem>
              <MenuItem value='"Helvetica", "Noto Sans SC", sans-serif'>Helvetica</MenuItem>
              <MenuItem value='"Times New Roman", "Noto Serif SC", serif'>Times New Roman</MenuItem>
              <MenuItem value='"Georgia", "Noto Serif SC", serif'>Georgia</MenuItem>
              <MenuItem value='"Source Sans 3", "Noto Sans SC", sans-serif'>Source Sans 3</MenuItem>
              <MenuItem value='"Inter", "Noto Sans SC", sans-serif'>Inter</MenuItem>
              <MenuItem value='"Roboto", "Noto Sans SC", sans-serif'>Roboto</MenuItem>
              <MenuItem value='"Poppins", "Noto Sans SC", sans-serif'>Poppins</MenuItem>
              <MenuItem value='"Courier New", monospace'>Courier New</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>标题字体</InputLabel>
            <Select
              value={customHeadingFont}
              label="标题字体"
              onChange={(e) => setCustomHeadingFont(e.target.value)}
            >
              <MenuItem value="">默认</MenuItem>
              <MenuItem value='"Arial", "Noto Sans SC", sans-serif'>Arial</MenuItem>
              <MenuItem value='"Helvetica", "Noto Sans SC", sans-serif'>Helvetica</MenuItem>
              <MenuItem value='"Times New Roman", "Noto Serif SC", serif'>Times New Roman</MenuItem>
              <MenuItem value='"Georgia", "Noto Serif SC", serif'>Georgia</MenuItem>
              <MenuItem value='"Source Sans 3", "Noto Sans SC", sans-serif'>Source Sans 3</MenuItem>
              <MenuItem value='"Inter", "Noto Sans SC", sans-serif'>Inter</MenuItem>
              <MenuItem value='"Roboto", "Noto Sans SC", sans-serif'>Roboto</MenuItem>
              <MenuItem value='"Poppins", "Noto Sans SC", sans-serif'>Poppins</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>字号</InputLabel>
            <Select
              value={customFontSize}
              label="字号"
              onChange={(e) => setCustomFontSize(e.target.value)}
            >
              <MenuItem value="">默认</MenuItem>
              <MenuItem value="8pt">8pt</MenuItem>
              <MenuItem value="9pt">9pt</MenuItem>
              <MenuItem value="10pt">10pt</MenuItem>
              <MenuItem value="11pt">11pt</MenuItem>
              <MenuItem value="12pt">12pt</MenuItem>
              <MenuItem value="14pt">14pt</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>行高</InputLabel>
            <Select
              value={customLineHeight}
              label="行高"
              onChange={(e) => setCustomLineHeight(e.target.value)}
            >
              <MenuItem value="">默认</MenuItem>
              <MenuItem value="1.2">1.2</MenuItem>
              <MenuItem value="1.4">1.4</MenuItem>
              <MenuItem value="1.5">1.5</MenuItem>
              <MenuItem value="1.6">1.6</MenuItem>
              <MenuItem value="1.8">1.8</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            size="small" 
            variant="text"
            onClick={() => {
              setCustomFontFamily('');
              setCustomFontSize('');
              setCustomLineHeight('');
              setCustomHeadingFont('');
            }}
          >
            重置字体
          </Button>
        </Stack>

        {!error && !validationErrors.length && parsedData && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✓ YAML 格式正确 ({getTemplateTypeLabel(templateType)})，可以导出
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {validationErrors.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            发现 {validationErrors.length} 个验证错误：
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              {validationErrors.slice(0, 3).map((err, idx) => (
                <li key={idx}>
                  <Typography variant="body2">
                    {err.location.join(' → ')}: {err.message}
                  </Typography>
                </li>
              ))}
              {validationErrors.length > 3 && (
                <li>
                  <Typography variant="body2">
                    还有 {validationErrors.length - 3} 个错误...
                  </Typography>
                </li>
              )}
            </Box>
          </Alert>
        )}

        <Box 
          id="editor-container"
          sx={{ 
            display: 'flex', 
            gap: 0,
            position: 'relative',
            height: 'calc(100vh - 200px)',
          }}
        >
          {/* 左侧编辑器 */}
          <Box sx={{ width: `${leftWidth}%`, minWidth: '300px' }}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="编辑" />
                <Tab label="已保存" />
              </Tabs>
              
              {activeTab === 0 && (
                <Box sx={{ p: 2, flexGrow: 1, overflow: 'hidden' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Tooltip title="复制">
                      <IconButton size="small" onClick={handleCopyYAML}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <textarea
                    value={yamlText}
                    onChange={(e) => setYamlText(e.target.value)}
                    style={{
                      width: '100%',
                      height: 'calc(100% - 40px)',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      padding: '8px',
                    }}
                    placeholder="在此输入 YAML 格式的Yaml内容..."
                  />
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
                  {savedCVs.length === 0 ? (
                    <Alert severity="info">还没有保存的Yaml</Alert>
                  ) : (
                    <Stack spacing={1}>
                      {savedCVs.map((name) => (
                        <Paper key={name} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button onClick={() => handleLoad(name)}>{name}</Button>
                          <IconButton size="small" onClick={() => handleDelete(name)}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </Paper>
          </Box>
          
          {/* 拖动分隔条 */}
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              width: '8px',
              cursor: 'col-resize',
              bgcolor: isDragging ? 'primary.main' : 'divider',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '2px',
                height: '40px',
                bgcolor: 'background.paper',
                borderRadius: '1px',
              }
            }}
          />
          
          {/* 右侧预览 */}
          <Box sx={{ width: `${100 - leftWidth}%`, minWidth: '300px' }}>
            <Paper sx={{ height: '100%', overflow: 'auto', p: 0 }}>
              {templateType === 'cv' && cvData && (
                <CVPreview 
                  data={cvData} 
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'k8s' && parsedData && (
                <K8sPreview 
                  resource={parsedData} 
                  theme={allThemes.find(t => t.id === theme)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'docker-compose' && parsedData && (
                <DockerComposePreview 
                  data={parsedData} 
                  theme={allThemes.find(t => t.id === theme)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'github-actions' && parsedData && (
                <GitHubActionsPreview 
                  data={parsedData} 
                  theme={allThemes.find(t => t.id === theme)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'generic' && parsedData && (
                <GenericPreview 
                  data={parsedData} 
                  title="YAML 数据" 
                  theme={allThemes.find(t => t.id === theme)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {!parsedData && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    请输入有效的 YAML 内容
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>保存 YAML</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="名称"
            fullWidth
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={`例如：我的${getTemplateTypeLabel(templateType)}-2024`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveConfirm} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
      
      {/* 主题浏览对话框 */}
      <Dialog 
        open={themeDialogOpen} 
        onClose={() => setThemeDialogOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">选择主题</Typography>
            {themePreviewId && (
              <Chip 
                label={`当前预览: ${allThemes.find(t => t.id === themePreviewId)?.name}`}
                color="primary"
                onDelete={() => setThemePreviewId(null)}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Tabs value={themeDialogTab} onChange={(_, v) => setThemeDialogTab(v)} sx={{ mb: 2 }}>
            <Tab label="主题列表" />
            {themePreviewId && <Tab label="主题预览" />}
            {themePreviewId && <Tab label="主题详情" />}
          </Tabs>

          {/* 主题列表 */}
          {themeDialogTab === 0 && (
            <Grid container spacing={2}>
              {allThemes.map((t) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={t.id}>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: theme === t.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      p: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {t.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {t.description}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      <Box sx={{ width: 24, height: 24, bgcolor: t.colors.primary, borderRadius: 1, border: 1, borderColor: 'divider' }} />
                      <Box sx={{ width: 24, height: 24, bgcolor: t.colors.secondary, borderRadius: 1, border: 1, borderColor: 'divider' }} />
                      <Box sx={{ width: 24, height: 24, bgcolor: t.colors.accent, borderRadius: 1, border: 1, borderColor: 'divider' }} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        fullWidth
                        onClick={() => setThemePreviewId(t.id)}
                      >
                        预览
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          handleThemeChange(t.id);
                          setThemeDialogOpen(false);
                        }}
                      >
                        使用
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {/* 主题预览 */}
          {themeDialogTab === 1 && themePreviewId && (
            <Box sx={{ maxHeight: '70vh', overflow: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              {templateType === 'cv' && cvData && (
                <CVPreview 
                  data={{
                    ...cvData,
                    design: { theme: themePreviewId as Design['theme'] },
                  }}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'k8s' && parsedData && (
                <K8sPreview 
                  resource={parsedData} 
                  theme={allThemes.find(t => t.id === themePreviewId)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'docker-compose' && parsedData && (
                <DockerComposePreview 
                  data={parsedData} 
                  theme={allThemes.find(t => t.id === themePreviewId)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'github-actions' && parsedData && (
                <GitHubActionsPreview 
                  data={parsedData} 
                  theme={allThemes.find(t => t.id === themePreviewId)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
              {templateType === 'generic' && parsedData && (
                <GenericPreview 
                  data={parsedData} 
                  title="YAML 数据" 
                  theme={allThemes.find(t => t.id === themePreviewId)}
                  customTypography={{
                    fontFamily: customFontFamily || undefined,
                    fontSize: customFontSize || undefined,
                    lineHeight: customLineHeight || undefined,
                    headingFont: customHeadingFont || undefined,
                  }}
                />
              )}
            </Box>
          )}

          {/* 主题详情 */}
          {themeDialogTab === 2 && themePreviewId && (() => {
            const selectedTheme = allThemes.find(t => t.id === themePreviewId);
            if (!selectedTheme) return null;
            
            return (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>主题信息</Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>名称:</strong> {selectedTheme.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTheme.description}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom>颜色方案</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(selectedTheme.colors).map(([key, value]) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={key}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: value,
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                              }} 
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {key}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                {value}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom>字体设置</Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>字体:</strong> {selectedTheme.typography.fontFamily}
                      </Typography>
                      <Typography variant="body2">
                        <strong>字号:</strong> {selectedTheme.typography.fontSize}
                      </Typography>
                      <Typography variant="body2">
                        <strong>行高:</strong> {selectedTheme.typography.lineHeight}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Button 
                      variant="contained" 
                      size="large"
                      fullWidth
                      onClick={() => {
                        handleThemeChange(themePreviewId);
                        setThemeDialogOpen(false);
                      }}
                    >
                      使用此主题
                    </Button>
                  </Box>
                </Stack>
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setThemeDialogOpen(false);
            setThemePreviewId(null);
            setThemeDialogTab(0);
          }}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
