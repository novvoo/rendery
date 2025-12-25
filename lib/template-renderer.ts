/**
 * 通用 YAML 模板渲染器
 * 支持Yaml、K8s、Docker Compose 等多种 YAML 模板
 */

export type TemplateType = 'cv' | 'k8s' | 'docker-compose' | 'github-actions' | 'generic';

export interface TemplateMetadata {
  type: TemplateType;
  name: string;
  description?: string;
  version?: string;
}

export interface RenderOptions {
  theme?: string;
  colors?: Record<string, string>;
  showLineNumbers?: boolean;
  highlightSyntax?: boolean;
}

/**
 * 检测 YAML 模板类型
 */
export function detectTemplateType(yamlContent: string): TemplateType {
  const content = yamlContent.toLowerCase();
  
  // K8s 检测
  if (content.includes('apiversion:') && content.includes('kind:')) {
    return 'k8s';
  }
  
  // Docker Compose 检测
  if (content.includes('version:') && content.includes('services:')) {
    return 'docker-compose';
  }
  
  // GitHub Actions 检测
  if (content.includes('on:') && (content.includes('jobs:') || content.includes('steps:'))) {
    return 'github-actions';
  }
  
  // Yaml检测
  if (content.includes('cv:') || content.includes('name:') && content.includes('sections:')) {
    return 'cv';
  }
  
  return 'generic';
}

/**
 * 解析 K8s YAML
 */
export function parseK8sYaml(yamlContent: any): any {
  if (typeof yamlContent === 'string') {
    return null;
  }
  
  return {
    apiVersion: yamlContent.apiVersion,
    kind: yamlContent.kind,
    metadata: yamlContent.metadata,
    spec: yamlContent.spec,
    data: yamlContent.data,
  };
}

/**
 * 渲染 K8s 资源
 */
export function renderK8sResource(resource: any): string {
  const { kind, metadata, spec } = resource;
  
  let html = `<div class="k8s-resource">`;
  html += `<div class="resource-header">`;
  html += `<span class="resource-kind">${kind}</span>`;
  html += `<span class="resource-name">${metadata?.name || 'unnamed'}</span>`;
  html += `</div>`;
  
  if (metadata?.namespace) {
    html += `<div class="resource-namespace">Namespace: ${metadata.namespace}</div>`;
  }
  
  if (metadata?.labels) {
    html += `<div class="resource-labels">`;
    html += `<strong>Labels:</strong> `;
    html += Object.entries(metadata.labels)
      .map(([k, v]) => `<span class="label">${k}: ${v}</span>`)
      .join(', ');
    html += `</div>`;
  }
  
  if (spec) {
    html += `<div class="resource-spec">`;
    html += `<strong>Spec:</strong>`;
    html += `<pre>${JSON.stringify(spec, null, 2)}</pre>`;
    html += `</div>`;
  }
  
  html += `</div>`;
  return html;
}

/**
 * 获取模板元数据
 */
export function getTemplateMetadata(yamlContent: any): TemplateMetadata {
  const type = detectTemplateType(typeof yamlContent === 'string' ? yamlContent : JSON.stringify(yamlContent));
  
  let name = 'Untitled';
  let description = '';
  
  if (type === 'k8s' && yamlContent.metadata) {
    name = yamlContent.metadata.name || 'K8s Resource';
    description = `${yamlContent.kind} in ${yamlContent.metadata.namespace || 'default'}`;
  } else if (type === 'cv' && yamlContent.cv) {
    name = yamlContent.cv.name || 'Resume';
    description = yamlContent.cv.headline || '';
  }
  
  return { type, name, description };
}
