package entity

import "time"

type AbonnementJSON struct {
	Type_abonnement string    `json:"type_abonnement"`
	Debut           time.Time `json:"debut"`
	Fin             time.Time `json:"fin"`
}

type BDDJSON struct {
	Models []ModelJSON `json:"models"`
	Sgbd   string      `json:"sgbd"`
}

type ChampsJSON struct {
	Nom          string `json:"nom"`
	Type         string `json:"type"`
	DefaultValue any    `json:"default_value"`
	Constraint   []any  `json:"constraint"`
}

type ComposantJSON struct {
	Nom     string `json:"nom"`
	Contenu []any  `json:"contenu"`
	Params  []any  `json:"params"`
}

type EndpointJSON struct {
	Nom    string      `json:"nom"`
	Uri    string      `json:"uri"`
	Method string      `json:"method"`
	Model  []ModelJSON `json:"model"`
	Params []string    `json:"params"`
	Role   string      `json:"role"`
}

type ModelJSON struct {
	Nom       string       `json:"nom"`
	Attributs []ChampsJSON `json:"champs"`
}

type PageJSON struct {
	Nom     string   `json:"nom"`
	Contenu []PageContentJSON `json:"content"`
}

type ProjectJSON struct {
	Nom          string           `json:"nom"`
	Type         string           `json:"type"`
	BDD          BDDJSON          `json:"bdd"`
	RestApi      RestApiJSON      `json:"rest_api"`
	WebApp       WebAppJSON       `json:"web_app"`
	SiteStatique SiteStatiqueJSON `json:"site_statique"`
	Description  string           `json:"description"`
}

type RestApiJSON struct {
	Endpoints []EndpointJSON `json:"endpoints"`
	Role      []string       `json:"role"`
	BDD       BDDJSON        `json:"bdd"`
}

type SiteStatiqueJSON struct {
	Pages      []PageJSON      `json:"pages"`
	Composants []ComposantJSON `json:"composants"`
}

type WebAppJSON struct {
	Pages     []PageJSON      `json:"pages"`
	Role      []string        `json:"role"`
	Composant []ComposantJSON `json:"composant"`
	BDD       BDDJSON         `json:"bdd"`
}

type PageContentJSON struct {
	Id        string `json:"id"`
	Tag       string `json:"tag"`
	Content   string `json:"content"`
	ClassName string `json:"class_name="`
}

