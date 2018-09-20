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