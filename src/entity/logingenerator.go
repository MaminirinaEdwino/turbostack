package entity

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func WriteTurboJWTCode() string {
	return `package controllers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// base64Encode allow to generate base64.URLEncoding
func base64Encode(data []byte) string {
	return base64.RawURLEncoding.EncodeToString(data)
}

// generateHmac generate a hashed data for the jwt signature
func generateHmac(secret string, unsignedToken string) string {
	key := []byte(secret)
	h := hmac.New(sha256.New, key)
	h.Write([]byte(unsignedToken))
	return base64Encode(h.Sum(nil))
}


func Encode(secret string, payload map[string]interface{}, exp float64, nbf float64) (string, error) {
	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}
	expiration := time.Now().Add(time.Hour * time.Duration(exp)).Unix()
	iat := time.Now().Unix()

	payload["exp"] = expiration
	payload["iat"] = iat
	if nbf > 0 {
		notBefore := time.Now().Add(time.Minute * time.Duration(nbf)).Unix()
		payload["nbf"] = notBefore
	}
	headerJson, _ := json.Marshal(header)
	encodedHeader := base64Encode(headerJson)
	payloadJson, _ := json.Marshal(payload)
	encodedPayload := base64Encode(payloadJson)
	unsignedToken := encodedHeader + "." + encodedPayload
	key := []byte(secret)
	h := hmac.New(sha256.New, key)
	h.Write([]byte(unsignedToken))
	signature := base64Encode(h.Sum(nil))
	return unsignedToken + "." + signature, nil
}


func Verify(secret string, token string, leeway float64) (map[string]any, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("Invalide Token")
	}

	unsignedPart := parts[0] + "." + parts[1]
	signature := generateHmac(secret, unsignedPart)

	if !hmac.Equal([]byte(signature), []byte(parts[2])) {
		return nil, fmt.Errorf("Invalide signature.")
	}
	payloadPart, _ := base64.RawURLEncoding.DecodeString(parts[1])
	var payload map[string]any
	if err := json.Unmarshal(payloadPart, &payload); err != nil {
		return nil, err
	}
	exp, ok := payload["exp"].(float64)
	if !ok {
		return nil, fmt.Errorf("Invalide token, missing exp time")
	}
	if time.Now().Unix() > int64(exp) {
		return nil, fmt.Errorf("Expired Token")
	}
	now := time.Now().Unix()
	leewaySec := int64(time.Duration(leeway).Seconds())

	if exp, ok := payload["exp"].(float64); ok {
		if now > (int64(exp) + leewaySec) {
			return nil, fmt.Errorf("Expired token")
		}
	}

	if val, ok := payload["nbf"]; ok {
		nbf, ok := val.(float64)
		if !ok {
			return nil, fmt.Errorf("Token not yet active")
		}
		if time.Now().Unix() < (int64(nbf) - leewaySec) {
			return nil, fmt.Errorf("Inactive token")
		}
	}
	return payload, nil
}
`
}
func GenerateWebSessionMiddleware(projectPath string) error {
	dirPath := fmt.Sprintf("%s/src/middlewares", projectPath)
	os.MkdirAll(dirPath, 0755)
	filePath := fmt.Sprintf("%s/src/middlewares/session.go", projectPath)

	code := `package middlewares

import (
	"context"
	"net/http"
)

type contextKey string
const SessionUserKey contextKey = "session_user"

// RequireSession vérifie si l'utilisateur possède un cookie de session valide
func RequireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_user")
		if err != nil || cookie.Value == "" {
			// Rediriger vers la page de login si non authentifié
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		// Injecter le nom d'utilisateur / session dans le contexte
		ctx := context.WithValue(r.Context(), SessionUserKey, cookie.Value)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
`
	return os.WriteFile(filePath, []byte(code), 0644)
}

func GenerateApiAuthMiddleware(projectPath, projectName string) error {
	dirPath := fmt.Sprintf("%s/src/middlewares", projectPath)
	os.MkdirAll(dirPath, 0755)
	filePath := fmt.Sprintf("%s/src/middlewares/auth.go", projectPath)

	code := `package middlewares

import (
	"context"
	"net/http"
	"strings"
	"%s/src/controllers"
	// "github.com/vites/turbojwt" // Ton package turbojwt
)

const JwtSecret = "turbostack_super_secret_key"

// ContextKey pour stocker les infos utilisateur dans la requête
type contextKey string
const UserContextKey contextKey = "user"

func AuthMiddleware(requiredRole string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Authorization header missing", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
				return
			}

			tokenStr := parts[1]

			// Décoder et valider le token avec turbojwt
			claims, err := controllers.Verify(JwtSecret, tokenStr, 0)
			if err != nil {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			// Vérification optionnelle du rôle si requis
			if requiredRole != "" {
				role, ok := claims["role"].(string)
				if !ok || role != requiredRole {
					http.Error(w, "Access forbidden: insufficient rights", http.StatusForbidden)
					return
				}
			}

			// Injecter les claims dans le contexte de la requête
			ctx := context.WithValue(r.Context(), UserContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
`
	return os.WriteFile(filePath, []byte(fmt.Sprintf(code, projectName)), 0644)
}

