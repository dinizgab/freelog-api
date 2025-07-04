package main

import (
	"context"
	"fmt"
	"log"

	"github.com/freelog-projeto1/backend-freelog/internal/config"
	"github.com/freelog-projeto1/backend-freelog/internal/handlers"
	"github.com/freelog-projeto1/backend-freelog/internal/repository"
	"github.com/freelog-projeto1/backend-freelog/internal/usecase"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()

	//err := godotenv.Load()
	//if err != nil {
	//	log.Fatalf("Error loading env file: %v", err)
	//}

	cfg := config.New()

	db, err := pgxpool.New(ctx, cfg.DBConfig.DBUrl)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	err = db.Ping(ctx)
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	clientsRepository := repository.NewClientsRepository(db)
	clientsUsecase := usecase.NewClientsUsecase(clientsRepository)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin", "Authorization", "Content-Type", "Accept", "Access-Control-Request-Headers",
		},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.POST("/clients", handlers.CreateClient(clientsUsecase))

	if err := router.Run(fmt.Sprintf(":%s", cfg.ServerConfig.Port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
