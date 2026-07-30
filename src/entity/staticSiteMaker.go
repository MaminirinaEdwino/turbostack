package entity

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/utils"
)

type Staticsitemaker struct{}

func (ssm *Staticsitemaker) SetupStaticArch(name string) {
	projectPath := fmt.Sprintf("%s/static/", name)
	dirList := []string{
		"static/css",
		"static/js",
		"static/assets",
		"views",
	}
	for _, val := range dirList {
		config.CheckCreateDir(projectPath + val)
	}
}

func (ssm *Staticsitemaker) SetupGoServerCode(pages []Page, filePath string) {
	mainFile, err := os.OpenFile(filePath, os.O_CREATE|os.O_RDWR|os.O_TRUNC, os.ModePerm)
	utils.ErrorChecker(err)
	mainFile.WriteString("package main\n\n")
	mainFile.WriteString("import (\n\t\"net/http\"\n\t\"fmt\")\n\n")

	for _, page := range pages {
		pageName := strings.ToLower(strings.ReplaceAll(page.GetNom(), " ", "_"))
		handler := fmt.Sprintf("func handle_%s(w http.ResponseWriter, r *http.Request){\nhttp.ServeFile(w, r, \"views/%s.html\")}\n\n", pageName, pageName)
		mainFile.WriteString(handler)
	}
	startServer := `
func startServer(mux *http.ServeMux, PORT int) {
    fmt.Printf("Server started on port : http://localhost:%d\n", PORT)
    err := http.ListenAndServe(fmt.Sprintf(":%d", PORT), mux)
    if err != nil {
        fmt.Println(err)
        startServer(mux, PORT+1)
    }
}	
`
	mainFile.WriteString(startServer)
	mainFile.WriteString("func main(){\n")
	mainFile.WriteString("\tmux := http.NewServeMux()\n")
	mainFile.WriteString("\tstaticServer := http.FileServer(http.Dir(\"static\"))\n\tPORT := 8080\n")
	mainFile.WriteString("\tmux.Handle(\"GET /static/\", http.StripPrefix(\"/static/\", staticServer))\n")
	for _, page := range pages {
		pageName := strings.ToLower(strings.ReplaceAll(page.GetNom(), " ", "_"))
		mainFile.WriteString(fmt.Sprintf("\tmux.HandleFunc(\"GET %s\", handle_%s)\n", page.uri, pageName))
	}
	mainFile.WriteString("\tstartServer(mux, PORT)\n}\n")

}

func checkValueSb(sb *strings.Builder , key, value string) {
	fmt.Println("value : ", value)
	if value != "" {
		fmt.Fprintf(sb, "\t%s:%s;\n", key, value)
	}
}


func checkValueFile(sb *os.File, key, value string) {
	if len(strings.Split(value, "")) > 0 {
		fmt.Fprintf(sb, "\t%s:%s;\n", key, value)
	}
}

func styleWriter(page Page, cssFile *os.File) {
	
	var desktopSb strings.Builder
	var tabletSb strings.Builder
	var cssVal map[string]map[string]map[string]string
	style := page.styles
	if style != "" {
		er := json.Unmarshal([]byte(style), &cssVal)
		if er != nil {
			fmt.Println("error", er)
		}
	}

	desktop := cssVal["desktop"]
	tablet := cssVal["tablet"]
	mobile := cssVal["mobile"]
	if len(tablet) > 0 {
		for tag, val := range tablet {
			fmt.Fprintf(&tabletSb, "%s {\n", tag)
			for key, value := range val {
				checkValueSb(&tabletSb, key, value)
			}
			fmt.Fprintf(&tabletSb, "\n}\n")
		}
	}
	if len(desktop) > 0 {
		for tag, val := range desktop {
			fmt.Fprintf(&desktopSb, "%s {\n", tag)
			for key, value := range val {
				checkValueSb(&desktopSb, key, value)
			}
			fmt.Fprintf(&desktopSb, "\n}\n")
		}
	}

	if len(mobile) > 0 {
		for tag, val := range desktop {
			fmt.Fprintf(cssFile, "%s {\n", tag)
			for key, value := range val {
				checkValueFile(cssFile, key, value)
			}
			fmt.Fprintf(cssFile, "\n}\n")
		}
	}
}

func (mgr *Staticsitemaker) RenderBlocksToHTML(blocks []pageContent, projectName string, pageName string) string {
	cssPath := fmt.Sprintf("%s/%s/static/static/css/%s.css", config.PROJECT_DIR, projectName, pageName)
	cssFile, _ := os.OpenFile(cssPath, os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	defer cssFile.Close()
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
		inputType := fmt.Sprintf("%v", block.inputType)
		placeholder := fmt.Sprintf("%v", block.placeholder)

		// Gestion des balises auto-fermantes
		if tag == "img" {
			fmt.Fprintf(&sb, "<img src=\"%s\" class=\"%s\" data-id=\"%s\" />", content, className, id)
			continue
		} else if tag == "input" {
			fmt.Fprintf(&sb, "<input type=\"%s\" class=\"%s\" data-id=\"%s\" placeholder=\"%s\"/>", inputType, className, id, placeholder)
		}

		fmt.Fprintf(&sb, "<%s class=\"%s\" data-id=\"%s\" > ", tag, className, id)
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
			fmt.Fprintf(&tabletSb, "[data-block-id=\"%s\"]{\n", id)
			for key, val := range tablet {
				checkValueSb(&tabletSb, key, val)
			}
			tabletSb.WriteString("}\n")
		}
		if len(desktop) > 0 {
			fmt.Fprintf(&desktopSb, "[data-block-id=\"%s\"]{\n", id)
			for key, val := range desktop {
				checkValueSb(&desktopSb, key, val)
			}
			desktopSb.WriteString("}\n")
		}

		if len(mobile) > 0 {
			fmt.Fprintf(cssFile, "[data-block-id=\"%s\"]{\n", id)
			for key, val := range mobile {
				checkValueFile(cssFile, key, val)
			}
			fmt.Fprint(cssFile, "}\n")
		}
		sb.WriteString(content)

		if len(block.children) > 0 {
			sb.WriteString(mgr.RenderBlocksToHTML(block.children, projectName, pageName))
		}

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
