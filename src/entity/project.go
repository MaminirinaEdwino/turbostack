package entity

type Project struct {
	nom          string
	type_project         string
	bdd          BDD
	rest_api      RestApi
	web_app       WebApp
	site_statique SiteStatique
}


func (project *Project) GetNom() string {
	return project.nom
}

func (project *Project) GetType() string {
	return project.type_project
}

func (project *Project) GetBDD() BDD {
	return project.bdd
}

func (project *Project) GetRestApi() RestApi {
	return project.rest_api
}

func (project *Project) GetWebApp() WebApp {
	return project.web_app
}

func (project *Project) GetSiteStatique() SiteStatique {
	return project.site_statique
}

func (project *Project) SetNom(Nom string) *Project {
	project.nom = Nom
	return project
}

func (project *Project) SetType(Type string) *Project {
	project.type_project = Type
	return project
}

func (project *Project) SetBDD(BDD BDD) *Project {
	project.bdd = BDD
	return project
}

func (project *Project) SetRestApi(RestApi RestApi) *Project {
	project.rest_api = RestApi
	return project
}

func (project *Project) SetWebApp(WebApp WebApp) *Project {
	project.web_app = WebApp
	return project
}

func (project *Project) SetSiteStatique(SiteStatique SiteStatique) *Project {
	project.site_statique = SiteStatique
	return project
}
