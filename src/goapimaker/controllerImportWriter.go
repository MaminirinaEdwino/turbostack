package goapimaker

import "strings"

func ControllerImportWriter(sb strings.Builder, projectName string) {
	sb.WriteString("package controllers\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"encoding/json\"\n")
	sb.WriteString("\t\"net/http\"\n")
	sb.WriteString("\t\""+projectName+"/src/models\"\n")
	sb.WriteString("\t\""+projectName+"/src/config\"\n")
	sb.WriteString("\t_ \"github.com/lib/pq\"\n")
	sb.WriteString(")\n\n")
}
