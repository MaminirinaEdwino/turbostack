package entity

type Model struct {
	Nom       string   `json:"nom"`
	Attributs []Champs `json:"attributs"`
}

func (m *Model) GetNom() string {
	return m.Nom
}

func (m *Model) GetAttributs() []Champs {
	return m.Attributs
}

func (m *Model) SetNom(nom string) {
	m.Nom = nom
}

func (m *Model) SetAttributs(attr []Champs) {
	m.Attributs = attr
}

func (m *Model) AddAttribut(attr Champs) {
	m.Attributs = append(m.Attributs, attr)
}

func (m *Model) DeleteAttribut(attrId int) {
	for i := range m.Attributs {
		if attrId == i {
			m.Attributs = append(m.Attributs[:i-1], m.Attributs[i:]...)
		}
	}
}

