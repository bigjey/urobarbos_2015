if (!('ontouchstart' in document.documentElement)) document.documentElement.className += " no-touch "; else document.documentElement.className += " touch ";

if ('CSS' in window && 'supports' in window.CSS) {
	var supportsBackgroundBlendMode = window.CSS.supports('background-blend-mode', 'multiply');	
	if (supportsBackgroundBlendMode) 
		document.documentElement.className += " blend-mode ";
	else
		document.documentElement.className += " no-blend-mode ";
}

var body = document.body,
    timer;