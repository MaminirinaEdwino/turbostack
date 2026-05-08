package entity

type Composant struct {
	Nom     string
	Contenu []any
	Params  []any
}

func (composant *Composant) GetNom() string {
	return composant.Nom
}

func (composant *Composant) GetContenu() any {
	return composant.Contenu
}

func (composant *Composant) GetParams() any {
	return composant.Params
}

func (composant *Composant) SetNom(Nom string) *Composant {
	composant.Nom = Nom
	return composant
}

func (composant *Composant) SetContenu(Contenu []any) *Composant {
	composant.Contenu = Contenu
	return composant
}

func (composant *Composant) SetParams(Params []any) *Composant {
	composant.Params = Params
	return composant
}