# Newsletter Category Filters Implementation

## Completed Tasks
- [x] Create `apps/server/add-newsletter-category.js` script to add 'category' TEXT column to 'newsletters' table
- [x] Add `Newsletter` interface to `packages/types/src/index.ts` with category field
- [x] Update `apps/web/src/pages/NewsLetter/NewsletterListPage.tsx`:
  - Import Newsletter type
  - Implement category-based filtering in `filteredNewsletters` useMemo
  - Update `filters` array to dynamically compute counts for "all", "learning-of-the-week", "scratch-pad", "topical-update"
  - Update special styling condition for "scratch-pad" filter
- [x] Add radio buttons for category selection in `apps/web/src/components/admin/ContentEditor.tsx` for newsletters
- [x] Add category column to `apps/web/src/components/admin/ContentManagement.tsx` table for newsletters
- [x] Update backend controllers (`createNewsletter` and `updateNewsletter`) to save and update category field

## Pending Tasks
- [ ] Run the database migration script: `cd apps/server && node add-newsletter-category.js` (requires Supabase environment variables)
- [ ] Assign categories to existing newsletters in the database (manual or via admin interface)
- [ ] Test the filtering functionality in the web app
- [ ] Test the category selection in the admin editor
- [ ] Test the category display in the admin management table

## Notes
- Categories: "learning-of-the-week", "scratch-pad", "topical-update"
- "Scratch Pad" has special yellow gradient styling with Crown icon
- Filtering works by matching newsletter.category to filter.id
- Counts are dynamically calculated based on current newsletters data
- Category selection uses radio buttons in the editor
- Category is displayed as a badge in the management table with title case formatting
