# Möbelmontage Nürnberg - Todos

## Completed
- [x] Import repository from GitHub
- [x] Fix contact form API (handles email failures gracefully)
- [x] Single form implementation:
  - Only main page (/) has the actual form
  - Created FormCTA component for other pages
  - /kontakt redirects to /#kontakt-form
  - City pages use FormCTA (links to main form)
  - Service pages use FormCTA (links to main form)
  - CTA buttons on /leistungen, /staedte, /arbeiten link to main form

## Current Architecture
```
/ (main page)
└── QuickContactForm (THE ONLY FORM)

/kontakt → redirect to /#kontakt-form
/[citySlug] → FormCTA (button to main form)
/[citySlug]/[serviceSlug] → FormCTA (button to main form)
/service/[serviceSlug] → FormCTA (button to main form)
/leistungen → Link to /#kontakt-form
/staedte → Link to /#kontakt-form
/arbeiten → Link to /#kontakt-form
```

## FormCTA Features
- Dynamic title based on city/service context
- Benefits grid (Festpreise, 24h Antwort, etc.)
- Prominent CTA button to main form
- Phone and WhatsApp contact options
- Availability indicator

## Optional Improvements
- [ ] Verify Resend domain for email notifications
- [ ] Add more cities/services
