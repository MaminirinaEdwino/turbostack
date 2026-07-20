package activation

import (
	"fmt"
	"os"
	"strconv"
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
	res, tokenErr := turbojwt.Verify("secret", string(tokenFile), 0)
	// nt, _ := turbojwt.Encode("secret", map[string]interface{}{"subscription": "pro"}, 0, 0)
	// SaveTokenToFile(nt)
	fval, _ := strconv.ParseFloat(fmt.Sprint(res["exp"]), 64)
	intVal := int64(fval)
	expTime := time.Unix(intVal, 0)
	iatfval, _ := strconv.ParseFloat(fmt.Sprint(res["iat"]), 64)
	iatintVal := int64(iatfval)
	iatTime := time.Unix(iatintVal, 0)
	dateLayout := "Monday 01 January 2006 at 15:04:05"

	fmt.Println(iatTime.Format(dateLayout))
	if tokenErr != nil {
		return map[string]interface{}{
			"subscription": res["subscription"],
			"exp":          expTime.Format(dateLayout),
			"iat":          iatTime.Format(dateLayout),
			"message":      "old subscription has expired",
			"expired":      "true",
		}
	}
	return map[string]interface{}{
		"subscription": res["subscription"],
		"exp":          expTime.Format(dateLayout),
		"iat":          iatTime.Format(dateLayout),
		"expired":      "false",
	}
}

func SaveTokenToFile(token string) {
	userDir, _ := os.UserHomeDir()
	tokenFile, _ := os.OpenFile(userDir+"/.turbostack/token", os.O_CREATE|os.O_TRUNC|os.O_RDWR, os.ModePerm)
	tokenFile.WriteString(token)
}
