/**
 * Batch 9 — 14 templates showcasing the new cover effects (ripple, rays, leaks, holo, blobs, warp, rain, burst),
 * title animations (drop, wave, pop, wipe, tracking, glow, glitch) and section reveals (flip, tilt, wipe, drop,
 * slide-right, settle).
 * Row: id, name, occasion, style, mood, colorFamily, layout, decor, coverEffect, titleAnim, reveal,
 *      headingFont, bodyFont, bg, text, accent, coverFrom, coverTo, coverText, blurb, [extras: fxColor, align]
 */
export default function buildExtra7(t) {
  const R = (id, name, occ, style, mood, color, layout, decor, effect, anim, reveal, hf, bf, bg, tx, ac, cf, ct, cc, blurb, x = {}) =>
    t(id, name, occ, style, mood, color, {
      fontHeading: hf, fontBody: bf, layout, decor, coverEffect: effect, titleAnim: anim, reveal,
      bgColor: bg, textColor: tx, accentColor: ac, coverFrom: cf, coverTo: ct, coverText: cc, ...x,
    }, blurb);

  return [
    R('still-waters', 'Still Waters', 'wedding', 'Zen', 'Serene', 'teal', 'classic', 'none', 'ripple', 'tracking', 'settle', 'Cormorant Garamond', 'Inter', '#F4F9F8', '#1E3A38', '#2A8C86', '#1E4D4F', '#0F2E30', '#EAF6F4', 'Slow ripples across still water, and names that drift into focus.', { fxColor: '#9FE3DA' }),
    R('first-ripple', 'First Ripple', 'engagement', 'Minimalist', 'Romantic', 'pink', 'medallion', 'petals', 'ripple', 'wipe', 'flip', 'Italiana', 'Lora', '#FFF8F9', '#5A2F3B', '#C9647F', '#FADDE4', '#F4C6D2', '#5A2F3B', 'Ripples spreading from a rose-pink seal. One yes, endless waves.', { fxColor: '#C9647F' }),
    R('rays-of-grace', 'Rays of Grace', 'baptism', 'Elegant', 'Spiritual', 'gold', 'arch', 'doves', 'rays', 'glow', 'wipe', 'Cinzel', 'Lora', '#FBF8F0', '#33291C', '#A97C2F', '#3A3150', '#1E1A33', '#F6EFDD', 'Soft beams of light fall over an arched portrait as doves rise.', { fxColor: '#FFE7A6' }),
    R('light-of-the-world', 'Light of the World', 'christmas', 'Cathedral', 'Spiritual', 'blue', 'chapel', 'stars', 'rays', 'glow', 'settle', 'Cinzel', 'Lora', '#F7F5EE', '#1F2440', '#B8913F', '#1A2350', '#0B1030', '#F5EEDB', 'Rays of light pour through a stained-glass window on Christmas Eve.', { fxColor: '#FFE7A6' }),
    R('morning-light', 'Morning Light', 'house-blessing', 'Japandi', 'Grateful', 'neutral', 'house', 'none', 'rays', 'tracking', 'settle', 'Josefin Sans', 'Lora', '#F7F4EE', '#33302B', '#A0714F', '#5A4A3A', '#3A2F25', '#F6EFE4', 'Morning sun streams across a little line-drawn house.', { fxColor: '#FFE2B0' }),
    R('home-movie', 'Home Movie', 'anniversary', 'Vintage', 'Nostalgic', 'orange', 'polaroid', 'none', 'leaks', 'tracking', 'tilt', 'Fraunces', 'Lora', '#FBF4EA', '#3E2513', '#C2621F', '#3B2416', '#1F130B', '#FBEBD5', 'Warm film light leaks over a taped snapshot, like an old home movie.', { fxColor: '#FFB25B' }),
    R('afterglow', 'Afterglow', 'other', 'Retro', 'Rebellious', 'purple', 'neon', 'none', 'leaks', 'glitch', 'tilt', 'Bebas Neue', 'Space Grotesk', '#120E1E', '#ECE8FF', '#FF4FA0', '#1D1238', '#0B0716', '#F7F2FF', 'A glitching neon sign under drifting light leaks, for after-parties.', { fxColor: '#3DE0D0' }),
    R('holographic', 'Holographic', 'debut', 'Futuristic', 'Dreamy', 'purple', 'glass', 'stars', 'holo', 'glow', 'flip', 'Syne', 'Space Grotesk', '#F9F7FF', '#2A2148', '#8C6AC8', '#C9B8F0', '#9FD8F0', '#1E1640', 'An iridescent holographic sheen behind a frosted card. Y2K, but make it chic.', { fxColor: '#F7C8E8' }),
    R('lava-lounge', 'Lava Lounge', 'birthday', 'Retro', 'Energetic', 'orange', 'bold', 'none', 'blobs', 'wave', 'drop', 'Shrikhand', 'Poppins', '#FFF6EE', '#3D1A0A', '#E0582F', '#2B1640', '#160B24', '#FFEFE4', 'Morphing liquid blobs and a title that keeps on waving. Groovy.', { fxColor: '#FFB547' }),
    R('hyperdrive', 'Hyperdrive', 'corporate', 'Futuristic', 'Bold', 'blue', 'classic', 'none', 'warp', 'glitch', 'slide-right', 'Space Grotesk', 'Inter', '#F4F7FC', '#121C33', '#3A6FF7', '#0B1124', '#04070F', '#EAF0FF', 'Stars streak past at warp speed. For launches, hackathons and kick-offs.', { fxColor: '#7FA7FF' }),
    R('showered-with-love', 'Showered with Love', 'baby-shower', 'Watercolor', 'Tender', 'blue', 'arch', 'hearts', 'rain', 'pop', 'settle', 'Fredoka', 'Poppins', '#F6FAFF', '#24395A', '#4A7EC6', '#DDEBFB', '#C6DCF6', '#24395A', 'A gentle shower of rain for a baby shower that’s pouring with love.', { fxColor: '#F5C6D6' }),
    R('surprise', 'Surprise!', 'birthday', 'Playful', 'Lively', 'pink', 'bold', 'balloons', 'burst', 'pop', 'zoom', 'Fredoka', 'Poppins', '#FFF8FB', '#3B1C3A', '#D63A6E', '#FF7AA2', '#FF4F7B', '#2B0B1E', 'A confetti cannon goes off every few seconds. Surprise!', { fxColor: '#FFD166' }),
    R('toss-the-caps', 'Toss the Caps', 'graduation', 'Modern', 'Joyful', 'black', 'poster', 'none', 'burst', 'drop', 'slide-right', 'Bebas Neue', 'Poppins', '#F7F7F5', '#1C1C1E', '#2D5BA8', '#16181D', '#0A0B0E', '#F4F4F0', 'Confetti bursts over giant poster type. You did it!', { fxColor: '#F2B705', align: 'left' }),
    R('new-year-burst', 'Midnight Pop', 'holiday', 'Luxury', 'Festive', 'gold', 'marquee', 'foil', 'burst', 'drop', 'drop', 'Limelight', 'Montserrat', '#121018', '#EFE9DA', '#E8C060', '#221C33', '#0F0C18', '#FFF5DC', 'A bulb-lit marquee and a confetti pop at the stroke of midnight.', { fxColor: '#FF5FA2' }),
  ];
}
