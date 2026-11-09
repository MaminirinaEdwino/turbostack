package goapimaker

import (
	"fmt"
	"strings"
)

func Delete(table string, params string) string {
	return fmt.Sprintf("delete from %s where %s = $1", table, params)
}

func Update(model_name string, attrs []string, params string) string {
	var tmp []string
	for _, str := range attrs {
		tab := strings.Split(str, "=")
		tmp = append(tmp, tab[0])
	}
	return fmt.Sprintf("update %s set %s where %s = $%d returning %s ", model_name, strings.Join(attrs, ", "), params, len(attrs)+1, strings.Join(tmp, ","))
}

func Select(tableName string) string {
	return fmt.Sprintf("select * from %s ", tableName)
}
func SelectWithAttr(tableName string, attr string) string {
	return fmt.Sprintf("select %s from %s", attr, tableName)
}
func SelectBy(tableName string, params string) string {
	return fmt.Sprintf("select * from %s where %s = $1", tableName, params)
}
func SelectByWithAttr(tableName string, params string, paramsGet string) string {
	return fmt.Sprintf("select %s from %s where %s = $1", params, tableName, paramsGet)
}

func Insert(tableName string, attr []string) string {
	var tmp []string
	for i := range attr {
		tmp = append(tmp, fmt.Sprintf("$%d", i+1))
	}
	return fmt.Sprintf("insert into %s (%s) values (%s) returning %s ", tableName, strings.Join(attr, ", "), strings.Join(tmp, ", "), strings.Join(attr, ", "))
}
