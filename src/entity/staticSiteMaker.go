package entity

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
)

type Staticsitemaker struct{}

func (ssm *Staticsitemaker) SetupStaticArch(name string) {
	projectPath := fmt.Sprintf("%s/static/", name)
	dirList := []string{
		"css",
		"js",
		"assets",
	}
	for _, val := range dirList {
		config.CheckCreateDir(projectPath + val)
	}
}

func (mgr *Staticsitemaker) RenderBlocksToHTML(blocks []pageContent, projectName string) string {
	cssPath := fmt.Sprintf("%s/%s/static/css/style.css", config.PROJECT_DIR, projectName)
	cssFile, _ := os.OpenFile(cssPath, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0644)
	var sb strings.Builder
	for _, b := range blocks {
		block := b

		tag := fmt.Sprintf("%v", block.tag)
		content := fmt.Sprintf("%v", block.content)
		className := fmt.Sprintf("%v", block.className)
		style := fmt.Sprintf("%v", block.styles)
		id := fmt.Sprintf("%v", block.id)

		// Gestion des balises auto-fermantes
		if tag == "img" {
			sb.WriteString(fmt.Sprintf("<img src=\"%s\" class=\"%s\" data-id=\"%s\" style=\"%s\"/>", content, className, id, style))
			continue
		}

		fmt.Fprintf(&sb, "<%s class=\"%s\" data-id=\"%s\" style=\"%s\"> ", tag, className, id, style)
		var cssVal map[string]map[string]string
		if style != "" {
			er := json.Unmarshal([]byte(style), &cssVal)
			if er != nil {
				fmt.Println("error", er)
				continue
			}
		}
		desktop := cssVal["desktop"]
		tablet := cssVal["tablet"]
		mobile := cssVal["mobile"]
		if len(desktop)>0 {
			fmt.Fprint(cssFile, "@media screen and (min-width: 1024px) {\n")
			fmt.Fprintf(cssFile, " %s{\n", tag)
			for key, val := range desktop {
				fmt.Fprintf(cssFile, "%s:%s", key, val)
			}
			fmt.Fprint(cssFile, " }\n")
		}
		if len(tablet)>0 {
			fmt.Fprint(cssFile, "@media screen and (min-width: 1024px) {\n")
			fmt.Fprintf(cssFile, " %s{\n", tag)
			for key, val := range tablet {
				fmt.Fprintf(cssFile, "%s:%s", key, val)
			}
			fmt.Fprint(cssFile, " }\n")
		}
		if len(mobile)>0 {
			fmt.Fprintf(cssFile, " %s{\n", tag)
			for key, val := range mobile {
				fmt.Fprintf(cssFile, "%s:%s", key, val)
			}
			fmt.Fprint(cssFile, " }\n")
		}
		sb.WriteString(content)

		if len(block.children) > 0 {
			sb.WriteString(mgr.RenderBlocksToHTML(block.children, projectName))
		}
		fmt.Printf("</%s>\n", tag)
		fmt.Fprintf(&sb, "</%s>", tag)
	}
	return sb.String()
}
