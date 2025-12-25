"use client";

import { Theme } from '@/lib/theme-manager';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';

interface ThemePreviewProps {
  theme: Theme;
  selected?: boolean;
  onSelect?: (themeId: string) => void;
}

export default function ThemePreview({ theme, selected = false, onSelect }: ThemePreviewProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(theme.id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        border: selected ? 3 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        {/* 主题预览区域 */}
        <Box 
          sx={{ 
            height: 180, 
            p: 2,
            bgcolor: theme.colors.background,
            borderBottom: 1,
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          {/* 模拟Yaml预览 */}
          <Box sx={{ fontFamily: theme.typography.fontFamily }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.colors.name || theme.colors.primary,
                fontWeight: 'bold',
                mb: 0.5,
                fontSize: '16px',
              }}
            >
              张三
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.colors.headline || theme.colors.secondary,
                mb: 1,
                fontSize: '11px',
              }}
            >
              软件工程师
            </Typography>
            
            <Box sx={{ borderTop: 1, borderColor: theme.colors.border, pt: 1, mt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.colors.section_titles || theme.colors.primary,
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                }}
              >
                工作经历
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.colors.text,
                  fontSize: '10px',
                  lineHeight: theme.typography.lineHeight,
                }}
              >
                科技公司 • 软件工程师
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.colors.connections || theme.colors.secondary,
                  fontSize: '9px',
                }}
              >
                2022年7月 - 至今
              </Typography>
            </Box>
          </Box>
          
          {/* 选中标记 */}
          {selected && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                p: 0.5,
              }}
            >
              <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
          )}
        </Box>

        {/* 主题信息 */}
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {theme.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
            {theme.description}
          </Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
            <Chip 
              label={getCategoryLabel(theme.category)} 
              size="small" 
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={theme.typography.fontFamily.split(',')[0].replace(/"/g, '')} 
              size="small" 
              variant="outlined"
            />
          </Stack>
          
          {/* 颜色样本 */}
          <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }}>
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: theme.colors.primary,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }} 
            />
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: theme.colors.secondary,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }} 
            />
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: theme.colors.accent,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }} 
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function getCategoryLabel(category: Theme['category']): string {
  const labels = {
    professional: '专业',
    modern: '现代',
    creative: '创意',
    minimal: '极简',
  };
  return labels[category] || category;
}
