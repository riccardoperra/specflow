begin;
drop publication if exists supabase_realtime;
create publication supabase_realtime
    for table platform;
commit;
