package api

import (
	webview "github.com/webview/webview_go"
	"runtime"
)

type SystemService struct{}

func (s *SystemService) GetStats() map[string]string {
	return map[string]string{
		"os":   runtime.GOOS,
		"arch": runtime.GOARCH,
	}
}
func (s *SystemService) Bind(w webview.WebView) {
	w.Bind("getStats", s.GetStats)
}
