package entity

type Composant struct {
	nom     string
	contenu []any
	params  []any
}

func (composant *Composant) GetNom() string {
	return composant.nom
}

func (composant *Composant) GetContenu() any {
	return composant.contenu
}

func (composant *Composant) GetParams() any {
	return composant.params
}

func (composant *Composant) SetNom(nom string) *Composant {
	composant.nom = nom
	return composant
}

func (composant *Composant) SetContenu(contenu []any) *Composant {
	composant.contenu = contenu
	return composant
}

func (composant *Composant) SetParams(params []any) *Composant {
	composant.params = params
	return composant
}