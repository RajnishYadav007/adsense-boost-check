
-- ============ Roles system ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ Shared updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ Blog Posts ============
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage blog posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Guides ============
CREATE TABLE public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Getting Started',
  read_time_minutes INTEGER NOT NULL DEFAULT 10,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.guides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published guides" ON public.guides
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage guides" ON public.guides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER guides_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Contact submissions ============
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 4000
  );
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ Newsletter subscribers ============
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (length(email) BETWEEN 3 AND 255);
CREATE POLICY "Admins can read subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
