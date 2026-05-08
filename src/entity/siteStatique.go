package entity

type SiteStatique struct {
	pages      []Page
	composants []Composant
}

func (s *SiteStatique) ToJSON() SiteStatiqueJSON {
	return SiteStatiqueJSON{
		Pages: s.pages,
		Composants: s.composants,
	}
}

func (sitestatique *SiteStatique) GetPages() []Page {
	return sitestatique.pages
}

func (sitestatique *SiteStatique) GetComposants() []Composant {
	return sitestatique.composants
}

func (sitestatique *SiteStatique) SetPages(Pages []Page) *SiteStatique {
	sitestatique.pages = Pages
	return sitestatique
}

func (sitestatique *SiteStatique) SetComposants(Composants []Composant) *SiteStatique {
	sitestatique.composants = Composants
	return sitestatique
}
