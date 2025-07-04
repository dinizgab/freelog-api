package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
    "github.com/supabase-community/gotrue-go/types"
    "github.com/supabase-community/supabase-go"
)

func GoogleLogin(client *supabase.Client) func(*gin.Context) {
    return func(c *gin.Context) {
		resp, err := client.Auth.Authorize(types.AuthorizeRequest{Provider: types.ProviderGoogle})
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get auth url"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"url": resp.AuthorizationURL})
	}
}

