package entity

type Endpoint struct {
	nom    string
	uri    string
	method string
	model  []Model
	params []string
	role   string
}

func (e *Endpoint) ToJSON() EndpointJSON {
	return EndpointJSON{
		Nom: e.nom,
		Uri: e.uri,
		Method: e.method,
		Model: e.model,
		Params: e.params,
		Role: e.role,
	}
}

func (e *Endpoint) GetNom() string {
	return e.nom
}

func (e *Endpoint) GetUri() string {
	return e.uri
}

func (e *Endpoint) GetMethod() string {
	return e.method
}

func (e *Endpoint) GetModel() []Model {
	return e.model
}

func (e *Endpoint) GetParams() []string {
	return e.params
}

func (e *Endpoint) GetRole() string {
	return e.role
}

func (e *Endpoint) SetNom(nom string) {
	e.nom = nom
}

func (e *Endpoint) SetUri(uri string) {
	e.uri = uri
}

func (e *Endpoint) SetMethod(method string) {
	e.method = method
}

func (e *Endpoint) SetModel(Model []Model) {
	e.model = Model
}

func (e *Endpoint) SetParams(Params []string) {
	e.params = Params
}

func (e *Endpoint) SetRole(Role string) {
	e.role = Role
}
