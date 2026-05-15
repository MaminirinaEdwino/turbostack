import { Box, Heading1, Heading2, ImageIcon, Link, Pilcrow, Square } from "lucide-react";

export const STYLE_CONTROLS = [
    { label: "Texte", prop: "color", type: "color" },
    { label: "Taille", prop: "font-size", type: "number", placeholder: "e.g. 16" },
    { label: "Align", prop: "text-align", type: "select", options: ["left", "center", "right", "justify"] },
    { label: "Gras", prop: "font-weight", type: "select", options: ["normal", "bold", "100", "300", "500", "700", "900"] },
    { label: "Fond", prop: "background-color", type: "color" },
    { label: "Padding", prop: "padding", type: "number", placeholder: "e.g. 10" },
    { label: "Marge", prop: "margin", type: "number", placeholder: "e.g. 0" },
    { label: "Arrondi", prop: "border-radius", type: "number", placeholder: "e.g. 8" },
    { label: "Largeur", prop: "width", type: "number", placeholder: "100" },
    { label: "Hauteur", prop: "height", type: "number", placeholder: "auto" },
    { label: "Display", prop: "display", type: "select", options: ["block", "inline-block", "flex", "grid", "none"] },
    { label: "Flex dir", prop: "flex-direction", type: "select", options: ["vertical", "horizontal"] },
];

export const BLOCK_TYPES = [
    { label: "Section", tag: "div", icon: <Box size={14} />, defaultContent: "Conteneur vide" },
    { label: "Titre 1", tag: "h1", icon: <Heading1 size={14} />, defaultContent: "Titre principal" },
    { label: "Titre 2", tag: "h2", icon: <Heading2 size={14} />, defaultContent: "Sous-titre" },
    { label: "Paragraphe", tag: "p", icon: <Pilcrow size={14} />, defaultContent: "Votre texte ici..." },
    { label: "Lien", tag: "a", icon: <Link size={14} />, defaultContent: "Cliquez ici", defaultHref: "/" },
    { label: "Image", tag: "img", icon: <ImageIcon size={14} />, defaultContent: "https://via.placeholder.com/800x400" },
    { label: "Bouton", tag: "button", icon: <Square size={14} />, defaultContent: "Cliquez ici" },
];

export const TAG_STYLE_GROUPS = {
    h1: ["color", "font-size", "text-align", "font-weight", "margin"],
    h2: ["color", "font-size", "text-align", "font-weight", "margin"],
    p: ["color", "font-size", "text-align", "margin"],
    a: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius"],
    button: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius", "margin"],
    div: ["background-color", "padding", "margin", "border-radius", "width", "height", "display", "flex-direction"],
    img: ["width", "height", "border-radius", "margin", "display"],
    page: ["color", "font-size", "background-color", "padding", "margin"],
    generic: ["color", "font-size", "text-align", "font-weight", "background-color", "padding", "margin", "border-radius", "width", "height", "display"]
};