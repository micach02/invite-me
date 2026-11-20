import { contrast } from './color';

/**
 * "Ready to publish?" checks. `required` items count towards the score; the rest are friendly tips.
 * `panel` is the editor panel that fixes the item, so the checklist can jump straight to it.
 */
export function buildChecklist(config) {
  const { event = {}, venue = {}, images = {}, theme = {}, sections = {} } = config;
  const filled = (v) => Boolean(v && String(v).trim());
  const rsvp = sections.rsvp ?? {};
  const items = [
    { id: 'title', label: 'Event title', ok: filled(event.title) && event.title.trim() !== 'Untitled invitation', hint: 'Used for the page title and link previews.', panel: 'event', required: true },
    { id: 'names', label: 'Names on the cover', ok: filled(event.names), hint: 'Shown large at the top of the invitation.', panel: 'event', required: true },
    { id: 'date', label: 'Event date', ok: filled(event.date), hint: 'Guests need to know when to come.', panel: 'datetime', required: true },
    { id: 'venue', label: 'Venue', ok: filled(venue.name) || filled(venue.address), hint: 'Add the place so guests can find you.', panel: 'venue', required: true },
    { id: 'message', label: 'Invitation message', ok: filled(event.description), hint: 'A line or two of welcome.', panel: 'event', required: true },
    { id: 'time', label: 'Start time', ok: filled(event.startTime), hint: 'Tip: add what time it begins.', panel: 'datetime' },
    { id: 'photo', label: 'A photo', ok: Boolean(images.cover || images.primary), hint: 'Tip: a cover or portrait photo makes it personal.', panel: 'images' },
  ];
  if (rsvp.enabled) {
    const late = filled(rsvp.deadline) && filled(event.date) && rsvp.deadline > event.date;
    items.push({
      id: 'rsvp', label: 'RSVP deadline', ok: filled(rsvp.deadline) && !late,
      hint: late ? 'The reply-by date is after the event.' : 'Tip: set a reply-by date.', panel: 'rsvp',
    });
  }
  const readable = contrast(theme.textColor, theme.bgColor) >= 4.5 && Math.min(contrast(theme.coverText, theme.coverFrom), contrast(theme.coverText, theme.coverTo)) >= 3;
  items.push({ id: 'contrast', label: 'Easy-to-read colours', ok: readable, hint: 'Some text may be hard to read against its background.', panel: 'colors' });

  const required = items.filter((i) => i.required);
  const done = required.filter((i) => i.ok).length;
  return { items, done, total: required.length, ready: done === required.length };
}
