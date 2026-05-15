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

func (c *Controller) ToJSON() ControllerJSON {
	return ControllerJSON{
		Name:          c.Name,
		Params:        c.Params,
		Page:          c.Page.ToJSON(),
		Type:          c.Type,
		RequestParams: c.RequestParams,
	}
}

type WebApp struct {
	pages       []Page
	role        []string
	composant   []Composant
	controllers []Controller
	bdd         BDD
}

func (w *WebApp) ToJSON() WebAppJSON {
	var pages []PageJSON
	var composants []ComposantJSON
	var controllers []ControllerJSON
	for _, val := range w.pages {
		pages = append(pages, val.ToJSON())
	}
	for _, val := range w.composant {
		composants = append(composants, val.ToJSON())
	}
	for _, val := range w.controllers {
		controllers = append(controllers, val.ToJSON())
	}
	return WebAppJSON{
		Pages:       pages,
		Role:        w.role,
		Composant:   composants,
		BDD:         w.bdd.ToJSON(),
		Controllers: controllers,
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

func (webapp *WebApp) GetControllers() []Controller {
	return webapp.controllers
}

func (webapp *WebApp) GetBDD() BDD {
	return webapp.bdd
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

func (webapp *WebApp) SetControllers(Controllers []Controller) *WebApp {
	webapp.controllers = Controllers
	return webapp
}

func (webapp *WebApp) SetBDD(Bdd BDD) *WebApp {
	webapp.bdd = Bdd
	return webapp
}
