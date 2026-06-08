# Implementation Plan - La Perle d’Addis Luxury Storefront (Database Integration)

Upgrade the existing "Quiet Luxury" perfume storefront to use Supabase for persistent data storage and secure administrative access.

## Scope Summary
- **Database Migration:** Move from `localStorage` to Supabase PostgreSQL.
- **Admin Authentication:** Implement secure login for the admin panel using Supabase Auth.
- **Data Persistence:** Persistent storage for products and orders in the cloud.
- **Refined Security:** Apply RLS policies to ensure only authorized admins can modify products.

## Auth & RLS model
**Auth in scope:** yes
**Model:** supabase_auth
**RLS strategy:**
- `products`: Public read-only; Authenticated admins have full CRUD.
- `orders`: Authenticated admins have read access; Public can insert (controlled write).
**Frontend implication:** Login screen for admin access; Toast notifications for auth errors.

## Migration Baseline
**Local migrations in project:** none
**User confirmed proceed on connected DB:** yes

## Affected Areas
- `src/integrations/supabase/`: Client and types.
- `src/lib/storage.ts`: Replace `localStorage` logic with Supabase client calls.
- `src/components/AdminPanel.tsx`: Add login/logout logic and update data fetching.
- `src/App.tsx`: Provide auth state to protected components.

## Ordered Phases

### Phase 1: Database & Auth Setup (supabase_engineer)
- Create `products` table: `id`, `brand`, `name`, `size`, `category`, `price`, `image_url`, `created_at`.
- Create `orders` table (optional but recommended for record keeping): `id`, `client_name`, `phone`, `neighborhood`, `items`, `total`, `created_at`.
- Enable RLS on both tables.
- Add RLS policies for public read on products and admin-only write.

### Phase 2: Supabase Integration (frontend_engineer)
- Run `bun add @supabase/supabase-js`.
- Create `src/integrations/supabase/client.ts`.
- Refactor `src/lib/storage.ts` to use Supabase instead of `localStorage`.

### Phase 3: Admin Auth UI (frontend_engineer)
- Update `AdminPanel.tsx` to include a real login form (email/password) using Supabase Auth.
- Secure the hidden admin trigger to show the login screen if not authenticated.
- Update CRUD functions to check for a valid session.

### Phase 4: Data Sync & Polish (quick_fix_engineer)
- Ensure the storefront correctly re-renders when the database updates.
- Verify that WhatsApp checkout still functions with the new data structure.
- Small UI tweaks to the login form to match the "Quiet Luxury" aesthetic.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. supabase_engineer — Schema and RLS policies.
2. frontend_engineer — Integration and Auth UI implementation.
3. quick_fix_engineer — Polish and verification.

**Per-agent instructions:**

### 1. supabase_engineer
- **Phases:** 1
- **Scope:** Define schema for perfumes and orders. Set up RLS.
- **Files:** `supabase/migrations/` (create new)
- **Acceptance criteria:** Tables created; RLS allows public SELECT but requires AUTH for INSERT/UPDATE/DELETE on products.

### 2. frontend_engineer
- **Phases:** 2, 3
- **Scope:** Connect frontend to Supabase. Replace `localStorage` with real DB calls. Implement Auth for Admin.
- **Files:** `src/integrations/supabase/client.ts`, `src/lib/storage.ts`, `src/components/AdminPanel.tsx`
- **Depends on:** supabase_engineer
- **Acceptance criteria:** Products fetch from Supabase. Admin login works. Admin can edit/delete items in DB.

### 3. quick_fix_engineer
- **Phases:** 4
- **Scope:** Final UI cleanup and verification.
- **Files:** `src/components/AdminPanel.tsx`, `src/App.tsx`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Smooth transitions; Error handling for failed DB calls; Mobile view of login form is perfect.
