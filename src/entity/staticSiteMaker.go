package entity

import (
	"fmt"
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

func (mgr *Staticsitemaker) RenderBlocksToHTML(blocks []any) string {
	var sb strings.Builder
	for _, b := range blocks {
		block, ok := b.(map[string]any)
		if !ok {
			continue
		}

		tag := fmt.Sprintf("%v", block["tag"])
		content := fmt.Sprintf("%v", block["content"])
		className := fmt.Sprintf("%v", block["className"])
		id := fmt.Sprintf("%v", block["id"])

		// Gestion des balises auto-fermantes
		if tag == "img" {
			sb.WriteString(fmt.Sprintf("<img src=\"%s\" class=\"%s\" data-id=\"%s\" />", content, className, id))
			continue
		}

		sb.WriteString(fmt.Sprintf("<%s class=\"%s\" data-id=\"%s\">", tag, className, id))
		sb.WriteString(content)

		if children, exists := block["children"].([]any); exists && len(children) > 0 {
			sb.WriteString(mgr.RenderBlocksToHTML(children))
		}

		sb.WriteString(fmt.Sprintf("</%s>", tag))
	}
	return sb.String()
}