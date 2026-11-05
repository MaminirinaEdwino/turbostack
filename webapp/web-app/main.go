package main

import (
	"fmt"
	"log"
	"net/http"
	"webapp/src/config"
	"webapp/src/controller"
	)
func main() {
	// 1. Initialisation de la base de données
	config.InitDB()

	// 2. Initialisation du Router (Mux)
	mux := http.NewServeMux()

	controller.RegisterRoutes(mux)

	staticServer := http.FileServer(http.Dir("src/static"))

	mux.Handle("GET /static/", http.StripPrefix("/static/", staticServer))
	// 5. Lancement du serveur
	port := ":8080"
	fmt.Printf("🚀 TurboStack API running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, mux))
}
