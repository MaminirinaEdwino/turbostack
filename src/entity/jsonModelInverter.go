package entity

func (aj *AbonnementJSON) ToModel() Abonnement {
	return Abonnement{
		type_abonnement: aj.Type_abonnement,
		debut:           aj.Debut,
		fin:             aj.Fin,
	}
}

func (cj *ChampsJSON) ToModel() Champs {
	return Champs{
		nom:           cj.Nom,
		type_champs:   cj.Type,
		default_value: cj.DefaultValue,
		constraint:    cj.Constraint,
	}
}

func (cj *ComposantJSON) ToModel() Composant {
	var composant []pageContent
	for _, val :=range cj.Contenu{
		composant = append(composant, val.ToModel())
	}
	return Composant{
		nom:     cj.Nom,
		contenu: composant,
		params:  cj.Params,
	}
}

func (ej *EndpointJSON) ToModel() Endpoint {
	var model []Model
	for _, val := range ej.Model {
		model = append(model, val.ToModel())
	}
	return Endpoint{
		nom:    ej.Nom,
		uri:    ej.Uri,
		method: ej.Method,
		model:  model,
		params: ej.Params,
		role:   ej.Role,
	}
}

func (mj *ModelJSON) ToModel() Model {
	var attr []Champs
	for _, val := range mj.Attributs {
		attr = append(attr, val.ToModel())
	}
	return Model{
		nom:       mj.Nom,
		attributs: attr,
	}
}

func (pj *PageJSON) ToModel() Page {
	var pcontent []pageContent
	for _, val := range pj.Contenu {
		pcontent = append(pcontent, val.ToModel())
	}
	
	return Page{
		nom:     pj.Nom,
		contenu: pcontent,
	}
}

func (bddjson *BDDJSON) ToModel() BDD {
	var dbModel []Model
	for _, val := range bddjson.Models {
		dbModel = append(dbModel, val.ToModel())
	}
	return BDD{
		sgbd:   bddjson.Sgbd,
		models: dbModel,
	}
}

func (pj *ProjectJSON) ToModel() Project {
	return Project{
		nom:           pj.Nom,
		type_project:  pj.Type,
		description:   pj.Description,
		bdd:           pj.BDD.ToModel(),
		rest_api:      pj.RestApi.ToModel(),
		web_app:       pj.WebApp.ToModel(),
		site_statique: pj.SiteStatique.ToModel(),
	}
}

func (rj *RestApiJSON) ToModel() RestApi {
	var endpoints []Endpoint

	for _, val := range rj.Endpoints {
		endpoints = append(endpoints, val.ToModel())
	}
	return RestApi{
		endpoints: endpoints,
		role:      rj.Role,
		bdd:       rj.BDD.ToModel(),
	}
}

func (sj *SiteStatiqueJSON) ToModel() SiteStatique {
	var pages []Page
	var composants []Composant
	for _, val := range sj.Pages {
		pages = append(pages, val.ToModel())
	}
	for _, val := range sj.Composants {
		composants = append(composants, val.ToModel())
	}
	return SiteStatique{
		pages:      pages,
		composants: composants,
	}
}

func (wj *WebAppJSON) ToModel() WebApp {
	var pages []Page
	var composants []Composant
	for _, val := range wj.Pages {
		pages = append(pages, val.ToModel())
	}
	for _, val := range wj.Composant {
		composants = append(composants, val.ToModel())
	}
	return WebApp{
		pages:     pages,
		role:      wj.Role,
		composant: composants,
	}
}


func (pc *PageContentJSON) ToModel() pageContent {
	var children []pageContent
	for _, val := range pc.Children {
		children = append(children, val.ToModel())
	}

	return pageContent{
		id:        pc.Id,
		tag:       pc.Tag,
		content:   pc.Content,
		className: pc.ClassName,
		href:      pc.Href,
		styles:    pc.Styles,
		children:  children,
	}
}