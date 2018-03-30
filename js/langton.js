/// <reference path="ant.js" />
/// <reference path="grid.js" />
/// <reference path="pattern.js" />
/// <reference path="simulation.js" />

class Langton {
    constructor() {
        this.Pattern = new Pattern()
        this.Simulation = new Simulation()
    }
    RegisterOnReady() {
        this.Pattern.RegisterOnReady()
        this.Simulation.RegisterOnReady()

        $($.proxy(this.onReady, this))
    }
    onReady() {
        this.Grid = new Grid("Grid", this.Simulation.Size)
        this.Ant = new Ant(this.Grid.MiddleX, this.Grid.MiddleY)
        this.displayAntInfo()

        $(this.Ant).on("move", $.proxy(this.displayAntInfo, this))
		$(this.Simulation).on("reset", $.proxy(this.resetInfo, this))
		$(this.Simulation).on("move", $.proxy(this.moveForward, this))
		$(this.Simulation).on("simulation", $.proxy(this.startSimulation, this))
		$(this.Pattern).on("changePattern", $.proxy(this.resetInfo, this))
        console.log("Langton.onReady")
    }
    displayAntInfo() {
        this.Grid.SetColor(this.Ant.X, this.Ant.Y, Ant.Color)
		$('.ant .ant-x').text(this.Ant.X)
		$('.ant .ant-y').text(this.Ant.Y)
		$('.ant .ant-direction').text(this.Ant.Direction)
		$('.ant .ant-nb-steps').text(this.Ant.NbSteps)
    }
	resetInfo() {
		$('#Start').text('Demarrer')
		this.Grid.Size = this.Simulation.Size
		this.Ant.Reset(this.Grid.MiddleX, this.Grid.MiddleY)
	}
	moveForward() {
		for (let i = 0;i < $('#NbSteps').val();i++) {
			let getSteps = this.Pattern.getSteps(this.Grid.GetColor(this.Ant.X, this.Ant.Y))
			this.Grid.SetColor(this.Ant.X, this.Ant.Y, getSteps[1]); 
			this.Ant.Turn(getSteps[0]);
		}
	}
	startSimulation() {
		if (!this.Grid.GetColor(this.Ant.X, this.Ant.Y) || !this.Simulation.isRunning){
            return
        }
		this.moveForward()
        setTimeout( $.proxy(function(){ this.startSimulation() }, this), $('#Interval').val())
	}
}

let langton = new Langton()
langton.RegisterOnReady()
