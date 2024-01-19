create table "public"."hogetest" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."hogetest" enable row level security;

CREATE UNIQUE INDEX hogetest_pkey ON public.hogetest USING btree (id);

alter table "public"."hogetest" add constraint "hogetest_pkey" PRIMARY KEY using index "hogetest_pkey";

grant delete on table "public"."hogetest" to "anon";

grant insert on table "public"."hogetest" to "anon";

grant references on table "public"."hogetest" to "anon";

grant select on table "public"."hogetest" to "anon";

grant trigger on table "public"."hogetest" to "anon";

grant truncate on table "public"."hogetest" to "anon";

grant update on table "public"."hogetest" to "anon";

grant delete on table "public"."hogetest" to "authenticated";

grant insert on table "public"."hogetest" to "authenticated";

grant references on table "public"."hogetest" to "authenticated";

grant select on table "public"."hogetest" to "authenticated";

grant trigger on table "public"."hogetest" to "authenticated";

grant truncate on table "public"."hogetest" to "authenticated";

grant update on table "public"."hogetest" to "authenticated";

grant delete on table "public"."hogetest" to "service_role";

grant insert on table "public"."hogetest" to "service_role";

grant references on table "public"."hogetest" to "service_role";

grant select on table "public"."hogetest" to "service_role";

grant trigger on table "public"."hogetest" to "service_role";

grant truncate on table "public"."hogetest" to "service_role";

grant update on table "public"."hogetest" to "service_role";

