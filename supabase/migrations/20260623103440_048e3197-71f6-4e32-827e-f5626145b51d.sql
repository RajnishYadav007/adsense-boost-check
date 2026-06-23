CREATE TABLE public.cpc_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain text NOT NULL,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  total_pages integer NOT NULL DEFAULT 0,
  blog_posts integer NOT NULL DEFAULT 0,
  categories integer NOT NULL DEFAULT 0,
  tags integer NOT NULL DEFAULT 0,
  landing_pages integer NOT NULL DEFAULT 0,
  opportunity_score integer NOT NULL DEFAULT 0,
  est_monthly_revenue_ceiling numeric NOT NULL DEFAULT 0,
  primary_niche text,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cpc_scans TO authenticated;
GRANT ALL ON public.cpc_scans TO service_role;

ALTER TABLE public.cpc_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cpc scans"
  ON public.cpc_scans FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own cpc scans"
  ON public.cpc_scans FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cpc scans"
  ON public.cpc_scans FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own cpc scans"
  ON public.cpc_scans FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX cpc_scans_user_id_created_at_idx ON public.cpc_scans (user_id, created_at DESC);
CREATE INDEX cpc_scans_domain_idx ON public.cpc_scans (domain);

CREATE TRIGGER update_cpc_scans_updated_at
  BEFORE UPDATE ON public.cpc_scans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();