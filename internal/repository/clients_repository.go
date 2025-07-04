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
        ListClients(context.Context, string) ([]entity.Client, error)
    }

    clientsRepositoryImpl struct {
        db *pgxpool.Pool
    }
)

var (
    //go:embed sql/clients/create_client.sql
    createClientQuery string
    //go:embed sql/clients/list_clients.sql
    listClientsQuery string
)

func NewClientsRepository(db *pgxpool.Pool) ClientsRepository {
    return &clientsRepositoryImpl{
        db: db,
    }
}

func (r *clientsRepositoryImpl) CreateClient(ctx context.Context, client entity.Client) error {
    _, err := r.db.Exec(
        ctx,
        createClientQuery,
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

func (r *clientsRepositoryImpl) ListClients(ctx context.Context, freelancerId string) ([]entity.Client, error) {
    rows, err := r.db.Query(ctx, listClientsQuery, freelancerId)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var clients []entity.Client
    for rows.Next() {
        var client entity.Client
        if err := rows.Scan(
            &client.ID,
            &client.CompanyName,
            &client.ContactName,
            &client.ContactTitle,
            &client.Email,
            &client.Phone,
            &client.Address,
            &client.Notes,
            &client.IsActive,
        ); err != nil {
            return nil, err
        }
        clients = append(clients, client)
    }

    return clients, nil
}
