CREATE TABLE public.mailing_list (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
