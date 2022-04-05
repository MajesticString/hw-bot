export class Util {
  /**
   * @function sleep
   * @param {Number} ms The amount of milliseconds to wait
   * @returns {Promise<void>} An empty promise that will be resolved when the given ms are elapsed
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static normalizeGrade(grade: number | string, type: 'number'): number;
  static normalizeGrade(grade: number | string, type: 'string'): string;
  static normalizeGrade(
    grade: number | string,
    type: 'number' | 'string'
  ): string | number {
    let normalizedGrade: string | undefined;
    if (typeof grade === 'number') normalizedGrade = `${grade}th`;
    if (typeof grade === 'string' && grade.includes('th'))
      normalizedGrade = grade;
    if (typeof grade === 'string' && !grade.includes('th'))
      normalizedGrade = `${grade}th`;
    if (!normalizedGrade) return grade.toString();

    return type === 'string' ? normalizedGrade : normalizedGrade.slice(0, -2);
  }
}
