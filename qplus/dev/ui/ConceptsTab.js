
class ConceptsTab extends View {

	// displays a HTML file

	constructor(app) {
		super(app);
	}

	init() {
		// symbols for translation
		theLang.add({
			PlayTabConcepts: {
				en: "&nbsp; &#9405; &nbsp;", // unicode H symbol				
				fr: "&nbsp; &#9398; &nbsp;", // unicode A symbol
				it: "&nbsp; &#9398; &nbsp;", // unicode A symbol	
				// en: "Help texts",
				// de: "Hilfetexte",
				// fr: "Textes d'aide",
			},
			PlayTabConceptsTitle: {
				en: "Help texts",
				de: "Hilfetexte",
				fr: "Textes d'aide",
			},			
		});
		this.loadHTML("index.html");
	}

	loadMD(name) {
		$.ajax({
			url: "./products/"+QB.product.id+"/essays/"+name+".md",
		})
		.done(function(data) {
			var parsed = new commonmark.Parser().parse(data); // parsed is a 'Node' tree
			var html = new commonmark.HtmlRenderer().render(parsed); // result is a String
			$("#PlayViewConcepts").html(html);
		});
	}

	loadHTML(name) {
		var that=this;
        if (qbServerMode == "file") {
		    if (typeof qbConceptData === 'undefined') {
	            $("#PlayViewConcepts").html("Missing!");
			}
			else {
	            $("#PlayViewConcepts").html(qbConceptData);				
			}
        }
        else {
		  var path = "products/" + QB.product.id;
		  if (QB.product.type == "play") 
			 path += "/MANUAL/" + theLang.letter3(theLang.lang).toUpperCase() + "/";
		  else 
			 path += "/essays/";
		  path += name;
		  $.ajax({
			url: path,
		  })
		  .done(function(html) {
			if (name=="index.html") {
				that.index=html;
			}
			else {
				html=that.index+html;
			}
			$("#PlayViewConcepts").html(html);
		  });
		}
	}

	onChanged(what) {
		// receive results from the Model
	}

}
