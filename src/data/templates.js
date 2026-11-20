/**
 * Templates only carry design tokens (theme) — all of them render through the same
 * <InvitationRenderer /> and edit the same JSON config.
 */
import buildExtra from './templates-extra.js';
import buildExtra2 from './templates-extra2.js';
import buildExtra3 from './templates-extra3.js';
import buildExtra4 from './templates-extra4.js';

const t = (id, name, occasion, style, mood, colorFamily, theme, blurb) => ({
  id, name, occasion, style, mood, colorFamily, blurb,
  theme: {
    fontScale: 1, align: 'center', overlay: 0.3,
    // motion defaults — every template spells these out so switching templates never leaves stale values behind
    coverEffect: 'none', titleAnim: 'rise', reveal: 'fade-up', fxColor: '',
    ...theme,
  },
});

const BASE = [
  t('evergreen-vows', 'Evergreen Vows', 'wedding', 'Botanical', 'Serene', 'green', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Inter', layout: 'frame', decor: 'leaves',
    bgColor: '#F6F3EC', textColor: '#2B3A31', accentColor: '#B88A5A',
    coverFrom: '#455C50', coverTo: '#2F4237', coverText: '#F6F3EC',
  }, 'Deep forest greens with a hand-drawn botanical frame.'),

  t('golden-hour', 'Golden Hour', 'wedding', 'Art Deco', 'Glamorous', 'gold', {
    fontHeading: 'Playfair Display', fontBody: 'Montserrat', layout: 'classic', decor: 'geometric',
    bgColor: '#14130F', textColor: '#EFE6D3', accentColor: '#D4AF6A',
    coverFrom: '#1B1913', coverTo: '#0C0B08', coverText: '#EFE6D3',
  }, 'Black and gold Art Deco lines for a formal evening.'),

  t('blush-garden', 'Blush Garden', 'wedding', 'Floral', 'Romantic', 'pink', {
    fontHeading: 'Great Vibes', fontBody: 'Lora', layout: 'arch', decor: 'floral',
    bgColor: '#FFF8F6', textColor: '#5B3A3F', accentColor: '#C98A94',
    coverFrom: '#F8E3E3', coverTo: '#F2CFD0', coverText: '#5B3A3F',
  }, 'Soft blush florals around an arched portrait.'),

  t('modern-minimal', 'Pure & Simple', 'wedding', 'Minimalist', 'Chic', 'neutral', {
    fontHeading: 'Montserrat', fontBody: 'Inter', layout: 'minimal', decor: 'none', align: 'left',
    bgColor: '#FFFFFF', textColor: '#1E1E1E', accentColor: '#8C7B65',
    coverFrom: '#F2EFEA', coverTo: '#E7E2DA', coverText: '#1E1E1E',
  }, 'Large type, generous whitespace, nothing extra.'),

  t('confetti-pop', 'Confetti Pop', 'birthday', 'Playful', 'Energetic', 'pink', {
    fontHeading: 'Fredoka', fontBody: 'Poppins', layout: 'bold', decor: 'confetti',
    bgColor: '#FFF7EC', textColor: '#2D2A4A', accentColor: '#FF6B8B',
    coverFrom: '#FFD36B', coverTo: '#FF9E7A', coverText: '#2D2A4A',
  }, 'Bright colour blocks and confetti for a lively party.'),

  t('midnight-gala', 'Midnight Gala', 'birthday', 'Luxury', 'Glamorous', 'blue', {
    fontHeading: 'Playfair Display', fontBody: 'Montserrat', layout: 'classic', decor: 'stars',
    bgColor: '#0F1730', textColor: '#E8ECF8', accentColor: '#E3C27D',
    coverFrom: '#1B2750', coverTo: '#0A1022', coverText: '#F4F1E8',
  }, 'Deep navy sky scattered with gold sparkles.'),

  t('little-blessing', 'Little Blessing', 'baptism', 'Traditional', 'Spiritual', 'blue', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Lora', layout: 'arch', decor: 'ornament',
    bgColor: '#F7FAFC', textColor: '#2F4560', accentColor: '#8FB0D0',
    coverFrom: '#DCE9F5', coverTo: '#C6DAEE', coverText: '#2F4560',
  }, 'Gentle blues and a classic ornament for a holy day.'),

  t('debut-rose', 'Debut Rose', 'debut', 'Elegant', 'Glamorous', 'pink', {
    fontHeading: 'Playfair Display', fontBody: 'Poppins', layout: 'frame', decor: 'floral',
    bgColor: '#FBF4F2', textColor: '#4A2E33', accentColor: '#C0807F',
    coverFrom: '#C98E91', coverTo: '#9F6468', coverText: '#FFF6F2',
  }, 'Rose-gold tones framed in florals for an 18th celebration.'),

  t('rustic-anniversary', 'Rustic Roots', 'anniversary', 'Vintage', 'Nostalgic', 'gold', {
    fontHeading: 'Dancing Script', fontBody: 'Lora', layout: 'frame', decor: 'leaves',
    bgColor: '#F4EDE2', textColor: '#4A3626', accentColor: '#A8703E',
    coverFrom: '#8A6A4B', coverTo: '#5E442F', coverText: '#F7EFE3',
  }, 'Warm kraft browns for years of togetherness.'),

  t('baby-bloom', 'Baby Bloom', 'baby-shower', 'Playful', 'Dreamy', 'neutral', {
    fontHeading: 'Fredoka', fontBody: 'Poppins', layout: 'bold', decor: 'stars',
    bgColor: '#FFFCF5', textColor: '#40506A', accentColor: '#F2A65A',
    coverFrom: '#CDE8E0', coverTo: '#F9E3B4', coverText: '#40506A',
  }, 'Soft mint and butter yellow for a sweet welcome.'),

  t('summit-split', 'Summit', 'corporate', 'Modern', 'Professional', 'blue', {
    fontHeading: 'Montserrat', fontBody: 'Inter', layout: 'split', decor: 'geometric', align: 'left',
    bgColor: '#F5F7FA', textColor: '#14213D', accentColor: '#2D6CDF',
    coverFrom: '#14213D', coverTo: '#22345E', coverText: '#FFFFFF',
  }, 'A crisp split layout for conferences and company events.'),

  t('holiday-glow', 'Christmas Glow', 'christmas', 'Traditional', 'Cozy', 'red', {
    fontHeading: 'Lora', fontBody: 'Lora', layout: 'classic', decor: 'stars',
    bgColor: '#FBF5EC', textColor: '#3A1F1F', accentColor: '#B8863B',
    coverFrom: '#8E2A2A', coverTo: '#5E1717', coverText: '#FBEFD9',
  }, 'Rich cranberry and gold for a Christmas gathering.'),

  t('graduate-bold', 'Cap & Gown', 'graduation', 'Modern', 'Bold', 'black', {
    fontHeading: 'Poppins', fontBody: 'Inter', layout: 'minimal', decor: 'stars', align: 'left',
    bgColor: '#FAFAF7', textColor: '#17171A', accentColor: '#D9A400',
    coverFrom: '#17171A', coverTo: '#2A2A30', coverText: '#FAFAF7',
  }, 'Confident black and gold for a milestone.'),

  /* ------------------------------------------------------------------
     Motion-forward templates
  ------------------------------------------------------------------- */
  t('aurora-nights', 'Aurora Nights', 'wedding', 'Futuristic', 'Dreamy', 'purple', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Inter', layout: 'classic', decor: 'stars',
    coverEffect: 'aurora', titleAnim: 'blur', reveal: 'blur', fxColor: '#2EE6C5',
    bgColor: '#0E0B1E', textColor: '#ECE8FA', accentColor: '#B9A2FF',
    coverFrom: '#1A1240', coverTo: '#080616', coverText: '#F4F1FF',
  }, 'Northern-lights glow drifting behind a starry sky.'),

  t('neon-glow', 'Neon Nights', 'birthday', 'Futuristic', 'Energetic', 'purple', {
    fontHeading: 'Syne', fontBody: 'Space Grotesk', layout: 'neon', decor: 'stars',
    titleAnim: 'letters', reveal: 'zoom',
    bgColor: '#0B0714', textColor: '#F3EBFF', accentColor: '#FF3DCB',
    coverFrom: '#2A0F4D', coverTo: '#090412', coverText: '#FFFFFF',
  }, 'A flickering neon sign over a retro grid. Built for after-dark parties.'),

  t('floating-hearts', 'Floating Hearts', 'engagement', 'Playful', 'Romantic', 'pink', {
    fontHeading: 'Great Vibes', fontBody: 'Lora', layout: 'polaroid', decor: 'hearts',
    titleAnim: 'blur', reveal: 'fade-up',
    bgColor: '#FFF6F5', textColor: '#5E2F3B', accentColor: '#E0587A',
    coverFrom: '#FFD9DF', coverTo: '#F7B2C1', coverText: '#5E2F3B',
  }, 'A taped polaroid with hearts drifting up the page.'),

  t('snowfall', 'Winter Snowfall', 'christmas', 'Elegant', 'Magical', 'blue', {
    fontHeading: 'Cinzel', fontBody: 'Lora', layout: 'frame', decor: 'snow',
    coverEffect: 'shine', titleAnim: 'rise', reveal: 'fade-up',
    bgColor: '#F4F8FC', textColor: '#17304E', accentColor: '#5C93C9',
    coverFrom: '#1B3B66', coverTo: '#0C2040', coverText: '#F2F7FF',
  }, 'Gentle snowfall and a passing glimmer of light on a snowy Christmas.'),

  t('balloon-bash', 'Balloon Bash', 'birthday', 'Playful', 'Energetic', 'orange', {
    fontHeading: 'Pacifico', fontBody: 'Poppins', layout: 'bold', decor: 'balloons',
    coverEffect: 'gradient', titleAnim: 'letters', reveal: 'zoom', fxColor: '#FF7AA2',
    bgColor: '#FFF8EE', textColor: '#34305A', accentColor: '#FF6B4A',
    coverFrom: '#6BCBFF', coverTo: '#B58CFF', coverText: '#FFFFFF',
  }, 'Colourful balloons floating over a shifting sky gradient.'),

  t('bubbly-baby', 'Bubbly Baby', 'baby-shower', 'Coastal', 'Dreamy', 'teal', {
    fontHeading: 'Dancing Script', fontBody: 'Poppins', layout: 'arch', decor: 'bubbles',
    coverEffect: 'waves', titleAnim: 'rise', reveal: 'fade-up', fxColor: '#FFFFFF',
    bgColor: '#F5FCFB', textColor: '#2C5A60', accentColor: '#3BB8A8',
    coverFrom: '#BFEDE6', coverTo: '#8FD8E8', coverText: '#24505A',
  }, 'Rising bubbles and rolling waves for a sweet splash.'),

  t('admit-one', 'Admit One', 'corporate', 'Modern', 'Professional', 'blue', {
    fontHeading: 'Syne', fontBody: 'Space Grotesk', layout: 'ticket', decor: 'geometric',
    coverEffect: 'gradient', titleAnim: 'rise', reveal: 'slide', fxColor: '#3A7BFF', align: 'left',
    bgColor: '#F6F8FC', textColor: '#10192E', accentColor: '#2D6CDF',
    coverFrom: '#0F1B3D', coverTo: '#1C3270', coverText: '#FFFFFF',
  }, 'A boarding-pass style ticket with a tear-off date stub.'),

  t('snapshot-days', 'Snapshot Days', 'graduation', 'Retro', 'Nostalgic', 'gold', {
    fontHeading: 'Dancing Script', fontBody: 'Poppins', layout: 'polaroid', decor: 'confetti',
    titleAnim: 'blur', reveal: 'fade-up',
    bgColor: '#FFFBF2', textColor: '#35311F', accentColor: '#E5A100',
    coverFrom: '#2F3B66', coverTo: '#1B2344', coverText: '#FFF8E1',
  }, 'A scrapbook polaroid pinned with tape. Add a photo to make it yours.'),

  t('main-character', 'Main Character', 'birthday', 'Editorial', 'Rebellious', 'orange', {
    fontHeading: 'Bebas Neue', fontBody: 'Space Grotesk', layout: 'poster', decor: 'none', align: 'left',
    coverEffect: 'gradient', titleAnim: 'rise', reveal: 'slide', fxColor: '#FF3D77',
    bgColor: '#FFF4EA', textColor: '#1C1C1C', accentColor: '#FF4A1C',
    coverFrom: '#161616', coverTo: '#2B1B1B', coverText: '#FFFFFF',
  }, 'Giant condensed type, a slanted colour band and a scrolling marquee.'),

  t('royal-shimmer', 'Royal Shimmer', 'debut', 'Gothic', 'Regal', 'red', {
    fontHeading: 'Cinzel', fontBody: 'Cormorant Garamond', layout: 'frame', decor: 'ornament',
    coverEffect: 'shimmer', titleAnim: 'blur', reveal: 'blur',
    bgColor: '#FBF3EA', textColor: '#3E1620', accentColor: '#C9A24A',
    coverFrom: '#6E1A2D', coverTo: '#3A0C18', coverText: '#F7E7B5',
  }, 'Burgundy velvet with a gold-leaf title that gleams.'),

  t('sunset-soiree', 'Sunset Soirée', 'wedding', 'Coastal', 'Dreamy', 'orange', {
    fontHeading: 'Playfair Display', fontBody: 'Montserrat', layout: 'classic', decor: 'none',
    coverEffect: 'waves', titleAnim: 'blur', reveal: 'fade-up', fxColor: '#FFE3B0',
    bgColor: '#FFF7F0', textColor: '#4B2A2A', accentColor: '#E5703F',
    coverFrom: '#FF9A6B', coverTo: '#B8456C', coverText: '#FFF8F0',
  }, 'A warm sunset sky with waves rolling in at the horizon.'),

  t('midnight-garden', 'Midnight Garden', 'wedding', 'Botanical', 'Magical', 'teal', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Lora', layout: 'arch', decor: 'floral',
    coverEffect: 'aurora', titleAnim: 'rise', reveal: 'fade-up', fxColor: '#3FD0A0',
    bgColor: '#0D1A17', textColor: '#E3F1EA', accentColor: '#8EE0BE',
    coverFrom: '#12332B', coverTo: '#07130F', coverText: '#EAF7F0',
  }, 'Luminous florals glowing in a moonlit garden.'),

  t('champagne-toast', 'Champagne Toast', 'anniversary', 'Art Deco', 'Glamorous', 'gold', {
    fontHeading: 'Abril Fatface', fontBody: 'Montserrat', layout: 'classic', decor: 'stars',
    coverEffect: 'shine', titleAnim: 'letters', reveal: 'zoom',
    bgColor: '#FBF6EA', textColor: '#2C2415', accentColor: '#B8913F',
    coverFrom: '#2C2415', coverTo: '#14100A', coverText: '#F6E7BE',
  }, 'Sparkling gold on dark, with a light that glides across the cover.'),

  t('cinematic', 'Cinematic', 'wedding', 'Minimalist', 'Cinematic', 'black', {
    fontHeading: 'Montserrat', fontBody: 'Inter', layout: 'minimal', decor: 'none', align: 'center',
    coverEffect: 'kenburns', titleAnim: 'letters', reveal: 'blur', overlay: 0.45,
    bgColor: '#111111', textColor: '#EDEDED', accentColor: '#D8C9B2',
    coverFrom: '#1A1A1A', coverTo: '#050505', coverText: '#FFFFFF',
  }, 'Upload a cover photo and it slowly zooms like a film opening.'),

  /* ------------------------------------------------------------------
     Batch 2 — new layouts (postcard, magazine, medallion), more decor
  ------------------------------------------------------------------- */
  t('cherry-blossom', 'Cherry Blossom', 'wedding', 'Floral', 'Romantic', 'pink', {
    fontHeading: 'Great Vibes', fontBody: 'Lora', layout: 'arch', decor: 'petals',
    titleAnim: 'blur', reveal: 'fade-up',
    bgColor: '#FFF8F8', textColor: '#5A3340', accentColor: '#D9728F',
    coverFrom: '#FFE6EC', coverTo: '#F9C9D6', coverText: '#5A3340',
  }, 'Soft pink petals drifting down around an arched portrait.'),

  t('firefly-forest', 'Firefly Forest', 'wedding', 'Rustic', 'Magical', 'green', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Lora', layout: 'frame', decor: 'fireflies',
    titleAnim: 'rise', reveal: 'blur', fxColor: '#C9F26B',
    bgColor: '#0F1C14', textColor: '#E6F0DF', accentColor: '#C9F26B',
    coverFrom: '#173424', coverTo: '#08130C', coverText: '#EAF4E2',
  }, 'Glowing fireflies blinking in a dark evergreen wood.'),

  t('vintage-postcard', 'Vintage Postcard', 'wedding', 'Vintage', 'Nostalgic', 'gold', {
    fontHeading: 'Playfair Display', fontBody: 'Lora', layout: 'vintage', decor: 'none',
    titleAnim: 'typewriter', reveal: 'fade-up',
    bgColor: '#F6EFE2', textColor: '#3A2C20', accentColor: '#B5533C',
    coverFrom: '#7A6A55', coverTo: '#4C4034', coverText: '#F6EFE2',
  }, 'A tilted keepsake postcard with a stamp, postmark and typewriter title.'),

  t('medallion-gold', 'Gilded Medallion', 'wedding', 'Art Deco', 'Regal', 'gold', {
    fontHeading: 'Cinzel', fontBody: 'Cormorant Garamond', layout: 'medallion', decor: 'geometric',
    coverEffect: 'shine', titleAnim: 'blur', reveal: 'zoom',
    bgColor: '#12100C', textColor: '#F1E7CF', accentColor: '#D8B35A',
    coverFrom: '#1E1A12', coverTo: '#0A0906', coverText: '#F1E7CF',
  }, 'A seal with a slowly rotating ring of text — pure heirloom.'),

  t('paper-lanterns', 'Paper Lanterns', 'anniversary', 'Elegant', 'Magical', 'red', {
    fontHeading: 'Cinzel', fontBody: 'Lora', layout: 'classic', decor: 'lanterns',
    titleAnim: 'rise', reveal: 'fade-up', fxColor: '#FF9F43',
    bgColor: '#FFF6EC', textColor: '#40201A', accentColor: '#C2452D',
    coverFrom: '#2A1230', coverTo: '#12071A', coverText: '#FFE9CF',
  }, 'Glowing lanterns floating up into a twilight sky.'),

  t('fireworks-finale', 'Fireworks Finale', 'holiday', 'Luxury', 'Magical', 'gold', {
    fontHeading: 'Abril Fatface', fontBody: 'Montserrat', layout: 'classic', decor: 'fireworks',
    coverEffect: 'spotlight', titleAnim: 'flip', reveal: 'zoom', fxColor: '#FF5FA2',
    bgColor: '#0B0B14', textColor: '#F2EEFF', accentColor: '#FFC857',
    coverFrom: '#12123A', coverTo: '#05050F', coverText: '#FFFFFF',
  }, 'Bursting fireworks over a midnight sky. Ring in the new year.'),

  t('autumn-gathering', 'Autumn Gathering', 'holiday', 'Rustic', 'Cozy', 'orange', {
    fontHeading: 'Lora', fontBody: 'Lora', layout: 'frame', decor: 'autumn',
    titleAnim: 'rise', reveal: 'fade-up',
    bgColor: '#FBF3E8', textColor: '#47281A', accentColor: '#C4601F',
    coverFrom: '#7A3B1B', coverTo: '#4A200E', coverText: '#FCEBD3',
  }, 'Falling maple leaves for harvest dinners and Thanksgiving.'),

  t('memphis-pop', 'Memphis Pop', 'birthday', 'Retro', 'Bold', 'teal', {
    fontHeading: 'Syne', fontBody: 'Poppins', layout: 'bold', decor: 'memphis',
    coverEffect: 'none', titleAnim: 'flip', reveal: 'zoom', fxColor: '#FFD23F',
    bgColor: '#FFFDF5', textColor: '#16324F', accentColor: '#FF5C8A',
    coverFrom: '#2EC4B6', coverTo: '#1B8F9C', coverText: '#FFFFFF',
  }, '80s-style squiggles and shapes bobbing around a bold title.'),

  t('magazine-cover', 'Cover Star', 'debut', 'Editorial', 'Glamorous', 'black', {
    fontHeading: 'Abril Fatface', fontBody: 'Montserrat', layout: 'magazine', decor: 'none',
    titleAnim: 'blur', reveal: 'slide',
    bgColor: '#FAF7F2', textColor: '#1A1A1A', accentColor: '#E63946',
    coverFrom: '#1A1A1A', coverTo: '#2D2D2D', coverText: '#FFFFFF',
  }, 'Be the cover. A fashion-magazine masthead with cover lines.'),

  t('disco-fever', 'Disco Fever', 'birthday', 'Retro', 'Energetic', 'teal', {
    fontHeading: 'Bebas Neue', fontBody: 'Space Grotesk', layout: 'neon', decor: 'stars',
    coverEffect: 'gradient', titleAnim: 'letters', reveal: 'zoom', fxColor: '#FFD166',
    bgColor: '#0A1A1F', textColor: '#E8FBFF', accentColor: '#2EF2D0',
    coverFrom: '#0B3A4A', coverTo: '#2A0B3D', coverText: '#FFFFFF',
  }, 'Teal neon with a gradient that never sits still.'),

  t('player-one', 'Player One', 'birthday', 'Retro', 'Festive', 'purple', {
    fontHeading: 'Syne', fontBody: 'Space Grotesk', layout: 'ticket', decor: 'confetti',
    coverEffect: 'gradient', titleAnim: 'typewriter', reveal: 'slide', fxColor: '#FF6BD6', align: 'left',
    bgColor: '#F6F1FF', textColor: '#1F1442', accentColor: '#7A3CFF',
    coverFrom: '#2B1668', coverTo: '#6A2BD9', coverText: '#FFFFFF',
  }, 'A game-night ticket with a typewriter title and tear-off stub.'),

  t('heavenly-light', 'Heavenly Light', 'baptism', 'Elegant', 'Spiritual', 'neutral', {
    fontHeading: 'Cormorant Garamond', fontBody: 'Lora', layout: 'medallion', decor: 'stars',
    coverEffect: 'spotlight', titleAnim: 'blur', reveal: 'blur',
    bgColor: '#FBF9F4', textColor: '#3C3A33', accentColor: '#B99A5B',
    coverFrom: '#EDE6D6', coverTo: '#D9CFB8', coverText: '#3C3A33',
  }, 'A soft halo of light and a turning ring of blessing.'),

  t('dove-olive', 'Dove & Olive', 'baptism', 'Botanical', 'Spiritual', 'green', {
    fontHeading: 'Cinzel', fontBody: 'Lora', layout: 'frame', decor: 'leaves',
    coverEffect: 'shine', titleAnim: 'rise', reveal: 'fade-up',
    bgColor: '#F8FAF4', textColor: '#34452F', accentColor: '#7C9A5B',
    coverFrom: '#E4EBD8', coverTo: '#CBD8B7', coverText: '#34452F',
  }, 'Olive branches and a gentle shimmer for a day of peace.'),

  t('glitter-gala', 'Glitter Gala', 'debut', 'Luxury', 'Magical', 'pink', {
    fontHeading: 'Great Vibes', fontBody: 'Poppins', layout: 'classic', decor: 'confetti',
    coverEffect: 'shimmer', titleAnim: 'blur', reveal: 'zoom',
    bgColor: '#FFF5F8', textColor: '#4B1F36', accentColor: '#E3639A',
    coverFrom: '#B83A7C', coverTo: '#5E1A52', coverText: '#FFE9F3',
  }, 'Sparkling shimmer text over berry-pink glamour.'),

  t('cloud-nine', 'Cloud Nine', 'baby-shower', 'Minimalist', 'Dreamy', 'blue', {
    fontHeading: 'Dancing Script', fontBody: 'Poppins', layout: 'medallion', decor: 'bubbles',
    coverEffect: 'gradient', titleAnim: 'rise', reveal: 'fade-up', fxColor: '#FFE0EC',
    bgColor: '#F7FBFF', textColor: '#3B5675', accentColor: '#7FB1E3',
    coverFrom: '#CFE6FA', coverTo: '#F6D9E6', coverText: '#34506E',
  }, 'Pastel sky gradient with bubbles and a dreamy seal.'),

  t('safari-adventure', 'Safari Adventure', 'baby-shower', 'Tropical', 'Adventurous', 'orange', {
    fontHeading: 'Fredoka', fontBody: 'Poppins', layout: 'split', decor: 'leaves',
    titleAnim: 'letters', reveal: 'slide', align: 'left',
    bgColor: '#FFF9EC', textColor: '#4B3A1E', accentColor: '#E58A1F',
    coverFrom: '#F2C14E', coverTo: '#8DAA54', coverText: '#3B2D12',
  }, 'Sunny savannah colours with a bouncy letter-by-letter title.'),

  t('byte-summit', 'Byte Summit', 'corporate', 'Futuristic', 'Professional', 'teal', {
    fontHeading: 'Space Grotesk', fontBody: 'Inter', layout: 'neon', decor: 'geometric', align: 'left',
    titleAnim: 'typewriter', reveal: 'slide',
    bgColor: '#0A1416', textColor: '#E3F6F4', accentColor: '#19E3C2',
    coverFrom: '#0B2A2E', coverTo: '#040A0B', coverText: '#EFFFFD',
  }, 'A terminal-green tech event cover with a typed-out title.'),

  t('black-tie', 'Black Tie Gala', 'corporate', 'Vintage', 'Sophisticated', 'black', {
    fontHeading: 'Playfair Display', fontBody: 'Montserrat', layout: 'vintage', decor: 'none',
    titleAnim: 'blur', reveal: 'fade-up',
    bgColor: '#101010', textColor: '#EDE7DA', accentColor: '#C8A55B',
    coverFrom: '#232323', coverTo: '#0A0A0A', coverText: '#EDE7DA',
  }, 'A formal engraved-invitation card in black and gold.'),

  t('class-act', 'Class Act', 'graduation', 'Modern', 'Bold', 'blue', {
    fontHeading: 'Bebas Neue', fontBody: 'Poppins', layout: 'poster', decor: 'confetti', align: 'left',
    coverEffect: 'gradient', titleAnim: 'rise', reveal: 'slide', fxColor: '#274C9B',
    bgColor: '#F4F6FB', textColor: '#101B3A', accentColor: '#F2B705',
    coverFrom: '#0F2557', coverTo: '#1C3F8E', coverText: '#FFFFFF',
  }, 'Navy and gold poster type for the graduation party.'),

  t('candy-cane', 'Candy Cane Christmas', 'christmas', 'Playful', 'Festive', 'red', {
    fontHeading: 'Pacifico', fontBody: 'Poppins', layout: 'bold', decor: 'snow',
    coverEffect: 'gradient', titleAnim: 'letters', reveal: 'zoom', fxColor: '#1F8A4C',
    bgColor: '#FFF8F5', textColor: '#3A1618', accentColor: '#D62839',
    coverFrom: '#D62839', coverTo: '#8E1B2B', coverText: '#FFFFFF',
  }, 'A cheerful red gradient with snow tumbling down.'),
];

/** A clean white canvas with no sample content (see `blank` in createDefaultConfig). Listed first in the library. */
const BLANK = {
  ...t('blank', 'Blank Canvas', 'other', 'Minimalist', 'Chic', 'neutral', {
    fontHeading: 'Montserrat', fontBody: 'Inter', layout: 'minimal', decor: 'none', align: 'left', titleAnim: 'none', reveal: 'fade-up',
    bgColor: '#FFFFFF', textColor: '#1E1E1E', accentColor: '#1E1E1E',
    coverFrom: '#FFFFFF', coverTo: '#FFFFFF', coverText: '#1E1E1E',
  }, 'Start from scratch: a plain white page with no sample text, no decoration and no animation. Add only what you need.'),
  blank: true,
};

export const TEMPLATES = [BLANK, ...BASE, ...buildExtra(t), ...buildExtra2(t), ...buildExtra3(t), ...buildExtra4(t)];

export const templateById = (id) => TEMPLATES.find((tpl) => tpl.id === id) ?? TEMPLATES[0];
