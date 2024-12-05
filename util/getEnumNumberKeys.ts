export default function getEnumNumberKeys(enumObject: any): number[] {
  return Object.values(enumObject).filter((d) => typeof d === 'number')
}