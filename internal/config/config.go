package config

import "os"

type Config struct {
	DBConfig     DBConfig
	ServerConfig APIConfig
}

type APIConfig struct {
	Port string
}

type DBConfig struct {
	DBUrl string
}

func New() (*Config) {
	return &Config{
		DBConfig: DBConfig{
			DBUrl: os.Getenv("DATABASE_URL"),
		},
		ServerConfig: APIConfig{
			Port: os.Getenv("API_PORT"),
		},
	}
}
