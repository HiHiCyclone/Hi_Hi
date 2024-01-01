// ==UserScript==
// @name 		shizoval | Cyclone
// @match 		https://*.tankionline.com/*
// @icon 		https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @require 	https://raw.githubusercontent.com/flyover/imgui-js/master/dist/imgui.umd.js
// @require 	https://raw.githubusercontent.com/flyover/imgui-js/master/dist/imgui_impl.umd.js
// @run-at 		document-start
// @grant 		none
// ==/UserScript==
(() => {
    "use strict";
    var e = {
            462: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                }), a(75);
                var o = a(817);
                class i {
                    #e = o.vc.data.airBreakData;
                    #t = !1;
                    #a = {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    tankPhysicsComponent;
                    lastPosition = {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    nextTime = 0;
                    get state() {
                        return this.#t
                    }
                    clearVelocity = () => {
                        this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.z] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.x] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.y] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0
                    };
                    setAirBreakPosition = e => {
                        if (this.#e.killZoneData.state) {
                            let t = gameObjects.gameMode?.BattleMapComponent;
                            if (!t) return;
                            let a = o.P6.getKillZone(t);
                            0 !== e.x && e.x >= a.maxX && (e.x = a.maxX), 0 !== e.y && e.y >= a.maxY && (e.y = a.maxY), 0 !== e.z && e.z >= a.maxZ && (e.z = a.maxZ), 0 !== e.x && e.x <= a.minX && (e.x = a.minX), 0 !== e.y && e.y <= a.minY && (e.y = a.minY), 0 !== e.z && e.z <= a.minZ && (e.z = a.minZ)
                        }
                        e.x && 0 !== e.x && (this.#a.x = e.x), e.y && 0 !== e.y && (this.#a.y = e.y), e.z && 0 !== e.z && (this.#a.z = e.z)
                    };
                    onAirBreakActivated = () => {
                        const e = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                        e && this.setAirBreakPosition({
                            x: e[vector3.x],
                            y: e[vector3.y],
                            z: e[vector3.z]
                        })
                    };
                    onAirBreakDeactivated = () => {
                        this.clearVelocity(), this.tankPhysicsComponent[tankPhysicsComponent.body][body.movable] = !0
                    };
                    toggleState = () => {
                        (this.#t = !this.#t) ? this.onAirBreakActivated(): this.onAirBreakDeactivated()
                    };
                    setRayLenght = (e, t) => {
                        e && (e[trackedChassis.params][suspensionParams.maxRayLength] = t)
                    };
                    align = e => {
                        const t = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.orientation];
                        switch (e) {
                            case "noob":
                                this.clearVelocity(), t[quaternion.fromEulerAngles](0, this.#e.flip ? Math.PI : 0, 0);
                                break;
                            case 0:
                                this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0, this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0, t[quaternion.x] = 0, t[quaternion.y] = 0;
                                break;
                            default:
                                this.clearVelocity(), t[quaternion.fromEulerAngles](this.#e.tilt ? this.#e.flip ? e[followCamera.pathPosition] : -e[followCamera.pathPosition] : 0, this.#e.flip ? Math.PI : 0, e[followCamera.currState][followCameraState.direction])
                        }
                    };
                    alignTank = e => {
                        switch (this.#e.typeData.state) {
                            case "airWalk":
                                this.align(0);
                                break;
                            case "default":
                                this.align(e);
                                break;
                            case "noob":
                                this.align("noob")
                        }
                    };
                    setSmoothPosition = (e, t, a) => {
                        "default" !== this.#e.typeData.state && "noob" !== this.#e.typeData.state || (e.x += (t.x - e.x) / a, e.y += (t.y - e.y) / a), e.z += (t.z - e.z) / a
                    };
                    setPosition = () => {
                        const e = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position],
                            t = {
                                x: e[vector3.x],
                                y: e[vector3.y],
                                z: e[vector3.z]
                            };
                        this.setSmoothPosition(t, this.#a, this.#e.smoothData.state), e[vector3.x] = t.x, e[vector3.y] = t.y, e[vector3.z] = t.z
                    };
                    getSpeed = e => {
                        switch (e) {
                            case "forward":
                            case "right":
                            case "up":
                                return this.#e.speedData.state;
                            default:
                                return -this.#e.speedData.state
                        }
                    };
                    getRadian = (e, t) => {
                        switch (e) {
                            case "forward":
                            case "back":
                                return -t;
                            case "left":
                            case "right":
                                return -(t - Math.PI / 2)
                        }
                        return 0
                    };
                    onMoved = (e, t = 0) => {
                        let a = this.getSpeed(e),
                            o = this.getRadian(e, t),
                            i = {
                                x: 0,
                                y: 0,
                                z: 0
                            };
                        switch (e) {
                            case "forward":
                            case "back":
                            case "left":
                            case "right":
                                switch (this.#e.typeData.state) {
                                    case "default":
                                        i.x = this.#a.x + a * Math.sin(o), i.y = this.#a.y + a * Math.cos(o);
                                        break;
                                    case "noob":
                                        "left" !== e && "right" !== e || (i.x = this.#a.x + a), "forward" !== e && "back" !== e || (i.y = this.#a.y + a)
                                }
                                break;
                            default:
                                i.z = this.#a.z + a
                        }
                        this.setAirBreakPosition(i)
                    };
                    keyHandler = e => {
                        let t;
                        const automoveEnabled = config.data.automove;
                        const SMK = config.data.smk;

                        switch (t = this.#e.speedData, o.P6.isBindPressed(t.inc) && (t.state += 10, t.state > 1e3 && (t.state = 1e3)), o.P6.isBindPressed(t.dec) && (t.state -= 10, t.state < 10 && (t.state = 10)), t = this.#e.smoothData, o.P6.isBindPressed(t.inc) && (t.state += 1, t.state > 100 && (t.state = 100)), o.P6.isBindPressed(t.dec) && (t.state -= 1, t.state < 1 && (t.state = 1)), t = this.#e.killZoneData, o.P6.isBindPressed(t) && (t.state = !t.state), t = this.#e.typeData, o.P6.isBindPressed(t.default) && (t.state = "default"), o.P6.isBindPressed(t.simple) && (t.state = "noob"), o.P6.isBindPressed(t.airWalk) && (t.state = "airWalk"), t = this.#e.movementData, this.#e.typeData.state) {
                            case "noob":
                            case "default":
                            case "airWalk":
                                if (automoveEnabled) {
                                    const newPosition = this.randomPosition();
                                    this.sendNewPosition(newPosition);

                                    if (newPosition.z < this.lastPosition.z) {
                                        newPosition.z = this.lastPosition.z;
                                    }

                                    o.P6.isBindPressed(t.forward) && (this.onMoved("forward", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.back) && (this.onMoved("back", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.left) && (this.onMoved("left", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.right) && (this.onMoved("right", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.up) && (this.onMoved("up"), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.down) && (this.onMoved("down"), this.sendCurrentPosition());
                                } else if (SMK) {
                                    const newPosition = {
                                        x: this.lastPosition.x,
                                        y: this.lastPosition.y,
                                        z: this.lastPosition.z
                                    };
                                    this.sendNewPosition(newPosition);

                                    o.P6.isBindPressed(t.forward) && (this.onMoved("forward", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.back) && (this.onMoved("back", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.left) && (this.onMoved("left", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.right) && (this.onMoved("right", e), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.up) && (this.onMoved("up"), this.sendCurrentPosition());
                                    o.P6.isBindPressed(t.down) && (this.onMoved("down"), this.sendCurrentPosition());
                                } else {
                                    o.P6.isBindPressed(t.forward) && (this.onMoved("forward", e), this.sendNewPosition(this.#a));
                                    o.P6.isBindPressed(t.back) && (this.onMoved("back", e), this.sendNewPosition(this.#a));
                                    o.P6.isBindPressed(t.left) && (this.onMoved("left", e), this.sendNewPosition(this.#a));
                                    o.P6.isBindPressed(t.right) && (this.onMoved("right", e), this.sendNewPosition(this.#a));
                                    o.P6.isBindPressed(t.up) && (this.onMoved("up"), this.sendNewPosition(this.#a));
                                    o.P6.isBindPressed(t.down) && (this.onMoved("down"), this.sendNewPosition(this.#a));
                                }
                                break;
                        }
                    };
                    randomPosition = () => {
                        const e = {
                            x: 0,
                            y: 0,
                            z: 0
                        };
                        let t = gameObjects.gameMode?.BattleMapComponent,
                            a = o.P6.getKillZone(t);
                        return a && (e.x = o.P6.getRandomArbitrary(a.minX, a.maxX), e.y = o.P6.getRandomArbitrary(a.minY, a.maxY), e.z = Math.round(Math.random()) ? a.maxZ : a.boundMaxZ + 500), e
                    };
                    sendCurrentPosition = () => {
                        this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x] = this.lastPosition.x, this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y] = this.lastPosition.y, this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z] = this.lastPosition.z, this.lastPosition.x = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x], this.lastPosition.y = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y], this.lastPosition.z = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z]
                    };
                    sendNewPosition = e => {
                        this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x] = e.x, this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y] = e.y, this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z] = e.z, this.lastPosition.x = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x], this.lastPosition.y = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y], this.lastPosition.z = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z]
                    };
                    reset = () => {
                        this.#t = !1, this.tankPhysicsComponent = void 0, this.nextTime = 0
                    };
                    process = (e, t) => {
                        if (!1 === this.#t ? this.setRayLenght(gameObjects.localTank.TrackedChassis, 50) : "airWalk" === this.#e.typeData.state && this.setRayLenght(gameObjects.localTank.TrackedChassis, 1e100), e && t) {
                            if (this.tankPhysicsComponent = e, !this.tankPhysicsComponent) return;
                            o.P6.isBindPressed(this.#e.toggleStateData) && this.toggleState(), !0 === this.#t && (this.keyHandler(t[followCamera.currState][followCameraState.direction]), this.alignTank(t), this.setPosition(), this.tankPhysicsComponent[tankPhysicsComponent.body][body.movable] = "airWalk" === this.#e.typeData.state)
                        }
                    }
                }
            },
            38: (e, t, a) => {
                a.d(t, {
                    Z: () => s
                });
                var o = a(817);
                let i = "",
                    n = "";
                class s {
                    #o = 1500;
                    #i = !1;
                    #n = !1;
                    #s;
                    #e = o.vc.data.cameraData;
                    reset = () => {
                        this.#i = !1, this.#s = void 0
                    };
                    distance = () => {
                        this.#e.state && (this.#o += 1e3, this.#o > 2500 && (this.#o = 500))
                    };
                    process = (e, t) => {
                        if (o.P6.isBindPressed(this.#e) && this.distance(), this.#i) return;
                        if (!e || !t) return;

                        function a(e, t, a) {
                            return e < t ? t : e > a ? a : e
                        }
                        this.#s = e, e[followCamera.polarDistance].copy = e[followCamera.polarDistance][dampedSpring.update], e[followCamera.pitch].copy = e[followCamera.pitch][dampedSpring.update], e[followCamera.elevation].copy = e[followCamera.elevation][dampedSpring.update], e.copy = e[followCamera.updatePath], e[followCamera.updatePath] = function(e) {
                            if (!1 === o.$l.#e.state || !document.pointerLockElement) return this.copy(e);
                            const t = a(e, -Math.PI / 2, Math.PI / 2);
                            this[followCamera.pathPointElevation] = this[followCamera.pathPosition] = t, this[followCamera.pathPositionOffset] = a(this[followCamera.pathPositionOffset], -t, 1 - t)
                        }, e[followCamera.polarDistance][dampedSpring.update] = function(e, t) {
                            if (!1 === o.$l.#e.state || !document.pointerLockElement) return this.copy(e, t);
                            this[dampedSpring.value] += (o.$l.#o - this[dampedSpring.value]) / 20
                        }, e[followCamera.pitch][dampedSpring.update] = function(t, a) {
                            if (!1 === o.$l.#e.state || !document.pointerLockElement) return this.copy(t, a);
                            this[dampedSpring.value] = e[followCamera.pathPosition]
                        }, e[followCamera.elevation][dampedSpring.update] = function(t, a) {
                            if (!1 === o.$l.#e.state || !document.pointerLockElement) return this.copy(t, a);
                            this[dampedSpring.value] = e[followCamera.pathPosition] + .3
                        }, t[followCameraHeightController.getTickEnabled] = function() {
                            return !1 === o.$l.#e.state || !document.pointerLockElement
                        }, !0 !== this.#n && (document.addEventListener("mousemove", (t => {
                            !1 !== this.#e.state && this.#s && document.pointerLockElement && (this.#s[followCamera.pathPosition] += 525e-6 * t.movementY, e[followCamera.updatePath](this.#s[followCamera.pathPosition]))
                        }), !1), this.#n = !0);
                        const s = getComponentNames(gameObjects.localTank?.FollowCamera)?.CameraComponent;
                        s && (n || (n = Object.entries(s.__proto__)[1][0], n)) && (!s.copy && (s.copy = s[n]), s[n] = function(e) {
                            i || (i = Object.entries(e)[0][0]), this.copy(e), e[i] = o.vc.data.cameraData.fov
                        }, this.#i = !0)
                    }
                }
            },
            24: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    #e = o.vc.data.clickerData;
                    temp = !1;
                    firstAid;
                    mine;
                    nativeIdentityMap;
                    constructor() {
                        setInterval(this.suppliesLowPriority, 300), setInterval(this.suppliesHighPriority, 0)
                    }
                    reset = () => {
                        this.temp = !1, this.firstAid = void 0, this.mine = void 0, this.nativeIdentityMap = void 0
                    };
                    getSupplyByName = e => "MINE" === e ? (this.mine || (this.mine = getComponentNames(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.SuppliesComponent || o.UJ.localTank?.SuppliesHudComponent)?.LinkedHashMap)?.ChainEntry)?.ChainEntry)?.SupplyTypeConfig), this.mine) : "FIRST_AID" === e ? (this.firstAid || (this.firstAid = getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.SuppliesComponent || o.UJ.localTank?.SuppliesHudComponent)?.LinkedHashMap)?.ChainEntry)?.SupplyTypeConfig), this.firstAid) : void 0;
                    activateSupply = (e, t, a = 30) => {
                        if (!this.nativeIdentityMap) {
                            const e = getComponentNames(o.UJ.world?.InputManager),
                                t = getComponentNames(e?.Input);
                            if (!t?.NativeIdentityMap_3) return;
                            if (this.nativeIdentityMap = Object.entries(t.NativeIdentityMap_3)?.[0]?.[1], !this.nativeIdentityMap) return
                        }
                        if (t) {
                            const t = Array.from(this.nativeIdentityMap);
                            if (!o.P6.isArrayValid(t)) return;
                            for (const a of t)
                                if (window.action.name) {
                                    if (a[0][window.action.name] === e) return a[1][window.action.wasPressed] = !0, void(a[1][window.action.wasRelesed] = !0)
                                } else getName(window.action, "name", "action.name", a[0], 0), getName(window.action, "wasPressed", "action", a[1], 1), getName(window.action, "wasRelesed", "action", a[1], 2)
                        }
                        o.oQ.responseTime <= a && this.getSupplyByName(e)?.[supplies.onUserActivatedSupply]?.()
                    };
                    suppliesHighPriority = () => {
                        if (this.#e.autoHealingData.state || !1 !== this.temp)
                            for (let e = 0; e < this.#e.autoHealingData.multiply; e++) this.activateSupply("FIRST_AID", !1, this.#e.autoHealingData.delay);
                        if (this.#e.autoMiningData.state || !1 !== this.temp)
                            for (let e = 0; e < this.#e.autoMiningData.multiply; e++) this.activateSupply("MINE", !1, this.#e.autoMiningData.delay)
                    };
                    suppliesLowPriority = () => {
                        this.#e.autoArmorData.state && this.activateSupply("USE_DOUBLE_ARMOR", !0), this.#e.autoDamageData.state && this.activateSupply("USE_DOUBLE_DAMAGE", !0), this.#e.autoNitroData.state && this.activateSupply("USE_NITRO", !0)
                    };
                    process = () => {
                        o.P6.isBindPressed(this.#e.autoHealingData) && (this.#e.autoHealingData.state = !this.#e.autoHealingData.state), o.P6.isBindPressed(this.#e.autoArmorData) && (this.#e.autoArmorData.state = !this.#e.autoArmorData.state), o.P6.isBindPressed(this.#e.autoDamageData) && (this.#e.autoDamageData.state = !this.#e.autoDamageData.state), o.P6.isBindPressed(this.#e.autoNitroData) && (this.#e.autoNitroData.state = !this.#e.autoNitroData.state), o.P6.isBindPressed(this.#e.autoMiningData) && (this.#e.autoMiningData.state = !this.#e.autoMiningData.state)
                    }
                }
            },
            551: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    freezeTank = e => {
                        const t = e.TankPhysicsComponent;
                        t && (o.vc.data.otherData.freezeTanks ? (t[tankPhysicsComponent.body][body.movable] = !1, t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0, t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0, t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.z] = 0, t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.x] = 0, t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.y] = 0, t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0) : t[tankPhysicsComponent.body][body.movable] = !0)
                    };
                    bodyParser = () => {
                        const e = o.P6.getTanks();
                        if (o.P6.isArrayValid(e))
                            for (const t of e) this.freezeTank(t)
                    };
                    process = e => {
                        this.bodyParser(), e && o.vc.data.otherData.autoShot && (e[window.weaponTrigger.pulled] = !0)
                    }
                }
            },
            956: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    #e = o.vc.data.removeMinesData;
                    removeMines;
                    reset = () => {
                        this.removeMines = void 0
                    };
                    process = () => {
                        if (this.removeMines) this.#e.state && this.removeMines();
                        else {
                            let e = 0;
                            const t = getComponentNames(o.UJ.gameMode?.original[0])?.BattleEntity?.[battleEntity.callBacks];
                            if (!o.P6.isArrayValid(t)) return;
                            for (const a of t) {
                                if (signal.functions || (signal.functions = getByIndex(a, 0)?.[0], signal.functions && console.log("[shizoval] signal.functions найден: " + signal.functions)), a?.[signal.functions]?.[nativeList.array])
                                    for (const o of a[signal.functions][nativeList.array])
                                        if (signalBind.callBack || (signalBind.callBack = getByIndex(o, 1)?.[0], signalBind.callBack && console.log("[shizoval] signalBind.callBack найден: " + signalBind.callBack)), "removeMines" === o[signalBind.callBack]?.callableName) return void(this.removeMines = t[e + 5][signal.functions][nativeList.array][0][signalBind.callBack]);
                                e++
                            }
                        }
                    }
                }
            },
            867: (e, t, a) => {
                a.d(t, {
                    Z: () => n
                });
                var o = a(817),
                    i = a(75);
                class n {
                    #r;
                    #o = 500;
                    #l = 0;
                    #e = o.vc.data.stickData;
                    reset = () => {
                        this.#r = void 0, this.#o = 500
                    };
                    stick = e => {
                        this.#r = e
                    };
                    keyHandler = () => {
                        o.P6.getKeyState("KeyW") && (this.#o -= 10), o.P6.getKeyState("KeyS") && (this.#o += 10), this.#o > 3e3 && (this.#o = 3e3), this.#o < -3e3 && (this.#o = -3e3)
                    };
                    nextTarget = () => {
                        let e = o.P6.getTanks();
                        o.P6.isArrayValid(e) && (this.#l >= e.length && (this.#l = 0), this.#r = e[this.#l], this.#l++)
                    };
                    process = e => {
                        if (o.P6.isBindPressed(this.#e.deactivateData) && (this.#r = void 0), o.P6.isBindPressed(this.#e.nextTargetData) && this.nextTarget(), !this.#r || !e) return void(o.Ri.state || (e[tankPhysicsComponent.body][body.movable] = !0));
                        e[tankPhysicsComponent.body][body.movable] = !1;
                        let t = e[tankPhysicsComponent.body][body.state],
                            a = this.#r.TankPhysicsComponent?.[tankPhysicsComponent.body][body.state];
                        if (!t || !a) return;
                        let n = {
                                [vector3.x]: 0,
                                [vector3.y]: 0,
                                [vector3.z]: 0
                            },
                            s = (a[bodyState.orientation][quaternion.getYAxis](n), Math.atan2(n[vector3.y], n[vector3.x]));
                        const r = {
                            x: a[bodyState.position][vector3.x] - this.#o * Math.sin(-(s - Math.PI / 2)),
                            y: a[bodyState.position][vector3.y] - this.#o * Math.cos(-(s - Math.PI / 2)),
                            z: a[bodyState.position][vector3.z] + this.#o
                        };
                        let l = o.P6.isNotKillZone(r);
                        l !== i.W.None && o.P6.outKillZone(r, l), t[bodyState.position][vector3.x] = r.x, t[bodyState.position][vector3.y] = r.y, t[bodyState.position][vector3.z] = r.z, t[bodyState.orientation][quaternion.x] = a[bodyState.orientation][quaternion.x], t[bodyState.orientation][quaternion.y] = a[bodyState.orientation][quaternion.y], t[bodyState.orientation][quaternion.z] = a[bodyState.orientation][quaternion.z], t[bodyState.orientation][quaternion.w] = a[bodyState.orientation][quaternion.w], t[bodyState.angularVelocity][vector3.x] = 0, t[bodyState.angularVelocity][vector3.y] = 0, t[bodyState.angularVelocity][vector3.z] = 0, t[bodyState.velocity][vector3.x] = 0, t[bodyState.velocity][vector3.y] = 0, t[bodyState.velocity][vector3.z] = 0, this.keyHandler()
                    }
                }
            },
            125: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    #i = !1;
                    #e = o.vc.data.weaponData.strikerData;
                    rocketTP = {
                        target: void 0,
                        state: !1,
                        timeout: void 0,
                        teleportToTarget: !1
                    };
                    reset = () => {
                        this.#i = !1, this.rocketTP = {
                            target: void 0,
                            state: !1,
                            timeout: void 0,
                            teleportToTarget: !1
                        }
                    };
                    shellsTeleport = e => {
                        const t = this.#e.shellsTeleportData,
                            a = e[strikerRocketFactory.shellCache][cacheImpl.itemInUse].toArray();
                        if (!o.P6.isArrayValid(a)) return;
                        if (!t.state || !this.rocketTP.target) return;
                        o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body][body.state][bodyState.position];
                        for (const e of a) {
                            const t = e[battleEntity.components][nativeList.array][shellComponents.strikerRocket];
                            t && (strikerRocket.direction || (strikerRocket.direction = getByIndex(t, 10)?.[0], strikerRocket.direction && console.log("[shizoval] strikerRocket.direction найден: " + strikerRocket.direction)), strikerRocket.position || (strikerRocket.position = getByIndex(t, 9)?.[0], strikerRocket.position && console.log("[shizoval] strikerRocket.position найден: " + strikerRocket.position)), t[strikerRocket.direction][vector3.x] = 0, t[strikerRocket.direction][vector3.y] = 0, t[strikerRocket.direction][vector3.z] = 0)
                        }
                        const i = this.rocketTP.target.TankPhysicsComponent?.[tankPhysicsComponent.body][body.state];
                        if (i && (a.length < 8 && (this.rocketTP.state = !1), !0 === this.rocketTP.state || 8 !== a.length || this.rocketTP.timeout || (this.rocketTP.timeout = setTimeout((() => {
                                this.rocketTP.state = !0, this.rocketTP.timeout = void 0
                            }), 2e3)), o.P6.isBindPressed(t) && (this.rocketTP.state = !0), this.rocketTP.state)) {
                            this.rocketTP.timeout && (clearTimeout(this.rocketTP.timeout), this.rocketTP.timeout = void 0);
                            for (const e of a) {
                                const t = e[battleEntity.components][nativeList.array][shellComponents.strikerRocket];
                                t && (t[strikerRocket.position][vector3.x] = i[bodyState.position][vector3.x], t[strikerRocket.position][vector3.y] = i[bodyState.position][vector3.y], t[strikerRocket.position][vector3.z] = i[bodyState.position][vector3.z])
                            }
                        }
                    };
                    process = e => {
                        if (!e) return;
                        if (this.shellsTeleport(e), this.#i) return;
                        let t = getComponentNames(getComponentNames(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.StrikerWeapon)?.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist)?.TargetingSystemImpl)?.SectorDirectionCalculator)?.TargetingSectorsCalculator;
                        (t || (t = getComponentNames(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.StrikerWeapon)?.StrikerTargetingSystem)?.TargetingSystemImpl)?.SectorDirectionCalculator)?.TargetingSectorsCalculator, t)) && (targetingSectorsCalculator.minElevationAngle || (targetingSectorsCalculator.minElevationAngle = getByIndex(t, 1)?.[0], targetingSectorsCalculator.minElevationAngle && console.log("[shizoval] targetingSectorsCalculator.minElevationAngle найден: " + targetingSectorsCalculator.minElevationAngle)), targetingSectorsCalculator.maxElevationAngle || (targetingSectorsCalculator.maxElevationAngle = getByIndex(t, 2)?.[0], targetingSectorsCalculator.maxElevationAngle && console.log("[shizoval] targetingSectorsCalculator.maxElevationAngle найден: " + targetingSectorsCalculator.maxElevationAngle)), t[targetingSectorsCalculator.minElevationAngle] = -1 / 0, t[targetingSectorsCalculator.maxElevationAngle] = 1 / 0, this.#i = !0)
                    }
                }
            },
            842: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    #e = o.vc.data.wallHackData;
                    nameDistance = e => {
                        userTitleComponent.currentAlpha || getName(userTitleComponent, "currentAlpha", "userTitleComponent", e.UserTitleComponent, 10), userTitleComponent.userTitleConfiguration || getName(userTitleComponent, "userTitleConfiguration", "userTitleComponent", e.UserTitleComponent, 13), userTitleComponent.userNameBar || getName(userTitleComponent, "userNameBar", "userTitleComponent", e.UserTitleComponent, 16), userNameBar.renderStage || getName(userNameBar, "renderStage", "userNameBar", e.UserTitleComponent?.[userTitleComponent.userNameBar], 19), renderStage.ordinal || getName(renderStage, "ordinal", "renderStage", e.UserTitleComponent?.[userTitleComponent.userNameBar]?.[userNameBar.renderStage], 1), userTitleConfiguration.name || getName(userTitleConfiguration, "name", "userTitleConfiguration", e.UserTitleComponent?.[userTitleComponent.userTitleConfiguration], 0), e.UserTitleComponent?.[userTitleComponent.userNameBar]?.[userNameBar.renderStage]?.[renderStage.ordinal] && (e.UserTitleComponent[userTitleComponent.currentAlpha] = 1, e.UserTitleComponent[userTitleComponent.userNameBar][userNameBar.renderStage][renderStage.ordinal] = 25)
                    };
                    process = () => {
                        let e = o.P6.getTanks();
                        if (o.P6.isArrayValid(e))
                            for (const t of e) this.nameDistance(t)
                    }
                }
            },
            105: (e, t, a) => {
                a.d(t, {
                    Z: () => n
                });
                var o = a(817),
                    i = a(232);
                class n {
                    packetCounter = 0;
                    lastResponseTime = (new Date).getTime();
                    get responseTime() {
                        return (new Date).getTime() - this.lastResponseTime
                    }
                }
                setInterval((() => {
                    const e = document.getElementsByClassName("ksc-0 BattleHudFpsComponentStyle-container")[0];
                    if (!e || e.childElementCount < 2) return;
                    if (2 === e.childElementCount) {
                        const t = document.createElement("div");
                        t.innerHTML = '<div class="ksc-0 BattleHudFpsComponentStyle-row"><span class="ksc-0 BattleHudFpsComponentStyle-label">PPS: </span><span class="ksc-0 BattleHudFpsComponentStyle-value" id="pps">0</span></div>', e.appendChild(t)
                    }
                    const t = document.getElementById("pps"),
                        a = o.oQ.packetCounter;
                    a <= 10 && (t.style.color = "rgb(14, 157, 240)"), a > 10 && a < 30 && (t.style.color = "rgb(116, 186, 61)"), a >= 30 && a <= 70 && (t.style.color = "rgb(255, 188, 9)"), a > 70 && (t.style.color = "rgb(255, 82, 9)"), t.textContent = a.toString(), o.oQ.packetCounter = 0
                }), 1e3), i.Z.before = function() {
                    o.oQ.packetCounter++
                }, i.Z.after = function(e, t, a) {
                    return o.oQ.responseTime < 5 || (o.oQ.lastResponseTime = (new Date).getTime()), e
                }
            },
            662: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                window.getComponentNames = e => {
                    if ("object" != typeof e && "function" != typeof e) return;
                    const t = {
                        __proto__: {}
                    };
                    for (const [a, o] of Object.entries(e)) {
                        if (Array.isArray(o)) {
                            t[a] = o;
                            continue
                        }
                        if ("function" == typeof o && o.callableName) {
                            t[o.callableName] = e[a];
                            continue
                        }
                        const i = o?.constructor?.$metadata$?.simpleName;
                        if (i)
                            if (t[i])
                                for (let e = 0;; e++) {
                                    const a = `${i}_${e}`;
                                    if (!t[a]) {
                                        t[a] = o;
                                        break
                                    }
                                } else t[i] = o
                    }
                    for (const [a, o] of Object.entries(e.__proto__)) {
                        if (Array.isArray(o)) {
                            t.__proto__[a] = o;
                            continue
                        }
                        if ("function" == typeof o && o.callableName) {
                            t.__proto__[o.callableName] = e[a];
                            continue
                        }
                        const i = o?.constructor?.$metadata$?.simpleName;
                        if (i)
                            if (t.__proto__[i])
                                for (let e = 0;; e++) {
                                    const a = `${i}_${e}`;
                                    if (!t.__proto__[a]) {
                                        t.__proto__[a] = o;
                                        break
                                    }
                                } else t.__proto__[i] = o
                    }
                    return t.original = e, t
                }, window.getByIndex = (e, t) => {
                    if (!e) return;
                    const a = Object.entries(e);
                    return a ? a[t] : void 0
                };
                class i {
                    #d;
                    #m;
                    #c;
                    #p;
                    get root() {
                        if (this.#d) return this.#d;
                        const e = document.getElementById("root");
                        if (!e) return;
                        let t = getComponentNames(e[Object.keys(root)?.find((e => e.includes("_reactContainer")))]?.child?.child?.stateNode);
                        if (t && t.ReactReduxStateWatcher || (t = getComponentNames(e[Object.keys(root)?.find((e => e.includes("_reactContainer")))]?.child?.stateNode)), t && t?.ReactReduxStateWatcher || (t = getComponentNames(e[Object.keys(root)?.find((e => e.includes("_reactContainer")))]?.child?.child?.child?.stateNode)), !t) return;
                        const a = getComponentNames(t.ReactReduxStateWatcher);
                        return a ? (this.#d = getComponentNames(a.Store), getName(rootComponent, "state", "rootComponent", this.#d?.original, 4), (() => {
                            let e = getComponentNames(this.#d?.original?.[rootComponent.state])?.Shop,
                                t = Object.entries(this.#d?.original?.[rootComponent.state] ?? {});
                            window.TOState.shop = t.find((t => t[1] == e))[0]
                        })(), getName(window.shop, "enabled", "shop", this.#d?.original?.[rootComponent.state]?.[TOState.shop], 9), this.#d) : void 0
                    }
                    get world() {
                        if (this.#m) return this.#m;
                        const e = getComponentNames(this.root?.ThreadSafeList?.d_1 ? this.root?.ThreadSafeList?.d_1 : this.root?.ThreadSafeList?.e_1);
                        if (!e) return;
                        const t = getComponentNames(e.ChassisSettingsUpdater);
                        if (!t) return;
                        const a = getComponentNames(t.BattleEntity);
                        return a ? getComponentNames(a.World) : void 0
                    }
                    get gameMode() {
                        if (this.#c && o.P6.isArrayValid(this.#c.original)) return this.#c;
                        const e = this.world?.ArrayList_0?.d_1 ? this.world?.ArrayList_0?.d_1 : this.world?.ArrayList_0?.e_1;
                        if (!e) return;
                        const t = getComponentNames(e[0]);
                        if (!t) return;
                        const a = Object.entries(t.NativeList)?.[0]?.[1];
                        return a ? this.#c = getComponentNames(a) : void 0
                    }
                    get localTank() {
                        if (this.#p && o.P6.isArrayValid(this.#p.original)) return this.#p;
                        const e = getComponentNames(this.root?.ThreadSafeList?.d_1 ? this.root?.ThreadSafeList?.d_1 : this.root?.ThreadSafeList?.e_1);
                        if (!e) return;
                        let t = getComponentNames(e.ChassisSettingsUpdater_0);
                        if (!t && (t = getComponentNames(e.ChassisSettingsUpdater), !t)) return;
                        const a = getComponentNames(t.BattleEntity);
                        if (!a) return;
                        getName(window.battleEntity, "components", "battleEntity", t.BattleEntity, 5), getName(window.battleEntity, "callBacks", "battleEntity", t.BattleEntity, 3);
                        const i = getComponentNames(a.NativeList);
                        return i ? (getName(window.nativeList, "array", "nativeList", a.NativeList, 0), this.#p = getComponentNames(i[window.nativeList.array])) : void 0
                    }
                    reset = () => {
                        this.#d = void 0, this.#c = void 0, this.#p = void 0, this.#m = void 0
                    }
                }
            },
            487: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);
                class i {
                    #u = 0;
                    #y = !1;
                    #h;
                    isOpen = !1;
                    currentTab = 0;
                    tabs = [];
                    constructor() {
                        (async () => {
                            await ImGui.default(), ImGui.CHECKVERSION(), ImGui.CreateContext();
                            const e = ImGui.GetIO();
                            o.Bs.style(), e.Fonts.AddFontDefault();
                            const t = document.getElementById("output") || document.body,
                                a = window.canvas = document.createElement("canvas");
                            t.appendChild(a), a.id = "canvas__imgui", a.tabIndex = 0, a.style.opacity = "0", a.style.position = "absolute", a.style.left = "0px", a.style.right = "0px", a.style.top = "0px", a.style.bottom = "0px", a.style.width = "100%", a.style.height = "100%", a.style.visibility = "hidden", a.style.zIndex = "1000", a.getContext("webgl2", {
                                alpha: !0
                            }) || a.getContext("webgl", {
                                alpha: !0
                            });


                            document.addEventListener("mousedown", (e) => {
                                if (e.button === 2) {
                                    e.preventDefault();
                                    this.onMenuKeyPressed();
                                }
                            });
                        })(), document.addEventListener("keyup", (e => {
                            if (!o.P6.isChatOpen()) {
                                switch (e.code) {
                                    case "Insert":
                                    case "Numpad0":
                                    case "Slash":
                                        this.onMenuKeyPressed();
                                        break;
                                }
                            }
                        }));


                        window.shizoval = () => {
                            this.onMenuKeyPressed();
                        };
                    }

                    openingAnimation = () => {
                        40 !== this.#u ? this.#u += 4 : this.#y = !1
                    };
                    closingAnimation = () => {
                        0 !== this.#u ? this.#u -= 4 : this.#y = !1, this.#y || this.hideMenu()
                    };
                    applyFilter = e => {
                        canvas.style.opacity = e / 40 * 1, root.style.filter = `blur(${.1*e}px) brightness(${1-e/100})`
                    };
                    animationTask = () => {
                        this.#y && requestAnimationFrame(this.animationTask), this.isOpen ? this.openingAnimation() : this.closingAnimation(), this.applyFilter(this.#u)
                    };
                    showMenu = () => {
                        ImGui_Impl.Init(canvas), canvas.style.visibility = "", document.exitPointerLock(), this.#h = requestAnimationFrame(this.process)
                    };
                    hideMenu = () => {
                        cancelAnimationFrame(this.#h), o.vc.saveStates(), ImGui_Impl.Shutdown(), canvas.style.visibility = "hidden"
                    };
                    onMenuKeyPressed = () => {
                        (this.isOpen = !this.isOpen) && this.showMenu(), this.#y = !0, requestAnimationFrame(this.animationTask)
                    };
                    createTabButton = (e, t) => {
                        o.Bs.createActiveButton(e, this.currentTab === t, o.Bs.ImVec2(100, ImGui.GetWindowSize().y / this.tabs.length - 8)) && (this.currentTab = t)
                    };
                    process = e => {
                        this.#h = requestAnimationFrame(this.process), ImGui_Impl.NewFrame(e), ImGui.NewFrame(), ImGui.SetNextWindowSize(o.Bs.ImVec2(850, 310)), ImGui.Begin("Shizoval", null, ImGui.WindowFlags.NoCollapse | ImGui.WindowFlags.NoResize | ImGui), o.Bs.createChild("##ut2f", o.Bs.ImVec2(116, 0), (() => {
                            for (const e of this.tabs) this.createTabButton(e.label, this.tabs.indexOf(e))
                        })), ImGui.SameLine(), o.Bs.createChild("##wqaa", o.Bs.ImVec2(0, 0), (() => {
                            this.tabs[this.currentTab].process()
                        })), ImGui.End(), ImGui.EndFrame(), ImGui.Render(), ImGui_Impl.RenderDrawData(ImGui.GetDrawData())
                    }
                }
            },
            422: (e, t, a) => {
                var o = a(817);

                o.GI.tabs.push({
                    label: "Fly Hack",
                    process: () => {
                        const contentRegionMax = ImGui.GetWindowContentRegionMax();
                        const width = contentRegionMax.x - ImGui.GetCursorPosX();

                        o.Bs.createChild("##crgtj", o.Bs.ImVec2(width, 0), (() => {
                            let airBreakData = o.vc.data.airBreakData;
                            let otherData = o.vc.data.otherData;
                            let clickerData = o.vc.data.clickerData;


                            ImGui.Text("AirBreak");
                            ImGui.SliderInt("Speed##kyxu", o.Bs.access(airBreakData.speedData, "state"), 1, 1000);
                            ImGui.SliderInt("Smooth##bshu", o.Bs.access(airBreakData.smoothData, "state"), 1, 100);
                            ImGui.Text("Type: ");
                            o.Bs.createActiveButton("Default##jzqy", "default" === airBreakData.typeData.state, o.Bs.ImVec2(0, 0)) && (airBreakData.typeData.state = "default");
                            ImGui.SameLine();
                            o.Bs.createActiveButton("AirWalk", "airWalk" === airBreakData.typeData.state, o.Bs.ImVec2(0, 0)) && (airBreakData.typeData.state = "airWalk");
                            ImGui.SameLine();
                            o.Bs.createActiveButton("Simple", "noob" === airBreakData.typeData.state, o.Bs.ImVec2(0, 0)) && (airBreakData.typeData.state = "noob");
                            ImGui.Checkbox("Limiting Kill Zones", o.Bs.access(airBreakData.killZoneData, "state"));
                            ImGui.Checkbox("Flip", o.Bs.access(airBreakData, "flip"));
                            ImGui.Checkbox("Tilt", o.Bs.access(airBreakData, "tilt"));
                        }), "AirBreak");
                    }
                });

                o.GI.tabs.push({
                    label: "Other Hacks",
                    process: () => {
                        const contentRegionMax = ImGui.GetWindowContentRegionMax();
                        const width = contentRegionMax.x - ImGui.GetCursorPosX();

                        o.Bs.createChild("##other", o.Bs.ImVec2(width, 0), (() => {
                            let otherData = o.vc.data.otherData;


                            ImGui.Checkbox("Automatic shooting", o.Bs.access(otherData, "autoShot"));
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("Your weapon will shoot automatically.");
                            ImGui.Separator();
                            ImGui.Checkbox("Rocket teleport", o.Bs.access(o.vc.data.weaponData.strikerData.shellsTeleportData, "state"));
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("If the rockets are stuck and nothing happens, press the [R] key.");
                            ImGui.Separator();
                            ImGui.Checkbox("Remove mines", o.Bs.access(o.vc.data.removeMinesData, "state"));
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("Removes all mines on the map (FPS UP)");
                            ImGui.Separator();
                            ImGui.Checkbox("GTA Camera", o.Bs.access(o.vc.data.cameraData, "state"));
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("A third-person camera like in GTA. Distance key [V]");
                            ImGui.Separator();
                            ImGui.Checkbox("Freeze Tanks", o.Bs.access(otherData, "freezeTanks"));
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("Disabling the tank drop");
                            ImGui.Separator();
                            ImGui.SliderFloat("FOV##gajd", o.Bs.access(o.vc.data.cameraData, "fov"), 1.04, 2);
                            ImGui.SameLine();
                            o.Bs.ShowHelpMarker("Change the camera fov");
                        }), "Other");
                    }
                });

                o.GI.tabs.push({
                    label: "Clicker",
                    process: () => {
                        const contentRegionMax = ImGui.GetWindowContentRegionMax();
                        const width = contentRegionMax.x - ImGui.GetCursorPosX();

                        o.Bs.createChild("##clicker", o.Bs.ImVec2(width, 0), (() => {
                            let clickerData = o.vc.data.clickerData;

                            ImGui.Text("Supplie Clicker");
                            ImGui.Checkbox("Armor", o.Bs.access(clickerData.autoArmorData, "state"));
                            ImGui.Checkbox("Damage", o.Bs.access(clickerData.autoDamageData, "state"));
                            ImGui.Checkbox("Nitro", o.Bs.access(clickerData.autoNitroData, "state"));
                            ImGui.Checkbox("Mine", o.Bs.access(clickerData.autoMiningData, "state"));
                            if (clickerData.autoMiningData.state) {
                                ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                                ImGui.SliderInt("Delay##oer3", o.Bs.access(clickerData.autoMiningData, "delay"), 5, 50);
                                ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                                ImGui.SliderInt("Multiply##zxaq1", o.Bs.access(clickerData.autoMiningData, "multiply"), 1, 10);
                            }
                            ImGui.Checkbox("First aid kit", o.Bs.access(clickerData.autoHealingData, "state"));
                            if (clickerData.autoHealingData.state) {
                                ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                                ImGui.SliderInt("Delay##jypy", o.Bs.access(clickerData.autoHealingData, "delay"), 5, 50);
                                ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                                ImGui.SliderInt("Multiply##it401", o.Bs.access(clickerData.autoHealingData, "multiply"), 1, 10);
                            }
                        }), "Clicker");
                    }
                });
            },
            229: (e, t, a) => {
                var o = a(817);
                let i = {
                    tank: null,
                    name: "Not selected"
                };
                o.GI.tabs.push({
                    label: "Other tanks",
                    process: () => {
                        o.Bs.createChild("##rl2kf", o.Bs.ImVec2(350, 185), (() => {
                            let e = o.P6.getTanks();
                            if (o.P6.isArrayValid(e))
                                for (const t of e) {
                                    if (o.P6.isTankEnemy(t)) continue;
                                    let e = t.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                                    "string" == typeof e && ImGui.Selectable(e, i.tank === t) && (i.tank = t, i.name = e)
                                }
                        }), "My team"), ImGui.SameLine(), o.Bs.createChild("##c937", o.Bs.ImVec2(0, 185), (() => {
                            let e = o.P6.getTanks(!0);
                            if (o.P6.isArrayValid(e))
                                for (const t of e) {
                                    let e = t.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                                    "string" == typeof e && ImGui.Selectable(e, i.tank === t) && (i.tank = t, i.name = e)
                                }
                        }), "Enemy team"), o.Bs.createChild("##5vge", o.Bs.ImVec2(0, 0), (() => {
                            if (!i.tank) return i.tank = null, void(i.name = "Not selected");
                            ImGui.Button("Set target for Rocket Teleport", o.Bs.ImVec2(675, 30)) && (o.vR.rocketTP.target = i.tank)
                        }), "string" == typeof i.name ? i.name : "Not selected")
                    }
                })
            },
            500: (e, t, a) => {
                var o = a(817);
                const i = {
                        function: "Not selected"
                    },
                    n = (e, t = o.Bs.ImVec2(0, 0)) => {
                        o.Bs.createActiveButton(e, i.function === e, t) && (i.function = e)
                    };
                o.GI.tabs.push({
                    label: "Binds",
                    process: () => {
                        o.Bs.createChild("##peh32", o.Bs.ImVec2(0, 185), (() => {
                            (e => {
                                let t;
                                switch (e) {
                                    case "AirBreak":
                                        t = o.vc.data.airBreakData, o.Bs.bindKey("Forward", o.Bs.ImVec2(675, 20), t.movementData.forward.bind), o.Bs.bindKey("Back", o.Bs.ImVec2(675, 20), t.movementData.back.bind), o.Bs.bindKey("Left", o.Bs.ImVec2(675, 20), t.movementData.left.bind), o.Bs.bindKey("Right", o.Bs.ImVec2(675, 20), t.movementData.right.bind), o.Bs.bindKey("Up", o.Bs.ImVec2(675, 20), t.movementData.up.bind), o.Bs.bindKey("Down", o.Bs.ImVec2(675, 20), t.movementData.down.bind), o.Bs.bindKey("Toggle state", o.Bs.ImVec2(675, 20), t.toggleStateData.bind), o.Bs.bindKey("Type: default", o.Bs.ImVec2(675, 20), t.typeData.default.bind), o.Bs.bindKey("Type: airWalk", o.Bs.ImVec2(675, 20), t.typeData.airWalk.bind), o.Bs.bindKey("Type: simple", o.Bs.ImVec2(675, 20), t.typeData.simple.bind), o.Bs.bindKey("Speed +", o.Bs.ImVec2(675, 20), t.speedData.inc.bind), o.Bs.bindKey("Speed -", o.Bs.ImVec2(675, 20), t.speedData.dec.bind), o.Bs.bindKey("Smooth +", o.Bs.ImVec2(675, 20), t.smoothData.inc.bind), o.Bs.bindKey("Smooth -", o.Bs.ImVec2(675, 20), t.smoothData.dec.bind), o.Bs.bindKey("Limiting Kill Zones", o.Bs.ImVec2(675, 20), t.killZoneData.bind);
                                        break;
                                    case "Sync":
                                        t = o.vc.data.syncData, o.Bs.bindKey("Avoid rockets", o.Bs.ImVec2(675, 20), t.antiStrikerData.bind), o.Bs.bindKey("Anti-Aim", o.Bs.ImVec2(675, 20), t.randomTeleportData.bind), o.Bs.bindKey("Avoid mines", o.Bs.ImVec2(675, 20), t.antiMineData.bind);
                                        break;
                                    case "Clicker":
                                        t = o.vc.data.clickerData, o.Bs.bindKey("Armor", o.Bs.ImVec2(675, 20), t.autoArmorData.bind), o.Bs.bindKey("Damage", o.Bs.ImVec2(675, 20), t.autoDamageData.bind), o.Bs.bindKey("Nitro", o.Bs.ImVec2(675, 20), t.autoNitroData.bind), o.Bs.bindKey("Mine", o.Bs.ImVec2(675, 20), t.autoMiningData.bind), o.Bs.bindKey("Healing", o.Bs.ImVec2(675, 20), t.autoHealingData.bind);
                                        break;
                                    case "Striker":
                                        t = o.vc.data.weaponData.strikerData, o.Bs.bindKey("AimBot", o.Bs.ImVec2(675, 20), t.aimBotData.bind), o.Bs.bindKey("Shells teleport", o.Bs.ImVec2(675, 20), t.shellsTeleportData.bind), o.Bs.bindKey("Get a target for the aimbot with the scope", o.Bs.ImVec2(675, 20), t.getTargetForAimWithScope.bind), o.Bs.bindKey("Get a teleport target with a scope", o.Bs.ImVec2(675, 20), t.getTargetForTPWithScope.bind), o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind);
                                        break;
                                    case "Camera":
                                        t = o.vc.data.cameraData, o.Bs.bindKey("Change distance", o.Bs.ImVec2(675, 20), t.bind);
                                        break;
                                    case "Stick":
                                        t = o.vc.data.stickData, o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind), o.Bs.bindKey("Deactivate", o.Bs.ImVec2(675, 20), t.deactivateData.bind);
                                        break;
                                    case "Spectate":
                                        t = o.vc.data.spectateData, o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind), o.Bs.bindKey("Deactivate", o.Bs.ImVec2(675, 20), t.deactivateData.bind)
                                }
                            })(i.function)
                        }), i.function), o.Bs.createChild("##sg391", o.Bs.ImVec2(0, 0), (() => {
                            n("AirBreak", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Sync", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Clicker", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Striker", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Camera", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Stick", o.Bs.ImVec2(90, 30)), ImGui.SameLine(), n("Spectate", o.Bs.ImVec2(90, 30))
                        }), "Functions")
                    }
                })
            },
            580: (e, t, a) => {
                a.d(t, {
                    Z: () => o
                });
                class o {
                    data = {
                        airBreakData: {
                            ID: "2",
                            movementData: {
                                forward: {
                                    bind: {
                                        keys: ["KeyW"],
                                        state: !1
                                    }
                                },
                                back: {
                                    bind: {
                                        keys: ["KeyS"],
                                        state: !1
                                    }
                                },
                                left: {
                                    bind: {
                                        keys: ["KeyA"],
                                        state: !1
                                    }
                                },
                                right: {
                                    bind: {
                                        keys: ["KeyD"],
                                        state: !1
                                    }
                                },
                                up: {
                                    bind: {
                                        keys: ["KeyQ"],
                                        state: !1
                                    }
                                },
                                down: {
                                    bind: {
                                        keys: ["KeyE"],
                                        state: !1
                                    }
                                }
                            },
                            toggleStateData: {
                                bind: {
                                    keys: ["ShiftRight"],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            typeData: {
                                state: "default",
                                default: {
                                    bind: {
                                        keys: [],
                                        pressed: !1,
                                        state: !1
                                    }
                                },
                                airWalk: {
                                    bind: {
                                        keys: [],
                                        pressed: !1,
                                        state: !1
                                    }
                                },
                                simple: {
                                    bind: {
                                        keys: [],
                                        pressed: !1,
                                        state: !1
                                    }
                                }
                            },
                            speedData: {
                                state: 70,
                                inc: {
                                    bind: {
                                        keys: [],
                                        state: !1
                                    }
                                },
                                dec: {
                                    bind: {
                                        keys: [],
                                        state: !1
                                    }
                                }
                            },
                            smoothData: {
                                state: 1,
                                inc: {
                                    bind: {
                                        keys: [],
                                        state: !1
                                    }
                                },
                                dec: {
                                    bind: {
                                        keys: [],
                                        state: !1
                                    }
                                }
                            },
                            killZoneData: {
                                state: !0,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            flip: !1,
                            tilt: !0
                        },
                        removeMinesData: {
                            ID: "0",
                            state: !0,
                            type: "ALL"
                        },
                        noKnockbackData: {
                            ID: "0",
                            mply: 1
                        },
                        otherData: {
                            ID: "2",
                            autoHealingClicker: !1,
                            speedHack: !1,
                            freezeTanks: !0,
                            noCollision: !1,
                            showAlert: !0,
                            autoShot: !1
                        },
                        syncData: {
                            ID: "1",
                            updateInterval: 70,
                            warning: !1,
                            antiStrikerData: {
                                state: !1,
                                type: "Enemy",
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            randomTeleportData: {
                                state: !1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            antiMineData: {
                                state: !1,
                                height: 200,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            }
                        },
                        wallHackData: {
                            ID: "0",
                            tankGlowData: {
                                state: !1,
                                onlyEnemy: !1,
                                colorEnemy: {
                                    dec: 10027085,
                                    rgb: [.6, 0, .3]
                                },
                                colorTarget: {
                                    dec: 6750054,
                                    rgb: [.4, 1, .4]
                                },
                                colorTeam: {
                                    dec: 10066431,
                                    rgb: [.6, .6, 1]
                                }
                            },
                            tankChamsData: {
                                state: !1,
                                onlyEnemy: !1,
                                colorEnemy: [.6, 0, .3, 1],
                                colorTarget: [.4, 1, .4, 1],
                                colorTeam: [.6, .6, 1, 1]
                            }
                        },
                        clickerData: {
                            ID: "1",
                            autoHealingData: {
                                state: !1,
                                delay: 30,
                                multiply: 1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            autoArmorData: {
                                state: !1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            autoDamageData: {
                                state: !1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            autoNitroData: {
                                state: !1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            autoMiningData: {
                                state: !1,
                                delay: 30,
                                multiply: 1,
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            }
                        },
                        weaponData: {
                            ID: "0",
                            strikerData: {
                                aimBotData: {
                                    state: !1,
                                    bind: {
                                        keys: ["KeyN"],
                                        state: !1
                                    }
                                },
                                shellsTeleportData: {
                                    state: !1,
                                    bind: {
                                        keys: ["KeyR"],
                                        state: !1
                                    }
                                },
                                getTargetForAimWithScope: {
                                    state: !1,
                                    bind: {
                                        keys: [],
                                        pressed: !1,
                                        state: !1
                                    }
                                },
                                getTargetForTPWithScope: {
                                    state: !1,
                                    bind: {
                                        keys: [],
                                        pressed: !1,
                                        state: !1
                                    }
                                },
                                nextTargetData: {
                                    bind: {
                                        keys: ["Numpad6"],
                                        pressed: !1,
                                        state: !1
                                    }
                                }
                            }
                        },
                        cameraData: {
                            ID: "1",
                            state: !0,
                            fov: 1.4,
                            bind: {
                                keys: ["KeyV"],
                                pressed: !1,
                                state: !1
                            }
                        },
                        stickData: {
                            ID: "0",
                            nextTargetData: {
                                bind: {
                                    keys: ["Numpad4"],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            deactivateData: {
                                bind: {
                                    keys: ["KeyB"],
                                    pressed: !1,
                                    state: !1
                                }
                            }
                        },
                        spectateData: {
                            ID: "0",
                            nextTargetData: {
                                bind: {
                                    keys: [],
                                    pressed: !1,
                                    state: !1
                                }
                            },
                            deactivateData: {
                                bind: {
                                    keys: ["KeyB"],
                                    pressed: !1,
                                    state: !1
                                }
                            }
                        },
                        filtersData: {
                            ID: "0",
                            blur: 0,
                            brightness: 0,
                            contrast: 0,
                            grayscale: 0,
                            "hue-rotate": 0,
                            invert: 0,
                            saturate: 0,
                            sepia: 0
                        }
                    };
                    clearCookies = () => {
                        for (let e in this.data) localStorage.removeItem(e)
                    };
                    saveState = e => {
                        localStorage.setItem(e, JSON.stringify(this.data[e]))
                    };
                    saveStates = () => {
                        for (let e in this.data) this.saveState(e)
                    };
                    constructor() {
                        for (let e in this.data) {
                            let t = localStorage.getItem(e);
                            t && (t = JSON.parse(t), this.data[e].ID === t.ID) ? this.data[e] = t : (console.error(`[SHIZOVAL] ${(new Date).toJSON().slice(11,19)} - No config found - ${e}`), this.saveState(e))
                        }
                        this.saveStates()
                    }
                }
            },
            600: (e, t, a) => {
                a.r(t), a.d(t, {
                    ImVec2: () => d,
                    ImVec4: () => m,
                    ShowHelpMarker: () => l,
                    access: () => s,
                    bindKey: () => p,
                    createActiveButton: () => i,
                    createChild: () => n,
                    getKeysWindow: () => c,
                    style: () => r
                });
                var o = a(680);
                const n = (e, t, a, o) => {
                        ImGui.BeginChild(e, t, !0, o ? ImGui.WindowFlags.MenuBar : void 0), o && ImGui.BeginMenuBar() && (ImGui.SetCursorPosX(ImGui.GetWindowSize().x / 2 - o.length * ImGui.GetFontSize() / 4), ImGui.TextUnformatted(o), ImGui.EndMenuBar()), a(), ImGui.EndChild()
                    },
                    i = (e, t, a) => {
                        t ? (ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Color(.26, .26, .26)), ImGui.PushStyleColor(ImGui.Col.Text, ImGui.GetStyleColorVec4(ImGui.Col.Text))) : (ImGui.PushStyleColor(ImGui.Col.Button, ImGui.GetStyleColorVec4(ImGui.Col.Button)), ImGui.PushStyleColor(ImGui.Col.Text, ImGui.GetStyleColorVec4(ImGui.Col.TextDisabled)));
                        let o = ImGui.Button(e, a);
                        return ImGui.PopStyleColor(2), o
                    },
                    s = (e, t) => (a = e[t]) => e[t] = a,
                    r = () => {
                        let e = ImGui.GetStyle(),
                            t = ImGui.GetStyle().Colors;
                        e.Alpha = 1, e.WindowPadding.x = 8, e.WindowPadding.y = 8, e.WindowRounding = 3, e.PopupRounding = 3, e.WindowTitleAlign.x = .5, e.WindowTitleAlign.y = .5, e.FramePadding.x = 4, e.FramePadding.y = 3, e.ItemSpacing.x = 8, e.ItemSpacing.y = 5, e.TouchExtraPadding.x = 0, e.TouchExtraPadding.y = 0, e.IndentSpacing = 21, e.ColumnsMinSpacing = 0, e.ScrollbarSize = 6, e.ScrollbarRounding = 0, e.GrabMinSize = 5, e.GrabRounding = 3.3, e.ButtonTextAlign.x = .5, e.ButtonTextAlign.y = .5, e.DisplayWindowPadding.x = 22, e.DisplayWindowPadding.y = 22, e.DisplaySafeAreaPadding.x = 4, e.DisplaySafeAreaPadding.y = 4, e.AntiAliasedLines = !0, e.AntiAliasedFill = !0, e.CurveTessellationTol = 1, t[ImGui.Col.Text] = m(9, 1, 1, 1), t[ImGui.Col.TextDisabled] = m(.3, .31, .34, 0.6), t[ImGui.Col.WindowBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.ChildBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.PopupBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.Border] = m(.0, .0, .0, 0.6), t[ImGui.Col.BorderShadow] = m(0, 0, 0, 0), t[ImGui.Col.FrameBg] = m(.09, .1, .100, 1), t[ImGui.Col.FrameBgHovered] = m(.0, .0, .0, 1), t[ImGui.Col.FrameBgActive] = m(.07, .08, .13, 0), t[ImGui.Col.TitleBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.TitleBgActive] = m(.0, .0, .0, 0.8), t[ImGui.Col.TitleBgCollapsed] = m(.14, .14, .14, 1), t[ImGui.Col.MenuBarBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.ScrollbarBg] = m(.0, .0, .0, 0.6), t[ImGui.Col.ScrollbarGrab] = m(.25, .25, .25, 1), t[ImGui.Col.ScrollbarGrabHovered] = m(.0, .0, .0, 0.6), t[ImGui.Col.ScrollbarGrabActive] = m(.0, .0, .0, 1), t[ImGui.Col.CheckMark] = m(.9, .1, .1, 1), t[ImGui.Col.SliderGrab] = m(.9, .1, .1, 1), t[ImGui.Col.SliderGrabActive] = m(.9, .1, .1, 1), t[ImGui.Col.Button] = m(.0, .0, .0, 0.8), t[ImGui.Col.ButtonHovered] = m(.0, .0, .0, 1), t[ImGui.Col.ButtonActive] = m(.0, .0, .0, 1), t[ImGui.Col.Header] = m(.0, .0, .9, 1), t[ImGui.Col.HeaderHovered] = m(.9, .0, .0, 0.6), t[ImGui.Col.HeaderActive] = m(.9, .0, .0, .6), t[ImGui.Col.Separator] = m(.9, .0, .0, .5), t[ImGui.Col.SeparatorHovered] = m(.9, .0, .0, .5), t[ImGui.Col.SeparatorActive] = m(.9, .0, .0, .5), t[ImGui.Col.ResizeGrip] = m(.9, .0, .0, .25), t[ImGui.Col.ResizeGripHovered] = m(.9, .0, .0, .67), t[ImGui.Col.ResizeGripActive] = m(.0, .0, .0, .6), t[ImGui.Col.Tab] = m(0, 0, 0, 0), t[ImGui.Col.TabHovered] = m(0, 0, 0, 0), t[ImGui.Col.TabActive] = m(.9, .0, .0, 1), t[ImGui.Col.TabUnfocused] = m(.07, .1, .15, .97), t[ImGui.Col.TabUnfocusedActive] = m(.14, .26, .42, 1), t[ImGui.Col.PlotLines] = m(.0, .0, .0, 1), t[ImGui.Col.PlotLinesHovered] = m(1, .43, .35, 1), t[ImGui.Col.PlotHistogram] = m(.9, .7, 0, 1), t[ImGui.Col.PlotHistogramHovered] = m(1, .6, 0, 1), t[ImGui.Col.TextSelectedBg] = m(.9, .25, .25, .5), t[ImGui.Col.DragDropTarget] = m(9, 0, 0, .9), t[ImGui.Col.NavHighlight] = m(.26, .59, .98, 1), t[ImGui.Col.NavWindowingHighlight] = m(1, 1, 1, .7), t[ImGui.Col.NavWindowingDimBg] = m(.8, .8, .8, .2), t[ImGui.Col.ModalWindowDimBg] = m(.9, .0, .0, .35)
                    },
                    l = e => {
                        ImGui.TextDisabled("(?)"), ImGui.IsItemHovered() && (ImGui.BeginTooltip(), ImGui.PushTextWrapPos(35 * ImGui.GetFontSize()), ImGui.TextUnformatted(e), ImGui.PopTextWrapPos(), ImGui.EndTooltip())
                    },
                    d = (e, t) => new ImGui.Vec2(e, t),
                    m = (e, t, a, o = 1) => new ImGui.Vec4(e, t, a, o),
                    c = e => {
                        let t = !1,
                            a = ImGui.GetIO();
                        return ImGui.SetNextWindowSize(d(0, 0)), ImGui.SetNextWindowPos(d(.5 * a.DisplaySize.x, .5 * a.DisplaySize.y), ImGui.Cond.Always, d(.5, .5)), ImGui.SetNextWindowFocus(), ImGui.Begin("press the key", null, ImGui.WindowFlags.NoCollapse | ImGui.WindowFlags.NoResize), ImGui.Text(`Current bind: ${JSON.stringify(e)}`), ImGui.Text(`Pressed keys: ${JSON.stringify(o.kp.keyPresseds)}`), ImGui.Button("OK", d(.3 * ImGui.GetWindowSize().x, 30)) && (t = JSON.parse(JSON.stringify(o.kp.keyPresseds))), ImGui.SameLine(), ImGui.Button("Clear", d(.3 * ImGui.GetWindowSize().x, 30)) && (o.kp.keyPresseds = []), ImGui.SameLine(), ImGui.Button("Cancel", d(.3 * ImGui.GetWindowSize().x, 30)) && (t = !0), ImGui.End(), t
                    },
                    p = (e, t, a) => {
                        if (ImGui.Button(e, t) && (a.state = !0), a.state) {
                            let e = c(a.keys);
                            !1 !== e && (!0 !== e && (a.keys = e), a.state = !1)
                        }
                    }
            },
            680: (e, t, a) => {
                a.d(t, {
                    kp: () => o
                });
                const o = window.kp = new class {
                    keyPresseds = [];
                    constructor() {
                        document.addEventListener("keydown", (e => {
                            !1 === this.keyPresseds.includes(e.code) && this.keyPresseds.push(e.code)
                        })), document.addEventListener("keyup", (e => {
                            if (!0 === this.keyPresseds.includes(e.code)) {
                                let t = this.keyPresseds.indexOf(e.code);
                                t > -1 && this.keyPresseds.splice(t, 1)
                            }
                        }))
                    }
                    isKeyPressed = e => this.keyPresseds.includes(e)
                }
            },
            75: (e, t, a) => {
                a.d(t, {
                    W: () => n,
                    Z: () => r
                });
                var o = a(817),
                    i = a(680);
                const n = {
                        None: 0,
                        LessX: 1,
                        GreaterX: 2,
                        LessY: 4,
                        GreaterY: 8,
                        LessZ: 16,
                        GreaterZ: 32
                    },
                    s = {
                        space: {
                            maxXY: 499,
                            maxZ: 3399,
                            minZ: 99
                        },
                        default: {
                            maxXY: 499,
                            maxZ: 1999,
                            minZ: 99
                        }
                    };
                class r {
                    isArrayPressed = e => {
                        if (!this.isArrayValid(e)) return !1;
                        for (let t of e)
                            if (!this.getKeyState(t)) return !1;
                        return !0
                    };
                    isBindPressed = e => {
                        if (o.GI.isOpen) return !1;
                        let t = e.bind;
                        if ("pressed" in t) {
                            let e = this.isArrayPressed(t.keys);
                            if (!1 === t.pressed) {
                                if (!0 === e) return t.pressed = !0, !0
                            } else if (!0 !== e) return t.pressed = !1, !1;
                            return !1
                        }
                        return this.isArrayPressed(t.keys)
                    };
                    getKeyState = e => i.kp.isKeyPressed(e) && !this.isChatOpen();
                    isChatOpen = () => document.getElementsByTagName("input").length > 0;
                    isArrayValid = e => void 0 !== e && Array.isArray(e) && e.length > 0;
                    getKillZone = e => {
                        if (!e) return;
                        let t = 300 === e[battleMapComponent.gravity] ? s.space : s.default;
                        return {
                            minX: e[battleMapComponent.bounds]?.[aabb.minX] - t.maxXY,
                            minY: e[battleMapComponent.bounds]?.[aabb.minY] - t.maxXY,
                            minZ: e[battleMapComponent.bounds]?.[aabb.minZ] - t.minZ,
                            maxX: e[battleMapComponent.bounds]?.[aabb.maxX] + t.maxXY,
                            maxY: e[battleMapComponent.bounds]?.[aabb.maxY] + t.maxXY,
                            maxZ: e[battleMapComponent.bounds]?.[aabb.maxZ] + t.maxZ,
                            boundMaxZ: e[battleMapComponent.bounds]?.[aabb.maxZ]
                        }
                    };
                    isNotKillZone = e => {
                        let t = o.UJ.gameMode?.BattleMapComponent,
                            a = n.None;
                        if (!t) return a;
                        let i = this.getKillZone(t);
                        return 0 !== e.x && e.x >= i.maxX && (a |= n.GreaterX), 0 !== e.x && e.x <= i.minX && (a |= n.LessX), 0 !== e.y && e.y >= i.maxY && (a |= n.GreaterY), 0 !== e.y && e.y <= i.minY && (a |= n.LessY), 0 !== e.z && e.z >= i.maxZ && (a |= n.GreaterZ), 0 !== e.z && e.z <= i.minZ && (a |= n.LessZ), a
                    };
                    outKillZone = (e, t) => {
                        let a = o.UJ.gameMode?.BattleMapComponent;
                        if (!a) return;
                        let i = this.getKillZone(a);
                        t & n.GreaterX && (e.x = i.maxX), t & n.LessX && (e.x = i.minX), t & n.GreaterY && (e.y = i.maxY), t & n.LessY && (e.y = i.minY), t & n.GreaterZ && (e.z = i.maxZ), t & n.LessZ && (e.z = i.minZ)
                    };
                    isTankEnemy = e => {
                        if (e === o.UJ.localTank) return !1;
                        const t = o.UJ.localTank?.TankComponent?.[tankComponent.team][battleTeam.name];
                        return !t || "NONE" === t || t !== e?.TankComponent?.[tankComponent.team][battleTeam.name]
                    };
                    getTanks = (e = !1) => {
                        const t = o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.[tanksOnFieldRegistryImpl.getTanks]?.()[nativeList.array];
                        if (!this.isArrayValid(t)) return;
                        const a = [];
                        for (const i of t) {
                            const t = getComponentNames(i[battleEntity.components][nativeList.array]);
                            t.original.length !== o.UJ.localTank?.original.length && (e && !this.isTankEnemy(t) || (t.entity = i, a.push(t)))
                        }
                        return a
                    };
                    getTankById = (e, t = !1) => {
                        const a = o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField];
                        if (!a) return;
                        const i = a[tanksOnFieldRegistryImpl.getTankById]?.(e);
                        if (!i) return;
                        const n = getComponentNames(i[battleEntity.components][nativeList.array]);
                        return n.entity = i, n.original.length === o.UJ.localTank?.original.length || t && !this.isTankEnemy(n) ? void 0 : n
                    };
                    getRandomArbitrary = (e, t) => Math.floor(Math.random() * (t - e) + e)
                }
            },
            87: (e, t, a) => {
                a.d(t, {
                    Z: () => i
                });
                var o = a(817);

                function i() {
                    getName(battleChatComponent, "isInputActive", "battleChatComponent", o.UJ.gameMode?.BattleChatComponent, 2), getName(battleMapComponent, "gravity", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 5), getName(battleMapComponent, "bounds", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 8), getName(battleMapComponent, "gameMode", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 21), battleMapComponent.gameMode && battleChatComponent.bounds || (getName(battleMapComponent, "gameMode", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 19), getName(battleMapComponent, "bounds", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 6)), getName(gameMode, "tanksOnField", "gameMode", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode], 8), getName(tanksOnFieldRegistryImpl, "getTanks", "tanksOnFieldRegistryImpl", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.__proto__, 3), getName(tanksOnFieldRegistryImpl, "getTankById", "tanksOnFieldRegistryImpl", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.__proto__, 2), getName(tankPhysicsComponent, "body", "tankPhysicsComponent", o.UJ.localTank?.TankPhysicsComponent, 17), getName(tankPhysicsComponent, "interpolatedPosition", "tankPhysicsComponent", o.UJ.localTank?.TankPhysicsComponent, 8), getName(strikerRocketFactory, "shellCache", "strikerRocketFactory", o.UJ.localTank?.StrikerRocketFactory, 5), getName(cacheImpl, "itemInUse", "cacheImpl", o.UJ.localTank?.StrikerRocketFactory?.[strikerRocketFactory.shellCache], 1), getName(followCamera, "currState", "followCamera", o.UJ.localTank?.FollowCamera, 19), getName(followCamera, "pathPosition", "followCamera", o.UJ.localTank?.FollowCamera, 9), getName(followCamera, "polarDistance", "followCamera", o.UJ.localTank?.FollowCamera, 22), getName(followCamera, "pitch", "followCamera", o.UJ.localTank?.FollowCamera, 23), getName(followCamera, "elevation", "followCamera", o.UJ.localTank?.FollowCamera, 21), getName(followCamera, "pathPointElevation", "followCamera", o.UJ.localTank?.FollowCamera, 14), getName(followCamera, "pathPositionOffset", "followCamera", o.UJ.localTank?.FollowCamera, 11), getName(followCamera, "updatePath", "followCamera", o.UJ.localTank?.FollowCamera?.__proto__, 6), getName(dampedSpring, "value", "dampedSpring", o.UJ.localTank?.FollowCamera?.[followCamera.pitch], 7), getName(dampedSpring, "update", "dampedSpring", o.UJ.localTank?.FollowCamera?.[followCamera.pitch]?.__proto__, 2), getName(followCameraState, "direction", "followCameraState", o.UJ.localTank?.FollowCamera?.[followCamera.currState], 1), getName(trackedChassis, "params", "trackedChassis", o.UJ.localTank?.TrackedChassis, 12), getName(suspensionParams, "maxRayLength", "suspensionParams", o.UJ.localTank?.TrackedChassis?.[trackedChassis.params], 0), getName(tankComponent, "team", "tankComponent", o.UJ.localTank?.TankComponent, 4), getName(battleTeam, "name", "battleTeam", o.UJ.localTank?.TankComponent?.[tankComponent.team], 0), getName(body, "state", "body", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body], 24), getName(body, "movable", "body", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body], 5), getName(supplies, "onUserActivatedSupply", "supplies", o.RB.getSupplyByName("MINE"), 0), getName(bodyState, "velocity", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 0), getName(bodyState, "orientation", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 1), getName(bodyState, "angularVelocity", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 2), getName(bodyState, "position", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 3), getName(vector3, "x", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 0), getName(vector3, "y", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 1), getName(vector3, "z", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 2), getName(quaternion, "w", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 0), getName(quaternion, "x", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 1), getName(quaternion, "y", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 2), getName(quaternion, "z", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 3), getName(quaternion, "fromEulerAngles", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation]?.__proto__, 15), getName(quaternion, "getYAxis", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation]?.__proto__, 12), getName(aabb, "minX", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 0), getName(aabb, "minY", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 1), getName(aabb, "minZ", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 2), getName(aabb, "maxX", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 3), getName(aabb, "maxY", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 4), getName(aabb, "maxZ", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 5), getName(followCameraHeightController, "getTickEnabled", "followCameraHeightController", o.UJ.localTank?.FollowCameraHeightController?.__proto__, 5), getName(localTankStateServerSenderComponent, "needImmediateUpdate", "localTankStateServerSenderComponent", o.UJ.localTank?.LocalTankStateServerSenderComponent, 5), getName(weaponTrigger, "pulled", "weaponTrigger", o.UJ.localTank?.WeaponTrigger, 6)
                }
                window.vector3 = {
                    x: void 0,
                    y: void 0,
                    z: void 0
                }, window.bodyState = {
                    position: void 0,
                    velocity: void 0,
                    angularVelocity: void 0,
                    orientation: void 0
                }, window.quaternion = {
                    w: void 0,
                    x: void 0,
                    y: void 0,
                    z: void 0,
                    fromEulerAngles: void 0,
                    getYAxis: void 0
                }, window.nativeList = {
                    array: void 0
                }, window.strikerRocketFactory = {
                    shellCache: void 0
                }, window.cacheImpl = {
                    itemInUse: void 0
                }, window.shellComponents = {
                    strikerRocket: 1
                }, window.strikerRocket = {
                    direction: void 0,
                    position: void 0
                }, window.battleEntity = {
                    components: void 0,
                    callBacks: void 0
                }, window.tankPhysicsComponent = {
                    body: void 0,
                    interpolatedPosition: void 0
                }, window.body = {
                    state: void 0,
                    movable: void 0
                }, window.targetingSectorsCalculator = {
                    maxElevationAngle: void 0,
                    minElevationAngle: void 0
                }, window.followCamera = {
                    currState: void 0,
                    pathPosition: void 0,
                    polarDistance: void 0,
                    pitch: void 0,
                    elevation: void 0,
                    updatePath: void 0,
                    pathPointElevation: void 0,
                    pathPositionOffset: void 0
                }, window.dampedSpring = {
                    value: void 0,
                    update: void 0
                }, window.followCameraState = {
                    direction: void 0
                }, window.trackedChassis = {
                    params: void 0
                }, window.suspensionParams = {
                    maxRayLength: void 0
                }, window.battleMapComponent = {
                    gravity: void 0,
                    bounds: void 0,
                    gameMode: void 0
                }, window.aabb = {
                    minX: void 0,
                    minY: void 0,
                    minZ: void 0,
                    maxX: void 0,
                    maxY: void 0,
                    maxZ: void 0
                }, window.battleChatComponent = {
                    isInputActive: void 0
                }, window.tankComponent = {
                    team: void 0
                }, window.battleTeam = {
                    name: void 0
                }, window.gameMode = {
                    tanksOnField: void 0
                }, window.tanksOnFieldRegistryImpl = {
                    getTanks: void 0,
                    getTankById: void 0
                }, window.userTitleComponent = {
                    currentAlpha: void 0,
                    userTitleConfiguration: void 0,
                    userNameBar: void 0
                }, window.userNameBar = {
                    renderStage: void 0
                }, window.renderStage = {
                    ordinal: void 0
                }, window.userTitleConfiguration = {
                    name: void 0
                }, window.signal = {
                    functions: void 0
                }, window.signalBind = {
                    callBack: void 0
                }, window.action = {
                    name: void 0,
                    wasPressed: void 0,
                    wasRelesed: void 0
                }, window.supplies = {
                    onUserActivatedSupply: void 0
                }, window.rootComponent = {
                    state: void 0
                }, window.TOState = {
                    shop: void 0
                }, window.shop = {
                    enabled: void 0
                }, window.followCameraHeightController = {
                    getTickEnabled: void 0
                }, window.localTankStateServerSenderComponent = {
                    needImmediateUpdate: void 0
                }, window.weaponTrigger = {
                    pulled: void 0
                }, window.variables = {
                    weaponTrigger: window.weaponTrigger,
                    localTankStateServerSenderComponent: window.localTankStateServerSenderComponent,
                    followCameraHeightController: window.followCameraHeightController,
                    shop: window.shop,
                    TOState: window.TOState,
                    rootComponent: window.rootComponent,
                    supplies: window.supplies,
                    action: window.action,
                    signalBind: window.signalBind,
                    signal: window.signal,
                    userTitleConfiguration: window.userTitleConfiguration,
                    userTitleComponent: window.userTitleComponent,
                    tanksOnFieldRegistryImpl: window.tanksOnFieldRegistryImpl,
                    gameMode: window.gameMode,
                    battleTeam: window.battleTeam,
                    tankComponent: window.tankComponent,
                    battleChatComponent: window.battleChatComponent,
                    aabb: window.aabb,
                    battleMapComponent: window.battleMapComponent,
                    suspensionParams: window.suspensionParams,
                    trackedChassis: window.trackedChassis,
                    followCameraState: window.followCameraState,
                    dampedSpring: window.dampedSpring,
                    followCamera: window.followCamera,
                    targetingSectorsCalculator: window.targetingSectorsCalculator,
                    body: window.body,
                    tankPhysicsComponent: window.tankPhysicsComponent,
                    battleEntity: window.battleEntity,
                    strikerRocket: window.strikerRocket,
                    shellComponents: window.shellComponents,
                    cacheImpl: window.cacheImpl,
                    strikerRocketFactory: window.strikerRocketFactory,
                    nativeList: window.nativeList,
                    quaternion: window.quaternion,
                    bodyState: window.bodyState,
                    vector3: window.vector3,
                    userNameBar: window.userNameBar,
                    renderStage: renderStage
                }, window.getName = function(e, t, a, o, i) {
                    e[t] || (e[t] = getByIndex(o, i)?.[0], e[t] && console.log(`[shizoval] ${a}.${t} найден: ${e[t]}`))
                }
            },
            232: (e, t, a) => {
                a.d(t, {
                    Z: () => s
                });
                let o = {},
                    i = window.WebSocket;
                class n {
                    constructor(e) {
                        this.bubbles = e.bubbles || !1, this.cancelBubble = e.cancelBubble || !1, this.cancelable = e.cancelable || !1, this.currentTarget = e.currentTarget || null, this.data = e.data || null, this.defaultPrevented = e.defaultPrevented || !1, this.eventPhase = e.eventPhase || 0, this.lastEventId = e.lastEventId || "", this.origin = e.origin || "", this.path = e.path || new Array(0), this.ports = e.parts || new Array(0), this.returnValue = e.returnValue || !0, this.source = e.source || null, this.srcElement = e.srcElement || null, this.target = e.target || null, this.timeStamp = e.timeStamp || null, this.type = e.type || "message", this.__proto__ = e.__proto__ || MessageEvent.__proto__
                    }
                }
                window.WebSocket = function(e, t) {
                    let a;
                    this.url = e, this.protocols = t, a = this.protocols ? new i(e, t) : new i(e);
                    var s = a.send;
                    return a.send = function(e) {
                        arguments[0] = o.before(e, a.url, a) || e, s.apply(this, arguments)
                    }, a._addEventListener = a.addEventListener, a.addEventListener = function() {
                        let e = this;
                        var t;
                        return "message" === arguments[0] && (arguments[1] = (t = arguments[1], function() {
                            arguments[0] = o.after(new n(arguments[0]), a.url, a), null !== arguments[0] && t.apply(e, arguments)
                        })), a._addEventListener.apply(this, arguments)
                    }, Object.defineProperty(a, "onmessage", {
                        set: function() {
                            let e = this,
                                t = arguments[0];
                            a._addEventListener.apply(this, ["message", function() {
                                arguments[0] = o.after(new n(arguments[0]), a.url, a), null !== arguments[0] && t.apply(e, arguments)
                            }, !1])
                        }
                    }), a
                };
                const s = o
            },
            817: (e, t, a) => {
                a.d(t, {
                    $l: () => N,
                    Bs: () => f,
                    GI: () => P,
                    P6: () => b,
                    RB: () => B,
                    Ri: () => S,
                    UJ: () => k,
                    oQ: () => D,
                    vR: () => G,
                    vc: () => v
                });
                var o = a(75),
                    i = a(662),
                    n = a(580),
                    s = a(956),
                    r = a(462),
                    l = a(487),
                    d = a(600),
                    m = a(551),
                    c = a(24),
                    p = a(842),
                    u = a(105),
                    y = a(125),
                    h = a(87),
                    g = a(867),
                    C = a(38);
                const b = window.utils = new o.Z,
                    k = window.gameObjects = new i.Z,
                    v = window.config = new n.Z,
                    w = window.removeMines = new s.Z,
                    S = window.airBreak = new r.Z,
                    P = window.menu = new l.Z,
                    f = window.cImGui = d,
                    I = window.other = new m.Z,
                    B = window.clicker = new c.Z,
                    T = window.wallhack = new p.Z,
                    D = window.packetControl = new u.Z,
                    G = window.striker = new y.Z,
                    x = window.stick = new g.Z,
                    N = window.cameraHack = new C.Z,
                    M = () => {
                        S.reset(), w.reset(), B.reset(), G.reset(), N.reset()
                    };
                ! function e() {
                    requestAnimationFrame(e);
                    const t = k.root,
                        a = k.localTank,
                        o = a?.TankPhysicsComponent,
                        i = a?.FollowCamera,
                        n = a?.TrackedChassis,
                        s = a?.StrikerRocketFactory,
                        r = a?.FollowCameraHeightController,
                        l = a?.LocalTankStateServerSenderComponent,
                        d = a?.WeaponTrigger;
                    if (!t) return;
                    const m = k.root?.original?.[rootComponent.state]?.[TOState.shop];
                    return !1 === m?.[window.shop.enabled] && (m[window.shop.enabled] = !0, console.log("[shizoval] Магазин открыт")), k.world?.original ? ((0, h.Z)(), w.process(), I.process(d), T.process(), a && b.isArrayValid(a.original) ? (S.process(o, i, n, l), x.process(o), B.process(), G.process(s), void N.process(i, r)) : M()) : (k.reset(), M())
                }()
            }
        },
        t = {};

    function a(o) {
        var i = t[o];
        if (void 0 !== i) return i.exports;
        var n = t[o] = {
            exports: {}
        };
        return e[o](n, n.exports, a), n.exports
    }
    a.d = (e, t) => {
        for (var o in t) a.o(t, o) && !a.o(e, o) && Object.defineProperty(e, o, {
            enumerable: !0,
            get: t[o]
        })
    }, a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), a.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, a(817), a(662), a(487), a(580), a(600), a(680), a(75), a(87), a(232), a(105), a(422), a(229), a(500), a(462), a(38), a(24), a(551), a(956), a(867), a(125), a(842)
})();

