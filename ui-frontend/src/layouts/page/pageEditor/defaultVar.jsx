import { Box, Form, FormInput, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Image, ImageIcon, Link, Pilcrow, Square, Text, VideoIcon, SlidersHorizontalIcon, SquareIcon, StepForward, BoxIcon, WallpaperIcon, LocateFixed, Scroll, Container, Fullscreen, LocateIcon, Maximize, Eye, EyeClosed } from "lucide-react";
import { BsTextarea, BsDisplay, BsBorder, BsBorderOuter } from "react-icons/bs";
import { GrInProgress, GrFlows, GrLocation } from "react-icons/gr";
import { FcAutomatic } from "react-icons/fc";
import { FaScroll } from "react-icons/fa";
import { PiEmptyFill } from "react-icons/pi";
import { GoScreenFull } from "react-icons/go";
import { CiTextAlignCenter, CiTextAlignJustify, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci";
import { BiDownArrow, BiLeftArrow, BiRightArrow } from "react-icons/bi";

const sizeDistUnit = ["px", "em", "rem", "cm", "vh", "vw", "%"]

export const STYLE_CONTROLS = [
    { grid: "grid-1-3", label: "Text-color", prop: "color", type: "color", group: "text", conditions: [] },
    { grid: "grid-3-5", conditions: [], label: "font-size", prop: "font-size", type: "number", placeholder: "e.g. 16", group: "text", unite: ["px", "em", "rem", "cm", "%"] },
    {
        conditions: [], label: "text-align", prop: "text-align", type: "select", options: ["left", "center", "right", "justify"], group: "text", optionIcon: [
            <CiTextAlignLeft size={14}></CiTextAlignLeft>,
            <CiTextAlignCenter size={14}></CiTextAlignCenter>,
            <CiTextAlignRight size={14}></CiTextAlignRight>,
            <CiTextAlignJustify size={14}></CiTextAlignJustify>,
        ], buttoned: true, grid: "grid-1-5"
    },
    { grid: "grid-1-3", conditions: [], label: "font-weight", prop: "font-weight", type: "select", options: ["normal", "bold", "100", "300", "500", "700", "900"], group: "text" },

    { reset: "0", conditions: [], group: "sizing", label: "Padding", prop: "padding", type: "number", placeholder: "e.g. 10", unite: ["px", "em", "rem", "cm", "%"] },
    { reset: "0", conditions: [], group: "sizing", label: "Margin", prop: "margin", type: "number", placeholder: "e.g. 0", unite: ["px", "em", "rem", "cm", "%"] },
    { grid: "grid-1-2", reset: "0", conditions: [], group: "sizing", label: "Width", prop: "width", type: "number", placeholder: "100", unite: sizeDistUnit },
    {
        grid: "grid-2-5", conditions: [], label: "Preset", prop: "width", type: "select", buttoned: true, group: "sizing", options: [
            "auto",
            "fit-content"
        ],
        optionIcon: [
            <Maximize size={14}></Maximize>,
            <Fullscreen size={14}></Fullscreen>
        ]
    },
    { grid: "grid-1-2", reset: "0", conditions: [], group: "sizing", label: "Height", prop: "height", type: "number", placeholder: "auto", unite: sizeDistUnit },
    {
        grid: "grid-2-5", conditions: [], label: "Preset", prop: "height", type: "select", buttoned: true, group: "sizing", options: [
            "auto",
            "fit-content"
        ],
        optionIcon: [
            <Maximize size={14}></Maximize>,
            <Fullscreen size={14}></Fullscreen>
        ]
    },
    { conditions: [], group: "display", label: "Display", prop: "display", type: "select", options: ["block", "inline-block", "flex", "grid", "none"], grid: "grid-1-5" },
    { group: "display", label: "Flex dir", prop: "flex-direction", type: "select", options: ["row", "column", "row-wrap", "column-wrap"], conditions: ["display", "flex"], grid: "grid-1-3" },
    { group: "display", label: "Flex gap", prop: "gap", type: "number", conditions: ["display", "flex"], unite: ["px", "em", "rem", "cm", "%"], grid: "grid-3-5" },
    { group: "display", label: "Justify-content", prop: "justify-content", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end", "space-between", "space-around", "space-evenly", "stretch"], grid: "grid-1-5" },
    { group: "display", label: "Align-content", prop: "align-content", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end"], grid: "grid-1-5" },
    { group: "display", label: "Align-items", prop: "align-items", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end"], grid: "grid-1-5" },
    { conditions: [], group: "animation", label: "Animation delay", prop: "animation-delay", type: "number", unite: ["s", "ms"] },
    { conditions: [], group: "animation", label: "animation-direction", prop: "animation-direction", type: "select", options: ["normal", "alternate"] },
    { conditions: [], group: "animation", label: "Animation duration", prop: "animation-duration", type: "number", unite: ["s"] },
    { conditions: [], group: "animation", label: "animation-iteration-count", prop: "animation-iteration-count", type: "number" },
    { conditions: [], group: "animation", label: "animation-name", prop: "animation-name", type: "text" },
    { conditions: [], group: "animation", label: "animation-play-state", prop: "animation-play-state", type: "select", options: ["running", "pause"] },
    { conditions: [], group: "animation", label: "animaiton-timing-function", prop: "animation-timing-function", type: "select", options: ["ease", "linear", "easy-in", "ease-out", "ease-in-out"] },
    { grid: "grid-1-5", conditions: [], label: "background-color", prop: "background-color", type: "color", group: "background", reset: "none" },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-image", prop: "background-image", type: "text", reset: " " },
    {
        grid: "grid-1-5", conditions: [], label: "Preset", prop: "background-image", type: "preset", presetType: "color", group: "background", option: [
            "linear-gradient(200deg, red, green, yellow, blue)",
            "linear-gradient(200deg, red, yellow)",
            "linear-gradient(200deg, blue,rgb(0, 136, 255), rgb(133, 133, 232))",
            "linear-gradient(200deg, blue,rgb(0, 136, 255),red, rgb(133, 133, 232))",
            "linear-gradient(200deg, blue,rgb(0, 136, 255),green, rgb(133, 133, 232))",
        ]
    },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-attachement", prop: "background-attachment", type: "select", options: ["fixed", "scroll"], buttoned: true, optionIcon: [<LocateFixed size={14}></LocateFixed>, <Scroll size={14}></Scroll>], reset: "none" },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-break", prop: "background-break", type: "select", options: ["bounding-box", "each-box", "continuous"] },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-clip", prop: "background-clip", type: "select", options: ["border-box", "padding-box", "content-box", "no-clip"] },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-origin", prop: "background-origin", type: "select", options: ["border-box", "padding-box", "content-box"] },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-position", prop: "background-position", type: "select", options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"] },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-repeat", prop: "background-repeat", type: "select", options: ["repeat", "repeat-x", "repeat-y", "no-repeat"] },
    { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-size", prop: "background-size", type: "select", options: ["auto", "cover", "contain"], optionIcon: [<FcAutomatic size={14}></FcAutomatic>, <Fullscreen size={14}></Fullscreen>, <Container size={14}></Container>], buttoned: true, reset: "none" },
    { grid: "grid-1-5", conditions: [], label: "border-radius", prop: "border-radius", type: "number", placeholder: "e.g. 8", unite: ["px", "em", "rem", "cm", "%"], group: "border" },
    { grid: "grid-1-3", conditions: [], group: "border", label: "border-color", prop: "border-color", type: "color" },
    { grid: "grid-3-5", conditions: [], group: "border", label: "border-width", prop: "border-width", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-style", prop: "border-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-bottom", prop: "border-bottom-color", type: "separator" },
    { grid: "grid-1-3", conditions: [], group: "border", label: "border-bottom-color", prop: "border-bottom-color", type: "color" },
    { grid: "grid-3-5", conditions: [], group: "border", label: "border-bottom-width", prop: "border-bottom-width", type: "number", unite: ["px", "em", "rem", "cm", "%"] },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-bottom-style", prop: "border-bottom-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-top", prop: "border-bottom-color", type: "separator" },
    { grid: "grid-1-3", conditions: [], group: "border", label: "border-top-color", prop: "border-top-color", type: "color" },
    { grid: "grid-3-5", conditions: [], group: "border", label: "border-top-width", prop: "border-top-width", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-top-style", prop: "border-top-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-left", prop: "border-bottom-color", type: "separator" },
    { grid: "grid-1-3", conditions: [], group: "border", label: "border-left-color", prop: "border-left-color", type: "color" },
    { grid: "grid-3-5", conditions: [], group: "border", label: "border-left-width", prop: "border-left-width", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-left-style", prop: "border-left-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-right", prop: "border-bottom-color", type: "separator" },
    { grid: "grid-1-3", conditions: [], group: "border", label: "border-right-color", prop: "border-right-color", type: "color" },
    { grid: "grid-3-5", conditions: [], group: "border", label: "border-right-width", prop: "border-right-width", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "border", label: "border-right-style", prop: "border-right-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { reset: "0", conditions: [], group: "sizing", label: "m-top", prop: "margin-top", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", label: "m-bott", prop: "margin-bottom", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", label: "m-left", prop: "margin-left", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", label: "m-right", prop: "margin-right", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", prop: "padding-top", label: "p-top", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", prop: "padding-bottom", label: "p-bottom", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", prop: "padding-left", label: "p-left", type: "number", unite: sizeDistUnit },
    { reset: "0", conditions: [], group: "sizing", prop: "padding-right", label: "p-right", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "sizing", label: "overflow", prop: "border-bottom-color", type: "separator" },
    {
        reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow", label: "overflow", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
            <Eye size={14}></Eye>,
            <EyeClosed size={14}></EyeClosed>,
            <FaScroll size={14}></FaScroll>
        ]
    },
    {
        grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
            <Fullscreen size={14}></Fullscreen>,
            <PiEmptyFill size={14}></PiEmptyFill>,
            <GoScreenFull size={14}></GoScreenFull>
        ]
    },
    {
        reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-x", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
            <Eye size={14}></Eye>,
            <EyeClosed size={14}></EyeClosed>,
            <FaScroll size={14}></FaScroll>
        ]
    },
    {
        grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-x", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
            <Fullscreen size={14}></Fullscreen>,
            <PiEmptyFill size={14}></PiEmptyFill>,
            <GoScreenFull size={14}></GoScreenFull>
        ]
    },
    {
        reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-y", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
            <Eye size={14}></Eye>,
            <EyeClosed size={14}></EyeClosed>,
            <FaScroll size={14}></FaScroll>
        ]
    },
    {
        grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
            <Fullscreen size={14}></Fullscreen>,
            <PiEmptyFill size={14}></PiEmptyFill>,
            <GoScreenFull size={14}></GoScreenFull>
        ]
    },
    // { conditions: [], group: "sizing", prop: "overflow-x", label: "overflow-x", type: "select", options: ["visible", "hidden", "scroll", "auto", "no-display", "no-content"] },
    // { conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-y", type: "select", options: ["visible", "hidden", "scroll", "auto", "no-display", "no-content"] },
    {
        reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-style", label: "overflow-style", type: "select", options: ["auto", "marquee-line", "mar-quee-block"], optionIcon: [
            <Text size={14}></Text>,
            <Text size={14}></Text>,
            <Text size={14}></Text>
        ], buttoned: true
    },
    {
        grid: "grid-1-5", reset: "none", conditions: [], group: "sizing", prop: "box-sizing", label: "box-sizing", type: "select", options: ["border-box", "content-box", "inherit", "initial"], optionIcon: [
            <Fullscreen size={14}></Fullscreen>,
            <Fullscreen size={14}></Fullscreen>,
            <Fullscreen size={14}></Fullscreen>,
            <Fullscreen size={14}></Fullscreen>
        ], buttoned: true
    },
    { conditions: [], group: "outline", prop: "outline-color", label: "outline-color", type: "color" },
    { conditions: [], group: "outline", prop: "outline-offset", label: "outline-offset", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "outline", prop: "outline-width", label: "outline-width", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "outline", prop: "outline-style", label: "outline-style", type: "select", options: ["none", "groove", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
    { grid: "grid-3-5", conditions: [], group: "text", prop: "letter-spacing", label: "letter-spacing", type: "number", unite: sizeDistUnit },
    {
        grid: "grid-1-3", conditions: [], group: "text", prop: "Direction", label: "Text Direction", type: "select", options: ["ltr", "rtl", "inherit"], optionIcon: [
            <BiRightArrow></BiRightArrow>,
            <BiLeftArrow></BiLeftArrow>,
            <BiDownArrow></BiDownArrow>,
        ], buttoned: true
    },
    { conditions: [], group: "text", prop: "text-indent", label: "text-indent", type: "number", unite: sizeDistUnit },
    { grid: "grid-1-5", conditions: [], group: "text", prop: "hanging-punctuation", label: "hanging-punctuation", type: "select", options: ["none", "start", "end", "end-edge"] },

    { conditions: [], group: "text", prop: "punctuation-trim", label: "punctuation-trim", type: "select", options: ["none", "start", "end", "adja-cent"] },
    // { conditions: [], group: "text", prop: "text-align", label: "text-align", type: "select", options: ["center", "start", "end", "left", "right", "justify"] },
    { conditions: [], group: "text", prop: "text-align-last", label: "text-align-last", type: "select", options: ["center", "start", "end", "left", "right", "justify"] },
    { conditions: [], group: "text", prop: "text-decoration", label: "text-decoration", type: "select", options: ["none", "underline", "overline", "blink"] },
    { conditions: [], group: "text", prop: "text-justify", label: "text-justify", type: "select", options: ["auto", "inter-word", "inter-ideograph", "inter-cluster", "distribute", "kashida", "tibetan"] },
    { conditions: [], group: "transition", prop: "transition-properties", label: "transition", type: "select", options: ["all", "none"] },
    { conditions: [], group: "transition", prop: "transition-time", label: "transition-time", type: "number", unite: ["s", "ms"] },
    { conditions: [], group: "transition", prop: "transition-delay", label: "transition-delay", type: "number", unite: ["s", "ms"] },
    { conditions: [], group: "transition", prop: "transition-timing-function", label: "transition", type: "select", options: ["ease", "linear", "ease-in", "ease-out", "ease-in-out"] },
    { conditions: [], group: "box-shadow", prop: "box-shadow", label: "box-shadow", type: "text", placeholder: "inset 0px 0px 0px 0px #ffffff", grid: "grid-1-5" },
    {
        conditions: [], buttoned: true, presetType: "box-shadow", group: "box-shadow", prop: "box-shadow", label: "", type: "preset", placeholder: "inset 0px 0px 0px 0px #ffffff", grid: "grid-1-5", option: [
            "0px 1px 0px 1px red",
            "inset 0px 1px 0px 1px blue",
            "0px 1px 0px 1px green",
        ]
    },
    { conditions: [], group: "position", prop: "position", label: "Position", type: "select", options: ["sticky", "relative", "fixed", "absolute"], buttoned: true, optionIcon: [<LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>], grid: "grid-1-5", reset: "none" },
    { conditions: [], group: "position", prop: "top", label: "Top", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "position", prop: "bottom", label: "Bottom", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "position", prop: "left", label: "Left", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "position", prop: "right", label: "Right", type: "number", unite: sizeDistUnit },
    { conditions: [], group: "position", prop: "z-index", label: "z-index", type: "number" },
];

export const BLOCK_TYPES = [
    { label: "Div", tag: "div", icon: <Box size={14} />, defaultContent: "Container", group: "container" },
    { label: "Section", tag: "section", icon: <Box size={14} />, defaultContent: "Section", group: "container" },
    { label: "Main", tag: "main", icon: <Box size={14} />, defaultContent: "Main", group: "container" },
    { label: "Aside", tag: "aside", icon: <Box size={14} />, defaultContent: "Aside", group: "container" },
    { label: "Heading 1", tag: "h1", icon: <Heading1 size={14} />, defaultContent: "Heading 1", group: "heading" },
    { label: "Heading 2", tag: "h2", icon: <Heading2 size={14} />, defaultContent: "Heading 2", group: "heading" },
    { label: "Heading 3", tag: "h3", icon: <Heading3 size={14} />, defaultContent: "Heading 3", group: "heading" },
    { label: "Heading 4", tag: "h4", icon: <Heading4 size={14} />, defaultContent: "Heading 4", group: "heading" },
    { label: "Heading 5", tag: "h5", icon: <Heading5 size={14} />, defaultContent: "Heading 5", group: "heading" },
    { label: "Heading 6", tag: "h6", icon: <Heading6 size={14} />, defaultContent: "Heading 6", group: "heading" },
    { label: "Paragraphe", tag: "p", icon: <Pilcrow size={14} />, defaultContent: "Paragraphe...", group: "text" },
    { label: "Link", tag: "a", icon: <Link size={14} />, defaultContent: "Click here", defaultHref: "/", group: "link" },
    { label: "Image", tag: "img", icon: <ImageIcon size={14} />, defaultContent: "https://via.placeholder.com/800x400", group: "media" },
    { label: "Video", tag: "video", icon: <VideoIcon size={14} />, defaultContent: "https://via.placeholder.com/800x400", group: "media" },
    { label: "Button", tag: "button", icon: <Square size={14} />, defaultContent: "Click here", group: "button" },
    { label: "Label", tag: "label", icon: <Text size={14} />, defaultContent: "label", group: "text", attr: [{ name: "for", type: "text", defaultContent: "text" }] },
    { label: "Form", tag: "form", icon: <Form size={14} />, defaultContent: "Post form", group: "form", for: "id" },
    { label: "Textarea", tag: "textarea", icon: <BsTextarea size={14} />, defaultContent: "textarea", group: "text" },
    { label: "Input", tag: "input", icon: <FormInput size={14} />, inputType: "text", group: "form", value: "", passwordViewToggler: false, targetedPassword: "" },
    { label: "Progress", tag: "progress", icon: <GrInProgress size={14} />, group: "form" },
];
export const GROUP_LIST = ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"]
export const GROUP_LIST_ICON = {
    "background": <WallpaperIcon size={14}></WallpaperIcon>,
    "display": <BsDisplay size={14}></BsDisplay>,
    "animation": <GrFlows size={14}></GrFlows>,
    "border": <BsBorder size={14}></BsBorder>,
    "sizing": <SquareIcon size={14}></SquareIcon>,
    "outline": <BsBorderOuter size={14}></BsBorderOuter>,
    "text": <Text size={14}></Text>,
    "transition": <StepForward size={14}></StepForward>,
    "box-shadow": <BoxIcon size={14}></BoxIcon>,
    "position": <GrLocation size={14}></GrLocation>
}
export const TAG_STYLE_GROUPS = {
    form: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h1: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h2: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h3: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h4: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h5: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    h6: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    section: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    main: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    aside: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    p: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    span: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    a: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    button: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    label: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    textarea: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    div: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    img: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    page: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    generic: ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    "textarea:hover": ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    "div:hover": ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    "button:hover": ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    "input": ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
    "progress": ["background", "display", "animation", "border", "sizing", "outline", "text", "transition", "box-shadow", "position"],
};
// export const TAG_STYLE_GROUPS = {
//     h1: ["color", "font-size", "text-align", "font-weight", "margin"],
//     h2: ["color", "font-size", "text-align", "font-weight", "margin"],
//     p: ["color", "font-size", "text-align", "margin"],
//     a: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius"],
//     button: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius", "margin"],
//     div: ["background-color", "padding", "margin", "border-radius", "width", "height", "display", "flex-direction"],
//     img: ["width", "height", "border-radius", "margin", "display"],
//     page: ["color", "font-size", "background-color", "padding", "margin"],
//     generic: ["color", "font-size", "text-align", "font-weight", "background-color", "padding", "margin", "border-radius", "width", "height", "display"]
// };

export const PSEUDO_CLASS = [
    "active", "focus", "visited", "hover", "link", "checked", "selection", "lang", "nth-child(n)", "nth-last-child(n)", "first-child", "only-child", "last-child", "nth-last-of-type()", "empty", "root", "not(x)", "target"
]