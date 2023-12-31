create or replace function auth.user_id() returns text as
$$
select nullif(current_setting('request.jwt.claims', true)::json ->> 'userId', '')::text;
$$ language sql stable;

create table
    public.project
(
    id          uuid                     not null default gen_random_uuid(),
    created_at  timestamp with time zone not null default now(),
    name        character varying        not null default ''::character varying,
    description text                     not null,
    user_id     text                     not null default auth.user_id(),
    constraint project_pkey primary key (id),
    constraint project_name_key unique (name)
) tablespace pg_default;

create table
    public.project_page
(
    id          uuid                     not null default gen_random_uuid(),
    created_at  timestamp with time zone not null default now(),
    project_id  uuid                   not null,
    name        character varying        not null,
    description text                     null,
    content     json                     not null,
    type        text                     not null,
    user_id     text                     not null default auth.user_id(),
    constraint project_page_pkey primary key (id),
    constraint project_page_project_id_fkey foreign key (project_id) references project (id) on delete cascade
) tablespace pg_default;

CREATE POLICY "Allows all operations" ON public.project
    AS PERMISSIVE FOR ALL
    TO public
    USING ((auth.user_id() = user_id))
    WITH CHECK ((auth.user_id() = user_id));

ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allows all operations" ON public.project_page
    AS PERMISSIVE FOR ALL
    TO public
    USING ((auth.user_id() = user_id))
    WITH CHECK ((auth.user_id() = user_id));

ALTER TABLE public.project_page ENABLE ROW LEVEL SECURITY;
