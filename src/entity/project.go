package entity

type Project struct {
	Nom          string
	Type         string
	BDD          BDD
	RestApi      RestApi
	WebApp       WebApp
	SiteStatique SiteStatique
}

func (project *Project) GetNom() string {
	return project.Nom
}

func (project *Project) GetType() string {
	return project.Type
}

func (project *Project) GetBDD() BDD {
	return project.BDD
}

func (project *Project) GetRestApi() RestApi {
	return project.RestApi
}

func (project *Project) GetWebApp() WebApp {
	return project.WebApp
}

func (project *Project) GetSiteStatique() SiteStatique {
	return project.SiteStatique
}

func (project *Project) SetNom(Nom string) *Project {
	project.Nom = Nom
	return project
}

func (project *Project) SetType(Type string) *Project {
	project.Type = Type
	return project
}

func (project *Project) SetBDD(BDD BDD) *Project {
	project.BDD = BDD
	return project
}

func (project *Project) SetRestApi(RestApi RestApi) *Project {
	project.RestApi = RestApi
	return project
}

func (project *Project) SetWebApp(WebApp WebApp) *Project {
	project.WebApp = WebApp
	return project
}

func (project *Project) SetSiteStatique(SiteStatique SiteStatique) *Project {
	project.SiteStatique = SiteStatique
	return project
}
