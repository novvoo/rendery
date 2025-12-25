"use client";

import { Theme } from '@/lib/theme-manager';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface ThemeCustomizerProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onSave: (customTheme: Theme) => void;
}

export default function ThemeCustomizer({ open, onClose, theme, onSave }: ThemeCustomizerProps) {
  const [customTheme, setCustomTheme] = useState<Theme>(theme);

  const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    setCustomTheme({
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [colorKey]: value,
      },
    });
  };

  const handleTypographyChange = (key: keyof Theme['typography'], value: string) => {
    setCustomTheme({
      ...customTheme,
      typography: {
        ...customTheme.typography,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    onSave(customTheme);
    onClose();
  };

  const handleReset = () => {
    setCustomTheme(theme);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        自定义主题: {theme.name}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* 颜色设置 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              颜色方案
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <Stack direction="row" spacing={2} alignItems="center">
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
                    <TextField
                      label={key}
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                      size="small"
                      fullWidth
                      placeholder="rgb(0, 0, 0)"
                    />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 字体设置 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              字体设置
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="字体族"
                value={customTheme.typography.fontFamily}
                onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                fullWidth
                size="small"
                helperText="例如: 'Arial', sans-serif"
              />
              <TextField
                label="字体大小"
                value={customTheme.typography.fontSize}
                onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
                fullWidth
                size="small"
                helperText="例如: 10pt, 14px"
              />
              <TextField
                label="行高"
                value={customTheme.typography.lineHeight}
                onChange={(e) => handleTypographyChange('lineHeight', e.target.value)}
                fullWidth
                size="small"
                helperText="例如: 1.5, 1.6"
              />
              {customTheme.typography.headingFont !== undefined && (
                <TextField
                  label="标题字体"
                  value={customTheme.typography.headingFont}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                  fullWidth
                  size="small"
                  helperText="留空则使用主字体"
                />
              )}
            </Stack>
          </Box>

          {/* 预览 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              预览
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: customTheme.colors.background,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                fontFamily: customTheme.typography.fontFamily,
                fontSize: customTheme.typography.fontSize,
                lineHeight: customTheme.typography.lineHeight,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: customTheme.colors.name || customTheme.colors.primary,
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: customTheme.typography.headingFont || customTheme.typography.fontFamily,
                }}
              >
                张三
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: customTheme.colors.headline || customTheme.colors.secondary,
                  mb: 2,
                }}
              >
                软件工程师
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: customTheme.colors.section_titles || customTheme.colors.primary,
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: customTheme.typography.headingFont || customTheme.typography.fontFamily,
                }}
              >
                工作经历
              </Typography>
              <Typography sx={{ color: customTheme.colors.text }}>
                科技公司 • 高级软件工程师
              </Typography>
              <Typography sx={{ color: customTheme.colors.connections || customTheme.colors.secondary }}>
                2022年7月 - 至今
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>重置</Button>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
