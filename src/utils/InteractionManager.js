import Phaser from 'phaser';
export default class InteractionManager {
    constructor(scene) {
        this.scene = scene;
        this.interactionPoints = scene.physics.add.group();
        this.activeObject = null;
        this.labels = []; // Tüm etiketleri saklayacağımız dizi
    }

    init(map) {
        const objectLayer = map.getObjectLayer('Interactions');
        
        if (objectLayer) {
            objectLayer.objects.forEach(obj => {
                const centerX = obj.x + (obj.width / 2);
                const centerY = obj.y + (obj.height / 2);

                // 1. Sensör Oluşturma
                const sensor = this.scene.add.zone(centerX, centerY, obj.width, obj.height);
                this.scene.physics.add.existing(sensor);
                sensor.body.setAllowGravity(false);
                sensor.body.setImmovable(true);
                
                // Tiled'dan gelen özellikleri kaydet
                const contentKey = obj.properties?.find(p => p.name === 'contentKey')?.value;
                const labelText = obj.properties?.find(p => p.name === 'label')?.value;
                
                sensor.setData('contentKey', contentKey);
                this.interactionPoints.add(sensor);

                // 2. Kalıcı Etiket (Label) Oluşturma
                const label = this.scene.add.text(centerX, centerY - 25, labelText, {
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '8px',
                    fill: '#f1c40f', // Altın sarısı, daha dikkat çekici
                    stroke: '#000000',
                    strokeThickness: 3
                });
                label.setOrigin(0.5);
                label.setDepth(2000);
                
                // Etiketi ve ilgili sensörü eşleştirerek sakla
                this.labels.push({
                    textObj: label,
                    sensorObj: sensor,
                    baseY: centerY - 25
                });
            });
        }

        // Çarpışma (Overlap) Takibi
        this.scene.physics.add.overlap(this.scene.player, this.interactionPoints, (player, sensor) => {
            this.activeObject = sensor;
        });
    }

    update() {
        // 1. Tüm etiketleri süzülme animasyonuyla oynat
        if (window.isUIOpen) return;

         const time = this.scene.time.now;
         this.labels.forEach(labelItem => {
            const floatingY = Math.sin(time / 200) * 4;
            labelItem.textObj.y = labelItem.baseY + floatingY;

            // Eğer oyuncu bu etiketin sensörüne yakınsa etiketi parlat (Vurgu)
            if (this.activeObject === labelItem.sensorObj && this.scene.physics.overlap(this.scene.player, labelItem.sensorObj)) {
                labelItem.textObj.setFill('#ffffff'); // Yakındayken beyaz olsun
                labelItem.textObj.setScale(1.1); // Hafif büyüsün
            } else {
                labelItem.textObj.setFill('#f1c40f'); // Uzaktayken sarı
                labelItem.textObj.setScale(1.0);
            }
        });

        // 2. Etkileşim Kontrolü
        if (this.activeObject) {
        const isOverlapping = this.scene.physics.overlap(this.scene.player, this.activeObject);
        
        if (isOverlapping) {
            const eKey = this.scene.input.keyboard.addKey('E');
            if (Phaser.Input.Keyboard.JustDown(eKey)) {
                // Bu event artık sadece UI kapalıyken ateşlenebilir
                window.dispatchEvent(new CustomEvent('openModal', { 
                    detail: { contentKey: this.activeObject.getData('contentKey') } 
                }));
            }
        } else {
            this.activeObject = null;
        }
    }
    }
}