setInterval(() => {
    if (window?.utils?.isChatOpen !== undefined) {
        window.utils.isChatOpen = () => {
            return !!document.querySelector(".BattleChatComponentStyle-container>div");
        }
    }
}, 100);

// Hacks
let originalValues = {};
let intervalId;

function rememberOriginalValues() {
    const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
    const maxSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxSpeedSmootherComponent;
    const simpleValueSmoother = getComponentNames(maxSpeedSmootherComponent)?.SimpleValueSmoother;

    if (simpleValueSmoother) {
        originalValues.variable1 = simpleValueSmoother[Object.keys(simpleValueSmoother)[0]];
        originalValues.variable2 = simpleValueSmoother[Object.keys(simpleValueSmoother)[1]];
        originalValues.variable3 = simpleValueSmoother[Object.keys(simpleValueSmoother)[2]];
        originalValues.variable4 = simpleValueSmoother[Object.keys(simpleValueSmoother)[3]];
    } else {
        console.error("Unable to access SimpleValueSmoother object");
    }
}

function setVariablesTo99999999() {
    rememberOriginalValues();

    intervalId = setInterval(() => {
        const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
        const maxSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxSpeedSmootherComponent;
        const simpleValueSmoother = getComponentNames(maxSpeedSmootherComponent)?.SimpleValueSmoother;

        if (simpleValueSmoother) {
            simpleValueSmoother[Object.keys(simpleValueSmoother)[0]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[1]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[2]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[3]] = 99999999;
        } else {
            console.error("Unable to access SimpleValueSmoother object");
            clearInterval(intervalId);
        }
    }, 1000);
}

