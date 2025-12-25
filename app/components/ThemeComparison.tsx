"use client";

import { getAllThemes } from '@/lib/theme-manager';
import { CVDocument } from '@/types/cv';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CVPreview from './CVPreview';

interface ThemeComparisonProps {
  cvData: CVDocument;
  onSelectTheme?: (themeId: string) => void;
}

export default function ThemeComparison({ cvData, onSelectTheme }: ThemeComparisonProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['classic', 'modern']);
  const allThemes = getAllThemes();

  const handleThemeToggle = (themeId: string, index: number) => {
    const newThemes = [...selectedThemes];
    newThemes[index] = themeId;
    setSelectedThemes(newThemes);
  };

  const handleSelectTheme = (themeId: string) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        主题对比预览
      </Typography>

      <Grid container spacing={3}>
        {selectedThemes.map((themeId, index) => {
          const theme = allThemes.find(t => t.id === themeId);
          if (!theme) return null;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Paper elevation={3} sx={{ height: '100%' }}>
                {/* 主题选择器 */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{theme.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {theme.description}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleSelectTheme(themeId)}
                    >
                      使用
                    </Button>
                  </Stack>
                  
                  {/* 快速切换按钮 */}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                    {allThemes.slice(0, 6).map((t) => (
                      <Button
                        key={t.id}
                        size="small"
                        variant={t.id === themeId ? 'contained' : 'outlined'}
                        onClick={() => handleThemeToggle(t.id, index)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        {t.name}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                {/* 预览区域 */}
                <Box 
                  sx={{ 
                    height: 600, 
                    overflow: 'auto',
                    bgcolor: theme.colors.background,
                  }}
                >
                  <CVPreview 
                    data={{
                      ...cvData,
                      design: { theme: themeId },
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* 所有主题快速预览 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          所有主题
        </Typography>
        <Grid container spacing={2}>
          {allThemes.map((theme) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={theme.id}>
              <Paper 
                elevation={2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => {
                  setSelectedThemes([theme.id, selectedThemes[1]]);
                }}
              >
                <Box sx={{ p: 2, bgcolor: theme.colors.background }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: theme.colors.name,
                      fontFamily: theme.typography.fontFamily,
                      mb: 0.5,
                    }}
                  >
                    {theme.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <Box sx={{ width: 16, height: 16, bgcolor: theme.colors.primary, borderRadius: 0.5 }} />
                    <Box sx={{ width: 16, height: 16, bgcolor: theme.colors.secondary, borderRadius: 0.5 }} />
                    <Box sx={{ width: 16, height: 16, bgcolor: theme.colors.accent, borderRadius: 0.5 }} />
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
