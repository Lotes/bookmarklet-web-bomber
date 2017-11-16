class Sound {
	constructor(mp3Url, oggUrl) {
		const sound = document.createElement('audio');
		sound.preload = 'auto';

		const mp3Source = document.createElement('source');
		mp3Source.type = 'audio/mpeg';
		mp3Source.src = sounds[name].MP3;
		sound.appendChild(mp3Source);

		const oggSource = document.createElement('source');
		oggSource.type = 'audio/ogg';
		oggSource.src = sounds[name].OGG;
		sound.appendChild(oggSource);

		document.body.appendChild(sound);
		
		this.play = function() {
			sound.pause();
			sound.currentTime = 0;
			sound.play();
		};
	}
}

module.exports = Sound;
