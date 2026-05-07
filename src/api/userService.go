package api

import webview "github.com/webview/webview_go"

type UserService struct{}

func (s *UserService) SayHello(name string) string {
	return "Bonjour " + name
}

// On implémente l'interface Binder
func (s *UserService) Bind(w webview.WebView) {
	w.Bind("sayHello", s.SayHello)
}
