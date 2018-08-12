package main

import (
	"net/http"
	"strconv"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/gin-contrib/cors"
)

var db *gorm.DB

func init() {
	// open db connection
	var err error
	// mysql is db driver, root:xxx is username:password, Todos is db name
	db, err = gorm.Open("mysql", "root:z6Nr5RD&O7Bs@/Todos?charset=utf8&parseTime=True&loc=Local")
		if err != nil {
			panic("failed to connect to database")
		}
	db.AutoMigrate(&todoModel{})
}

func main() {
	router := gin.Default()

	//config := cors.DefaultConfig()
	//config.AllowOrigins = []string{"http://localhost"}
	
	router.Use(cors.Default())
	todo := router.Group("/api/1.0/todos")
	{
		// add crud routes and methods
		todo.POST("/", createTodo)
		todo.GET("/", fetchAllTodo)
		todo.GET("/:id", fetchTodo)
		todo.PUT("/:id", updateTodo)
		todo.DELETE("/:id", deleteTodo)
	}
	router.Run()
}

type (
	todoJson struct {
		Title		string	`json:"title" binding:"required"`
		Completed	bool	`json:"completed" binding:"required"`
	}

	// describes todo model w/ gorm adding ID, CreatedAt, UpdatedAt, DeletedAt
	todoModel struct {
		gorm.Model
		Title		string 	`json:"title"`
		Completed	int		`json:"completed"`
	}

	// describes formatted todo
	transformedTodo struct {
		ID			uint	`json:"id"`
		Title		string	`json:"title"`
		Completed	bool	`json:"completed"`
	}
)

// Request body contains todo title and completed bool
// Create a todo and add it to the db
// Response is a status code and success message
func createTodo(c *gin.Context) {
	// save completed and todo  state
	var requestJson todoJson
	
	c.BindJSON(&requestJson)
	completed := 0
	if	requestJson.Completed == true {
		completed = 1
	}
	todo := todoModel{Title: requestJson.Title, Completed: completed}
	log.Printf(requestJson.Title)
	log.Printf(strconv.FormatBool(requestJson.Completed))
	log.Printf(strconv.Itoa(completed))

	// if good request, respond positively
	db.Save(&todo)
	c.JSON(http.StatusCreated, gin.H{"status": http.StatusCreated, "message": "Todo item created successfully", "resourceId": todo.ID})
}


// No request inputs
// Find and return all todos in db
// Response is a status code and a list of todos
func fetchAllTodo(c *gin.Context) {
	var todos []todoModel
	var _todos []transformedTodo
	
	db.Find(&todos)

	// return NotFound if no todos in db
	if len(todos) <= 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "No todo found!"})
		return
	}

	for _, item := range todos {
		completed := false
		if item.Completed == 1 {
			completed = true
		}

		_todos = append(_todos, transformedTodo{ID: item.ID, Title: item.Title, Completed: completed})
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": _todos})
}

// Request params contains an ID
// Find and return todo with requested ID
// Response is a status code and a todo
func fetchTodo(c *gin.Context) {
	var todo todoModel
	todoID := c.Param("id")

	db.First(&todo, todoID)

	if todo.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Not todo found"})
		return
	}

	completed := false
	if todo.Completed == 1 {
		completed = true
	}

	_todo := transformedTodo{ID: todo.ID, Title: todo.Title, Completed: completed}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": _todo})
}

// Request params contains an ID, body contains todo title and completed bool
// Find todo with requested ID and update it with new info
// Response is a status code and success message
func updateTodo(c *gin.Context) {
	var todo todoModel
	var requestJson todoJson

	todoID := c.Param("id")

	db.First(&todo, todoID)

	if todo.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "No todo found"})
		return
	}

	c.BindJSON(&requestJson)

	log.Printf(requestJson.Title)
	db.Model(&todo).Update("title", requestJson.Title)

	completed := 0
	if	requestJson.Completed == true {
		completed = 1
	}
	log.Printf(strconv.FormatBool(requestJson.Completed))
	log.Printf(strconv.Itoa(completed))
	db.Model(&todo).Update("completed", completed)

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Todo updated successfully"})
}

// Request params contains an ID
// Find todo with requested ID and delete it from db
// Response is a status code and success message
func deleteTodo(c *gin.Context) {
	var todo todoModel
	todoID := c.Param("id")

	db.First(&todo, todoID)

	if todo.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "No todo found"})
		return
	}

	db.Delete(&todo)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Todo deleted successfully!"})
}