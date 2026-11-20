/**
 * One-click colour schemes for the editor, grouped so the picker stays scannable.
 * Every palette clears WCAG AA for page text on its background (4.5:1) and 3:1 for cover text on both cover colours.
 * `fx` is the second colour used by cover effects and decorations (aurora, flags, stained glass, curtains…).
 */
export const PALETTE_GROUPS = ['Classic', 'Pastel', 'Bold', 'Dark', 'Seasonal'];

export const PALETTES = [
  /* Classic */
  { group: 'Classic', name: 'Forest', bg: '#F6F3EC', text: '#2B3A31', accent: '#B88A5A', from: '#455C50', to: '#2F4237', cover: '#F6F3EC', fx: '#D8C9A3' },
  { group: 'Classic', name: 'Sand', bg: '#FBF6EC', text: '#4A3624', accent: '#B7873F', from: '#F3E4C8', to: '#E6CFA4', cover: '#4A3624', fx: '#D9A85B' },
  { group: 'Classic', name: 'Ocean', bg: '#F5FAFC', text: '#1F3B4D', accent: '#2A9DB0', from: '#2B6E8F', to: '#173F57', cover: '#F2F9FC', fx: '#7FD3E0' },
  { group: 'Classic', name: 'Terracotta', bg: '#FFF7EE', text: '#4A2A1C', accent: '#D2693A', from: '#F6D9BF', to: '#EBBF9C', cover: '#4A2A1C', fx: '#2F5FA8' },
  { group: 'Classic', name: 'Mono', bg: '#FFFFFF', text: '#1E1E1E', accent: '#1E1E1E', from: '#F2F2F2', to: '#E4E4E4', cover: '#1E1E1E', fx: '#9A9A9A' },
  { group: 'Classic', name: 'Sage', bg: '#F7F8F2', text: '#34402F', accent: '#8A9A5B', from: '#DDE5D2', to: '#C7D4BA', cover: '#2F3A2B', fx: '#D6C27A' },

  /* Pastel */
  { group: 'Pastel', name: 'Blush', bg: '#FFF8F6', text: '#5B3A3F', accent: '#C98A94', from: '#F8E3E3', to: '#F2CFD0', cover: '#5B3A3F', fx: '#E8B4BC' },
  { group: 'Pastel', name: 'Lavender', bg: '#FBF9FF', text: '#46386B', accent: '#8A6FD1', from: '#F5F0FF', to: '#E4D9FA', cover: '#46386B', fx: '#F2B8D4' },
  { group: 'Pastel', name: 'Peach Sorbet', bg: '#FFF8F3', text: '#5A3527', accent: '#D9785A', from: '#FFE3D3', to: '#FBCDB6', cover: '#5A3527', fx: '#F7B7A3' },
  { group: 'Pastel', name: 'Mint Cream', bg: '#F6FCF9', text: '#234237', accent: '#2F936D', from: '#D9F2E6', to: '#BFE8D5', cover: '#234237', fx: '#A8E0C9' },
  { group: 'Pastel', name: 'Baby Blue', bg: '#F6FAFF', text: '#24395A', accent: '#4A7EC6', from: '#DDEBFB', to: '#C6DCF6', cover: '#24395A', fx: '#F5C6D6' },
  { group: 'Pastel', name: 'Lilac Mist', bg: '#FAF8FD', text: '#45365F', accent: '#8C6AC8', from: '#EDE4FA', to: '#DCCDF4', cover: '#45365F', fx: '#F2C4DE' },
  { group: 'Pastel', name: 'Butter', bg: '#FFFDF3', text: '#4A3F12', accent: '#B98A10', from: '#FFF2BF', to: '#FCE59A', cover: '#4A3F12', fx: '#F6B98A' },
  { group: 'Pastel', name: 'Rose Quartz', bg: '#FFF8F9', text: '#5A2F3B', accent: '#C9647F', from: '#FADDE4', to: '#F4C6D2', cover: '#5A2F3B', fx: '#C9B8F0' },

  /* Bold */
  { group: 'Bold', name: 'Berry', bg: '#FFF6F8', text: '#4A1530', accent: '#C2185B', from: '#7A1B4B', to: '#4A0E2E', cover: '#FFEEF3', fx: '#FF8FB1' },
  { group: 'Bold', name: 'Citrus', bg: '#FFFCEF', text: '#3B3200', accent: '#E8A200', from: '#FFD84D', to: '#FFB300', cover: '#3B2A00', fx: '#FF7A3D' },
  { group: 'Bold', name: 'Fiesta', bg: '#FFF9F2', text: '#3A1A14', accent: '#E63946', from: '#FF9F1C', to: '#F25C54', cover: '#2B0F0A', fx: '#2EC4B6' },
  { group: 'Bold', name: 'Electric', bg: '#F7F7FF', text: '#1A1446', accent: '#5B3DF5', from: '#5B3DF5', to: '#2A1A9E', cover: '#FFFFFF', fx: '#00E0C6' },
  { group: 'Bold', name: 'Tangerine', bg: '#FFF8F1', text: '#40210B', accent: '#E0620F', from: '#D9600F', to: '#A8430A', cover: '#FFF6EE', fx: '#FFD166' },
  { group: 'Bold', name: 'Cobalt', bg: '#F5F8FF', text: '#10224A', accent: '#1F5BD6', from: '#1F5BD6', to: '#0F2F7A', cover: '#FFFFFF', fx: '#FFC93C' },
  { group: 'Bold', name: 'Flamingo', bg: '#FFF6F9', text: '#4A1230', accent: '#E0457F', from: '#D93A78', to: '#A81E5E', cover: '#FFFFFF', fx: '#FFB547' },
  { group: 'Bold', name: 'Emerald', bg: '#F4FBF7', text: '#0F3324', accent: '#12925E', from: '#0E7A4F', to: '#08442C', cover: '#F2FFF8', fx: '#F2C14E' },

  /* Dark */
  { group: 'Dark', name: 'Midnight', bg: '#0F1730', text: '#E8ECF8', accent: '#E3C27D', from: '#1B2750', to: '#0A1022', cover: '#F4F1E8', fx: '#7B8FE0' },
  { group: 'Dark', name: 'Noir & gold', bg: '#14130F', text: '#EFE6D3', accent: '#D4AF6A', from: '#1B1913', to: '#0C0B08', cover: '#EFE6D3', fx: '#F0D9A0' },
  { group: 'Dark', name: 'Velvet', bg: '#1E0A10', text: '#F6E6E8', accent: '#D9A05B', from: '#4A0E1F', to: '#22050D', cover: '#FBEAEC', fx: '#B23A5A' },
  { group: 'Dark', name: 'Deep Teal', bg: '#0C2226', text: '#E3F4F2', accent: '#E7B75F', from: '#134E52', to: '#0A2B2E', cover: '#EAF7F5', fx: '#3FD0C0' },
  { group: 'Dark', name: 'Plum Night', bg: '#1A1024', text: '#EEE6F7', accent: '#C9A2F2', from: '#3A1E55', to: '#1A0C2A', cover: '#F5EEFD', fx: '#F28AB2' },
  { group: 'Dark', name: 'Onyx & Silver', bg: '#121316', text: '#E8E9EC', accent: '#BFC5CE', from: '#24262B', to: '#0D0E10', cover: '#F1F2F4', fx: '#8FA3BF' },
  { group: 'Dark', name: 'Navy & Brass', bg: '#0E1626', text: '#EAE4D6', accent: '#C8A15A', from: '#1A2A47', to: '#0B1424', cover: '#F3ECDC', fx: '#5C7FBF' },
  { group: 'Dark', name: 'Espresso', bg: '#1C1410', text: '#F1E6DA', accent: '#D29B62', from: '#3B2A20', to: '#1C130E', cover: '#F6EBDD', fx: '#9C6B44' },

  /* Seasonal */
  { group: 'Seasonal', name: 'Christmas', bg: '#FFF9F0', text: '#3A1717', accent: '#B3202A', from: '#1F5A3D', to: '#123826', cover: '#FFF4E2', fx: '#E8B04A' },
  { group: 'Seasonal', name: 'Spring Bloom', bg: '#FBFDF6', text: '#2E3B22', accent: '#C95F82', from: '#E6F2D6', to: '#F9DCE6', cover: '#2E3B22', fx: '#F4D35E' },
  { group: 'Seasonal', name: 'Summer Coast', bg: '#F4FBFD', text: '#12384A', accent: '#E07A26', from: '#2C8DB8', to: '#145C7E', cover: '#FFFFFF', fx: '#FFE08A' },
  { group: 'Seasonal', name: 'Autumn Harvest', bg: '#FBF4EA', text: '#3E2513', accent: '#C2621F', from: '#8C3B17', to: '#4E200B', cover: '#FBEBD5', fx: '#E0A030' },
  { group: 'Seasonal', name: 'Winter Frost', bg: '#F5F9FC', text: '#1C2E44', accent: '#4F82B5', from: '#DCE8F3', to: '#B9CFE6', cover: '#1C2E44', fx: '#FFFFFF' },
  { group: 'Seasonal', name: 'New Year', bg: '#0D0D10', text: '#EDEAE2', accent: '#E2C275', from: '#1C1B22', to: '#08080A', cover: '#F7F1E1', fx: '#C9CED8' },
];

export const paletteToTheme = (p) => ({
  bgColor: p.bg, textColor: p.text, accentColor: p.accent, coverFrom: p.from, coverTo: p.to, coverText: p.cover, fxColor: p.fx || '',
});
