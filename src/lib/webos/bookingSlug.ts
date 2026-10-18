import type { PlaybookKey } from './types';

// The one page per playbook that carries its real business-functionality
// form — never the generic lead form once one of these applies. Shared
// between PublicSiteRenderer (the live public site) and WebsiteEditor
// (the dashboard's live-editable preview) so the two can never disagree
// about which page shows the real booking/inquiry widget.
export const BOOKING_SLUG: Partial<Record<PlaybookKey, string>> = {
  RESTAURANT: 'reservations',
  CONSULTANT: 'book-a-call',
  PROFESSIONAL_SERVICES: 'book-a-call',
  SALON: 'book-a-call',
  EDUCATION: 'book-a-call',
  FITNESS: 'book-a-call',
  HOTEL: 'stay',
  CATERING: 'inquire',
  LOCAL_SERVICES: 'quote',
};
