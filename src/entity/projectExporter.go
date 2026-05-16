package entity

import "fmt"

func (mgr *ProjectManager) ExporterDB(Project Project) {
	fmt.Println("Database")
	fmt.Println(Project.GetBDD())
}

func (mgr *ProjectManager) ExporterAPI(Project Project) {
	fmt.Println("Rest APi")
	fmt.Println(Project.GetBDD())
	fmt.Println(Project.GetRestApi())
}
func (mgr *ProjectManager) ExporterStaticSite(Project Project) {
	fmt.Println("static site")
	fmt.Println(Project.GetSiteStatique())
}
func (mgr *ProjectManager) ExporterWebApp(Project Project) {
	fmt.Println("web app")
	fmt.Println(Project.GetBDD())
	fmt.Println(Project.GetBDD())
	fmt.Println(Project.GetWebApp())
}