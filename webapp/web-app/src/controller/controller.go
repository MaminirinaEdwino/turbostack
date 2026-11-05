package controller
import (
"net/http"
"text/template"
"webapp/src/config"
)
func renderTemplate(w http.ResponseWriter, pageName string, data interface{}) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tpl, err := template.ParseFiles("src/views/" + pageName)
	if err != nil {
		http.Error(w, "Erreur de chargement du template: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if err := tpl.Execute(w, data); err != nil {
		http.Error(w, "Erreur de rendu du template: "+err.Error(), http.StatusInternalServerError)
	}
}	
	func RegisterRoutes(mux *http.ServeMux){

mux.HandleFunc("GET /usertable",func (w http.ResponseWriter, r *http.Request){
	type returnType struct{
Id int `json:"id"`
Username string `json:"username"`
}

	
db := config.ConnectDB()
defer db.Close()
	
	rows, err := db.Query("select id, username from usertable")
	if err != nil {
		http.Error(w, "Erreur BDD: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var returnValues []returnType
	for rows.Next() {
		var returnValue returnType
		if err := rows.Scan(&returnValue.Id, &returnValue.Username); err != nil {
			continue
		}
		returnValues = append(returnValues, returnValue)
	}

	renderTemplate(w, ".html", map[string]interface{}{
		"usertable": returnValues,
	})
})
mux.HandleFunc("GET /usertable/{id}",
func (w http.ResponseWriter, r *http.Request)  {
	
db := config.ConnectDB()
defer db.Close()
	
	id := r.PathValue("id")
	type returnType struct{
Id int `json:"id"`
Username string `json:"username"`
}

	var returnValue returnType
	query := "select id, username from usertable where id = $1"
	err := db.QueryRow(query, id).Scan(&returnValue.Id, &returnValue.Username)
	if err != nil {
		http.Error(w, "model introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, ".html", map[string]interface{}{
		"usertable": returnValue,
		"Id": id,
	})
})
mux.HandleFunc("GET /usertable/create",
func (w http.ResponseWriter, r *http.Request)  {
	
db := config.ConnectDB()
defer db.Close()
	
	id := r.PathValue("id")
	type returnType struct{
Id int `json:"id"`
Username string `json:"username"`
}

	var returnValue returnType
	query := "select id, username from usertable where id = $1"
	err := db.QueryRow(query, id).Scan(&returnValue.Id, &returnValue.Username)
	if err != nil {
		http.Error(w, "model introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, ".html", map[string]interface{}{
		"usertable": returnValue,
		"Id": id,
	})
})
mux.HandleFunc("GET /usertable/edit/{id}",
func (w http.ResponseWriter, r *http.Request)  {
	
db := config.ConnectDB()
defer db.Close()
	
	id := r.PathValue("id")
	type returnType struct{
Id int `json:"id"`
Username string `json:"username"`
}

	var returnValue returnType
	query := "select id, username from usertable where id = $1"
	err := db.QueryRow(query, id).Scan(&returnValue.Id, &returnValue.Username)
	if err != nil {
		http.Error(w, "model introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, ".html", map[string]interface{}{
		"usertable": returnValue,
		"Id": id,
	})
})
mux.HandleFunc("POST /usertable/create",func (w http.ResponseWriter, r *http.Request) {
	// Parsing de la Form Data
	
db := config.ConnectDB()
defer db.Close()
	
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	username := r.FormValue("username")


	if username == "" {
		http.Error(w, "Les champs 'name' et 'email' sont requis", http.StatusBadRequest)
		return
	}

	// Insertion PostgreSQL via driver pq
	query := "insert into usertable (username) values ($1)"
	_, err := db.Exec(query, username)
	if err != nil {
		http.Error(w, "Erreur lors de la création: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection Post-Redirect-Get vers la liste
	http.Redirect(w, r, "", http.StatusSeeOther)
})
mux.HandleFunc("POST /usertable/edit/{id}",func (w http.ResponseWriter, r *http.Request) {
	
db := config.ConnectDB()
defer db.Close()
	
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	id := r.PathValue("id")
	username := r.FormValue("username")


	query := "update usertable set username = $1 where id = $2 returning * "
	_, err := db.Exec(query, username, id)
	if err != nil {
		http.Error(w, "Erreur lors de la mise à jour: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection vers la page de détails de l'utilisateur
	http.Redirect(w, r, ""+id, http.StatusSeeOther)
})
mux.HandleFunc("POST /usertable/delete/{id}",func (w http.ResponseWriter, r *http.Request) {
	
db := config.ConnectDB()
defer db.Close()
	
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	id := r.PathValue("id")

	query := "delete from usertable where id = $1"
	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, "Erreur suppression: "+err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "", http.StatusSeeOther)
})}
