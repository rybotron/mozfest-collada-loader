var container, stats;

var camera, scene, renderer, loader;
var keyLight, fillLight, backLight;
var dae;
var model = 'models/greenhouse.dae';
// var model = 'models/dragon.dae';
// var model = 'models/microscope.dae';


// Check for webGL
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


// Collada Loader
loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( model, function ( collada ) {

	dae = collada.scene;
	skin = collada.skins[ 0 ];

	dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
	dae.updateMatrix();

	init();
	animate();

} );

// Camera Tweener
var camPosition = function( position, time ){
	this.tween = function(){
		TWEEN.removeAll();
		camTweener( position, time );
	};
	return this;
}

function camTweener( newCamPosition, time ) {

	var camCurrentPosition	= camera.position;
	var camCurrentRotation	= camera.rotation;

	tweenPosition = new TWEEN.Tween( camCurrentPosition )
		.to( newCamPosition , time )
		.delay(0)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onUpdate( function() {
			camera.position = camCurrentPosition;
			camera.rotation = camCurrentRotation;
		});

	tweenPosition.start();
}

// Create the scene
function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 4, 4, 8 );

	// Camera Positions for GUI

	camOne = new camPosition( { x: 4, y: 4, z: 8 }, 1000 );
	camTwo = new camPosition( { x: -5, y: 2, z: 10 }, 1000 );
	camThree = new camPosition( { x: 0, y: 3, z: -6}, 1000 );

	scene = new THREE.Scene();

	// Grid

	var size = 14, step = 1;

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

	}

	var grid = new THREE.Line( geometry, material, THREE.LinePieces );
	scene.add( grid );


	// Add the COLLADA

	scene.add( dae );

	// Lights

	keyLight = new THREE.PointLight( 0xffffff, 1.15 );
	keyLight.position.x = 4;
	keyLight.position.y = 4;
	keyLight.position.z = 4;
	scene.add( keyLight );

	fillLight = new THREE.PointLight( 0xffffff, .5 );
	fillLight.position.x = -5;
	fillLight.position.y = 5;
	fillLight.position.z = 7;
	scene.add( fillLight );

	backLight = new THREE.PointLight( 0xffffff, .35 );
	backLight.position.x = 0;
	backLight.position.y = 5;
	backLight.position.z = -10;
	scene.add( backLight );

	// Camera Controls

	controls = new THREE.OrbitControls( camera, container );
	controls.addEventListener( 'change', render );
	controls.minDistance = 0;
	controls.maxDistance = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// GUI
	var gui = new dat.GUI();

	var colladaFolder = gui.addFolder ('Collada Scale')
	colladaFolder.open();

	gui.add(dae.scale, 'x', .002, .01)
		.name('Scale X');
	gui.add(dae.scale, 'y', .002, .01)
		.name('Scale Y');
	gui.add(dae.scale, 'z', .002, .01)
		.name('Scale Z');

	var camFolder = gui.addFolder( 'Camera Positions' );
	camFolder.open();
	camFolder.add( camOne, 'tween' ).name( 'Camera Right' );
	camFolder.add( camTwo, 'tween' ).name( 'Camera Left' );
	camFolder.add( camThree, 'tween' ).name( 'Camera Rear' );


	// Events

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	TWEEN.update();
	controls.update();

}

function render() {

	camera.lookAt( scene.position );
	renderer.render( scene, camera );

}
