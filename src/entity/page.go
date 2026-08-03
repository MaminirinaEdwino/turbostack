package entity

type Page struct {
	nom     string
	contenu []pageContent
	uri     string
	styles  string
	asset   AssetList
}

func (p *Page) ToJSON() PageJSON {
	var pcontent []PageContentJSON
	var assetList []AssetJSON
	for _, val := range p.asset {
		assetList = append(assetList, val.ToJSON())
	}
	for _, val := range p.contenu {
		pcontent = append(pcontent, val.ToJSON())
	}

	return PageJSON{
		Nom:     p.nom,
		Contenu: pcontent,
		Uri:     p.uri,
		Styles:  p.styles,
		Assets:  assetList,
	}
}

func (page *Page) GetNom() string {
	return page.nom
}

func (page *Page) GetContent() []pageContent {
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
