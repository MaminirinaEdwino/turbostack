// export const STYLE_CONTROLS_OLD = [
//     { grid: "grid-1-3", label: "Text-color", prop: "color", type: "color", group: "text", conditions: [] },
//     { grid: "grid-3-5", conditions: [], label: "font-size", prop: "font-size", type: "number", placeholder: "e.g. 16", group: "text", unite: ["px", "em", "rem", "cm", "%"] },
//     {
//         conditions: [], label: "text-align", prop: "text-align", type: "select", options: ["left", "center", "right", "justify"], group: "text", optionIcon: [
//             <CiTextAlignLeft size={14}></CiTextAlignLeft>,
//             <CiTextAlignCenter size={14}></CiTextAlignCenter>,
//             <CiTextAlignRight size={14}></CiTextAlignRight>,
//             <CiTextAlignJustify size={14}></CiTextAlignJustify>,
//         ], buttoned: true, grid: "grid-1-5"
//     },
//     { grid: "grid-1-3", conditions: [], label: "font-weight", prop: "font-weight", type: "select", options: ["normal", "bold", "100", "300", "500", "700", "900"], group: "text" },

//     { reset: "0", conditions: [], group: "sizing", label: "Padding", prop: "padding", type: "number", placeholder: "e.g. 10", unite: ["px", "em", "rem", "cm", "%"] },
//     { reset: "0", conditions: [], group: "sizing", label: "Margin", prop: "margin", type: "number", placeholder: "e.g. 0", unite: ["px", "em", "rem", "cm", "%"] },
//     { grid: "grid-1-2", reset: "0", conditions: [], group: "sizing", label: "Width", prop: "width", type: "number", placeholder: "100", unite: sizeDistUnit },
//     {
//         grid: "grid-2-5", conditions: [], label: "Preset", prop: "width", type: "select", buttoned: true, group: "sizing", options: [
//             "auto",
//             "fit-content"
//         ],
//         optionIcon: [
//             <Maximize size={14}></Maximize>,
//             <Fullscreen size={14}></Fullscreen>
//         ]
//     },
//     { grid: "grid-1-2", reset: "0", conditions: [], group: "sizing", label: "Height", prop: "height", type: "number", placeholder: "auto", unite: sizeDistUnit },
//     {
//         grid: "grid-2-5", conditions: [], label: "Preset", prop: "height", type: "select", buttoned: true, group: "sizing", options: [
//             "auto",
//             "fit-content"
//         ],
//         optionIcon: [
//             <Maximize size={14}></Maximize>,
//             <Fullscreen size={14}></Fullscreen>
//         ]
//     },
//     { conditions: [], group: "display", label: "Display", prop: "display", type: "select", options: ["block", "inline-block", "flex", "grid", "none"], grid: "grid-1-5" },
//     { group: "display", label: "Flex dir", prop: "flex-direction", type: "select", options: ["row", "column", "row-wrap", "column-wrap"], conditions: ["display", "flex"], grid: "grid-1-3" },
//     { group: "display", label: "Flex gap", prop: "gap", type: "number", conditions: ["display", "flex"], unite: ["px", "em", "rem", "cm", "%"], grid: "grid-3-5" },
//     { group: "display", label: "Justify-content", prop: "justify-content", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end", "space-between", "space-around", "space-evenly", "stretch"], grid: "grid-1-5" },
//     { group: "display", label: "Align-content", prop: "align-content", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end"], grid: "grid-1-5" },
//     { group: "display", label: "Align-items", prop: "align-items", type: "select", conditions: ["display", "flex"], options: ["center", "start", "end", "flex-start", "flex-end"], grid: "grid-1-5" },
//     { conditions: [], group: "animation", label: "Animation delay", prop: "animation-delay", type: "number", unite: ["s", "ms"] },
//     { conditions: [], group: "animation", label: "animation-direction", prop: "animation-direction", type: "select", options: ["normal", "alternate"] },
//     { conditions: [], group: "animation", label: "Animation duration", prop: "animation-duration", type: "number", unite: ["s"] },
//     { conditions: [], group: "animation", label: "animation-iteration-count", prop: "animation-iteration-count", type: "number" },
//     { conditions: [], group: "animation", label: "animation-name", prop: "animation-name", type: "text" },
//     { conditions: [], group: "animation", label: "animation-play-state", prop: "animation-play-state", type: "select", options: ["running", "pause"] },
//     { conditions: [], group: "animation", label: "animaiton-timing-function", prop: "animation-timing-function", type: "select", options: ["ease", "linear", "easy-in", "ease-out", "ease-in-out"] },
//     { grid: "grid-1-5", conditions: [], label: "background-color", prop: "background-color", type: "color", group: "background", reset: "none" },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-image", prop: "background-image", type: "text", reset: " " },
//     {
//         grid: "grid-1-5", conditions: [], label: "Preset", prop: "background-image", type: "preset", presetType: "color", group: "background", option: [
//             "linear-gradient(200deg, red, green, yellow, blue)",
//             "linear-gradient(200deg, red, yellow)",
//             "linear-gradient(200deg, blue,rgb(0, 136, 255), rgb(133, 133, 232))",
//             "linear-gradient(200deg, blue,rgb(0, 136, 255),red, rgb(133, 133, 232))",
//             "linear-gradient(200deg, blue,rgb(0, 136, 255),green, rgb(133, 133, 232))",
//             "repeating-radial-gradient(circle, blue 0px,rgb(0, 136, 255) 10px ,green 20px, rgb(133, 133, 232) 30px)",
//             "linear-gradient(169deg, #261bc5 , #1d5b8b 68px, #1e21c2 )",
//             "linear-gradient(169deg, #9f8484 , #a81515 , #570000 )",
//             "linear-gradient(324deg, #027e17 , #3b710e , #5f6b00 )"
//         ]
//     },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-attachement", prop: "background-attachment", type: "select", options: ["fixed", "scroll"], buttoned: true, optionIcon: [<LocateFixed size={14}></LocateFixed>, <Scroll size={14}></Scroll>], reset: "none" },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-break", prop: "background-break", type: "select", options: ["bounding-box", "each-box", "continuous"] },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-clip", prop: "background-clip", type: "select", options: ["border-box", "padding-box", "content-box", "no-clip"] },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-origin", prop: "background-origin", type: "select", options: ["border-box", "padding-box", "content-box"] },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-position", prop: "background-position", type: "select", options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"] },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-repeat", prop: "background-repeat", type: "select", options: ["repeat", "repeat-x", "repeat-y", "no-repeat"] },
//     { grid: "grid-1-5", conditions: [], group: "background", label: "backgroud-size", prop: "background-size", type: "select", options: ["auto", "cover", "contain"], optionIcon: [<FcAutomatic size={14}></FcAutomatic>, <Fullscreen size={14}></Fullscreen>, <Container size={14}></Container>], buttoned: true, reset: "none" },
//     { grid: "grid-1-5", conditions: [], label: "border-radius", prop: "border-radius", type: "number", placeholder: "e.g. 8", unite: ["px", "em", "rem", "cm", "%"], group: "border" },
//     { grid: "grid-1-3", conditions: [], group: "border", label: "border-color", prop: "border-color", type: "color" },
//     { grid: "grid-3-5", conditions: [], group: "border", label: "border-width", prop: "border-width", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-style", prop: "border-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-bottom", prop: "border-bottom-color", type: "separator" },
//     { grid: "grid-1-3", conditions: [], group: "border", label: "border-bottom-color", prop: "border-bottom-color", type: "color" },
//     { grid: "grid-3-5", conditions: [], group: "border", label: "border-bottom-width", prop: "border-bottom-width", type: "number", unite: ["px", "em", "rem", "cm", "%"] },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-bottom-style", prop: "border-bottom-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-top", prop: "border-bottom-color", type: "separator" },
//     { grid: "grid-1-3", conditions: [], group: "border", label: "border-top-color", prop: "border-top-color", type: "color" },
//     { grid: "grid-3-5", conditions: [], group: "border", label: "border-top-width", prop: "border-top-width", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-top-style", prop: "border-top-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-left", prop: "border-bottom-color", type: "separator" },
//     { grid: "grid-1-3", conditions: [], group: "border", label: "border-left-color", prop: "border-left-color", type: "color" },
//     { grid: "grid-3-5", conditions: [], group: "border", label: "border-left-width", prop: "border-left-width", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-left-style", prop: "border-left-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-right", prop: "border-bottom-color", type: "separator" },
//     { grid: "grid-1-3", conditions: [], group: "border", label: "border-right-color", prop: "border-right-color", type: "color" },
//     { grid: "grid-3-5", conditions: [], group: "border", label: "border-right-width", prop: "border-right-width", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "border", label: "border-right-style", prop: "border-right-style", type: "select", options: ["none", "hidden", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { reset: "0", conditions: [], group: "sizing", label: "m-top", prop: "margin-top", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", label: "m-bott", prop: "margin-bottom", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", label: "m-left", prop: "margin-left", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", label: "m-right", prop: "margin-right", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", prop: "padding-top", label: "p-top", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", prop: "padding-bottom", label: "p-bottom", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", prop: "padding-left", label: "p-left", type: "number", unite: sizeDistUnit },
//     { reset: "0", conditions: [], group: "sizing", prop: "padding-right", label: "p-right", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "sizing", label: "overflow", prop: "border-bottom-color", type: "separator" },
//     {
//         reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow", label: "overflow", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
//             <Eye size={14}></Eye>,
//             <EyeClosed size={14}></EyeClosed>,
//             <FaScroll size={14}></FaScroll>
//         ]
//     },
//     {
//         grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
//             <Fullscreen size={14}></Fullscreen>,
//             <PiEmptyFill size={14}></PiEmptyFill>,
//             <GoScreenFull size={14}></GoScreenFull>
//         ]
//     },
//     {
//         reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-x", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
//             <Eye size={14}></Eye>,
//             <EyeClosed size={14}></EyeClosed>,
//             <FaScroll size={14}></FaScroll>
//         ]
//     },
//     {
//         grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-x", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
//             <Fullscreen size={14}></Fullscreen>,
//             <PiEmptyFill size={14}></PiEmptyFill>,
//             <GoScreenFull size={14}></GoScreenFull>
//         ]
//     },
//     {
//         reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-y", type: "select", options: ["visible", "hidden", "scroll"], buttoned: true, optionIcon: [
//             <Eye size={14}></Eye>,
//             <EyeClosed size={14}></EyeClosed>,
//             <FaScroll size={14}></FaScroll>
//         ]
//     },
//     {
//         grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-y", label: "", type: "select", options: ["auto", "no-display", "no-content"], buttoned: true, optionIcon: [
//             <Fullscreen size={14}></Fullscreen>,
//             <PiEmptyFill size={14}></PiEmptyFill>,
//             <GoScreenFull size={14}></GoScreenFull>
//         ]
//     },
//     // { conditions: [], group: "sizing", prop: "overflow-x", label: "overflow-x", type: "select", options: ["visible", "hidden", "scroll", "auto", "no-display", "no-content"] },
//     // { conditions: [], group: "sizing", prop: "overflow-y", label: "overflow-y", type: "select", options: ["visible", "hidden", "scroll", "auto", "no-display", "no-content"] },
//     {
//         reset: "none", grid: "grid-1-5", conditions: [], group: "sizing", prop: "overflow-style", label: "overflow-style", type: "select", options: ["auto", "marquee-line", "mar-quee-block"], optionIcon: [
//             <Text size={14}></Text>,
//             <Text size={14}></Text>,
//             <Text size={14}></Text>
//         ], buttoned: true
//     },
//     {
//         grid: "grid-1-5", reset: "none", conditions: [], group: "sizing", prop: "box-sizing", label: "box-sizing", type: "select", options: ["border-box", "content-box", "inherit", "initial"], optionIcon: [
//             <Fullscreen size={14}></Fullscreen>,
//             <Fullscreen size={14}></Fullscreen>,
//             <Fullscreen size={14}></Fullscreen>,
//             <Fullscreen size={14}></Fullscreen>
//         ], buttoned: true
//     },
//     { conditions: [], group: "outline", prop: "outline-color", label: "outline-color", type: "color" },
//     { conditions: [], group: "outline", prop: "outline-offset", label: "outline-offset", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "outline", prop: "outline-width", label: "outline-width", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "outline", prop: "outline-style", label: "outline-style", type: "select", options: ["none", "groove", "solid", "double", "dashed", "dotted", "inset", "outset", "ridge"] },
//     { grid: "grid-3-5", conditions: [], group: "text", prop: "letter-spacing", label: "letter-spacing", type: "number", unite: sizeDistUnit },
//     {
//         grid: "grid-1-3", conditions: [], group: "text", prop: "Direction", label: "Text Direction", type: "select", options: ["ltr", "rtl", "inherit"], optionIcon: [
//             <BiRightArrow></BiRightArrow>,
//             <BiLeftArrow></BiLeftArrow>,
//             <BiDownArrow></BiDownArrow>,
//         ], buttoned: true
//     },
//     { conditions: [], group: "text", prop: "text-indent", label: "text-indent", type: "number", unite: sizeDistUnit },
//     { grid: "grid-1-5", conditions: [], group: "text", prop: "hanging-punctuation", label: "hanging-punctuation", type: "select", options: ["none", "start", "end", "end-edge"] },

