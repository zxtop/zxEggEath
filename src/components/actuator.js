import {Application,Container,Graphics,Sprite,Point} from 'pixi.js';
import { getAnimation, getSound, load, createSprite,  getTexture} from '../loader';
import {TweenLite,TimeLine,TweenMax} from 'gsap';
import {AnswerInfo} from 'xes-answer';
import {RenderPageByIndex} from 'xes-tem-render'
import Animate from 'xes-animate';

class Actuator {
    constructor() {
        this.pixiStage = null;
        this.currentTarget = null;
        this.mainArr = [
            {
                obj:null,
                x:425,
                y:648,
                width:243,
                height:161,
                xk_x:272,
                xk_y:366
            },
            {
                obj:null,
                x:740,
                y:648,
                width:243,
                height:161,
                xk_x:584,
                xk_y:366
            },
            {
                obj:null,
                x:1054,
                y:648,
                width:243,
                height:161,
                xk_x:900,
                xk_y:366
            }
        ];
        this.things = [
            {
                name:'image_case1',
                key:'case',
                value:'2',
                x:1452,
                y:280,
                width:190,
                height:127
            },
            {
                name:'image_case2',
                key:'case',
                value:'3',
                x:1690,
                y:280,
                width:191,
                height:127
            },
            {
                name:'image_goods1',
                key:'goods',
                value:'1',
                x:1430,
                y:492,
                width:142,
                height:122
            },
            {
                name:'image_goods2',
                key:'goods',
                value:'2',
                x:1594,
                y:492,
                width:143,
                height:112
            },
            {
                name:'image_goods3',
                key:'goods',
                value:'3',
                x:1782,
                y:476,
                width:97,
                height:132
            },
            {
                name:'image_flight1',
                key:'flight',
                value:'1',
                x:1442,
                y:698,
                width:111,
                height:119
            },
            {
                name:'image_flight2',
                key:'flight',
                value:'2',
                x:1614,
                y:698,
                width:100,
                height:123
            },
            {
                name:'image_flight3',
                key:'flight',
                value:'3',
                x:1782,
                y:698,
                width:94,
                height:132
            }
        ];
        this.guideLayer = null;
        this.mouseStyle = null;
        this.guideText = null;
        this.guideTextCont = {
            text1:"将货架上的每排装置选取一个装备到鸡蛋身上",
            text2:"三个鸡蛋全部装备完毕即可点击确认进行试验了呦~"
        };
        this.guideBg = null;
        this.guideTextContainer = null;
        this.dragging = false;
        this.startCos = null;
        this.startPos = new Point(0,0);
        this.offsetPos = new Point(0,0);
        this.zbContainer = null;
        this.comContainerArr = [];
        this.eggArr = [];
        this.a = null;
        this.b = null;

        this.tip = true;
        this.mouseStyleAn = null;
        this.mouseStyleAn2 = null;
        this.mouseStyleAn3 = null;

        this.zbContainerArr = [];
        this.touched = false;

        this.egg_index = null;
        this.rightResult = [
            '2_1_1','2_1_2','2_1_3',
            '2_2_1','2_2_2','2_2_3',
            '2_3_1','2_3_2','2_3_3',
            '3_1_1','3_1_2','3_1_3',
            '3_2_1','3_2_2','3_2_3',
            '3_3_1','3_3_2','3_3_3'
        ];
        this.button = null;
        this.shaw_button = null;
        this.finsh = null;
        this.gameBg = null;
        this.shadow = null;
        this.zhiyin2 = null;

        this.complete = true;
        this.cursor = false;
    }

    exec(){
        console.log("= 开始执行逻辑 =");
        let _that = this;
        this.initGame(store.state.pageNumber);
        _that.pixiStage.on('pointermove',(e)=>{
            let nowPos = e.data.getLocalPosition(stage);
            if(nowPos.x>0 && nowPos.x<1910 && nowPos.y>0 && nowPos.y<1070){
                if(_that.cursor){
                    _that.pixiStage.cursor = 'none';
                    _that.mouseStyle.x = nowPos.x;
                    _that.mouseStyle.y = nowPos.y;
                }
            }
        })
        stage.on('pointermove',this.moveTarget.bind(this));
        stage.on('pointerup',this.leaveMoveTarget.bind(this));
        console.log(this.pixiStage)
        this.pixiStage.children[1].children[0].children[1].cursor = 'none';
    }

