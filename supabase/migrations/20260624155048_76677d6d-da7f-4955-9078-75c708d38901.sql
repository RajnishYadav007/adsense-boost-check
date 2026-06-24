
-- Fix audit_reports INSERT policy: require authenticated and bind ownership
DROP POLICY IF EXISTS "Anyone can submit audits" ON public.audit_reports;
CREATE POLICY "Users insert own audits"
ON public.audit_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix profiles public exposure
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Allow public visibility only for authors of published blog posts
CREATE POLICY "Public can view published blog authors"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts bp
    WHERE bp.author_id = profiles.user_id AND bp.published = true
  )
);
