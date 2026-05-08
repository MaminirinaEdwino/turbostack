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

func (db *BDD) AddModel(model Model) []Model {
	db.Models = append(db.Models, model)
	return db.Models
}

func (db *BDD) DeleteModel(model_id int) []Model {
	for i := range db.Models {
		if i == model_id {
			db.Models = append(db.Models[:i-1], db.Models[i:]...)
		}
	}
	return db.Models
}

