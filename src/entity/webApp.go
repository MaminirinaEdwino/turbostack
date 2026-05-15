package entity

type ControllerParams struct {
	ParamsName string `json:"params_name"`
	ParamsType string `json:"params_type"`
}

type Controller struct {
	Name          string             `json:"name"`
	Params        []ControllerParams `json:"params"`
	Page          Page               `json:"page"`
	Type          string             `json:"type"`
	RequestParams []string           `json:"request_params"`
}

type WebApp struct {
	pages      []Page
	role       []string
	composant  []Composant
	Controller []Controller
}

func (w *WebApp) ToJSON() WebAppJSON {
	var pages []PageJSON
	var composants []ComposantJSON
	for _, val := range w.pages {
		pages = append(pages, val.ToJSON())
	}
	for _, val := range w.composant {
		composants = append(composants, val.ToJSON())
	}
	return WebAppJSON{
		Pages:     pages,
		Role:      w.role,
		Composant: composants,
	}
}

func (webapp *WebApp) GetPages() []Page {
	return webapp.pages
}

func (webapp *WebApp) GetRole() []string {
	return webapp.role
}

func (webapp *WebApp) GetComposant() []Composant {
	return webapp.composant
}

func (webapp *WebApp) SetPages(Pages []Page) *WebApp {
	webapp.pages = Pages
	return webapp
}

func (webapp *WebApp) SetRole(Role []string) *WebApp {
	webapp.role = Role
	return webapp
}

func (webapp *WebApp) SetComposant(Composant []Composant) *WebApp {
	webapp.composant = Composant
	return webapp
}
