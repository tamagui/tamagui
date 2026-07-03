-- security incident remediation, part 3 (2026-06-30) -- POST-DEPLOY
--
-- apply ONLY after the PR that switches theme/open-graph+api.tsx to the service
-- role is live. before that, the OG route uploads with the anon client and
-- relies on the public "Theme Image Upload" INSERT policy; dropping it earlier
-- would make OG-image cache writes fail (non-fatal, but avoidable).

-- H2: the theme-og-images storage bucket allowed ANY holder of the public anon
-- key to upload arbitrary files into tamagui's CDN bucket (the "Theme Image
-- Upload" policy was `to public with check (bucket_id = 'theme-og-images')`,
-- no auth, no mime/size limit). open-graph now uploads via the service role
-- (which bypasses storage RLS), so drop the public INSERT policy and constrain
-- the bucket to small PNGs. the bucket stays public-READ so OG cards still load.
drop policy if exists "Theme Image Upload" on storage.objects;
update storage.buckets
  set allowed_mime_types = array['image/png'],
      file_size_limit = 2097152  -- 2 MB
  where id = 'theme-og-images';

-- M1: pin search_path on the SECURITY DEFINER signup trigger so a shadowing
-- object planted earlier in the path can't hijack it. all references inside the
-- function are already schema-qualified (public.users), so '' is safe.
alter function public.handle_new_user() set search_path = '';
