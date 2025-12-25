import { Locale, defaultLocale } from '@/types/cv';

export function getDateObject(date: string | number, currentDate?: Date): Date {
  if (typeof date === 'number') {
    return new Date(date, 0, 1);
  }
  
  if (date === 'present') {
    return currentDate || new Date();
  }
  
  // YYYY-MM-DD or YYYY-MM format
  const parts = date.split('-');
  const year = parseInt(parts[0]);
  const month = parts[1] ? parseInt(parts[1]) - 1 : 0;
  const day = parts[2] ? parseInt(parts[2]) : 1;
  
  return new Date(year, month, day);
}

export function dateObjectToString(
  date: Date,
  locale: Locale,
  template: string
): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Safety checks for locale arrays
  const monthNames = locale?.month_names || defaultLocale.month_names;
  const monthAbbreviations = locale?.month_abbreviations || defaultLocale.month_abbreviations;
  
  const placeholders: Record<string, string> = {
    MONTH_NAME: monthNames[month - 1] || month.toString(),
    MONTH_ABBREVIATION: monthAbbreviations[month - 1] || month.toString(),
    MONTH: month.toString(),
    MONTH_IN_TWO_DIGITS: month.toString().padStart(2, '0'),
    YEAR: year.toString(),
    YEAR_IN_TWO_DIGITS: year.toString().slice(-2),
  };
  
  return substitutePlaceholders(template, placeholders);
}

export function formatDateRange(
  startDate: string | number,
  endDate: string | number,
  locale: Locale,
  singleDateTemplate: string,
  dateRangeTemplate: string
): string {
  let startStr: string;
  let endStr: string;
  
  if (typeof startDate === 'number') {
    startStr = startDate.toString();
  } else {
    const dateObj = getDateObject(startDate);
    startStr = dateObjectToString(dateObj, locale, singleDateTemplate);
  }
  
  if (endDate === 'present') {
    endStr = locale?.present || defaultLocale.present;
  } else if (typeof endDate === 'number') {
    endStr = endDate.toString();
  } else {
    const dateObj = getDateObject(endDate);
    endStr = dateObjectToString(dateObj, locale, singleDateTemplate);
  }
  
  return substitutePlaceholders(dateRangeTemplate, {
    START_DATE: startStr,
    END_DATE: endStr,
  });
}

export function formatSingleDate(
  date: string | number,
  locale: Locale,
  template: string
): string {
  if (typeof date === 'number') {
    return date.toString();
  }
  
  if (date === 'present') {
    return locale?.present || defaultLocale.present;
  }
  
  try {
    const dateObj = getDateObject(date);
    return dateObjectToString(dateObj, locale, template);
  } catch {
    // Custom date string
    return date;
  }
}

export function computeTimeSpan(
  startDate: string | number,
  endDate: string | number,
  locale: Locale,
  currentDate: Date,
  template: string
): string {
  if (typeof startDate === 'number' || typeof endDate === 'number') {
    const startYear = getDateObject(startDate, currentDate).getFullYear();
    const endYear = getDateObject(endDate, currentDate).getFullYear();
    const years = endYear - startYear;
    
    const howManyYears = years < 2 ? '1' : years.toString();
    const localeYears = years < 2 ? (locale?.year || defaultLocale.year) : (locale?.years || defaultLocale.years);
    
    return substitutePlaceholders(template, {
      HOW_MANY_YEARS: howManyYears,
      YEARS: localeYears,
      HOW_MANY_MONTHS: '',
      MONTHS: '',
    });
  }
  
  const startDateObj = getDateObject(startDate, currentDate);
  const endDateObj = getDateObject(endDate, currentDate);
  
  const timespanInDays = Math.floor(
    (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let years = Math.floor(timespanInDays / 365);
  let months = Math.floor((timespanInDays % 365) / 30) + 1;
  
  years += Math.floor(months / 12);
  months %= 12;
  
  const howManyYears = years === 0 ? '' : years === 1 ? '1' : years.toString();
  const localeYears = years === 0 ? '' : years === 1 ? (locale?.year || defaultLocale.year) : (locale?.years || defaultLocale.years);
  const howManyMonths = months === 0 ? '' : months === 1 ? '1' : months.toString();
  const localeMonths = months === 0 ? '' : months === 1 ? (locale?.month || defaultLocale.month) : (locale?.months || defaultLocale.months);
  
  return substitutePlaceholders(template, {
    HOW_MANY_YEARS: howManyYears,
    YEARS: localeYears,
    HOW_MANY_MONTHS: howManyMonths,
    MONTHS: localeMonths,
  });
}

function substitutePlaceholders(
  template: string,
  placeholders: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result.trim().replace(/\s+/g, ' ');
}
