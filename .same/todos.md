# Möbelmontage Nürnberg - Todos

## ✅ Completed

### Version 3 - Fixed Supabase Configuration (Feb 23, 2026)
- [x] Fixed Supabase project configuration - was pointing to inaccessible project
- [x] Updated to correct Supabase URL: gtqsiwljktcztewdnjwr
- [x] Created contact-files storage bucket with proper RLS policies
- [x] Added Excel file type support to allowed MIME types
- [x] Set up anonymous upload and public read access policies

### Version 2 - File Upload with Supabase (Feb 23, 2026)
// ... existing code ... <Version 2 content>

## 📝 Notes

### Supabase Configuration (UPDATED)
- Project URL: https://gtqsiwljktcztewdnjwr.supabase.co
- Bucket Name: contact-files
- Max file size: 10MB per file
- Max files: 5 per submission
- Allowed MIME types: JPEG, PNG, GIF, WebP, PDF, TXT, DOC, DOCX, XLS, XLSX

### RLS Policies
- Allow anonymous uploads (INSERT) - anon role
- Allow public read access (SELECT) - anon role

### Image Compression
- Images are compressed to max 1200x1200 pixels
- Target size: ~500KB
- Format: JPEG

### Email Integration
- Files are NOT attached to emails (too large)
- Download links are included in the email
- Links are valid for 30 days (Supabase default)
