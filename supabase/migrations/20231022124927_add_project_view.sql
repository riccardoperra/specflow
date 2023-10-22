create
    or replace function public.is_user_same_as_auth_user(user_id text) returns bool as
$$
BEGIN
    return (CASE WHEN user_id = auth.user_id() THEN 1 ELSE 0 END)::bool;
END;
$$
    language plpgsql stable;


create view project_view as
(
SELECT *, public.is_user_same_as_auth_user(project.user_id) as owner
FROM project);

create view project_page_view as
(
SELECT project_page.id,
       created_at,
       project_id,
       name,
       description,
       content,
       type,
       user_id,
       public.is_user_same_as_auth_user(project_page.user_id) as owner
FROM project_page);
