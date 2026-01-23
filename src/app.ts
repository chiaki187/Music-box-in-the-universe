import * as THREE from "three";
import * as Tone from "tone";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


//音のテスト関数
const synth=new Tone.PolySynth(Tone.Synth,{
    oscillator:{
        type:"sine"
    },
    envelope:{
        attack:0.01,
        decay:0.5,
        sustain:0.2,
        release:0.9
    }
}).toDestination();



//複数の奉仕の情報を保持するための定義
type StarContainer={
    mesh: THREE.Mesh,//星本体のメッシュ
    trailGroup: THREE.Group,//奇跡のセグメント保持のグループ
    trailPoints: THREE.Vector3[],//軌跡の頂点座標の配列
    trailSegments: THREE.Mesh[],//軌跡のメッシュ保持の配列
    startTime: number,//軌跡移動開始時間
    isFinished: boolean,//軌道を終えたか
    interval: number//どの音か
}


class ThreeJSContainer {
    private scene: THREE.Scene;
    private clock: THREE.Clock = new THREE.Clock(); // 時間経過を追跡
    private maxTrailPoints = 30; // 軌跡の最大点数 (尾の長さ)

    private activeStars:StarContainer[]=[];//動いている隆盛を管理する配列

    //流れ星の尾のセグメントのベースのジオメトリ
    private segmentGeometry=new THREE.BoxGeometry(1,1,1);

    private orbiteRadius:number=2;  //軌跡の半径
    private orbiteSpeed:number=4;  //軌跡の移動速度
    private starHeight:number = 1.1; // 星の軌道高さをオルゴール部品と干渉しないように設定


    // 周囲に散らす静止した星
    private cloudStaticSmall: THREE.Points; 	// 小さい静止星
    private cloudStaticMedium: THREE.Points; 	// 中くらいの静止星
    private cloudStaticLarge: THREE.Points; 	// 大きい静止星

    private starGeometry=new THREE.SphereGeometry(0.1,16,16);
    private starMaterial=new THREE.MeshBasicMaterial({
        color: 0xe0f8ffff,
        blending: THREE.AdditiveBlending 
    });


    

    constructor() {
       window.addEventListener('keydown',this.handleKeyDown);
    }



    //音とキーの場所のマップ
    private map:Record<string,number>={
        C5:24,
        "C#5":23,
        D5:22,
        "D#5":21,
        E5:20,
        F5:19,
        "F#5":18,
        G5:17,
        "G#5":16,
        A5:15,
        "A#5":14,
        B5:13,

        C6:12,
        "C#6":11,
        D6:10,
        "D#6":9,
        E6:8,
        F6:7,
        "F#6":6,
        G6:5,
        "G#6":4,
        A6:3,
        "A#6":2,
        B6:1,


        C7:24,
        "C#7":23,
        D7:22,
        "D#7":21,
        E7:20,
        F7:19,
        "F#7":18,
        G7:17,
        "G#7":16,
        A7:15,
        "A#7":14,
        B7:13,

        C8:12,
        "C#8":11,
        D8:10,
        "D#8":9,
        E8:8,
        F8:7,
        "F#8":6,
        G8:5,
        "G#8":4,
        A8:3,
        "A#8":2,
        B8:1,

    };

