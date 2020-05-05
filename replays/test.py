import json
import unicodedata

filename = "sample.txt"
tronResults = ""

def boardToHTML(board):
    unicodedata.normalize('NFKD', board).encode('ascii','ignore')

    b = "<div class='board-wrapper'><div class='board'>"
    start = False
    for char in board:
        if char == "#" and not start:
            start = True
        if not start:
            continue

        if char == " ":
            b += "<span class='space'></span>"
        if char == "#":
            b += "<span class='wall'></span>"
        if char == "x":
            b += "<span class='barrier'></span>"
        if char == "1":
            b += "<span class='player1'><p>1</p></span>"
        if char == "2":
            b += "<span class='player2'><p>2</p></span>"
        if char == "*":
            b += "<span class='trap'><p>*</p></span>"
        if char == "@":
            b += "<span class='armor'><p>@</p></span>"
        if char == "^":
            b += "<span class='speed'><p>^</p></span>"
        if char == "!":
            b += "<span class='bomb'><p>!</p></span>"

    b += "</div></div>"
    return b

with open(filename, encoding='utf-8') as f:
    print("opening", filename, "for reading.")
    data = json.load(f)
    p1wincount = 0
    p2wincount = 0
    boardIndex = 0
    print(type(data))
    for d1, d2 in data:
        print(d1)
        print("d1-----")
        print(d2)
        tronResults += "<div class='game-wrapper'>"
        tronResults += "<div class='game'>"
        firstturn = True
        flip = False
        for d3, d4 in zip(d1, d2):
            print(d3)
            print("d3-----")
            print(d4)
            break
            if firstturn:
                if "x" in d3:
                    flip = True
                firstturn = False
            if flip:
                tronResults += boardToHTML(d4)
                tronResults += boardToHTML(d3)
            else:
                tronResults += boardToHTML(d3)
                tronResults += boardToHTML(d4)
        if len(d1) > len(d2):
            tronResults += boardToHTML(d1[len(d1) - 1])
        elif len(d2) > len(d1):
            tronResults += boardToHTML(d2[len(d2) - 1])
        tronResults += "</div><button class='restart' title='Click to restart' onclick='restart(" + str(boardIndex) + ")'>R</button>"
        tronResults += "</div>"
        boardIndex += 1
        break

result = "test.html"
with open(result, "w", encoding='utf-8') as out:
    # out.write(htmlmin.minify(html_results, remove_empty_space=True))
    out.write(tronResults) # faster but not minified