function setVariablesToRealValues() {
    clearInterval(intervalId);

    const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
    const maxSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxSpeedSmootherComponent;
    const simpleValueSmoother = getComponentNames(maxSpeedSmootherComponent)?.SimpleValueSmoother;

    if (simpleValueSmoother) {
        simpleValueSmoother[Object.keys(simpleValueSmoother)[0]] = originalValues.variable1;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[1]] = originalValues.variable2;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[2]] = originalValues.variable3;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[3]] = originalValues.variable4;
    } else {
        console.error("Unable to access SimpleValueSmoother object");
    }
}


let originalTurnSpeedValues = {};
let turnSpeedIntervalId;

function rememberOriginalTurnSpeedValues() {
    const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
    const maxTurnSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxTurnSpeedSmootherComponent;
    const simpleValueSmoother = getComponentNames(maxTurnSpeedSmootherComponent)?.SimpleValueSmoother;

    if (simpleValueSmoother) {
        originalTurnSpeedValues.variable1 = simpleValueSmoother[Object.keys(simpleValueSmoother)[0]];
        originalTurnSpeedValues.variable2 = simpleValueSmoother[Object.keys(simpleValueSmoother)[1]];
        originalTurnSpeedValues.variable3 = simpleValueSmoother[Object.keys(simpleValueSmoother)[2]];
        originalTurnSpeedValues.variable4 = simpleValueSmoother[Object.keys(simpleValueSmoother)[3]];
    } else {
        console.error("Unable to access SimpleValueSmoother object for turn speed");
    }
}

