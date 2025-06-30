package main

import (
	"context"

	"github.com/freelog-projeto1/backend-freelog/internal/handlers"
	"github.com/freelog-projeto1/backend-freelog/internal/repository"
	"github.com/freelog-projeto1/backend-freelog/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    ctx := context.Background()
    db, err := pgxpool.New(ctx, "postgres://user:password@localhost:5432/mydb")
    if err != nil {
        panic("Unable to connect to database: " + err.Error())
    }
    defer db.Close()

    clientsRepository := repository.NewClientsRepository()
    clientsUsecase := usecase.NewClientsUsecase(clientsRepository)

    router := gin.Default()

    router.POST("/clients", handlers.CreateClient(clientsUsecase))

    if err := router.Run(":8080"); err != nil {
        panic("Failed to start server: " + err.Error())
    }
}
