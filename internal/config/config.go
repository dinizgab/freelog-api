package config

import "os"

type Config struct {
	DBConfig       DBConfig
	ServerConfig   APIConfig
	SupabaseConfig SupabaseConfig
}

type APIConfig struct {
	Port string
}

type DBConfig struct {
	DBUrl string
}

type SupabaseConfig struct {
	ProjectURL string
	APIKey     string
}

func New() *Config {
	return &Config{
		DBConfig: DBConfig{
			DBUrl: os.Getenv("DATABASE_URL"),
		},
		ServerConfig: APIConfig{
			Port: os.Getenv("API_PORT"),
		},
		SupabaseConfig: SupabaseConfig{
			ProjectURL: os.Getenv("SUPABASE_URL"),
			APIKey:     os.Getenv("SUPABASE_API_KEY"),
		},
	}
}
