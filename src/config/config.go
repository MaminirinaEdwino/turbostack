package config

import (
	"errors"
	"fmt"
	"os"
)

const PROJECT_DIR = "turbo_projects"

func CheckIfExist(chemin string) bool {
	info, err := os.Stat(chemin)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return false
		}
		return false
	}
	return info.IsDir()
}

func CheckCreateDir(path string){
	fmt.Println("check dir", path)
	filePath := fmt.Sprintf("%s/%s", PROJECT_DIR, path)
	if !CheckIfExist(filePath) {
		os.MkdirAll(filePath, os.ModePerm)
	}
}