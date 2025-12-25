'use client';

import { Theme } from '@/lib/theme-manager';
import CloudIcon from '@mui/icons-material/Cloud';
import DnsIcon from '@mui/icons-material/Dns';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import GenericPreview from './GenericPreview';

interface K8sResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec?: any;
  data?: any;
}

interface K8sPreviewProps {
  resource: K8sResource | K8sResource[];
  theme?: Theme;
  customTypography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    headingFont?: string;
  };
}

// 递归渲染对象的辅助组件
function RenderValue({ value, depth = 0, primaryColor, secondaryColor, accentColor, borderColor }: { value: any; depth?: number; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string }) {
  if (value === null || value === undefined) {
    return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic' }}>null</Typography>;
  }

  if (typeof value === 'boolean') {
    return <Chip label={value.toString()} size="small" color={value ? 'success' : 'default'} />;
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return (
      <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>
        {value.toString()}
      </Typography>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic' }}>[]</Typography>;
    }
    
    // 如果是简单类型数组，横向显示
    if (value.every(v => typeof v !== 'object' || v === null)) {
      return (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
          {value.map((item, idx) => (
            <Chip key={idx} label={item?.toString() || 'null'} size="small" variant="outlined" sx={{ borderColor: accentColor }} />
          ))}
        </Stack>
      );
    }

    // 复杂对象数组，使用卡片式布局
    return (
      <Stack spacing={1} sx={{ mt: 0.5 }}>
        {value.map((item, idx) => (
          <Paper 
            key={idx} 
            variant="outlined" 
            sx={{ 
              p: 1.5, 
              bgcolor: depth % 2 === 0 ? 'grey.50' : 'background.paper',
              borderLeft: 2,
              borderLeftColor: primaryColor,
              borderColor
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold', 
                color: primaryColor,
                display: 'block',
                mb: 0.5
              }}
            >
              [{idx}]
            </Typography>
            <RenderObject obj={item} depth={depth + 1} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} />
          </Paper>
        ))}
      </Stack>
    );
  }

  if (typeof value === 'object') {
    return <RenderObject obj={value} depth={depth} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} />;
  }

  return <Typography variant="body2">{String(value)}</Typography>;
}

