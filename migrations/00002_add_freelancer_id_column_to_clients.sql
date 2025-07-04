-- +goose Up
-- +goose StatementBegin
alter table clients
add column freelancer_id uuid not null references users(id) on delete cascade;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table clients
drop column freelancer_id;
-- +goose StatementEnd
