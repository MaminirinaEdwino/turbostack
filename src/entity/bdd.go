package entity

type BDD struct {
	Models []Model
	SGBD   string
}

func (db *BDD) GetModels() []Model {
	return db.Models
}

func (db *BDD) GetSGBD() string  {
	return db.SGBD
}

func (db *BDD) SetModels(models []Model)  {
	db.Models = models
}

func (db *BDD) SetSGBD(sgbd string) {
	db.SGBD = sgbd
}


