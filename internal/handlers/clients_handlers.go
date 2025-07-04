package handlers

import (
	"log"

	"github.com/freelog-projeto1/backend-freelog/internal/entity"
	"github.com/freelog-projeto1/backend-freelog/internal/usecase"
	"github.com/gin-gonic/gin"
)

func CreateClient(uc usecase.ClientsUsecase) func(*gin.Context) {
    return func(c *gin.Context) {
        var client entity.Client
        if err := c.ShouldBindJSON(&client); err != nil {
            log.Println(err)
            c.JSON(400, gin.H{"error": "Invalid input data"})
            return
        }

        err := uc.CreateClient(c, client)
        if err != nil {
            log.Println(err)
            c.JSON(500, gin.H{"error": "Failed to create client"})
            return
        }

        c.JSON(201, gin.H{"message": "Client created successfully"})
    }
}

func ListClients(uc usecase.ClientsUsecase) func(*gin.Context) {
    return func(c *gin.Context) {
        clients, err := uc.ListClients(c)
        if err != nil {
            log.Println(err)
            c.JSON(500, gin.H{"error": "Failed to retrieve clients"})
            return
        }

        c.JSON(200, clients)
    }
}
