/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var tone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tone */ "./node_modules/tone/build/esm/index.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



//音のテスト関数
const synth = new tone__WEBPACK_IMPORTED_MODULE_0__.PolySynth(tone__WEBPACK_IMPORTED_MODULE_0__.Synth, {
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.9
    }
}).toDestination();
class ThreeJSContainer {
    scene;
    clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock(); // 時間経過を追跡
    maxTrailPoints = 30; // 軌跡の最大点数 (尾の長さ)
    activeStars = []; //動いている隆盛を管理する配列
    //流れ星の尾のセグメントのベースのジオメトリ
    segmentGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(1, 1, 1);
    orbiteRadius = 2; //軌跡の半径
    orbiteSpeed = 4; //軌跡の移動速度
    starHeight = 1.1; // 星の軌道高さをオルゴール部品と干渉しないように設定
    // 周囲に散らす静止した星
    cloudStaticSmall; // 小さい静止星
    cloudStaticMedium; // 中くらいの静止星
    cloudStaticLarge; // 大きい静止星
    starGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(0.1, 16, 16);
    starMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
        color: 0xe0f8ffff,
        blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending
    });
    constructor() {
        window.addEventListener('keydown', this.handleKeyDown);
    }
    //音とキーの場所のマップ
    map = {
        C5: 24,
        "C#5": 23,
        D5: 22,
        "D#5": 21,
        E5: 20,
        F5: 19,
        "F#5": 18,
        G5: 17,
        "G#5": 16,
        A5: 15,
        "A#5": 14,
        B5: 13,
        C6: 12,
        "C#6": 11,
        D6: 10,
        "D#6": 9,
        E6: 8,
        F6: 7,
        "F#6": 6,
        G6: 5,
        "G#6": 4,
        A6: 3,
        "A#6": 2,
        B6: 1,
        C7: 24,
        "C#7": 23,
        D7: 22,
        "D#7": 21,
        E7: 20,
        F7: 19,
        "F#7": 18,
        G7: 17,
        "G#7": 16,
        A7: 15,
        "A#7": 14,
        B7: 13,
        C8: 12,
        "C#8": 11,
        D8: 10,
        "D#8": 9,
        E8: 8,
        F8: 7,
        "F#8": 6,
        G8: 5,
        "G#8": 4,
        A8: 3,
        "A#8": 2,
        B8: 1,
    };
    //keyが押されてから音が鳴るまでの時間
    waitTime = 400;
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    //"E7","F7","G7",null,"E8",null,"C8",null,"D8","C8","C8",null,"B7",null,"B7",null,"D7","E7","F7",null,"D8",null,"B7",null,"C8","B7","A7",null,"G7",null,"G7",null,"E7","F7","G7",null,"C8","D8","E8", null,"D8", "C8","A7",null,"D8","E8","F8", null,"E8", "D8","G7",null,"F8",null,"E8",null,"D8",null,"C8",null,null,null,null,null]
    //null,null,"C6","G6","E6","G6","C6","G6","E6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","B#6","G8","B#6","C6","A6","F6","A6","C6","A#6","E6","A#6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6",null
    playSong = async () => {
        const notes = ["E7", "F7", "G7", null, "E8", null, "C8", null, "D8", "C8", "C8", null, "B7", null, "B7", null, "D7", "E7", "F7", null, "D8", null, "B7", null, "C8", "B7", "A7", null, "G7", null, "G7", null, "E7", "F7", "G7", null, "C8", "D8", "E8", null, "D8", "C8", "A7", null, "D8", "E8", "F8", null, "E8", "D8", "G7", null, "F8", null, "E8", null, "D8", null, "C8", null, null, null, null, null];
        const notes2 = [null, null, "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "C6", "B#6", "G8", "B#6", "C6", "A6", "F6", "A6", "C6", "A#6", "F6", "A#6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "C6", "G6", "E6", "G6", "C6", null];
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] != null) {
                this.launchStar(this.map[notes[i]]);
            }
            if (notes2[i] != null) {
                this.launchStar(this.map[notes2[i]]);
            }
            await this.sleep(this.waitTime);
            if (notes[i] != null) {
                synth.triggerAttackRelease(notes[i], "100n");
            }
            if (notes2[i] != null) {
                synth.triggerAttackRelease(notes2[i], "100n");
            }
        }
    };
    //keyが押されたときのイベントハンドラ
    handleKeyDown = (event) => {
        if (event.key.toLowerCase() === 'z') {
            this.playSong();
        }
        else if (event.key.toLowerCase() === '1') {
            this.launchStar(25);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '2') {
            this.launchStar(24);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '3') {
            this.launchStar(23);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '4') {
            this.launchStar(22);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '5') {
            this.launchStar(21);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '6') {
            this.launchStar(19);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '7') {
            this.launchStar(18);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '8') {
            this.launchStar(17);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '9') {
            this.launchStar(16);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '0') {
            this.launchStar(15);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '-') {
            this.launchStar(14);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '^') {
            this.launchStar(13);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'Backslash') {
            this.launchStar(12);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'q') {
            this.launchStar(11);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'w') {
            this.launchStar(10);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'e') {
            this.launchStar(9);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'r') {
            this.launchStar(8);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 't') {
            this.launchStar(7);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'y') {
            this.launchStar(6);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'u') {
            this.launchStar(5);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'i') {
            this.launchStar(4);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'o') {
            this.launchStar(3);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'p') {
            this.launchStar(2);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '@') {
            this.launchStar(1);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '[') {
            this.launchStar(0);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
    };
    //星が発射されるときのロジック
    launchStar = (interval) => {
        //経過時間
        const currentTime = this.clock.getElapsedTime();
        // 1. 新しいメッシュとグループを生成
        // 【修正済み】ジオメトリとマテリアルを渡す
        const newStarMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(this.starGeometry, this.starMaterial.clone());
        const newTrailGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
        this.scene.add(newStarMesh);
        this.scene.add(newTrailGroup);
        const newStar = {
            mesh: newStarMesh,
            trailGroup: newTrailGroup,
            trailPoints: [],
            trailSegments: [],
            startTime: currentTime,
            isFinished: false,
            interval: interval
        };
        // 初期半径を設定
        const currentRadius = 0.5 * interval;
        // 初期位置を設定 (X=0, Y=starHeight, Z=currentRadius からスタート)
        newStarMesh.position.set(0, this.starHeight, currentRadius);
        this.activeStars.push(newStar);
    };
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000009));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000); //どの様なカメラを使用するか
        camera.position.copy(cameraPos); //カメラの位置は
        camera.lookAt(15, 0, 0); //カメラの注視点
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        // --- パーティクル（星）の作成 ---
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const stardustTexture2 = textureLoader.load('splushStar.png');
        const splushMateri = new three__WEBPACK_IMPORTED_MODULE_2__.PointsMaterial({
            size: 0.1,
            map: stardustTexture2,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            color: 0xf0ffff,
            depthWrite: false,
            transparent: true,
            opacity: 1
        });
        // ★ポイント5: 周囲に散らす静止した星 (cloudStaticLarge)
        let createStaticLargeParticles = () => {
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
            const particleNum = 500;
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            const sceneSpread = 120;
            for (let x = 0; x < particleNum; x++) {
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.5;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(positions, 3));
            this.cloudStaticLarge = new three__WEBPACK_IMPORTED_MODULE_2__.Points(geometry, splushMateri);
            this.scene.add(this.cloudStaticLarge);
        };
        createStaticLargeParticles();
        //音を鳴らす準備
        tone__WEBPACK_IMPORTED_MODULE_0__.start();
        //歯車の動き制御変数
        let isRolling = [];
        let rollAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let orgelX = 0;
        let orgelY = 0;
        let orgelZ = 0;
        let orgelS = 3;
        // オルゴール部品の基本的なマテリアル
        let material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0x808088,
            specular: 0xbbbbbb,
            shininess: 50
        });
        let materialunder = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0x757252,
            specular: 0xcccccc,
            shininess: 1
        });
        const materialu = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            color: 0x000fff,
            transparent: true,
            opacity: 0.2,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide
        });
        // #757252ff
        //通常の振動版の色
        let metalMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            color: 0x9e9683,
        });
        //発光時の振動版の色
        let brightMetalMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0xcccccc,
            specular: 0xffffff,
            shininess: 400,
            // 自己発光色を設定
            emissive: 0x75c4fdff,
            // emissive の強さをコントロール
            emissiveIntensity: 0.8
        });
        // 針の台
        let BigDai = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(7, 0.05, 2.5);
        let meshBigDai = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(BigDai, metalMaterial);
        meshBigDai.position.set(3.6 * orgelS + orgelX, orgelY, orgelZ - 1 * orgelS);
        meshBigDai.scale.set(orgelS, orgelS, orgelS);
        meshBigDai.receiveShadow = true;
        this.scene.add(meshBigDai);
        //ねじの芯の下の四角
        let Bigcircle = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.6, 0.2, 0.6);
        let mesh1 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(Bigcircle, material);
        mesh1.position.set(6.8 * orgelS + orgelX, orgelY + 0.05 * orgelS, -0.05 * orgelS + orgelZ);
        mesh1.scale.set(orgelS, orgelS, orgelS);
        mesh1.castShadow = true;
        this.scene.add(mesh1);
        let middlecircle = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.25, 0.25, 0.3, 32);
        let mesh2 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(middlecircle, material);
        mesh2.position.set(6.8 * orgelS + orgelX, orgelY + 0.25 * orgelS, -0.05 * orgelS + orgelZ);
        mesh2.scale.set(orgelS, orgelS, orgelS);
        mesh2.castShadow = true;
        this.scene.add(mesh2);
        let covercircle = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.15, 0.15, 0.1, 32);
        let mesh3 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(covercircle, material);
        mesh3.position.set(6.8 * orgelS + orgelX, orgelY + 0.45 * orgelS, -0.05 * orgelS + orgelZ);
        mesh3.scale.set(orgelS, orgelS, orgelS);
        mesh3.castShadow = true;
        this.scene.add(mesh3); // シーンに追加
        //振動板のすぐ下の四角の板
        let negiDai = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(4.4, 0.1, 0.5);
        let mesh4 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(negiDai, material);
        mesh4.position.set(2.45 * orgelS + orgelX, orgelY + 0.15 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh4.scale.set(orgelS, orgelS, orgelS);
        mesh4.castShadow = true;
        this.scene.add(mesh4);
        //回すところの取っ手部分
        let totte = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.66, 0.66, 1.5, 6);
        let mesh7 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(totte, material);
        mesh7.position.set(7.65 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ - 0.1);
        mesh7.castShadow = true;
        this.scene.add(mesh7);
        //曲線のパイプ
        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new three__WEBPACK_IMPORTED_MODULE_2__.TubeGeometry(path, 20, 0.5, 8, false);
        const mesh8 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI / 4);
        mesh8.position.set(7.5 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ - 0.1);
        mesh8.castShadow = true;
        this.scene.add(mesh8);
        const uvs = new Float32Array([
            0.5, 1,
            0, 0,
            1, 0 // 右下
            // CircleGeometryの頂点数に合わせて適切なUV座標を定義する必要があります
            // 現在のuvs定義は頂点数3の三角形用で、32セグメントの円には合いません
        ]);
        const loader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const texturet = loader.load('test.png');
        const materiatl = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet,
            transparent: true,
            opacity: 0.3,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            //blending: THREE.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        const texturet2 = loader.load('test2.png');
        const materiatl2 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet2,
            transparent: true,
            opacity: 0.025,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        const texturet3 = loader.load('test3.png');
        const materiatl3 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet3,
            transparent: true,
            opacity: 0.025,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        //オルゴールの下の色付き円盤
        const circlegeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry, materiatl);
        circlemesh.rotateX(-Math.PI / 2);
        circlemesh.position.set(0, -1, 0);
        this.scene.add(circlemesh);
        const circlegeometry2 = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh2 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry2, materiatl2);
        circlemesh2.rotateX(-Math.PI / 2);
        circlemesh2.position.set(0, -0.6, 0);
        this.scene.add(circlemesh2);
        const circlegeometry1 = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh1 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry1, materiatl3);
        circlemesh1.rotateX(-Math.PI / 2);
        circlemesh1.position.set(0, 0, 0);
        this.scene.add(circlemesh1);
        for (let i = 1; i < 10; i++) {
            let circle = circlemesh2.clone();
            circle.position.set(0, -1.5 + 0.15 * i, 0);
            this.scene.add(circle);
        }
        for (let i = 0; i < 10; i++) {
            let circle1 = circlemesh1.clone();
            circle1.position.set(0, 0.15 * i, 0);
            this.scene.add(circle1);
        }
        let mesh = [];
        //振動板
        for (let x = 0; x < 25; x++) {
            let boxes = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.15, 0.01, 1.9);
            mesh[x] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxes, materialunder);
            mesh[x].castShadow = true;
            mesh[x].position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS);
            mesh[x].scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh[x]);
        }
        //振動板の間
        for (let x = 0; x < 24; x++) {
            //1.665 - x *0.055,0.4 + x *0.055
            let boxes = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.15, 0.01, 1.665 - x * 0.05);
            let mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxes, materialunder);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.42 * orgelS + orgelX, orgelY + 0.1999 * orgelS, orgelZ + orgelZ - 1.9 * orgelS + (0.525 - 0.02 * x) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }
        //振動版のすぐ上の四角
        let negiDai2 = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(6, 0.05, 0.5);
        let mesh5 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(negiDai2, material);
        mesh5.position.set(3.3 * orgelS + orgelX, orgelY + 0.21 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh5.scale.set(orgelS, orgelS, orgelS);
        mesh5.castShadow = true;
        this.scene.add(mesh5);
        let material2 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0
        });
        //振動版をとめるねじ３つ
        for (let i = 0; i < 5; i++) {
            let Negi = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.2, 0.2, 0.3, 6);
            let mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(Negi, material2);
            mesh.castShadow = true;
            mesh.position.set((0.7 + i * 1.3) * orgelS + orgelX, orgelY + 0.14 * orgelS, orgelZ + orgelZ + (-1.89) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }
        //ねじの芯
        let NegiCylinder = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.02, 0.02, 5, 6);
        let mesh6 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(NegiCylinder, material);
        mesh6.position.set(2.7 * orgelS + orgelX, orgelY + 0.19 * orgelS, orgelZ + orgelZ);
        mesh6.rotateZ(Math.PI / 2);
        mesh6.castShadow = true;
        this.scene.add(mesh6);
        //歯車
        // 刃の部分宣言
        let breed = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.35, 0.1, 0.02);
        // ★meshBreedを二次元配列として宣言★
        let meshBreed = [];
        for (let x = 0; x < 25; x++) {
            let boxesCylinder = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.12, 0.12, 0.1, 32);
            let cylinderMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxesCylinder, material);
            cylinderMesh.castShadow = true;
            // シリンダーの絶対位置を直接設定 (以前のgearGroup.positionとcylinderMesh.positionの結合結果)
            const cylinderAbsX = (x * 0.25 * orgelS + 0.3 * orgelS + orgelX);
            const cylinderAbsY = (orgelY + 0.2 * orgelS);
            const cylinderAbsZ = (orgelZ + orgelZ);
            cylinderMesh.position.set(cylinderAbsX, cylinderAbsY, cylinderAbsZ);
            cylinderMesh.rotateZ(Math.PI / 2); // シリンダーをXZ平面に寝かせる
            cylinderMesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(cylinderMesh); // ★シーンに直接追加★
            meshBreed[x] = [];
            for (let y = 0; y < 5; y++) {
                let bladeMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(breed, material);
                bladeMesh.castShadow = true;
                bladeMesh.scale.set(orgelS, orgelS, orgelS);
                const angle = (Math.PI / 5) * y;
                bladeMesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ);
                bladeMesh.rotateZ(Math.PI / 2);
                bladeMesh.rotateY(angle);
                // 二次元配列に要素を追加し、シーンにも追加
                meshBreed[x].push(bladeMesh);
                this.scene.add(bladeMesh); // シーン追加
            }
        }
        // 平面の生成
        // --- ライトの設定 ---
        let light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffeebb, 0.8);
        light.position.set(orgelX - 10, orgelY + 15, orgelZ - 10);
        light.castShadow = true;
        const lightTarget = new three__WEBPACK_IMPORTED_MODULE_2__.Object3D();
        lightTarget.position.set(orgelX + 2.5, orgelY, orgelZ);
        this.scene.add(lightTarget);
        light.target = lightTarget;
        const shadowMapSize = 2048;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;
        const shadowCameraHalfSize = 10;
        light.shadow.camera.left = -shadowCameraHalfSize;
        light.shadow.camera.right = shadowCameraHalfSize;
        light.shadow.camera.top = shadowCameraHalfSize;
        light.shadow.camera.bottom = -shadowCameraHalfSize;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 40;
        light.shadow.bias = -0.0005;
        this.scene.add(light);
        //ライトの設定終わり
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            //歯車の動きについて
            for (let i = 0; i < 25; i++) {
                if (isRolling[i]) {
                    mesh[i].material = brightMetalMaterial;
                    for (let j = 0; j < 5; j++) {
                        meshBreed[i][j].rotateY(0.02);
                    }
                    rollAngle[i] += 0.02;
                    if (rollAngle[i] >= Math.PI / 5) {
                        isRolling[i] = false;
                        mesh[i].material = materialunder;
                        rollAngle[i] = 0;
                    }
                }
            }
            //終わりー歯車の動きについて
            //流れ星の動きについて
            const elapsedTime = this.clock.getElapsedTime();
            // アクティブな星をすべて処理するループ
            this.activeStars.forEach(star => {
                if (star.isFinished)
                    return;
                //半径を決める
                this.orbiteRadius = orgelS * (0.25 * star.interval + 0.05);
                //発射されてからの時間
                const timeSineceLaunch = elapsedTime - star.startTime;
                const angle = timeSineceLaunch * this.orbiteSpeed;
                // 1周）を回ったら星を消滅させる
                if (angle > (Math.PI * (4 / 8)) && angle < (Math.PI * (5 / 8))) {
                    isRolling[star.interval - 1] = true;
                }
                if (angle > Math.PI * 1.5) {
                    star.mesh.scale.set(star.mesh.scale.x * 0.9, star.mesh.scale.y * 0.9, star.mesh.scale.z * 0.9);
                    star.trailSegments.forEach((mesh) => {
                        mesh.scale.set(mesh.scale.x * 0.9, mesh.scale.y * 0.9, mesh.scale.z * 0.9);
                    });
                    //star.trailSegments[0].scale.set(star.trailGroup.scale.x*0.9,star.trailGroup.scale.y*0.9,star.trailGroup.scale.z*0.9);
                }
                if (angle > 2 * Math.PI) {
                    star.isFinished = true;
                    // シーンからメッシュを削除
                    this.scene.remove(star.mesh);
                    this.scene.remove(star.trailGroup);
                    return; // 終了したら次の星へ
                }
                //軌道計算
                const trailThickness = 0.04 * orgelS;
                const newX = Math.sin(angle) * this.orbiteRadius;
                // 【修正】Y座標をオルゴール部品より高い位置に設定
                const newY = this.starHeight;
                const newZ = Math.cos(angle) * this.orbiteRadius;
                const newPosition = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(newX, newY, newZ);
                star.mesh.position.copy(newPosition);
                // 軌跡の頂点を追加
                star.trailPoints.push(newPosition.clone());
                // 軌跡の点数を制限
                // 【修正1】maxTrailPointsを超えたとき (>= を > に変更)
                while (star.trailPoints.length > this.maxTrailPoints) {
                    star.trailPoints.shift();
                }
                // 軌跡セグメントの更新
                if (star.trailPoints.length >= 2) {
                    const p1 = star.trailPoints[star.trailPoints.length - 2];
                    const p2 = star.trailPoints[star.trailPoints.length - 1];
                    const distance = p1.distanceTo(p2);
                    const midPoint = p1.clone().clone().lerp(p2, 0.5);
                    let segmentToUpdate;
                    if (star.trailSegments.length < this.maxTrailPoints - 1) {
                        // 新規作成
                        const material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
                            color: 0x88bbff,
                            transparent: true,
                            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
                            depthWrite: false,
                            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide
                        });
                        segmentToUpdate = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(this.segmentGeometry, material);
                        //幅 (X)
                        segmentToUpdate.scale.x = trailThickness;
                        // 【修正2】高さ (Y)
                        segmentToUpdate.scale.y = trailThickness;
                        star.trailGroup.add(segmentToUpdate);
                        star.trailSegments.push(segmentToUpdate);
                    }
                    else {
                        // 再利用（最も古いものを再利用し、配列の最後へ）
                        segmentToUpdate = star.trailSegments.shift();
                        star.trailSegments.push(segmentToUpdate);
                    }
                    // スケールと位置、回転を更新
                    segmentToUpdate.scale.z = distance;
                    segmentToUpdate.position.copy(midPoint);
                    const orientation = new three__WEBPACK_IMPORTED_MODULE_2__.Quaternion();
                    const offset = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3().clone().subVectors(p2, p1);
                    orientation.setFromUnitVectors(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 1), offset.clone().clone().normalize());
                    segmentToUpdate.setRotationFromQuaternion(orientation);
                    // フェードアウト効果の適用
                    star.trailSegments.forEach((mesh, index) => {
                        const ratio = index / star.trailSegments.length;
                        mesh.material.opacity = Math.pow(ratio, 1.5) * 0.8;
                    });
                }
            });
            // 終了した星を activeStars 配列から削除する (リソース管理)
            this.activeStars = this.activeStars.filter(star => !star.isFinished);
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(window.innerWidth, window.innerHeight, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(10, 10, 0)); //カメラの座標
    document.body.appendChild(viewport);
}
class CustomSinCurve extends three__WEBPACK_IMPORTED_MODULE_2__.Curve {
    scale;
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }
    getPoint(t, optionalTarget = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()) {
        const tx = t * 6 - 5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).clone().multiplyScalar(this.scale);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_tone_build_esm-9e8d86"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDcFYsTUFBTSxNQUFNLEdBQUUsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUNwVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxD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OztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBUb25lIGZyb20gXCJ0b25lXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5cblxuLy/pn7Pjga7jg4bjgrnjg4jplqLmlbBcbmNvbnN0IHN5bnRoPW5ldyBUb25lLlBvbHlTeW50aChUb25lLlN5bnRoLHtcbiAgICBvc2NpbGxhdG9yOntcbiAgICAgICAgdHlwZTpcInNpbmVcIlxuICAgIH0sXG4gICAgZW52ZWxvcGU6e1xuICAgICAgICBhdHRhY2s6MC4wMSxcbiAgICAgICAgZGVjYXk6MC41LFxuICAgICAgICBzdXN0YWluOjAuMixcbiAgICAgICAgcmVsZWFzZTowLjlcbiAgICB9XG59KS50b0Rlc3RpbmF0aW9uKCk7XG5cblxuXG4vL+ikh+aVsOOBruWlieS7leOBruaDheWgseOCkuS/neaMgeOBmeOCi+OBn+OCgeOBruWumue+qVxudHlwZSBTdGFyQ29udGFpbmVyPXtcbsKgIMKgIG1lc2g6IFRIUkVFLk1lc2gsLy/mmJ/mnKzkvZPjga7jg6Hjg4Pjgrfjg6VcbsKgIMKgIHRyYWlsR3JvdXA6IFRIUkVFLkdyb3VwLC8v5aWH6Leh44Gu44K744Kw44Oh44Oz44OI5L+d5oyB44Gu44Kw44Or44O844OXXG7CoCDCoCB0cmFpbFBvaW50czogVEhSRUUuVmVjdG9yM1tdLC8v6LuM6Leh44Gu6aCC54K55bqn5qiZ44Gu6YWN5YiXXG7CoCDCoCB0cmFpbFNlZ21lbnRzOiBUSFJFRS5NZXNoW10sLy/ou4zot6Hjga7jg6Hjg4Pjgrfjg6Xkv53mjIHjga7phY3liJdcbsKgIMKgIHN0YXJ0VGltZTogbnVtYmVyLC8v6LuM6Leh56e75YuV6ZaL5aeL5pmC6ZaTXG7CoCDCoCBpc0ZpbmlzaGVkOiBib29sZWFuLC8v6LuM6YGT44KS57WC44GI44Gf44GLXG7CoCDCoCBpbnRlcnZhbDogbnVtYmVyLy/jganjga7pn7PjgYtcbn1cblxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbsKgIMKgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuwqAgwqAgcHJpdmF0ZSBjbG9jazogVEhSRUUuQ2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTsgLy8g5pmC6ZaT57WM6YGO44KS6L+96LehXG7CoCDCoCBwcml2YXRlIG1heFRyYWlsUG9pbnRzID0gMzA7IC8vIOi7jOi3oeOBruacgOWkp+eCueaVsCAo5bC+44Gu6ZW344GVKVxuXG7CoCDCoCBwcml2YXRlIGFjdGl2ZVN0YXJzOlN0YXJDb250YWluZXJbXT1bXTsvL+WLleOBhOOBpuOBhOOCi+mahuebm+OCkueuoeeQhuOBmeOCi+mFjeWIl1xuXG7CoCDCoCAvL+a1geOCjOaYn+OBruWwvuOBruOCu+OCsOODoeODs+ODiOOBruODmeODvOOCueOBruOCuOOCquODoeODiOODqlxuwqAgwqAgcHJpdmF0ZSBzZWdtZW50R2VvbWV0cnk9bmV3IFRIUkVFLkJveEdlb21ldHJ5KDEsMSwxKTtcblxuwqAgwqAgcHJpdmF0ZSBvcmJpdGVSYWRpdXM6bnVtYmVyPTI7IMKgLy/ou4zot6Hjga7ljYrlvoRcbsKgIMKgIHByaXZhdGUgb3JiaXRlU3BlZWQ6bnVtYmVyPTQ7IMKgLy/ou4zot6Hjga7np7vli5XpgJ/luqZcbsKgIMKgIHByaXZhdGUgc3RhckhlaWdodDpudW1iZXIgPSAxLjE7IC8vIOaYn+OBrui7jOmBk+mrmOOBleOCkuOCquODq+OCtOODvOODq+mDqOWTgeOBqOW5sua4ieOBl+OBquOBhOOCiOOBhuOBq+ioreWumlxuXG5cbiAgICAvLyDlkajlm7LjgavmlaPjgonjgZnpnZnmraLjgZfjgZ/mmJ9cbiAgICBwcml2YXRlIGNsb3VkU3RhdGljU21hbGw6IFRIUkVFLlBvaW50czsgXHQvLyDlsI/jgZXjgYTpnZnmraLmmJ9cbiAgICBwcml2YXRlIGNsb3VkU3RhdGljTWVkaXVtOiBUSFJFRS5Qb2ludHM7IFx0Ly8g5Lit44GP44KJ44GE44Gu6Z2Z5q2i5pifXG4gICAgcHJpdmF0ZSBjbG91ZFN0YXRpY0xhcmdlOiBUSFJFRS5Qb2ludHM7IFx0Ly8g5aSn44GN44GE6Z2Z5q2i5pifXG5cbsKgIMKgIHByaXZhdGUgc3Rhckdlb21ldHJ5PW5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjEsMTYsMTYpO1xuwqAgwqAgcHJpdmF0ZSBzdGFyTWF0ZXJpYWw9bmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIGNvbG9yOiAweGUwZjhmZmZmLFxuwqAgwqAgwqAgwqAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgXG7CoCDCoCB9KTtcblxuXG7CoCDCoCBcblxuwqAgwqAgY29uc3RydWN0b3IoKSB7XG7CoCDCoCDCoCDCoHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLmhhbmRsZUtleURvd24pO1xuwqAgwqAgfVxuXG5cblxuICAgIC8v6Z+z44Go44Kt44O844Gu5aC05omA44Gu44Oe44OD44OXXG4gICAgcHJpdmF0ZSBtYXA6UmVjb3JkPHN0cmluZyxudW1iZXI+PXtcbiAgICAgICAgQzU6MjQsXG4gICAgICAgIFwiQyM1XCI6MjMsXG4gICAgICAgIEQ1OjIyLFxuICAgICAgICBcIkQjNVwiOjIxLFxuICAgICAgICBFNToyMCxcbiAgICAgICAgRjU6MTksXG4gICAgICAgIFwiRiM1XCI6MTgsXG4gICAgICAgIEc1OjE3LFxuICAgICAgICBcIkcjNVwiOjE2LFxuICAgICAgICBBNToxNSxcbiAgICAgICAgXCJBIzVcIjoxNCxcbiAgICAgICAgQjU6MTMsXG5cbiAgICAgICAgQzY6MTIsXG4gICAgICAgIFwiQyM2XCI6MTEsXG4gICAgICAgIEQ2OjEwLFxuICAgICAgICBcIkQjNlwiOjksXG4gICAgICAgIEU2OjgsXG4gICAgICAgIEY2OjcsXG4gICAgICAgIFwiRiM2XCI6NixcbiAgICAgICAgRzY6NSxcbiAgICAgICAgXCJHIzZcIjo0LFxuICAgICAgICBBNjozLFxuICAgICAgICBcIkEjNlwiOjIsXG4gICAgICAgIEI2OjEsXG5cblxuICAgICAgICBDNzoyNCxcbiAgICAgICAgXCJDIzdcIjoyMyxcbiAgICAgICAgRDc6MjIsXG4gICAgICAgIFwiRCM3XCI6MjEsXG4gICAgICAgIEU3OjIwLFxuICAgICAgICBGNzoxOSxcbiAgICAgICAgXCJGIzdcIjoxOCxcbiAgICAgICAgRzc6MTcsXG4gICAgICAgIFwiRyM3XCI6MTYsXG4gICAgICAgIEE3OjE1LFxuICAgICAgICBcIkEjN1wiOjE0LFxuICAgICAgICBCNzoxMyxcblxuICAgICAgICBDODoxMixcbiAgICAgICAgXCJDIzhcIjoxMSxcbiAgICAgICAgRDg6MTAsXG4gICAgICAgIFwiRCM4XCI6OSxcbiAgICAgICAgRTg6OCxcbiAgICAgICAgRjg6NyxcbiAgICAgICAgXCJGIzhcIjo2LFxuICAgICAgICBHODo1LFxuICAgICAgICBcIkcjOFwiOjQsXG4gICAgICAgIEE4OjMsXG4gICAgICAgIFwiQSM4XCI6MixcbiAgICAgICAgQjg6MSxcblxuICAgIH07XG5cbiAgICAvL2tleeOBjOaKvOOBleOCjOOBpuOBi+OCiemfs+OBjOmztOOCi+OBvuOBp+OBruaZgumWk1xuICAgIHByaXZhdGUgd2FpdFRpbWU9NDAwO1xuICAgIHByaXZhdGUgc2xlZXAgPSAobXM6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICAgIH07XG4gICAgLy9cIkU3XCIsXCJGN1wiLFwiRzdcIixudWxsLFwiRThcIixudWxsLFwiQzhcIixudWxsLFwiRDhcIixcIkM4XCIsXCJDOFwiLG51bGwsXCJCN1wiLG51bGwsXCJCN1wiLG51bGwsXCJEN1wiLFwiRTdcIixcIkY3XCIsbnVsbCxcIkQ4XCIsbnVsbCxcIkI3XCIsbnVsbCxcIkM4XCIsXCJCN1wiLFwiQTdcIixudWxsLFwiRzdcIixudWxsLFwiRzdcIixudWxsLFwiRTdcIixcIkY3XCIsXCJHN1wiLG51bGwsXCJDOFwiLFwiRDhcIixcIkU4XCIsIG51bGwsXCJEOFwiLCBcIkM4XCIsXCJBN1wiLG51bGwsXCJEOFwiLFwiRThcIixcIkY4XCIsIG51bGwsXCJFOFwiLCBcIkQ4XCIsXCJHN1wiLG51bGwsXCJGOFwiLG51bGwsXCJFOFwiLG51bGwsXCJEOFwiLG51bGwsXCJDOFwiLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF1cbiAgICAvL251bGwsbnVsbCxcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJCIzZcIixcIkc4XCIsXCJCIzZcIixcIkM2XCIsXCJBNlwiLFwiRjZcIixcIkE2XCIsXCJDNlwiLFwiQSM2XCIsXCJFNlwiLFwiQSM2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLG51bGxcbiAgICBwcml2YXRlIHBsYXlTb25nPWFzeW5jKCk9PntcbiAgICAgICAgY29uc3Qgbm90ZXMgPSBbXCJFN1wiLFwiRjdcIixcIkc3XCIsbnVsbCxcIkU4XCIsbnVsbCxcIkM4XCIsbnVsbCxcIkQ4XCIsXCJDOFwiLFwiQzhcIixudWxsLFwiQjdcIixudWxsLFwiQjdcIixudWxsLFwiRDdcIixcIkU3XCIsXCJGN1wiLG51bGwsXCJEOFwiLG51bGwsXCJCN1wiLG51bGwsXCJDOFwiLFwiQjdcIixcIkE3XCIsbnVsbCxcIkc3XCIsbnVsbCxcIkc3XCIsbnVsbCxcIkU3XCIsXCJGN1wiLFwiRzdcIixudWxsLFwiQzhcIixcIkQ4XCIsXCJFOFwiLCBudWxsLFwiRDhcIiwgXCJDOFwiLFwiQTdcIixudWxsLFwiRDhcIixcIkU4XCIsXCJGOFwiLCBudWxsLFwiRThcIiwgXCJEOFwiLFwiRzdcIixudWxsLFwiRjhcIixudWxsLFwiRThcIixudWxsLFwiRDhcIixudWxsLFwiQzhcIixudWxsLG51bGwsbnVsbCxudWxsLG51bGxdO1xuICAgICAgICBjb25zdCBub3RlczIgPVtudWxsLG51bGwsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiQiM2XCIsXCJHOFwiLFwiQiM2XCIsXCJDNlwiLFwiQTZcIixcIkY2XCIsXCJBNlwiLFwiQzZcIixcIkEjNlwiLFwiRjZcIixcIkEjNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixudWxsXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykgeyAgICBcbiAgICAgICAgICAgIGlmKG5vdGVzW2ldIT1udWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxhdW5jaFN0YXIodGhpcy5tYXBbbm90ZXNbaV1dKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBpZihub3RlczJbaV0hPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMubGF1bmNoU3Rhcih0aGlzLm1hcFtub3RlczJbaV1dKTtcbiAgICAgICAgICAgIH0gICAgICBcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2xlZXAodGhpcy53YWl0VGltZSk7XG4gICAgICAgICAgICBpZihub3Rlc1tpXSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2Uobm90ZXNbaV0sIFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBpZihub3RlczJbaV0hPW51bGwpe1xuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKG5vdGVzMltpXSwgXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG7CoCDCoCAvL2tleeOBjOaKvOOBleOCjOOBn+OBqOOBjeOBruOCpOODmeODs+ODiOODj+ODs+ODieODqVxuwqAgwqAgcHJpdmF0ZSBoYW5kbGVLZXlEb3duPShldmVudDpLZXlib2FyZEV2ZW50KT0+e1xuICAgICAgICBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSd6Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnBsYXlTb25nKCk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PScxJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJDNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nMicpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDI0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzMnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigyMyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkU1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSc0Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJGNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nNScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDIxKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRzVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzYnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxOSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkE1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSc3Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJCNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nOCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE3KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQzZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzknKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxNik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkQ2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PScwJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJFNlwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nLScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRjZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J14nKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxMyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkY2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdCYWNrc2xhc2gnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxMik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkc2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdxJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTEpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJBN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0ndycpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDEwKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQjdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2UnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig5KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQzdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3InKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig4KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3QnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig3KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbiAgICAgICAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0neScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDYpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0ndScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0naScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nbycpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDMpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0ncCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nQCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDEpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nWycpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDApO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJEN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfVxuwqAgwqAgfVxuXG5cbsKgIMKgIC8v5pif44GM55m65bCE44GV44KM44KL44Go44GN44Gu44Ot44K444OD44KvXG7CoCDCoCBwcml2YXRlIGxhdW5jaFN0YXI9KGludGVydmFsOm51bWJlcik9PntcbsKgIMKgIMKgIMKgIC8v57WM6YGO5pmC6ZaTXG7CoCDCoCDCoCDCoCBjb25zdCBjdXJyZW50VGltZT10aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbsKgIMKgIMKgIMKgIC8vIDEuIOaWsOOBl+OBhOODoeODg+OCt+ODpeOBqOOCsOODq+ODvOODl+OCkueUn+aIkFxuwqAgwqAgwqAgwqAgLy8g44CQ5L+u5q2j5riI44G/44CR44K444Kq44Oh44OI44Oq44Go44Oe44OG44Oq44Ki44Or44KS5rih44GZXG7CoCDCoCDCoCDCoCBjb25zdCBuZXdTdGFyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuc3Rhckdlb21ldHJ5LCB0aGlzLnN0YXJNYXRlcmlhbC5jbG9uZSgpKTtcbsKgIMKgIMKgIMKgIGNvbnN0IG5ld1RyYWlsR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobmV3U3Rhck1lc2gpO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobmV3VHJhaWxHcm91cCk7XG5cbsKgIMKgIMKgIMKgIGNvbnN0IG5ld1N0YXI6U3RhckNvbnRhaW5lcj17XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoOm5ld1N0YXJNZXNoLFxuwqAgwqAgwqAgwqAgwqAgwqAgdHJhaWxHcm91cDpuZXdUcmFpbEdyb3VwLFxuwqAgwqAgwqAgwqAgwqAgwqAgdHJhaWxQb2ludHM6W10sXG7CoCDCoCDCoCDCoCDCoCDCoCB0cmFpbFNlZ21lbnRzOltdLFxuwqAgwqAgwqAgwqAgwqAgwqAgc3RhcnRUaW1lOmN1cnJlbnRUaW1lLFxuwqAgwqAgwqAgwqAgwqAgwqAgaXNGaW5pc2hlZDpmYWxzZSxcbsKgIMKgIMKgIMKgIMKgIMKgIGludGVydmFsOmludGVydmFsXG7CoCDCoCDCoCDCoCB9O1xuICAgICAgICBcbiAgICAgICAgLy8g5Yid5pyf5Y2K5b6E44KS6Kit5a6aXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSYWRpdXMgPSAwLjUgKiBpbnRlcnZhbDtcblxuwqAgwqAgwqAgwqAgLy8g5Yid5pyf5L2N572u44KS6Kit5a6aIChYPTAsIFk9c3RhckhlaWdodCwgWj1jdXJyZW50UmFkaXVzIOOBi+OCieOCueOCv+ODvOODiClcbsKgIMKgIMKgIMKgIG5ld1N0YXJNZXNoLnBvc2l0aW9uLnNldCgwLCB0aGlzLnN0YXJIZWlnaHQsIGN1cnJlbnRSYWRpdXMpO1xuwqAgwqAgwqAgwqAgdGhpcy5hY3RpdmVTdGFycy5wdXNoKG5ld1N0YXIpO1xuwqAgwqAgfVxuXG7CoCDCoCAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcbsKgIMKgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG7CoCDCoCDCoCDCoCBsZXQgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuwqAgwqAgwqAgwqAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbsKgIMKgIMKgIMKgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4MDAwMDA5KSk7XG7CoCDCoCDCoCDCoCByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgLy/jgqvjg6Hjg6njga7oqK3lrppcbsKgIMKgIMKgIMKgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApOy8v44Gp44Gu5qeY44Gq44Kr44Oh44Op44KS5L2/55So44GZ44KL44GLXG7CoCDCoCDCoCDCoCBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpOyDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+OCq+ODoeODqeOBruS9jee9ruOBr1xuwqAgwqAgwqAgwqAgY2FtZXJhLmxvb2tBdCgxNSwgMCwgMCk7ICDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+OCq+ODoeODqeOBruazqOimlueCuVxuXG7CoCDCoCDCoCDCoCBsZXQgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbsKgIMKgIMKgIMKgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbsKgIMKgIMKgIMKgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuwqAgwqAgwqAgwqAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG7CoCDCoCDCoCDCoCBsZXQgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG7CoCDCoCDCoCDCoCDCoCDCoCBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICDCoCBcblxuwqAgwqAgwqAgwqAgwqAgwqAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG7CoCDCoCDCoCDCoCDCoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbsKgIMKgIMKgIMKgIH1cbsKgIMKgIMKgIMKgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG7CoCDCoCDCoCDCoCByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG7CoCDCoCDCoCDCoCByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuwqAgwqAgwqAgwqAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG7CoCDCoCB9XG5cbsKgIMKgIC8vIOOCt+ODvOODs+OBruS9nOaIkCjlhajkvZPjgacx5ZueKVxuwqAgwqAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIC8vIC0tLSDjg5Hjg7zjg4bjgqPjgq/jg6vvvIjmmJ/vvInjga7kvZzmiJAgLS0tXG4gICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICBjb25zdCBzdGFyZHVzdFRleHR1cmUyID0gdGV4dHVyZUxvYWRlci5sb2FkKCdzcGx1c2hTdGFyLnBuZycpO1xuICAgIFxuICAgICBjb25zdCBzcGx1c2hNYXRlcmkgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgc2l6ZTogMC4xLCAvLyDlm7rlrprjgrXjgqTjgrpBXG4gICAgICAgICBtYXA6IHN0YXJkdXN0VGV4dHVyZTIsXG4gICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgIGNvbG9yOiAweGYwZmZmZiwgLy8g5reh44GE5rC06ImyXG4gICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgb3BhY2l0eTogMVxuICAgICB9KTtcblxuICAgICAvLyDimIXjg53jgqTjg7Pjg4g1OiDlkajlm7LjgavmlaPjgonjgZnpnZnmraLjgZfjgZ/mmJ8gKGNsb3VkU3RhdGljTGFyZ2UpXG4gICAgIGxldCBjcmVhdGVTdGF0aWNMYXJnZVBhcnRpY2xlcyA9ICgpID0+IHtcbiAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICBjb25zdCBwYXJ0aWNsZU51bSA9IDUwMDtcbiAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVOdW0gKiAzKTtcbiAgICBcbiAgICAgICAgIGxldCBwYXJ0aWNsZUluZGV4ID0gMDtcbiAgICAgICAgIGNvbnN0IHNjZW5lU3ByZWFkID0gMTIwO1xuICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBwYXJ0aWNsZU51bTsgeCsrKSB7XG4gICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiBzY2VuZVNwcmVhZDtcbiAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHNjZW5lU3ByZWFkICogMC41O1xuICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogc2NlbmVTcHJlYWQ7XG4gICAgICAgICB9XG4gICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgIHRoaXMuY2xvdWRTdGF0aWNMYXJnZSA9IG5ldyBUSFJFRS5Qb2ludHMoZ2VvbWV0cnksIHNwbHVzaE1hdGVyaSk7XG4gICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNsb3VkU3RhdGljTGFyZ2UpO1xuICAgICB9O1xuICAgIFxuICAgIGNyZWF0ZVN0YXRpY0xhcmdlUGFydGljbGVzKCk7XG4gICAgICAgICAgICBcblxuXG5cbiAgICAgICAgXG4gICAgICAgIC8v6Z+z44KS6bO044KJ44GZ5rqW5YKZXG4gICAgICAgIFRvbmUuc3RhcnQoKTtcbiAgICAgICAgLy/mra/ou4rjga7li5XjgY3liLblvqHlpInmlbBcbiAgICAgICAgbGV0IGlzUm9sbGluZzpib29sZWFuW109W107XG4gICAgICAgIGxldCByb2xsQW5nbGU6bnVtYmVyW109WzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDBdO1xuwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCBsZXQgb3JnZWxYID0gMDtcbsKgIMKgIMKgIMKgIGxldCBvcmdlbFkgPSAwO1xuwqAgwqAgwqAgwqAgbGV0IG9yZ2VsWiA9IDA7XG7CoCDCoCDCoCDCoCBsZXQgb3JnZWxTID0gMztcblxuwqAgwqAgwqAgwqBcbsKgIMKgIMKgIMKgIC8vIOOCquODq+OCtOODvOODq+mDqOWTgeOBruWfuuacrOeahOOBquODnuODhuODquOCouODq1xuwqAgwqAgwqAgwqAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweDgwODA4OCxcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGJiYmJiYixcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogNTBcbsKgIMKgIMKgIMKgIH0pOyDCoCDCoFxuwqAgwqAgwqAgwqAgbGV0IG1hdGVyaWFsdW5kZXIgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4NzU3MjUyLFxuwqAgwqAgwqAgwqAgwqAgwqAgc3BlY3VsYXI6IDB4Y2NjY2NjLFxuwqAgwqAgwqAgwqAgwqAgwqAgc2hpbmluZXNzOiAxXG7CoCDCoCDCoCDCoCB9KTsgwqAgwqBcbsKgIMKgIMKgIMKgIGNvbnN0IG1hdGVyaWFsdSA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHgwMDBmZmYsIC8vIOe3keiJslxuwqAgwqAgwqAgwqAgwqAgwqAgdHJhbnNwYXJlbnQ6IHRydWUsIC8vIOmAj+aYjuW6puOCkuacieWKueOBq+OBmeOCi1xuwqAgwqAgwqAgwqAgwqAgwqAgb3BhY2l0eTogMC4yLCDCoCAvLyDljYrpgI/mmI7jgavoqK3lrpogKDUwJeOBruS4jemAj+aYjuW6pilcbsKgIMKgIMKgIMKgIMKgIMKgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbsKgIMKgIMKgIMKgIH0pOyDCoCDCoFxuXG4gICAgICAgLy8gIzc1NzI1MmZmXG4gICAgICAgIC8v6YCa5bi444Gu5oyv5YuV54mI44Gu6ImyXG7CoCDCoCDCoCDCoCBsZXQgbWV0YWxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHg5ZTk2ODMsXG7CoCDCoCDCoCDCoCB9KTtcbiAgICAgICAgLy/nmbrlhYnmmYLjga7mjK/li5XniYjjga7oibJcbiAgICAgICAgbGV0IGJyaWdodE1ldGFsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4Y2NjY2NjLCAgIC8vIOeJqeS9k+ihqOmdouOBruWPjeWwhOiJsu+8iOODqeOCpOODiOOBruW9semfv+OCkuWPl+OBkeOCi++8iVxuwqAgwqAgwqAgwqAgwqAgwqAgc3BlY3VsYXI6IDB4ZmZmZmZmLCAvLyDpj6HpnaLlj43lsITlhYnjga7oibJcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogNDAwLFxuICAgICAgICAgICAgLy8g6Ieq5bex55m65YWJ6Imy44KS6Kit5a6aXG4gICAgICAgICAgICBlbWlzc2l2ZTogMHg3NWM0ZmRmZiwgXG4gICAgICAgICAgICAvLyBlbWlzc2l2ZSDjga7lvLfjgZXjgpLjgrPjg7Pjg4jjg63jg7zjg6tcbiAgICAgICAgICAgIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjhcbsKgIMKgIMKgIMKgIH0pO1xuwqAgwqAgwqAgwqAgLy8g6Yed44Gu5Y+wXG7CoCDCoCDCoCDCoCBsZXQgQmlnRGFpID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDcsIDAuMDUsIDIuNSk7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaEJpZ0RhaSA9IG5ldyBUSFJFRS5NZXNoKEJpZ0RhaSwgbWV0YWxNYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoQmlnRGFpLnBvc2l0aW9uLnNldCgzLjYgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSwgb3JnZWxaIC0gMSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoQmlnRGFpLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2hCaWdEYWkucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoQmlnRGFpKTsgwqAgwqBcblxuwqAgwqAgwqAgwqAgLy/jga3jgZjjga7oiq/jga7kuIvjga7lm5vop5JcbsKgIMKgIMKgIMKgIGxldCBCaWdjaXJjbGUgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMC42LCAwLjIsIDAuNik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDEgPSBuZXcgVEhSRUUuTWVzaChCaWdjaXJjbGUsIG1hdGVyaWFsKTtcbsKgIMKgIMKgIMKgIG1lc2gxLnBvc2l0aW9uLnNldCg2LjggKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMDUgKiBvcmdlbFMsLTAuMDUgKiBvcmdlbFMrIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoMS5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoMS5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gxKTsgwqAgwqAgXG5cbsKgIMKgIMKgIMKgIGxldCBtaWRkbGVjaXJjbGUgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjI1LCAwLjI1LCAwLjMsIDMyKTtcbsKgIMKgIMKgIMKgIGxldCBtZXNoMiA9IG5ldyBUSFJFRS5NZXNoKG1pZGRsZWNpcmNsZSwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDIucG9zaXRpb24uc2V0KDYuOCAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4yNSAqIG9yZ2VsUywgLTAuMDUgKiBvcmdlbFMrb3JnZWxaKTtcbsKgIMKgIMKgIMKgIG1lc2gyLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2gyLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDIpOyDCoCDCoFxuXG7CoCDCoCDCoCDCoCBsZXQgY292ZXJjaXJjbGUgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjE1LCAwLjE1LCAwLjEsIDMyKTtcbsKgIMKgIMKgIMKgIGxldCBtZXNoMyA9IG5ldyBUSFJFRS5NZXNoKGNvdmVyY2lyY2xlLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoMy5wb3NpdGlvbi5zZXQoNi44ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjQ1ICogb3JnZWxTLCAtMC4wNSAqIG9yZ2VsUysgb3JnZWxaKTtcbsKgIMKgIMKgIMKgIG1lc2gzLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2gzLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDMpOyAvLyDjgrfjg7zjg7Pjgavov73liqBcblxuwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCAvL+aMr+WLleadv+OBruOBmeOBkOS4i+OBruWbm+inkuOBruadv1xuwqAgwqAgwqAgwqAgbGV0IG5lZ2lEYWkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoNC40LCAwLjEsIDAuNSk7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDQgPSBuZXcgVEhSRUUuTWVzaChuZWdpRGFpLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoNC5wb3NpdGlvbi5zZXQoMi40NSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4xNSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaIC0gMS45ICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g0LnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g0LmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDQpO1xuXG5cblxuICAgICAgICAvL+WbnuOBmeOBqOOBk+OCjeOBruWPluOBo+aJi+mDqOWIhlxuICAgICAgICBsZXQgdG90dGUgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjY2LCAwLjY2LCAxLjUsIDYpO1xuICAgICAgICBsZXQgbWVzaDcgPSBuZXcgVEhSRUUuTWVzaCh0b3R0ZSwgbWF0ZXJpYWwpO1xuICAgICAgICBtZXNoNy5wb3NpdGlvbi5zZXQoNy42NSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMS41ICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFotMC4xKTtcbiAgICAgICAgbWVzaDcuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG1lc2g3KTtcblxuICAgICAgICAvL+absue3muOBruODkeOCpOODl1xuICAgICAgICBjb25zdCBwYXRoID0gbmV3IEN1c3RvbVNpbkN1cnZlKG9yZ2VsUyAqIDAuMik7XG4gICAgICAgIGNvbnN0IGdlb21ldHJ5MSA9IG5ldyBUSFJFRS5UdWJlR2VvbWV0cnkocGF0aCwgMjAsIDAuNSwgOCwgZmFsc2UpO1xuICAgICAgICBjb25zdCBtZXNoOCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MSwgbWF0ZXJpYWwpO1xuICAgICAgICBtZXNoOC5yb3RhdGVaKE1hdGguUEkvNCApO1xuICAgICAgICBtZXNoOC5wb3NpdGlvbi5zZXQoNy41ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAxLjIgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWi0wLjEpO1xuICAgICAgICBcbiAgICAgICAgbWVzaDguY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG1lc2g4KTtcblxuXG4gICAgICAgIGNvbnN0IHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgICAgICAgICAwLjUsIDEsIC8vIOS4reW/g1xuICAgICAgICAgICAgICAgICAgICAwLCAwLCAgIC8vIOW3puS4i1xuICAgICAgICAgICAgICAgICAgICAxLCAwICAgIC8vIOWPs+S4i1xuICAgICAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBrumggueCueaVsOOBq+WQiOOCj+OBm+OBpumBqeWIh+OBqlVW5bqn5qiZ44KS5a6a576p44GZ44KL5b+F6KaB44GM44GC44KK44G+44GZXG4gICAgICAgICAgICAgICAgICAgIC8vIOePvuWcqOOBrnV2c+Wumue+qeOBr+mggueCueaVsDPjga7kuInop5LlvaLnlKjjgafjgIEzMuOCu+OCsOODoeODs+ODiOOBruWGhuOBq+OBr+WQiOOBhOOBvuOBm+OCk1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZXQgPSBsb2FkZXIubG9hZCgndGVzdC5wbmcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhdGwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgICAgICAgICAgIG1hcDogdGV4dHVyZXQsXG4gICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSwgXHQvLyDjgZPjgozjgpIgJ3RydWUnIOOBq+OBl+OBquOBhOOBqCAnb3BhY2l0eScg44GM5Yq544GN44G+44Gb44KTXG4gICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjMsIFx0XHQvLyA3MCXjga7kuI3pgI/mmI7luqbvvIgzMCXpgI/mmI7vvInjgavoqK3lrprjgZfjgb7jgZlcbiAgICAgICAgICAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgLC8vIOW/heimgeOBp+OBguOCjOOBsOS4oemdouihqOekuuOBq1xuICAgICAgICAgICAgICAgICAgICAgLy9ibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlIC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOmAj+OBkeOBpuimi+OBiOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0dXJldDIgPSBsb2FkZXIubG9hZCgndGVzdDIucG5nJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYXRsMiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge1xuICAgICAgICAgICAgICAgICAgICAgbWFwOiB0ZXh0dXJldDIsXG4gICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSwgXHQvLyDjgZPjgozjgpIgJ3RydWUnIOOBq+OBl+OBquOBhOOBqCAnb3BhY2l0eScg44GM5Yq544GN44G+44Gb44KTXG4gICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjAyNSwgXHRcdC8vIDcwJeOBruS4jemAj+aYjuW6pu+8iDMwJemAj+aYju+8ieOBq+ioreWumuOBl+OBvuOBmVxuICAgICAgICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSAsLy8g5b+F6KaB44Gn44GC44KM44Gw5Lih6Z2i6KGo56S644GrXG4gICAgICAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlIC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOmAj+OBkeOBpuimi+OBiOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHR1cmV0MyA9IGxvYWRlci5sb2FkKCd0ZXN0My5wbmcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhdGwzID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7XG4gICAgICAgICAgICAgICAgICAgICBtYXA6IHRleHR1cmV0MyxcbiAgICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLCBcdC8vIOOBk+OCjOOCkiAndHJ1ZScg44Gr44GX44Gq44GE44GoICdvcGFjaXR5JyDjgYzlirnjgY3jgb7jgZvjgpNcbiAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMDI1LCBcdFx0Ly8gNzAl44Gu5LiN6YCP5piO5bqm77yIMzAl6YCP5piO77yJ44Gr6Kit5a6a44GX44G+44GZXG4gICAgICAgICAgICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlICwvLyDlv4XopoHjgafjgYLjgozjgbDkuKHpnaLooajnpLrjgatcbiAgICAgICAgICAgICAgICAgICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuICAgICAgICAgICAgICAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UgLy8g44OR44O844OG44Kj44Kv44Or44GM6YCP44GR44Gm6KaL44GI44KL44KI44GG44GrXG4gICAgICAgICAgICAgICAgfSApO1xuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIC8v44Kq44Or44K044O844Or44Gu5LiL44Gu6Imy5LuY44GN5YaG55ukXG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoIDIwLCAzMiApO1xuICAgICAgICAgICAgICAgIC8vIENpcmNsZUdlb21ldHJ544Gv44OH44OV44Kp44Or44OI44Gn6YGp5YiH44GqVVbluqfmqJnjgpLmjIHjgaTjgZ/jgoHjgIHpgJrluLjjga/ku6XkuIvjga7ooYzjga/kuI3opoHjgafjgZnjgIJcbiAgICAgICAgICAgICAgICAvLyDjgoLjgZdgcC5wbmdg44GM5YaG5b2i44Gn44CB44OH44OV44Kp44Or44OI44GuVVbjgafllY/poYzjgarjgZHjgozjgbDjgZPjga7ooYzjgpLliYrpmaTjgZfjgabjgY/jgaDjgZXjgYTjgIJcbiAgICAgICAgICAgICAgICAvLyBjaXJjbGVnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIHV2cywgMikpO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGVtZXNoPW5ldyBUSFJFRS5NZXNoKGNpcmNsZWdlb21ldHJ5LCBtYXRlcmlhdGwpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gucm90YXRlWCgtTWF0aC5QSS8yKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoLnBvc2l0aW9uLnNldCgwLC0xLDApO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZW1lc2gpO1xuXG5cbiAgICAgICAgICAgICAgICBjb25zdCBjaXJjbGVnZW9tZXRyeTIgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoIDIwLCAzMiApO1xuICAgICAgICAgICAgICAgIC8vIENpcmNsZUdlb21ldHJ544Gv44OH44OV44Kp44Or44OI44Gn6YGp5YiH44GqVVbluqfmqJnjgpLmjIHjgaTjgZ/jgoHjgIHpgJrluLjjga/ku6XkuIvjga7ooYzjga/kuI3opoHjgafjgZnjgIJcbiAgICAgICAgICAgICAgICAvLyDjgoLjgZdgcC5wbmdg44GM5YaG5b2i44Gn44CB44OH44OV44Kp44Or44OI44GuVVbjgafllY/poYzjgarjgZHjgozjgbDjgZPjga7ooYzjgpLliYrpmaTjgZfjgabjgY/jgaDjgZXjgYTjgIJcbiAgICAgICAgICAgICAgICAvLyBjaXJjbGVnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIHV2cywgMikpO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGVtZXNoMj1uZXcgVEhSRUUuTWVzaChjaXJjbGVnZW9tZXRyeTIsIG1hdGVyaWF0bDIpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gyLnJvdGF0ZVgoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgY2lyY2xlbWVzaDIucG9zaXRpb24uc2V0KDAsLTAuNiwwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGVtZXNoMik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjaXJjbGVnZW9tZXRyeTEgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoIDIwLCAzMiApO1xuICAgICAgICAgICAgICAgIC8vIENpcmNsZUdlb21ldHJ544Gv44OH44OV44Kp44Or44OI44Gn6YGp5YiH44GqVVbluqfmqJnjgpLmjIHjgaTjgZ/jgoHjgIHpgJrluLjjga/ku6XkuIvjga7ooYzjga/kuI3opoHjgafjgZnjgIJcbiAgICAgICAgICAgICAgICAvLyDjgoLjgZdgcC5wbmdg44GM5YaG5b2i44Gn44CB44OH44OV44Kp44Or44OI44GuVVbjgafllY/poYzjgarjgZHjgozjgbDjgZPjga7ooYzjgpLliYrpmaTjgZfjgabjgY/jgaDjgZXjgYTjgIJcbiAgICAgICAgICAgICAgICAvLyBjaXJjbGVnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIHV2cywgMikpO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGVtZXNoMT1uZXcgVEhSRUUuTWVzaChjaXJjbGVnZW9tZXRyeTEsIG1hdGVyaWF0bDMpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gxLnJvdGF0ZVgoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgY2lyY2xlbWVzaDEucG9zaXRpb24uc2V0KDAsMCwwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGVtZXNoMSk7XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MTtpPDEwO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaXJjbGU9Y2lyY2xlbWVzaDIuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLnBvc2l0aW9uLnNldCgwLC0xLjUrMC4xNSppLDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8MTA7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNpcmNsZTE9Y2lyY2xlbWVzaDEuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlMS5wb3NpdGlvbi5zZXQoMCwwLjE1KmksMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZTEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgXG5cblxuXG4gICAgICAgIFxuwqAgXG7CoCDCoCDCoCAgwqBsZXQgbWVzaDogVEhSRUUuTWVzaFtdPVtdO1xuXG7CoCDCoCDCoCDCoCAvL+aMr+WLleadv1xuwqAgwqAgwqAgwqAgZm9yIChsZXQgeCA9IDA7IHggPCAyNTsgeCsrKSB7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgYm94ZXMgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMC4xNSwgMC4wMSwgMS45KTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2hbeF0gPSBuZXcgVEhSRUUuTWVzaChib3hlcywgIG1hdGVyaWFsdW5kZXIpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaFt4XS5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2hbeF0ucG9zaXRpb24uc2V0KHggKiAwLjI1ICogb3JnZWxTICsgMC4zICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjIgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWiAtIDEuMSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoW3hdLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2hbeF0pO1xuwqAgwqAgwqAgwqAgfVxuXG5cbsKgIMKgIMKgIMKgIC8v5oyv5YuV5p2/44Gu6ZaTXG7CoCDCoCDCoCDCoCBmb3IgKGxldCB4ID0gMDsgeCA8IDI0OyB4KyspIHtcbiAgICAgICAgICAgIC8vMS42NjUgLSB4ICowLjA1NSwwLjQgKyB4ICowLjA1NVxuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJveGVzID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuMTUsIDAuMDEsMS42NjUgLSB4ICowLjA1KTtcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goYm94ZXMsICBtYXRlcmlhbHVuZGVyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLnBvc2l0aW9uLnNldCh4ICogMC4yNSAqIG9yZ2VsUyArIDAuNDIqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4xOTk5ICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFogLSAxLjkgKiBvcmdlbFMgKyggMC41MjUtMC4wMiAqIHgpICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2guc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG7CoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIC8v5oyv5YuV54mI44Gu44GZ44GQ5LiK44Gu5Zub6KeSXG7CoCDCoCDCoCDCoCBsZXQgbmVnaURhaTIgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoNiwgMC4wNSwgMC41KTtcbsKgIMKgIMKgIMKgIGxldCBtZXNoNSA9IG5ldyBUSFJFRS5NZXNoKG5lZ2lEYWkyLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoNS5wb3NpdGlvbi5zZXQoMy4zICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjIxICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFogLSAxLjkgKiBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaDUuc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaDUuY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoNSk7XG5cbsKgIMKgIMKgIMKgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4ZmZmZmZmLFxuwqAgwqAgwqAgwqAgwqAgwqAgc3BlY3VsYXI6IDB4ZmZmZmZmLFxuwqAgwqAgwqAgwqAgwqAgwqAgc2hpbmluZXNzOiAwXG7CoCDCoCDCoCDCoCB9KTtcblxuwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCAvL+aMr+WLleeJiOOCkuOBqOOCgeOCi+OBreOBmO+8k+OBpFxuwqAgwqAgwqAgwqAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBOZWdpID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4yLCAwLjIsIDAuMywgNik7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKE5lZ2ksIG1hdGVyaWFsMik7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaC5wb3NpdGlvbi5zZXQoKDAuNyArIGkgKiAxLjMpICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjE0ICogb3JnZWxTLCDCoCBvcmdlbFogKyBvcmdlbFogKyAoLTEuODkpICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2guc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG7CoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIC8v44Gt44GY44Gu6IqvXG7CoCDCoCDCoCDCoCBsZXQgTmVnaUN5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4wMiwgMC4wMiwgNSwgNik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDYgPSBuZXcgVEhSRUUuTWVzaChOZWdpQ3lsaW5kZXIsIG1hdGVyaWFsKTtcbsKgIMKgIMKgIMKgIG1lc2g2LnBvc2l0aW9uLnNldCgyLjcgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMTkgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoNi5yb3RhdGVaKE1hdGguUEkgLyAyKTtcbsKgIMKgIMKgIMKgIG1lc2g2LmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDYpO1xuXG5cblxuwqAgwqAgwqAgwqAgLy/mra/ou4pcbsKgIMKgIMKgIMKgIC8vIOWIg+OBrumDqOWIhuWuo+iogFxuwqAgwqAgwqAgwqAgbGV0IGJyZWVkID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuMzUsIDAuMSwgMC4wMik7XG5cbsKgIMKgIMKgIMKgIC8vIOKYhW1lc2hCcmVlZOOCkuS6jOasoeWFg+mFjeWIl+OBqOOBl+OBpuWuo+iogOKYhVxuwqAgwqAgwqAgwqAgbGV0IG1lc2hCcmVlZDogVEhSRUUuTWVzaFtdW10gPSBbXTsgXG5cbsKgIMKgIMKgIMKgIGZvciAobGV0IHggPSAwOyB4IDwgMjU7IHgrKykge1xuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJveGVzQ3lsaW5kZXIgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjEyLCAwLjEyLCAwLjEsIDMyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBjeWxpbmRlck1lc2ggPSBuZXcgVEhSRUUuTWVzaChib3hlc0N5bGluZGVyLCBtYXRlcmlhbCk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgY3lsaW5kZXJNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCAvLyDjgrfjg6rjg7Pjg4Djg7zjga7ntbblr77kvY3nva7jgpLnm7TmjqXoqK3lrpogKOS7peWJjeOBrmdlYXJHcm91cC5wb3NpdGlvbuOBqGN5bGluZGVyTWVzaC5wb3NpdGlvbuOBrue1kOWQiOe1kOaenClcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGN5bGluZGVyQWJzWCA9ICh4ICogMC4yNSAqIG9yZ2VsUyArIDAuMyAqIG9yZ2VsUyArIG9yZ2VsWCk7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBjeWxpbmRlckFic1kgPSAob3JnZWxZICsgMC4yICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGN5bGluZGVyQWJzWiA9IChvcmdlbFogKyBvcmdlbFopO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCBjeWxpbmRlck1lc2gucG9zaXRpb24uc2V0KGN5bGluZGVyQWJzWCwgY3lsaW5kZXJBYnNZLCBjeWxpbmRlckFic1opO1xuwqAgwqAgwqAgwqAgwqAgwqAgY3lsaW5kZXJNZXNoLnJvdGF0ZVooTWF0aC5QSSAvIDIpOyAvLyDjgrfjg6rjg7Pjg4Djg7zjgpJYWuW5s+mdouOBq+WvneOBi+OBm+OCi1xuwqAgwqAgwqAgwqAgwqAgwqAgY3lsaW5kZXJNZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKGN5bGluZGVyTWVzaCk7IC8vIOKYheOCt+ODvOODs+OBq+ebtOaOpei/veWKoOKYhVxuXG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoQnJlZWRbeF0gPSBbXTsgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIGZvciAobGV0IHkgPSAwOyB5IDwgNTsgeSsrKSB7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBsZXQgYmxhZGVNZXNoID0gbmV3IFRIUkVFLk1lc2goYnJlZWQsIG1hdGVyaWFsKTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2guc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpOyBcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgYW5nbGUgPSAoTWF0aC5QSSAvIDUpICogeTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGJsYWRlTWVzaC5wb3NpdGlvbi5zZXQoeCAqIDAuMjUgKiBvcmdlbFMgKyAwLjMgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMiAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgYmxhZGVNZXNoLnJvdGF0ZVooTWF0aC5QSSAvIDIpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGJsYWRlTWVzaC5yb3RhdGVZKGFuZ2xlKTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOS6jOasoeWFg+mFjeWIl+OBq+imgee0oOOCkui/veWKoOOBl+OAgeOCt+ODvOODs+OBq+OCgui/veWKoFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgbWVzaEJyZWVkW3hdLnB1c2goYmxhZGVNZXNoKTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChibGFkZU1lc2gpOyAvLyDjgrfjg7zjg7Pov73liqBcbsKgIMKgIMKgIMKgIMKgIMKgIH1cbsKgIMKgIMKgIMKgIH1cbsKgIMKgIMKgIMKgXG5cblxuwqAgwqAgXG5cbsKgIMKgIMKgIMKgIC8vIOW5s+mdouOBrueUn+aIkFxuwqAgwqAgwqAgwqAgXG5cbsKgIMKgIMKgIMKgIC8vIC0tLSDjg6njgqTjg4jjga7oqK3lrpogLS0tXG4gICAgICAgIGxldCBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZlZWJiLCAwLjgpO1xuICAgICAgICBsaWdodC5wb3NpdGlvbi5zZXQob3JnZWxYIC0gMTAsIG9yZ2VsWSArIDE1LCBvcmdlbFogLSAxMCk7XG4gICAgICAgIGxpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGxpZ2h0VGFyZ2V0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgICAgIGxpZ2h0VGFyZ2V0LnBvc2l0aW9uLnNldChvcmdlbFggKyAyLjUsIG9yZ2VsWSwgb3JnZWxaKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHRUYXJnZXQpO1xuICAgICAgICBsaWdodC50YXJnZXQgPSBsaWdodFRhcmdldDtcbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgY29uc3Qgc2hhZG93TWFwU2l6ZSA9IDIwNDg7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cubWFwU2l6ZS53aWR0aCA9IHNoYWRvd01hcFNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cubWFwU2l6ZS5oZWlnaHQgPSBzaGFkb3dNYXBTaXplIMKgIMKgIFxuwqAgwqAgwqAgwqAgY29uc3Qgc2hhZG93Q2FtZXJhSGFsZlNpemUgPSAxMDtcbsKgIMKgIMKgIMKgIGxpZ2h0LnNoYWRvdy5jYW1lcmEubGVmdCA9IC1zaGFkb3dDYW1lcmFIYWxmU2l6ZTtcbsKgIMKgIMKgIMKgIGxpZ2h0LnNoYWRvdy5jYW1lcmEucmlnaHQgPSBzaGFkb3dDYW1lcmFIYWxmU2l6ZTtcbsKgIMKgIMKgIMKgIGxpZ2h0LnNoYWRvdy5jYW1lcmEudG9wID0gc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLmJvdHRvbSA9IC1zaGFkb3dDYW1lcmFIYWxmU2l6ZTtcbsKgIMKgIMKgIMKgIGxpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDAuMTtcbsKgIMKgIMKgIMKgIGxpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDA7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuYmlhcyA9IC0wLjAwMDU7XG7CoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChsaWdodCk7XG7CoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIC8v44Op44Kk44OI44Gu6Kit5a6a57WC44KP44KKXG5cblxuwqAgwqAgwqAgwqAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yM5pu05pawXG7CoCDCoCDCoCDCoCAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbsKgIMKgIMKgIMKgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIC8v5q2v6LuK44Gu5YuV44GN44Gr44Gk44GE44GmXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPDI1O2krKyl7XG4gICAgICAgICAgICAgICAgaWYoaXNSb2xsaW5nW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG1lc2hbaV0ubWF0ZXJpYWw9YnJpZ2h0TWV0YWxNYXRlcmlhbDtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqPTA7ajw1O2orKyl7XG4gICAgICAgICAgICAgICAgICAgIG1lc2hCcmVlZFtpXVtqXS5yb3RhdGVZKDAuMDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvbGxBbmdsZVtpXSs9MC4wMjtcbiAgICAgICAgICAgICAgICAgICAgaWYocm9sbEFuZ2xlW2ldPj1NYXRoLlBJLzUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNSb2xsaW5nW2ldPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzaFtpXS5tYXRlcmlhbD1tYXRlcmlhbHVuZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9sbEFuZ2xlW2ldPTA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+e1guOCj+OCiuODvOatr+i7iuOBruWLleOBjeOBq+OBpOOBhOOBplxuICAgICAgICAgICAgXG5cblxuwqAgwqAgwqAgwqAgwqAgwqAgLy/mtYHjgozmmJ/jga7li5XjgY3jgavjgaTjgYTjgaZcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGVsYXBzZWRUaW1lID0gdGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpOyBcblxuwqAgwqAgwqAgwqAgwqAgwqAgLy8g44Ki44Kv44OG44Kj44OW44Gq5pif44KS44GZ44G544Gm5Yem55CG44GZ44KL44Or44O844OXXG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmFjdGl2ZVN0YXJzLmZvckVhY2goc3Rhcj0+e1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoc3Rhci5pc0ZpbmlzaGVkKXJldHVybjtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v5Y2K5b6E44KS5rG644KB44KLXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0aGlzLm9yYml0ZVJhZGl1cz1vcmdlbFMqKDAuMjUqc3Rhci5pbnRlcnZhbCswLjA1KTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/nmbrlsITjgZXjgozjgabjgYvjgonjga7mmYLplpNcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHRpbWVTaW5lY2VMYXVuY2g9ZWxhcHNlZFRpbWUtc3Rhci5zdGFydFRpbWU7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBhbmdsZT10aW1lU2luZWNlTGF1bmNoKnRoaXMub3JiaXRlU3BlZWQ7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIDHlkajvvInjgpLlm57jgaPjgZ/jgonmmJ/jgpLmtojmu4XjgZXjgZvjgotcbiAgICAgICAgICAgICAgICBpZihhbmdsZT4oTWF0aC5QSSooNC84KSkmJmFuZ2xlPChNYXRoLlBJKig1LzgpKSl7XG4gICAgICAgICAgICAgICAgICAgIGlzUm9sbGluZ1tzdGFyLmludGVydmFsLTFdID10cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihhbmdsZT5NYXRoLlBJKjEuNSl7XG4gICAgICAgICAgICAgICAgICAgIHN0YXIubWVzaC5zY2FsZS5zZXQoc3Rhci5tZXNoLnNjYWxlLngqMC45LHN0YXIubWVzaC5zY2FsZS55KjAuOSxzdGFyLm1lc2guc2NhbGUueiowLjkpO1xuICAgICAgICAgICAgICAgICAgICBzdGFyLnRyYWlsU2VnbWVudHMuZm9yRWFjaCgobWVzaCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2guc2NhbGUuc2V0KG1lc2guc2NhbGUueCowLjksbWVzaC5zY2FsZS55KjAuOSxtZXNoLnNjYWxlLnoqMC45KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9zdGFyLnRyYWlsU2VnbWVudHNbMF0uc2NhbGUuc2V0KHN0YXIudHJhaWxHcm91cC5zY2FsZS54KjAuOSxzdGFyLnRyYWlsR3JvdXAuc2NhbGUueSowLjksc3Rhci50cmFpbEdyb3VwLnNjYWxlLnoqMC45KTtcbiAgICAgICAgICAgICAgICB9XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBpZihhbmdsZT4yKk1hdGguUEkpe1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci5pc0ZpbmlzaGVkPXRydWU7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDjgrfjg7zjg7PjgYvjgonjg6Hjg4Pjgrfjg6XjgpLliYrpmaRcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUucmVtb3ZlKHN0YXIubWVzaCk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLnJlbW92ZShzdGFyLnRyYWlsR3JvdXApO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgcmV0dXJuOyAvLyDntYLkuobjgZfjgZ/jgonmrKHjga7mmJ/jgbhcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1cblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/ou4zpgZPoqIjnrpdcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHRyYWlsVGhpY2tuZXNzPTAuMDQqb3JnZWxTO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbmV3WD1NYXRoLnNpbihhbmdsZSkqdGhpcy5vcmJpdGVSYWRpdXM7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDjgJDkv67mraPjgJFZ5bqn5qiZ44KS44Kq44Or44K044O844Or6YOo5ZOB44KI44KK6auY44GE5L2N572u44Gr6Kit5a6aXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBuZXdZPXRoaXMuc3RhckhlaWdodDsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBuZXdaPU1hdGguY29zKGFuZ2xlKSp0aGlzLm9yYml0ZVJhZGl1cztcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG5ld1Bvc2l0aW9uPW5ldyBUSFJFRS5WZWN0b3IzKG5ld1gsbmV3WSxuZXdaKTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci5tZXNoLnBvc2l0aW9uLmNvcHkobmV3UG9zaXRpb24pO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g6LuM6Leh44Gu6aCC54K544KS6L+95YqgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsUG9pbnRzLnB1c2gobmV3UG9zaXRpb24uY2xvbmUoKSk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOi7jOi3oeOBrueCueaVsOOCkuWItumZkFxuICAgICAgICAgICAgICAgIC8vIOOAkOS/ruatozHjgJFtYXhUcmFpbFBvaW50c+OCkui2heOBiOOBn+OBqOOBjSAoPj0g44KSID4g44Gr5aSJ5pu0KVxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgd2hpbGUoc3Rhci50cmFpbFBvaW50cy5sZW5ndGggPiB0aGlzLm1heFRyYWlsUG9pbnRzKXtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIudHJhaWxQb2ludHMuc2hpZnQoKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1cblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g6LuM6Leh44K744Kw44Oh44Oz44OI44Gu5pu05pawXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBpZihzdGFyLnRyYWlsUG9pbnRzLmxlbmd0aD49Mil7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBwMT1zdGFyLnRyYWlsUG9pbnRzW3N0YXIudHJhaWxQb2ludHMubGVuZ3RoLTJdO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgcDI9c3Rhci50cmFpbFBvaW50c1tzdGFyLnRyYWlsUG9pbnRzLmxlbmd0aC0xXTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGRpc3RhbmNlPXAxLmRpc3RhbmNlVG8ocDIpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbWlkUG9pbnQ9cDEuY2xvbmUoKS5sZXJwKHAyLDAuNSk7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGxldCBzZWdtZW50VG9VcGRhdGU6VEhSRUUuTWVzaDtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoc3Rhci50cmFpbFNlZ21lbnRzLmxlbmd0aDwgdGhpcy5tYXhUcmFpbFBvaW50cyAtIDEpe1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g5paw6KaP5L2c5oiQXG4gICAgICAgICAgICAgICAgICAgIFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweDg4YmJmZixcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHRyYW5zcGFyZW50OiB0cnVlLCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgZGVwdGhXcml0ZTogZmFsc2UsIFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH0pO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlID0gbmV3IFRIUkVFLk1lc2godGhpcy5zZWdtZW50R2VvbWV0cnksIG1hdGVyaWFsKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v5bmFIChYKVxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnNjYWxlLng9dHJhaWxUaGlja25lc3M7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDjgJDkv67mraMy44CR6auY44GVIChZKVxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnNjYWxlLnk9dHJhaWxUaGlja25lc3M7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsR3JvdXAuYWRkKHNlZ21lbnRUb1VwZGF0ZSk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsU2VnbWVudHMucHVzaChzZWdtZW50VG9VcGRhdGUpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgfWVsc2V7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDlho3liKnnlKjvvIjmnIDjgoLlj6TjgYTjgoLjga7jgpLlho3liKnnlKjjgZfjgIHphY3liJfjga7mnIDlvozjgbjvvIlcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZT1zdGFyLnRyYWlsU2VnbWVudHMuc2hpZnQoKSBhcyBUSFJFRS5NZXNoO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbFNlZ21lbnRzLnB1c2goc2VnbWVudFRvVXBkYXRlKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1cblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44K544Kx44O844Or44Go5L2N572u44CB5Zue6Lui44KS5pu05pawXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzZWdtZW50VG9VcGRhdGUuc2NhbGUueiA9IGRpc3RhbmNlO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnBvc2l0aW9uLmNvcHkobWlkUG9pbnQpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3Qgb3JpZW50YXRpb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3Qgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zdWJWZWN0b3JzKHAyLCBwMSk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgb3JpZW50YXRpb24uc2V0RnJvbVVuaXRWZWN0b3JzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBvZmZzZXQuY2xvbmUoKS5ub3JtYWxpemUoKSk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnNldFJvdGF0aW9uRnJvbVF1YXRlcm5pb24ob3JpZW50YXRpb24pO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDjg5Xjgqfjg7zjg4njgqLjgqbjg4jlirnmnpzjga7pgannlKhcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIudHJhaWxTZWdtZW50cy5mb3JFYWNoKChtZXNoLCBpbmRleCkgPT4ge1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgcmF0aW8gPSBpbmRleCAvIHN0YXIudHJhaWxTZWdtZW50cy5sZW5ndGg7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgKG1lc2gubWF0ZXJpYWwgYXMgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwpLm9wYWNpdHkgPSBNYXRoLnBvdyhyYXRpbywgMS41KSAqIDAuODsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9KTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgfVxuXG7CoCDCoCDCoCDCoCDCoCDCoCB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g57WC5LqG44GX44Gf5pif44KSIGFjdGl2ZVN0YXJzIOmFjeWIl+OBi+OCieWJiumZpOOBmeOCiyAo44Oq44K944O844K5566h55CGKVxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTdGFycyA9IHRoaXMuYWN0aXZlU3RhcnMuZmlsdGVyKHN0YXIgPT4gIXN0YXIuaXNGaW5pc2hlZCk7XG4gICAgICAgICAgICBcbsKgIMKgIMKgIMKgIMKgIMKgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuwqAgwqAgwqAgwqAgfVxuwqAgwqAgXG7CoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbsKgIMKgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuwqAgwqAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbsKgIMKgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSh3aW5kb3cuaW5uZXJXaWR0aCxcbiAgd2luZG93LmlubmVySGVpZ2h0LCBuZXcgVEhSRUUuVmVjdG9yMygxMCwgMTAgLDApKTsvL+OCq+ODoeODqeOBruW6p+aomVxuwqAgwqAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbmNsYXNzIEN1c3RvbVNpbkN1cnZlIGV4dGVuZHMgVEhSRUUuQ3VydmU8VEhSRUUuVmVjdG9yMz4ge1xuICAgIHB1YmxpYyBzY2FsZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3Ioc2NhbGUgPSAxKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcbiAgICB9XG5cbiAgICBnZXRQb2ludCh0OiBudW1iZXIsIG9wdGlvbmFsVGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKSk6IFRIUkVFLlZlY3RvcjMge1xuICAgICAgICBjb25zdCB0eCA9IHQgKiA2IC0gNTtcbiAgICAgICAgY29uc3QgdHkgPSBNYXRoLnNpbigyICogTWF0aC5QSSAqIHQpO1xuICAgICAgICBjb25zdCB0eiA9IDA7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFRhcmdldC5zZXQodHgsIHR5LCB0eikubXVsdGlwbHlTY2FsYXIodGhpcy5zY2FsZSk7XG4gICAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qcy1ub2RlX21vZHVsZXNfdG9uZV9idWlsZF9lc20tOWU4ZDg2XCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9