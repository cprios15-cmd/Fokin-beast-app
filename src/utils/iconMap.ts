export const ICONS = [
  { key: 'iconos1', src: require('../../assets/iconos1.png') },
  { key: 'iconos2', src: require('../../assets/iconos2.png') },
  { key: 'iconos3', src: require('../../assets/iconos3.png') },
];

export function getIconSource(key?: string) {
  if (!key) return null;
  const found = ICONS.find((i) => i.key === key);
  return found ? found.src : null;
}
