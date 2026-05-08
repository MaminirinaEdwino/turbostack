package entity

type Champs struct {
	Nom          string
	Type         string
	DefaultValue any
	Constraint   []any
}

func (c *Champs) GetNom() string  {
	return c.Nom
}

func (c *Champs) GetType() string {
	return c.Type
}

func (c *Champs) GetDefaultValue() any {
	return c.DefaultValue
}

func (c *Champs) GetConstraint() []any {
	return c.Constraint
}

func (c *Champs) SetNom(Nom string) {
	c.Nom = Nom
}

func (c *Champs) SetType(Type string) {
	c.Type = Type
}

func (c *Champs) SetDefaultValue(defaultValue any) {
	c.DefaultValue = defaultValue
}

func (c *Champs) SetContraint(constraint []any) {
	c.Constraint = constraint
}