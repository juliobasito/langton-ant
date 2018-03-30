
class Pattern {
    constructor() {
    }
    RegisterOnReady() {
        $($.proxy(this.onReady, this))
    }
    onReady() {
        console.log("Pattern.onReady")
		let that = this
		$('.container .panel .condition').show()
		$.get('https://api.myjson.com/bins/crrrn', function(data) {
			let array_name = ''
			$.each(data.patterns, function (key, data_patterns) {
				let html = '<option value= "' + data_patterns.name + '">'+ data_patterns.name + '</option>'
				$(html).data("pattern", data_patterns).appendTo('#Pattern')
			})
			$('#Pattern:last').on('change', $.proxy(that.moveSelectedPatterns, that))
			that.loadPatterns('Simple')
		})
    }
	moveSelectedPatterns(e) {
		$(this).trigger('changePattern')
		this.loadPatterns($(e.currentTarget).val())
	}
	loadPatterns(SelectValue) {
		let that = this
		$.get('https://api.myjson.com/bins/crrrn', function(data) {
			let array_steps = []
			$.each(data.patterns, function (key, data_patterns) {
				if (data_patterns.name == SelectValue) {
					array_steps.push(data_patterns.steps)
				}
			})
			$('.condition tbody').html('')
			$.each(array_steps[0], function(key, step) {
				$('.condition tbody').append(Pattern.GetHtmlRow(step))
				$('.condition tbody .then-color select:last').on('change', $.proxy(that.handleChangeColorPatterns, that))
			})
		})
	}
	handleChangeColorPatterns(e) {
		this.changeColorPatterns($(e.currentTarget).parents('tr'), $(e.currentTarget).val())
		this.addColorPatterns($(e.currentTarget).val())
	}
	changeColorPatterns(target, color) {
		if ($(target).next().length == 0) {
			return
		}
		$(target).next().hide()
		this.changeColorPatterns($(target).next(), color)
	}
	addColorPatterns(color) {
		var alreadyColor = false
		if (color != '#FFFFFF') {
			$.each($('#CurrentPattern tbody tr:visible'), function(key, data) {
				if ($(data).children('td.if-color').text() == PatternColor[color]) {
					alert('Cette couleur fait déjà partie de la liste')
					alreadyColor = true
				}	
			})
			if (alreadyColor == false) {
				let newLine = $.extend({
						if: color
					})
				$('#CurrentPattern tbody').append(Pattern.GetHtmlRow(newLine))
			}
		}
	}
	getSteps(currentColor) {
		let step_array = []
		$.each($('#CurrentPattern tbody tr'), function(key, data) {
			if ($(data).attr('data-if-color') == currentColor) {
				step_array = [$(data).children('.then-direction').children('select').val(), 
				$(data).children('.then-color').children('select').val()]
				return
			}
		})
		return step_array
	}
	get currentPatern() {
		return $('#Pattern option:selected').data('pattern')
	}
    static GetSelect(json, selected) {
        let html = '<select>'
        for (var property in json) {
            html += '<option value="' + property + '"'
            if (selected === property) {
                html += ' selected="selected"'
            }

            html += '>' + json[property] + '</option>'
        }

        html += '</select>'
        return html
    }
    static GetHtmlRow(step) {
        let settings = $.extend({
            if: "#FFFFFF",
            then: {
                color: "#FFFFFF",
                direction: "left"
            }
        }, step)

        let html = '<tr data-if-color="' + settings.if + '">'
        html += '<td class="if-color">' + PatternColor[settings.if] + '</td>'
        html += '<td class="then-color">' + Pattern.GetSelect(PatternColor, settings.then.color) + '</td>'
        html += '<td class="then-direction">' + Pattern.GetSelect(PatternDirection, settings.then.direction) + '</td>'
        html += '</tr>'
        return html
    }
}

const PatternColor = Object.freeze({
    "#FFFFFF": "Blanc",
    "#6D9ECE": "Bleu Clair",
    "#1F5FA0": "Bleu Fonc&eacute;",
    "#6D071A": "Bordeaux",
    "#606060": "Gris",
    "#F0C300": "Jaune",
    "#000000": "Noir",
    "#FF7F00": "Orange",
    "#E0115F": "Rose",
    "#DB1702": "Rouge",
    "#008020": "Vert",
    "#7F00FF": "Violet"
})

const PatternDirection = Object.freeze({
    "left": "Gauche",
    "right": "Droite"
})
