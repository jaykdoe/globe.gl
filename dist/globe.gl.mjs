import { REVISION, Vector2, DirectionalLight, AmbientLight } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import ThreeGlobe from 'three-globe';
import ThreeRenderObjects from 'three-render-objects';
import accessorFn from 'accessor-fn';
import Kapsule from 'kapsule';
import { Group, Tween, Easing } from '@tweenjs/tween.js';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".scene-container .clickable {\r\n  cursor: pointer;\r\n}";
styleInject(css_248z);

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function linkKapsule (kapsulePropName, kapsuleType) {
  var dummyK = new kapsuleType(); // To extract defaults
  dummyK._destructor && dummyK._destructor();
  return {
    linkProp: function linkProp(prop) {
      // link property config
      return {
        "default": dummyK[prop](),
        onChange: function onChange(v, state) {
          state[kapsulePropName][prop](v);
        },
        triggerUpdate: false
      };
    },
    linkMethod: function linkMethod(method) {
      // link method pass-through
      return function (state) {
        var kapsuleInstance = state[kapsulePropName];
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var returnVal = kapsuleInstance[method].apply(kapsuleInstance, args);
        return returnVal === kapsuleInstance ? this // chain based on the parent object, not the inner kapsule
        : returnVal;
      };
    }
  };
}

var _excluded = ["rendererConfig", "waitForGlobeReady"];
var THREE = _objectSpread2(_objectSpread2({}, window.THREE ? window.THREE // Prefer consumption from global THREE, if exists
: {
  AmbientLight: AmbientLight,
  DirectionalLight: DirectionalLight,
  Vector2: Vector2,
  REVISION: REVISION
}), {}, {
  CSS2DRenderer: CSS2DRenderer
});

//

// Expose config from ThreeGlobe
var bindGlobe = linkKapsule('globe', ThreeGlobe);
var linkedGlobeProps = Object.assign.apply(Object, _toConsumableArray(['globeImageUrl', 'bumpImageUrl', 'globeTileEngineUrl', 'globeTileEngineMaxLevel', 'globeCurvatureResolution', 'showGlobe', 'showGraticules', 'showAtmosphere', 'atmosphereColor', 'atmosphereAltitude', 'onGlobeReady', 'pointsData', 'pointLat', 'pointLng', 'pointColor', 'pointAltitude', 'pointRadius', 'pointResolution', 'pointsMerge', 'pointsTransitionDuration', 'arcsData', 'arcStartLat', 'arcStartLng', 'arcStartAltitude', 'arcEndLat', 'arcEndLng', 'arcEndAltitude', 'arcColor', 'arcAltitude', 'arcAltitudeAutoScale', 'arcStroke', 'arcCurveResolution', 'arcCircularResolution', 'arcDashLength', 'arcDashGap', 'arcDashInitialGap', 'arcDashAnimateTime', 'arcsTransitionDuration', 'polygonsData', 'polygonGeoJsonGeometry', 'polygonCapColor', 'polygonCapMaterial', 'polygonSideColor', 'polygonSideMaterial', 'polygonStrokeColor', 'polygonAltitude', 'polygonCapCurvatureResolution', 'polygonsTransitionDuration', 'pathsData', 'pathPoints', 'pathPointLat', 'pathPointLng', 'pathPointAlt', 'pathResolution', 'pathColor', 'pathStroke', 'pathDashLength', 'pathDashGap', 'pathDashInitialGap', 'pathDashAnimateTime', 'pathTransitionDuration', 'heatmapsData', 'heatmapPoints', 'heatmapPointLat', 'heatmapPointLng', 'heatmapPointWeight', 'heatmapBandwidth', 'heatmapColorFn', 'heatmapColorSaturation', 'heatmapBaseAltitude', 'heatmapTopAltitude', 'heatmapsTransitionDuration', 'hexBinPointsData', 'hexBinPointLat', 'hexBinPointLng', 'hexBinPointWeight', 'hexBinResolution', 'hexMargin', 'hexTopCurvatureResolution', 'hexTopColor', 'hexSideColor', 'hexAltitude', 'hexBinMerge', 'hexTransitionDuration', 'hexPolygonsData', 'hexPolygonGeoJsonGeometry', 'hexPolygonColor', 'hexPolygonAltitude', 'hexPolygonResolution', 'hexPolygonMargin', 'hexPolygonUseDots', 'hexPolygonCurvatureResolution', 'hexPolygonDotResolution', 'hexPolygonsTransitionDuration', 'tilesData', 'tileLat', 'tileLng', 'tileAltitude', 'tileWidth', 'tileHeight', 'tileUseGlobeProjection', 'tileMaterial', 'tileCurvatureResolution', 'tilesTransitionDuration', 'particlesData', 'particlesList', 'particleLat', 'particleLng', 'particleAltitude', 'particlesSize', 'particlesSizeAttenuation', 'particlesColor', 'particlesTexture', 'ringsData', 'ringLat', 'ringLng', 'ringAltitude', 'ringColor', 'ringResolution', 'ringMaxRadius', 'ringPropagationSpeed', 'ringRepeatPeriod', 'labelsData', 'labelLat', 'labelLng', 'labelAltitude', 'labelRotation', 'labelText', 'labelSize', 'labelTypeFace', 'labelColor', 'labelResolution', 'labelIncludeDot', 'labelDotRadius', 'labelDotOrientation', 'labelsTransitionDuration', 'htmlElementsData', 'htmlLat', 'htmlLng', 'htmlAltitude', 'htmlElement', 'htmlElementVisibilityModifier', 'htmlTransitionDuration', 'objectsData', 'objectLat', 'objectLng', 'objectAltitude', 'objectRotation', 'objectFacesSurface', 'objectThreeObject', 'customLayerData', 'customThreeObject', 'customThreeObjectUpdate'].map(function (p) {
  return _defineProperty({}, p, bindGlobe.linkProp(p));
})));
var linkedGlobeMethods = Object.assign.apply(Object, _toConsumableArray(['globeMaterial', 'getGlobeRadius', 'getCoords', 'toGeoCoords'].map(function (p) {
  return _defineProperty({}, p, bindGlobe.linkMethod(p));
})));

