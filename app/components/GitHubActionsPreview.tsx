'use client';

import { Theme } from '@/lib/theme-manager';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Box,
    Chip,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

interface GitHubActionsPreviewProps {
  data: any;
  theme?: Theme;
  customTypography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    headingFont?: string;
  };
}

export default function GitHubActionsPreview({ data, theme, customTypography }: GitHubActionsPreviewProps) {
  if (!data || typeof data !== 'object') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          无效的 GitHub Actions 格式
        </Typography>
      </Box>
    );
  }

  const { name, on: triggers, env, jobs } = data;

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

  return (
    <Box className="github-actions-preview" sx={{ 
      p: 0,
      m: 0,
      bgcolor: backgroundColor, 
      color: textColor, 
      fontFamily, 
      fontSize,
      lineHeight
    }}>
      {/* 头部 */}
      <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: primaryColor, color: 'white' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: headingFont }}>
          {name || 'GitHub Actions Workflow'}
        </Typography>
      </Paper>

      {/* 触发器 */}
      {triggers && (
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mb: 1.5, borderLeft: 3, borderLeftColor: accentColor }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '13pt', fontFamily: headingFont }}>
            <PlayArrowIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />
            触发条件
          </Typography>
          
          <Stack spacing={1}>
            {triggers.push && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '9.5pt' }}>Push 事件</Typography>
                {triggers.push.branches && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5 }}>
                    {triggers.push.branches.map((branch: string, idx: number) => (
                      <Chip key={idx} label={branch} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                    ))}
                  </Stack>
                )}
              </Box>
            )}
            
            {triggers.pull_request && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '9.5pt' }}>Pull Request 事件</Typography>
                {triggers.pull_request.branches && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5 }}>
                    {triggers.pull_request.branches.map((branch: string, idx: number) => (
                      <Chip key={idx} label={branch} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                    ))}
                  </Stack>
                )}
              </Box>
            )}
            
            {triggers.workflow_dispatch && (
              <Chip label="手动触发" size="small" color="primary" sx={{ fontSize: '8.5pt' }} />
            )}
            
            {triggers.schedule && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '9.5pt' }}>定时触发</Typography>
                {triggers.schedule.map((sched: any, idx: number) => (
                  <Typography key={idx} sx={{ fontFamily: 'monospace', fontSize: '8.5pt', mt: 0.5 }}>
                    {sched.cron}
                  </Typography>
                ))}
              </Box>
            )}
          </Stack>
        </Paper>
      )}

      {/* 环境变量 */}
      {env && Object.keys(env).length > 0 && (
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mb: 1.5 }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '13pt', fontFamily: headingFont }}>
            <SettingsIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />
            全局环境变量
          </Typography>
          
          <Stack spacing={0.3}>
            {Object.entries(env).map(([key, value]) => (
              <Typography key={key} sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                {key}: {String(value)}
              </Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {/* 任务列表 */}
      {jobs && Object.keys(jobs).length > 0 && (
        <Box sx={{ mx: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '13pt', fontFamily: headingFont }}>
            <CodeIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />
            任务 ({Object.keys(jobs).length})
          </Typography>
          
          <Stack spacing={1.5}>
            {Object.entries(jobs).map(([jobName, jobConfig]: [string, any]) => (
              <Paper key={jobName} elevation={1} sx={{ p: 1.5, borderLeft: 3, borderLeftColor: accentColor }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '11pt' }}>
                  {jobName}
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {jobConfig['runs-on'] && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            运行环境
                          </TableCell>
                          <TableCell>
                            <Chip label={jobConfig['runs-on']} size="small" color="primary" sx={{ fontSize: '8.5pt' }} />
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {jobConfig.needs && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            依赖任务
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                              {(Array.isArray(jobConfig.needs) ? jobConfig.needs : [jobConfig.needs]).map((dep: string, idx: number) => (
                                <Chip key={idx} label={dep} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                              ))}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {jobConfig.strategy?.matrix && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                            矩阵策略
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              {Object.entries(jobConfig.strategy.matrix).map(([key, values]: [string, any]) => (
                                <Box key={key}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '9pt' }}>
                                    {key}:
                                  </Typography>
                                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.3 }}>
                                    {Array.isArray(values) && values.map((val, idx) => (
                                      <Chip key={idx} label={String(val)} size="small" variant="outlined" sx={{ fontSize: '8pt' }} />
                                    ))}
                                  </Stack>
                                </Box>
                              ))}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {jobConfig.if && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            执行条件
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                            {jobConfig.if}
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {jobConfig.environment && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            部署环境
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip 
                                label={typeof jobConfig.environment === 'string' ? jobConfig.environment : jobConfig.environment.name} 
                                size="small" 
                                color="success" 
                                sx={{ fontSize: '8.5pt' }} 
                              />
                              {typeof jobConfig.environment === 'object' && jobConfig.environment.url && (
                                <Typography variant="body2" sx={{ fontSize: '8.5pt', mt: 0.5 }}>
                                  URL: {jobConfig.environment.url}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* 步骤 */}
                {jobConfig.steps && jobConfig.steps.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.8, fontSize: '9.5pt' }}>
                      步骤 ({jobConfig.steps.length})
                    </Typography>
                    <Stack spacing={0.8}>
                      {jobConfig.steps.map((step: any, idx: number) => (
                        <Box key={idx} sx={{ pl: 1.5, borderLeft: 2, borderLeftColor: borderColor }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '9pt' }}>
                            {idx + 1}. {step.name || '未命名步骤'}
                          </Typography>
                          {step.uses && (
                            <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '8.5pt' }}>
                              使用: {step.uses}
                            </Typography>
                          )}
                          {step.run && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'monospace', 
                                fontSize: '8pt',
                                bgcolor: 'grey.100',
                                p: 0.5,
                                borderRadius: 0.5,
                                mt: 0.3
                              }}
                            >
                              {step.run}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
