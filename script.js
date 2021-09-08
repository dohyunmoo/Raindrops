const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var words = []
var words2 = []
var umbrella

var myFirstName = "DOHYUN"
var myLastName = "MOON"
var myFName = myFirstName.split("")
var myLName = myLastName.split("")

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2
}

function main() {
    var totalDropletCount = 300
    var dropletCount = Math.floor(totalDropletCount * (myFName.length/myLName.length))
    var droplet2Count = Math.floor(totalDropletCount * (myLName.length/myFName.length))

    umbrella = new Umbrella(380, 150, 150, "#fff44f")

    for (let i = 0; i < dropletCount; i++) {
        words.push(new Words((Math.random() * (canvas.width)), (Math.random() * 500) - 1000, 
        0, (Math.random() * 20) + 10, myFName[Math.floor(Math.random() * myFName.length)], "#ffffff"))
    }

    for (let j = 0; j < droplet2Count; j++) {
        words2.push(new Words((Math.random() * (canvas.width)), (Math.random() * 500) - 1000,
        0, (Math.random() * 20) + 10, myLName[Math.floor(Math.random() * myLName.length)], "#000000"))
    }
    animate()
}

class Words {
    constructor(x, y, hv, vv, letter, colorLetter) {
        this.x = x
        this.y = y
        this.hv = hv
        this.vv = vv
        this.letter = letter
        this.colorLetter = colorLetter
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.colorLetter
        ctx.font = "48px Calibri"
        ctx.fillText(this.letter, this.x, this.y)
        ctx.closePath()
    }

    update() {
        this.y += this.vv
        this.x += this.hv
        this.draw()

        if (this.y >= canvas.height) {
            this.x = (Math.random() * (canvas.width))
            this.y = (Math.random() * 500) - 1000
            this.vv = (Math.random() * 20) + 10
        }
    }
}

class Umbrella {
    constructor (base, height, handleLength, color) {
        this.base = base
        this.height = height
        this.handleLength = handleLength
        this.color = color
        this.x
        this.y
        this.slope
        this.b
    }

    drawUmbrella() {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y - this.handleLength)
        ctx.lineTo(this.x - this.base/2, this.y - this.handleLength)
        ctx.lineTo(this.x + this.base/2, this.y - this.handleLength)
        ctx.lineTo(this.x, this.y - (this.handleLength + this.height))
        ctx.lineTo(this.x - this.base/2, this.y - this.handleLength)
        ctx.lineTo(this.x, this.y - this.handleLength)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.lineTo(this.x, this.y)
        ctx.arc(this.x + 20, this.y, 20, Math.PI, 0, true)
        ctx.strokeStyle = this.color
        ctx.lineWidth = 3
        ctx.stroke()
    }

    updateEQ() {
        this.drawUmbrella()
        this.slope = this.height / (this.base/2)
        this.b1 = (this.y - this.handleLength - this.height) - (this.slope * this.x)
        this.b2 = (this.y - this.handleLength - this.height) - (-this.slope * this.x)
    }
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    umbrella.x = mouse.x
    umbrella.y = mouse.y
    umbrella.updateEQ()

    for (let i = 0; i < words.length; i++) {
    // collision check
        if ((words[i].x) <= umbrella.x && (words[i].x) >= (umbrella.x - umbrella.base/2)) {
            if ((words[i].y) >= (umbrella.slope * words[i].x) + umbrella.b1 && words[i].y <= (umbrella.y - umbrella.handleLength)
             && words[i].y > (umbrella.y - umbrella.handleLength - umbrella.height)) {
                words[i].hv = -words[i].vv * umbrella.slope
            } else {
                words[i].hv = 0
            }
        } else if (words[i].x > umbrella.x && words[i].x <= (umbrella.x + umbrella.base/2)) {
            if ((words[i].y) >= (-umbrella.slope * words[i].x) + umbrella.b2 && words[i].y <= (umbrella.y - umbrella.handleLength)
             && words[i].y > (umbrella.y - umbrella.handleLength - umbrella.height)) {
                words[i].hv = words[i].vv * umbrella.slope
            } else {
                words[i].hv = 0
            }
        } else {
            words[i].hv = 0
        }

        words[i].update()
    }

    for (let j = 0; j < words2.length; j++) {
    // collision check
        if (words2[j].x <= umbrella.x && words2[j].x >= (umbrella.x - umbrella.base/2)) {
            if ((words2[j].y) >= (umbrella.slope * words2[j].x) + umbrella.b1 && words2[j].y <= (umbrella.y - umbrella.handleLength)
             && words2[j].y > (umbrella.y - umbrella.handleLength - umbrella.height)) {
                words2[j].hv = -words2[j].vv * umbrella.slope
            } else {
                words2[j].hv = 0
            }
        } else if (words2[j].x >= umbrella.x && words2[j].x <= (umbrella.x + umbrella.base/2)) {
            if ((words2[j].y) >= (-umbrella.slope * words2[j].x) + umbrella.b2 && words2[j].y <= (umbrella.y - umbrella.handleLength)
             && words2[j].y > (umbrella.y - umbrella.handleLength - umbrella.height)) {
                words2[j].hv = words2[j].vv * umbrella.slope
            } else {
                words2[j].hv = 0
            }
        } else {
            words2[j].hv = 0
        }

        words2[j].update()
    }
}

main()

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})