    initGame(pageNum){     //初始化页面数据
        this.a = (this.mainArr[1].x-this.mainArr[0].x)/2+this.mainArr[0].x;
        this.b = (this.mainArr[2].x-this.mainArr[1].x)/2+this.mainArr[1].x;

        console.log("第"+pageNum+'页');
        let _that = this;
        this.pixiStage = stage.getChildByName('GAME').getChildByName('GAME'+pageNum);
        this.gameBg = _that.pixiStage.children[0].children[0];
        this.gameBg.checked = PIXI.Texture.fromImage('image_end');
        this.gameBg.default = PIXI.Texture.fromImage('image_bg_default');
        this.pixiStage.interactive = true;
        this.comContainer = new Container();
        this.zbContainer = new Container();
        this.zbContainer.x = 0;
        this.zbContainer.y = 0;
        this.zbContainer.width = 1920;
        this.zbContainer.height = 1080;
        RenderPageByIndex(pageNum);

        
        //遮罩层及指引动画执行
        this.guideLayer = new Container();
        this.guideLayer.name = 'guideLayer';

        let layer = new Graphics();  //引导层
        layer.beginFill(0x000);
        layer.lineStyle(2,0x99ff44,1);
        layer.drawRect(0,0,1920,1080);
        layer.endFill();
        layer.alpha = .5;

        //生成鼠标指引样式1
        this.mouseStyleAn = getAnimation('animation_main')
        this.mouseStyleAn.name = 'hand';
        let mouse = this.mouseStyleAn.state.setAnimation(0,'zhiyin1',true);
        this.mouseStyleAn.x = 990;
        this.mouseStyleAn.y = 500;
        this.mouseStyleAn.durationTime = mouse.animation.duration;
       

        //生成鼠标指引样式2
        this.mouseStyleAn2 = getAnimation('animation_main')
        this.mouseStyleAn2.name = 'hand';
        let mouse2 = this.mouseStyleAn2.state.setAnimation(0,'zhiyin2',true);
        this.mouseStyleAn2.x = 990;
        this.mouseStyleAn2.y = 500;
        this.mouseStyleAn2.durationTime = mouse2.animation.duration;
        this.mouseStyleAn2.visible = false;

        //生成鼠标指引样式3
        this.mouseStyleAn3 = getAnimation('animation_main')
        this.mouseStyleAn3.name = 'hand';
        let mouse3 = this.mouseStyleAn3.state.setAnimation(0,'zhiyin3',true);
        this.mouseStyleAn3.x = 990;
        this.mouseStyleAn3.y = 500;
        this.mouseStyleAn3.durationTime = mouse3.animation.duration;
        this.mouseStyleAn3.visible = false;

        //生成鼠标点击指引样式
        this.zhiyin2 = getAnimation('animation_main');
        this.zhiyin2.name = 'handclick';
        let mouseClick = this.zhiyin2.state.setAnimation(0,'zhiyin4',true);
        this.zhiyin2.x = 980;
        this.zhiyin2.y = 550;
        this.zhiyin2.durationTime = mouseClick.animation.duration;
        this.zhiyin2.visible = false;

        this.mainArr.map((item,index)=>{ //初始化鸡蛋
           let mainEgg = getAnimation('animation_main');
           mainEgg.name = 'egg';
            mainEgg.x = item.x;
            mainEgg.y = item.y;
            mainEgg.startX = item.x;
            mainEgg.startY = item.y;
            mainEgg.num1 = 0;  //记录第一次完成组合装备;
            mainEgg.num2 = 0;
            mainEgg.num3 = 0;
            mainEgg.str = '1_0_0';
            mainEgg.finsh = false;
            mainEgg.goned = false;
            mainEgg.state.setAnimation(1,'animation01',false);
            _that.setSkinName(mainEgg,mainEgg.str);
            let xk = new PIXI.Sprite.fromImage(res['image_xk'].url);
            xk.x = item.xk_x;
            xk.y = item.xk_y;
            xk.alpha = 0;
            _that.comContainer.addChild(xk);
            if(index!=0){
                _that.comContainer.addChild(mainEgg);
            }else{
                _that.pixiStage.addChild(mainEgg);
            }
            _that.comContainerArr.push(xk);
            _that.eggArr.push(mainEgg);
        })
        
        
        let zb_bg = new PIXI.Sprite.fromImage(res['image_zb_bg'].url); //添加装备
        zb_bg.x = 1311;
        zb_bg.y = 219;
        this.zbContainer.addChild(zb_bg);
        this.things.map((item,index)=>{

            let zb_sprite = new PIXI.Sprite.fromImage(res[item.name].url);
            zb_sprite.name = item.name;
            zb_sprite.key = item.key;
            zb_sprite.value = item.value;
            zb_sprite.startX = item.x+item.width/2;
            zb_sprite.startY = item.y+item.height/2;
            zb_sprite.interactive = true;
            zb_sprite.anchor.set(.5,.5);
            zb_sprite.startWidth = item.width;
            zb_sprite.startHeight = item.height;

            zb_sprite.x = item.x+zb_sprite.width/2;
            zb_sprite.y = item.y+zb_sprite.height/2;
            // console.log(zb_sprite.startX)
            if(_that.tip && index==0){
                console.log('只能拖动一个');
                zb_sprite.on('pointerover',_that.overAndScale.bind(this));
                zb_sprite.on('pointerout',_that.outAndScale.bind(this));
                zb_sprite.on('pointerdown',_that.getCurrentTarget.bind(this));
            }

            _that.zbContainer.addChild(zb_sprite);
            // _that.zbContainerArr.push(zb_sprite);

        });

        this.guideTextContainer = new Container();
        this.guideTextContainer.x = 400;
        this.guideTextContainer.y = 200;
        this.guideText = new PIXI.Text(this.guideTextCont.text1,{fontFamily:'微软雅黑',fontSize:34,fill:'#000',align:'center'})

        let tx = this.guideText.x-20;
        let ty = this.guideText.y-10;
        let tw = this.guideText.width+40;
        let th = this.guideText.height+20;
        
        this.guideBg = new Graphics();
        this.guideBg.beginFill(0xffffff);
        this.guideBg.lineStyle(2,0x99ff44,1);
        this.guideBg.drawRoundedRect(tx,ty,tw,th,5);
        this.guideBg.endFill();

        this.mouseStyle = new PIXI.Sprite.fromImage(res['image_hand1'].url);//初始化鼠标
        this.mouseStyle.default = PIXI.Texture.fromImage('image_hand1');
        this.mouseStyle.downed = PIXI.Texture.fromImage('image_hand2');
        this.mouseStyle.anchor.set(.4);
        //按钮
        this.shaw_button = new PIXI.Sprite.fromImage(res['image_but_not'].url)//初始化按钮
        this.shaw_button.default = PIXI.Texture.fromImage('image_but_not');
        this.shaw_button.downed = PIXI.Texture.fromImage('image_button_can');
        this.shaw_button.x = 625;
        this.shaw_button.y = 780;

        this.button = new PIXI.Sprite.fromImage(res['image_button_can'].url);
        this.button.x = 625;
        this.button.y = 780;
        this.button.visible = false;
        
        //提交按钮
        this.finsh = new PIXI.Sprite.fromImage(res['image_fish'].url);
        this.finsh.default = PIXI.Texture.fromImage('image_fish');
        this.finsh.unable = PIXI.Texture.fromImage('image_button');
        this.finsh.x = 1550;
        this.finsh.y = 948;
        this.finsh.interactive = true;
      
        this.finsh.on('pointerdown',function(){
            if(_that.guideLayer.visible == false){
                _that.finsh.texture = _that.finsh.unable;
                let answer = new AnswerInfo();
                answer.init({type: 0, useranswer: '', answer: '', id: store.state.pageNumber, rightnum: 1, wrongnum: 0});
                store.dispatch('pushToPostArr', answer);
                store.dispatch('postAnswer');
            }
        })
        this.finsh.on('poninterup',function(){
            console.log('dddd')
            _that.finsh.texture = _that.finsh.default;
        })


        this.guideTextContainer.addChild(this.guideBg);
        this.guideTextContainer.addChild(this.guideText);

        this.guideLayer.addChild(layer);
        this.guideLayer.addChild(this.guideTextContainer);
        this.guideLayer.addChild(this.button);

        this.pixiStage.addChild(this.finsh);
        this.pixiStage.addChild(this.shaw_button);
        this.pixiStage.addChild(this.comContainer);
        this.pixiStage.addChild(this.guideLayer);

        this.pixiStage.addChild(this.zbContainer);
        this.pixiStage.addChild(this.mouseStyle);
        this.pixiStage.addChild(this.mouseStyleAn);
        this.pixiStage.addChild(this.mouseStyleAn2);
        this.pixiStage.addChild(this.mouseStyleAn3);

        this.pixiStage.addChild(this.zhiyin2);

        this.shadow = new Container();
        this.shadow.shadow_lay = new Graphics();
        this.shadow.shadow_lay.beginFill(0x000);
        this.shadow.shadow_lay.lineStyle(0,0x99ff44,0);
        this.shadow.shadow_lay.drawRect(0,0,1920,1080);
        this.shadow.shadow_lay.endFill();
        this.shadow.shadow_lay.alpha = .8;
        this.shadow.addChild(this.shadow.shadow_lay)
        this.shadow.visible = false;
        this.pixiStage.addChild(this.shadow);
        
        

        _that.pixiStage.setChildIndex(_that.pixiStage.getChildByName('egg'),_that.pixiStage.children.length-2);
        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);

    }

    setSkinName(obj,name){
        let _that = this;
        let skeleton = obj.skeleton;
        
        skeleton.setSkin1(null);
        skeleton.setSkinByName1(name);
    }

     

    overAndScale(e){
        let _that = this;
        let target = e.currentTarget;
        TweenLite.to(target,.4,{width:1.05*target.width,height:1.05*target.height});
        _that.cursor = true;
        _that.mouseStyle.visible = true;
        
    }

    outAndScale(e){
        let _that = this;
        let target = e.currentTarget;
        TweenLite.to(target,.4,{width:target.startWidth,height:target.startHeight});
        _that.cursor = false;
        _that.pixiStage.cursor = 'auto';
        _that.mouseStyle.visible = false;
        // console.log(_that.pixiStage.cursor)
    }

    getCurrentTarget(e){
        if(!this.dragging && (this.currentTarget == null) && this.complete){
            this.complete = false;
            this.dragging = true;
            let _that = this;
            _that.currentTarget = e.target;
            _that.mouseStyle.texture = _that.mouseStyle.downed;

            //获取鼠标当前位置
            _that.startCos = e.data.getLocalPosition(_that.pixiStage);
        
            //获取初始位置
            _that.startPos.x = _that.currentTarget.x;
            _that.startPos.y = _that.currentTarget.y;

            //获取鼠标偏移量
            _that.offsetPos.x = _that.startCos.x - _that.startPos.x;
            _that.offsetPos.y = _that.startCos.y - _that.startPos.y;
            _that.pixiStage.setChildIndex(_that.zbContainer,_that.pixiStage.children.length-2)
            // console.log('点击',_that.currentTarget.x);
           
            _that.copySprit();  //复制元素
        
        }
    }

    moveTarget(e){
        if(this.currentTarget && this.dragging){
           
            this.mouseStyleAn.alpha = 0;
            this.mouseStyleAn2.alpha = 0;
            this.mouseStyleAn3.alpha = 0;

            let _that = this;
            _that.tip = false;
            let nowPos = e.data.getLocalPosition(_that.pixiStage);
            _that.currentTarget.x = nowPos.x - _that.offsetPos.x;
            _that.currentTarget.y = nowPos.y - _that.offsetPos.y;
          
            //提高层级
            // _that.zbContainer.setChildIndex(_that.currentTarget,_that.zbContainer.children.length-1)

            //碰撞检测

            if(_that.guideLayer.visible == true){
                if( 
                    _that.currentTarget.x+_that.currentTarget.width/2>_that.mainArr[0].x-_that.mainArr[0].width/2 &&
                    _that.currentTarget.x-_that.currentTarget.width/2<_that.mainArr[0].x+_that.mainArr[0].width/2 &&
                    _that.currentTarget.y+_that.currentTarget.height/2>_that.mainArr[0].y-_that.mainArr[0].height &&
                    _that.currentTarget.y-_that.currentTarget.height/2<_that.mainArr[0].y
                ){
                    console.log('碰到=====11111');
                    _that.comContainerArr[0].alpha = 1;
                    _that.comContainerArr[1].alpha = 0;
                    _that.comContainerArr[2].alpha = 0;
                    _that.touched = true;
                    _that.egg_index = 0;
                }
            }else{

                if( 
                    _that.currentTarget.x+_that.currentTarget.width/2>_that.mainArr[0].x-_that.mainArr[0].width/2 &&
                    _that.currentTarget.x<_that.a &&
                    _that.currentTarget.y+_that.currentTarget.height/2>_that.mainArr[0].y-_that.mainArr[0].height &&
                    _that.currentTarget.y-_that.currentTarget.height/2<_that.mainArr[0].y
                ){
                    console.log('11111');
                    _that.comContainerArr[0].alpha = 1;
                    _that.comContainerArr[1].alpha = 0;
                    _that.comContainerArr[2].alpha = 0;
                    _that.touched = true;
                    _that.egg_index = 0;
                }else{
              
                    if( 
                        _that.currentTarget.x>_that.a &&
                        _that.currentTarget.x<_that.b &&
                        _that.currentTarget.y+_that.currentTarget.height/2>_that.mainArr[1].y-_that.mainArr[1].height &&
                        _that.currentTarget.y-_that.currentTarget.height/2<_that.mainArr[1].y
                    ){
                        console.log('22222');
                        _that.comContainerArr[0].alpha = 0;
                        _that.comContainerArr[1].alpha = 1;
                        _that.comContainerArr[2].alpha = 0;
                        _that.touched = true;
                        _that.egg_index = 1;
    
    
                    }else{
                      
                        if( 
                            _that.currentTarget.x>_that.b &&
                            _that.currentTarget.x-_that.currentTarget.width/2<_that.mainArr[2].x+_that.mainArr[2].width/2 &&
                            _that.currentTarget.y+_that.currentTarget.height/2>_that.mainArr[0].y-_that.mainArr[0].height &&
                            _that.currentTarget.y-_that.currentTarget.height/2<_that.mainArr[0].y
                        ){
                            console.log('33333');
                            _that.comContainerArr[0].alpha = 0;
                            _that.comContainerArr[1].alpha = 0;
                            _that.comContainerArr[2].alpha = 1;
                            _that.touched = true;
                            _that.egg_index = 2;
    
                        }else{
                            console.log('没碰到');
                            _that.comContainerArr[0].alpha = 0;
                            _that.comContainerArr[1].alpha = 0;
                            _that.comContainerArr[2].alpha = 0;
                            _that.touched = false;
    
                        }
                    }
                }
            }




        }
    }
   

    leaveMoveTarget(e){
        if(this.currentTarget){
            let _that = this;
            _that.cursor = false;
            _that.mouseStyle.visible = false;
            _that.pixiStage.cursor = 'auto';
            // console.log('抬起',_that.currentTarget.x);
            if(_that.currentTarget.x == _that.startPos.x){
                _that.touched = false;
                _that.complete = true;
            }
            if(this.touched){
                console.log('碰到了=====');
                _that.complete = true;
                
    
                switch(_that.egg_index){
                    case 0:
                    let text1 = _that.eggArr[_that.egg_index].str;
                    _that.comContainerArr[_that.egg_index].alpha = 0;

                    if(_that.currentTarget.key == 'case'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text1,0,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num1 = 1;
                    }

                    if(_that.currentTarget.key == 'goods'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text1,2,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num2 = 1;
                    }                    

                    if(_that.currentTarget.key == 'flight'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text1,4,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num3 = 1;
                    }

                    if(_that.eggArr[_that.egg_index].num1 == 1 && 
                        _that.eggArr[_that.egg_index].num2 == 1 && 
                        _that.eggArr[_that.egg_index].num3 == 1
                    ){
                        console.log('111，首次装备成功');
                        _that.eggArr[_that.egg_index].finsh = true;
                        if(_that.guideLayer.visible == true){ //判断是否处于引导界面
                            _that.zhiyin2.visible = true;
                            _that.guideText.setText(_that.guideTextCont.text2);
                            _that.guideBg.width = 800;
                            // let a1 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            // let b1 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            let a1 = '2_1_2';
                            let b1 = '3_2_3';
                            _that.setSkinName(_that.eggArr[1],a1);
                            _that.setSkinName(_that.eggArr[2],b1);
                            _that.pixiStage.setChildIndex(_that.comContainer,_that.pixiStage.children.length-3);
                            

                            _that.button.visible = true;
                            _that.button.interactive = true;
                            _that.button.on('pointerdown',function(){
                                _that.guideLayer.visible = false;
                                _that.setSkinName(_that.eggArr[0],'1_0_0');
                                _that.setSkinName(_that.eggArr[1],'1_0_0');
                                _that.setSkinName(_that.eggArr[2],'1_0_0');
                                _that.eggArr.map((item,index)=>{
                                    item.num1 = 0;
                                    item.num2 = 0;
                                    item.num3 = 0;
                                    item.str = '1_0_0';
                                    item.goned = false;
                                    item.finsh = false;
                                })
                                _that.zhiyin2.visible = false;
                                _that.tip = false;

                            })
                          
                            _that.getEvents();
                        }else{

                            if( _that.eggArr[0].finsh == true &&
                                _that.eggArr[1].finsh == true &&
                                _that.eggArr[2].finsh == true
                            ){
                              _that.shaw_button.texture = _that.shaw_button.downed;
                              _that.shaw_button.interactive = true;  
                              _that.shaw_button.on('pointerdown',function(){
                                console.log('鸡蛋下落');
                                TweenLite.to(_that.zbContainer,.3,{x:566})
                                _that.shaw_button.visible = false;
                                res['audio_down'].sound.play();

                                _that.eggArr.map((item,index)=>{
                                    TweenLite.to(item,1,{y:1920,onComplete:function(){
                                        _that.gameBg.children[0].texture = _that.gameBg.checked;
                                        _that.speedDown(item);
                                        
                                    }})
                                })
                               
                              })
                            }
                        }
                    }

                    break;

                    case 1:

                    let text2 = _that.eggArr[_that.egg_index].str;
                    _that.comContainerArr[_that.egg_index].alpha = 0;
                    if(_that.currentTarget.key == 'case'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text2,0,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num1 = 1;
                    }
                    if(_that.currentTarget.key == 'goods'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text2,2,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num2 = 1;
                    }                    

                    if(_that.currentTarget.key == 'flight'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text2,4,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num3 = 1;
                    }
                    if(_that.eggArr[_that.egg_index].num1 == 1 && 
                        _that.eggArr[_that.egg_index].num2 == 1 && 
                        _that.eggArr[_that.egg_index].num3 == 1)
                    {
                        console.log('222,首次装备成功');
                        _that.eggArr[_that.egg_index].finsh = true;

                        if(_that.guideLayer.visible == true){ //判断是否处于引导界面
                            _that.guideText.setText(_that.guideTextCont.text2);
                            _that.guideBg.width = 800;
                            let a2 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            let b2 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            _that.setSkinName(_that.eggArr[0],a2);
                            _that.setSkinName(_that.eggArr[2],b2);
                            _that.button.visible = true;
                            _that.button.interactive = true;

                            _that.button.on('pointerdown',function(){
                                _that.guideLayer.visible = false;
                                _that.setSkinName(_that.eggArr[0],'1_0_0');
                                _that.setSkinName(_that.eggArr[1],'1_0_0');
                                _that.setSkinName(_that.eggArr[2],'1_0_0');
                                _that.eggArr.map((item,index)=>{
                                    item.num1 = 0;
                                    item.num2 = 0;
                                    item.num3 = 0;
                                    item.str = '1_0_0'

                                })
                            })
                        }else{
                          
                            if( _that.eggArr[0].finsh == true &&
                                _that.eggArr[1].finsh == true &&
                                _that.eggArr[2].finsh == true
                            ){
                              _that.shaw_button.texture = _that.shaw_button.downed; 
                              _that.shaw_button.interactive = true;  
                              _that.shaw_button.on('pointerdown',function(){
                                console.log('鸡蛋下落')
                                TweenLite.to(_that.zbContainer,.3,{x:566})
                                _that.shaw_button.visible = false;
                                res['audio_down'].sound.play();

                                _that.eggArr.map((item,index)=>{
                                    TweenLite.to(item,1,{y:1920,onComplete:function(){
                                        _that.gameBg.children[0].texture = _that.gameBg.checked;
                                        _that.gameBg.texture = _that.gameBg.checked;
                                        _that.speedDown(item);
                                        
                                    }})
                                })
                               

                              })
                            }
                        }
                    }
                    break;

                    case 2:
                   
                    let text3 = _that.eggArr[_that.egg_index].str;
                    _that.comContainerArr[_that.egg_index].alpha = 0;
                    if(_that.currentTarget.key == 'case'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text3,0,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num1 = 1;
                    }
                    if(_that.currentTarget.key == 'goods'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text3,2,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num2 = 1;
                    }                    

                    if(_that.currentTarget.key == 'flight'){
                        _that.eggArr[_that.egg_index].str = _that.replaceChat(text3,4,_that.currentTarget.value);
                        _that.setSkinName(_that.eggArr[_that.egg_index],_that.eggArr[_that.egg_index].str)
                        _that.eggArr[_that.egg_index].num3 = 1;
                    }
                    if(_that.eggArr[_that.egg_index].num1 == 1 && 
                        _that.eggArr[_that.egg_index].num2 == 1 &&
                        _that.eggArr[_that.egg_index].num3 == 1)
                    {
                        console.log('3333,首次装备完成');
                        _that.eggArr[_that.egg_index].finsh = true;
                        if(_that.guideLayer.visible == true){ //判断是否处于引导界面
                            _that.guideText.setText(_that.guideTextCont.text2);
                            _that.guideBg.width = 800;
                            let a3 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            let b3 = _that.rightResult[Math.floor(Math.random()*_that.rightResult.length)];
                            _that.setSkinName(_that.eggArr[0],a3);
                            _that.setSkinName(_that.eggArr[1],b3);
                            _that.button.visible = true;
                            _that.button.interactive = true;

                            _that.button.on('pointerdown',function(){
                                _that.guideLayer.visible = false;
                                _that.setSkinName(_that.eggArr[0],'1_0_0');
                                _that.setSkinName(_that.eggArr[1],'1_0_0');
                                _that.setSkinName(_that.eggArr[2],'1_0_0');
                                _that.eggArr.map((item,index)=>{
                                    item.num1 = 0;
                                    item.num2 = 0;
                                    item.num3 = 0;
                                    item.str = '1_0_0'
                                })
                            })
                        }else{
                         
                            if( _that.eggArr[0].finsh == true &&
                                _that.eggArr[1].finsh == true &&
                                _that.eggArr[2].finsh == true
                            ){
                              _that.shaw_button.texture = _that.shaw_button.downed;  
                              _that.shaw_button.interactive = true;  
                              _that.shaw_button.on('pointerdown',function(){
                                  console.log('鸡蛋下落');
                                  TweenLite.to(_that.zbContainer,.3,{x:566});
                                  _that.shaw_button.visible = false;
                                  res['audio_down'].sound.play();
                                  _that.eggArr.map((item,index)=>{
                                    TweenLite.to(item,1,{y:1920,onComplete:function(){
                                       
                                        _that.gameBg.children[0].texture = _that.gameBg.checked;
                                        _that.speedDown(item);
                                        
                                    }})
                                })
                                
                              })

                            }
                        }
                    }
                    break;
                }
                if(_that.guideLayer.visible == true){
                    if(_that.eggArr[_that.egg_index].num1 == 1 && _that.eggArr[_that.egg_index].num2 == 0 && _that.eggArr[_that.egg_index].num3 == 0){
                        _that.mouseStyleAn2.alpha = 1;
                        _that.mouseStyleAn2.visible = true;
                        _that.pixiStage.setChildIndex(_that.mouseStyleAn2,_that.pixiStage.children.length-2);
                        _that.zbContainer.children[2].on('pointerover',_that.overAndScale.bind(this));
                        _that.zbContainer.children[2].on('pointerout',_that.outAndScale.bind(this));
                        _that.zbContainer.children[2].on('pointerdown',_that.getCurrentTarget.bind(this));
                      
                    }
                    if(_that.eggArr[_that.egg_index].num1 == 1 && _that.eggArr[_that.egg_index].num2 == 1 && _that.eggArr[_that.egg_index].num3 == 0){
                        _that.mouseStyleAn3.alpha = 1;
                        _that.mouseStyleAn3.visible = true;
                        _that.pixiStage.setChildIndex(_that.mouseStyleAn3,_that.pixiStage.children.length-2)
                        console.log(_that.zbContainer)
                        _that.zbContainer.children[4].on('pointerover',_that.overAndScale.bind(this));
                        _that.zbContainer.children[4].on('pointerout',_that.outAndScale.bind(this));
                        _that.zbContainer.children[4].on('pointerdown',_that.getCurrentTarget.bind(this));
            
                    }
                }
                _that.zbContainer.removeChild(_that.currentTarget);                
                // _that.zbContainerArr.splice(_that.zbContainerArr.indexOf(_that.currentTarget),1);
                _that.currentTarget = null;
                
            }else{
                console.log('没碰到======');

               if(_that.currentTarget != null){
                   
                   TweenLite.to(_that.currentTarget,.5,{x:_that.currentTarget.startX,y:_that.currentTarget.startY,onComplete:function(){
                    
                       _that.zbContainer.removeChild(_that.currentTarget);
                       _that.complete = true;
                       _that.currentTarget = null;

                    //    console.log(_that.zbContainer.children.length,_that.zbContainerArr.length)

                   }});
               }

            }

            
            if(!this.tip){
                console.log('绑定其他元素');
                _that.getEvents();
            }

            _that.mouseStyle.texture = _that.mouseStyle.default;
            _that.dragging = false;
            _that.touched = false;

        }
    }
    
    getEvents(){
        let _that = this;
        _that.zbContainer.children.map((item,index)=>{
            item.on('pointerover',_that.overAndScale.bind(this));
            item.on('pointerout',_that.outAndScale.bind(this));
            item.on('pointerdown',_that.getCurrentTarget.bind(this));
        })
    }

    copySprit(){
        let _that = this;
        let zb_sprite = new PIXI.Sprite.fromImage(res[_that.currentTarget.name].url);
        zb_sprite.name = _that.currentTarget.name;
        zb_sprite.key = _that.currentTarget.key;
        zb_sprite.value = _that.currentTarget.value;
        zb_sprite.startX = _that.currentTarget.startX;
        zb_sprite.startY = _that.currentTarget.startY;
        zb_sprite.interactive = true;
        zb_sprite.anchor.set(.5,.5);
        zb_sprite.startWidth = _that.currentTarget.startWidth;
        zb_sprite.startHeight = _that.currentTarget.startHeight;
        zb_sprite.x = _that.currentTarget.startX;
        zb_sprite.y = _that.currentTarget.startY;
        _that.zbContainer.addChild(zb_sprite);
        // _that.zbContainerArr.push(zb_sprite);

        //提高层级
        _that.zbContainer.setChildIndex(_that.currentTarget,_that.zbContainer.children.length-1);
    }

    replaceChat(source,pos,newChar){ //替换一个字符串中某个位置的字符
        if(pos<0||pos>=source.length||source.length==0){
            return "invalid parameters...";
        }
        var iBeginPos= 0, iEndPos=source.length;
        var sFrontPart=source.substr(iBeginPos,pos);
        var sTailPart=source.substr(pos+1,source.length);
        var sRet=sFrontPart+newChar+sTailPart;
        return sRet;
    }


    speedDown(obj){

        let _that = this;

        if(obj.str == '2_1_1' || obj.str == '2_2_1'){ //1、7
            TweenLite.fromTo(obj,5,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();
                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                        },4000)
                }
            }})
        }

        if(obj.str == '3_2_1' || obj.str == '3_1_1'){ // 16、10
            TweenLite.fromTo(obj,4,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();
                
                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            
                            _that.init();
                
                        },4000)
                }
             
            }})
        }
        if(obj.str == '2_2_3' || obj.str == '2_1_3'){ //9、3
            TweenLite.fromTo(obj,3.5,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                
                        },4000)
                }
            
            }})
        }
        if(obj.str == '2_3_1'){ //4
            TweenLite.fromTo(obj,3.3,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                        },4000)
                }
             
            }})

        }
        if(obj.str == '3_3_1'){ //13
            TweenLite.fromTo(obj,3.2,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()

                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                        },4000)
                }
              
            }})
        }

        if(obj.str == '3_2_3' || obj.str == '3_1_3'){ //18、12
            TweenLite.fromTo(obj,3,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                        },4000)
                }
            }})
        }
        if(obj.str == '2_3_3'){ //6
            TweenLite.fromTo(obj,2.5,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                
                        },4000)
                }
            }})
        }
        if(obj.str == '3_3_3'){ //15
            TweenLite.fromTo(obj,2.2,{y:0},{y:800,onComplete:function(){
                res['audio_luodi'].sound.play();

                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                        console.log("下落完毕");
                        _that.eggArr.map((item,index)=>{
                            _that.makeShow(item);
                        })
                        setTimeout(()=>{
                            console.log("重新玩",_that.shadow);
                            _that.shadow.removeChildren()
                            _that.shadow.addChild(_that.shadow.shadow_lay);
                            _that.shadow.visible = false;
                            _that.init();
                
                        },4000)
                }
            }})
        }

        if(obj.str == '2_1_2' || obj.str == '2_3_2' || obj.str == '2_2_2' || obj.str == '3_1_2' ||
            obj.str == '3_3_2' || obj.str == '3_2_2'
            ){ //2、5、8、11、14、17
            TweenLite.fromTo(obj,2,{y:0},{y:800,onComplete:function(){
                res['audio_th'].sound.play();

                obj.state.setAnimation(1,'animation02',false);
                _that.setSkinName(obj,obj.str);
                obj.goned = true;
                if(_that.eggArr[0].goned == true &&
                    _that.eggArr[1].goned == true &&
                    _that.eggArr[2].goned == true){
                    console.log("下落完毕");
                    _that.eggArr.map((item,index)=>{
                        _that.makeShow(item);
                    })
                    setTimeout(()=>{
                        console.log("重新玩",_that.shadow);
                        _that.shadow.removeChildren();
                        _that.shadow.addChild(_that.shadow.shadow_lay);
                        _that.shadow.visible = false;
                        _that.init();
                    },4000);
                }
            }})
        }

    }

    makeShow(obj){
        let _that = this;
        if(obj.str == '2_3_2' || obj.str == '2_2_2' ||
        obj.str == '3_1_2' || obj.str == '3_1_3' || obj.str == '3_3_1' ||
        obj.str == '3_3_2' || obj.str == '3_3_3' || obj.str == '3_2_2' || obj.str == '3_2_3'
        ){ //全碎
            let egg1 = new PIXI.Sprite.fromImage(res['image_bad'].url);
            egg1.anchor.set(.5,.5);
            egg1.x = obj.x;
            egg1.y = obj.y-400;
            this.pixiStage.setChildIndex(this.finsh,this.pixiStage.children.length-1);
            
            setTimeout(()=>{
                this.shadow.addChild(egg1);
                this.shadow.visible = true;
                this.pixiStage.setChildIndex(this.shadow,this.pixiStage.children.length-3);
            },1000)
        }

        if(obj.str == '2_1_1' || obj.str == '2_1_3' || obj.str == '2_3_1' || obj.str == '2_2_1'){ //全好
            let egg2 = new PIXI.Sprite.fromImage(res['image_good'].url);
            egg2.anchor.set(.5,.5);
            egg2.x = obj.x;
            egg2.y = obj.y-400;
            this.pixiStage.setChildIndex(this.finsh,this.pixiStage.children.length-1);
            
            setTimeout(()=>{
                this.shadow.addChild(egg2);
                this.shadow.visible = true;
                this.pixiStage.setChildIndex(this.shadow,this.pixiStage.children.length-3);
            },1000)

        }

        if(obj.str == '2_1_2' || obj.str == '2_3_3' || obj.str == '2_2_3' || obj.str == '3_2_1' || obj.str == '3_1_1'){
            let arr = ['image_litter1','image_litter2','image_litter3'];
            let random = arr[Math.floor(Math.random()*arr.length)];
            let egg3 = new PIXI.Sprite.fromImage(res[random].url);
            egg3.anchor.set(.5,.5);
            egg3.x = obj.x;
            egg3.y = obj.y-400;
            this.pixiStage.setChildIndex(this.finsh,this.pixiStage.children.length-1);
           
            setTimeout(()=>{
                this.shadow.addChild(egg3);
                this.shadow.visible = true;
                this.pixiStage.setChildIndex(this.shadow,this.pixiStage.children.length-3);
            },1000)

        }
    }

    init(){
        let _that = this;
        console.log('dddd',_that.eggArr)
        _that.eggArr.map((item,index)=>{
            item.str = '1_0_0';
            item.state.setAnimation(1,'animation01',false);
            _that.setSkinName(item,'1_0_0');
            item.x = item.startX;
            item.y = item.startY;
            item.num1 = 0;
            item.num2 = 0;
            item.num3 = 0;
            item.finsh = false;
            item.goned = false;
        })
        _that.gameBg.children[0].texture = _that.gameBg.default;
        TweenLite.to(_that.zbContainer,.3,{x:0});
        _that.shaw_button.interactive = false;
        _that.shaw_button.texture = _that.shaw_button.default;
        _that.shaw_button.visible = true;
        // console.log("回来========",_that.zbContainer,_that.zbContainer.length,_that.zbContainerArr)
        _that.getEvents();
    }

}

PIXI.spine.core.Skeleton.prototype.setSkin1 = function (newSkin) {
    if (newSkin != null) {
      if (this.skin != null)
        newSkin.attachAll(this, this.skin);
      else {
        var slots = this.slots;

        for (var i = 0, n = slots.length; i < n; i++) {
          var slot = slots[i];
          var name_1 = slot.data.attachmentName;
          if (name_1 != null) {
            var attachment = newSkin.getAttachment(i, name_1);
            if (attachment != null) {
              slot.setAttachment(attachment);
            } else {
              slot.setAttachment(null);
            }

          }
        }
      }
    }
    this.skin = newSkin;
};

PIXI.spine.core.Skeleton.prototype.setSkinByName1 = function (skinName) {
var skin = this.data.findSkin(skinName);
if (skin == null)
    throw new Error("Skin not found: " + skinName);
this.setSkin1(skin);
};
export {Actuator};