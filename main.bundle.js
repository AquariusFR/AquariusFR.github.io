webpackJsonp([1,5],{

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_game_entity__ = __webpack_require__(407);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _Entity; });


var _Entity = (function () {
    function _Entity(engine, position) {
        this.angle = 90;
        this.type = __WEBPACK_IMPORTED_MODULE_0_app_game_entity__["a" /* EntityType */].human;
        this.weapons = [];
        this.selectedWeaponIndex = 0;
        this.engine = engine;
        this.position = position;
        this.id = _Entity.idcount++;
    }
    _Entity.prototype.maskEntity = function () {
        this.isMasked = true;
        this.setAnimation();
        return this;
    };
    _Entity.prototype.unmaskEntity = function () {
        this.isMasked = false;
        this.setAnimation();
        return this;
    };
    _Entity.prototype.listener = function () {
        //this.targeted(this);
    };
    _Entity.prototype.setAnimation = function () {
        var prefix = this.isMasked ? 'masked-' : '', angle = this.angle, animation = '';
        if (angle > 0) {
            if (angle < 45) {
                animation = prefix + 'right';
            }
            else if (angle < 135) {
                animation = prefix + 'down';
            }
            else {
                animation = prefix + 'left';
            }
        }
        else {
            angle = Math.abs(angle);
            if (angle < 45) {
                animation = prefix + 'right';
            }
            else if (angle < 135) {
                animation = prefix + 'up';
            }
            else {
                animation = prefix + 'left';
            }
        }
        console.log('direction', animation);
        this.engine.lookTo(this.sprite, animation);
    };
    _Entity.prototype.updateDirection = function (sourcePosition, targetPosition) {
        var angle = Math.atan2(targetPosition.y - sourcePosition.y, targetPosition.x - sourcePosition.x) * (180 / Math.PI);
        this.angle = angle;
        this.isMasked = this.square.mask;
        this.setAnimation();
    };
    _Entity.prototype.finishMoving = function () {
        this.sprite.play('stand-down');
        return this;
    };
    _Entity.prototype.attack = function (target) {
        this.updateDirection(this.position, target.position);
        return this;
    };
    _Entity.prototype.move = function (targetPosition, callback) {
        this.updateDirection(this.position, targetPosition);
        this.position = targetPosition;
        this.engine.moveTo(this.sprite, this.position.x, this.position.y, callback);
        return this;
    };
    _Entity.prototype.touched = function (sourceEntity, damage) {
        return this;
    };
    _Entity.prototype.die = function (sourceEntity) {
        this.sprite.alive = false;
        this.sprite.visible = false;
        this.sprite.animations.stop();
        var index = __WEBPACK_IMPORTED_MODULE_1_lodash__(this.team).remove(['id', this.id]).value();
        this.game.setDead(this, sourceEntity);
        return this;
    };
    _Entity.idcount = 0;
    return _Entity;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/_entity.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_game_bullet__ = __webpack_require__(406);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WEAPONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return WeaponPool; });


