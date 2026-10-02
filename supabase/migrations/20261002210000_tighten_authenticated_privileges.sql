-- supabase/migrations/20261002210000_tighten_authenticated_privileges.sql
--
-- WHY THIS FILE EXISTS
-- The check query after the previous migration showed that signed-in users
-- ("authenticated") still hold three leftover privileges on every table:
-- TRUNCATE, REFERENCES and TRIGGER. They come from Supabase's older default
-- settings. The website never needs them:
--   TRUNCATE   = empty a whole table in one command
--   REFERENCES = create foreign keys that point at the table
--   TRIGGER    = create triggers on the table
-- Removing them changes nothing for the app. It only means a signed-in user
-- can never do these things, whatever happens later.
--
-- Safe to run twice. Run it on staging now and on production at launch.

revoke truncate, references, trigger
  on all tables in schema public
  from authenticated;

-- anon already lost everything in the previous migration, but repeating it is
-- harmless and keeps a brand-new production database identical to staging.
revoke truncate, references, trigger
  on all tables in schema public
  from anon;

  