function setTurnSpeedVariablesTo99999999() {
    rememberOriginalTurnSpeedValues();

    turnSpeedIntervalId = setInterval(() => {
        const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
        const maxTurnSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxTurnSpeedSmootherComponent;
        const simpleValueSmoother = getComponentNames(maxTurnSpeedSmootherComponent)?.SimpleValueSmoother;

        if (simpleValueSmoother) {
            simpleValueSmoother[Object.keys(simpleValueSmoother)[0]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[1]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[2]] = 99999999;
            simpleValueSmoother[Object.keys(simpleValueSmoother)[3]] = 99999999;
        } else {
            console.error("Unable to access SimpleValueSmoother object for turn speed");
            clearInterval(turnSpeedIntervalId);
        }
    }, 1000);
}

function setTurnSpeedVariablesToRealValues() {
    clearInterval(turnSpeedIntervalId);

    const speedCharacteristicsComponent = getComponentNames(gameObjects.localTank)?.SpeedCharacteristicsComponent;
    const maxTurnSpeedSmootherComponent = getComponentNames(speedCharacteristicsComponent)?.MaxTurnSpeedSmootherComponent;
    const simpleValueSmoother = getComponentNames(maxTurnSpeedSmootherComponent)?.SimpleValueSmoother;

    if (simpleValueSmoother) {
        simpleValueSmoother[Object.keys(simpleValueSmoother)[0]] = originalTurnSpeedValues.variable1;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[1]] = originalTurnSpeedValues.variable2;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[2]] = originalTurnSpeedValues.variable3;
        simpleValueSmoother[Object.keys(simpleValueSmoother)[3]] = originalTurnSpeedValues.variable4;
    } else {
        console.error("Unable to access SimpleValueSmoother object for turn speed");
    }
}