// Expose config from renderObjs
var bindRenderObjs = linkKapsule('renderObjs', ThreeRenderObjects);
var linkedRenderObjsProps = Object.assign.apply(Object, _toConsumableArray(['width', 'height', 'backgroundColor', 'backgroundImageUrl', 'enablePointerInteraction'].map(function (p) {
  return _defineProperty({}, p, bindRenderObjs.linkProp(p));
})));
var linkedRenderObjsMethods = Object.assign.apply(Object, _toConsumableArray(['lights', 'postProcessingComposer'].map(function (p) {
  return _defineProperty({}, p, bindRenderObjs.linkMethod(p));
})));

//

var globe = Kapsule({
  props: _objectSpread2(_objectSpread2({
    onZoom: {
      triggerUpdate: false
    },
    onGlobeClick: {
      triggerUpdate: false
    },
    onGlobeRightClick: {
      triggerUpdate: false
    },
    pointLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPointClick: {
      triggerUpdate: false
    },
    onPointRightClick: {
      triggerUpdate: false
    },
    onPointHover: {
      triggerUpdate: false
    },
    arcLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onArcClick: {
      triggerUpdate: false
    },
    onArcRightClick: {
      triggerUpdate: false
    },
    onArcHover: {
      triggerUpdate: false
    },
    polygonLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPolygonClick: {
      triggerUpdate: false
    },
    onPolygonRightClick: {
      triggerUpdate: false
    },
    onPolygonHover: {
      triggerUpdate: false
    },
    pathLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPathClick: {
      triggerUpdate: false
    },
    onPathRightClick: {
      triggerUpdate: false
    },
    onPathHover: {
      triggerUpdate: false
    },
    onHeatmapClick: {
      triggerUpdate: false
    },
    onHeatmapRightClick: {
      triggerUpdate: false
    },
    onHeatmapHover: {
      triggerUpdate: false
    },
    hexLabel: {
      triggerUpdate: false
    },
    onHexClick: {
      triggerUpdate: false
    },
    onHexRightClick: {
      triggerUpdate: false
    },
    onHexHover: {
      triggerUpdate: false
    },
    hexPolygonLabel: {
      triggerUpdate: false
    },
    onHexPolygonClick: {
      triggerUpdate: false
    },
    onHexPolygonRightClick: {
      triggerUpdate: false
    },
    onHexPolygonHover: {
      triggerUpdate: false
    },
    tileLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onTileClick: {
      triggerUpdate: false
    },
    onTileRightClick: {
      triggerUpdate: false
    },
    onTileHover: {
      triggerUpdate: false
    },
    particleLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onParticleClick: {
      triggerUpdate: false
    },
    onParticleRightClick: {
      triggerUpdate: false
    },
    onParticleHover: {
      triggerUpdate: false
    },
    labelLabel: {
      triggerUpdate: false
    },
    onLabelClick: {
      triggerUpdate: false
    },
    onLabelRightClick: {
      triggerUpdate: false
    },
    onLabelHover: {
      triggerUpdate: false
    },
    objectLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onObjectClick: {
      triggerUpdate: false
    },
    onObjectRightClick: {
      triggerUpdate: false
    },
    onObjectHover: {
      triggerUpdate: false
    },
    customLayerLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onCustomLayerClick: {
      triggerUpdate: false
    },
    onCustomLayerRightClick: {
      triggerUpdate: false
    },
    onCustomLayerHover: {
      triggerUpdate: false
    },
    pointerEventsFilter: {
      "default": function _default() {
        return true;
      },
      triggerUpdate: false
    },
    lineHoverPrecision: {
      "default": 0.2,
      triggerUpdate: false,
      onChange: function onChange(val, state) {
        state.renderObjs.lineHoverPrecision(val);
        state.renderObjs.pointsHoverPrecision(val);
      }
    },
    globeOffset: {
      "default": [0, 0],
      triggerUpdate: false,
      onChange: function onChange(o, state) {
        return Array.isArray(o) && o.length === 2 && state.renderObjs.viewOffset(o.map(function (v) {
          return -v;
        }));
      }
    }
  }, linkedGlobeProps), linkedRenderObjsProps),
  methods: _objectSpread2(_objectSpread2({
    pauseAnimation: function pauseAnimation(state) {
      var _state$globe;
      if (state.animationFrameRequestId !== null) {
        cancelAnimationFrame(state.animationFrameRequestId);
        state.animationFrameRequestId = null;
      }
      (_state$globe = state.globe) === null || _state$globe === void 0 || _state$globe.pauseAnimation();
      return this;
    },
    resumeAnimation: function resumeAnimation(state) {
      var _state$globe2;
      if (state.animationFrameRequestId === null) {
        this._animationCycle();
      }
      (_state$globe2 = state.globe) === null || _state$globe2 === void 0 || _state$globe2.resumeAnimation();
      return this;
    },
    _animationCycle: function _animationCycle(state) {
      // Frame cycle
      state.renderObjs.tick();
      state.tweenGroup.update();
      state.animationFrameRequestId = requestAnimationFrame(this._animationCycle);
    },
    pointOfView: function pointOfView(state) {
      var geoCoords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var transitionDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var curGeoCoords = getGeoCoords();

      // Getter
      if (geoCoords.lat === undefined && geoCoords.lng === undefined && geoCoords.altitude === undefined) {
        return curGeoCoords;
      } else {
        // Setter
        var finalGeoCoords = Object.assign({}, curGeoCoords, geoCoords);
        ['lat', 'lng', 'altitude'].forEach(function (p) {
          return finalGeoCoords[p] = +finalGeoCoords[p];
        }); // coerce coords to number

        if (!transitionDuration) {
          // no animation
          setCameraPos(finalGeoCoords);
        } else {
          // Avoid rotating more than 180deg longitude
          while (curGeoCoords.lng - finalGeoCoords.lng > 180) curGeoCoords.lng -= 360;
          while (curGeoCoords.lng - finalGeoCoords.lng < -180) curGeoCoords.lng += 360;
          state.tweenGroup.add(new Tween(curGeoCoords).to(finalGeoCoords, transitionDuration).easing(Easing.Cubic.InOut).onUpdate(setCameraPos).start());
        }
        return this;
      }

      //

      function getGeoCoords() {
        return state.globe.toGeoCoords(state.renderObjs.cameraPosition());
      }
      function setCameraPos(_ref5) {
        var lat = _ref5.lat,
          lng = _ref5.lng,
          altitude = _ref5.altitude;
        state.renderObjs.cameraPosition(state.globe.getCoords(lat, lng, altitude));
        state.globe.setPointOfView(state.renderObjs.camera()); // report position to globe
      }
    },
    getScreenCoords: function getScreenCoords(state) {
      var _state$globe3;
      for (var _len = arguments.length, geoCoords = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        geoCoords[_key - 1] = arguments[_key];
      }
      var cartesianCoords = (_state$globe3 = state.globe).getCoords.apply(_state$globe3, geoCoords);
      return state.renderObjs.getScreenCoords(cartesianCoords.x, cartesianCoords.y, cartesianCoords.z);
    },
    toGlobeCoords: function toGlobeCoords(state, x, y) {
      var globeIntersects = state.renderObjs.intersectingObjects(x, y).find(function (d) {
        return (d.object.__globeObjType || d.object.parent.__globeObjType) === 'globe';
      });
      if (!globeIntersects) return null; // coords outside globe

      var _state$globe$toGeoCoo = state.globe.toGeoCoords(globeIntersects.point),
        lat = _state$globe$toGeoCoo.lat,
        lng = _state$globe$toGeoCoo.lng;
      return {
        lat: lat,
        lng: lng
      };
    },
    scene: function scene(state) {
      return state.renderObjs.scene();
    },
    // Expose scene
    camera: function camera(state) {
      return state.renderObjs.camera();
    },
    // Expose camera
    renderer: function renderer(state) {
      return state.renderObjs.renderer();
    },
    // Expose renderer
    controls: function controls(state) {
      return state.renderObjs.controls();
    },
    // Expose controls
    _destructor: function _destructor(state) {
      state.globe._destructor();
      this.pauseAnimation();
      this.pointsData([]);
      this.arcsData([]);
      this.polygonsData([]);
      this.pathsData([]);
      this.heatmapsData([]);
      this.hexBinPointsData([]);
      this.hexPolygonsData([]);
      this.tilesData([]);
      this.particlesData([]);
      this.labelsData([]);
      this.htmlElementsData([]);
      this.objectsData([]);
      this.customLayerData([]);
    }
  }, linkedGlobeMethods), linkedRenderObjsMethods),
  stateInit: function stateInit(_ref6) {
    var rendererConfig = _ref6.rendererConfig,
      _ref6$waitForGlobeRea = _ref6.waitForGlobeReady,
      waitForGlobeReady = _ref6$waitForGlobeRea === void 0 ? true : _ref6$waitForGlobeRea,
      globeInitConfig = _objectWithoutProperties(_ref6, _excluded);
    var globe = new ThreeGlobe(_objectSpread2({
      waitForGlobeReady: waitForGlobeReady
    }, globeInitConfig));
    return {
      globe: globe,
      renderObjs: ThreeRenderObjects({
        controlType: 'orbit',
        rendererConfig: rendererConfig,
        waitForLoadComplete: waitForGlobeReady,
        extraRenderers: [new THREE.CSS2DRenderer()] // Used in HTML elements layer
      }).skyRadius(globe.getGlobeRadius() * 500).showNavInfo(false).objects([globe]) // Populate scene
      .lights([new THREE.AmbientLight(0xcccccc, Math.PI), new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI)]),
      tweenGroup: new Group()
    };
  },
  init: function init(domNode, state) {
    var _this = this;
    // Wipe DOM
    domNode.innerHTML = '';

    // Add relative container
    domNode.appendChild(state.container = document.createElement('div'));
    state.container.style.position = 'relative';

    // Add renderObjs
    var roDomNode = document.createElement('div');
    state.container.appendChild(roDomNode);
    state.renderObjs(roDomNode);

    // inject renderer size on three-globe
    state.globe.rendererSize(state.renderObjs.renderer().getSize(new THREE.Vector2()));

    // set initial distance
    this.pointOfView({
      altitude: 2.5
    });

    // calibrate orbit controls
    var globeR = state.globe.getGlobeRadius();
    var controls = state.renderObjs.controls();
    state.renderObjs.camera().near = 0.05; // less will start causing depth z-fighting issues
    controls.minDistance = globeR + Math.max(0.001, state.renderObjs.camera().near * 1.1); // just above the surface, as much as camera near plane permits
    controls.maxDistance = globeR * 100;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.3;
    controls.zoomToCursor = true;
    controls.addEventListener('change', function () {
      controls.target.setScalar(0); // Keep orbit target on center

      // adjust controls speed based on altitude
      var pov = _this.pointOfView();
      controls.rotateSpeed = pov.altitude * 0.3;
      controls.zoomSpeed = Math.sqrt(pov.altitude) * 0.5;

      // Update three-globe pov when camera moves, for proper hiding of elements
      state.globe.setPointOfView(state.renderObjs.camera());
      state.onZoom && state.onZoom(pov);
    });

    // config renderObjs
    var getGlobeObj = function getGlobeObj(object) {
      var obj = object;
      // recurse up object chain until finding the globe object
      while (obj && !obj.hasOwnProperty('__globeObjType')) {
        obj = obj.parent;
      }
      return obj;
    };
    var dataAccessors = {
      point: function point(d) {
        return d;
      },
      arc: function arc(d) {
        return d;
      },
      polygon: function polygon(d) {
        return d.data;
      },
      path: function path(d) {
        return d;
      },
      heatmap: function heatmap(d) {
        return d;
      },
      hexbin: function hexbin(d) {
        return d;
      },
      hexPolygon: function hexPolygon(d) {
        return d;
      },
      tile: function tile(d) {
        return d;
      },
      particles: function particles(d, intersection) {
        return !intersection || !intersection.hasOwnProperty('index') || d.length <= intersection.index ? d : d[intersection.index];
      },
      label: function label(d) {
        return d;
      },
      object: function object(d) {
        return d;
      },
      custom: function custom(d) {
        return d;
      }
    };
    THREE.REVISION < 155 && (state.renderObjs.renderer().useLegacyLights = false); // force behavior of three < 155
    state.renderObjs.hoverFilter(function (obj) {
      var o = getGlobeObj(obj);

      // ignore non-globe objects
      if (!o) return false;
      var type = o.__globeObjType;
      if (type !== 'globe' && !dataAccessors.hasOwnProperty(type)) return false; // Ignore obj types with no data
      var d = dataAccessors.hasOwnProperty(type) && o.__data ? dataAccessors[type](o.__data) : null;

      // Ignore merged geometry objects that don't have interaction per point
      if (['points', 'hexBinPoints'].some(function (t) {
        return t === type;
      }) && Array.isArray(d)) return false;
      return state.pointerEventsFilter(o, d);
    }).tooltipContent(function (obj, intersection) {
      var objAccessors = {
        point: state.pointLabel,
        arc: state.arcLabel,
        polygon: state.polygonLabel,
        path: state.pathLabel,
        hexbin: state.hexLabel,
        hexPolygon: state.hexPolygonLabel,
        tile: state.tileLabel,
        particles: state.particleLabel,
        label: state.labelLabel,
        object: state.objectLabel,
        custom: state.customLayerLabel
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj && globeObj.__globeObjType;
      return globeObj && objType && objAccessors.hasOwnProperty(objType) && dataAccessors.hasOwnProperty(objType) ? accessorFn(objAccessors[objType])(dataAccessors[objType](globeObj.__data, intersection)) || '' : '';
    }).onHover(function (obj, _, intersection) {
      // Update tooltip and trigger onHover events
      var hoverObjFns = {
        point: state.onPointHover,
        arc: state.onArcHover,
        polygon: state.onPolygonHover,
        path: state.onPathHover,
        heatmap: state.onHeatmapHover,
        hexbin: state.onHexHover,
        hexPolygon: state.onHexPolygonHover,
        tile: state.onTileHover,
        particles: state.onParticleHover,
        label: state.onLabelHover,
        object: state.onObjectHover,
        custom: state.onCustomLayerHover
      };
      var clickObjFns = {
        globe: state.onGlobeClick,
        point: state.onPointClick,
        arc: state.onArcClick,
        polygon: state.onPolygonClick,
        path: state.onPathClick,
        heatmap: state.onHeatmapClick,
        hexbin: state.onHexClick,
        hexPolygon: state.onHexPolygonClick,
        tile: state.onTileClick,
        particles: state.onParticleClick,
        label: state.onLabelClick,
        object: state.onObjectClick,
        custom: state.onCustomLayerClick
      };
      var hoverObj = getGlobeObj(obj);

      // ignore non-recognised obj types
      hoverObj && !hoverObjFns.hasOwnProperty(hoverObj.__globeObjType) && (hoverObj = null);
      if (hoverObj !== state.hoverObj) {
        var prevObjType = state.hoverObj ? state.hoverObj.__globeObjType : null;
        var prevObjData = state.hoverData;
        var objType = hoverObj ? hoverObj.__globeObjType : null;
        var objData = hoverObj ? dataAccessors[objType](hoverObj.__data, intersection) : null;
        if (prevObjType && prevObjType !== objType) {
          // Hover out
          hoverObjFns[prevObjType] && hoverObjFns[prevObjType](null, prevObjData || null);
        }
        if (objType) {
          // Hover in
          hoverObjFns[objType] && hoverObjFns[objType](objData, prevObjType === objType ? prevObjData : null);
        }

        // set pointer if hovered object is clickable
        state.renderObjs.renderer().domElement.classList[objType && clickObjFns[objType] ? 'add' : 'remove']('clickable');
        state.hoverObj = hoverObj;
        state.hoverData = objData;
      }
    }).onClick(function (obj, ev, intersection) {
      if (!obj) return; // ignore background clicks

      // Handle click events on objects
      var objFns = {
        globe: state.onGlobeClick,
        point: state.onPointClick,
        arc: state.onArcClick,
        polygon: state.onPolygonClick,
        path: state.onPathClick,
        heatmap: state.onHeatmapClick,
        hexbin: state.onHexClick,
        hexPolygon: state.onHexPolygonClick,
        tile: state.onTileClick,
        particles: state.onParticleClick,
        label: state.onLabelClick,
        object: state.onObjectClick,
        custom: state.onCustomLayerClick
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj.__globeObjType;
      if (globeObj && objFns.hasOwnProperty(objType) && objFns[objType]) {
        var args = [ev];

        // include click coords
        var point = intersection !== null && intersection !== void 0 && intersection.isVector3 ? intersection : intersection === null || intersection === void 0 ? void 0 : intersection.point;
        if (objType === 'globe') {
          var _this$toGeoCoords = _this.toGeoCoords(point),
            lat = _this$toGeoCoords.lat,
            lng = _this$toGeoCoords.lng;
          args.unshift({
            lat: lat,
            lng: lng
          });
        } else {
          args.push(_this.toGeoCoords(point));
        }
        dataAccessors.hasOwnProperty(objType) && args.unshift(dataAccessors[objType](globeObj.__data, intersection));
        objFns[objType].apply(objFns, args);
      }
    }).onRightClick(function (obj, ev, intersection) {
      if (!obj) return; // ignore background clicks

      // Handle right-click events
      var objFns = {
        globe: state.onGlobeRightClick,
        point: state.onPointRightClick,
        arc: state.onArcRightClick,
        polygon: state.onPolygonRightClick,
        path: state.onPathRightClick,
        heatmap: state.onHeatmapRightClick,
        hexbin: state.onHexRightClick,
        hexPolygon: state.onHexPolygonRightClick,
        tile: state.onTileRightClick,
        particles: state.onParticleRightClick,
        label: state.onLabelRightClick,
        object: state.onObjectRightClick,
        custom: state.onCustomLayerRightClick
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj.__globeObjType;
      if (globeObj && objFns.hasOwnProperty(objType) && objFns[objType]) {
        var args = [ev];

        // include click coords
        var point = intersection !== null && intersection !== void 0 && intersection.isVector3 ? intersection : intersection === null || intersection === void 0 ? void 0 : intersection.point;
        if (objType === 'globe') {
          var _this$toGeoCoords2 = _this.toGeoCoords(point),
            lat = _this$toGeoCoords2.lat,
            lng = _this$toGeoCoords2.lng;
          args.unshift({
            lat: lat,
            lng: lng
          });
        } else {
          args.push(_this.toGeoCoords(point));
        }
        dataAccessors.hasOwnProperty(objType) && args.unshift(dataAccessors[objType](globeObj.__data, intersection));
        objFns[objType].apply(objFns, args);
      }
    });

    //

    // Kick-off renderer
    this._animationCycle();
  }
});

export { globe as default };
