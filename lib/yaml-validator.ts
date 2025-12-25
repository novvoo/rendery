
export interface ValidationError {
  location: string[];
  message: string;
  input?: string;
}

export function validateCV(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 检查必需字段
  if (!data.cv) {
    errors.push({
      location: ['cv'],
      message: '缺少 cv 字段',
    });
    return errors;
  }
  
  if (!data.cv.name) {
    errors.push({
      location: ['cv', 'name'],
      message: '缺少姓名字段',
    });
  }
  
  // 验证邮箱格式
  if (data.cv.email) {
    const emails = Array.isArray(data.cv.email) ? data.cv.email : [data.cv.email];
    emails.forEach((email: string, idx: number) => {
      if (!isValidEmail(email)) {
        errors.push({
          location: ['cv', 'email', idx.toString()],
          message: '邮箱格式不正确',
          input: email,
        });
      }
    });
  }
  
  // 验证日期格式
  if (data.cv.sections) {
    Object.entries(data.cv.sections).forEach(([sectionTitle, entries]: [string, any]) => {
      if (!Array.isArray(entries)) {
        errors.push({
          location: ['cv', 'sections', sectionTitle],
          message: '部分内容必须是数组',
        });
        return;
      }
      
      entries.forEach((entry: any, idx: number) => {
        // 验证教育经历
        if (entry.institution) {
          if (!entry.degree) {
            errors.push({
              location: ['cv', 'sections', sectionTitle, idx.toString(), 'degree'],
              message: '教育经历缺少学位字段',
            });
          }
          if (!entry.area) {
            errors.push({
              location: ['cv', 'sections', sectionTitle, idx.toString(), 'area'],
              message: '教育经历缺少专业字段',
            });
          }
          validateDate(entry.start_date, ['cv', 'sections', sectionTitle, idx.toString(), 'start_date'], errors);
          validateDate(entry.end_date, ['cv', 'sections', sectionTitle, idx.toString(), 'end_date'], errors);
        }
        
        // 验证工作经历
        if (entry.company) {
          if (!entry.position) {
            errors.push({
              location: ['cv', 'sections', sectionTitle, idx.toString(), 'position'],
              message: '工作经历缺少职位字段',
            });
          }
          validateDate(entry.start_date, ['cv', 'sections', sectionTitle, idx.toString(), 'start_date'], errors);
          validateDate(entry.end_date, ['cv', 'sections', sectionTitle, idx.toString(), 'end_date'], errors);
        }
      });
    });
  }
  
  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateDate(date: any, location: string[], errors: ValidationError[]): void {
  if (!date) return;
  
  if (date === 'present') return;
  
  if (typeof date === 'number') {
    if (date < 1900 || date > 2100) {
      errors.push({
        location,
        message: '年份必须在 1900-2100 之间',
        input: date.toString(),
      });
    }
    return;
  }
  
  if (typeof date === 'string') {
    // YYYY-MM-DD or YYYY-MM format
    const dateRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;
    if (!dateRegex.test(date)) {
      errors.push({
        location,
        message: '日期格式不正确，应为 YYYY、YYYY-MM 或 YYYY-MM-DD',
        input: date,
      });
    }
  }
}
