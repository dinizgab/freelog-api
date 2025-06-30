package usecase

import (
	"context"

	"github.com/freelog-projeto1/backend-freelog/internal/entity"
	"github.com/freelog-projeto1/backend-freelog/internal/repository"
)

type (
    ClientsUsecase interface {
        CreateClient(context.Context, entity.Client) error
    }

    clientsUsecaseImpl struct {
        clientsRepository repository.ClientsRepository
    }
)

func NewClientsUsecase(clientsRepository repository.ClientsRepository) ClientsUsecase {
    return &clientsUsecaseImpl{
        clientsRepository: clientsRepository,
    }
}

func (u *clientsUsecaseImpl) CreateClient(ctx context.Context, client entity.Client) error {
    return u.clientsRepository.CreateClient(ctx, client)
}
