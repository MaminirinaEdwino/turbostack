package goapimaker

import (
	"bytes"
	"fmt"
	"strings"
	"text/template"

	"github.com/MaminirinaEdwino/turbostack/src/utils"
)

func SelectTemplate(HandlerName string, DbCaller string, ResponseType string, Query string, ScanValue string, ResponseWriter string) string {
	return fmt.Sprintf(`
func %s(w http.ResponseWriter, r *http.Request){
	%s
	var res []models.%s

	rows, _ := db.Query("%s")
	
	for rows.Next(){
		var tmp models.%s
		rows.Scan(%s)
		res = append(res, tmp)
	}
	%s
}
	`, HandlerName, DbCaller, ResponseType, Query, ResponseType, ScanValue, ResponseWriter)
}

func WebAppSelectTemplate(query, dbCaller, returnType, scanValue, pageName string) string {
	return fmt.Sprintf(`
	%s
	%s
	rows, err := db.Query("SELECT %s")
	if err != nil {
		http.Error(w, "Erreur BDD: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var returnValue []returnType
	for rows.Next() {
		var u User
		if err := rows.Scan(%s); err != nil {
			continue
		}
		returnValue = returnValue(returnValue, u)
	}

	renderTemplate(w, "%s.html", map[string]interface{
		"ReturnContent": returnValue
	})
	`, returnType, dbCaller, query, scanValue, pageName)
}

func WebAppPostViewtemplate(pageName string) string {
	return fmt.Sprintf(`
func (w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "%s.html", map[string]interface{}{
		"Title": "Create",
	})
}
	`, pageName)
}

func WebAppPostActionTemplate(redirectUri, paramsExtraction, paramsChecker, query, paramsExec string) string {
	return fmt.Sprintf(`
func (w http.ResponseWriter, r *http.Request) {
	// Parsing de la Form Data
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s

	if %s {
		http.Error(w, "Les champs 'name' et 'email' sont requis", http.StatusBadRequest)
		return
	}

	// Insertion PostgreSQL via driver pq
	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur lors de la création: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection Post-Redirect-Get vers la liste
	http.Redirect(w, r, "%s", http.StatusSeeOther)
}
	`, paramsExtraction, paramsChecker, query, paramsExec, redirectUri)
}

func WebAppEditTemplate(params, returnType, query, scanValue, pageName string) string {
	return fmt.Sprintf(`
func HandleUserEdit(w http.ResponseWriter, r *http.Request) {
	%s := r.PathValue("%s")
	%s
	var returnValue ReturnType
	query := "%s"
	err := db.QueryRow(query, %s).Scan(%s)
	if err != nil {
		http.Error(w, "Utilisateur introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, "%s.html", map[string]interface{}{
		"ReturnValue": returnValue,
	})
}
	`, params, params ,returnType, query, params, scanValue, pageName)
}

func WebAppEditActionTemplate(params, contentExtraction, query, queryValue, redirectUri string) string {
	return fmt.Sprintf(`
func (w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s := r.PathValue("%s")
	%s

	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur lors de la mise à jour: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection vers la page de détails de l'utilisateur
	http.Redirect(w, r, "%s"+%s, http.StatusSeeOther)
}
	`, params, params, contentExtraction, query, queryValue, redirectUri, params)
}

func WebAppDeleteActionTemplate(params, query, redirectUri string) string {
	return fmt.Sprintf(`
func HandleUserDelete(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s := r.FormValue("%s")

	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur suppression: "+err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "%s", http.StatusSeeOther)
}
	`, params, params, query, params, redirectUri)
}

func WebAppSelectByParamsTemplate(query, dbCaller, returnType, scanValue, pageName, uriParams string) string {
	return fmt.Sprintf(`
	%s := r.PathValue("%s")
	%s
	var returnValue returnType
	query := "SELECT id, name, email FROM users WHERE %s = $1"
	err := db.QueryRow(query, %s).Scan(%s)
	if err != nil {
		http.Error(w, "model introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, "%s.html", map[string]interface{}{
		"ReturnContent": returnValue,
	})
	`, uriParams, uriParams, returnType, uriParams, uriParams, scanValue, pageName)
}

func DBCallerTemplate() string {
	return `
db := config.DB
defer db.Close()
	`
}