func FindUserModel(models []Model) (Model, bool) {
	for _, model := range models {
		nameLower := strings.ToLower(model.GetNom())
		if strings.Contains(nameLower, "user") || strings.Contains(nameLower, "utilisateur") {
			// Vérifier la présence des champs requis (rôle et mot de passe)
			hasRole := false
			hasPassword := false
			for _, field := range model.GetAttributs() {
				fName := strings.ToLower(field.GetNom())
				if fName == "role" {
					hasRole = true
				}
				if fName == "password" || fName == "mot_de_passe" || fName == "motdepasse" {
					hasPassword = true
				}
			}
			if hasRole && hasPassword {
				return model, true
			}
		}
	}
	return Model{}, false
}

func GenerateAuthController(projectPath string, userModel Model, projectName string) error {
	tableName := strings.ToLower(userModel.GetNom())
	filePath := fmt.Sprintf("%s/src/controllers/auth_controller.go", projectPath)
	turboPath := fmt.Sprintf("%s/src/controllers/turbojwt.go", projectPath)

	fmt.Println(filePath)
	var sb strings.Builder

	sb.WriteString("package controllers\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"database/sql\"\n")
	sb.WriteString("\t\"encoding/json\"\n")
	sb.WriteString("\t\"net/http\"\n")
	sb.WriteString(fmt.Sprintf("\t\"%s/src/config\"\n", strings.ReplaceAll(projectName, " ", "_"))) // Remplace selon ton module

	sb.WriteString(")\n\n")

	sb.WriteString("const JwtSecret = \"turbostack_super_secret_key\"\n\n")

	// --- 1. REGISTER ---
	sb.WriteString("func Register(w http.ResponseWriter, r *http.Request) {\n")
	sb.WriteString("\tif r.Method != http.MethodPost {\n")
	sb.WriteString("\t\thttp.Error(w, \"Method not allowed\", http.StatusMethodNotAllowed)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	// Struct dynamique basée sur les champs du modèle user
	sb.WriteString("\tvar creds struct {\n")
	var insertCols []string
	var insertVals []string
	var scanArgs []string

	for _, field := range userModel.GetAttributs() {
		fName := strings.ToLower(field.GetNom())
		if fName == "id" {
			continue // L'ID est souvent auto-incrémenté
		}

		goType := "string"
		if field.GetType() == "int" || field.GetType() == "integer" {
			goType = "int"
		}

		sb.WriteString(fmt.Sprintf("\t\t%s %s `json:\"%s\"`\n", capitalize(field.GetNom()), goType, fName))
		insertCols = append(insertCols, fName)
		insertVals = append(insertVals, fmt.Sprintf("$%d", len(insertCols)))
		scanArgs = append(scanArgs, fmt.Sprintf("creds.%s", capitalize(field.GetNom())))
	}
	sb.WriteString("\t}\n\n")

	sb.WriteString("\tif err := json.NewDecoder(r.Body).Decode(&creds); err != nil {\n")
	sb.WriteString("\t\thttp.Error(w, \"Invalid body\", http.StatusBadRequest)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	// Requête SQL dynamique d'insertion
	queryInsert := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, strings.Join(insertCols, ", "), strings.Join(insertVals, ", "))
	sb.WriteString(fmt.Sprintf("\t_, err := config.DB.Exec(\"%s\", %s)\n", queryInsert, strings.Join(scanArgs, ", ")))
	sb.WriteString("\tif err != nil {\n")
	sb.WriteString("\t\thttp.Error(w, \"User already exists or error: \"+err.Error(), http.StatusBadRequest)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	sb.WriteString("\tw.Header().Set(\"Content-Type\", \"application/json\")\n")
	sb.WriteString("\tjson.NewEncoder(w).Encode(map[string]string{\"message\": \"User registered successfully\"})\n")
	sb.WriteString("}\n\n")

	// --- 2. LOGIN (User) ---
	sb.WriteString(generateLoginHandler("Login", tableName, "user"))
	sb.WriteString("\n")

	// --- 3. LOGIN ADMIN ---
	sb.WriteString(generateLoginHandler("LoginAdmin", tableName, "admin"))

	os.WriteFile(turboPath, []byte(WriteTurboJWTCode()), 0644)
	return os.WriteFile(filePath, []byte(sb.String()), 0644)
}

// Fonction auxiliaire pour générer Login ou LoginAdmin
func generateLoginHandler(funcName, tableName, targetRole string) string {
	return fmt.Sprintf(`func %s(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds struct {
		Username string `+"`json:\"username\"`"+`
		Password string `+"`json:\"password\"`"+`
	}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	var userID int
	err := config.DB.QueryRow("SELECT id FROM %s WHERE username = $1 AND password = $2 AND role = '%s'", creds.Username, creds.Password).Scan(&userID)
	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := Encode(JwtSecret, map[string]any{
		"user_id":  userID,
		"username": creds.Username,
		"role":     "%s",
	}, 24, 0)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
`, funcName, tableName, targetRole, targetRole)
}

func capitalize(s string) string {
	if len(s) == 0 {
		return ""
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

func GenerateAuthApiControllers(projectPath string, userModel Model) error {
	code := `package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"
	"mon_api/src/config"
	"golang.org/x/crypto/bcrypt"
)

// DTOs
type LoginRequest struct {
	Email    string ` + "`json:\"email\"`" + `
	Password string ` + "`json:\"password\"`" + `
}

type TokenResponse struct {
	AccessToken  string ` + "`json:\"access_token\"`" + `
	RefreshToken string ` + "`json:\"refresh_token\"`" + `
}

func Register(w http.ResponseWriter, r *http.Request) {
	// Logique d'inscription : hachage du mot de passe et insertion
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Utilisateur enregistré avec succès"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	// 1. Vérifier les credentials en base
	// 2. Générer le JWT Access Token et le Refresh Token via turbojwt
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(TokenResponse{
		AccessToken:  "jwt_access_token_exemple",
		RefreshToken: "jwt_refresh_token_exemple",
	})
}

func RefreshToken(w http.ResponseWriter, r *http.Request) {
	// Valider le refresh token et renvoyer un nouvel access token
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"access_token": "nouveau_jwt_access_token",
	})
}
`
	// Écrire le fichier controllers/auth_controller.go
	return os.WriteFile(filepath.Join(projectPath, "src", "controllers", "auth_controller.go"), []byte(code), 0644)
}
func GenerateWebAuthController(projectPath string, userModel Model, projecName string) error {
	tableName := strings.ToLower(userModel.GetNom())
	filePath := fmt.Sprintf("%s/src/controller/auth_controller.go", projectPath)
	fmt.Println(filePath)
	var sb strings.Builder

	sb.WriteString("package controller\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"database/sql\"\n")
	sb.WriteString("\t\"net/http\"\n")
	// sb.WriteString("\t\"strconv\"\n")
	sb.WriteString("\t\"time\"\n")
	sb.WriteString(fmt.Sprintf("\t\"%s/src/config\"\n", strings.ReplaceAll(projecName, " ", "_")))
	sb.WriteString(")\n\n")

	// --- 1. WEB REGISTER (Traitement des données du formulaire HTML) ---
	sb.WriteString("func WebRegister(w http.ResponseWriter, r *http.Request) {\n")
	sb.WriteString("\tif r.Method != http.MethodPost {\n")
	sb.WriteString("\t\thttp.Error(w, \"Method not allowed\", http.StatusMethodNotAllowed)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	sb.WriteString("\tif err := r.ParseForm(); err != nil {\n")
	sb.WriteString("\t\thttp.Error(w, \"Invalid form data\", http.StatusBadRequest)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	var insertCols []string
	var insertVals []string
	var scanArgs []string

	for _, field := range userModel.GetAttributs() {
		fName := strings.ToLower(field.GetNom())
		if fName == "id" || fName == "role" {
			continue
		}

		// Gestion du type de champ pour la récupération du formulaire
		if field.GetType() == "int" || field.GetType() == "integer" {
			sb.WriteString(fmt.Sprintf("\t%sStr := r.FormValue(\"%s\")\n", fName, fName))
			sb.WriteString(fmt.Sprintf("\t%s, _ := strconv.Atoi(%sStr)\n", fName, fName))
		} else {
			sb.WriteString(fmt.Sprintf("\t%s := r.FormValue(\"%s\")\n", fName, fName))
		}

		insertCols = append(insertCols, fName)
		insertVals = append(insertVals, fmt.Sprintf("$%d", len(insertCols)))
		scanArgs = append(scanArgs, fName)
	}
	sb.WriteString("\n")

	queryInsert := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, strings.Join(insertCols, ", "), strings.Join(insertVals, ", "))
	sb.WriteString(fmt.Sprintf("\t_, err := config.DB.Exec(\"%s\", %s)\n", queryInsert, strings.Join(scanArgs, ", ")))
	sb.WriteString("\tif err != nil {\n")
	sb.WriteString("\t\thttp.Error(w, \"User already exists or error: \"+err.Error(), http.StatusBadRequest)\n")
	sb.WriteString("\t\treturn\n")
	sb.WriteString("\t}\n\n")

	sb.WriteString("\thttp.Redirect(w, r, \"/login\", http.StatusSeeOther)\n")
	sb.WriteString("}\n\n")

	// --- 2. WEB LOGIN (Traitement du formulaire de connexion) ---
	sb.WriteString(fmt.Sprintf(`func WebLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "Invalid form data", http.StatusBadRequest)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	var userID int
	err := config.DB.QueryRow("SELECT id FROM %s WHERE username = $1 AND password = $2", username, password).Scan(&userID)
	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Création d'un cookie de session HTTP sécurisé
	cookie := http.Cookie{
		Name:     "session_user",
		Value:    username,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, &cookie)

	// Redirection vers le tableau de bord après connexion réussie
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}
`, tableName))

	sb.WriteString("\n")

	// --- 3. WEB LOGOUT (Suppression du cookie) ---
	sb.WriteString(`func WebLogout(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{
		Name:     "session_user",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}
`)

	return os.WriteFile(filePath, []byte(sb.String()), 0644)
}