// prevoir une compétence pour utiliser les machines guns debout
var WEAPONS;
(function (WEAPONS) {
    WEAPONS[WEAPONS["NINEMM"] = 0] = "NINEMM";
    WEAPONS[WEAPONS["SHOOTGUN"] = 1] = "SHOOTGUN";
    WEAPONS[WEAPONS["AR15"] = 2] = "AR15";
    //Ruger No. 1 Varminter K1-V-BBZ
    WEAPONS[WEAPONS["RUGER_K1"] = 3] = "RUGER_K1";
    WEAPONS[WEAPONS["BLASER_R8"] = 4] = "BLASER_R8";
    WEAPONS[WEAPONS["PIPE"] = 5] = "PIPE";
    WEAPONS[WEAPONS["AXE"] = 6] = "AXE";
    WEAPONS[WEAPONS["PUNCH"] = 7] = "PUNCH";
    WEAPONS[WEAPONS["BAT"] = 8] = "BAT";
    WEAPONS[WEAPONS["NAILBAT"] = 9] = "NAILBAT";
    WEAPONS[WEAPONS["KNIFE"] = 10] = "KNIFE";
    WEAPONS[WEAPONS["KATANA"] = 11] = "KATANA";
    WEAPONS[WEAPONS["HAND_GRENADE"] = 12] = "HAND_GRENADE";
})(WEAPONS || (WEAPONS = {}));
var WeaponImpl = (function () {
    function WeaponImpl(data, game, key) {
        this.data = data;
        this.game = game;
        this.isJammed = false;
        this.rnd = this.game.engine.phaserGame.rnd;
        this.bulletGroup = this.game.engine.addGroup(data.name);
        for (var i = 0; i < 64; i++) {
            this.bulletGroup.add(new __WEBPACK_IMPORTED_MODULE_0_app_game_bullet__["a" /* Bullet */](this.game.engine.phaserGame, 'bullet6'), true);
        }
    }
    WeaponImpl.prototype.fire = function (sourceEntity, targetEntity) {
        this.bulletSpeed = 700;
        if (this.isJammed) {
            return;
        }
        if (this.data.isRanged) {
            if (this.data.currentAmmo > 0) {
                this.data.currentAmmo--;
            }
            else {
                //you should reload
                return;
            }
        }
        if (this.checkJam()) {
            return;
        }
        if (this.data.spreadAngle == 0) {
            var touchedEntity = this.shootSingleBullet(sourceEntity, targetEntity);
            var x = sourceEntity.position.x + 10;
            var y = sourceEntity.position.y + 10;
            var currentDistance = 0;
            if (!touchedEntity) {
                currentDistance = this.data.maxRange * 32;
            }
            else {
                var dx = Math.abs(x - touchedEntity.position.x);
                var dy = Math.abs(y - touchedEntity.position.y);
                currentDistance = (dx + dy);
            }
            var baseAngle = -Math.atan2(targetEntity.square.y - sourceEntity.square.y, targetEntity.square.x - sourceEntity.square.x) * (180 / Math.PI);
            console.log('fire bullet ', baseAngle);
            this.bulletGroup.getFirstExists(false).fire(x, y, -baseAngle, this.bulletSpeed, 0, 0, currentDistance);
        }
        else {
            this.shootMultyBullet(sourceEntity, targetEntity);
        }
    };
    WeaponImpl.prototype.shootSingleBullet = function (sourceEntity, targetEntity) {
        var damageModifier = 1; //plus tard on aura les modifieurs source et cible
        if (!this.checkHitSuccess()) {
            return;
        }
        if (this.checkCriticalSuccess()) {
            damageModifier = 2;
        }
        var damage = damageModifier * this.getDamage();
        targetEntity.touched(sourceEntity, damage);
        return targetEntity;
    };
    WeaponImpl.prototype.shootMultyBullet = function (sourceEntity, targetEntity) {
        var _this = this;
        // check les trajectoires des balles
        // angle par rapport à la cible
        // l'angle est à placer sur la ligne des x2. Puis on divise l'angle pour chacune des balles
        // on calcul des lignes de BresenhamLine pour checker le coup sur la première entité rencontrée (plus tard on verra pour celles derrière)
        var sourceSquare = sourceEntity.square, 
        // les y sont inversés, il faut donc inverser l'angle.
        baseAngle = -Math.atan2(targetEntity.square.y - sourceSquare.y, targetEntity.square.x - sourceSquare.x) * (180 / Math.PI), startAngle = baseAngle + (this.data.spreadAngle / 2), angleStep = this.data.spreadAngle / this.data.projectileByShot;
        __WEBPACK_IMPORTED_MODULE_1_lodash__["times"](this.data.projectileByShot, function (index) {
            _this.processSingleBullet(sourceEntity, sourceSquare, startAngle - (index * angleStep));
        });
    };
    WeaponImpl.prototype.toRadians = function (angle) {
        return angle * WeaponImpl.RADIANS_FACTOR;
    };
    //todo enregistrer tous les dommages d'une action et résoudre ça à la fin.
    WeaponImpl.prototype.processSingleBullet = function (sourceEntity, sourceSquare, currentAngle) {
        var _this = this;
        var targetX = Math.round(Math.cos(this.toRadians(currentAngle)) * this.data.maxRange) + sourceSquare.x, targetY = -Math.round(Math.sin(this.toRadians(currentAngle)) * this.data.maxRange) + sourceSquare.y, targetSquare = this.game.map.getSquare(targetX, targetY), lineOfSight = this.game.map.BresenhamLine(sourceSquare, targetSquare), entitiesOnLineOfSight = __WEBPACK_IMPORTED_MODULE_1_lodash__(lineOfSight)
            .tail()
            .filter(function (square) { return square.entity; }).map(function (square) { return square.entity; })
            .value(), lastPositionTouched = null, entityTouched = 0;
        console.log('bullet', currentAngle, targetX, targetY);
        entitiesOnLineOfSight.forEach(function (entity) {
            var damageModifier = 1; //plus tard on aura les modifieurs source et cible
            if (entityTouched >= _this.data.maxEntityByBullet) {
                return;
            }
            if (!_this.checkHitSuccess()) {
                return;
            }
            else {
                entityTouched++;
            }
            if (_this.checkCriticalSuccess()) {
                damageModifier = 2;
            }
            var damage = damageModifier * _this.getDamage();
            entity.touched(sourceEntity, damage);
            lastPositionTouched = entity.position;
        });
        console.log('fire bullet ', currentAngle);
        var x = sourceEntity.position.x + 10;
        var y = sourceEntity.position.y + 10;
        var currentDistance = 0;
        if (!lastPositionTouched) {
            currentDistance = this.data.maxRange * 32;
        }
        else {
            var dx = Math.abs(x - lastPositionTouched.x);
            var dy = Math.abs(y - lastPositionTouched.y);
            currentDistance = (dx + dy);
        }
        this.bulletGroup.getFirstExists(false).fire(x, y, -currentAngle, this.bulletSpeed, 0, 0, currentDistance);
    };
    WeaponImpl.prototype.reload = function () {
        this.data.currentAmmo = this.data.maxAmmo;
    };
    WeaponImpl.prototype.checkJam = function () {
        if (this.checkRollSuccess(this.data.jammedChance)) {
            this.isJammed = true;
        }
        return this.isJammed;
    };
    WeaponImpl.prototype.getDamage = function () {
        return this.rnd.integerInRange(this.data.minDamage, this.data.maxDamage);
    };
    WeaponImpl.prototype.checkCriticalSuccess = function () {
        return this.checkRollSuccess(this.data.criticalChance);
    };
    WeaponImpl.prototype.checkHitSuccess = function () {
        return this.checkRollSuccess(this.data.precision);
    };
    WeaponImpl.prototype.checkRollSuccess = function (chance) {
        var roll = this.rnd.realInRange(0, 100);
        return roll <= chance;
    };
    WeaponImpl.RADIANS_FACTOR = (Math.PI / 180);
    return WeaponImpl;
}());
var WeaponPool = (function () {
    function WeaponPool() {
    }
    WeaponPool.add = function (weapons, game) {
        switch (weapons) {
            case WEAPONS.NINEMM:
                return new WeaponImpl({
                    name: 'NINEMM',
                    minRange: 0,
                    maxRange: 9,
                    minDamage: 1,
                    maxDamage: 3,
                    precision: 65,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.SHOOTGUN:
                return new WeaponImpl({
                    name: 'SHOOTGUN',
                    minRange: 0,
                    maxRange: 5,
                    minDamage: 1,
                    maxDamage: 2,
                    precision: 80,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 4,
                    currentAmmo: 4,
                    spreadAngle: 30,
                    damageRange: 0,
                    projectileByShot: 6,
                    isRanged: false
                }, game, 'bullet8');
            case WEAPONS.PIPE:
                return new WeaponImpl({
                    name: 'PIPE',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.AXE:
                return new WeaponImpl({
                    name: 'AXE',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.PUNCH:
                return new WeaponImpl({
                    name: 'PUNCH',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.BAT:
                return new WeaponImpl({
                    name: 'BAT',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.NAILBAT:
                return new WeaponImpl({
                    name: 'NAILBAT',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.KNIFE:
                return new WeaponImpl({
                    name: 'KNIFE',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            case WEAPONS.KATANA:
                return new WeaponImpl({
                    name: 'KATANA',
                    minRange: 0,
                    maxRange: 0,
                    minDamage: 0,
                    maxDamage: 0,
                    precision: 0,
                    criticalChance: 10,
                    jammedChance: 5,
                    maxEntityByBullet: 1,
                    maxAmmo: 6,
                    currentAmmo: 6,
                    spreadAngle: 0,
                    damageRange: 0,
                    projectileByShot: 1,
                    isRanged: false
                }, game, 'bullet6');
            default:
                break;
        }
    };
    return WeaponPool;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/weapon.js.map

/***/ }),

/***/ 294:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 294;


/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(419);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/taff/_game_01-06/src/main.js.map

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_loader_game_service__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_game_game__ = __webpack_require__(408);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(elementRef, gameService) {
        this.elementRef = elementRef;
        this.gameService = gameService;
    }
    AppComponent.prototype.ngAfterContentInit = function () {
        this.game = new __WEBPACK_IMPORTED_MODULE_2_app_game_game__["a" /* Game */](this.gameService);
    };
    AppComponent.prototype.refresh = function () {
        this.map.draw();
    };
    AppComponent.prototype.getBackgroundCanvas = function () {
        var canvasBackground = this.elementRef.nativeElement.querySelector('.game__canvas__background');
        canvasBackground.width = 1280;
        canvasBackground.height = 720;
        return canvasBackground;
    };
    AppComponent.prototype.getSpritesCanvas = function () {
        var canvasSprites = this.elementRef.nativeElement.querySelector('.game__canvas__sprites');
        canvasSprites.width = 1280;
        canvasSprites.height = 720;
        return canvasSprites;
    };
    AppComponent.prototype.getMapCtx = function (mapCanvas) {
        var ctx = mapCanvas.getContext('2d');
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        return ctx;
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(477),
            providers: [__WEBPACK_IMPORTED_MODULE_1_app_loader_game_service__["a" /* GameService */]],
            styles: [__webpack_require__(473)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_app_loader_game_service__["a" /* GameService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1_app_loader_game_service__["a" /* GameService */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/app.component.js.map

/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__loader_default_request_options_service__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(404);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_4__loader_default_request_options_service__["a" /* requestOptionsProvider */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/app.module.js.map

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Bullet; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, key) {
        _super.call(this, game, 0, 0, key);
        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        this.anchor.set(0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.visible = false;
        this.tracking = false;
        this.scaleSpeed = 0;
    }
    Bullet.prototype.fire = function (x, y, angle, speed, gx, gy, distance) {
        gx = gx || 0;
        gy = gy || 0;
        this.reset(x, y);
        this.scale.set(1);
        this.distance = distance;
        this.sx = x;
        this.sy = y;
        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
        this.angle = angle;
        this.body.gravity.set(gx, gy);
        this.exists = true;
        this.visible = true;
    };
    Bullet.prototype.update = function () {
        if (!this.exists) {
            return;
        }
        var dx = Math.abs(this.sx - this.x);
        var dy = Math.abs(this.sy - this.y);
        var currentDistance = (dx + dy);
        console.log('currentDistance', currentDistance);
        if (currentDistance >= this.distance) {
            this.exists = false;
            this.visible = false;
        }
        if (this.tracking) {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }
        if (this.scaleSpeed > 0) {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }
    };
    return Bullet;
}(Phaser.Sprite));
//# sourceMappingURL=C:/taff/_game_01-06/src/bullet.js.map

/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EntityType; });
var EntityType;
(function (EntityType) {
    EntityType[EntityType["human"] = 0] = "human";
    EntityType[EntityType["zombie"] = 1] = "zombie";
})(EntityType || (EntityType = {}));
//# sourceMappingURL=C:/taff/_game_01-06/src/entity.js.map

/***/ }),

/***/ 408:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_game_player__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_game_zombie__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_game_map__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_phaser_engine__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_game_weapon__ = __webpack_require__(277);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Game; });





// a faire des zombie cadavres !!
// compétence S-link
// pendant le tour de l'IA, on désactive le clic
//pousser des trucs pour se cacher des zomblards
//le vent pour l'odeur ...
// faire des packs de zombies (à agreger par rapport à la distance)
//global revolver
var Game = (function () {
    function Game(gameService) {
        var _this = this;
        this.zombieTeamId = 0;
        this.playerTeamId = 1;
        this.ennemyTeamId = 2;
        this.map = new __WEBPACK_IMPORTED_MODULE_2_app_game_map__["a" /* GameMap */]('zombie');
        this.engine = new __WEBPACK_IMPORTED_MODULE_3_app_phaser_engine__["a" /* Engine */](this.map.getName(), gameService);
        this.engine.observable.subscribe(function (next) { return _this.setUpTeams(); }, function (error) { return console.error('error loading map'); }, function () { return console.log('c\'est fini'); });
    }
    Game.prototype.setUpTeams = function () {
        var _this = this;
        var engine = this.engine, targetCallback = function (z) { return _this.targeted(z); }, map = this.map;
        this.turn = 0;
        this.map.setEngine(engine);
        map.preparePathCalculator();
        this.playerTeam = new Array();
        this.ennemyTeam = new Array();
        this.zombieTeam = new Array();
        this.addPlayer(5, 3);
        this.addPlayer(6, 3)
            .addWeapon(__WEBPACK_IMPORTED_MODULE_4_app_game_weapon__["a" /* WEAPONS */].SHOOTGUN)
            .selectWeapon(1);
        this.addZombieAt(5, 7);
        this.addZombieAt(4, 8);
        this.addZombieAt(6, 8);
        this.addZombieAt(5, 8);
        this.addZombieAt(28, 17);
        this.addZombieAt(29, 17);
        this.addZombieAt(30, 17);
        this.addZombieAt(31, 17);
        this.addZombieAt(36, 12);
        this.addZombieAt(36, 10);
        this.addZombieAt(37, 10);
        this.addZombieAt(38, 10);
        this.addZombieAt(21, 21);
        this.currentIndex = -1;
        this.currentTeamId = this.playerTeamId;
        this.currentTeam = this.playerTeam;
        this.updateAllVisibilities();
        this.nextCharacter();
        this.showAccessibleTilesByPlayer();
        engine.bindClick(function (point) { return _this.clickOn(point); });
        engine.bindOver(function (point) { return _this.overOn(point); }, function (point) { return _this.overOff(point); });
    };
    Game.prototype.addZombieAt = function (x, y) {
        var zombie = __WEBPACK_IMPORTED_MODULE_1_app_game_zombie__["a" /* Zombie */].popZombie(this.engine, this.map.getPointAtSquare(x, y), this.zombieTeamId, this.zombieTeam, this);
        this.map.putEntityAtPoint(zombie);
        return zombie;
    };
    Game.prototype.addPlayer = function (x, y) {
        var player = __WEBPACK_IMPORTED_MODULE_0_app_game_player__["a" /* Player */].popPlayer(this.engine, this.map.getPointAtSquare(x, y), this.playerTeamId, this.playerTeam, this);
        this.map.putEntityAtPoint(player);
        return player;
    };
    Game.prototype.nextAction = function () {
        this.currentEntity.currentAction++;
        if (this.currentEntity.currentAction >= this.currentEntity.maxAction) {
            this.nextCharacter();
        }
        console.time(this.currentTeamId + '/' + this.currentEntity.id + ' nextAction');
        this.engine.removeAllVisibleTiles();
        this.updateVisibleSquaresOfEntity(this.currentEntity);
        this.prepareAction();
    };
    Game.prototype.nextCharacter = function () {
        if (this.currentIndex >= this.currentTeam.length - 1) {
            this.nextTeam();
            return;
        }
        this.currentIndex = this.currentIndex + 1;
        this.currentEntity = this.currentTeam[this.currentIndex];
        this.currentEntity.currentAction = 0;
        this.engine.setGlowPosition(this.currentEntity.position);
        this.engine.removeAllAccessibleTiles();
        this.engine.removeAllVisibleTiles();
    };
    Game.prototype.nextTeam = function () {
        this.currentIndex = -1;
        if (this.currentTeamId === this.playerTeamId) {
            this.currentTeamId = this.zombieTeamId;
            this.currentTeam = this.zombieTeam;
        }
        else if (this.currentTeamId === this.zombieTeamId) {
            this.currentTeamId = this.playerTeamId;
            this.currentTeam = this.playerTeam;
        }
        this.nextCharacter();
    };
    // une entité a été ciblé
    Game.prototype.targeted = function (target) {
        if (this.currentEntity.id === target.id) {
            console.log('it\'s me');
            return;
        }
        if (this.IsEntityInCurrentTeam(target)) {
            this.helpTeamMate(target);
        }
        else {
            this.currentEntity.attack(target);
        }
    };
    Game.prototype.updateVisibleSquaresOfEntity = function (entity) {
        console.time('updateVisibleSquaresOfEntity');
        this.map.setVisibileSquares(entity);
        console.timeEnd("updateVisibleSquaresOfEntity");
    };
    Game.prototype.updateAllVisibilities = function () {
        var _this = this;
        this.playerTeam.forEach(function (p) {
            _this.map.setVisibileSquares(p, true);
        });
        this.zombieTeam.forEach(function (z) {
            _this.map.setVisibileSquares(z, true);
        });
    };
    Game.prototype.IsEntityInCurrentTeam = function (target) {
        return target.teamId === this.currentTeamId;
    };
    Game.prototype.helpTeamMate = function (target) {
        console.log(this.currentEntity + ' helps ' + target);
    };
    Game.prototype.overOff = function (target) {
        if (this.currentTeamId !== this.playerTeamId || this.ticking) {
            return;
        }
        // clean visibletiles
        if (this.entityFocused) {
            //let points = this.entityFocused.visibleSquares.map(s => this.map.getPointAtSquare(s.x, s.y)).map(tile => tile.x + ':' + tile.y);
            this.engine.removeAllVisibleTiles();
        }
        this.entityFocused = null;
    };
    Game.prototype.overOn = function (target) {
        var _this = this;
        if (this.currentTeamId !== this.playerTeamId || this.ticking) {
            return;
        }
        var square = this.map.getSquareAtPoint(target);
        console.log('over', square);
        if (square.entity) {
            this.entityFocused = square.entity;
            var points = square.entity.visibleSquares.map(function (s) { return _this.map.getPointAtSquare(s.x, s.y); });
            console.time('addVisibleTiles');
            this.engine.addVisibleTiles([], points);
            console.timeEnd('addVisibleTiles');
        }
    };
    Game.prototype.clickOn = function (target) {
        var _this = this;
        if (this.currentTeamId !== this.playerTeamId || this.ticking) {
            return;
        }
        var square = this.map.getSquareAtPoint(target);
        // targeting something
        if (square.entity) {
            this.currentEntity.updateAccessibleTiles = false;
            this.targeted(square.entity);
            this.ticking = true;
            this.nextAction();
            this.ticking = false;
        }
        else {
            // moving to
            if (!this.map.canEntityGoToTarget(this.currentEntity, target)) {
                return;
            }
            this.map.moveEntityAtPoint(this.currentEntity, target, function () {
                _this.currentEntity.updateAccessibleTiles = true;
                _this.currentEntity.targetSquare = _this.map.getSquareAtPoint(target);
                _this.showAccessibleTilesByPlayer();
                _this.nextAction();
                _this.ticking = false;
            }, function (error) {
                console.log('sorry', error);
                _this.ticking = false;
            });
            this.ticking = true;
        }
    };
    Game.prototype.prepareAction = function () {
        var _this = this;
        if (this.currentTeamId === this.zombieTeamId) {
            console.time(this.currentTeamId + '/' + this.currentEntity.id + ' zombie play');
            this.zombieTeam[this.currentIndex].play(function () {
                console.timeEnd(_this.currentTeamId + '/' + _this.currentEntity.id + ' zombie play');
                console.timeEnd(_this.currentTeamId + '/' + _this.currentEntity.id + ' nextAction');
                console.time(_this.currentTeamId + '/' + _this.currentEntity.id + ' timeout');
                setTimeout(function () {
                    console.timeEnd(_this.currentTeamId + '/' + _this.currentEntity.id + ' timeout');
                    _this.nextAction();
                }, 300);
            });
        }
        else {
            if (this.currentEntity.currentAction === 0) {
                this.showAccessibleTilesByPlayer();
                console.timeEnd(this.currentTeamId + '/' + this.currentEntity.id + ' nextAction');
            }
        }
    };
    Game.prototype.showAccessibleTilesByPlayer = function () {
        this.currentEntity.updateAccessibleTiles = true;
        this.map.setAccessibleTilesByEntity(this.currentEntity);
        this.currentEntity.updateAccessibleTiles = false;
        this.showAccessibleTiles(this.currentEntity);
    };
    /**
     * show accessible tile for current entity
     */
    Game.prototype.showAccessibleTiles = function (entity) {
        var _this = this;
        var positions = new Array();
        entity.pathMap.forEach(function (path, key) {
            var splittedKey = key.split(':'), squareX = Number(splittedKey[0]), squareY = Number(splittedKey[1]);
            positions.push(_this.map.getPointAtSquare(squareX, squareY));
        });
        this.engine.addAccessibleTiles(positions);
    };
    Game.prototype.getPathTo = function (start, end, range, useDiagonal) {
        return this.map.getPathTo(start, end, range, useDiagonal);
    };
    Game.prototype.getSquare = function (x, y) {
        return this.map.getSquare(x, y);
    };
    Game.prototype.setDead = function (dead, by) {
        this.engine.showText(by.position.x, by.position.y, ' has killed ' + dead.id);
        this.map.setDead(dead);
    };
    return Game;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/game.js.map

/***/ }),

/***/ 409:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameMap; });

var tilesize = 32;
var GameMap = (function () {
    function GameMap(name) {
        this.name = name;
        this.entities = new Array();
        this.squares = new Map();
        this.mapLastUpdate = new Date().getTime();
    }
    GameMap.prototype.setEngine = function (engine) {
        this.engine = engine;
    };
    GameMap.prototype.setVisibileSquares = function (entity, force) {
        var _this = this;
        if (!entity.updateAccessibleTiles && !force) {
            return;
        }
        console.time(entity.id + '=>setVisibileSquares');
        var square = entity.square, x = square.x, y = square.y, perimetre = this.getSquareInRange(x, y, entity.visionRange), visibleSquares = new Array();
        // TODO comme pour les déplacements, mettre en cache les case déja visibles.
        perimetre.forEach(function (currentSquare) {
            var line = _this.BresenhamLine(square, currentSquare), squareJustBefore = line.length > 2 ? line[1] : null;
            // si la case justeavant masque la case, on ne l'ajoute pas
            if (squareJustBefore && entity.coverDetection < squareJustBefore.cover) {
                return;
            }
            var canSeeSquare = line.reduce(function (canSee, currentSquare) {
                // si l'entité ne peut pas voir au dela de l case, elle ne pourra pas voir plus loin
                if (currentSquare.cover === 100) {
                    return false;
                }
                return canSee;
            }, true);
            if (canSeeSquare) {
                visibleSquares.push(currentSquare);
            }
        });
        entity.visibleSquares = visibleSquares;
        console.timeEnd(entity.id + '=>setVisibileSquares');
    };
    GameMap.prototype.getSquareInRange = function (xm, ym, r) {
        //console.time('getSquareInRange');
        /* bottom left to top right */
        var x = -r, y = 0, err = 2 - 2 * r, perimetre = new Array(), squaresMap = new Map(), squaresInRange = new Array(), size = this.size, isBetween = this.isBetween, squares = this.squares;
        do {
            /*   I. Quadrant +x +y */
            addToSquares((xm - x), (ym + y));
            /*  II. Quadrant -x +y */
            addToSquares((xm - y), (ym - x));
            /* III. Quadrant -x -y */
            addToSquares((xm + x), (ym - y));
            /*  IV. Quadrant +x -y */
            addToSquares((xm + y), (ym + x));
            r = err;
            if (r <= y) {
                /* y step */
                err += ++y * 2 + 1;
            }
            if (r > x || err > y) {
                /* x step */
                err += ++x * 2 + 1;
            }
        } while (x < 0);
        squaresMap.forEach(function (s) { return squaresInRange.push(s); });
        //console.timeEnd("getSquareInRange");
        return squaresInRange;
        function addToSquares(x, y) {
            var step = x;
            if (x < xm) {
                for (step; step <= xm; step++) {
                    addSquareToRange();
                }
            }
            else {
                for (step; step >= xm; step--) {
                    addSquareToRange();
                }
            }
            function addSquareToRange() {
                var key = step + ':' + y, square = squares.get(key);
                if (square && (step >= 0 && y >= 0)) {
                    square.data.distanceFrom = step;
                    squaresMap.set(key, squares.get(key));
                }
            }
        }
    };
    // si derrière une case à 50% de cover il est invisible.
    // si il se trouve
    GameMap.prototype.getVisibleEntitiedByEntity = function (entity) {
        var _this = this;
        var square = entity.square, x = square.x, y = square.y, xMin = Math.max(x - entity.visionRange, 0), xMax = Math.min(x + entity.visionRange, this.size.width), yMin = Math.max(y - entity.visionRange, 0), yMax = Math.min(y + entity.visionRange, this.size.height), filter = function (e) {
            return _this.isBetween(e.square.x, xMin, xMax) && _this.isBetween(e.square.y, yMin, yMax);
        };
        var visibleEntities = this.entities.filter(filter).filter(function (e) { return _this.isEntityCanSeeEntityB(entity, e); });
        return visibleEntities;
    };
    GameMap.prototype.isBetween = function (value, min, max) {
        return min <= value && value <= max;
    };
    GameMap.prototype.isEntityCanSeeEntityB = function (a, b) {
        var squares = this.BresenhamLine(a.square, b.square);
        return squares.reduce(function (canSee, currentSquare) {
            // si l'entité ne peut pas voir au dela de al case, elle ne pourra pas voir plus loin
            if (a.coverDetection < currentSquare.cover) {
                return false;
            }
            return canSee;
        }, true);
    };
    // Returns the list of points from (x0, y0) to (x1, y1)
    GameMap.prototype.BresenhamLine = function (start, end) {
        var x0 = start.x, y0 = start.y, x1 = end.x, y1 = end.y, result = new Array(), steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
        // Optimization: it would be preferable to calculate in
        // advance the size of "result" and to use a fixed-size array
        // instead of a list.
        if (steep) {
            //Swap(ref x0, ref y0);
            x0 = start.y;
            y0 = start.x;
            //Swap(ref x1, ref y1);
            x1 = end.y;
            y1 = end.x;
        }
        if (x0 > x1) {
            //Swap(ref x0, ref x1);
            var tempX = x0;
            x0 = x1;
            x1 = tempX;
            //Swap(ref y0, ref y1);
            var tempY = y0;
            y0 = y1;
            y1 = tempY;
        }
        var deltax = x1 - x0, deltay = Math.abs(y1 - y0), error = 0, ystep = y0 < y1 ? 1 : -1, y = y0;
        for (var x = x0; x <= x1; x++) {
            var point = new Phaser.Point();
            if (steep) {
                point.x = y;
                point.y = x;
            }
            else {
                point.x = x;
                point.y = y;
            }
            var key = point.x + ':' + point.y;
            result.push(this.squares.get(key));
            error += deltay;
            if (2 * error >= deltax) {
                y += ystep;
                error -= deltax;
            }
        }
        return result;
    };
    GameMap.prototype.preparePathCalculator = function () {
        var _this = this;
        var tileMap = this.engine.map;
        this.size = {
            width: tileMap.width / 2,
            height: tileMap.height / 2
        };
        this.grid = new Array();
        __WEBPACK_IMPORTED_MODULE_0_lodash__["times"](this.size.height, function (rowIndex) {
            var row = new Array();
            __WEBPACK_IMPORTED_MODULE_0_lodash__["times"](_this.size.width, function (columnIndex) {
                var tilePosition = _this.getPointAtSquare(columnIndex, rowIndex), gridStatus = _this.engine.isPositionCollidable(tilePosition) ? 1 : 0, tileCover = _this.engine.getPositionCover(tilePosition), mask = _this.engine.getPositionMask(tilePosition);
                row.push(gridStatus);
                var key = columnIndex + ':' + rowIndex;
                if (!_this.squares.has(key)) {
                    _this.squares.set(key, {
                        entity: null,
                        x: columnIndex,
                        y: rowIndex,
                        cover: tileCover,
                        data: {},
                        mask: mask
                    });
                }
            });
            _this.grid.push(row);
        });
        // this.easyStar.enableCornerCutting();
        //this.easyStar.enableDiagonals();
    };
    GameMap.prototype.putEntityAtPoint = function (entity) {
        var position = new Phaser.Point;
        position.x = entity.position.x;
        position.y = entity.position.y;
        var square = this.getSquareAtPoint(position);
        if (square.entity) {
            throw new Error("entity.already.here");
        }
        this.grid[square.y][square.x] += 10;
        square.entity = entity;
        entity.square = square;
        entity.targetSquare = square;
        square.mask ? entity.maskEntity() : entity.unmaskEntity();
        this.entities.push(entity);
        return square;
    };
    GameMap.prototype.setAccessibleTilesByEntity = function (entity) {
        //mapLastUpdate
        entity.mapLastUpdate = this.mapLastUpdate;
        var squareInRange = this.getSquareInRange(entity.targetSquare.x, entity.targetSquare.y, entity.mouvementRange);
        var pathes = this.getWalkableTiles(entity.targetSquare, squareInRange, entity.mouvementRange);
        this.collecteAccessibleTiles(entity, pathes);
    };
    GameMap.prototype.collecteAccessibleTiles = function (entity, pathes) {
        entity.pathMap = pathes;
    };
    GameMap.prototype.moveEntityFollowingPath = function (entity, path, callback, error) {
        var self = this, grid = this.grid, sourceSquare = this.getSquareAtPoint(entity.position);
        var shortestPath = this.getPathTo(sourceSquare, __WEBPACK_IMPORTED_MODULE_0_lodash__["last"](path), entity.mouvementRange, true);
        if (shortestPath === null) {
            error('Path was not found.');
            return;
        }
        var currentPositionIndex = 0;
        move();
        function move() {
            var currentPathPoint = shortestPath[currentPositionIndex], currentPosition = self.getPointAtSquare(currentPathPoint.x, currentPathPoint.y);
            var square = self.getSquareAtPoint(currentPosition);
            entity.square = square;
            //at last position
            if (currentPositionIndex >= shortestPath.length - 1) {
                entity.move(currentPosition, function () {
                    var targetSquare = self.getSquareAtPoint(currentPosition);
                    entity.finishMoving();
                    sourceSquare.entity = null;
                    // un probleme ici ? cliquer sur 9:9 les zombies vont s'entasser
                    targetSquare.entity = entity;
                    var sourceInfo = grid[sourceSquare.y][sourceSquare.x];
                    if (sourceInfo === 0 || sourceInfo === 1) {
                        grid[sourceSquare.y][sourceSquare.x] = 0;
                    }
                    else if (sourceInfo > 9) {
                        grid[sourceSquare.y][sourceSquare.x] -= 10;
                    }
                    grid[targetSquare.y][targetSquare.x] += 10;
                    callback();
                });
                self.engine.moveGlowPosition(currentPosition);
                self.mapLastUpdate = new Date().getTime();
            }
            else {
                currentPositionIndex = currentPositionIndex + 1;
                console.log("moving to ", currentPosition.x + ':' + currentPosition.y, currentPathPoint);
                entity.move(currentPosition, function () { return move(); });
                self.engine.moveGlowPosition(currentPosition);
            }
        }
    };
    GameMap.prototype.canEntityGoToTarget = function (entity, targetPoint) {
        var targetSquare = this.getSquareAtPoint(targetPoint), key = this.getCoordinatesKey(targetSquare.x, targetSquare.y);
        return entity.pathMap.get(key) != null;
    };
    GameMap.prototype.moveEntityAtPoint = function (entity, targetPoint, callback, error) {
        var _this = this;
        var sourceSquare = this.getSquareAtPoint(entity.position), targetSquare = this.getSquareAtPoint(targetPoint), grid = this.grid;
        // on recalcule le chemin en activant les diagonales pour un chemin plus fluide
        var shortestPath = this.getPathTo(sourceSquare, targetSquare, entity.mouvementRange, true);
        if (!shortestPath) {
            error('Path was not found.');
            return;
        }
        var currentPositionIndex = 0;
        var move = function () {
            var currentPathPoint = shortestPath[currentPositionIndex], currentPosition = _this.getPointAtSquare(currentPathPoint.x, currentPathPoint.y), square = _this.getSquareAtPoint(currentPosition);
            entity.square = square;
            if (currentPositionIndex >= shortestPath.length - 1) {
                entity.move(currentPosition, function () {
                    entity.finishMoving();
                    sourceSquare.entity = null;
                    targetSquare.entity = entity;
                    var sourceInfo = grid[sourceSquare.y][sourceSquare.x];
                    if (sourceInfo === 0 || sourceInfo === 1) {
                        grid[sourceSquare.y][sourceSquare.x] = 0;
                    }
                    else if (sourceInfo > 9) {
                        grid[sourceSquare.y][sourceSquare.x] -= 10;
                    }
                    grid[targetSquare.y][targetSquare.x] += 10;
                    callback();
                });
                _this.engine.moveGlowPosition(currentPosition);
            }
            else {
                currentPositionIndex = currentPositionIndex + 1;
                console.log("moving to ", currentPosition.x + ':' + currentPosition.y, currentPathPoint);
                entity.move(currentPosition, function () { return move(); });
                _this.engine.moveGlowPosition(currentPosition);
            }
        };
        move();
    };
    GameMap.prototype.setDead = function (dead) {
        dead.square.entity = null;
        var grid = this.grid, sourceSquare = dead.square, sourceInfo = grid[sourceSquare.y][sourceSquare.x];
        if (sourceInfo <= 1) {
            grid[sourceSquare.y][sourceSquare.x] = 0;
        }
        else if (sourceInfo > 9) {
            grid[sourceSquare.y][sourceSquare.x] -= 10;
        }
    };
    GameMap.prototype.getName = function () {
        return this.name;
    };
    GameMap.prototype.getSize = function () {
        return this.size;
    };
    GameMap.prototype.getPointAtSquare = function (squareX, squareY) {
        var point = new Phaser.Point();
        point.x = Math.min(squareX * 32, this.size.width * 32);
        point.y = Math.min(squareY * 32, this.size.width * 32);
        return point;
    };
    GameMap.prototype.getSquare = function (x, y) {
        var key = this.getCoordinatesKey(x, y);
        return this.squares.get(key);
    };
    GameMap.prototype.getSquareAtPoint = function (point) {
        var key = this.getPointKey(point), squareX = Math.min(point.x / 32, this.size.width), squareY = Math.min(point.y / 32, this.size.width);
        if (!this.squares.has(key)) {
            this.squares.set(key, {
                entity: null,
                x: squareX,
                y: squareY,
                cover: 0,
                data: {},
                mask: false
            });
        }
        return this.squares.get(key);
    };
    GameMap.prototype.getPointKey = function (point) {
        var squareX = Math.min(point.x / 32, this.size.width), squareY = Math.min(point.y / 32, this.size.width);
        return this.getCoordinatesKey(squareX, squareY);
    };
    GameMap.prototype.getCoordinatesKey = function (x, y) {
        return x + ':' + y;
    };
    GameMap.prototype.getPathTo = function (start, end, range, useDiagonal) {
        var graph = this.buildNewGraph(end, useDiagonal), startTile = graph.grid[start.x][start.y], endTile = graph.grid[end.x][end.y], pathes = new Map(), rawPath = astar.search(graph, startTile, endTile), length = rawPath.length;
        //on coupe le chemin pour n'avoir que la partie la plus courte
        var path = __WEBPACK_IMPORTED_MODULE_0_lodash__["dropRight"](rawPath.map(function (p) { return { x: p.x, y: p.y }; }), length - 1 - range);
        return path;
    };
    GameMap.prototype.getWalkableTiles = function (start, squareInRange, range) {
        ///  a faire, voir les cases qui sont directements accessibles, tracer les chemins pour les autres cas
        var _this = this;
        console.time('getWalkableTiles');
        var self = this, tilesCalculated = 0, tilesCalculatedFinish = 0, currentDistance = 999, currentGroupIndex = -1, grid = this.grid, filteredPathes = new Map(), pathes = new Map(), graph = this.buildNewGraph(), squaresGroupedByDistance, processedGroupIndex;
        //for max range
        // search surrounding nodes
        squaresGroupedByDistance = squareInRange
            .sort(function (s1, s2) { return s1.data.distanceFrom - s2.data.distanceFrom; })
            .reverse()
            .reduce(function (groupedByDistance, currentSquare) {
            if (currentSquare.data.distanceFrom != currentDistance) {
                currentDistance = currentSquare.data.distanceFrom;
                currentGroupIndex++;
                groupedByDistance.push([]);
            }
            currentSquare.data.process = true;
            groupedByDistance[currentGroupIndex].push(currentSquare);
            return groupedByDistance;
        }, new Array());
        processedGroupIndex = 0;
        var startTile = graph.grid[start.x][start.y];
        console.time('astar.search');
        squaresGroupedByDistance.forEach(function (squares) {
            squares.forEach(function (currentSquare) {
                var endTile = graph.grid[currentSquare.x][currentSquare.y], pathKey = _this.getCoordinatesKey(currentSquare.x, currentSquare.y);
                if (pathes.has(pathKey)) {
                    return;
                }
                var rawPath = astar.search(graph, startTile, endTile);
                //on déroule le chemin, et on remplis les chemin vers les cases
                if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](rawPath) || rawPath.length > range) {
                    pathes.set(pathKey, null);
                    return;
                }
                var path = rawPath.map(function (p) { return { x: p.x, y: p.y }; });
                var length = path.length;
                path.forEach(function (square, index) {
                    var pathToSquare = __WEBPACK_IMPORTED_MODULE_0_lodash__["dropRight"](path, length - 1 - index);
                    pathes.set(_this.getCoordinatesKey(square.x, square.y), pathToSquare);
                });
            });
        });
        console.timeEnd('astar.search');
        pathes.forEach(function (pathTo, key) {
            if (pathTo) {
                filteredPathes.set(key, pathTo);
            }
        });
        console.timeEnd("getWalkableTiles");
        return filteredPathes;
    };
    GameMap.prototype.buildNewGraph = function (square, useDiagonal) {
        var negativeCollisionGrid = __WEBPACK_IMPORTED_MODULE_0_lodash__["range"](50).map(function (x) { return __WEBPACK_IMPORTED_MODULE_0_lodash__["range"](50).map(function (y) { return -1; }); });
        this.grid.map(function (line, rowIndex) {
            line.forEach(function (tile, columnIndex) {
                return negativeCollisionGrid[columnIndex][rowIndex] = tile > 0 ? 0 : 1;
            });
        });
        if (square) {
            negativeCollisionGrid[square.x][square.y] = 1;
        }
        //return new Graph(negativeCollisionGrid);
        return new Graph(negativeCollisionGrid, { diagonal: useDiagonal });
    };
    return GameMap;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/map.js.map

/***/ }),

/***/ 410:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_game_entity__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_game_weapon__ = __webpack_require__(277);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Player; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


var Player = (function (_super) {
    __extends(Player, _super);
    function Player(engine, position, teamId, team, game) {
        _super.call(this, engine, position);
        this.game = game;
        this.sprite = engine.createHuman(position);
        this.teamId = teamId;
        this.maxAction = 2;
        this.mouvementRange = 10;
        this.visionRange = 4;
        this.coverDetection = 10;
        this.updateAccessibleTiles = true;
        team.push(this);
    }
    Player.prototype.move = function (targetPosition, callback) {
        _super.prototype.move.call(this, targetPosition, callback);
        return this;
    };
    Player.popPlayer = function (engine, position, teamId, team, game) {
        var newPlayer = new Player(engine, position, teamId, team, game);
        newPlayer.addWeapon(__WEBPACK_IMPORTED_MODULE_1_app_game_weapon__["a" /* WEAPONS */].NINEMM);
        return newPlayer;
    };
    Player.prototype.attack = function (target) {
        _super.prototype.attack.call(this, target);
        this.engine.playSound('gun');
        this.engine.shake();
        this.weapons[this.selectedWeaponIndex].fire(this, target);
        console.log('zombie attacks ' + target.id + target.teamId);
        return this;
    };
    Player.prototype.addWeapon = function (weaponType) {
        this.weapons.push(__WEBPACK_IMPORTED_MODULE_1_app_game_weapon__["b" /* WeaponPool */].add(weaponType, this.game));
        return this;
    };
    Player.prototype.selectWeapon = function (index) {
        this.selectedWeaponIndex = index;
        return this;
    };
    return Player;
}(__WEBPACK_IMPORTED_MODULE_0_app_game_entity__["a" /* _Entity */]));
//# sourceMappingURL=C:/taff/_game_01-06/src/player.js.map

/***/ }),

/***/ 411:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_phaser_spawnable__ = __webpack_require__(418);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisibilitySprite; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var VisibilitySprite = (function (_super) {
    __extends(VisibilitySprite, _super);
    function VisibilitySprite(game) {
        _super.call(this, game, null, null, 'markers');
        this.animations.add("visible", ["marker/visible_tile"], 5, true);
        this.play("visible");
    }
    VisibilitySprite.prototype.spawn = function (x, y, data) {
        _super.prototype.spawn.call(this, x, y, data);
    };
    return VisibilitySprite;
}(__WEBPACK_IMPORTED_MODULE_0_app_phaser_spawnable__["a" /* Spawnable */]));
//# sourceMappingURL=C:/taff/_game_01-06/src/visibilitySprite.js.map

/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_game_entity__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Zombie; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


var status;
(function (status) {
    status[status["ALERT"] = 0] = "ALERT";
    status[status["IDDLE"] = 1] = "IDDLE";
    status[status["SEARCHING"] = 2] = "SEARCHING";
})(status || (status = {}));
var zombieTypes = ['01', '02', '03', '04', '05', '06', '07', '08'];
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    function Zombie(engine, position, teamId, team, game) {
        _super.call(this, engine, position);
        this.game = game;
        this.sprite = engine.createZombie(position, zombieTypes[__WEBPACK_IMPORTED_MODULE_1_lodash__["random"](0, zombieTypes.length - 1)]);
        this.teamId = teamId;
        this.team = team;
        this.maxAction = 2;
        this.mouvementRange = 6;
        this.pv = 6;
        this.currentStatus = status.IDDLE;
        this.visionRange = 12;
        this.coverDetection = 10;
        this.updateAccessibleTiles = true;
        team.push(this);
    }
    Zombie.popZombie = function (engine, position, teamId, team, game) {
        var newZombie = new Zombie(engine, position, teamId, team, game);
        return newZombie;
    };
    Zombie.prototype.play = function (callback) {
        var visibleEntities = this.visibleSquares.filter(function (square) { return square.entity; }).map(function (s) { return s.entity; });
        if (this.lookForHumaaaans(visibleEntities, callback)) {
            console.log('fresh meat ...');
        }
        else {
            this.goForCloserZombie(visibleEntities, callback);
        }
    };
    Zombie.prototype.pathToClosestEntity = function (entitiesGroup) {
        var _this = this;
        var closerHuman = null, actualDistanceFromHuman = 999, mouvementRange = this.mouvementRange, pathToGo = null, actualSquare = this.square, pathes = this.pathMap, moveTargetSquare, self = this, game = this.game;
        entitiesGroup.forEach(function (h) {
            var targetSquare = h.square;
            //check les 8 cases adjacentes à la cible
            checkPath(targetSquare.x - 1, targetSquare.y - 1);
            checkPath(targetSquare.x, targetSquare.y - 1);
            checkPath(targetSquare.x + 1, targetSquare.y - 1);
            checkPath(targetSquare.x - 1, targetSquare.y);
            checkPath(targetSquare.x + 1, targetSquare.y);
            checkPath(targetSquare.x - 1, targetSquare.y + 1);
            checkPath(targetSquare.x, targetSquare.y + 1);
            checkPath(targetSquare.x + 1, targetSquare.y + 1);
            if (!pathToGo) {
                var path = _this.game.getPathTo(actualSquare, targetSquare, mouvementRange), lastStep = __WEBPACK_IMPORTED_MODULE_1_lodash__["last"](path), lastSquare = lastStep ? _this.game.getSquare(lastStep.x, lastStep.y) : null;
                console.log('path to humaaaans', pathToGo);
                if (path) {
                    setClosestPath(path, lastSquare);
                    return;
                }
            }
            function checkPath(x, y) {
                if (actualSquare.x === x && actualSquare.y === y) {
                    setClosestPath([], actualSquare);
                    return;
                }
                var square = game.getSquare(x, y);
                if (square.entity) {
                    return;
                }
                var path = game.getPathTo(actualSquare, square, mouvementRange), lastStep = __WEBPACK_IMPORTED_MODULE_1_lodash__["last"](path), lastSquare = lastStep ? game.getSquare(lastStep.x, lastStep.y) : null;
                if (path && path.length > 0 && path.length < actualDistanceFromHuman && lastSquare === square) {
                    setClosestPath(path, lastSquare);
                    return;
                }
            }
            function pathStepEqualsToSquare(pathStep, square) {
                return pathStep.x === square.x && pathStep.y === square.y;
            }
            function setClosestPath(path, square) {
                closerHuman = h;
                actualDistanceFromHuman = path.length;
                pathToGo = path;
                moveTargetSquare = square;
            }
        });
        return {
            distance: actualDistanceFromHuman,
            entity: closerHuman,
            path: pathToGo,
            target: moveTargetSquare
        };
    };
    Zombie.prototype.goForCloserZombie = function (entities, callback) {
        var _this = this;
        var zombie = entities.filter(function (e) { return e.teamId === _this.teamId && e.id != _this.id; });
        var pathToClosest = this.pathToClosestEntity(zombie);
        if (!pathToClosest.entity) {
            callback();
            return false;
        }
        if (pathToClosest.distance === 0) {
            //this.attack(closerHuman);
            //attack
            this.updateAccessibleTiles = false;
            callback();
        }
        else {
            this.targetSquare = pathToClosest.target;
            this.updateAccessibleTiles = true;
            this.game.map.moveEntityFollowingPath(this, pathToClosest.path, function () { return callback(); }, function () { return console.error('oh ...'); });
        }
        return false;
    };
    Zombie.prototype.lookForHumaaaans = function (entities, callback) {
        var _this = this;
        var humans = entities.filter(function (e) { return e.teamId !== _this.teamId; });
        var pathToClosest = this.pathToClosestEntity(humans);
        //plus tard, il ira de manière aléatoire en favorisant le plus proche
        if (!pathToClosest.entity) {
            return false;
        }
        if (pathToClosest.distance === 0) {
            this.attack(pathToClosest.entity);
            //attack
            this.updateAccessibleTiles = false;
            callback();
        }
        else {
            this.targetSquare = pathToClosest.target;
            this.updateAccessibleTiles = true;
            this.game.map.moveEntityFollowingPath(this, pathToClosest.path, function () { return callback(); }, function () { return console.error('oh ...'); });
        }
        return true;
    };
    Zombie.prototype.attack = function (target) {
        _super.prototype.attack.call(this, target);
        this.engine.playSound('grunt');
        this.engine.shake();
        console.log('zombie attacks ' + target.id + target.teamId);
        return this;
    };
    Zombie.prototype.touched = function (sourceEntity, damage) {
        console.log('aaaargh', sourceEntity, 'hit me for', damage);
        this.engine.playSound('grunt');
        this.pv = this.pv - damage;
        if (this.pv <= 0) {
            console.log('aaaargh, i am really dead');
            this.die(sourceEntity);
        }
        return this;
    };
    return Zombie;
}(__WEBPACK_IMPORTED_MODULE_0_app_game_entity__["a" /* _Entity */]));
//# sourceMappingURL=C:/taff/_game_01-06/src/zombie.js.map

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(163);
/* unused harmony export DefaultRequestOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return requestOptionsProvider; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DefaultRequestOptions = (function (_super) {
    __extends(DefaultRequestOptions, _super);
    function DefaultRequestOptions() {
        _super.call(this);
        // Set the default 'Content-Type' header 
        this.headers.set('Content-Type', 'application/json');
    }
    DefaultRequestOptions = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [])
    ], DefaultRequestOptions);
    return DefaultRequestOptions;
}(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* BaseRequestOptions */]));
var requestOptionsProvider = { provide: __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */], useClass: DefaultRequestOptions };
/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=C:/taff/_game_01-06/src/default-request-options.service.js.map

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var GameService = (function () {
    function GameService(http) {
        this.http = http;
    }
    GameService.prototype.getMapJson = function (mapKey) {
        var _this = this;
        //assets/tiles/map00.json
        return this.http.get('assets/tiles/' + mapKey + '.json').map(function (response) { return _this.buildMapResponse(mapKey, response); });
    };
    GameService.prototype.buildMapResponse = function (mapKey, response) {
        var json = response.json(), tilesets = json.tilesets, layers = json.layers;
        return {
            name: mapKey,
            data: response.json(),
            layers: layers,
            tilesetImages: tilesets.map(function (s) { return {
                url: 'assets/tiles/' + s.image,
                key: s.name
            }; })
        };
    };
    GameService.prototype.LoadTileMap = function (mapResponse, game) {
        game.load.tilemap(mapResponse.name, null, mapResponse.data, Phaser.Tilemap.TILED_JSON);
        mapResponse.tilesetImages.forEach(function (t) {
            game.load.image(t.key, t.url);
        });
    };
    GameService.prototype.create = function (mapResponse, game, group) {
        var map = game.add.tilemap(mapResponse.name, 16, 16);
        mapResponse.tilesetImages.forEach(function (t) {
            game.load.image(t.key, t.url);
            map.addTilesetImage(t.key, t.key);
        });
        var layers = new Map();
        var tilePropertyMap = new Map();
        mapResponse.layers.forEach(function (l) {
            var layer = map.createLayer(l.name);
            layer.visible = l.opacity === 1;
            layers.set(l.name, layer);
            group.add(layer);
        });
        var tilesets = mapResponse.data.tilesets;
        tilesets.map(function (t) {
            return {
                'firstgid': t.firstgid,
                'tiles': t.tiles
            };
        })
            .filter(function (t) { return t.tiles; })
            .map(function (t) {
            var index = 0, tiles = t.tiles;
            for (var item in tiles) {
                var objectgroup = tiles[item].objectgroup;
                if (objectgroup) {
                    tilePropertyMap.set(t.firstgid + index, objectgroup);
                    index++;
                }
            }
        });
        return {
            map: map,
            layers: layers,
            tileMap: tilePropertyMap
        };
    };
    GameService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object])
    ], GameService);
    return GameService;
    var _a;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/game.service.js.map

