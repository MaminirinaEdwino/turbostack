package entity

type Page struct {
	nom     string
	contenu []pageContent
}

func (p *Page) ToJSON() PageJSON {
	var pcontent []PageContentJSON
	for _, val := range p.contenu {
		pcontent = append(pcontent, val.ToJSON())
	}
	
	return PageJSON{
		Nom: p.nom,
		Contenu: pcontent,
	}
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

func (page *Page) SetContenu(Contenu []pageContent) *Page {
	page.contenu = Contenu
	return page
}

