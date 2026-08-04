package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/entity"
	webview "github.com/webview/webview_go"
)

type ProjectService struct {
	Manager *entity.ProjectManager
}

func (ps *ProjectService) Bind(w webview.WebView) {
	w.Bind("createProject", ps.CreateProject)
	w.Bind("fetchProjects", ps.FetchProjects)
	w.Bind("fetchByProjectName", ps.FetchProjectByName)
	w.Bind("saveProject", ps.SaveProject)
	w.Bind("saveBdd", ps.SaveProjectBDD)
	w.Bind("exportProject", ps.ExportProject)
	w.Bind("fetchProjectFiles", ps.FeychProjectFiles)
	w.Bind("getFileContent", ps.GetFileContent)
	w.Bind("getFolderForUpload", ps.FetchFolderForUpload)
	w.Bind("getImageAsBase64", ps.GetImageAsBase64)
	w.Bind("uploadAsset", ps.UploadAsset)
}

func (s *ProjectService) UploadAsset(projectName, fileName, base64file string) string {
	project := s.FetchProjectByName(projectName)
	project.Assets = append(project.Assets, entity.AssetJSON{
		FileName:    fileName,
		Base64Image: base64file,
	})
	s.Manager.SaveProject(project)
	return "success"
}

func (s *ProjectService) ExportProject(name, typeProject string) string {
	var pJson entity.ProjectJSON
	fmt.Println(typeProject)
	config.CheckCreateDir(name)
	pJson = s.FetchProjectByName(name)
	// fmt.Println(pJson)
	switch typeProject {
	case "api":
		config.CheckCreateDir(fmt.Sprintf("%s/api", name))
		s.Manager.ExporterAPI(pJson.ToModel())
	case "models":
		config.CheckCreateDir(fmt.Sprintf("%s/models", name))
		s.Manager.ExporterDB(pJson.ToModel())
	case "frontend":
		config.CheckCreateDir(fmt.Sprintf("%s/frontend", name))
		s.Manager.ExporterStaticSite(pJson.ToModel())
	case "full":
		config.CheckCreateDir(fmt.Sprintf("%s/webapp", name))
		s.Manager.ExporterWebApp(pJson.ToModel())
	}
	return "Success"
}

func (s *ProjectService) CreateProject(name, description, projectType string) string {
	pJson := entity.ProjectJSON{
		Nom:         name,
		Description: description,
		Type:        projectType,
	}
	if s.Manager.CheckIfExist(name) {
		return "Project already exists"
	}
	s.Manager.Create(pJson.ToModel())
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (s *ProjectService) SaveProject(name, project string) string {
	var pJson entity.ProjectJSON
	json.Unmarshal([]byte(project), &pJson)
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (s *ProjectService) SaveProjectBDD(name string, bddJson string) string {
	var bdd entity.BDDJSON
	pJson := s.Manager.LoadProject(name)
	json.Unmarshal([]byte(bddJson), &bdd)
	pJson.BDD = bdd
	pJson.Nom = name
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (mgr *ProjectService) FeychProjectFiles(name string) []entity.FileNode {
	file, _ := mgr.Manager.GetProjectFiles(name)
	return file
}

func (s *ProjectService) GetFileContent(projectName, path string) string {
	content, err := s.Manager.GetFileContent(projectName, path)
	if err != nil {
		return fmt.Sprintf("Erreur lors de la lecture du fichier : %v", err)
	}
	return content
}

func (s *ProjectService) FetchProjects() []entity.ProjectJSON {
	var projectList []entity.ProjectJSON

	for _, val := range s.Manager.Projects {
		projectList = append(projectList, val.ToJSON())
	}
	return projectList
}

func (s *ProjectService) FetchProjectByName(name string) entity.ProjectJSON {
	var pJson entity.ProjectJSON
	filePath := fmt.Sprintf("%s/%s.json", config.PROJECT_DIR, name)
	file, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println(err)
	}
	json.Unmarshal(file, &pJson)
	return pJson
}

func (s *ProjectService) FetchFolderForUpload(folder string) []entity.FileNode {
	var dirPath string
	var nodes []entity.FileNode
	if folder == "" {
		dirPath, _ = os.UserHomeDir()
	} else {
		dirPath = folder
	}
	fmt.Println(dirPath)
	dir, err := os.ReadDir(dirPath)
	if os.IsNotExist(err) {
		return []entity.FileNode{}
	}
	for _, entry := range dir {
		info, err := entry.Info()

		if err != nil {
			continue
		}

		if entry.IsDir() && strings.Split(entry.Name(), "")[0] == "." && entry.Name() != ".turbostack" {
			continue
		}

		if !entry.IsDir() && strings.Split(entry.Name(), "")[0] == "." {
			continue
		}

		if !entry.IsDir() {
			if strings.Contains(entry.Name(), ".pdf") || strings.Contains(entry.Name(), ".rar") || strings.Contains(entry.Name(), ".docx") || strings.Contains(entry.Name(), ".doc") || strings.Contains(entry.Name(), ".txt") || strings.Contains(entry.Name(), ".ase") || strings.Contains(entry.Name(), ".tmp") || strings.Contains(entry.Name(), ".pixi") || strings.Contains(entry.Name(), ".odt") || strings.Contains(entry.Name(), ".sh") || strings.Contains(entry.Name(), ".md") || strings.Contains(entry.Name(), ".db") || strings.Contains(entry.Name(), ".amgp") || strings.Contains(entry.Name(), ".zip") || strings.Contains(entry.Name(), ".json") {
				continue
			}
		}
		node := entity.FileNode{
			Name:  entry.Name(),
			Path:  filepath.Join(dirPath, entry.Name()),
			IsDir: entry.IsDir(),
			Size:  info.Size(),
		}
		nodes = append(nodes, node)
	}
	return nodes
}

func (s *ProjectService) GetImageAsBase64(path string) (string, error) {
	bytes, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	var mimeType string
	switch filepath.Ext(path) {
	case ".jpg", ".jpeg":
		mimeType = "image/jpeg"
	case ".png":
		mimeType = "image/png"
	case ".mp4":
		mimeType = "video/mp4"
	default:
		mimeType = "application/octet-stream"
	}

	encoded := base64.StdEncoding.EncodeToString(bytes)
	return fmt.Sprintf("data:%s;base64,%s", mimeType, encoded), nil
}