/***/ }),

/***/ 415:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DelayedAnimation = (function (_super) {
    __extends(DelayedAnimation, _super);
    function DelayedAnimation() {
        _super.apply(this, arguments);
    }
    DelayedAnimation.addToAnimations = function (animationManager, delay, name, frames, frameRate, loop, useNumericIndex) {
        frames = frames || [];
        frameRate = frameRate || 60;
        if (loop === undefined) {
            loop = false;
        }
        //  If they didn't set the useNumericIndex then let's at least try and guess it
        if (useNumericIndex === undefined) {
            if (frames && typeof frames[0] === 'number') {
                useNumericIndex = true;
            }
            else {
                useNumericIndex = false;
            }
        }
        animationManager._outputFrames = [];
        animationManager._frameData.getFrameIndexes(frames, useNumericIndex, animationManager._outputFrames);
        var delayedAnimation = new DelayedAnimation(animationManager.game, animationManager.sprite, name, animationManager._frameData, animationManager._outputFrames, frameRate, loop);
        delayedAnimation.timelineDelay = delay;
        animationManager._anims[name] = delayedAnimation;
        animationManager.currentAnim = animationManager._anims[name];
        if (animationManager.sprite.tilingTexture) {
            animationManager.sprite.refreshTexture = true;
        }
        return animationManager._anims[name];
    };
    DelayedAnimation.prototype.update = function () {
        if (this.isPaused) {
            return false;
        }
        if (this.isPlaying && this.game.time.time >= this._timeNextFrame) {
            this._frameSkip = 1;
            //  Lagging?
            this._frameDiff = this.game.time.time - this._timeNextFrame + this.timelineDelay;
            this._timeLastFrame = this.game.time.time;
            if (this._frameDiff > this.delay) {
                //  We need to skip a frame, work out how many
                this._frameSkip = Math.floor(this._frameDiff / this.delay);
                this._frameDiff -= (this._frameSkip * this.delay);
            }
            //  And what's left now?
            this._timeNextFrame = this.game.time.time + (this.delay - this._frameDiff);
            if (this.isReversed) {
                this._frameIndex -= this._frameSkip;
            }
            else {
                this._frameIndex += this._frameSkip;
            }
            if (!this.isReversed && this._frameIndex >= this._frames.length || this.isReversed && this._frameIndex <= -1) {
                if (this.loop) {
                    // Update current state before event callback
                    this._frameIndex = Math.abs(this._frameIndex) % this._frames.length;
                    if (this.isReversed) {
                        this._frameIndex = this._frames.length - 1 - this._frameIndex;
                    }
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                    //  Instead of calling updateCurrentFrame we do it here instead
                    if (this.currentFrame) {
                        this._parent.setFrame(this.currentFrame);
                    }
                    this.loopCount++;
                    this._parent.events.onAnimationLoop$dispatch(this._parent, this);
                    this.onLoop.dispatch(this._parent, this);
                    if (this.onUpdate) {
                        this.onUpdate.dispatch(this, this.currentFrame);
                        // False if the animation was destroyed from within a callback
                        return !!this._frameData;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    this.complete();
                    return false;
                }
            }
            else {
                return this.updateCurrentFrame(true);
            }
        }
        return false;
    };
    return DelayedAnimation;
}(Phaser.Animation));
/* harmony default export */ __webpack_exports__["a"] = DelayedAnimation;
//# sourceMappingURL=C:/taff/_game_01-06/src/delayedAnimation.js.map

/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_phaser_pool__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_game_visibilitySprite__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_phaser_delayedAnimation__ = __webpack_require__(415);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Engine; });




