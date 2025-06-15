create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create table "users" (
  "id" serial primary key,
  "email" text unique not null,
  "password" text not null,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

create table "urls" (
  "id" serial primary key,
  "url" text not null,
  "title" text,
  "description" text,
  "image_url" text,
  "user_id" integer references "users"("id") on delete cascade,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_urls_updated_at
  before update on urls
  for each row
  execute function update_updated_at_column();

create index "urls_user_id_idx" on "urls"("user_id"); 