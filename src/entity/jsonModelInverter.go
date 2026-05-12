package entity

func (bddjson *BDDJSON) ToBDD() BDD {
	var bdd BDD
	bdd.sgbd = bddjson.Sgbd
	bdd.models = bddjson.Models
	return bdd
}
