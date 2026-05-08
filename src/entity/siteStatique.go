package entity

type SiteStatique struct {
	Pages []Page
	Composants []Composant
}
func (sitestatique *SiteStatique) GetPages() []Page {
	return sitestatique.Pages
}

func (sitestatique *SiteStatique) GetComposants() []Composant {
	return sitestatique.Composants
}

func (sitestatique *SiteStatique) SetPages(Pages []Page) *SiteStatique {
	sitestatique.Pages = Pages
	return sitestatique
}

func (sitestatique *SiteStatique) SetComposants(Composants []Composant) *SiteStatique {
	sitestatique.Composants = Composants
	return sitestatique
}