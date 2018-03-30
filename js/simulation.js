
class Simulation {
    constructor() {
    }
    RegisterOnReady() {
        $($.proxy(this.onReady, this))

    }
    onReady() {
        console.log("Simulation.onReady")
		$('#Reset, .simulation ul input.radio').on('click', $.proxy(this.onResetClick, this))
		$('#MoveForward').on('click', $.proxy(this.onMoveClick, this))
		$('#Start').on('click', $.proxy(this.onStartClick, this))
    }
    get Size() {
        return parseInt($("input:radio[name='size']:checked").val())
    }
	get isRunning() {
        return $('#Start').text() === 'Arreter'
    }
	onResetClick() {
		$(this).trigger('reset')
	}
	onMoveClick() {
		$(this).trigger('move')
	}
	onStartClick() {
		if (this.isRunning) {
			$('#Start').text('Demarrer')
		} else {
			$('#Start').text('Arreter')
			$(this).trigger('simulation')
		}
	}
}
