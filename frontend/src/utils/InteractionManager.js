import Phaser from 'phaser';

export default class InteractionManager {
    constructor(scene) {
        this.scene = scene;
        this.interactionPoints = scene.physics.add.group();
        this.activeObject = null;
        this.labels = []; // Tüm etiketleri saklayacağımız dizi
        this.interactKey = this.scene.input.keyboard.addKey('E'); // E tuşunu önceden tanımla
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
                const label = this.scene.add.text(centerX, centerY - 35, labelText, {
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '7px', // Daha büyük
                    fill: '#ffffff',
                    stroke: '#000000', // Simsiyah kalın çerçeve
                    strokeThickness: 4
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
        const time = this.scene.time.now;

        // 1. ANIMASYONLAR (UI Açık olsa bile çalışır)
        this.labels.forEach(labelItem => {
            // Yüzme efekti
            const floatingY = Math.sin(time / 400) * 3; 
            labelItem.textObj.y = labelItem.baseY + floatingY;

            // Parlama Efekti (Burada isUIOpen kontrolü OLMAMALI)
            // Karakter nesnenin içindeyse her zaman parlasın
            const isHovering = this.activeObject === labelItem.sensorObj && 
                               this.scene.physics.overlap(this.scene.player, labelItem.sensorObj);

            if (isHovering) {
                labelItem.textObj.setFill('#ffffff');
                labelItem.textObj.setScale(1.1);
            } else {
                labelItem.textObj.setFill('#f1c40f');
                labelItem.textObj.setScale(1.0);
            }
        });

        // 2. INPUT ENGELLEME (UI Açıksa buradan aşağısı çalışmaz)
        if (window.isUIOpen) return;

        // 3. TUŞ DİNLEME VE ETKİLEŞİM
        if (this.activeObject) {
            const isOverlapping = this.scene.physics.overlap(this.scene.player, this.activeObject);
            
            if (isOverlapping) {
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    
                    const contentKey = this.activeObject.getData('contentKey');

                    if (contentKey === 'social_portal') {
                         window.dispatchEvent(new CustomEvent('openModal', { 
                            detail: { 
                                contentKey: 'social_portal',
                                type: 'social_portal',
                                isStatic: true
                            } 
                        }));
                    } else {
                        window.dispatchEvent(new CustomEvent('openModal', { 
                            detail: { contentKey: contentKey } 
                        }));
                    }
                }
            } else {
                this.activeObject = null;
            }
        }
    }
}