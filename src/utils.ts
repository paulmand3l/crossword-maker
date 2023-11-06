export const isBlock = (l?: string) => typeof l === 'undefined' || l === '-';

export const mod = (n: number, m: number) => ((n % m) + m) % m;
