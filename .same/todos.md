# Möbelmontage Nürnberg - Todos

## Completed
- [x] Import repository from GitHub
- [x] Fix contact form email issue (Resend domain not verified)
  - API now succeeds even if email fails
  - Data is saved to Google Sheets as primary notification
  - Email errors are logged but don't block form submission
- [x] Unify all forms to main page
  - /kontakt redirects to /#kontakt-form
  - CTA buttons on /leistungen, /staedte, /arbeiten link to /#kontakt-form
  - Embedded forms on city/service pages work with fixed API

## Status: ALL FORMS WORKING
- All forms submit to /api/contact
- Google Sheets receives all submissions (primary)
- Email is attempted but failure doesn't block submission
- Users see success and are redirected to /thank-you

## Optional Improvements
- [ ] Verify Resend domain at https://resend.com/domains (for email notifications)
- [ ] Or configure alternative email service (SendGrid, Mailgun)

## Notes
- Current workaround: Forms succeed if Google Sheets works
- To enable email: Verify domain on Resend dashboard
