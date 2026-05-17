package goapimaker

import "fmt"

func SelectTemplate(HandlerName string, DbCaller string, ResponseType string, Query string, ScanValue string, ResponseWriter string) string {
	return fmt.Sprintf(`
func %s(w http.ResponseWriter, r *http.Request){
	%s
	var res []models.%s

	rows, err := db.Query("%s")

	for rows.Next(){
		var tmp %s
		rows.Scan(%s)
		res = append(res, tmp)
	}
	{%s
}
	`, HandlerName, DbCaller, ResponseType, Query, ResponseType, ScanValue, ResponseWriter)
}

func DBCallerTemplate() string {
	return `
db, err := sql.Open("postgres", database_url)
if err != nil {
	log.Fatal(err)
}
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
