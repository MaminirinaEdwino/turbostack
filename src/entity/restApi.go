package entity

type RestApi struct {
	Endpoints []Endpoint
	Role []string
	BDD BDD
}

func (restapi *RestApi) GetEndpoints() []Endpoint {
	return restapi.Endpoints
}

func (restapi *RestApi) GetRole() []string {
	return restapi.Role
}

func (restapi *RestApi) GetBDD() BDD {
	return restapi.BDD
}

func (restapi *RestApi) SetEndpoints(Endpoints []Endpoint) *RestApi {
	restapi.Endpoints = Endpoints
	return restapi
}

func (restapi *RestApi) SetRole(Role []string) *RestApi {
	restapi.Role = Role
	return restapi
}

func (restapi *RestApi) SetBDD(BDD BDD) *RestApi {
	restapi.BDD = BDD
	return restapi
}