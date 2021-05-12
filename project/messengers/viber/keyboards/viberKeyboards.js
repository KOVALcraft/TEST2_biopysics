const subKeyboard = ()=>{
    return {
        "Type": "keyboard",
        "Buttons": [
            {
                "Columns": 6,
                "Rows": 1,
                "TextSize": "large",
                "Text": "<font color=\"#f20505\">subscribe</font>",
                "TextVAlign": "middle",
                "TextHAlign": "center",
                "ActionType": "reply",
                "ActionBody": "signed",
                "BbColor": "#421c00",
                "TextOpacity": 60,
            },
        ]
        }
}

module.exports = {
    subKeyboard
}