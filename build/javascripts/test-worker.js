this.addEventListener('message', function(e) {
	switch (e.data) {
		case 'a':
			this.postMessage('a1');
			break;
			
			case 'b':
				this.postMessage('b1');
				break;
				
			default:
				//e.data.send();
				this.postMessage(e.data);
	}
}, false);