// 渲染对象为表格
function RenderObject({ obj, depth = 0, primaryColor, secondaryColor, accentColor, borderColor }: { obj: Record<string, any>; depth?: number; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string }) {
  if (!obj || Object.keys(obj).length === 0) {
    return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic' }}>{'{}'}</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {Object.entries(obj).map(([key, value]) => (
            <TableRow key={key} sx={{ '&:last-child td': { border: 0 } }}>
              <TableCell 
                component="th" 
                scope="row" 
                sx={{ 
                  fontWeight: 'medium', 
                  color: primaryColor,
                  verticalAlign: 'top',
                  width: '30%',
                  fontFamily: 'monospace',
                  fontSize: '9pt',
                }}
              >
                {key}
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}>
                <RenderValue value={value} depth={depth + 1} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// 渲染 Deployment Spec
function RenderDeploymentSpec({ spec, primaryColor, secondaryColor, accentColor, borderColor }: { spec: any; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string }) {
  const { replicas, selector, template, strategy } = spec;
  
  return (
    <Stack spacing={1.5}>
      {/* 副本数和策略 */}
      <TableContainer>
        <Table size="small">
          <TableBody>
            {replicas !== undefined && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                  副本数
                </TableCell>
                <TableCell>
                  <Chip label={replicas} size="small" color="primary" sx={{ fontSize: '8.5pt' }} />
                </TableCell>
              </TableRow>
            )}
            {strategy && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                  更新策略
                </TableCell>
                <TableCell>
                  <Chip label={strategy.type || 'RollingUpdate'} size="small" variant="outlined" sx={{ fontSize: '8.5pt' }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Selector */}
      {selector?.matchLabels && (
        <Box>
          <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt', mb: 0.5 }}>
            选择器标签:
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
            {Object.entries(selector.matchLabels).map(([key, value]) => (
              <Chip 
                key={key} 
                label={`${key}: ${value}`} 
                size="small" 
                variant="outlined"
                sx={{ borderColor: accentColor, color: accentColor, fontSize: '8.5pt' }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Containers */}
      {template?.spec?.containers && (
        <Box>
          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '10pt', mb: 1 }}>
            容器 ({template.spec.containers.length})
          </Typography>
          <Stack spacing={1}>
            {template.spec.containers.map((container: any, idx: number) => (
              <Paper 
                key={idx} 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  borderLeft: 2,
                  borderLeftColor: accentColor,
                  borderColor
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, fontSize: '10pt' }}>
                  {container.name}
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {container.image && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            镜像
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '9pt' }}>
                            {container.image}
                          </TableCell>
                        </TableRow>
                      )}
                      {container.ports && container.ports.length > 0 && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                            端口
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                              {container.ports.map((port: any, pidx: number) => (
                                <Chip 
                                  key={pidx} 
                                  label={`${port.containerPort}${port.protocol ? `/${port.protocol}` : ''}`} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '8.5pt' }}
                                />
                              ))}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )}
                      {container.env && container.env.length > 0 && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                            环境变量
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.3}>
                              {container.env.map((env: any, eidx: number) => (
                                <Typography key={eidx} sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                                  {env.name}={env.value || (env.valueFrom ? '(from source)' : '')}
                                </Typography>
                              ))}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )}
                      {container.resources && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                            资源
                          </TableCell>
                          <TableCell>
                            {container.resources.requests && (
                              <Box sx={{ mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>请求:</Typography>
                                <Typography sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                                  {Object.entries(container.resources.requests).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                </Typography>
                              </Box>
                            )}
                            {container.resources.limits && (
                              <Box>
                                <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>限制:</Typography>
                                <Typography sx={{ fontFamily: 'monospace', fontSize: '8.5pt' }}>
                                  {Object.entries(container.resources.limits).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

// 渲染 Service Spec
function RenderServiceSpec({ spec, primaryColor, secondaryColor, accentColor, borderColor }: { spec: any; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string }) {
  const { type, selector, ports, clusterIP } = spec;
  
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {type && (
            <TableRow>
              <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                服务类型
              </TableCell>
              <TableCell>
                <Chip label={type} size="small" color="primary" sx={{ fontSize: '8.5pt' }} />
              </TableCell>
            </TableRow>
          )}
          {clusterIP && (
            <TableRow>
              <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                Cluster IP
              </TableCell>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '9pt' }}>
                {clusterIP}
              </TableCell>
            </TableRow>
          )}
          {selector && (
            <TableRow>
              <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt' }}>
                选择器
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {Object.entries(selector).map(([key, value]) => (
                    <Chip 
                      key={key} 
                      label={`${key}: ${value}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderColor: accentColor, color: accentColor, fontSize: '8.5pt' }}
                    />
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          )}
          {ports && ports.length > 0 && (
            <TableRow>
              <TableCell sx={{ fontWeight: 'medium', color: secondaryColor, width: '25%', fontSize: '9pt', verticalAlign: 'top' }}>
                端口映射
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  {ports.map((port: any, idx: number) => (
                    <Box key={idx}>
                      <Chip 
                        label={`${port.port}${port.targetPort ? ` → ${port.targetPort}` : ''}${port.protocol ? ` (${port.protocol})` : ''}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '8.5pt' }}
                      />
                      {port.name && (
                        <Typography variant="caption" sx={{ ml: 1, color: secondaryColor, fontSize: '8pt' }}>
                          {port.name}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// 渲染 HorizontalPodAutoscaler Spec
function RenderHPASpec({ spec, primaryColor, secondaryColor, accentColor, borderColor }: { spec: any; primaryColor: string; secondaryColor: string; accentColor: string; borderColor: string }) {
  const { scaleTargetRef, minReplicas, maxReplicas, metrics, behavior } = spec;
  
  return (
    <Stack spacing={2}>
      {/* 目标资源 */}
      {scaleTargetRef && (
        <Box>
          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '10pt', mb: 1 }}>
            扩缩容目标
          </Typography>
          <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50', borderColor }}>
            <Stack spacing={0.5}>
              <Box>
                <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>资源类型:</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                  {scaleTargetRef.kind}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>资源名称:</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                  {scaleTargetRef.name}
                </Typography>
              </Box>
              {scaleTargetRef.apiVersion && (
                <Box>
                  <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>API 版本:</Typography>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                    {scaleTargetRef.apiVersion}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>
      )}

      {/* 副本数范围 */}
      <Box>
        <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '10pt', mb: 1 }}>
          副本数范围
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt', display: 'block' }}>
              最小副本数
            </Typography>
            <Chip 
              label={minReplicas || 1} 
              size="small" 
              color="primary" 
              sx={{ fontSize: '9pt', fontWeight: 'bold' }} 
            />
          </Box>
          <Typography sx={{ color: secondaryColor, fontSize: '14pt' }}>→</Typography>
          <Box>
            <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt', display: 'block' }}>
              最大副本数
            </Typography>
            <Chip 
              label={maxReplicas} 
              size="small" 
              color="error" 
              sx={{ fontSize: '9pt', fontWeight: 'bold' }} 
            />
          </Box>
        </Stack>
      </Box>

      {/* 指标 */}
      {metrics && metrics.length > 0 && (
        <Box>
          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '10pt', mb: 1 }}>
            扩缩容指标 ({metrics.length})
          </Typography>
          <Stack spacing={1}>
            {metrics.map((metric: any, idx: number) => (
              <Paper 
                key={idx} 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  borderLeft: 3,
                  borderLeftColor: accentColor,
                  borderColor
                }}
              >
                <Stack spacing={0.8}>
                  <Box>
                    <Chip 
                      label={metric.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontSize: '8.5pt', fontWeight: 'bold' }} 
                    />
                  </Box>
                  
                  {/* Resource 类型指标 */}
                  {metric.type === 'Resource' && metric.resource && (
                    <>
                      <Box>
                        <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                          资源名称:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                          {metric.resource.name}
                        </Typography>
                      </Box>
                      {metric.resource.target && (
                        <Box>
                          <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                            目标值:
                          </Typography>
                          <Chip 
                            label={`${metric.resource.target.type}: ${metric.resource.target.averageUtilization || metric.resource.target.averageValue || metric.resource.target.value}${metric.resource.target.averageUtilization ? '%' : ''}`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, fontSize: '8.5pt', borderColor: accentColor }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                  
                  {/* Pods 类型指标 */}
                  {metric.type === 'Pods' && metric.pods && (
                    <>
                      <Box>
                        <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                          指标名称:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                          {metric.pods.metric.name}
                        </Typography>
                      </Box>
                      {metric.pods.target && (
                        <Box>
                          <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                            目标值:
                          </Typography>
                          <Chip 
                            label={`${metric.pods.target.type}: ${metric.pods.target.averageValue || metric.pods.target.value}`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, fontSize: '8.5pt', borderColor: accentColor }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                  
                  {/* Object 类型指标 */}
                  {metric.type === 'Object' && metric.object && (
                    <>
                      <Box>
                        <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                          对象:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                          {metric.object.describedObject.kind}/{metric.object.describedObject.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                          指标:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                          {metric.object.metric.name}
                        </Typography>
                      </Box>
                      {metric.object.target && (
                        <Box>
                          <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                            目标值:
                          </Typography>
                          <Chip 
                            label={`${metric.object.target.type}: ${metric.object.target.value || metric.object.target.averageValue}`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, fontSize: '8.5pt', borderColor: accentColor }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                  
                  {/* External 类型指标 */}
                  {metric.type === 'External' && metric.external && (
                    <>
                      <Box>
                        <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                          指标名称:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '9pt', ml: 1 }}>
                          {metric.external.metric.name}
                        </Typography>
                      </Box>
                      {metric.external.target && (
                        <Box>
                          <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                            目标值:
                          </Typography>
                          <Chip 
                            label={`${metric.external.target.type}: ${metric.external.target.value || metric.external.target.averageValue}`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, fontSize: '8.5pt', borderColor: accentColor }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* 扩缩容行为 */}
      {behavior && (
        <Box>
          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '10pt', mb: 1 }}>
            扩缩容行为
          </Typography>
          <Stack spacing={1.5}>
            {/* 扩容行为 */}
            {behavior.scaleUp && (
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#e8f5e9', borderColor: '#4caf50', borderWidth: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '9.5pt', mb: 1 }}>
                  ↑ 扩容策略
                </Typography>
                <Stack spacing={0.8}>
                  {behavior.scaleUp.stabilizationWindowSeconds !== undefined && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                        稳定窗口:
                      </Typography>
                      <Chip 
                        label={`${behavior.scaleUp.stabilizationWindowSeconds}秒`}
                        size="small"
                        sx={{ ml: 1, fontSize: '8.5pt' }}
                      />
                    </Box>
                  )}
                  {behavior.scaleUp.selectPolicy && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                        策略选择:
                      </Typography>
                      <Chip 
                        label={behavior.scaleUp.selectPolicy}
                        size="small"
                        color="success"
                        sx={{ ml: 1, fontSize: '8.5pt' }}
                      />
                    </Box>
                  )}
                  {behavior.scaleUp.policies && behavior.scaleUp.policies.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt', display: 'block', mb: 0.5 }}>
                        策略规则:
                      </Typography>
                      <Stack spacing={0.5}>
                        {behavior.scaleUp.policies.map((policy: any, idx: number) => (
                          <Chip 
                            key={idx}
                            label={`${policy.type}: ${policy.value} / ${policy.periodSeconds}秒`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '8pt' }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}
            
            {/* 缩容行为 */}
            {behavior.scaleDown && (
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fff3e0', borderColor: '#ff9800', borderWidth: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e65100', fontSize: '9.5pt', mb: 1 }}>
                  ↓ 缩容策略
                </Typography>
                <Stack spacing={0.8}>
                  {behavior.scaleDown.stabilizationWindowSeconds !== undefined && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                        稳定窗口:
                      </Typography>
                      <Chip 
                        label={`${behavior.scaleDown.stabilizationWindowSeconds}秒`}
                        size="small"
                        sx={{ ml: 1, fontSize: '8.5pt' }}
                      />
                    </Box>
                  )}
                  {behavior.scaleDown.selectPolicy && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt' }}>
                        策略选择:
                      </Typography>
                      <Chip 
                        label={behavior.scaleDown.selectPolicy}
                        size="small"
                        color="warning"
                        sx={{ ml: 1, fontSize: '8.5pt' }}
                      />
                    </Box>
                  )}
                  {behavior.scaleDown.policies && behavior.scaleDown.policies.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '8pt', display: 'block', mb: 0.5 }}>
                        策略规则:
                      </Typography>
                      <Stack spacing={0.5}>
                        {behavior.scaleDown.policies.map((policy: any, idx: number) => (
                          <Chip 
                            key={idx}
                            label={`${policy.type}: ${policy.value} / ${policy.periodSeconds}秒`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '8pt' }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

// 渲染 ConfigMap Data
function RenderConfigMapData({ data, primaryColor, secondaryColor }: { data: any; primaryColor: string; secondaryColor: string }) {
  if (!data || Object.keys(data).length === 0) {
    return <Typography variant="body2" sx={{ color: secondaryColor, fontStyle: 'italic' }}>无数据</Typography>;
  }

  return (
    <Stack spacing={1}>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: primaryColor, fontSize: '9pt', mb: 0.5 }}>
            {key}
          </Typography>
          <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50' }}>
            <Typography 
              component="pre" 
              sx={{ 
                fontFamily: 'monospace', 
                fontSize: '8.5pt',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0
              }}
            >
              {String(value)}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Stack>
  );
}

// 获取资源类型图标
function getResourceIcon(kind: string) {
  switch (kind) {
    case 'Deployment':
    case 'StatefulSet':
    case 'DaemonSet':
      return <CloudIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'Service':
      return <DnsIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'ConfigMap':
      return <SettingsIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'Secret':
      return <VpnKeyIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'PersistentVolumeClaim':
    case 'PersistentVolume':
      return <StorageIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'HorizontalPodAutoscaler':
      return <TrendingUpIcon sx={{ fontSize: '16px', mr: 0.5, verticalAlign: 'middle' }} />;
    default:
      return null;
  }
}

// 判断是否为支持的 K8s 资源类型（有专门的渲染逻辑）
function isSupportedK8sResource(kind: string): boolean {
  const supportedKinds = [
    'Deployment',
    'StatefulSet',
    'DaemonSet',
    'ReplicaSet',
    'Service',
    'Ingress',
    'ConfigMap',
    'Secret',
    'PersistentVolume',
    'PersistentVolumeClaim',
    'StorageClass',
    'ServiceAccount',
    'Role',
    'RoleBinding',
    'ClusterRole',
    'ClusterRoleBinding',
    'HorizontalPodAutoscaler',
    'PodDisruptionBudget',
    'NetworkPolicy',
    'Pod',
    'Job',
    'CronJob',
    'Namespace',
  ];
  return supportedKinds.includes(kind);
}

export default function K8sPreview({ resource, theme, customTypography }: K8sPreviewProps) {
  // 应用主题颜色（提前定义，供所有资源使用）
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

  // Handle cases where resource structure might be incomplete
  if (!resource || typeof resource !== 'object') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          无效的 Kubernetes 资源格式
        </Typography>
      </Box>
    );
  }

  // 如果是数组，渲染多个资源
  if (Array.isArray(resource)) {
    return (
      <Box className="k8s-preview-container" sx={{ 
        p: 0,
        m: 0,
        bgcolor: backgroundColor, 
        color: textColor, 
        fontFamily, 
        fontSize, 
        lineHeight 
      }}>
        {/* 头部信息 */}
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: primaryColor, color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: headingFont }}>
            Kubernetes 资源清单
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '9pt' }}>
            共 {resource.length} 个资源
          </Typography>
        </Paper>

        {/* 渲染每个资源 */}
        <Stack spacing={2} sx={{ mx: 3, mb: 3 }}>
          {resource.map((res, idx) => (
            <Paper 
              key={idx} 
              elevation={2} 
              sx={{ 
                p: 0,
                borderLeft: 4,
                borderLeftColor: accentColor,
                overflow: 'hidden'
              }}
            >
              <K8sPreview 
                resource={res} 
                theme={theme} 
                customTypography={customTypography}
              />
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  }

  // 单个资源的渲染逻辑
  const { apiVersion, kind, metadata, spec, data } = resource;
  
  // Validate required fields
  if (!metadata || !metadata.name) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="error">
          Kubernetes 资源缺少必需的 metadata.name 字段
        </Typography>
      </Box>
    );
  }

  // 如果是不支持的资源类型（如 CRD），回退到通用 YAML 预览
  if (!isSupportedK8sResource(kind)) {
    return (
      <Box sx={{ 
        p: 0,
        m: 0,
        bgcolor: backgroundColor, 
        color: textColor, 
        fontFamily, 
        fontSize, 
        lineHeight 
      }}>
        {/* 提示信息 */}
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: '#fff3e0', color: '#e65100' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsIcon sx={{ fontSize: '18px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '10pt' }}>
                不支持的资源类型: {kind}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '8pt', opacity: 0.9 }}>
                使用通用 YAML 预览模式显示
              </Typography>
            </Box>
          </Stack>
        </Paper>
        
        {/* 使用通用预览 */}
        <Box sx={{ mx: 3, mb: 3 }}>
          <GenericPreview 
            data={resource} 
            title={`${kind}: ${metadata.name}`}
            theme={theme}
            customTypography={customTypography}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="k8s-preview-container" sx={{ 
      p: 0,
      m: 0,
      bgcolor: backgroundColor, 
      color: textColor, 
      fontFamily, 
      fontSize, 
      lineHeight 
    }}>
      {/* 资源头部 */}
      <Paper elevation={1} sx={{ p: 1.5, mx: 3, mt: 3, mb: 1.5, bgcolor: primaryColor, color: 'white' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip 
            label={kind} 
            sx={{ 
              bgcolor: 'white', 
              color: primaryColor,
              fontWeight: 'bold',
              fontSize: '13px',
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: headingFont }}>
            {metadata.name}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '9pt' }}>
          API Version: {apiVersion}
        </Typography>
      </Paper>

      {/* 元数据 */}
      <Paper elevation={1} sx={{ p: 1.5, mx: 3, mb: 1.5, borderColor, borderWidth: 1, borderStyle: 'solid' }}>
        <Typography variant="h6" gutterBottom sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '13pt', fontFamily: headingFont }}>
          Metadata
        </Typography>
        <Divider sx={{ mb: 1, borderColor }} />
        
        <Stack spacing={1}>
          <Box>
            <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt' }}>Name:</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '9.5pt' }}>
              {metadata.name}
            </Typography>
          </Box>
          
          {metadata.namespace && (
            <Box>
              <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt' }}>Namespace:</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '9.5pt' }}>
                {metadata.namespace}
              </Typography>
            </Box>
          )}
          
          {metadata.labels && Object.keys(metadata.labels).length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt' }} gutterBottom>
                Labels:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                {Object.entries(metadata.labels).map(([key, value]) => (
                  <Chip 
                    key={key} 
                    label={`${key}: ${value}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderColor: accentColor, color: accentColor, fontSize: '8.5pt' }}
                  />
                ))}
              </Stack>
            </Box>
          )}
          
          {metadata.annotations && Object.keys(metadata.annotations).length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ color: secondaryColor, fontSize: '9pt' }} gutterBottom>
                Annotations:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                {Object.entries(metadata.annotations).map(([key, value]) => (
                  <Chip 
                    key={key} 
                    label={`${key}: ${value}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderColor: secondaryColor, color: secondaryColor, fontSize: '8.5pt' }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Spec */}
      {spec && (
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mb: 1.5, borderColor, borderWidth: 1, borderStyle: 'solid' }}>
          <Typography variant="h6" gutterBottom sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '13pt', fontFamily: headingFont }}>
            {getResourceIcon(kind)}
            Spec
          </Typography>
          <Divider sx={{ mb: 1, borderColor }} />
          
          {/* 根据资源类型渲染不同的 Spec */}
          {kind === 'Deployment' || kind === 'StatefulSet' || kind === 'DaemonSet' ? (
            <RenderDeploymentSpec 
              spec={spec} 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              accentColor={accentColor} 
              borderColor={borderColor} 
            />
          ) : kind === 'Service' ? (
            <RenderServiceSpec 
              spec={spec} 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              accentColor={accentColor} 
              borderColor={borderColor} 
            />
          ) : kind === 'HorizontalPodAutoscaler' ? (
            <RenderHPASpec 
              spec={spec} 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              accentColor={accentColor} 
              borderColor={borderColor} 
            />
          ) : (
            <RenderObject obj={spec} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} />
          )}
        </Paper>
      )}

      {/* Data (for ConfigMap/Secret) */}
      {data && (
        <Paper elevation={1} sx={{ p: 1.5, mx: 3, mb: 3, borderColor, borderWidth: 1, borderStyle: 'solid' }}>
          <Typography variant="h6" gutterBottom sx={{ color: primaryColor, fontWeight: 'bold', fontSize: '13pt', fontFamily: headingFont }}>
            {getResourceIcon(kind)}
            数据
          </Typography>
          <Divider sx={{ mb: 1, borderColor }} />
          {kind === 'ConfigMap' ? (
            <RenderConfigMapData data={data} primaryColor={primaryColor} secondaryColor={secondaryColor} />
          ) : (
            <RenderObject obj={data} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} borderColor={borderColor} />
          )}
        </Paper>
      )}
    </Box>
  );
}
