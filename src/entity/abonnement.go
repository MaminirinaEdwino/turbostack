package entity

import "time"

type Abonnement struct {
	Type  string
	Debut time.Time
	Fin   time.Time
}

func (a *Abonnement) GetType() string {
	return a.Type
}

func (a *Abonnement) GetDebut() time.Time {
	return a.Debut
}

func (a *Abonnement) GetFin() time.Time {
	return a.Fin
}

func (a *Abonnement) SetType(Type string) {
	a.Type = Type
}

func (a *Abonnement) SetDebut(debut time.Time)  {
	a.Debut = debut
}

func (a *Abonnement) SetFin(fin time.Time) {
	a.Fin = fin
}

func (a *Abonnement) IsValid() bool{
	return a.Fin.After(time.Now())
}