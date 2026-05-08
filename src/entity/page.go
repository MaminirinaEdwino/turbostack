package entity

type Page struct {
	Nom     string
	Contenu []any
}

func (page *Page) GetNom() string {
	return page.Nom
}

func (page *Page) GetContenu() any {
	return page.Contenu
}

func (page *Page) SetNom(Nom string) *Page {
	page.Nom = Nom
	return page
}

func (page *Page) SetContenu(Contenu []any) *Page {
	page.Contenu = Contenu
	return page
}
