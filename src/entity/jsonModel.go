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
	Nom     string            `json:"nom"`
	Contenu []PageContentJSON `json:"content"`
	Params  []any             `json:"params"`
}

type EndpointJSON struct {
	Nom    string      `json:"nom"`
	Uri    string      `json:"uri"`
	Method string      `json:"method"`
	Model  []ModelJSON `json:"model"`
	Params []string    `json:"params"`
	Role   string      `json:"role"`
}

type ControllerJSON struct {
    Nom         string            `json:"nom"`
    PageCible   string            `json:"page_nom"`   // Nom de la PageJSON à laquelle il est lié
    Bindings    []DataBindingJSON `json:"bindings"`   // Les liaisons précises
}
type DataBindingJSON struct {
    IDElement   string `json:"id_element"`   // L'ID du bloc dans PageContentJSON (ex: "sep9h5o5a")
    EndpointNom string `json:"endpoint_nom"` // Le nom de l'EndpointJSON à appeler
    Trigger     string `json:"trigger"`      // "onLoad", "onClick", "onHover"
    Action      string `json:"action"`       // "fill_content", "set_style", "redirect"
    MapField    string `json:"map_field"`    // Champ du JSON API à mapper (ex: "data.title")
}

type ModelJSON struct {
	Nom       string       `json:"nom"`
	Attributs []ChampsJSON `json:"champs"`
}

type PageJSON struct {
	Nom     string            `json:"nom"`
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
	Pages       []PageJSON       `json:"pages"`
	Role        []string         `json:"role"`
	Composant   []ComposantJSON  `json:"composant"`
	BDD         BDDJSON          `json:"bdd"`
	Controllers []ControllerJSON `json:"controllers"`
}

type PageContentJSON struct {
	Id        string            `json:"id"`
	Tag       string            `json:"tag"`
	Content   string            `json:"content"`
	ClassName string            `json:"className"`
	Href      string            `json:"href"`
	Styles    string            `json:"styles"`
	Children  []PageContentJSON `json:"children"`
}

