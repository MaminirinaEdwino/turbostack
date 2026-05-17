package goapimaker

import (
	"bytes"
	"fmt"
	"strings"
	"text/template"
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
	`, HandlerName, DbCaller, ResponseType, Query, ResponseType, ScanValue, ResponseWriter)
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
func {{ .StructName }}(w http.ResponseWriter, r *http.Request){
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
func {{ .EndPointName }}HandlerPut(w http.ResponseWriter, r *http.Request){
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

func PutHandler(structName, epName, sgbd string, attrs []string, ScanParamsWriter string, params string) string {
	tmp := PutTemplate()

	var tmpBuffer bytes.Buffer
	data := struct {
		EndPointName    string
		DbCallerHandler string
		PutQuery        string
		ScanParams      string
		ResponseWriter  string
		Params          string
	}{
		EndPointName:    structName,
		DbCallerHandler: DBCallerHandler(sgbd),
		PutQuery:        Update(epName, attrs, sgbd),
		ScanParams:      ScanParamsWriter,
		ResponseWriter:  WriteResponseWriter(),
		Params:          params,
	}
	err := tmp.Execute(&tmpBuffer, data)
	if err != nil {
		fmt.Println(err)
	}
	return tmpBuffer.String()
}