let originalRailgunAimValues = {};
let railgunAimIntervalId;

function rememberOriginalRailgunAimValues() {
    const aim = getComponentNames(gameObjects.localTank.RailgunTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];

    if (aim && params) {
        originalRailgunAimValues.paramValue = params[Object.keys(params)[0]];
        originalRailgunAimValues.aimValue = aim[Object.keys(aim)[3]];
    } else {
        console.error("Unable to access RailgunTargetingSystem or TargetingSystemWithHorizontalAimAssist");
    }
}

function setRailgunAimVariables() {
    rememberOriginalRailgunAimValues();

    railgunAimIntervalId = setInterval(() => {
        const aim = getComponentNames(gameObjects.localTank.RailgunTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
        const params = aim[Object.keys(aim)[1]];
        const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.RailgunTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

        if (aim && params && angle) {
            params[Object.keys(params)[0]] = 999;
            aim[Object.keys(aim)[3]] = true;
            angle[Object.keys(angle)[1]] = -1 / 0;
            angle[Object.keys(angle)[2]] = 1 / 0;
        } else {
            console.error("Unable to access RailgunTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
            clearInterval(railgunAimIntervalId);
        }
    }, 1000);
}

function setRailgunAimVariablesToRealValues() {
    clearInterval(railgunAimIntervalId);

    const aim = getComponentNames(gameObjects.localTank.RailgunTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];
    const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.RailgunTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

    if (aim && params && angle) {
        params[Object.keys(params)[0]] = originalRailgunAimValues.paramValue;
        aim[Object.keys(aim)[3]] = originalRailgunAimValues.aimValue;
    } else {
        console.error("Unable to access RailgunTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
    }
}



let originalAimValues = {};
let aimIntervalId;

function rememberOriginalAimValues() {
    const aim = getComponentNames(gameObjects.localTank.ShaftTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];

    if (aim && params) {
        originalAimValues.paramValue = params[Object.keys(params)[0]];
        originalAimValues.aimValue = aim[Object.keys(aim)[3]];
    } else {
        console.error("Unable to access ShaftTargetingSystem or TargetingSystemWithHorizontalAimAssist");
    }
}

function setAimVariables() {
    rememberOriginalAimValues();

    aimIntervalId = setInterval(() => {
        const aim = getComponentNames(gameObjects.localTank.ShaftTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
        const params = aim[Object.keys(aim)[1]];
        const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.ShaftTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

        if (aim && params && angle) {
            params[Object.keys(params)[0]] = 999;
            aim[Object.keys(aim)[3]] = true;
            angle[Object.keys(angle)[1]] = -1 / 0;
            angle[Object.keys(angle)[2]] = 1 / 0;
        } else {
            console.error("Unable to access ShaftTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
            clearInterval(aimIntervalId);
        }
    }, 1000);
}

function setAimVariablesToRealValues() {
    clearInterval(aimIntervalId);

    const aim = getComponentNames(gameObjects.localTank.ShaftTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];
    const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.ShaftTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

    if (aim && params && angle) {
        params[Object.keys(params)[0]] = originalAimValues.paramValue;
        aim[Object.keys(aim)[3]] = originalAimValues.aimValue;
    } else {
        console.error("Unable to access ShaftTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
    }
}



let originalStrikerAimValues = {};
let strikerAimIntervalId;

function rememberOriginalStrikerAimValues() {
    const aim = getComponentNames(gameObjects.localTank.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];

    if (aim && params) {
        originalStrikerAimValues.paramValue = params[Object.keys(params)[0]];
        originalStrikerAimValues.aimValue = aim[Object.keys(aim)[3]];
    } else {
        console.error("Unable to access StrikerTargetingSystem or TargetingSystemWithHorizontalAimAssist");
    }
}

function setStrikerAimVariables() {
    rememberOriginalStrikerAimValues();

    strikerAimIntervalId = setInterval(() => {
        const aim = getComponentNames(gameObjects.localTank.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
        const params = aim[Object.keys(aim)[1]];
        const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.StrikerTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

        if (aim && params && angle) {
            params[Object.keys(params)[0]] = 999;
            aim[Object.keys(aim)[3]] = true;
            angle[Object.keys(angle)[1]] = -1 / 0;
            angle[Object.keys(angle)[2]] = 1 / 0;
        } else {
            console.error("Unable to access StrikerTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
            clearInterval(strikerAimIntervalId);
        }
    }, 1000);
}

function setStrikerAimVariablesToRealValues() {
    clearInterval(strikerAimIntervalId);

    const aim = getComponentNames(gameObjects.localTank.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
    const params = aim[Object.keys(aim)[1]];
    const angle = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.StrikerTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;

    if (aim && params && angle) {
        params[Object.keys(params)[0]] = originalStrikerAimValues.paramValue;
        aim[Object.keys(aim)[3]] = originalStrikerAimValues.aimValue;
    } else {
        console.error("Unable to access StrikerTargetingSystem, TargetingSystemWithHorizontalAimAssist, or TargetingSectorsCalculator");
    }
}




let originalGravityValue;

function rememberOriginalGravityValue() {
    const Cyclone = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.LocalTankComponent)?.BattleEntity_0)?.World)?.PhysicsScene)?.Vector3;

    if (Cyclone) {
        originalGravityValue = Cyclone[Object.keys(Cyclone)[2]];
    } else {
        console.error("Unable to access Cyclone object");
    }
}

function setGravityValue(newValue) {
    const Cyclone = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.LocalTankComponent)?.BattleEntity_0)?.World)?.PhysicsScene)?.Vector3;

    if (Cyclone) {
        Cyclone[Object.keys(Cyclone)[2]] = parseFloat(newValue);
    } else {
        console.error("Unable to access Cyclone object");
    }
}

function setGravityToRealValue() {
    const Cyclone = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.LocalTankComponent)?.BattleEntity_0)?.World)?.PhysicsScene)?.Vector3;

    if (Cyclone) {
        Cyclone[Object.keys(Cyclone)[2]] = originalGravityValue;
    } else {
        console.error("Unable to access Cyclone object");
    }
}




