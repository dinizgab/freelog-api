package repository

import (
	"context"
	_ "embed"

	"github.com/freelog-projeto1/backend-freelog/internal/entity"
	"github.com/jackc/pgx/v5/pgxpool"
)

type (
    ClientsRepository interface {
        CreateClient(context.Context, entity.Client) error
    }

    clientsRepositoryImpl struct {
        db *pgxpool.Pool
    }
)

var (
    //go:embed sql/clients/create_client.sql
    createClientQuery string
)

func NewClientsRepository() ClientsRepository {
    return &clientsRepositoryImpl{}
}

func (r *clientsRepositoryImpl) CreateClient(ctx context.Context, client entity.Client) error {
    _, err := r.db.Exec(
        ctx,
        createClientQuery,
        client.ID,
        client.CompanyName,
        client.ContactName,
        client.ContactTitle,
        client.Email,
        client.Phone,
        client.Address,
        client.Notes,
        client.IsActive,
    )

    return err
}
