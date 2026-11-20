/** One-click colour schemes for the editor. Every pair of text/background colours here clears WCAG AA (4.5:1). */
export const PALETTES = [
  { name: 'Forest', bg: '#F6F3EC', text: '#2B3A31', accent: '#B88A5A', from: '#455C50', to: '#2F4237', cover: '#F6F3EC' },
  { name: 'Blush', bg: '#FFF8F6', text: '#5B3A3F', accent: '#C98A94', from: '#F8E3E3', to: '#F2CFD0', cover: '#5B3A3F' },
  { name: 'Midnight', bg: '#0F1730', text: '#E8ECF8', accent: '#E3C27D', from: '#1B2750', to: '#0A1022', cover: '#F4F1E8' },
  { name: 'Sand', bg: '#FBF6EC', text: '#4A3624', accent: '#B7873F', from: '#F3E4C8', to: '#E6CFA4', cover: '#4A3624' },
  { name: 'Ocean', bg: '#F5FAFC', text: '#1F3B4D', accent: '#2A9DB0', from: '#2B6E8F', to: '#173F57', cover: '#F2F9FC' },
  { name: 'Terracotta', bg: '#FFF7EE', text: '#4A2A1C', accent: '#D2693A', from: '#F6D9BF', to: '#EBBF9C', cover: '#4A2A1C' },
  { name: 'Lavender', bg: '#FBF9FF', text: '#46386B', accent: '#8A6FD1', from: '#F5F0FF', to: '#E4D9FA', cover: '#46386B' },
  { name: 'Mono', bg: '#FFFFFF', text: '#1E1E1E', accent: '#1E1E1E', from: '#F2F2F2', to: '#E4E4E4', cover: '#1E1E1E' },
  { name: 'Noir & gold', bg: '#14130F', text: '#EFE6D3', accent: '#D4AF6A', from: '#1B1913', to: '#0C0B08', cover: '#EFE6D3' },
  { name: 'Sage', bg: '#F7F8F2', text: '#34402F', accent: '#8A9A5B', from: '#DDE5D2', to: '#C7D4BA', cover: '#2F3A2B' },
  { name: 'Berry', bg: '#FFF6F8', text: '#4A1530', accent: '#C2185B', from: '#7A1B4B', to: '#4A0E2E', cover: '#FFEEF3' },
  { name: 'Citrus', bg: '#FFFCEF', text: '#3B3200', accent: '#E8A200', from: '#FFD84D', to: '#FFB300', cover: '#3B2A00' },
];

export const paletteToTheme = (p) => ({ bgColor: p.bg, textColor: p.text, accentColor: p.accent, coverFrom: p.from, coverTo: p.to, coverText: p.cover });