let customAutoBuyInterval;
let customConvertInterval;

const CustomAutoBuy = function() {
    const customItemCost = prompt("Enter the price of the item:", "24 000");

    function customFindAndClick() {
        const elements = document.getElementsByClassName('ShopItemComponentStyle-footerContent');
        for (let element of elements) {
            if (element.textContent.includes(customItemCost)) {
                element.click();
                break;
            }
        }
    }

    function customConvert() {
        const elements = document.getElementsByClassName('Common-flexStartAlignStart');
        for (let element of elements) {
            const text = element.textContent.trim();
            if (text == 'N') {
                element.click();
                break;
            }
        }
    }

    customAutoBuyInterval = setInterval(customFindAndClick, 0);
    customConvertInterval = setInterval(customConvert, 0);
};

const StopCustomAutoBuy = function() {
    clearInterval(customAutoBuyInterval);
    clearInterval(customConvertInterval);
};




const lootBoxContainer = document.querySelector('.ContainersStyle-lootBoxContent');
let clickingInterval;

function clickElement() {
    let targetElement = document.querySelector("#root > div > div.ContainersStyle-lootBoxContainers > div.ContainersStyle-lootBoxContent > div.ContainersStyle-centerColumn > div.ContainersStyle-centerBlockImage > div");
    targetElement.click();
}

