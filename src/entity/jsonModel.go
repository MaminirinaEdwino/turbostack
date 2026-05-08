package entity

import "time"

type AbonnementJSON struct {
	Type_abonnement string    `json:"type_abonnement"`
	Debut           time.Time `json:"debut"`
	Fin             time.Time `json:"fin"`
}



type BDDJSON struct {
	Models []Model `json:"models"`
	Sgbd   string  `json:"sgbd"`
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
	Nom    string   `json:"nom"`
	Uri    string   `json:"uri"`
	Method string   `json:"method"`
	Model  []Model  `json:"model"`
	Params []string `json:"params"`
	Role   string   `json:"role"`
}

type ModelJSON struct {
	Nom       string   `json:"nom"`
	Attributs []Champs `json:"attributs"`
}

type PageJSON struct {
	Nom     string `json:"nom"`
	Contenu []any  `json:"contenu"`
}

type ProjectJSON struct {
	Nom          string       `json:"nom"`
	Type         string       `json:"type"`
	BDD          BDD          `json:"bdd"`
	RestApi      RestApi      `json:"rest_api"`
	WebApp       WebApp       `json:"web_app"`
	SiteStatique SiteStatique `json:"site_statique"`
}

type RestApiJSON struct {
	Endpoints []Endpoint `json:"endpoints"`
	Role      []string   `json:"role"`
	BDD       BDD        `json:"bdd"`
}

type SiteStatiqueJSON struct {
	Pages      []Page      `json:"pages"`
	Composants []Composant `json:"composants"`
}

type WebAppJSON struct {
	Pages     []Page      `json:"pages"`
	Role      []string    `json:"role"`
	Composant []Composant `json:"composant"`
	BDD       BDD         `json:"bdd"`
}