// http://rpgmaker.su-downloads/%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F/238-pop-horror-city-character-pack-1-a
// https://forums.rpg-akerweb.com/index.php?threads/pop-freebies.45329/
// https://www.leshylabs.com/apps/sstool/
/*
#225378
#1695A3
#ACF0F2
#F3FFE2
#EB7F00
#DC3522
#D9CB9E
#374140
#2A2C2B
#1E1E20
 */
var Engine = (function () {
    function Engine(mapName, gameService) {
        var _this = this;
        this.gameService = gameService;
        this.mapVisibleTileCount = new Map();
        this.mapVisibleTile = new Map();
        this.horizontalScroll = true;
        this.verticalScroll = true;
        this.kineticMovement = true;
        this.speed = 300;
        this.debug = true;
        this.overTimer = {
            key: '',
            time: -1,
            tick: false,
            wasOver: false
        };
        this.observable = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].create(function (o) {
            _this.o = o;
            _this.status = o.next;
        });
        this.gameService.getMapJson(mapName).subscribe(function (next) { return _this.init(next); }, function (error) { return console.error('error loading map'); }, function () { return console.log('c\'est fini'); });
    }
    Engine.prototype.init = function (mapResponse) {
        var self = this;
        this.phaserGame = new Phaser.Game((window.innerWidth / 2) * window.devicePixelRatio, (window.innerHeight / 2) * window.devicePixelRatio, Phaser.WEBGL, 'game', { preload: preload, create: create, update: update }, false, false);
        function preload() {
            self.preload(mapResponse);
        }
        function create() {
            self.create(mapResponse);
        }
        function update() {
            self.update();
        }
    };
    Engine.prototype.bindClick = function (click) {
        this.click = click;
    };
    Engine.prototype.bindOver = function (over, overOff) {
        this.over = over;
        this.overOff = overOff;
    };
    Engine.prototype.shake = function () {
        this.phaserGame.camera.resetFX();
        this.phaserGame.camera.shake(0.004, 100, true, Phaser.Camera.SHAKE_BOTH, true);
        //this.phaserGame.camera.flash(0xffffff, 50, false, 0.7);
    };
    Engine.prototype.preload = function (mapResponse) {
        Phaser.Canvas.setImageRenderingCrisp(this.phaserGame.canvas);
        //this.phaserGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        //this.phaserGame.scale.setUserScale(2, 2);
        this.phaserGame.load.atlas('sprites', 'assets/sprites/spriteatlas/sprites.png', 'assets/sprites/spriteatlas/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.phaserGame.load.atlas('heroes-sprites', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Male_Heroes.png', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Male_Heroes.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.phaserGame.load.atlas('Male-Zombies-Gore', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Male_Zombies_Gore.png', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Male_Zombies_Gore.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.phaserGame.load.atlas('markers', 'assets/tiles/POPHorrorCity_GFX/Graphics/System/markers.png', 'assets/tiles/POPHorrorCity_GFX/Graphics/System/markers.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.gameService.LoadTileMap(mapResponse, this.phaserGame);
        this.phaserGame.load.audio('boden', ['assets/sounds/essai.mp3']);
        this.phaserGame.load.audio('MechDrone1', ['assets/sounds/MechDrone1.mp3']);
        this.phaserGame.load.audio('soundeffect', ['assets/sounds/soundeffect_game.ogg']);
        this.phaserGame.load.atlas('candle-glow', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Objects/Candle_Glow.png', 'assets/tiles/POPHorrorCity_GFX/Graphics/Characters/Objects/Candle_Glow.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.phaserGame.load.image('bullet8', 'assets/sprites/bullet8.png');
        this.phaserGame.load.image('bullet6', 'assets/sprites/bullet6.png');
    };
    Engine.prototype.create = function (mapResponse) {
        var game = this.phaserGame;
        var MechDrone1 = game.add.audio('MechDrone1', 1, true);
        var soundeffect = game.add.audio('soundeffect', 0.1, true);
        // il faut ordonnancer les groups par ordre d'apparition
        this.tileGroup = game.add.group();
        this.rangegroup = game.add.group();
        this.visiongroup = game.add.group();
        this.ihmGroup = game.add.group();
        this.gamegroup = game.add.group();
        MechDrone1.play();
        MechDrone1.volume = 0.5;
        soundeffect.volume = 0;
        //à enlever
        game.camera.setPosition(32, 32);
        soundeffect.allowMultiple = true;
        soundeffect.addMarker('shotgun', 1.130, 0.985);
        soundeffect.addMarker('gun', 0.575, 0.550);
        soundeffect.addMarker('grunt', 0, 0.570);
        this.soundeffect = soundeffect;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var createdMap = this.gameService.create(mapResponse, game, this.tileGroup);
        var collisionLayer = createdMap.layers.get('collisions');
        this.map = createdMap.map;
        this.tileMap = createdMap.tileMap;
        this.collisionLayer = collisionLayer;
        //this.map.setCollisionByExclusion([], true, this.collisionLayer);
        this.collisionLayer.resizeWorld();
        this.cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            cameraDown: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2),
            cameraUp: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8),
            cameraLeft: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4),
            cameraRight: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6),
            topTown: game.input.keyboard.addKey(Phaser.Keyboard.END)
        };
        this.visibleMarkerPool = new __WEBPACK_IMPORTED_MODULE_1_app_phaser_pool__["a" /* Pool */](game, __WEBPACK_IMPORTED_MODULE_2_app_game_visibilitySprite__["a" /* VisibilitySprite */], 200, 'visibleMarker');
        this.marker = game.add.sprite(0, 0, 'markers');
        this.ihmGroup.add(this.marker);
        this.marker.animations.add("blink", ["marker/blink1", "marker/blink2"], 5, true);
        this.marker.play("blink");
        game.physics.enable(this.marker, Phaser.Physics.ARCADE);
        this.glow = game.add.sprite(-100, -100, 'markers');
        this.ihmGroup.add(this.glow);
        this.glow.animations.add("glow", ["marker/active_entity"], 5, true);
        this.glow.play("glow");
        game.physics.enable(this.glow, Phaser.Physics.ARCADE);
        var lastLayer = createdMap.layers.get('example sprite');
        lastLayer.inputEnabled = true;
        lastLayer.events.onInputDown.add(this.clickListener, this);
        if (this.debug) {
            this.text = this.phaserGame.add.text(-100, -100, '', null);
        }
        //this.gamegroup.scale.x = 2;
        //this.gamegroup.scale.y = 2;
        this.o.next('ok');
    };
    Engine.prototype.removeAllAccessibleTiles = function () {
        this.rangegroup.removeAll();
    };
    Engine.prototype.addAccessibleTiles = function (tiles) {
        var _this = this;
        this.removeAllAccessibleTiles();
        tiles.forEach(function (tile) {
            var tileSprite = _this.phaserGame.add.sprite(tile.x, tile.y, 'markers');
            _this.rangegroup.add(tileSprite);
            tileSprite.animations.add("glow", ["marker/accessible_tile"], 5, true);
            tileSprite.play("glow");
        });
    };
    Engine.prototype.removeVisibleTiles = function (tilesKey) {
        var _this = this;
        tilesKey.forEach(function (tileKey) {
            if (_this.mapVisibleTileCount.has(tileKey)) {
                var count = 0;
                _this.mapVisibleTileCount.set(tileKey, count);
                _this.mapVisibleTile.get(tileKey).alive = false;
                _this.mapVisibleTile.get(tileKey).visible = false;
            }
        });
    };
    Engine.prototype.removeAllVisibleTiles = function () {
        this.mapVisibleTileCount = new Map();
        this.mapVisibleTile = new Map();
        this.visibleMarkerPool.sprites.forEach(function (sprite) {
            sprite.alive = false;
            sprite.visible = false;
        });
    };
    Engine.prototype.addVisibleTiles = function (oldTiles, tiles) {
        //console.time('addVisibleTiles');
        var _this = this;
        var oldKeysToDelete = new Set(), newKeys = new Set();
        tiles.forEach(function (tile) { return newKeys.add(tile.x + ':' + tile.y); });
        oldTiles.forEach(function (tile) {
            if (!newKeys.has(tile.x + ':' + tile.y)) {
                oldKeysToDelete.add(tile.x + ':' + tile.y);
            }
        });
        this.removeVisibleTiles(Array.from(oldKeysToDelete));
        tiles.forEach(function (tile) {
            var tileKey = tile.x + ':' + tile.y;
            if (!_this.mapVisibleTileCount.has(tileKey)) {
                _this.mapVisibleTileCount.set(tileKey, 0);
            }
            var count = _this.mapVisibleTileCount.get(tileKey);
            if (count < 1) {
                _this.mapVisibleTile.set(tileKey, _this.visibleMarkerPool.createNew(tile.x, tile.y));
            }
            if (!oldKeysToDelete.has(tileKey)) {
                _this.mapVisibleTileCount.set(tileKey, count + 1);
            }
        });
    };
    Engine.prototype.createHuman = function (position) {
        var human = this.phaserGame.add.sprite(position.x, position.y - 32, 'heroes-sprites');
        human.animations.add("down", ["sprite1", "sprite2", "sprite3"], 5, true);
        human.animations.add("left", ["sprite13", "sprite14", "sprite15"], 5, true);
        human.animations.add("right", ["sprite25", "sprite26", "sprite27"], 5, true);
        human.animations.add("up", ["sprite37", "sprite38", "sprite39"], 5, true);
        human.animations.add("stand-down", ["sprite2"], 5, true);
        human.play("stand-down");
        this.gamegroup.add(human);
        return human;
    };
    Engine.prototype.createZombie = function (position, zombieType) {
        var zombie = this.phaserGame.add.sprite(position.x, position.y - 32, 'Male-Zombies-Gore'), framerate = 3;
        zombie.smoothed = false;
        zombie.scale.setTo(1, this.phaserGame.rnd.realInRange(0.9, 1.2));
        var delay = this.phaserGame.rnd.integerInRange(0, 50);
        //zombie.animations.add("down", [zombieType + "-down-1", zombieType + "-down-2", zombieType + "-down-3", zombieType + "-down-2"], framerate, true);
        __WEBPACK_IMPORTED_MODULE_3_app_phaser_delayedAnimation__["a" /* default */].addToAnimations(zombie.animations, delay, "down", [zombieType + "-down-1", zombieType + "-down-2", zombieType + "-down-3", zombieType + "-down-2"], framerate, true);
        zombie.animations.add("left", [zombieType + "-left-1", zombieType + "-left-2", zombieType + "-left-3"], framerate, true);
        zombie.animations.add("right", [zombieType + "-right-1", zombieType + "-right-2", zombieType + "-right-3"], framerate, true);
        zombie.animations.add("up", [zombieType + "-up-1", zombieType + "-up-2", zombieType + "-up-3"], framerate, true);
        zombie.animations.add("masked-down", ["00-down-1", "00-down-2", "00-down-3"], framerate, true);
        zombie.animations.add("masked-left", ["00-left-1", "00-left-2", "00-left-3"], framerate, true);
        zombie.animations.add("masked-right", ["00-right-1", "00-right-2", "00-right-3"], framerate, true);
        zombie.animations.add("masked-up", ["00-up-1", "00-up-2", "00-up-3"], framerate, true);
        zombie.play("down");
        var frameIndex = this.phaserGame.rnd.integerInRange(0, zombie.animations.currentAnim.frameTotal);
        zombie.animations.currentAnim.setFrame(frameIndex);
        this.gamegroup.add(zombie);
        return zombie;
    };
    Engine.prototype.playSound = function (soundName) {
        this.soundeffect.volume = 0.5;
        this.soundeffect.play(soundName);
    };
    Engine.prototype.clickListener = function () {
        var marker = this.marker, targetPoint = new Phaser.Point();
        targetPoint.x = marker.x;
        targetPoint.y = marker.y;
        this.click(targetPoint);
    };
    Engine.prototype.overOffListener = function () {
        var marker = this.marker, targetPoint = new Phaser.Point();
        targetPoint.x = marker.x;
        targetPoint.y = marker.y;
        this.overOff(targetPoint);
    };
    Engine.prototype.overListener = function () {
        var marker = this.marker, targetPoint = new Phaser.Point();
        targetPoint.x = marker.x;
        targetPoint.y = marker.y;
        this.over(targetPoint);
    };
    Engine.prototype.setGlowPosition = function (position) {
        this.phaserGame.tweens.removeAll();
        this.glow.x = position.x;
        this.glow.y = position.y;
    };
    Engine.prototype.moveGlowPosition = function (position) {
        var _this = this;
        var game = this.phaserGame;
        if (this.glowTween && this.glowTween.isRunning) {
            this.glowTween.stop();
        }
        this.glowTween = game.add.tween(this.glow).to({ x: position.x, y: position.y }, 100, Phaser.Easing.Linear.None, true);
        this.glowTween.onComplete.add(function () { return _this.glowTween.stop(); }, this);
    };
    Engine.prototype.moveTo = function (sprite, x, y, callback) {
        var _this = this;
        var game = this.phaserGame;
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
        }
        this.tween = game.add.tween(sprite).to({ x: x, y: y - 32 }, 100, Phaser.Easing.Linear.None, true);
        this.tween.onComplete.add(function () { return _this.onComplete(sprite, callback); }, this);
    };
    Engine.prototype.lookTo = function (sprite, animationLooking) {
        sprite.play(animationLooking);
    };
    Engine.prototype.onComplete = function (sprite, callback) {
        callback();
    };
    Engine.prototype.getTopDownCameraPositionY = function () {
        var game = this.phaserGame, camera = game.camera;
        return (camera.bounds.bottom) - (camera.height / 2);
    };
    Engine.prototype.addGroup = function (groupName) {
        return this.phaserGame.add.group(this.phaserGame.world, groupName, false, true, Phaser.Physics.ARCADE);
    };
    Engine.prototype.updateCamera = function () {
        var game = this.phaserGame, camera = game.camera, activePointer = game.input.activePointer, cameraPosition = camera.position, livezone = 32, cameraStep = 16;
        if (activePointer.x <= livezone) {
            this.phaserGame.camera.setPosition(cameraPosition.x - cameraStep, cameraPosition.y);
        }
        else if (activePointer.y <= livezone) {
            this.phaserGame.camera.setPosition(cameraPosition.x, cameraPosition.y - cameraStep);
        }
        else if (activePointer.x >= camera.width - livezone) {
            this.phaserGame.camera.setPosition(cameraPosition.x + cameraStep, cameraPosition.y);
        }
        else if (activePointer.y >= camera.height - livezone) {
            var max = Math.min(cameraPosition.y + cameraStep, this.getTopDownCameraPositionY());
            this.phaserGame.camera.setPosition(cameraPosition.x, max);
        }
    };
    Engine.prototype.isPositionCollidable = function (position) {
        var tile = this.getTileAtPosition(position);
        return (tile && tile.properties.cantGo);
    };
    Engine.prototype.getPositionCover = function (position) {
        var tile = this.getTileAtPosition(position);
        return tile && tile.properties.cover ? tile.properties.cover : 0;
    };
    Engine.prototype.getPositionMask = function (position) {
        var tile = this.getTileAtPosition(position);
        return tile && tile.properties.mask ? true : false;
    };
    Engine.prototype.getTileAtPosition = function (position) {
        return this.map.getTileWorldXY(position.x, position.y, 16, 16, this.collisionLayer);
    };
    Engine.prototype.setMarker = function () {
        var marker = this.marker, tilePointBelowPointer = this.pointToTilePosition(); // get tile coordinate below activePointer
        if (this.isPositionCollidable(tilePointBelowPointer)) {
        }
        else {
            marker.x = tilePointBelowPointer.x;
            marker.y = tilePointBelowPointer.y;
            var key = (marker.x / 32) + ':' + (marker.y / 32), timestamp = new Date().getTime();
            var duration = timestamp - this.overTimer.time;
            if (this.overTimer.key == key) {
                if (duration > 300) {
                    if (!this.overTimer.tick) {
                        this.overListener();
                        this.overTimer.tick = true;
                        this.overTimer.wasOver = true;
                        if (this.debug) {
                            this.text.destroy();
                            this.text = this.phaserGame.add.text(marker.x, marker.y, key, null);
                            this.text.font = 'Roboto';
                            this.text.fontSize = 12;
                        }
                    }
                }
                else {
                    this.text.destroy();
                    this.overTimer.tick = false;
                }
            }
            else {
                this.text.destroy();
                this.overTimer.key = key;
                this.overTimer.time = timestamp;
                this.overTimer.tick = false;
                if (this.overTimer.wasOver) {
                    this.overOffListener();
                    this.overTimer.wasOver = false;
                }
            }
        }
    };
    Engine.prototype.showText = function (x, y, text) {
        if (this.xptext) {
            this.xptext.destroy();
        }
        this.xptext = this.phaserGame.add.text(x, y, text, null);
        this.xptext.font = 'Roboto';
        this.xptext.fontSize = 12;
    };
    Engine.prototype.pointToTilePosition = function () {
        var game = this.phaserGame, camera = game.camera, activePointer = game.input.activePointer, cameraPosition = camera.position, tilesetSize = 32, point = new Phaser.Point();
        point.x = tilesetSize * Math.round((activePointer.x + cameraPosition.x - 16) / tilesetSize);
        point.y = tilesetSize * Math.round((activePointer.y + cameraPosition.y - 16) / tilesetSize);
        return point;
    };
    Engine.prototype.handlerKeyBoard = function () {
        var camera = this.phaserGame.camera, cameraPosition = camera.position;
        var noDirectionPressedflag = true;
        if (this.wasd.cameraDown.isDown) {
            this.phaserGame.camera.setPosition(cameraPosition.x, cameraPosition.y + 5);
        }
        if (this.wasd.cameraLeft.isDown) {
            this.phaserGame.camera.setPosition(cameraPosition.x - 5, cameraPosition.y);
        }
        if (this.wasd.cameraRight.isDown) {
            this.phaserGame.camera.setPosition(cameraPosition.x + 5, cameraPosition.y);
        }
        if (this.wasd.cameraUp.isDown) {
            this.phaserGame.camera.setPosition(cameraPosition.x, cameraPosition.y - 5);
        }
        if (this.wasd.topTown.isDown) {
            this.phaserGame.camera.setPosition(cameraPosition.x, (camera.bounds.bottom) - (camera.height / 2));
        }
        if (noDirectionPressedflag) {
        }
    };
    Engine.prototype.update = function () {
        this.setMarker();
        this.updateCamera();
        this.handlerKeyBoard();
        this.gamegroup.sort('y', Phaser.Group.SORT_ASCENDING);
    };
    return Engine;
}());
//# sourceMappingURL=C:/taff/_game_01-06/src/engine.js.map

