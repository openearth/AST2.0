export const numericLayout = {
  _meta: {
    "backspace": { func: "backspace", classes: "control" },
    "accept": { func: "accept", text: "Close", classes: "control featured" },
    "zero": { key: "0", width: 130 },
  },

  default: [
    "1 2 3",
    "4 5 6",
    "7 8 9",
    ". {zero} {backspace} {accept}",
  ],
}

export const textLayout = {

  _meta: {
    "default": { keySet: "default", text: "abc", classes: "control" },
    "alpha": { keySet: "default", text: "Abc", classes: "control" },
    "shift": { keySet: "shifted", text: "ABC", classes: "control" },
    "numbers": { keySet: "numbers", text: "123", classes: "control" },
    "space": { key: " ", text: "Space", width: 200 },
    "backspace": { func: "backspace", classes: "control" },
    "accept": { func: "accept", text: "Close", classes: "control featured" },
    "next": { func: "next", text: "Next", classes: "featured" },
    "zero": { key: "0", width: 130 },
  },

  default: [
    "q w e r t y u i o p",
    " a s d f g h j k l ",
    "{shift} z x c v b n m {backspace}",
    "{numbers} - {space} . {accept}",
  ],

  shifted: [
    "Q W E R T Y U I O P",
    " A S D F G H J K L ",
    "{default} Z X C V B N M {backspace} ",
    "{numbers} _ {space} , {accept}",
  ],

  numbers: [
    "1 2 3",
    "4 5 6",
    "7 8 9",
    "  {alpha} . {zero} {backspace} {next} {accept}",
  ],
}
