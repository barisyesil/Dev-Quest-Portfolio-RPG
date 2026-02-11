class AudioManager {
    constructor() {
        this.sounds = {};
        this.bgm = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // --- MÜZİK (BGM) ---
        this.bgm = new Audio('/assets/audio/bg_music.mp3');
        this.bgm.loop = true; // Döngüye al
        this.bgm.volume = 0.3; // %30 ses seviyesi (Rahatsız etmesin)

        // --- EFEKTLER (SFX) ---
        this.sounds = {
            interact: new Audio('/assets/audio/interact.wav'),
            type: new Audio('/assets/audio/typing.wav'),
            portal: new Audio('/assets/audio/portal.wav')
        };

        // SFX Ses Ayarları
        this.sounds.interact.volume = 0.5;
        this.sounds.type.volume = 0.2; // Daktilo sesi kısık olsun
        this.sounds.portal.volume = 0.6;

        this.initialized = true;
    }

    // Müziği Başlat (Kullanıcı etkileşimi şart)
    playBGM() {
        if (!this.initialized) this.init();
        if (this.isMuted) return;
        
        // Tarayıcı hatasını önlemek için promise kullanıyoruz
        this.bgm.play().catch(e => console.log("BGM Autoplay engellendi, etkileşim bekleniyor.", e));
    }

    // Efekt Çal
    playSFX(key) {
        if (!this.initialized || this.isMuted || !this.sounds[key]) return;

        // Üst üste çalabilmesi için klonunu oluşturup çalıyoruz
        // (Özellikle daktilo sesi için önemli)
        const soundClone = this.sounds[key].cloneNode();
        soundClone.volume = this.sounds[key].volume;
        soundClone.play().catch(() => {});
    }

    // Sessize Al / Aç
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.bgm.pause();
        } else {
            // Kaldığı yerden devam et
            if (this.bgm.paused) this.bgm.play().catch(() => {});
        }
        
        return this.isMuted;
    }
}

// Singleton (Tekil) olarak dışarı aktar
export const audioManager = new AudioManager();