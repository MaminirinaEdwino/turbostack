package entity

type BDD struct {
	models []Model
	sgbd   string
}


func (db *BDD) GetModels() []Model {
	return db.models
}

func (db *BDD) GetSGBD() string {
	return db.sgbd
}

func (db *BDD) SetModels(models []Model) {
	db.models = models
}

func (db *BDD) SetSGBD(sgbd string) {
	db.sgbd = sgbd
}

func (db *BDD) AddModel(model Model) []Model {
	db.models = append(db.models, model)
	return db.models
}

func (db *BDD) DeleteModel(model_id int) []Model {
	for i := range db.models {
		if i == model_id {
			db.models = append(db.models[:i-1], db.models[i:]...)
		}
	}
	return db.models
}
