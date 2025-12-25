'use client';

import { Theme } from '@/lib/theme-manager';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { useState } from 'react';

interface GenericPreviewProps {
  data: any;
  title?: string;
  theme?: Theme;
  customTypography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    headingFont?: string;
  };
}

// 递归渲染值
function RenderValue({ value, depth = 0, primaryColor, secondaryColor, accentColor, borderColor, maxDepth = 10 }: { value: any; depth?: number; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string; maxDepth?: number }) {
  if (value === null || value === undefined) {
    return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic', fontSize: '9pt' }}>null</Typography>;
  }

  if (typeof value === 'boolean') {
    return <Chip label={value.toString()} size="small" color={value ? 'success' : 'default'} sx={{ fontSize: '8.5pt' }} />;
  }

  if (typeof value === 'number') {
    return (
      <Chip 
        label={value.toString()} 
        size="small" 
        variant="outlined" 
        sx={{ 
          borderColor: accentColor, 
          color: accentColor,
          fontFamily: 'monospace',
          fontSize: '8.5pt'
        }} 
      />
    );
  }

  if (typeof value === 'string') {
    // 检测是否是 URL
    const isUrl = /^https?:\/\//i.test(value);
    // 检测是否是长文本（多行）
    const isLongText = value.length > 80 || value.includes('\n');
    // 检测是否包含多个空格分隔的内容（如 CSP 策略）
    const hasMultipleSpaces = value.includes('  ') || (value.split(' ').length > 5 && value.length > 60);
    
    // 检测并修复常见的格式问题（如 selfhttps:// 应该是 self https://）
    let displayValue = value;
    if (value.includes('selfhttps://') || value.includes('selfhttp://')) {
      displayValue = value.replace(/self(https?:\/\/)/g, 'self $1');
    }
    // 修复分号后缺少空格的问题
    if (value.includes(';') && !value.includes('; ')) {
      displayValue = displayValue.replace(/;(?!\s)/g, '; ');
    }
    
    // 检测是否是 CSP 或类似的策略字符串（包含分号和多个指令）
    const isPolicyString = displayValue.includes(';') && displayValue.split(';').length > 2;
    
    if (isUrl) {
      return (
        <Chip 
          label={displayValue} 
          size="small" 
          variant="outlined"
          component="a"
          href={displayValue}
          target="_blank"
          clickable
          sx={{ 
            borderColor: primaryColor,
            color: primaryColor,
            fontFamily: 'monospace',
            fontSize: '8.5pt',
            maxWidth: '100%',
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }}
        />
      );
    }
    
    // 对于策略字符串，格式化为多行显示
    if (isPolicyString) {
      const formattedValue = displayValue
        .split(';')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .join(';\n');
      
      return (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 1, 
            bgcolor: 'grey.50',
            borderColor,
            maxWidth: '100%',
            overflow: 'auto'
          }}
        >
          <Typography 
            component="pre" 
            sx={{ 
              fontFamily: 'monospace', 
              fontSize: '8.5pt',
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              m: 0,
              lineHeight: 1.6
            }}
          >
            {formattedValue}
          </Typography>
        </Paper>
      );
    }
    
    if (isLongText || hasMultipleSpaces) {
      return (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 1, 
            bgcolor: 'grey.50',
            borderColor,
            maxWidth: '100%',
            overflow: 'auto'
          }}
        >
          <Typography 
            component="pre" 
            sx={{ 
              fontFamily: 'monospace', 
              fontSize: '8.5pt',
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              m: 0
            }}
          >
            {displayValue}
          </Typography>
        </Paper>
      );
    }
    
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          fontFamily: 'monospace', 
          wordBreak: 'normal',
          overflowWrap: 'break-word',
          fontSize: '9pt' 
        }}
      >
        {displayValue}
      </Typography>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic', fontSize: '9pt' }}>[]</Typography>;
    }
    
    // 如果是简单类型数组，横向显示
    if (value.every(v => typeof v !== 'object' || v === null)) {
      return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
          {value.map((item, idx) => (
            <Chip 
              key={idx} 
              label={item?.toString() || 'null'} 
              size="small" 
              variant="outlined" 
              sx={{ 
                borderColor: accentColor,
                fontSize: '8.5pt'
              }} 
            />
          ))}
        </Stack>
      );
    }

    // 复杂对象数组，使用卡片式布局
    return (
      <Stack spacing={1} sx={{ mt: 0.5 }}>
        {value.map((item, idx) => (
          <CollapsibleItem
            key={idx}
            title={`项目 ${idx + 1}`}
            depth={depth}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            borderColor={borderColor}
            defaultExpanded={depth < 2}
          >
            <RenderObject 
              obj={item} 
              depth={depth + 1} 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              accentColor={accentColor} 
              borderColor={borderColor}
              maxDepth={maxDepth}
            />
          </CollapsibleItem>
        ))}
      </Stack>
    );
  }

  if (typeof value === 'object') {
    // 如果深度超过限制，显示提示
    if (depth >= maxDepth) {
      return (
        <Chip 
          label={`{...} (深度限制: ${maxDepth})`} 
          size="small" 
          variant="outlined"
          sx={{ 
            borderColor: secondaryColor,
            color: secondaryColor,
            fontSize: '8.5pt'
          }}
        />
      );
    }
    return <RenderObject obj={value} depth={depth} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} maxDepth={maxDepth} />;
  }

  return <Typography variant="body2" sx={{ fontSize: '9pt' }}>{String(value)}</Typography>;
}

