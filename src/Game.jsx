import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import InteractionManager from './utils/InteractionManager';

const Game = () => {
  
  useEffect(() => {
    
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      pixelArt: true, // Piksellerin keskin görünmesi için şart
      physics: {
        default: 'arcade',
        arcade: { debug: true }
      },
      scene: { preload, create, update }
    };

    const game = new Phaser.Game(config);

   function preload() {
            // Harita ve Tileset Görsellerini Yükle
            this.load.tilemapTiledJSON('map', '/assets/maps/room1.json');
            this.load.image('interiors_img', '/assets/images/interiors.png');
            this.load.image('room_builder_img', '/assets/images/room_builder.png');
            // Yeni eklediğin tileset görselini de buraya ekliyoruz
            this.load.image('tileset3_img', '/assets/images/tileset_3.png'); 

            this.load.spritesheet('player', '/assets/images/character.png', {
                frameWidth: 32,
                frameHeight: 32
            });
        }

        function create() {
            const map = this.make.tilemap({ key: 'map' });

            // Tiled'daki isimlerle birebir eşleşmeli
            const interiorsTileset = map.addTilesetImage('Interiors_free_16x16', 'interiors_img');
            const roomBuilderTileset = map.addTilesetImage('Room_Builder_free_16x16', 'room_builder_img');
            const tileset3 = map.addTilesetImage('Tileset_16x16_3', 'tileset3_img');

            const allTilesets = [interiorsTileset, roomBuilderTileset, tileset3];

            // KATMANLAR (Aşağıdan yukarıya doğru render sırası)
            const groundLayer = map.createLayer('Ground', allTilesets, 0, 0);
            const walls3dLayer = map.createLayer('walls 3d', allTilesets, 0, 0);
            const rugLayer = map.createLayer('Rug etc', allTilesets, 0, 0);
            const interiorsLayer = map.createLayer('Interiors', allTilesets, 0, 0);
            const suslemeLayer = map.createLayer('susleme', allTilesets, 0, 0);
            const wallsLayer = map.createLayer('Walls', allTilesets, 0, 0);

            // ÇARPIŞMA AYARLARI
            // İstediğin gibi sadece Walls ve Interiors ile çarpışma sağlıyoruz
            wallsLayer.setCollisionByExclusion([-1]);
            interiorsLayer.setCollisionByExclusion([-1]);

            // Karakter Kurulumu
            // 1. Tiled içindeki spawn_point nesnesini bul
            // 'Interactions' katmanında arıyoruz (ismini Tiled'da ne verdiysen o olmalı)
            const spawnPoint = map.findObject('Interactions', obj => obj.name === 'spawn_point');

            // 2. Karakteri bu koordinatlarda oluştur
            // Eğer spawnPoint bulunamazsa (hata almamak için) varsayılan 200, 200 koordinatlarını kullan
            const spawnX = spawnPoint ? spawnPoint.x : 200;
            const spawnY = spawnPoint ? spawnPoint.y : 200;

    this.player = this.physics.add.sprite(spawnX, spawnY, 'player', 0);
            this.player.body.setSize(8, 8).setOffset(12, 24);

            // Çarpışmaları Fizik Motoruna Ekle
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.player, interiorsLayer);

// --- ANIMASYON TANIMLARI ---
  // Satır 1-4: Idle (0-15 arası kareler)
  const anims = this.anims;
  anims.create({ key: 'idle-down', frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
  anims.create({ key: 'idle-right', frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
  anims.create({ key: 'idle-left', frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
  anims.create({ key: 'idle-up', frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }), frameRate: 6, repeat: -1 });

  // Satır 5-8: Walking (16-31 arası kareler)
  anims.create({ key: 'walk-down', frames: anims.generateFrameNumbers('player', { start: 16, end: 19 }), frameRate: 10, repeat: -1 });
  anims.create({ key: 'walk-right', frames: anims.generateFrameNumbers('player', { start: 20, end: 23 }), frameRate: 10, repeat: -1 });
  anims.create({ key: 'walk-left', frames: anims.generateFrameNumbers('player', { start: 24, end: 27 }), frameRate: 10, repeat: -1 });
  anims.create({ key: 'walk-up', frames: anims.generateFrameNumbers('player', { start: 28, end: 31 }), frameRate: 10, repeat: -1 });

  this.cameras.main.startFollow(this.player);
  this.cameras.main.setZoom(3);
  this.cursors = this.input.keyboard.createCursorKeys();

      // Etkileşim Yöneticisiiçin örnek kullanım
      this.interactionManager = new InteractionManager(this);
      this.interactionManager.init(map);
}


function update() {
  const speed = 125;
  this.player.setVelocity(0);

  if (window.isUIOpen) {
        // Klavyeyi ve global tuş yakalamayı durdur
        if (this.input.keyboard.enabled) {
            this.input.keyboard.enabled = false;
            if (this.input.keyboard.manager) {
                this.input.keyboard.disableGlobalCapture(); // Tarayıcı tuşları serbest bırakır
            }
        }

        // Karakteri durdur
        this.player.setVelocity(0);
        const currentAnim = this.player.anims.currentAnim?.key || 'idle-down';
        this.player.anims.play(currentAnim, true);

        // Label animasyonları çalışmaya devam etsin
        if (this.interactionManager) {
            this.interactionManager.update();
        }
        return; 
    }
    // UI KAPALIYKEN (Oyuna Dönüş)
   if (!this.input.keyboard.enabled) {
        this.input.keyboard.enabled = true;
        if (this.input.keyboard.manager) {
            this.input.keyboard.enableGlobalCapture();
            
            // Interaksiyon tuşunu resetler ve 'temiz' bir JustDown olarak algılanır.
            this.input.keyboard.resetKeys(); 
        }
    }
    
  // Hareket ve Animasyon Kontrolü
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
    this.player.anims.play('walk-right', true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
    this.player.anims.play('walk-left', true);
  } else if (this.cursors.up.isDown) {
    this.player.setVelocityY(-speed);
    this.player.anims.play('walk-up', true);
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(speed);
    this.player.anims.play('walk-down', true);
  } else {
    // Hiçbir tuşa basılmıyorsa en son yöne göre Idle animasyonu oynasın
    const currentAnim = this.player.anims.currentAnim ? this.player.anims.currentAnim.key.split('-')[1] : 'down';
    this.player.anims.play(`idle-${currentAnim}`, true);
  }

  // Etkileşim Yöneticisi güncellemesi
  this.interactionManager.update();
}

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" />;
};

export default Game;