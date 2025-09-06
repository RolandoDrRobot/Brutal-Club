/**
 * Centralized audio management system for the game
 * Handles music, sound effects, ambient sounds, and volume control
 */
class AudioManager {
  constructor() {
    this.audioElements = new Map();
    this.masterVolume = 1.0;
    this.isMuted = false;
    this.currentMusicTrack = 1;
    this.isMusicPlaying = false;
    this.isCombatMode = false;
    
    this.musicTracks = [
      { id: 0, name: "No Music", artist: "", file: null },
      { id: 1, name: "Nine Thou", artist: "Styles Of Beyond", file: "/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3" },
      { id: 2, name: "Another", artist: "Full On The Mouth", file: "/music/Full On The Mouth - Another.mp3" }
    ];
    
    this.soundEffects = {
      punch: { file: "/music/punch.mp3", volume: 0.7 },
      button: { file: "/music/button.mp3", volume: 0.3 },
      crowd: { file: "/music/crowd.mp3", volume: 0.15, loop: true }
    };
    
    this.attackTimings = {
      punch: 600,
      kick: 800,
      punches: 1200
    };
    
    this.volumeSettings = {
      music: { combat: 0.6, dance: 0.5 },
      crowd: { combat: 0.25, dance: 0.1 }
    };
    
  }
  
  createAudioElement(id, src, options = {}) {
    if (this.audioElements.has(id)) {
      return this.audioElements.get(id);
    }
    
    const audio = new Audio(src);
    audio.preload = options.preload || 'auto';
    audio.loop = options.loop || false;
    audio.volume = options.volume || 1.0;
    
    this.audioElements.set(id, audio);
    return audio;
  }
  
  getAudioElement(id) {
    return this.audioElements.get(id);
  }
  
  async playAudio(id, options = {}) {
    const audio = this.getAudioElement(id);
    if (!audio) return false;
    
    try {
      audio.currentTime = options.startTime || 0;
      audio.volume = this.calculateVolume(options.volume || audio.volume);
      
      if (options.fadeIn) {
        await this.fadeIn(audio, options.fadeIn);
      }
      
      await audio.play();
      return true;
    } catch (error) {
      console.warn(`Failed to play audio ${id}:`, error);
      return false;
    }
  }
  
  pauseAudio(id) {
    const audio = this.getAudioElement(id);
    if (audio && !audio.paused) {
      audio.pause();
    }
  }
  
  stopAudio(id) {
    const audio = this.getAudioElement(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
  
  setVolume(id, volume) {
    const audio = this.getAudioElement(id);
    if (audio) {
      audio.volume = this.calculateVolume(volume);
    }
  }
  
  calculateVolume(volume) {
    if (this.isMuted) return 0;
    return Math.max(0, Math.min(1, volume * this.masterVolume));
  }
  
  async fadeIn(audio, duration = 1000) {
    const startVolume = 0;
    const endVolume = audio.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = (endVolume - startVolume) / steps;
    
    audio.volume = startVolume;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      audio.volume = this.calculateVolume(startVolume + (volumeStep * i));
    }
  }
  
  
  setCombatMode(isCombat) {
    this.isCombatMode = isCombat;
    this.updateMusicVolume();
    this.updateCrowdVolume();
  }
  
  updateMusicVolume() {
    const musicAudio = this.getAudioElement('music');
    if (musicAudio) {
      const targetVolume = this.isCombatMode ? 
        this.volumeSettings.music.combat : 
        this.volumeSettings.music.dance;
      this.setVolume('music', targetVolume);
    }
  }
  
  updateCrowdVolume() {
    const crowdAudio = this.getAudioElement('crowd');
    if (crowdAudio) {
      const targetVolume = this.isCombatMode ? 
        this.volumeSettings.crowd.combat : 
        this.volumeSettings.crowd.dance;
      this.setVolume('crowd', targetVolume);
    }
  }
  
  async playMusic(trackId = null) {
    const targetTrack = trackId !== null ? trackId : this.currentMusicTrack;
    const track = this.musicTracks[targetTrack];
    
    if (!track || !track.file) {
      this.stopMusic();
      return false;
    }
    
    const musicAudio = this.createAudioElement('music', track.file, {
      preload: 'auto',
      loop: false
    });
    
    if (this.isMusicPlaying) {
      this.stopMusic();
    }
    
    this.currentMusicTrack = targetTrack;
    this.isMusicPlaying = true;
    
    musicAudio.onended = () => {
      this.nextTrack();
    };
    
    const success = await this.playAudio('music', {
      volume: this.isCombatMode ? 
        this.volumeSettings.music.combat : 
        this.volumeSettings.music.dance
    });
    
    if (!success) {
      this.isMusicPlaying = false;
    }
    
    return success;
  }
  
  stopMusic() {
    this.pauseAudio('music');
    this.isMusicPlaying = false;
  }
  
  nextTrack() {
    const nextIndex = (this.currentMusicTrack + 1) % this.musicTracks.length;
    this.playMusic(nextIndex);
  }
  
  async playSoundEffect(soundId, options = {}) {
    const sound = this.soundEffects[soundId];
    if (!sound) return false;
    
    const audioId = `sfx_${soundId}`;
    const audio = this.createAudioElement(audioId, sound.file, {
      volume: sound.volume,
      loop: sound.loop || false
    });
    
    return await this.playAudio(audioId, {
      volume: sound.volume,
      ...options
    });
  }
  
  playCombatSound(attackType, delay = 0) {
    const timing = this.attackTimings[attackType] || 800;
    const totalDelay = delay + timing;
    
    setTimeout(() => {
      this.playSoundEffect('punch');
    }, totalDelay);
  }
  
  playButtonSound() {
    this.playSoundEffect('button');
  }
  
  async startCrowdSound() {
    const crowdAudio = this.createAudioElement('crowd', this.soundEffects.crowd.file, {
      loop: true,
      volume: this.isCombatMode ? 
        this.volumeSettings.crowd.combat : 
        this.volumeSettings.crowd.dance
    });
    
    return await this.playAudio('crowd');
  }
  
  stopCrowdSound() {
    this.stopAudio('crowd');
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateMusicVolume();
    this.updateCrowdVolume();
  }
  
  mute() {
    this.isMuted = true;
    this.updateMusicVolume();
    this.updateCrowdVolume();
  }
  
  unmute() {
    this.isMuted = false;
    this.updateMusicVolume();
    this.updateCrowdVolume();
  }
  
  cleanup() {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioElements.clear();
  }
  
  getCurrentTrack() {
    return this.musicTracks[this.currentMusicTrack];
  }
  
  isTrackPlaying() {
    return this.isMusicPlaying;
  }
}

export default AudioManager;
