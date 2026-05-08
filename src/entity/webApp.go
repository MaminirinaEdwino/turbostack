package entity

type WebApp struct {
	pages     []Page
	role      []string
	composant []Composant
	bdd       BDD
}

func (w *WebApp) ToJSON() WebAppJSON {
	return WebAppJSON{
		Pages:     w.pages,
		Role:      w.role,
		Composant: w.composant,
		BDD:       w.bdd,
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

func (webapp *WebApp) SetBDD(BDD BDD) *WebApp {
	webapp.bdd = BDD
	return webapp
}
