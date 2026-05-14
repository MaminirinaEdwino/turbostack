package entity

type pageContent struct {
	id        string
	tag       string
	content   string
	className string
}

func (p *pageContent) GetId() string {
	return p.id
}

func (p *pageContent) SetId(id string) {
	p.id = id
}

func (p *pageContent) GetTag() string {
	return p.tag
}

func (p *pageContent) SetTag(tag string) {
	p.tag = tag
}

func (p *pageContent) GetContent() string {
	return p.content
}

func (p *pageContent) SetContent(content string) {
	p.content = content
}

func (p *pageContent) GetClassName() string {
	return p.className
}

func (p *pageContent) SetClassName(className string) {
	p.className = className
}

func (p *pageContent) ToJSON() PageContentJSON {
	return PageContentJSON{
		Id: p.id,
		Tag: p.tag,
		Content: p.content,
	}
}
