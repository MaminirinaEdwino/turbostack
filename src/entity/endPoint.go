package entity

type Endpoint struct {
	Nom    string
	Uri    string
	Method string
	Model  []Model
	Params []string
	Role   string
}

func (e *Endpoint) GetNom() string {
	return e.Nom
}

func (e *Endpoint) GetUri() string {
	return e.Uri
}

func (e *Endpoint) GetMethod() string {
	return e.Method
}

func (e *Endpoint) GetModel() []Model {
	return e.Model
}

func (e *Endpoint) GetParams() []string {
	return e.Params
}

func (e *Endpoint) GetRole() string {
	return e.Role
}

func (e *Endpoint) SetNom(Nom string) {
	e.Nom = Nom
}

func (e *Endpoint) SetUri(Uri string) {
	e.Uri = Uri
}

func (e *Endpoint) SetMethod(Method string) {
	e.Method = Method
}

func (e *Endpoint) SetModel(Model []Model) {
	e.Model = Model
}

func (e *Endpoint) SetParams(Params []string) {
	e.Params = Params
}

func (e *Endpoint) SetRole(Role string) {
	e.Role = Role
}
