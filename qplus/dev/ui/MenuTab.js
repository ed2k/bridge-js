
class MenuTab extends View {

	// the settings menu

	constructor(app) {
		super(app);
	}

	init() {
		// symbols for translation
		theLang.add({
			PlayTabMenu: {
				en: "<small><b>☰</b></small>",
			},
		});
	}

	onChanged(what) {
		// receive results from the Model
	}

}
