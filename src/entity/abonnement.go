package entity

import "time"

type Abonnement struct {
	type_abonnement string
	debut           time.Time
	fin             time.Time
}


func (a *Abonnement) GetType() string {
	return a.type_abonnement
}

func (a *Abonnement) GetDebut() time.Time {
	return a.debut
}

func (a *Abonnement) GetFin() time.Time {
	return a.fin
}

func (a *Abonnement) SetType(type_abonnement string) {
	a.type_abonnement = type_abonnement
}

func (a *Abonnement) SetDebut(debut time.Time) {
	a.debut = debut
}

func (a *Abonnement) SetFin(fin time.Time) {
	a.fin = fin
}

func (a *Abonnement) IsValid() bool {
	return a.fin.After(time.Now())
}
