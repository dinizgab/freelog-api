-- +goose Up
-- +goose StatementBegin
create table if not exists clients (
    id uuid primary key default gen_random_uuid(),
    company_name varchar(255) not null,
    contact_name varchar(255) not null,
    contact_title varchar(255),
    email varchar(255) not null,
    phone varchar(50),
    address text,
    notes text,
    is_active boolean default true
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table if exists clients;
-- +goose StatementEnd
