package api

import webview "github.com/webview/webview_go"

func Dispatch(w webview.WebView, eventName string, data string) {
	// On utilise un CustomEvent JS pour passer des données proprement
	script := `window.dispatchEvent(new CustomEvent("` + eventName + `",
{detail: ` + data + `}));`
	w.Eval(script)
}