//     { conditions: [], group: "text", prop: "punctuation-trim", label: "punctuation-trim", type: "select", options: ["none", "start", "end", "adja-cent"] },
//     // { conditions: [], group: "text", prop: "text-align", label: "text-align", type: "select", options: ["center", "start", "end", "left", "right", "justify"] },
//     { conditions: [], group: "text", prop: "text-align-last", label: "text-align-last", type: "select", options: ["center", "start", "end", "left", "right", "justify"] },
//     { conditions: [], group: "text", prop: "text-decoration", label: "text-decoration", type: "select", options: ["none", "underline", "overline", "blink"] },
//     { conditions: [], group: "text", prop: "text-justify", label: "text-justify", type: "select", options: ["auto", "inter-word", "inter-ideograph", "inter-cluster", "distribute", "kashida", "tibetan"] },
//     { conditions: [], group: "transition", prop: "transition-properties", label: "transition", type: "select", options: ["all", "none"] },
//     { conditions: [], group: "transition", prop: "transition-time", label: "transition-time", type: "number", unite: ["s", "ms"] },
//     { conditions: [], group: "transition", prop: "transition-delay", label: "transition-delay", type: "number", unite: ["s", "ms"] },
//     { conditions: [], group: "transition", prop: "transition-timing-function", label: "transition", type: "select", options: ["ease", "linear", "ease-in", "ease-out", "ease-in-out"] },
//     { conditions: [], group: "box-shadow", prop: "box-shadow", label: "box-shadow", type: "text", placeholder: "inset 0px 0px 0px 0px #ffffff", grid: "grid-1-5" },
//     {
//         conditions: [], buttoned: true, presetType: "box-shadow", group: "box-shadow", prop: "box-shadow", label: "", type: "preset", placeholder: "inset 0px 0px 0px 0px #ffffff", grid: "grid-1-5", option: [
//             "0px 1px 0px 1px red",
//             "inset 0px 1px 0px 1px blue",
//             "0px 1px 0px 1px green",
//             "0 0 15px rgba(101, 126, 255, 0.7)",
//             "0 0 10px #0ff",
//             "0 5px 0 #ea5edb",
//             "4px 5px 3px 2px #221584",
//             "0px 0px 10px 2px #68a93d",
//             "inset 0px 0px 10px 2px #68a93d, inset 0px 1px 3px 3px #68a93d",
//             "inset 0px 0px 10px 2px #7e7c72, inset 0px 0px 4px 9px #7e7c72",
//             "0px 0px 10px 2px #7e7c72, inset 0px 0px 4px 9px #7e7c72"
//         ]
//     },
//     { conditions: [], group: "position", prop: "position", label: "Position", type: "select", options: ["sticky", "relative", "fixed", "absolute"], buttoned: true, optionIcon: [<LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>, <LocateIcon size={14}></LocateIcon>], grid: "grid-1-5", reset: "none" },
//     { conditions: [], group: "position", prop: "top", label: "Top", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "position", prop: "bottom", label: "Bottom", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "position", prop: "left", label: "Left", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "position", prop: "right", label: "Right", type: "number", unite: sizeDistUnit },
//     { conditions: [], group: "position", prop: "z-index", label: "z-index", type: "number" },
// ];