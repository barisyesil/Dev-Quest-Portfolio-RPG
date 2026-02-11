import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import InteractionManager from './utils/InteractionManager';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    
    if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
    }

    const timer = setTimeout(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800, 
            height: 600,
            parent: 'game-container',
            pixelArt: true,
            transparent: true,
            physics: {
                default: 'arcade',
                arcade: { 
                    gravity: { y: 0 },
                    debug: false 
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                resizeInterval: 200 
            },
            scene: { preload, create, update }
        };

        gameRef.current = new Phaser.Game(config);

    }, 100);


    function preload() {
        this.load.tilemapTiledJSON('map', '/assets/maps/room1.json');
        this.load.image('interiors_img', '/assets/images/interiors.png');
        this.load.image('room_builder_img', '/assets/images/room_builder.png');
        this.load.image('tileset3_img', '/assets/images/tileset_3.png'); 

        this.load.spritesheet('player', '/assets/images/character.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('ai_secretary', '/assets/images/ai_npc_secretary.png', {
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

        map.createLayer('Ground', allTilesets, 0, 0);
        map.createLayer('walls 3d', allTilesets, 0, 0);
        map.createLayer('Rug etc', allTilesets, 0, 0);
        const interiorsLayer = map.createLayer('Interiors', allTilesets, 0, 0);
        map.createLayer('susleme', allTilesets, 0, 0);
        const wallsLayer = map.createLayer('Walls', allTilesets, 0, 0);

        wallsLayer.setCollisionByExclusion([-1]);
        interiorsLayer.setCollisionByExclusion([-1]);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const spawnPoint = map.findObject('Interactions', obj => obj.name === 'spawn_point');
        const spawnPointAI = map.findObject('Interactions', obj => obj.name === 'spawn_point_ai');
        const spawnX = spawnPoint ? spawnPoint.x : 200;
        const spawnY = spawnPoint ? spawnPoint.y : 200;
        const spawnXAI = spawnPointAI ? spawnPointAI.x : 250;
        const spawnYAI = spawnPointAI ? spawnPointAI.y : 250;

        this.player = this.physics.add.sprite(spawnX, spawnY, 'player', 0);
        this.player.body.setSize(8, 8).setOffset(12, 24);
        this.player.setCollideWorldBounds(true); 

        this.ai_secretary = this.physics.add.sprite(spawnXAI, spawnYAI, 'ai_secretary', 0);
        this.ai_secretary.body.setSize(8, 8).setOffset(12, 24);
        

        
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

            anims.create({ key: 'idle-ai', frames: anims.generateFrameNumbers('ai_secretary', { start: 8, end: 11 }), frameRate: 6, repeat: -1 });

        }


        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2.5); 
        
        // --- KLAVYE TANIMLAMALARI ---
        // Ok Tuşları
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD Tuşları (YENİ EKLENDİ)
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.interactionManager = new InteractionManager(this);
        this.interactionManager.init(map);
    }

    function update() {
        // 1. ÖNCE ETKİLEŞİM YÖNETİCİSİNİ ÇALIŞTIR
        if (this.interactionManager) this.interactionManager.update();

        const currentAnim = this.ai_secretary.anims.currentAnim?.key; // Aı NPC Mevcut animasyonu kontrol et
        if (!currentAnim || !currentAnim.startsWith('idle-ai')) {
            this.ai_secretary.anims.play('idle-ai', true);
        }
        
        // 2. UI KONTROLÜ
        if (window.isUIOpen) {
            this.player.setVelocity(0);
            
            const currentAnim = this.player.anims.currentAnim?.key;
            if (currentAnim && currentAnim.startsWith('walk-')) {
                 this.player.anims.play(currentAnim.replace('walk-', 'idle-'), true);
            }

            if (this.input.keyboard.enabled) {
                this.input.keyboard.enabled = false;
                this.input.keyboard.resetKeys();
            }
            return; 
        }

        // 3. UI KAPALIYSA KLAVYEYİ GERİ AÇ
        if (!this.input.keyboard.enabled) {
            this.input.keyboard.enabled = true;
        }

        // 4. OYUNCU HAREKET MANTIĞI
        const speed = 60; 
        this.player.setVelocity(0);
        
        let velocityX = 0;
        let velocityY = 0;

        // --- YATAY HAREKET (Oklar VEYA 'A'/'D') ---
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -speed;
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = speed;
            this.player.anims.play('walk-left', true);
        }

        // --- DİKEY HAREKET (Oklar VEYA 'W'/'S') ---
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -speed;
            if (velocityX === 0) this.player.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = speed;
            if (velocityX === 0) this.player.anims.play('walk-down', true);
        }

        this.player.setVelocity(velocityX, velocityY);

        // HAREKET DURDUYSA IDLE ANİMASYONU
        if (velocityX === 0 && velocityY === 0) {
            const currentAnim = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'idle-down';
            if (currentAnim.startsWith('walk-')) {
                 const idleKey = currentAnim.replace('walk-', 'idle-');
                 this.player.anims.play(idleKey, true);
            }
        }
    }

    return () => {
        clearTimeout(timer);
        if (gameRef.current) {
            gameRef.current.destroy(true);
            gameRef.current = null;
        }
    };
  }, []); 

  return <div id="game-container" style={{ width: '100%', height: '105%' }} />;
};

export default Game;