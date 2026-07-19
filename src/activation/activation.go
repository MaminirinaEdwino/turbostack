package activation

import (
	"fmt"
	"os"
	"time"

	turbojwt "github.com/MaminirinaEdwino/turbostack/src/TurboJwt"
	"github.com/MaminirinaEdwino/turbostack/src/utils"
)

func CheckActivationToken() map[string]interface{} {
	userDir, err := os.UserHomeDir()
	utils.ErrorChecker(err)

	tokenFile, err := os.ReadFile(userDir + "/.turbostack/token")

	if err != nil && os.IsNotExist(err) {
		fmt.Println(err)
		os.MkdirAll(userDir+"/.turbostack", os.ModePerm)
		file, _ := os.Create(userDir + "/.turbostack/token")
		defer file.Close()
		token, _ := turbojwt.Encode("secret", map[string]any{
			"subscription": "free",
		}, 10, 0)
		file.Write([]byte(token))
	}
	res, _ := turbojwt.Verify("secret", string(tokenFile), 0)
	fmt.Println(res)
	fmt.Println(time.Now().Format("1-06"))
	res["exp"] = time.Now().Unix()
	return res
}

func SaveTokenToFile(token string) {
	userDir, _ := os.UserHomeDir()
	tokenFile, _ := os.OpenFile(userDir+"/.turbostack/token", os.O_CREATE|os.O_TRUNC|os.O_RDWR, os.ModePerm)
	tokenFile.WriteString(token)
}
