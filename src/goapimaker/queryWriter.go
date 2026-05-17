package goapimaker

import (
	"fmt"
	"strings"
)

func Delete(table string, params string) string {
	return fmt.Sprintf("delete from %s where %s = $1", table, params)
}

func Update(ep_name string, attrs []string, params string) string {
	return fmt.Sprintf("update %s set %s where %s = $%d returning * ", ep_name, strings.Join(attrs, ", "), params, len(attrs)+1)
}

func Select(tableName string) string {
	return fmt.Sprintf("select * from %s", tableName)
}
func SelectBy(tableName string, params string) string {
	return fmt.Sprintf("select * from %s where %s = $1", tableName, params)
}

func Insert(tableName string, attr []string) string {
	var tmp []string
	for i := range attr {
		tmp = append(tmp, fmt.Sprintf("$%d", i))
	}
	return fmt.Sprintf("insert into %s (%s) values (%s)", tableName, strings.Join(attr, ", "), strings.Join(tmp, ", "))
}