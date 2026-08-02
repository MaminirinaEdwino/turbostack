package entity

type webAppMaker struct {
	ProjectName string
	WebApp      WebApp
}

func (wap *webAppMaker) SetupArch() {
	folderList := []string{
		"src/views",
		"src/controller",
		"src/models",
	}
}

func (wap *webAppMaker) GenerateView() {}

func (wap *webAppMaker) WebAppGenerator() {
	wap.SetupArch()
}
