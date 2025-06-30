package main

import (
	"context"
	"fmt"
	"log"

	"github.com/freelog-projeto1/backend-freelog/internal/config"
	"github.com/freelog-projeto1/backend-freelog/internal/handlers"
	"github.com/freelog-projeto1/backend-freelog/internal/repository"
	"github.com/freelog-projeto1/backend-freelog/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	ctx := context.Background()

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading env file: %v", err)
	}

	cfg := config.New()
	if err != nil {
		log.Fatalf("Error loading cfg: %v", err)
	}

	db, err := pgxpool.New(ctx, cfg.DBConfig.DBUrl)
	if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	clientsRepository := repository.NewClientsRepository()
	clientsUsecase := usecase.NewClientsUsecase(clientsRepository)

	router := gin.Default()
	router.POST("/clients", handlers.CreateClient(clientsUsecase))

	if err := router.Run(fmt.Sprintf(":%s", cfg.ServerConfig.Port)); err != nil {
        log.Fatalf("Failed to start server: %v", err)
	}
}
