package entity

import (
	"fmt"
)

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

func (m *Model) SetNom(nom string) (error) {
	if nom == "" {
		return fmt.Errorf("Empty value")
	}
	m.Nom = nom
	return nil
}

func (m *Model) SetAttributs(attr []Champs) {
	m.Attributs = attr
}

func (m *Model) AddAttribut(attr Champs) {
	m.Attributs = addChamps(m.Attributs, attr)
}

func (m *Model) DeleteAttribut(attrId int) {
	m.Attributs = deleteChamp(m.Attributs, attrId)
}