// 可折叠项组件
function CollapsibleItem({ 
  title, 
  children, 
  depth, 
  primaryColor, 
  secondaryColor, 
  accentColor, 
  borderColor,
  defaultExpanded = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  depth: number; 
  primaryColor: string; 
  secondaryColor: string; 
  accentColor: string; 
  borderColor: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        bgcolor: depth % 2 === 0 ? 'grey.50' : 'background.paper',
        borderLeft: 3,
        borderLeftColor: accentColor,
        borderColor,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <IconButton size="small" sx={{ mr: 0.5 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 'bold', 
            color: primaryColor,
            fontSize: '9pt',
            flexGrow: 1
          }}
        >
          {title}
        </Typography>
        {!expanded && (
          <Chip 
            label="..." 
            size="small" 
            sx={{ 
              fontSize: '7pt', 
              height: '16px',
              color: secondaryColor 
            }} 
          />
        )}
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 1.5, pt: 0 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
}

// 渲染对象为表格
function RenderObject({ obj, depth = 0, primaryColor, secondaryColor, accentColor, borderColor, maxDepth = 10 }: { obj: Record<string, any>; depth?: number; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string; maxDepth?: number }) {
  if (!obj || Object.keys(obj).length === 0) {
    return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic', fontSize: '9pt' }}>{'{}'}</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {Object.entries(obj).map(([key, value]) => (
            <TableRow 
              key={key} 
              sx={{ 
                '&:last-child td': { border: 0 },
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <TableCell 
                component="th" 
                scope="row" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: primaryColor,
                  verticalAlign: 'top',
                  width: '30%',
                  fontFamily: 'monospace',
                  fontSize: '9pt',
                  borderColor
                }}
              >
                {key}
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top', fontSize: '9pt', borderColor }}>
                <RenderValue 
                  value={value} 
                  depth={depth + 1} 
                  primaryColor={primaryColor} 
                  secondaryColor={secondaryColor} 
                  accentColor={accentColor} 
                  borderColor={borderColor}
                  maxDepth={maxDepth}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function GenericPreview({ data, title, theme, customTypography }: GenericPreviewProps) {
  if (!data || typeof data !== 'object') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          无效的数据格式
        </Typography>
      </Box>
    );
  }

  // 应用主题颜色
  const primaryColor = theme?.colors.primary || 'rgb(37, 99, 235)';
  const secondaryColor = theme?.colors.secondary || 'rgb(107, 114, 128)';
  const backgroundColor = theme?.colors.background || 'rgb(255, 255, 255)';
  const textColor = theme?.colors.text || 'rgb(17, 24, 39)';
  const borderColor = theme?.colors.border || 'rgb(229, 231, 235)';
  const accentColor = theme?.colors.accent || 'rgb(59, 130, 246)';
  
  // 应用自定义字体设置
  const fontFamily = customTypography?.fontFamily || theme?.typography.fontFamily || 'inherit';
  const fontSize = customTypography?.fontSize || theme?.typography.fontSize || '9.5pt';
  const lineHeight = customTypography?.lineHeight || theme?.typography.lineHeight || '1.5';
  const headingFont = customTypography?.headingFont || theme?.typography.headingFont || fontFamily;

  // 检测顶层结构，提供更好的分组显示
  const topLevelKeys = Object.keys(data);
  const hasMultipleSections = topLevelKeys.length > 3;

  return (
    <Box className="generic-preview-container" sx={{ 
      p: 0,
      m: 0,
      bgcolor: backgroundColor, 
      color: textColor, 
      fontFamily, 
      fontSize, 
      lineHeight 
    }}>
      {/* 头部 */}
      {title && (
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: primaryColor, color: 'white' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <DescriptionIcon sx={{ fontSize: '20px' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: headingFont }}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '9pt' }}>
            {topLevelKeys.length} 个字段
          </Typography>
        </Paper>
      )}

      {/* 内容区域 */}
      {hasMultipleSections ? (
        // 如果有多个顶层字段，分组显示
        <Box sx={{ mx: 3, mb: 3 }}>
          <Stack spacing={1.5}>
            {topLevelKeys.map((key) => (
              <Paper 
                key={key} 
                elevation={1} 
                sx={{ 
                  p: 1.5, 
                  borderLeft: 3,
                  borderLeftColor: accentColor,
                  borderColor,
                  borderWidth: 1,
                  borderStyle: 'solid'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: primaryColor,
                    mb: 1,
                    fontSize: '11pt',
                    fontFamily: headingFont
                  }}
                >
                  {key}
                </Typography>
                <Divider sx={{ mb: 1, borderColor }} />
                <RenderValue 
                  value={data[key]} 
                  depth={0} 
                  primaryColor={primaryColor} 
                  secondaryColor={secondaryColor} 
                  accentColor={accentColor} 
                  borderColor={borderColor} 
                />
              </Paper>
            ))}
          </Stack>
        </Box>
      ) : (
        // 如果字段较少，使用表格显示
        <Paper 
          elevation={1} 
          sx={{ 
            p: 1.5, 
            mx: 3, 
            mb: 3, 
            borderColor, 
            borderWidth: 1, 
            borderStyle: 'solid' 
          }}
        >
          <RenderObject 
            obj={data} 
            primaryColor={primaryColor} 
            secondaryColor={secondaryColor} 
            accentColor={accentColor} 
            borderColor={borderColor} 
          />
        </Paper>
      )}
    </Box>
  );
}
