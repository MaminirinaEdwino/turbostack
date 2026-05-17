package goapimaker

func DbCallerPG() string {
	return DBCallerTemplate()
}

func DBCallerHandler(sgbd string) string {
	if sgbd == "pg" {
		return DbCallerPG()
	}
	return ""
}