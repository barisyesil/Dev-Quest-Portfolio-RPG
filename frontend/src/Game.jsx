import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import InteractionManager from './utils/InteractionManager';

const Game = () => {
  // Oyun instance'ını referans olarak tutalım
  const gameRef = useRef(null);

  useEffect(() => {
    
    // Eğer önceki bir oyun instance'ı varsa temizle (Strict Mode için)
    if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
    }

    // KRİTİK DEĞİŞİKLİK: Phaser'ı 100ms gecikmeli başlat
    // Bu, CSS yüklendikten ve div boyutları oluştuktan sonra çalışmasını sağlar.
    const timer = setTimeout(() => {
        const config = {
            type: Phaser.AUTO,
            // Arcade ekranının oranına göre bu çözünürlüğü artırıp azaltabilirsin.
            width: 800, 
            height: 600,
            parent: 'game-container', // HTML'deki bu ID'ye canvas'ı inject edecek
            pixelArt: true,
            transparent: true, // Arka plan şeffaf
            physics: {
                default: 'arcade',
                arcade: { 
                    gravity: { y: 0 },
                    debug: false 
                }
            },
            scale: {
                // FIT modu, canvas'ı parent div'in boyutuna sığdırır.
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                // Resize olaylarını daha sıkı takip et
                resizeInterval: 200 
            },
            scene: { preload, create, update }
        };

        // Oyunu başlat ve ref'e ata
        gameRef.current = new Phaser.Game(config);

    }, 100); // 100ms gecikme


    function preload() {
        this.load.tilemapTiledJSON('map', '/assets/maps/room1.json');
        this.load.image('interiors_img', '/assets/images/interiors.png');
        this.load.image('room_builder_img', '/assets/images/room_builder.png');
        this.load.image('tileset3_img', '/assets/images/tileset_3.png'); 

        this.load.spritesheet('player', '/assets/images/character.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    function create() {
        const map = this.make.tilemap({ key: 'map' });

        const interiorsTileset = map.addTilesetImage('Interiors_free_16x16', 'interiors_img');
        const roomBuilderTileset = map.addTilesetImage('Room_Builder_free_16x16', 'room_builder_img');
        const tileset3 = map.addTilesetImage('Tileset_16x16_3', 'tileset3_img');

        const allTilesets = [interiorsTileset, roomBuilderTileset, tileset3];

        const groundLayer = map.createLayer('Ground', allTilesets, 0, 0);
        const walls3dLayer = map.createLayer('walls 3d', allTilesets, 0, 0);
        const rugLayer = map.createLayer('Rug etc', allTilesets, 0, 0);
        const interiorsLayer = map.createLayer('Interiors', allTilesets, 0, 0);
        const suslemeLayer = map.createLayer('susleme', allTilesets, 0, 0);
        const wallsLayer = map.createLayer('Walls', allTilesets, 0, 0);

        wallsLayer.setCollisionByExclusion([-1]);
        interiorsLayer.setCollisionByExclusion([-1]);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const spawnPoint = map.findObject('Interactions', obj => obj.name === 'spawn_point');
        const spawnX = spawnPoint ? spawnPoint.x : 200;
        const spawnY = spawnPoint ? spawnPoint.y : 200;

        this.player = this.physics.add.sprite(spawnX, spawnY, 'player', 0);
        this.player.body.setSize(8, 8).setOffset(12, 24);
        this.player.setCollideWorldBounds(true); 

        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, interiorsLayer);

        const anims = this.anims;
        if (!anims.exists('idle-down')) { 
            anims.create({ key: 'idle-down', frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            anims.create({ key: 'idle-right', frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
            anims.create({ key: 'idle-left', frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
            anims.create({ key: 'idle-up', frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }), frameRate: 6, repeat: -1 });

            anims.create({ key: 'walk-down', frames: anims.generateFrameNumbers('player', { start: 16, end: 19 }), frameRate: 10, repeat: -1 });
            anims.create({ key: 'walk-right', frames: anims.generateFrameNumbers('player', { start: 20, end: 23 }), frameRate: 10, repeat: -1 });
            anims.create({ key: 'walk-left', frames: anims.generateFrameNumbers('player', { start: 24, end: 27 }), frameRate: 10, repeat: -1 });
            anims.create({ key: 'walk-up', frames: anims.generateFrameNumbers('player', { start: 28, end: 31 }), frameRate: 10, repeat: -1 });
        }

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2.5); 
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.interactionManager = new InteractionManager(this);
        this.interactionManager.init(map);
    }

    function update() {
        if (window.isUIOpen) {
            this.player.setVelocity(0);
            const currentAnim = this.player.anims.currentAnim?.key || 'idle-down';
            this.player.anims.play(currentAnim, true);

            if (this.input.keyboard.enabled) {
                this.input.keyboard.enabled = false;
                this.input.keyboard.resetKeys();
            }
            return; 
        }

        if (!this.input.keyboard.enabled) {
            this.input.keyboard.enabled = true;
        }

        const speed = 80;
        this.player.setVelocity(0);
        let moved = false;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk-right', true);
            moved = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk-left', true);
            moved = true;
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            if (!moved) this.player.anims.play('walk-up', true);
            moved = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            if (!moved) this.player.anims.play('walk-down', true);
            moved = true;
        }

        if (!moved) {
            const currentAnim = this.player.anims.currentAnim ? this.player.anims.currentAnim.key.split('-')[1] : 'down';
            const safeAnim = currentAnim || 'down'; 
            this.player.anims.play(`idle-${safeAnim}`, true);
        }

        if (this.interactionManager) this.interactionManager.update();
    }

    // CLEANUP FONKSİYONU
    return () => {
        // Timer'ı temizle (Hafıza sızıntısı olmasın)
        clearTimeout(timer);
        
        // Oyunu yok et
        if (gameRef.current) {
            gameRef.current.destroy(true);
            gameRef.current = null;
        }
    };
  }, []); // Boş dependency array

  return <div id="game-container" style={{ width: '100%', height: '105%' }} />;
};

export default Game;