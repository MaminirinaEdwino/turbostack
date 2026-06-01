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

func (mgr *Staticsitemaker) RenderBlocksToHTML(blocks []pageContent, projectName string, pageName string) string {
	cssPath := fmt.Sprintf("%s/%s/static/css/%s.css", config.PROJECT_DIR, projectName, pageName)
	cssFile, _ := os.OpenFile(cssPath, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0644)
	var sb strings.Builder

	var desktopSb strings.Builder
	var tabletSb strings.Builder

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
		if len(tablet) > 0 {
			tabletSb.WriteString(fmt.Sprintf("%s{\n", tag))
			for key, val := range tablet {
				tabletSb.WriteString(fmt.Sprintf("\t%s:%s;", key, val))
			}
			tabletSb.WriteString(" }\n")
		}
		if len(desktop) > 0 {
			fmt.Fprintf(&desktopSb, " %s{\n", tag)
			for key, val := range desktop {
				fmt.Fprintf(&desktopSb, "\t%s:%s;\n", key, val)
			}
			desktopSb.WriteString(" }\n")
		}

		if len(mobile) > 0 {
			fmt.Fprintf(cssFile, " %s{\n", tag)
			for key, val := range mobile {
				fmt.Fprintf(cssFile, "\t%s:%s;\n", key, val)
			}
			fmt.Fprint(cssFile, " }\n")
		}
		sb.WriteString(content)

		if len(block.children) > 0 {
			sb.WriteString(mgr.RenderBlocksToHTML(block.children, projectName, pageName))
		}
		fmt.Printf("</%s>\n", tag)
		fmt.Fprintf(&sb, "</%s>", tag)
	}
	if desktopSb.Len() > 0 {
		cssFile.WriteString("@media screen and (min-width: 1024px) {\n")
		cssFile.WriteString(desktopSb.String())
		cssFile.WriteString("}\n")
	}
	if tabletSb.Len() > 0 {
		cssFile.WriteString("@media screen and (min-width: 768px) {\n")
		cssFile.WriteString(tabletSb.String())
		cssFile.WriteString("}\n")
	}
	return sb.String()
}
