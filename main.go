package main

import (
	"embed"
	"encoding/json"
	"log"
	"os"

	"github.com/MaminirinaEdwino/turbostack/src/activation"
	"github.com/MaminirinaEdwino/turbostack/src/api"
	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/entity"
	webview "github.com/webview/webview_go"
)

//go:embed ui-dist/*
var assets embed.FS
var pMgr api.Manager

func OpenDetachedPreviewWindow() {
	// Créer une nouvelle fenêtre WebView séparée

	prevWv := webview.New(true)
	prevWv.SetTitle("TurboStack - Preview")
	prevWv.SetSize(1024, 768, webview.HintNone)
	// Naviguer directement vers l'UI dédiée au preview
	prevWv.Navigate("http://localhost:5173/?mode=preview")
	pMgr.RegisterAll(prevWv)
	go prevWv.Run()
}

func main() {
	debug := true
	w := webview.New(debug)

	defer w.Destroy()

	projectMgr := &entity.ProjectManager{}
	if err := projectMgr.LoadProjects(); err != nil {
		log.Printf("Erreur lors du chargement des projets : %v", err)
	}
	activation.CheckActivationToken()
	mgr := api.NewManager()
	mgr.Add(&api.UserService{})
	mgr.Add(&api.SystemService{})
	mgr.Add(&api.ProjectService{Manager: projectMgr, WV: w})
	if !config.CheckIfExist(config.PROJECT_DIR) {
		os.Mkdir(config.PROJECT_DIR, 0644)
	}
	if !config.CheckIfExist(config.LIBRAIRIE_PATH) {
		var librairie entity.LibrairieList
		file, _ := os.Create(config.LIBRAIRIE_PATH)
		content, _ := json.MarshalIndent(librairie, "", "    ")
		file.WriteString(string(content))
	}
	mgr.RegisterAll(w)

	pMgr = *mgr
	w.SetTitle("Turbo Stack")
	w.SetSize(800, 600, webview.HintNone)
	w.Bind("openPreviewWindow", OpenDetachedPreviewWindow)
	// go func() {
	// 	fs := http.FileServer(http.FS(assets))
	// 	http.ListenAndServe(":1627", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		r.URL.Path = "/ui-dist" + r.URL.Path
	// 		fs.ServeHTTP(w, r)
	// 	}))
	// }()

	
	w.Navigate("http://localhost:5173")
	w.Run()
}
