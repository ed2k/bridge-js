"use strict";

class AudioPlayer {
/*

	AudioPlayer.js : play audio files
*/

	constructor() {
		this.lastFile=null;
	}

	test() {
		QB.winManager.openDialog("AudioWin");
		this.playFrom(16);
	}

	playFile(file) {
		this.lastFile=file;
		$("#audioPlayer").attr("src",file);
		return this.playFrom(0);
	}

	playFrom(time,n) {
		if (typeof n == "undefined") n=10;
		var player = $("#audioPlayer")[0];
		const playPromise = player.play();
		if (playPromise !== null){
		    playPromise.catch(() => {
				if (n>0) {
					player.currentTime=time;
					setTimeout(function() {theAudioPlayer.playFrom(time,n-1);},50);
				}
			});
		}
	}

	getRemainingTime() {
		var player = $("#audioPlayer")[0];
		return player.duration-player.currentTime;
	}

	stop() {
		var player = $("#audioPlayer")[0];
		if (player.duration > 0 && !player.paused) {
			player.pause();
			player.currentTime=0;
		}
	}

	toggle() {
		if (this.lastFile==null) return;
		var player = $("#audioPlayer")[0];
		if (player.currentTime==0) {
			this.playFrom(0);
			return true;
		}
		else {
			this.stop();
			return false;
		}
	}

}

var theAudioPlayer = new AudioPlayer();
