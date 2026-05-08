package entity

type Page struct {
	nom     string
	contenu []any
}

func (page *Page) GetNom() string {
	return page.nom
}

func (page *Page) GetContenu() any {
	return page.contenu
}

func (page *Page) SetNom(Nom string) *Page {
	page.nom = Nom
	return page
}

func (page *Page) SetContenu(Contenu []any) *Page {
	page.contenu = Contenu
	return page
}