/***/ }),

/***/ 417:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Pool; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Pool = (function (_super) {
    __extends(Pool, _super);
    function Pool(game, spriteType, instances, name) {
        _super.call(this, game, game.world, name, false, true, Phaser.Physics.ARCADE);
        this.spriteType = spriteType;
        this.initializePool(instances);
    }
    Pool.prototype.initializePool = function (instances) {
        this.sprites = new Array();
        if (instances <= 0) {
            return;
        } // We don't need to add anything to the group
        for (var i = 0; i < instances; i++) {
            var sprite = this.add(new this.spriteType(this.game)); // Add new sprite
            sprite.poolId = i;
            this.sprites.push(sprite);
        }
    };
    Pool.prototype.createNew = function (x, y, data) {
        var obj = this.getFirstDead(false);
        if (!obj) {
            console.log('createNew');
            obj = new this.spriteType(this.game);
            this.add(obj, true);
        }
        obj.spawn(x, y, data);
        return obj;
    };
    return Pool;
}(Phaser.Group));
//# sourceMappingURL=C:/taff/_game_01-06/src/pool.js.map

/***/ }),

/***/ 418:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Spawnable; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Spawnable = (function (_super) {
    __extends(Spawnable, _super);
    function Spawnable(game, x, y, texture) {
        _super.call(this, game, x, y, texture);
    }
    Spawnable.prototype.spawn = function (x, y, data) {
        this.reset(x, y);
        this.data = data;
        this.exists = true;
        this.alive = true;
    };
    return Spawnable;
}(Phaser.Sprite));
//# sourceMappingURL=C:/taff/_game_01-06/src/spawnable.js.map

/***/ }),

/***/ 419:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=C:/taff/_game_01-06/src/environment.js.map

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(191)();
// imports


// module
exports.push([module.i, ".game__canvas__background{\r\n    position: relative;\r\n}\r\n.game__canvas__sprites{\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n}\r\n.game__canvas__background,\r\n.game__canvas__sprites{\r\n     -webkit-transform: translateZ(0);\r\n     transform: translateZ(0);\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 477:
/***/ (function(module, exports) {

module.exports = "<div style=\"position: relative\">\r\n    <div id=\"game\" class=\"game__canvas__sprites\"></div>\r\n</div>"

/***/ }),

/***/ 493:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(295);


/***/ })

},[493]);
//# sourceMappingURL=main.bundle.js.map