function ultraFastClick() {
    let moreButtonElement = document.querySelector("#root > div > div > div.Common-flexCenterAlignCenter.ClosedContainerStyle-moreButton.Font-bold.Font-normal");
    for (let i = 0; i < 3000; i++) {
        moreButtonElement.click();
    }
}

function startClicking() {
    clickingInterval = setInterval(ultraFastClick, 0);
}

function stopClicking() {
    clearInterval(clickingInterval);
}

function containerClick() {
    if (lootBoxContainer !== null) {
        clickElement();
        startClicking();
    }
}

function containerStop() {
    stopClicking();
}



// UI




(function() {
    'use strict';
    let isDragging = false;
    let offsetX, offsetY;
    let isSliderDragging = false;
    let isMenuVisible = false;
    let activeTab;
    let gravitySlider;

    function createUI() {
        const container = document.createElement('div');
        container.id = 'cyclone-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.zIndex = '9999';
        container.style.background = 'rgba(0, 0, 0, 0.8)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        container.style.color = '#fff';
        container.style.width = '400px';
        container.style.height = '225px';
        container.style.userSelect = 'none';
        container.style.cursor = 'grab';
        container.style.display = 'none';

        const title = document.createElement('div');
        title.textContent = ' Jawon Xx_Sparky_xX Cyclone';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.style.fontSize = '20px';
        title.style.color = 'blue';
        container.appendChild(title);

        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'tabs-container';
        tabsContainer.style.display = 'flex';
        tabsContainer.style.marginBottom = '10px';

        const hacksTab = createTab('Hacks');
        const clickerTab = createTab('Clicker');
        const helpTab = createTab('Help');

        tabsContainer.appendChild(hacksTab);
        tabsContainer.appendChild(clickerTab);
        tabsContainer.appendChild(helpTab);
        container.appendChild(tabsContainer);

        const hacksContent = document.createElement('div');
        hacksContent.id = 'hacks-content';
        hacksContent.style.maxHeight = '120px';
        hacksContent.style.overflowY = 'auto';
        hacksContent.style.scrollbarWidth = 'thin';

        const speedCheckbox = createCheckbox('Speed Hack', 'speedCheckbox', executeSpeedHackCommands, executeSpeedHackReset);
        const turnSpeedCheckbox = createCheckbox('Turn Speed Hack', 'turnSpeedCheckbox', executeTurnSpeedHackCommands, executeTurnSpeedHackReset);
        const antiaimCheckbox = createCheckbox('Antiaim', 'antiaimCheckbox', executeAntiaimCommands, executeAntiaimReset);
        const railgunAimbotCheckbox = createCheckbox('Railgun Aimbot', 'railgunAimbotCheckbox', executeRailgunAimCommands, executeRailgunAimReset);
        const shaftAimbotCheckbox = createCheckbox('Shaft Aimbot', 'shaftAimbotCheckbox', executeShaftAimCommands, executeShaftAimReset);
        const strikerAimbotCheckbox = createCheckbox('Striker Aimbot', 'strikerAimbotCheckbox', executeStrikerAimCommands, executeStrikerAimReset);
        const containerOpenerCheckbox = createCheckbox('Container Opener', 'containerOpenerCheckbox', toggleContainerOpener, hideContainerOpenerOptions);
        const autoBuyCheckbox = createCheckbox('Auto Buy from Shop', 'autoBuyCheckbox', toggleAutoBuy, hideAutoBuyOptions);
        const gravityCheckbox = createCheckbox('Gravity Hack', 'gravityCheckbox', toggleGravitySlider, hideGravitySlider);
        gravitySlider = createSlider('gravitySlider', -1000, 1000, 0, onGravitySliderChange);

        const sliderValueLabel = document.createElement('div');
        sliderValueLabel.id = 'sliderValueLabel';
        sliderValueLabel.style.textAlign = 'right';
        gravitySlider.addEventListener('input', () => {
            sliderValueLabel.textContent = gravitySlider.value;
        });

        hacksContent.appendChild(speedCheckbox);
        hacksContent.appendChild(turnSpeedCheckbox);
        hacksContent.appendChild(antiaimCheckbox);
        hacksContent.appendChild(railgunAimbotCheckbox);
        hacksContent.appendChild(shaftAimbotCheckbox);
        hacksContent.appendChild(strikerAimbotCheckbox);
        hacksContent.appendChild(containerOpenerCheckbox);
        hacksContent.appendChild(autoBuyCheckbox);
        hacksContent.appendChild(gravityCheckbox);
        hacksContent.appendChild(gravitySlider);
        hacksContent.appendChild(sliderValueLabel);
        container.appendChild(hacksContent);

        const clickerContent = document.createElement('div');
        clickerContent.id = 'clicker-content';
        clickerContent.style.display = 'none';
        clickerContent.style.maxHeight = '120px';
        clickerContent.style.overflowY = 'auto';
        clickerContent.style.scrollbarWidth = 'thin';

        const clickTeamACheckbox = createCheckbox('Click Team A', 'clickTeamACheckbox', clickTeamA);
        const clickTeamBCheckbox = createCheckbox('Click Team B', 'clickTeamBCheckbox', clickTeamB);
        const clickDMCheckbox = createCheckbox('Click DM', 'clickDMCheckbox', clickDM);
        const clickAnyTeamCheckbox = createCheckbox('Click Any Team', 'clickAnyTeamCheckbox', clickAnyTeam);

        clickerContent.appendChild(clickTeamACheckbox);
        clickerContent.appendChild(clickTeamBCheckbox);
        clickerContent.appendChild(clickDMCheckbox);
        clickerContent.appendChild(clickAnyTeamCheckbox);

        container.appendChild(clickerContent);

        const helpContent = document.createElement('div');
        helpContent.id = 'help-content';
        helpContent.style.display = 'none';
        helpContent.innerHTML = 'I hope you have fun with this Cheat, but please utilize it exclusively on the test server. If used on the main server, your account may face a ban. Join our <a href="https://discord.gg/xnPWajQH" target="_blank">Discord</a> server for additional information and top-notch hacks! Also, feel free to join the <a href="https://discord.gg/8TSPw9akzp" target="_blank">Shizoval Discord</a> server  for more hacks , if you have the MalcomX script, avoid using it as its not safe. MalcomX can log your IP and execute code in your browser, so stay safe 😉 and say MalcomX Whore :)';

        container.appendChild(helpContent);

        document.body.appendChild(container);

        container.addEventListener('mousedown', (event) => {
            if (!isSliderDragging) {
                isDragging = true;
                offsetX = event.clientX - container.getBoundingClientRect().left;
                offsetY = event.clientY - container.getBoundingClientRect().top;
                container.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging && !isSliderDragging) {
                const newX = event.clientX - offsetX;
                const newY = event.clientY - offsetY;
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;
                container.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
                container.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        gravitySlider.addEventListener('mousedown', () => {
            isSliderDragging = true;
        });

        document.addEventListener('mousemove', (event) => {
            if (isSliderDragging) {
                event.stopPropagation();
            }
        });

        document.addEventListener('mouseup', () => {
            isSliderDragging = false;
        });

        hacksTab.addEventListener('click', () => {
            toggleTab(hacksTab, hacksContent, clickerContent, helpContent);
        });

        clickerTab.addEventListener('click', () => {
            toggleTab(clickerTab, clickerContent, hacksContent, helpContent);
        });

        helpTab.addEventListener('click', () => {
            toggleTab(helpTab, helpContent, hacksContent, clickerContent);
        });

        activeTab = hacksTab;
        updateTabStyle();
        document.addEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(event) {
        if (event.key === '8') {
            showMenu();
        }
        if (event.key === '9') {
            hideMenu();
        }
    }

    function showMenu() {
        isMenuVisible = true;
        document.getElementById('cyclone-container').style.display = 'block';
    }

    function hideMenu() {
        isMenuVisible = false;
        document.getElementById('cyclone-container').style.display = 'none';
    }

    function toggleGravitySlider() {
        const slider = document.getElementById('gravitySlider');
        const checkbox = document.getElementById('gravityCheckbox');
        slider.style.display = checkbox.checked ? 'block' : 'none';
        document.getElementById('sliderValueLabel').style.display = checkbox.checked ? 'block' : 'none';
        rememberOriginalGravityValue();

        if (checkbox.checked) {
            const LOL = getComponentNames(getComponentNames(getComponentNames(getComponentNames(gameObjects.localTank.LocalTankComponent)?.BattleEntity_0)?.World)?.PhysicsScene)?.Vector3;
            var CurrentGravity = LOL[Object.keys(LOL)[2]];

            const gravityValue = CurrentGravity
            slider.value = gravityValue;
            document.getElementById('sliderValueLabel').textContent = gravityValue;
        } else {
            slider.value = 0;
            document.getElementById('sliderValueLabel').textContent = 0;
        }
    }



    function hideGravitySlider() {
        const slider = document.getElementById('gravitySlider');
        slider.style.display = 'none';
        document.getElementById('sliderValueLabel').style.display = 'none';

        setGravityToRealValue();
    }


    function onGravitySliderChange(value) {

        setGravityValue(value);
    }


    function executeSpeedHackCommands() {
        eval('rememberOriginalValues();');
        eval('setVariablesTo99999999();');
    }

    function executeSpeedHackReset() {
        eval('setVariablesToRealValues();');
    }

    function executeTurnSpeedHackCommands() {
        eval('setTurnSpeedVariablesTo99999999();');
    }

    function executeTurnSpeedHackReset() {
        eval('setTurnSpeedVariablesToRealValues();');
    }

    function executeAntiaimCommands() {}

    function executeAntiaimReset() {}

    function executeRailgunAimCommands() {
        eval('setRailgunAimVariables();');
    }

    function executeRailgunAimReset() {
        eval('setRailgunAimVariablesToRealValues();');
    }

    function executeShaftAimCommands() {
        eval('setAimVariables();');
    }

    function executeShaftAimReset() {
        eval('setAimVariablesToRealValues();');
    }

    function executeStrikerAimCommands() {
        eval('setStrikerAimVariables();');
    }

    function executeStrikerAimReset() {
        eval('setStrikerAimVariablesToRealValues();');
    }

    function clickTeamA() {}

    function clickTeamB() {}

    function clickDM() {}

    function clickAnyTeam() {}

    function toggleContainerOpener() {
        const checkbox = document.getElementById('containerOpenerCheckbox');
        if (checkbox.checked) {
            containerClick();
        } else {}
    }

    function hideContainerOpenerOptions() {
        const checkbox = document.getElementById('containerOpenerCheckbox');
    }

    function toggleAutoBuy() {
        const checkbox = document.getElementById('autoBuyCheckbox');

        if (checkbox.checked) {

            CustomAutoBuy();

        } else {}
    }

    function hideAutoBuyOptions() {
        const checkbox = document.getElementById('autoBuyCheckbox');
    }


    function createTab(label) {
        const tab = document.createElement('div');
        tab.textContent = label;
        tab.style.padding = '10px';
        tab.style.cursor = 'pointer';
        tab.style.color = 'rgb(153, 153, 102)';
        tab.style.borderBottom = '2px solid transparent';
        tab.addEventListener('mouseenter', () => {
            tab.style.borderBottom = '2px solid #fff';
        });
        tab.addEventListener('mouseleave', () => {
            if (tab !== activeTab) {
                tab.style.borderBottom = '2px solid transparent';
            }
        });
        return tab;
    }

    function toggleTab(selectedTab, activeContent, inactiveContent1, inactiveContent2) {
        activeContent.style.display = 'block';
        inactiveContent1.style.display = 'none';
        inactiveContent2.style.display = 'none';
        activeTab = selectedTab;
        updateTabStyle();
    }

    function updateTabStyle() {
        document.getElementById('tabs-container').childNodes.forEach(tab => {
            tab.style.borderBottom = '2px solid transparent';
        });
        activeTab.style.borderBottom = '2px solid red';
    }

    function createCheckbox(label, id, onClick, onUncheck) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.marginBottom = '10px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        checkbox.style.marginRight = '5px';
        checkbox.style.cursor = 'pointer';
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.setAttribute('for', id);
        labelElement.style.fontSize = '16px';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked && typeof onClick === 'function') {
                onClick();
            } else if (!checkbox.checked && typeof onUncheck === 'function') {
                onUncheck();
            }
        });
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(labelElement);
        return checkboxContainer;
    }

    function createSlider(id, min, max, defaultValue, onChange) {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'relative';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = min;
        slider.max = max;
        slider.value = defaultValue;
        slider.style.display = 'none';
        slider.style.width = '75%';
        slider.style.marginTop = '10px';
        slider.style.marginBottom = '10px';
        slider.style.cursor = 'pointer';
        sliderContainer.appendChild(slider);

        const valueLabel = document.createElement('div');
        valueLabel.id = 'sliderValueLabel';
        valueLabel.style.position = 'absolute';
        valueLabel.style.top = '0';
        valueLabel.style.right = '0';
        valueLabel.style.fontSize = '12px';
        valueLabel.style.padding = '5px';
        valueLabel.textContent = defaultValue;
        sliderContainer.appendChild(valueLabel);

        slider.addEventListener('input', () => {
            const value = parseInt(slider.value, 10);
            valueLabel.textContent = value;
            onChange(value);
        });

        return sliderContainer;
    }

    function styleUI() {
        const style = document.createElement('style');
        style.textContent = `
    #cyclone-container {
      font-family: 'Arial', sans-serif;
    }
    input[type="checkbox"] {
      margin-right: 5px;
    }
    #cyclone-container div {
      margin-right: 10px;
    }
    #tabs-container {
      display: flex;
      margin-bottom: 10px;
    }
    #tabs-container div {
      padding: 10px;
      cursor: pointer;
      color: rgb(153, 153, 102);
      border-bottom: 2px solid transparent;
    }
    #tabs-container div:hover {
      border-bottom: 2px solid #fff;
    }
    #tabs-container div.active-tab {
      border-bottom: 2px solid red;
    }
    #hacks-content, #clicker-content {
      max-height: 120px;
      overflow-y: auto;
      scrollbar-width: thin;
    }
    #hacks-content::-webkit-scrollbar, #clicker-content::-webkit-scrollbar {
      width: 5px;
    }
    #hacks-content::-webkit-scrollbar-thumb, #clicker-content::-webkit-scrollbar-thumb {
      background-color: red;
      border-radius: 5px;
    }
    #hacks-content::-webkit-scrollbar-track, #clicker-content::-webkit-scrollbar-track {
      background-color: #2f2f2f;
    }
    #sliderValueLabel {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      padding: 5px;
    }
    #gravitySlider {
  -webkit-appearance: none;
  appearance: none;
  width: 75%;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

#gravitySlider::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: red; /* Set the track color */
  border-radius: 2px;
}

#gravitySlider::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: red; /* Set the thumb color */
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}

#sliderValueLabel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  padding: 5px;
}

  `;
        document.head.appendChild(style);
    }



    function initialize() {
        createUI();
        styleUI();
    }

    initialize();
})();




