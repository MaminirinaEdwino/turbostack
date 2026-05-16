package entity

import "fmt"

func (mgr *ProjectManager) ExporterDB(Project Project) {
	fmt.Println("Database")
}

func (mgr *ProjectManager) ExporterAPI(Project Project) {
	fmt.Println("Rest APi")
}
func (mgr *ProjectManager) ExporterStaticSite(Project Project) {
	fmt.Println("static site")
}
func (mgr *ProjectManager) ExporterWebApp(Project Project) {
	fmt.Println("web app")
}