run:
	go run cmd/main.go

compose-up:
	docker compose up -d --build

migration-up:
	@goose -dir ./migrations postgres "user=postgres password=freelog-pass host=127.0.0.1 port=5433 dbname=freelog-local sslmode=disable" up 
