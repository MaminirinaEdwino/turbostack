package entity

func (bddjson *BDDJSON) ToModel() BDD {
	var bdd BDD
	bdd.sgbd = bddjson.Sgbd
	bdd.models = bddjson.Models
	return bdd
}

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
	return Composant{
		nom:     cj.Nom,
		contenu: cj.Contenu,
		params:  cj.Params,
	}
}

func (ej *EndpointJSON) ToModel() Endpoint {
	return Endpoint{
		nom:    ej.Nom,
		uri:    ej.Uri,
		method: ej.Method,
		model:  ej.Model,
		params: ej.Params,
		role:   ej.Role,
	}
}

func (mj *ModelJSON) ToModel() Model {
	return Model{
		nom:       mj.Nom,
		attributs: mj.Attributs,
	}
}

func (pj *PageJSON) ToModel() Page {
	return Page{
		nom:     pj.Nom,
		contenu: pj.Contenu,
	}
}

func (pj *ProjectJSON) ToModel() Project {
	return Project{
		nom:           pj.Nom,
		type_project:  pj.Type,
		bdd:           pj.BDD,
		rest_api:      pj.RestApi,
		web_app:       pj.WebApp,
		site_statique: pj.SiteStatique,
	}
}

func (rj *RestApiJSON) ToModel() RestApi {
	return RestApi{
		endpoints: rj.Endpoints,
		role:      rj.Role,
		bdd:       rj.BDD,
	}
}

func (sj *SiteStatiqueJSON) ToModel() SiteStatique {
	return SiteStatique{
		pages:      sj.Pages,
		composants: sj.Composants,
	}
}

func (wj *WebAppJSON) ToModel() WebApp {
	return WebApp{
		pages:     wj.Pages,
		role:      wj.Role,
		composant: wj.Composant,
		bdd:       wj.BDD,
	}
}