    //keyが押されてから音が鳴るまでの時間
    private waitTime=400;
    private sleep = (ms: number) => {
      return new Promise<void>(resolve => setTimeout(resolve, ms));
    };
    //"E7","F7","G7",null,"E8",null,"C8",null,"D8","C8","C8",null,"B7",null,"B7",null,"D7","E7","F7",null,"D8",null,"B7",null,"C8","B7","A7",null,"G7",null,"G7",null,"E7","F7","G7",null,"C8","D8","E8", null,"D8", "C8","A7",null,"D8","E8","F8", null,"E8", "D8","G7",null,"F8",null,"E8",null,"D8",null,"C8",null,null,null,null,null]
    //null,null,"C6","G6","E6","G6","C6","G6","E6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","B#6","G8","B#6","C6","A6","F6","A6","C6","A#6","E6","A#6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6",null
    private playSong=async()=>{
        const notes = ["E7","F7","G7",null,"E8",null,"C8",null,"D8","C8","C8",null,"B7",null,"B7",null,"D7","E7","F7",null,"D8",null,"B7",null,"C8","B7","A7",null,"G7",null,"G7",null,"E7","F7","G7",null,"C8","D8","E8", null,"D8", "C8","A7",null,"D8","E8","F8", null,"E8", "D8","G7",null,"F8",null,"E8",null,"D8",null,"C8",null,null,null,null,null];
        const notes2 =[null,null,"C6","G6","E6","G6","C6","G6","E6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","B#6","G8","B#6","C6","A6","F6","A6","C6","A#6","F6","A#6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6",null];
        for (let i = 0; i < notes.length; i++) {    
            if(notes[i]!=null){
                this.launchStar(this.map[notes[i]]);
            } 
            if(notes2[i]!=null){
                this.launchStar(this.map[notes2[i]]);
            }      
            await this.sleep(this.waitTime);
            if(notes[i]!=null){
                synth.triggerAttackRelease(notes[i], "100n");
            } 
            if(notes2[i]!=null){
                synth.triggerAttackRelease(notes2[i], "100n");
            } 
           
        }
    }
    //keyが押されたときのイベントハンドラ
    private handleKeyDown=(event:KeyboardEvent)=>{
        if(event.key.toLowerCase()==='z'){
            this.playSong();
        }else if(event.key.toLowerCase()==='1'){
            this.launchStar(25);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='2'){
            this.launchStar(24);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='3'){
            this.launchStar(23);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='4'){
            this.launchStar(22);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='5'){
            this.launchStar(21);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='h'){
            this.launchStar(19);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='j'){
            this.launchStar(18);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B5","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='k'){
            this.launchStar(17);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='l'){
            this.launchStar(16);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()===';'){
            this.launchStar(15);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='z'){
            this.launchStar(14);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='x'){
            this.launchStar(13);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='c'){
            this.launchStar(12);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G6","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='v'){
            this.launchStar(11);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A7","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='b'){
            this.launchStar(10);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B7","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='n'){
            this.launchStar(9);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C7","100n");
            }, this.waitTime);
        }else if(event.key.toLowerCase()==='m'){
            this.launchStar(8);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7","100n");
            }, this.waitTime);
        }
    }


    //星が発射されるときのロジック
    private launchStar=(interval:number)=>{
        //経過時間
        const currentTime=this.clock.getElapsedTime();

        // 1. 新しいメッシュとグループを生成
        // 【修正済み】ジオメトリとマテリアルを渡す
        const newStarMesh = new THREE.Mesh(this.starGeometry, this.starMaterial.clone());
        const newTrailGroup = new THREE.Group();

        this.scene.add(newStarMesh);
        this.scene.add(newTrailGroup);

        const newStar:StarContainer={
            mesh:newStarMesh,
            trailGroup:newTrailGroup,
            trailPoints:[],
            trailSegments:[],
            startTime:currentTime,
            isFinished:false,
            interval:interval
        };
        
        // 初期半径を設定
        const currentRadius = 0.5 * interval;

        // 初期位置を設定 (X=0, Y=starHeight, Z=currentRadius からスタート)
        newStarMesh.position.set(0, this.starHeight, currentRadius);
        this.activeStars.push(newStar);
    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000009));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        
        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);//どの様なカメラを使用するか
        camera.position.copy(cameraPos);                                         //カメラの位置は
        camera.lookAt(15, 0, 0);                        //カメラの注視点

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();
             

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
      this.scene = new THREE.Scene();

    // --- パーティクル（星）の作成 ---
     const textureLoader = new THREE.TextureLoader();
     const stardustTexture2 = textureLoader.load('splushStar.png');
    
     const splushMateri = new THREE.PointsMaterial({
         size: 0.1, // 固定サイズA
         map: stardustTexture2,
         blending: THREE.AdditiveBlending,
         color: 0xf0ffff, // 淡い水色
         depthWrite: false,
         transparent: true,
         opacity: 1
     });

     // ★ポイント5: 周囲に散らす静止した星 (cloudStaticLarge)
     let createStaticLargeParticles = () => {
         const geometry = new THREE.BufferGeometry();
         const particleNum = 500;
         const positions = new Float32Array(particleNum * 3);
    
         let particleIndex = 0;
         const sceneSpread = 120;
         for (let x = 0; x < particleNum; x++) {
             positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
             positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.5;
             positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
         }
         geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
         this.cloudStaticLarge = new THREE.Points(geometry, splushMateri);
         this.scene.add(this.cloudStaticLarge);
     };
    
    createStaticLargeParticles();
            



        
        //音を鳴らす準備
        Tone.start();
        //歯車の動き制御変数
        let isRolling:boolean[]=[];
        let rollAngle:number[]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
        let orgelX = 0;
        let orgelY = 0;
        let orgelZ = 0;
        let orgelS = 3;

       
        // オルゴール部品の基本的なマテリアル
        let material = new THREE.MeshPhongMaterial({
            color: 0x808088,
            specular: 0xbbbbbb,
            shininess: 50
        });    
        let materialunder = new THREE.MeshPhongMaterial({
            color: 0x757252,
            specular: 0xcccccc,
            shininess: 1
        });    
        const materialu = new THREE.MeshBasicMaterial({
            color: 0x000fff, // 緑色
            transparent: true, // 透明度を有効にする
            opacity: 0.2,   // 半透明に設定 (50%の不透明度)
            side: THREE.DoubleSide
        });    

       // #757252ff
        //通常の振動版の色
        let metalMaterial = new THREE.MeshBasicMaterial({
            color: 0x9e9683,
        });
        //発光時の振動版の色
        let brightMetalMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,   // 物体表面の反射色（ライトの影響を受ける）
            specular: 0xffffff, // 鏡面反射光の色
            shininess: 400,
            // 自己発光色を設定
            emissive: 0x75c4fdff, 
            // emissive の強さをコントロール
            emissiveIntensity: 0.8
        });
        // 針の台
        let BigDai = new THREE.BoxGeometry(7, 0.05, 2.5);
        let meshBigDai = new THREE.Mesh(BigDai, metalMaterial);
        meshBigDai.position.set(3.6 * orgelS + orgelX, orgelY, orgelZ - 1 * orgelS);
        meshBigDai.scale.set(orgelS, orgelS, orgelS);
        meshBigDai.receiveShadow = true;
        this.scene.add(meshBigDai);    

        //ねじの芯の下の四角
        let Bigcircle = new THREE.BoxGeometry(0.6, 0.2, 0.6);
        let mesh1 = new THREE.Mesh(Bigcircle, material);
        mesh1.position.set(6.8 * orgelS + orgelX, orgelY + 0.05 * orgelS,-0.05 * orgelS+ orgelZ);
        mesh1.scale.set(orgelS, orgelS, orgelS);
        mesh1.castShadow = true;
        this.scene.add(mesh1);     

        let middlecircle = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        let mesh2 = new THREE.Mesh(middlecircle, material);
        mesh2.position.set(6.8 * orgelS + orgelX, orgelY + 0.25 * orgelS, -0.05 * orgelS+orgelZ);
        mesh2.scale.set(orgelS, orgelS, orgelS);
        mesh2.castShadow = true;
        this.scene.add(mesh2);    

        let covercircle = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
        let mesh3 = new THREE.Mesh(covercircle, material);
        mesh3.position.set(6.8 * orgelS + orgelX, orgelY + 0.45 * orgelS, -0.05 * orgelS+ orgelZ);
        mesh3.scale.set(orgelS, orgelS, orgelS);
        mesh3.castShadow = true;
        this.scene.add(mesh3); // シーンに追加

        
        //振動板のすぐ下の四角の板
        let negiDai = new THREE.BoxGeometry(4.4, 0.1, 0.5);
        let mesh4 = new THREE.Mesh(negiDai, material);
        mesh4.position.set(2.45 * orgelS + orgelX, orgelY + 0.15 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh4.scale.set(orgelS, orgelS, orgelS);
        mesh4.castShadow = true;
        this.scene.add(mesh4);



        //回すところの取っ手部分
        let totte = new THREE.CylinderGeometry(0.66, 0.66, 1.5, 6);
        let mesh7 = new THREE.Mesh(totte, material);
        mesh7.position.set(7.65 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ-0.1);
        mesh7.castShadow = true;
        this.scene.add(mesh7);

        //曲線のパイプ
        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new THREE.TubeGeometry(path, 20, 0.5, 8, false);
        const mesh8 = new THREE.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI/4 );
        mesh8.position.set(7.5 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ-0.1);
        
        mesh8.castShadow = true;
        this.scene.add(mesh8);


        const uvs = new Float32Array([
                    0.5, 1, // 中心
                    0, 0,   // 左下
                    1, 0    // 右下
                    // CircleGeometryの頂点数に合わせて適切なUV座標を定義する必要があります
                    // 現在のuvs定義は頂点数3の三角形用で、32セグメントの円には合いません
                ]);
                
                const loader = new THREE.TextureLoader();
                const texturet = loader.load('test.png');
                const materiatl = new THREE.MeshBasicMaterial( {
                     map: texturet,
                     transparent: true, 	// これを 'true' にしないと 'opacity' が効きません
                     opacity: 0.3, 		// 70%の不透明度（30%透明）に設定します
                     side: THREE.DoubleSide ,// 必要であれば両面表示に
                     //blending: THREE.AdditiveBlending,
                     depthWrite: false // パーティクルが透けて見えるように
                } );

                 const texturet2 = loader.load('test2.png');
                const materiatl2 = new THREE.MeshBasicMaterial( {
                     map: texturet2,
                     transparent: true, 	// これを 'true' にしないと 'opacity' が効きません
                     opacity: 0.025, 		// 70%の不透明度（30%透明）に設定します
                     side: THREE.DoubleSide ,// 必要であれば両面表示に
                     blending: THREE.AdditiveBlending,
                     depthWrite: false // パーティクルが透けて見えるように
                } );

                const texturet3 = loader.load('test3.png');
                const materiatl3 = new THREE.MeshBasicMaterial( {
                     map: texturet3,
                     transparent: true, 	// これを 'true' にしないと 'opacity' が効きません
                     opacity: 0.025, 		// 70%の不透明度（30%透明）に設定します
                     side: THREE.DoubleSide ,// 必要であれば両面表示に
                     blending: THREE.AdditiveBlending,
                     depthWrite: false // パーティクルが透けて見えるように
                } );

                
        
                //オルゴールの下の色付き円盤
                const circlegeometry = new THREE.CircleGeometry( 20, 32 );
                // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
                // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
                // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
                let circlemesh=new THREE.Mesh(circlegeometry, materiatl);
                circlemesh.rotateX(-Math.PI/2);
                circlemesh.position.set(0,-1,0);
                this.scene.add(circlemesh);


                const circlegeometry2 = new THREE.CircleGeometry( 20, 32 );
                // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
                // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
                // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
                let circlemesh2=new THREE.Mesh(circlegeometry2, materiatl2);
                circlemesh2.rotateX(-Math.PI/2);
                circlemesh2.position.set(0,-0.6,0);
                this.scene.add(circlemesh2);

                const circlegeometry1 = new THREE.CircleGeometry( 20, 32 );
                // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
                // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
                // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
                let circlemesh1=new THREE.Mesh(circlegeometry1, materiatl3);
                circlemesh1.rotateX(-Math.PI/2);
                circlemesh1.position.set(0,0,0);
                this.scene.add(circlemesh1);
                

                for(let i=1;i<10;i++){
                    let circle=circlemesh2.clone();
                    circle.position.set(0,-1.5+0.15*i,0);
                    this.scene.add(circle);
                }

                for(let i=0;i<10;i++){
                    let circle1=circlemesh1.clone();
                    circle1.position.set(0,0.15*i,0);
                    this.scene.add(circle1);
                }

               



        
  
        let mesh: THREE.Mesh[]=[];

        //振動板
        for (let x = 0; x < 25; x++) {
            let boxes = new THREE.BoxGeometry(0.15, 0.01, 1.9);
            mesh[x] = new THREE.Mesh(boxes,  materialunder);
            mesh[x].castShadow = true;
            mesh[x].position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS);
            mesh[x].scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh[x]);
        }


        //振動板の間
        for (let x = 0; x < 24; x++) {
            //1.665 - x *0.055,0.4 + x *0.055
            let boxes = new THREE.BoxGeometry(0.15, 0.01,1.665 - x *0.05);
            let mesh = new THREE.Mesh(boxes,  materialunder);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.42* orgelS + orgelX, orgelY + 0.1999 * orgelS, orgelZ + orgelZ - 1.9 * orgelS +( 0.525-0.02 * x) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //振動版のすぐ上の四角
        let negiDai2 = new THREE.BoxGeometry(6, 0.05, 0.5);
        let mesh5 = new THREE.Mesh(negiDai2, material);
        mesh5.position.set(3.3 * orgelS + orgelX, orgelY + 0.21 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh5.scale.set(orgelS, orgelS, orgelS);
        mesh5.castShadow = true;
        this.scene.add(mesh5);

        let material2 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0
        });

        
        //振動版をとめるねじ３つ
        for (let i = 0; i < 5; i++) {
            let Negi = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 6);
            let mesh = new THREE.Mesh(Negi, material2);
            mesh.castShadow = true;
            mesh.position.set((0.7 + i * 1.3) * orgelS + orgelX, orgelY + 0.14 * orgelS,   orgelZ + orgelZ + (-1.89) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //ねじの芯
        let NegiCylinder = new THREE.CylinderGeometry(0.02, 0.02, 5, 6);
        let mesh6 = new THREE.Mesh(NegiCylinder, material);
        mesh6.position.set(2.7 * orgelS + orgelX, orgelY + 0.19 * orgelS, orgelZ + orgelZ);
        mesh6.rotateZ(Math.PI / 2);
        mesh6.castShadow = true;
        this.scene.add(mesh6);



        //歯車
        // 刃の部分宣言
        let breed = new THREE.BoxGeometry(0.35, 0.1, 0.02);

        // ★meshBreedを二次元配列として宣言★
        let meshBreed: THREE.Mesh[][] = []; 

        for (let x = 0; x < 25; x++) {
            let boxesCylinder = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 32);
            let cylinderMesh = new THREE.Mesh(boxesCylinder, material); 
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
                let bladeMesh = new THREE.Mesh(breed, material); 
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
        let light = new THREE.DirectionalLight(0xffeebb, 0.8);
        light.position.set(orgelX - 10, orgelY + 15, orgelZ - 10);
        light.castShadow = true;

        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(orgelX + 2.5, orgelY, orgelZ);
        this.scene.add(lightTarget);
        light.target = lightTarget;
        
        const shadowMapSize = 2048;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize     
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
        let update: FrameRequestCallback = (time) => {
            //歯車の動きについて
            for(let i=0;i<25;i++){
                if(isRolling[i]){
                    
                    mesh[i].material=brightMetalMaterial;
                    for(let j=0;j<5;j++){
                    meshBreed[i][j].rotateY(0.02);
                    }
                    rollAngle[i]+=0.02;
                    if(rollAngle[i]>=Math.PI/5){
                        isRolling[i]=false;
                        mesh[i].material=materialunder;
                        rollAngle[i]=0;
                    }
                
                }
            } 
            
            //終わりー歯車の動きについて
            


            //流れ星の動きについて
            const elapsedTime = this.clock.getElapsedTime(); 

            // アクティブな星をすべて処理するループ
            this.activeStars.forEach(star=>{
                if(star.isFinished)return;
                //半径を決める
                this.orbiteRadius=orgelS*(0.25*star.interval+0.05);

                //発射されてからの時間
                const timeSineceLaunch=elapsedTime-star.startTime;
                const angle=timeSineceLaunch*this.orbiteSpeed;

                // 1周）を回ったら星を消滅させる
                if(angle>(Math.PI*(4/8))&&angle<(Math.PI*(5/8))){
                    isRolling[star.interval-1] =true;
                }
                if(angle>Math.PI*1.5){
                    star.mesh.scale.set(star.mesh.scale.x*0.9,star.mesh.scale.y*0.9,star.mesh.scale.z*0.9);
                    star.trailSegments.forEach((mesh)=>{
                        mesh.scale.set(mesh.scale.x*0.9,mesh.scale.y*0.9,mesh.scale.z*0.9);
                    });

                    //star.trailSegments[0].scale.set(star.trailGroup.scale.x*0.9,star.trailGroup.scale.y*0.9,star.trailGroup.scale.z*0.9);
                }
                if(angle>2*Math.PI){
                    star.isFinished=true;
                    // シーンからメッシュを削除
                    this.scene.remove(star.mesh);
                    this.scene.remove(star.trailGroup);
                    return; // 終了したら次の星へ
                }

                //軌道計算
                const trailThickness=0.04*orgelS;
                const newX=Math.sin(angle)*this.orbiteRadius;
                // 【修正】Y座標をオルゴール部品より高い位置に設定
                const newY=this.starHeight; 
                const newZ=Math.cos(angle)*this.orbiteRadius;
                const newPosition=new THREE.Vector3(newX,newY,newZ);

                star.mesh.position.copy(newPosition);
                // 軌跡の頂点を追加
                star.trailPoints.push(newPosition.clone());
                
                // 軌跡の点数を制限
                // 【修正1】maxTrailPointsを超えたとき (>= を > に変更)
                while(star.trailPoints.length > this.maxTrailPoints){
                    star.trailPoints.shift();
                }

                // 軌跡セグメントの更新
                if(star.trailPoints.length>=2){
                    const p1=star.trailPoints[star.trailPoints.length-2];
                    const p2=star.trailPoints[star.trailPoints.length-1];
                    const distance=p1.distanceTo(p2);
                    const midPoint=p1.clone().lerp(p2,0.5);

                    let segmentToUpdate:THREE.Mesh;

                    if(star.trailSegments.length< this.maxTrailPoints - 1){
                        // 新規作成
                    
                        const material = new THREE.MeshBasicMaterial({ 
                            color: 0x88bbff,
                            transparent: true, 
                            blending: THREE.AdditiveBlending,
                            depthWrite: false, 
                            side: THREE.DoubleSide 
                        });
                        segmentToUpdate = new THREE.Mesh(this.segmentGeometry, material);
                        //幅 (X)
                        segmentToUpdate.scale.x=trailThickness;
                        // 【修正2】高さ (Y)
                        segmentToUpdate.scale.y=trailThickness;
                        star.trailGroup.add(segmentToUpdate);
                        star.trailSegments.push(segmentToUpdate);
                    }else{
                        // 再利用（最も古いものを再利用し、配列の最後へ）
                        segmentToUpdate=star.trailSegments.shift() as THREE.Mesh;
                        star.trailSegments.push(segmentToUpdate);
                    }

                    // スケールと位置、回転を更新
                    segmentToUpdate.scale.z = distance;
                    segmentToUpdate.position.copy(midPoint);
                    const orientation = new THREE.Quaternion();
                    const offset = new THREE.Vector3().subVectors(p2, p1); 
                    orientation.setFromUnitVectors(new THREE.Vector3(0, 0, 1), offset.clone().normalize()); 
                    segmentToUpdate.setRotationFromQuaternion(orientation);

                    // フェードアウト効果の適用
                    star.trailSegments.forEach((mesh, index) => {
                        const ratio = index / star.trailSegments.length; 
                        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.pow(ratio, 1.5) * 0.8; 
                    });

                }

            });
            
            // 終了した星を activeStars 配列から削除する (リソース管理)
            this.activeStars = this.activeStars.filter(star => !star.isFinished);
            
            requestAnimationFrame(update);
        }
    
    requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(window.innerWidth,
  window.innerHeight, new THREE.Vector3(10, 10 ,0));//カメラの座標
    document.body.appendChild(viewport);
}

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
    public scale: number;

    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
        const tx = t * 6 - 5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}