'use client';

import { Theme } from '@/lib/theme-manager';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import StorageIcon from '@mui/icons-material/Storage';
import {
    Box,
    Chip,
    Collapse,
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

interface DockerComposePreviewProps {
  data: any;
  theme?: Theme;
  customTypography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    headingFont?: string;
    headingFontSize?: string;
    headingLineHeight?: string;
  };
}

// 可折叠服务卡片组件
function CollapsibleServiceCard({ 
  name, 
  config, 
  secondaryColor, 
  accentColor,
  borderColor,
  primaryColor,
  defaultExpanded = true 
}: { 
  name: string; 
  config: any; 
  secondaryColor: string; 
  accentColor: string;
  borderColor: string;
  primaryColor: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Paper elevation={1} sx={{ borderLeft: 3, borderLeftColor: accentColor, overflow: 'hidden' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <IconButton size="small" sx={{ mr: 0.5 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1em', flexGrow: 1 }}>
          {name}
        </Typography>
        {config.image && !expanded && (
          <Chip 
            label={config.image} 
            size="small" 
            sx={{ fontSize: '0.7em', maxWidth: '200px' }} 
          />
        )}
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 1.5, pt: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {config.image && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '0.9em' }}>
                      镜像
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9em', wordBreak: 'break-all' }}>
                      {config.image}
                    </TableCell>
                  </TableRow>
                )}
                
                {config.build && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      构建
                    </TableCell>
                    <TableCell sx={{ fontSize: '9pt' }}>
                      {typeof config.build === 'string' ? (
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt' }}>{config.build}</Typography>
                      ) : (
                        <Box>
                          {config.build.context && <Typography sx={{ fontSize: '9pt' }}>上下文: {config.build.context}</Typography>}
                          {config.build.dockerfile && <Typography sx={{ fontSize: '9pt' }}>Dockerfile: {config.build.dockerfile}</Typography>}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )}
                
                {config.container_name && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      容器名
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '9pt' }}>
                      {config.container_name}
                    </TableCell>
                  </TableRow>
                )}
                
                {config.ports && config.ports.length > 0 && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      端口映射
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                        {config.ports.map((port: string, idx: number) => (
                          <Chip key={idx} label={port} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                
                {config.environment && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      环境变量
                    </TableCell>
                    <TableCell>
                      {Array.isArray(config.environment) ? (
                        <Stack spacing={0.3}>
                          {config.environment.map((env: string, idx: number) => (
                            <Typography key={idx} sx={{ fontFamily: 'monospace', fontSize: '8.5pt', wordBreak: 'break-all' }}>
                              {env}
                            </Typography>
                          ))}
                        </Stack>
                      ) : (
                        <Stack spacing={0.3}>
                          {Object.entries(config.environment).map(([key, value]) => (
                            <Typography key={key} sx={{ fontFamily: 'monospace', fontSize: '8.5pt', wordBreak: 'break-all' }}>
                              {key}={String(value)}
                            </Typography>
                          ))}
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                )}
                
                {config.volumes && config.volumes.length > 0 && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      数据卷
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.3}>
                        {config.volumes.map((vol: string, idx: number) => (
                          <Typography key={idx} sx={{ fontFamily: 'monospace', fontSize: '8.5pt', wordBreak: 'break-all' }}>
                            {vol}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                
                {config.depends_on && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      依赖服务
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                        {(Array.isArray(config.depends_on) ? config.depends_on : Object.keys(config.depends_on)).map((dep: string, idx: number) => (
                          <Chip key={idx} label={dep} size="small" color="primary" sx={{ fontSize: '8.5pt' }} />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                
                {config.networks && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      网络
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                        {(Array.isArray(config.networks) ? config.networks : Object.keys(config.networks)).map((net: string, idx: number) => (
                          <Chip key={idx} label={net} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                
                {config.restart && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      重启策略
                    </TableCell>
                    <TableCell>
                      <Chip label={config.restart} size="small" color="success" sx={{ fontSize: '8.5pt' }} />
                    </TableCell>
                  </TableRow>
                )}

                {config.healthcheck && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      健康检查
                    </TableCell>
                    <TableCell>
                      <Box>
                        {config.healthcheck.test && (
                          <Typography sx={{ fontSize: '8.5pt', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            测试: {Array.isArray(config.healthcheck.test) ? config.healthcheck.test.join(' ') : config.healthcheck.test}
                          </Typography>
                        )}
                        {config.healthcheck.interval && (
                          <Typography sx={{ fontSize: '8.5pt' }}>间隔: {config.healthcheck.interval}</Typography>
                        )}
                        {config.healthcheck.timeout && (
                          <Typography sx={{ fontSize: '8.5pt' }}>超时: {config.healthcheck.timeout}</Typography>
                        )}
                        {config.healthcheck.retries && (
                          <Typography sx={{ fontSize: '8.5pt' }}>重试: {config.healthcheck.retries}</Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {config.deploy && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      部署配置
                    </TableCell>
                    <TableCell>
                      <Box>
                        {config.deploy.replicas && (
                          <Typography sx={{ fontSize: '8.5pt' }}>副本数: {config.deploy.replicas}</Typography>
                        )}
                        {config.deploy.resources && (
                          <Box sx={{ mt: 0.5 }}>
                            {config.deploy.resources.limits && (
                              <Typography sx={{ fontSize: '8.5pt' }}>
                                限制: CPU {config.deploy.resources.limits.cpus || 'N/A'}, 内存 {config.deploy.resources.limits.memory || 'N/A'}
                              </Typography>
                            )}
                            {config.deploy.resources.reservations && (
                              <Typography sx={{ fontSize: '8.5pt' }}>
                                预留: CPU {config.deploy.resources.reservations.cpus || 'N/A'}, 内存 {config.deploy.resources.reservations.memory || 'N/A'}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {config.logging && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      日志配置
                    </TableCell>
                    <TableCell>
                      <Box>
                        {config.logging.driver && (
                          <Typography sx={{ fontSize: '8.5pt' }}>驱动: {config.logging.driver}</Typography>
                        )}
                        {config.logging.options && (
                          <Box sx={{ mt: 0.5 }}>
                            {Object.entries(config.logging.options).map(([key, value]) => (
                              <Typography key={key} sx={{ fontSize: '8.5pt', fontFamily: 'monospace' }}>
                                {key}: {String(value)}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {config.labels && config.labels.length > 0 && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                      标签
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.3}>
                        {config.labels.map((label: string, idx: number) => (
                          <Typography key={idx} sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                            {label}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}

                {config.command && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      命令
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '8.5pt', wordBreak: 'break-all' }}>
                      {Array.isArray(config.command) ? config.command.join(' ') : config.command}
                    </TableCell>
                  </TableRow>
                )}

                {config.env_file && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                      环境文件
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                        {(Array.isArray(config.env_file) ? config.env_file : [config.env_file]).map((file: string, idx: number) => (
                          <Chip key={idx} label={file} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default function DockerComposePreview({ data, theme, customTypography }: DockerComposePreviewProps) {
  if (!data || typeof data !== 'object') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          无效的 Docker Compose 格式
        </Typography>
      </Box>
    );
  }

  const { version, services, networks, volumes } = data;

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
  const headingFontSize = customTypography?.headingFontSize || theme?.typography.headingFontSize;
  const headingLineHeight = customTypography?.headingLineHeight || theme?.typography.headingLineHeight || lineHeight;

  return (
    <Box className="docker-compose-preview" sx={{ 
      p: 0,
      m: 0,
      bgcolor: backgroundColor, 
      color: textColor, 
      fontFamily, 
      fontSize,
      lineHeight,
      '& .MuiTypography-root': {
        fontFamily: 'inherit',
        lineHeight: 'inherit',
      },
      '& .MuiTypography-h5, & .MuiTypography-h6': {
        fontFamily: headingFont,
        fontSize: headingFontSize || 'inherit',
        lineHeight: headingLineHeight,
      },
    }}>
      {/* 头部 */}
      <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: primaryColor, color: 'white' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.6em', fontFamily: headingFont }}>
          Docker Compose 配置
        </Typography>
        {version && (
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '0.9em' }}>
            版本: {version}
          </Typography>
        )}
      </Paper>

      {/* 服务列表 */}
      {services && Object.keys(services).length > 0 && (
        <Box sx={{ mb: 2, mx: 3 }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '1.3em', fontFamily: headingFont }}>
            <StorageIcon sx={{ fontSize: '1.6em', mr: 0.5, verticalAlign: 'middle' }} />
            服务 ({Object.keys(services).length})
          </Typography>
          
          <Stack spacing={1.5}>
            {Object.entries(services).map(([name, config]: [string, any], index) => (
              <CollapsibleServiceCard
                key={name}
                name={name}
                config={config}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                borderColor={borderColor}
                primaryColor={primaryColor}
                defaultExpanded={index < 2}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* 网络 */}
      {networks && Object.keys(networks).length > 0 && (
        <Box sx={{ mb: 2, mx: 3 }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '1.3em', fontFamily: headingFont }}>
            <NetworkCheckIcon sx={{ fontSize: '1.6em', mr: 0.5, verticalAlign: 'middle' }} />
            网络 ({Object.keys(networks).length})
          </Typography>
          
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Stack spacing={1}>
              {Object.entries(networks).map(([name, config]: [string, any]) => (
                <Box key={name}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '10pt' }}>
                    {name}
                  </Typography>
                  {config && typeof config === 'object' && (
                    <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt' }}>
                      驱动: {config.driver || 'bridge'}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      )}

      {/* 数据卷 */}
      {volumes && Object.keys(volumes).length > 0 && (
        <Box sx={{ mx: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold', mb: 1, fontSize: '1.3em', fontFamily: headingFont }}>
            <FolderIcon sx={{ fontSize: '1.6em', mr: 0.5, verticalAlign: 'middle' }} />
            数据卷 ({Object.keys(volumes).length})
          </Typography>
          
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {Object.keys(volumes).map((name) => (
                <Chip key={name} label={name} size="small" variant="outlined" sx={{ fontSize: '9pt' }} />
              ))}
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
