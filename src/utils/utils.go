package utils

import "fmt"

func WriteErrorCheker(message string) string {
	return fmt.Sprintf("if err != nil {\nfmt.Println(\"%s\", err)\n}", message)
}

func ErrorChecker(err error) {
	if err != nil {
		panic(err)
	}
}