func WriteResponseWriter() string {
	return `
w.Header().Set("Content-Type", "application/json")
w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(res)
	`
}

func SelectBytemplate() *template.Template {
	content := `
func {{ .FuncName }}(w http.ResponseWriter, r *http.Request){
	{{ .Params }} := r.PathValue("{{ .Params }}")
	var res models.{{ .StructName }}
	{{ .DbCallerHandler }}
	rows,_ := db.Query("{{ .Query }}", {{ .Params }})
	rows.Next()
	rows.Scan({{ .ScanParams }})
	{{ .ResponseWriter }}
}
	`
	temp := template.New(content)
	temp.Parse(content)
	return temp
}

func PutTemplate() *template.Template {
	content := `
func {{ .FuncName }}(w http.ResponseWriter, r *http.Request){
	var body models.{{ .EndPointName }}
	var res models.{{ .EndPointName }}
	{{ .Params }} := r.PathValue("{{ .Params }}")
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		log.Fatal(err)
	}
	{{ .DbCallerHandler }}
	rows, err := db.Query("{{ .PutQuery }}", {{ .Params }})
	if err != nil {
		log.Fatal(err)
	}
	rows.Next()
	rows.Scan({{ .ScanParams }})
	{{ .ResponseWriter }}
}		
`
	temp := template.New(content)
	temp.Parse(content)
	return temp
}

func PutHandler(modelName, epName, sgbd string, attrs []string, ScanParamsWriter string, params string) string {
	tmp := PutTemplate()

	var tmpBuffer bytes.Buffer
	data := struct {
		EndPointName    string
		DbCallerHandler string
		PutQuery        string
		ScanParams      string
		ResponseWriter  string
		Params          string
		FuncName        string
	}{
		EndPointName:    utils.ToUpperFirstLetter(modelName),
		DbCallerHandler: DBCallerHandler(sgbd),
		PutQuery:        Update(epName, attrs, sgbd),
		ScanParams:      ScanParamsWriter,
		ResponseWriter:  WriteResponseWriter(),
		Params:          params,
		FuncName:        strings.ReplaceAll(epName, " ", "_"),
	}
	err := tmp.Execute(&tmpBuffer, data)
	if err != nil {
		fmt.Println(err)
	}
	return tmpBuffer.String()
}

func DeleteHandler(epName, sgbd, params, tableName string) string {
	return fmt.Sprintf(`
func %s(w http.ResponseWriter, r *http.Request){
	%s := r.PathValue("%s")
	type response struct{
		Message string
	}
	%s
	rows,_ := db.Query("%s", %s)
	rows.Next()
	res := response{
		Message: "users deleted",
	}
	%s
}
	`, epName, params, params, DBCallerHandler(sgbd), Delete(tableName, sgbd), params, WriteResponseWriter())
}

func InsertHandler(epName, sgbd, tableName string, attr []string) string {
	var bodyParam []string
	for _, val := range attr {
		bodyParam = append(bodyParam, fmt.Sprintf("body.%s", utils.ToUpperFirstLetter(val)))
	}
	return fmt.Sprintf(`
	func %s(w http.ResponseWriter, r *http.Request){
		%s
		%s
	res, err := db.Exec("%s", %s)
		%s
		%s
	}`+"\n",
		epName,
		WriteBodyDecodeur(tableName),
		DBCallerHandler(sgbd),
		Insert(tableName, attr),
		strings.Join(bodyParam, ", "),
		utils.WriteErrorCheker("insert error"),
		WriteResponseWriter())
}

func WriteBodyDecodeur(modelName string) string {
	var tmpBuffer bytes.Buffer

	tmp := BodyDecodeurTemplate()

	data := struct {
		EndPointName string
		ErrorChecker string
	}{
		EndPointName: utils.ToUpperFirstLetter(modelName),
		ErrorChecker: utils.WriteErrorCheker("Parsing Error"),
	}

	err := tmp.Execute(&tmpBuffer, data)
	utils.ErrorChecker(err)
	return tmpBuffer.String()
}

func BodyDecodeurTemplate() *template.Template {
	content := `
var body models.{{ .EndPointName }} 
decoder := json.NewDecoder(r.Body) 
err := decoder.Decode(&body)
{{ .ErrorChecker }}
	`
	temp := template.New(content)
	temp.Parse(content)
	return temp
}
