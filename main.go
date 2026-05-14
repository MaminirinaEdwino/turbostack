package main

import (
	"embed"
	"fmt"
	"log"
	"net/http"

	"github.com/MaminirinaEdwino/turbostack/src/api"
	"github.com/MaminirinaEdwino/turbostack/src/entity"
	webview "github.com/webview/webview_go"
)

//go:embed ui-dist/*
var assets embed.FS

func main() {
	debug := true
	w := webview.New(debug)
	defer w.Destroy()

	projectMgr := &entity.ProjectManager{}
	if err := projectMgr.LoadProjects(); err != nil {
		log.Printf("Erreur lors du chargement des projets : %v", err)
	}
	fmt.Println(projectMgr.Projects)
	mgr := api.NewManager()
	mgr.Add(&api.UserService{})
	mgr.Add(&api.SystemService{})
	mgr.Add(&api.ProjectService{Manager: projectMgr})

	mgr.RegisterAll(w)
	w.SetTitle("Turbo Stack")
	w.SetSize(800, 600, webview.HintNone)
	go func() {
		fs := http.FileServer(http.FS(assets))
		http.ListenAndServe(":8080", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Optionnel : rediriger toutes les routes vers index.html pour le SPA Routing
			r.URL.Path = "/ui-dist" + r.URL.Path
			fs.ServeHTTP(w, r)
		}))
	}()

	w.Navigate("http://localhost:8080")
	w.Run()
}
