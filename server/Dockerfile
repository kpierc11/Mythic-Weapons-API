# --- Build Stage ---
FROM golang:1.25.6-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# --- Final Deployment Stage ---
FROM alpine:3.20

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Expose app port
EXPOSE 8080

# Run application
CMD ["./main"]