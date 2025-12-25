import { CVDocument } from '@/types/cv';

export function parseYAML(yamlString: string): CVDocument | null {
  try {
    // 简单的 YAML 解析（生产环境应使用 js-yaml 库）
    const lines = yamlString.split('\n');
    const result: any = { cv: {} };
    
    // 这里应该使用专业的 YAML 解析库
    // 暂时返回默认结构
    return result as CVDocument;
  } catch (error) {
    console.error('YAML 解析错误:', error);
    return null;
  }
}

export function validateCV(cv: CVDocument): boolean {
  return !!(cv.cv && cv.cv.name);
}
