package main

import (
	"context"
	"fmt"
	"log"

	"github.com/freelog-projeto1/backend-freelog/internal/config"
	"github.com/freelog-projeto1/backend-freelog/internal/handlers"
	"github.com/freelog-projeto1/backend-freelog/internal/middleware"
	"github.com/freelog-projeto1/backend-freelog/internal/repository"
	"github.com/freelog-projeto1/backend-freelog/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/supabase-community/supabase-go"
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

    supabaseClient, err := supabase.NewClient(cfg.SupabaseConfig.ProjectURL, cfg.SupabaseConfig.APIKey, nil)

	clientsRepository := repository.NewClientsRepository(db)
	clientsUsecase := usecase.NewClientsUsecase(clientsRepository)

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

    router.GET("/login/google", handlers.GoogleLogin(supabaseClient))

	authMw := middleware.Auth(supabaseClient)
    router.Use(authMw)

	router.POST("/clients", handlers.CreateClient(clientsUsecase))
    router.GET("/clients", handlers.ListClients(clientsUsecase))

	if err := router.Run(fmt.Sprintf(":%s", cfg.ServerConfig.Port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
