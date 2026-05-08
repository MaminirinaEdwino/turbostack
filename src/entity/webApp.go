package entity

type WebApp struct {
	Pages     []Page
	Role      []string
	Composant []Composant
	BDD       BDD
}

func (webapp *WebApp) GetPages() []Page {
	return webapp.Pages
}

func (webapp *WebApp) GetRole() []string {
	return webapp.Role
}

func (webapp *WebApp) GetComposant() []Composant {
	return webapp.Composant
}

func (webapp *WebApp) GetBDD() BDD {
	return webapp.BDD
}

func (webapp *WebApp) SetPages(Pages []Page) *WebApp {
	webapp.Pages = Pages
	return webapp
}

func (webapp *WebApp) SetRole(Role []string) *WebApp {
	webapp.Role = Role
	return webapp
}

func (webapp *WebApp) SetComposant(Composant []Composant) *WebApp {
	webapp.Composant = Composant
	return webapp
}

func (webapp *WebApp) SetBDD(BDD BDD) *WebApp {
	webapp.BDD = BDD
	return webapp
}