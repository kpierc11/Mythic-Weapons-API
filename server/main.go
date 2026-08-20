package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"server/main/types"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var dbConn *pgxpool.Pool

// OK sends a success response.
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, types.Response{
		Success: true,
		Data:    data,
	})
}

// Fail sends an error response.
func Fail(c *gin.Context, status int, code, message string) {
	c.JSON(status, types.Response{
		Success: false,
		Error:   &types.ErrorInfo{Code: code, Message: message},
	})
}

func RegisterWeaponRoutes(rg *gin.RouterGroup) {
	weapons := rg.Group("/weapons")
	{
		weapons.GET("/", listWeapons)
		//weapons.GET("/:id", getWeapon)
	}
}

func listWeapons(c *gin.Context) {

	rows, err := dbConn.Query(context.Background(), "SELECT weapon_id, name, description, data FROM weapons")

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var weapons []types.Weapon

	for rows.Next() {
		var weapon types.Weapon

		err := rows.Scan(
			&weapon.WeaponID,
			&weapon.Name,
			&weapon.Description,
			&weapon.Data)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Couldn't read weapon",
			})
			return
		}

		weapons = append(weapons, weapon)

	}

	c.JSON(http.StatusOK, weapons)
}

func RegisterProjectRoutes(rg *gin.RouterGroup) {
	projects := rg.Group("/projects")
	{
		projects.GET("/", listProjects)
		projects.GET("/:id", getProject)
	}
}

func listProjects(c *gin.Context) {

	rows, err := dbConn.Query(context.Background(), "SELECT project_id, title, description FROM projects")

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var projects []types.Project

	for rows.Next() {
		var project types.Project

		err := rows.Scan(
			&project.ProjectID,
			&project.Title,
			&project.Description,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Couldn't read weapon",
			})
			return
		}

		projects = append(projects, project)

	}

	c.JSON(http.StatusOK, projects)
}

func getProject(c *gin.Context) {

	id := c.Param("id")

	rows, err := dbConn.Query(context.Background(), `SELECT project_id, title, description FROM projects WHERE project_id=$1`, (id))

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var projects []types.Project

	for rows.Next() {
		var project types.Project

		err := rows.Scan(
			&project.ProjectID,
			&project.Title,
			&project.Description,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Couldn't read weapon",
			})
			return
		}

		projects = append(projects, project)

	}

	c.JSON(http.StatusOK, projects)
}

func main() {

	//Database connection and load env
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Couldn't load production env.")
	}

	if err := godotenv.Load(".env.development"); err != nil {
		fmt.Println("Couldn't load local development env.")
	}

	dbConnString, exists := os.LookupEnv("DATABASE_URL")

	if !exists {
		log.Fatalf("Couldn't find env variable")
	}

	var dbError error
	dbConn, dbError = pgxpool.New(context.Background(), dbConnString)

	if dbError != nil {
		log.Fatal("Couldn't create database pool:", dbError)
	}

	if dbError = dbConn.Ping(context.Background()); dbError != nil {
		log.Fatal("Couldn't connect to database:", dbError)
	}

	defer dbConn.Close()

	fmt.Println("Connected Successfully to db.")

	//Setup Router configurations
	router := gin.Default()
	router.SetTrustedProxies([]string{"localhost:5173"})

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

	router.Use(cors.New(config))

	api := router.Group("/v1")

	RegisterWeaponRoutes(api)
	RegisterProjectRoutes(api)

	router.Run("[::]:8080")
}
