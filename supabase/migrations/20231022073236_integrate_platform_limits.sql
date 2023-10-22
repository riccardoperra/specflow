create table if not exists
    public.platform
(
    id                        uuid                     not null default gen_random_uuid() primary key,
    created_at                timestamp with time zone not null default now(),
    name                      character varying        not null default ''::character varying,
    max_project_row_per_user  int                      not null default 5,
    max_project_page_per_user int                      not null default 25
) tablespace pg_default;

create or replace function public.get_user_project_rows(user_id text) returns int as
$$
select count(id)
from public.project
where public.project.user_id = get_user_project_rows.user_id
$$ language sql stable;

create or replace function public.get_user_project_page_rows(project_id bigint) returns int as
$$
select count(id)
from public.project_page
where public.project_page.project_id = get_user_project_page_rows.project_id
$$ language sql stable;

create or replace function public.get_platform_limits() returns platform as
$$
select *
from public.platform
LIMIT 1
$$ language sql stable;

CREATE POLICY  "limit_rows_to_project_by_platform_limits"
    ON "public"."project" as restrictive
    FOR INSERT
    WITH CHECK (
        public.get_user_project_rows(auth.user_id())::integer < (SELECT max_project_row_per_user
                                                                 FROM public.get_platform_limits())
    );

CREATE POLICY "limit_rows_to_project_page_by_platform_limits"
    ON "public"."project_page" as restrictive
    FOR INSERT
    WITH CHECK (
        public.get_user_project_page_rows(project_page.project_id::bigint)::integer <
        (SELECT max_project_page_per_user
         FROM public.get_platform_limits())
    );
