"use client";

import { Theme } from '@/lib/theme-manager';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

// 字体选项
const FONT_OPTIONS = [
  // 无衬线字体 - 现代简洁
  { value: 'var(--font-inter), "Noto Sans SC", sans-serif', label: 'Inter（现代无衬线）', category: '无衬线' },
  { value: 'var(--font-roboto), "Noto Sans SC", sans-serif', label: 'Roboto（谷歌无衬线）', category: '无衬线' },
  { value: 'var(--font-source-sans-3), "Noto Sans SC", sans-serif', label: 'Source Sans 3（Adobe无衬线）', category: '无衬线' },
  { value: 'var(--font-open-sans), "Noto Sans SC", sans-serif', label: 'Open Sans（开放无衬线）', category: '无衬线' },
  { value: 'var(--font-lato), "Noto Sans SC", sans-serif', label: 'Lato（优雅无衬线）', category: '无衬线' },
  { value: 'var(--font-montserrat), "Noto Sans SC", sans-serif', label: 'Montserrat（几何无衬线）', category: '无衬线' },
  { value: 'var(--font-raleway), "Noto Sans SC", sans-serif', label: 'Raleway（细长无衬线）', category: '无衬线' },
  { value: 'var(--font-poppins), "Noto Sans SC", sans-serif', label: 'Poppins（圆润无衬线）', category: '无衬线' },
  
  // 衬线字体 - 经典优雅
  { value: 'var(--font-playfair-display), "Noto Serif SC", serif', label: 'Playfair Display（优雅衬线）', category: '衬线' },
  { value: 'var(--font-merriweather), "Noto Serif SC", serif', label: 'Merriweather（易读衬线）', category: '衬线' },
  { value: 'var(--font-lora), "Noto Serif SC", serif', label: 'Lora（现代衬线）', category: '衬线' },
  { value: 'var(--font-crimson-text), "Noto Serif SC", serif', label: 'Crimson Text（古典衬线）', category: '衬线' },
  { value: 'var(--font-libre-baskerville), "Noto Serif SC", serif', label: 'Libre Baskerville（传统衬线）', category: '衬线' },
  { value: '"Georgia", "Noto Serif SC", serif', label: 'Georgia（系统衬线）', category: '衬线' },
  { value: '"Times New Roman", "Noto Serif SC", serif', label: 'Times New Roman（经典衬线）', category: '衬线' },
  
  // 中文字体
  { value: 'var(--font-noto-sans-sc), sans-serif', label: '思源黑体（Noto Sans SC）', category: '中文' },
  { value: 'var(--font-noto-serif-sc), serif', label: '思源宋体（Noto Serif SC）', category: '中文' },
  { value: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif', label: '苹方/微软雅黑', category: '中文' },
  { value: '"STSong", "SimSun", "Noto Serif SC", serif', label: '华文宋体/宋体', category: '中文' },
  { value: '"STKaiti", "KaiTi", "Noto Serif SC", serif', label: '华文楷体/楷体', category: '中文' },
  { value: '"STHeiti", "SimHei", "Noto Sans SC", sans-serif', label: '华文黑体/黑体', category: '中文' },
  
  // 等宽字体 - 代码风格
  { value: 'var(--font-geist-mono), "Courier New", monospace', label: 'Geist Mono（等宽）', category: '等宽' },
  { value: '"Courier New", "Courier", monospace', label: 'Courier New（经典等宽）', category: '等宽' },
  { value: '"Consolas", "Monaco", monospace', label: 'Consolas/Monaco（代码等宽）', category: '等宽' },
  
  // 系统字体
  { value: 'Arial, "Noto Sans SC", sans-serif', label: 'Arial（系统无衬线）', category: '系统' },
  { value: '"Helvetica Neue", Helvetica, "Noto Sans SC", sans-serif', label: 'Helvetica（瑞士无衬线）', category: '系统' },
  { value: 'Verdana, "Noto Sans SC", sans-serif', label: 'Verdana（屏幕优化）', category: '系统' },
  { value: 'Tahoma, "Noto Sans SC", sans-serif', label: 'Tahoma（紧凑无衬线）', category: '系统' },
];

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
              正文字体设置
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  正文字体
                </Typography>
                <Select
                  value={customTheme.typography.fontFamily}
                  onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                  fullWidth
                  size="small"
                >
                  {FONT_OPTIONS.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 2 }}>
                          {font.category}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  正文字体大小
                </Typography>
                <Select
                  value={customTheme.typography.fontSize}
                  onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="8pt">8pt（极小）</MenuItem>
                  <MenuItem value="9pt">9pt（很小）</MenuItem>
                  <MenuItem value="10pt">10pt（小）</MenuItem>
                  <MenuItem value="11pt">11pt（标准）</MenuItem>
                  <MenuItem value="12pt">12pt（中等）</MenuItem>
                  <MenuItem value="13pt">13pt（较大）</MenuItem>
                  <MenuItem value="14pt">14pt（大）</MenuItem>
                  <MenuItem value="15pt">15pt（很大）</MenuItem>
                  <MenuItem value="16pt">16pt（特大）</MenuItem>
                  <MenuItem value="8px">8px</MenuItem>
                  <MenuItem value="9px">9px</MenuItem>
                  <MenuItem value="10px">10px</MenuItem>
                  <MenuItem value="11px">11px</MenuItem>
                  <MenuItem value="12px">12px</MenuItem>
                  <MenuItem value="13px">13px</MenuItem>
                  <MenuItem value="14px">14px</MenuItem>
                  <MenuItem value="15px">15px</MenuItem>
                  <MenuItem value="16px">16px</MenuItem>
                  <MenuItem value="18px">18px</MenuItem>
                  <MenuItem value="20px">20px</MenuItem>
                  <MenuItem value="0.75rem">0.75rem</MenuItem>
                  <MenuItem value="0.875rem">0.875rem</MenuItem>
                  <MenuItem value="1rem">1rem</MenuItem>
                  <MenuItem value="1.125rem">1.125rem</MenuItem>
                  <MenuItem value="1.25rem">1.25rem</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  正文行高
                </Typography>
                <Select
                  value={customTheme.typography.lineHeight}
                  onChange={(e) => handleTypographyChange('lineHeight', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="1.0">1.0（紧凑）</MenuItem>
                  <MenuItem value="1.15">1.15（很紧）</MenuItem>
                  <MenuItem value="1.2">1.2（紧密）</MenuItem>
                  <MenuItem value="1.3">1.3（较紧）</MenuItem>
                  <MenuItem value="1.4">1.4（标准-）</MenuItem>
                  <MenuItem value="1.5">1.5（标准）</MenuItem>
                  <MenuItem value="1.6">1.6（舒适）</MenuItem>
                  <MenuItem value="1.7">1.7（较松）</MenuItem>
                  <MenuItem value="1.8">1.8（宽松）</MenuItem>
                  <MenuItem value="1.9">1.9（很松）</MenuItem>
                  <MenuItem value="2.0">2.0（超宽松）</MenuItem>
                  <MenuItem value="2.2">2.2</MenuItem>
                  <MenuItem value="2.5">2.5</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Box>

          {/* 标题字体设置 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              标题字体设置
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  标题字体
                </Typography>
                <Select
                  value={customTheme.typography.headingFont || customTheme.typography.fontFamily}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">
                    <em>使用正文字体</em>
                  </MenuItem>
                  {FONT_OPTIONS.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 2 }}>
                          {font.category}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  标题字体大小
                </Typography>
                <Select
                  value={customTheme.typography.headingFontSize || ''}
                  onChange={(e) => handleTypographyChange('headingFontSize', e.target.value)}
                  fullWidth
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>自动计算（正文的1.2-2倍）</em>
                  </MenuItem>
                  <MenuItem value="10pt">10pt（极小）</MenuItem>
                  <MenuItem value="11pt">11pt（很小）</MenuItem>
                  <MenuItem value="12pt">12pt（小）</MenuItem>
                  <MenuItem value="13pt">13pt（标准）</MenuItem>
                  <MenuItem value="14pt">14pt（中等）</MenuItem>
                  <MenuItem value="15pt">15pt（较大）</MenuItem>
                  <MenuItem value="16pt">16pt（大）</MenuItem>
                  <MenuItem value="18pt">18pt（很大）</MenuItem>
                  <MenuItem value="20pt">20pt（特大）</MenuItem>
                  <MenuItem value="22pt">22pt（超大）</MenuItem>
                  <MenuItem value="24pt">24pt（巨大）</MenuItem>
                  <MenuItem value="26pt">26pt</MenuItem>
                  <MenuItem value="28pt">28pt</MenuItem>
                  <MenuItem value="30pt">30pt</MenuItem>
                  <MenuItem value="32pt">32pt</MenuItem>
                  <MenuItem value="36pt">36pt</MenuItem>
                  <MenuItem value="40pt">40pt</MenuItem>
                  <MenuItem value="48pt">48pt</MenuItem>
                  <MenuItem value="12px">12px</MenuItem>
                  <MenuItem value="14px">14px</MenuItem>
                  <MenuItem value="16px">16px</MenuItem>
                  <MenuItem value="18px">18px</MenuItem>
                  <MenuItem value="20px">20px</MenuItem>
                  <MenuItem value="22px">22px</MenuItem>
                  <MenuItem value="24px">24px</MenuItem>
                  <MenuItem value="28px">28px</MenuItem>
                  <MenuItem value="32px">32px</MenuItem>
                  <MenuItem value="36px">36px</MenuItem>
                  <MenuItem value="40px">40px</MenuItem>
                  <MenuItem value="48px">48px</MenuItem>
                  <MenuItem value="56px">56px</MenuItem>
                  <MenuItem value="64px">64px</MenuItem>
                  <MenuItem value="1rem">1rem</MenuItem>
                  <MenuItem value="1.125rem">1.125rem</MenuItem>
                  <MenuItem value="1.25rem">1.25rem</MenuItem>
                  <MenuItem value="1.5rem">1.5rem</MenuItem>
                  <MenuItem value="1.75rem">1.75rem</MenuItem>
                  <MenuItem value="2rem">2rem</MenuItem>
                  <MenuItem value="2.25rem">2.25rem</MenuItem>
                  <MenuItem value="2.5rem">2.5rem</MenuItem>
                  <MenuItem value="3rem">3rem</MenuItem>
                  <MenuItem value="3.5rem">3.5rem</MenuItem>
                  <MenuItem value="4rem">4rem</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  标题行高
                </Typography>
                <Select
                  value={customTheme.typography.headingLineHeight || ''}
                  onChange={(e) => handleTypographyChange('headingLineHeight', e.target.value)}
                  fullWidth
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>使用正文行高</em>
                  </MenuItem>
                  <MenuItem value="1.0">1.0（紧凑）</MenuItem>
                  <MenuItem value="1.1">1.1（很紧）</MenuItem>
                  <MenuItem value="1.2">1.2（紧密）</MenuItem>
                  <MenuItem value="1.3">1.3（较紧）</MenuItem>
                  <MenuItem value="1.4">1.4（标准）</MenuItem>
                  <MenuItem value="1.5">1.5（舒适）</MenuItem>
                  <MenuItem value="1.6">1.6（较松）</MenuItem>
                  <MenuItem value="1.7">1.7（宽松）</MenuItem>
                  <MenuItem value="1.8">1.8（很松）</MenuItem>
                  <MenuItem value="2.0">2.0（超宽松）</MenuItem>
                </Select>
              </Box>
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
