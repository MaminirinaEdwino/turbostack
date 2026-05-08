package entity

type RestApi struct {
	endpoints []Endpoint
	role      []string
	bdd       BDD
}


func (restapi *RestApi) GetEndpoints() []Endpoint {
	return restapi.endpoints
}

func (restapi *RestApi) GetRole() []string {
	return restapi.role
}

func (restapi *RestApi) GetBDD() BDD {
	return restapi.bdd
}

func (restapi *RestApi) SetEndpoints(Endpoints []Endpoint) *RestApi {
	restapi.endpoints = Endpoints
	return restapi
}

func (restapi *RestApi) SetRole(Role []string) *RestApi {
	restapi.role = Role
	return restapi
}

func (restapi *RestApi) SetBDD(BDD BDD) *RestApi {
	restapi.bdd = BDD
	return restapi
}