// Clicker




(function() {
    'use strict';

    var checkbox = document.getElementById('clickTeamACheckbox');

    var intervalId;
    var joinInterval;

    function TeamA() {
        var TeamAButtons = document.querySelectorAll('[class^="ksc-"] .Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin');
        if (TeamAButtons.length > 0) {
            TeamAButtons[0].click();
        }
    }

    function startTeamA() {
        intervalId = setInterval(TeamA, 0);
    }

    function stopTeamA() {
        clearInterval(intervalId);
    }

    function Join() {
        const joinElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter, [class^="ksc-"].HotKey-commonBlockForHotKey, [class^="ksc-"].DialogContainerComponentStyle-enterButton');
        for (let i = 0; i < joinElements.length; i++) {
            if (joinElements[i].innerText.includes('JOIN')) {
                joinElements[i].click();
                break;
            }
        }
    }

    function startJoinInterval() {
        joinInterval = setInterval(Join, 0);
    }

    function stopJoinInterval() {
        clearInterval(joinInterval);
    }

    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                startTeamA();

                startJoinInterval();
            } else {
                stopTeamA();
                stopJoinInterval();
            }
        });
    }

})();




(function() {
    'use strict';

    var teamBCheckbox = document.getElementById('clickTeamBCheckbox');

    var intervalIdB;
    var joinInterval;

    if (teamBCheckbox) {
        teamBCheckbox.addEventListener('change', function() {
            if (teamBCheckbox.checked) {
                startTeamB();

                startJoinInterval();
            } else {
                stopTeamB();
                stopJoinInterval();
            }
        });
    }

    function TeamB() {
        var TeamBButtons = document.querySelectorAll('[class^="ksc-"] .Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin');
        if (TeamBButtons.length > 1) {
            TeamBButtons[1].click();
        }
    }

    function startTeamB() {
        intervalIdB = setInterval(TeamB, 0);
    }

    function stopTeamB() {
        clearInterval(intervalIdB);
    }

    function Join() {
        const joinElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter, [class^="ksc-"].HotKey-commonBlockForHotKey, [class^="ksc-"].DialogContainerComponentStyle-enterButton');
        for (let i = 0; i < joinElements.length; i++) {
            if (joinElements[i].innerText.includes('JOIN')) {
                joinElements[i].click();
                break;
            }
        }
    }

    function startJoinInterval() {
        joinInterval = setInterval(Join, 0);
    }

    function stopJoinInterval() {
        clearInterval(joinInterval);
    }

})();




(function() {
    'use strict';

    var dmCheckbox = document.getElementById('clickDMCheckbox');

    var dmInterval;
    var joinInterval;

    if (dmCheckbox) {
        dmCheckbox.addEventListener('change', function() {
            if (dmCheckbox.checked) {
                startDMInterval();

                startJoinInterval();
            } else {
                stopDMInterval();
                stopJoinInterval();
            }
        });
    }

    function DM() {
        const teamDMElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter');
        for (let i = 0; i < teamDMElements.length; i++) {
            if (teamDMElements[i].innerText.includes('JOIN\nJ')) {
                teamDMElements[i].click();
                break;
            }
        }
    }

    function startDMInterval() {
        dmInterval = setInterval(DM, 0);
    }

    function stopDMInterval() {
        clearInterval(dmInterval);
    }

    function Join() {
        const joinElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter, [class^="ksc-"].HotKey-commonBlockForHotKey, [class^="ksc-"].DialogContainerComponentStyle-enterButton');
        for (let i = 0; i < joinElements.length; i++) {
            if (joinElements[i].innerText.includes('JOIN')) {
                joinElements[i].click();
                break;
            }
        }
    }

    function startJoinInterval() {
        joinInterval = setInterval(Join, 0);
    }

    function stopJoinInterval() {
        clearInterval(joinInterval);
    }

})();




(function() {
    'use strict';

    var anyTeamCheckbox = document.getElementById('clickAnyTeamCheckbox');

    var intervalId;
    var intervalIdB;
    var dmInterval;
    var joinInterval;

    if (anyTeamCheckbox) {
        anyTeamCheckbox.addEventListener('change', function() {
            if (anyTeamCheckbox.checked) {
                startTeamA();
                startTeamB();
                startDMInterval();
                startJoinInterval();
            } else {
                stopTeamA();
                stopTeamB();
                stopDMInterval();
                stopJoinInterval();
            }
        });
    }

    function TeamA() {
        var TeamAButtons = document.querySelectorAll('[class^="ksc-"] .Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin');
        if (TeamAButtons.length > 0) {
            TeamAButtons[0].click();
        }
    }

    function startTeamA() {
        intervalId = setInterval(TeamA, 0);
    }

    function stopTeamA() {
        clearInterval(intervalId);
    }

    function TeamB() {
        var TeamBButtons = document.querySelectorAll('[class^="ksc-"] .Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin');
        if (TeamBButtons.length > 1) {
            TeamBButtons[1].click();
        }
    }

    function startTeamB() {
        intervalIdB = setInterval(TeamB, 0);
    }

    function stopTeamB() {
        clearInterval(intervalIdB);
    }

    function DM() {
        const teamDMElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter');
        for (let i = 0; i < teamDMElements.length; i++) {
            if (teamDMElements[i].innerText.includes('JOIN\nJ')) {
                teamDMElements[i].click();
                break;
            }
        }
    }

    function startDMInterval() {
        dmInterval = setInterval(DM, 0);
    }

    function stopDMInterval() {
        clearInterval(dmInterval);
    }

    function Join() {
        const joinElements = document.querySelectorAll('[class^="ksc-"].Common-flexCenterAlignCenter, [class^="ksc-"].HotKey-commonBlockForHotKey, [class^="ksc-"].DialogContainerComponentStyle-enterButton');
        for (let i = 0; i < joinElements.length; i++) {
            if (joinElements[i].innerText.includes('JOIN')) {
                joinElements[i].click();
                break;
            }
        }
    }

    function startJoinInterval() {
        joinInterval = setInterval(Join, 0);
    }

    function stopJoinInterval() {
        clearInterval(joinInterval);
    }
})();




(function() {
    'use strict';

    const checkbox = document.getElementById('autoBuyCheckbox');

    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                StopCustomAutoBuy();
            }
        });
    }
})();




(function() {
    'use strict';

    const checkbox = document.getElementById('containerOpenerCheckbox');

    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                containerStop();
            }
        });
    }
})();




(function() {
    'use strict';
    const targetURLs = [
        'https://discord.gg/xnPWajQH',
        'https://discord.gg/8TSPw9akzp'
    ];

    targetURLs.forEach(url => {
        const buttons = document.querySelectorAll(`a[href="${url}"]`);
        buttons.forEach(button => {
            button.style.color = 'red';
            button.style.textShadow = '0 0 10px red, 0 0 20px red';
        });
    });
})();



(function() {
    'use strict';

    var antiaimCheckbox = document.getElementById('antiaimCheckbox');

    if (antiaimCheckbox) {
        antiaimCheckbox.addEventListener('change', function() {
            var automoveValue = antiaimCheckbox.checked;

            var evalCommand = 'config.data.automove = ' + automoveValue + ';';
            eval(evalCommand);

        });
    }

})();
