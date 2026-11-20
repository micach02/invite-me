/**
 * Batch 6 — 16 Christmas templates. Every one is built around something Christmassy: parols, ornaments, snow,
 * wreaths, lit windows, a North Pole ticket, the Star of Bethlehem, ugly sweaters.
 * Row: id, name, occasion, style, mood, colorFamily, layout, decor, coverEffect, titleAnim, reveal,
 *      headingFont, bodyFont, bg, text, accent, coverFrom, coverTo, coverText, blurb, [extras: fxColor, align]
 */
export default function buildExtra4(t) {
  const R = (id, name, occ, style, mood, color, layout, decor, effect, anim, reveal, hf, bf, bg, tx, ac, cf, ct, cc, blurb, x = {}) =>
    t(id, name, occ, style, mood, color, {
      fontHeading: hf, fontBody: bf, layout, decor, coverEffect: effect, titleAnim: anim, reveal,
      bgColor: bg, textColor: tx, accentColor: ac, coverFrom: cf, coverTo: ct, coverText: cc, ...x,
    }, blurb);
  const X = 'christmas';

  return [
    R('parol-nights', 'Parol Nights', X, 'Traditional', 'Festive', 'gold', 'classic', 'parols', 'gradient', 'rise', 'fade-up', 'Playfair Display', 'Montserrat', '#0F1A33', '#F6EBD0', '#F2B33D', '#14254A', '#0A1330', '#FFF4D6', 'Gold and red parols swinging under a deep Christmas-night sky.', { fxColor: '#E63946' }),
    R('noche-buena', 'Noche Buena', X, 'Traditional', 'Festive', 'red', 'frame', 'ornaments', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Lora', '#FBF3E4', '#4A1B1B', '#B88A2E', '#8E1B24', '#5E0F18', '#FFF3DC', 'Deep red and gold, with ornaments swinging in for the family midnight feast.'),
    R('simbang-gabi', 'Simbang Gabi Breakfast', X, 'Traditional', 'Spiritual', 'blue', 'arch', 'stars', 'none', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#FBF6EA', '#2B3358', '#C98A2C', '#1F2B55', '#8A4E62', '#FFF8E7', 'Pre-dawn blue melting into sunrise glow, for the dawn masses and the breakfast after.'),
    R('wreath-door', 'Wreath on the Door', X, 'Modern Farmhouse', 'Welcoming', 'green', 'doorway', 'snow', 'none', 'blur', 'fade-up', 'Fraunces', 'Lora', '#F7F3EA', '#1F3B2B', '#D14B3F', '#1F5A3D', '#143D29', '#F6F1E3', 'A front door with a leafy wreath and a welcome mat: come in from the cold.'),
    R('snowy-cottage', 'Snowy Cottage', X, 'Scandinavian', 'Cozy', 'blue', 'house', 'snow', 'none', 'rise', 'fade-up', 'Josefin Sans', 'Inter', '#F4F7FB', '#1B2A4A', '#F2A93B', '#1E2F57', '#111C3A', '#F4F8FF', 'A little house draws itself in the snow, then lights its windows.'),
    R('north-pole-express', 'Express to the North Pole', X, 'Playful', 'Festive', 'red', 'ticket', 'snow', 'none', 'typewriter', 'slide', 'Bebas Neue', 'Poppins', '#FFF8EC', '#2B1215', '#F2B705', '#C62828', '#8E1B1B', '#FFF6E5', 'A golden-ticket boarding pass to the North Pole, with a tear-off stub.'),
    R('golden-bauble', 'Golden Bauble', X, 'Luxury', 'Glamorous', 'gold', 'medallion', 'stars', 'shine', 'blur', 'zoom', 'Cinzel', 'Cormorant Garamond', '#0F1F18', '#F1E6C8', '#D9B45B', '#123524', '#0A1F15', '#F6EBCB', 'A gold-rimmed bauble seal on deep pine green, catching the light.'),
    R('family-christmas-card', 'Family Christmas Card', X, 'Vintage', 'Nostalgic', 'red', 'polaroid', 'snow', 'none', 'flip', 'fade-up', 'Playfair Display', 'Lora', '#FBF4E6', '#4A1E1E', '#B3202A', '#F4E7CF', '#E7D2AC', '#4A1E1E', 'A taped family snapshot with snow drifting by. Add your own photo.'),
    R('north-pole-postcard', 'North Pole Postcard', X, 'Vintage', 'Nostalgic', 'green', 'vintage', 'snow', 'none', 'typewriter', 'fade-up', 'Fraunces', 'Lora', '#F8F1E2', '#27402F', '#B3202A', '#2F5D43', '#1F4130', '#F8F1E2', 'A stamped, postmarked card sent all the way from the North Pole.'),
    R('neon-noel', 'Neon Noel', X, 'Futuristic', 'Festive', 'red', 'neon', 'stars', 'none', 'letters', 'zoom', 'Pacifico', 'Poppins', '#0B0F0E', '#F2F2EC', '#FF3B4E', '#0F1613', '#070B09', '#F6F6F0', 'A flickering red neon sign on a dark-green Christmas night.', { fxColor: '#3CFF9E' }),
    R('ugly-sweater-bash', 'Ugly Sweater Bash', X, 'Retro', 'Joyful', 'green', 'poster', 'snow', 'none', 'rise', 'slide', 'Bebas Neue', 'Space Grotesk', '#FFF8EC', '#12261B', '#D62828', '#1E6B45', '#14502F', '#FFF4E0', 'Giant condensed type, a scrolling marquee and zero fashion shame.', { align: 'left' }),
    R('holiday-issue', 'The Holiday Issue', X, 'Editorial', 'Chic', 'red', 'magazine', 'none', 'none', 'blur', 'slide', 'Abril Fatface', 'Montserrat', '#FBF6EE', '#2A0F12', '#B3202A', '#8E1B24', '#5E0F18', '#FFF6E6', 'Your Christmas party on the cover of the season’s glossiest magazine.'),
    R('evergreen-christmas', 'Evergreen Christmas', X, 'Botanical', 'Serene', 'green', 'frame', 'leaves', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Inter', '#F6F3EC', '#22392B', '#B3202A', '#1E4D36', '#133524', '#F6F3EC', 'Pine-green boughs with cranberry accents in a hand-drawn frame.'),
    R('silent-night', 'Silent Night', X, 'Minimalist', 'Serene', 'blue', 'classic', 'stars', 'spotlight', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#0C1733', '#EEE6D2', '#E8C468', '#0F1E3F', '#0A1530', '#F3E9D2', 'A hushed navy sky and a single golden star.'),
    R('elf-party', 'Elf Party', X, 'Neo-Brutalist', 'Joyful', 'green', 'brutal', 'none', 'none', 'flip', 'zoom', 'Syne', 'Space Grotesk', '#FFFDF0', '#111111', '#E5322D', '#27A05A', '#27A05A', '#111111', 'Flat elf-green, candy-cane red and hard black outlines.'),
    R('star-of-bethlehem', 'Star of Bethlehem', X, 'Elegant', 'Spiritual', 'blue', 'arch', 'stars', 'shine', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#F7F4EC', '#262E55', '#C9972F', '#232C5C', '#141B3E', '#FFF6DD', 'A starlit arch over deep indigo, for Christmas Eve mass and the feast after.'),
  ];
}
